<template>
  <div class="flow-add">
    <el-form :model="flowData" :rules="rules" class="flowForm" ref="flowForm" label-width="120px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="flowData.title"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="flow_type">
        <el-select v-model="flowData.flow_type" filterable placeholder="请选择">
          <el-option
            v-for="(val,key) in flowSet.type"
            :key="key"
            :label="val"
            :value="parseInt(key)">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述" prop="comment" v-if="flowData.flow_type == 2 || flowData.flow_type == 3 || flowData.flow_type == 5">
        <editor v-model="flowData.comment"></editor>
      </el-form-item>
      <el-form-item label="需求" prop="requirement" v-else>
        <div  class="requirement-list">
          <el-button type="primary" icon="el-icon-plus" circle @click="selectRequireFun"></el-button>
        <ul>
          <li v-for="item in selectRequirement" :key="item.id"><em>ID:{{item.id}}</em><i>{{item.jira_id}}</i>{{item.title}}</li>
        </ul>
        </div>
        <p class="rq-tips">注：只能选择已评审过的需求！</p>
      </el-form-item>
      <el-form-item label="选择流程" prop="flow">
        <div class="flows">
          <div class="flow-item" v-for="(item,index) in flowSteps" :class="{checked:flowData.flow == item.id}" ref="flow-item" @click="checkFlow(item,index)" :key="item.id">
            <span>{{item.name}}</span>
            <el-checkbox v-model="item.checked" @change="checkFlow(item,index)"></el-checkbox>
            <vuescroll :ops="ops">
              <el-steps>
                <el-step v-for="s in getStepsName(item.flow_base_list)" :title="s.name" :key="s.id"></el-step>
              </el-steps>
            </vuescroll>
          </div>
        </div>
      </el-form-item>
       <el-form-item label="涉及端" prop="platform">
          <el-select v-model="flowData.platform" filterable placeholder="请选择" clearable  multiple>
          <el-option
            v-for="(val,key) in flowSet.platform"
            :key="key"
            :label="val"
            :value="parseInt(key)">
          </el-option>
        </el-select>
       </el-form-item>
      <template v-if="flowData.flow">
      <el-form-item label="开发" prop="development">
        <el-select v-model="flowData.development" filterable placeholder="请选择" clearable multiple>
          <el-option
            v-for="item in userList"
            :key="item.userid"
            :label="item.nickname"
            :value="item.userid">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开发负责人" prop="devManage">
        <el-select v-model="flowData.devManage" filterable placeholder="请选择" clearable  multiple>
          <el-option
            v-for="item in userList"
            :key="item.userid"
            :label="item.nickname"
            :value="item.userid">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="产品" prop="productor">
        <el-select v-model="flowData.productor" filterable placeholder="请选择" clearable  multiple>
          <el-option
            v-for="item in userList"
            :key="item.userid"
            :label="item.nickname"
            :value="item.userid">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="测试" prop="test">
        <el-select v-model="flowData.test" filterable placeholder="请选择" clearable  multiple>
          <el-option
            v-for="item in userList"
            :key="item.userid"
            :label="item.nickname"
            :value="item.userid">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上线依赖" prop="dependence">
        <el-input type="textarea" v-model="flowData.dependence"></el-input>
      </el-form-item>
      </template>
      <el-form-item label=" ">
        <el-button type="primary" @click="commitFlow">提交</el-button>
      </el-form-item>
    </el-form>
    <requirementDialog :isShow="showRequirement" @close="showRequirement = false" @rqData="getRequireData"></requirementDialog>
  </div>
</template>
<script>
import vuescroll from 'vuescroll'
import flowApi from '@/api/flow.js'
import setApi from '@/api/settingType.js'
import editor from '@/components/editor'
import requirementDialog from '@/pages/flow/requirementDialog.vue'
  export default{
    data() {
      return {
        ops: {
          vuescroll: {
            mode: 'slide',
            detectResize: false,
            zooming:false
          },
          scrollPanel: {
            scrollingY:false
          },
          rail: {
             background: '#000',
            opacity: 0,
            size: '6px',
            specifyBorderRadius: false,
            gutterOfEnds: null,
             gutterOfSide: '2px',
            keepShow: false
          },
          bar: {
            showDelay: 500,
            onlyShowBarOnScroll: false,
            keepShow: false,
            background: '#c1c1c1',
            opacity: 1,
            hoverStyle: false,
            specifyBorderRadius: false,
            minSize: false,
            size: '6px'
          }
        },
        flowData:{
          requirement:'',
          title:'',
          flow:'',
          platform:[],
          dependence:'',
          development:'',
          devManage:'',
          productor:'',
          test:'',
          flow_type:1,
          comment:''
        },
        flowSet:{
          type:'',
          platform:''
        },
        flowChecked:[false],
        flowSteps:[],
        stepDatas:[],
        showRequirement:false,
        selectRequirement:[],
        flowComment:[],
        rules:{
          requirement:[
            { required: true, message: '请选择需求', trigger: 'change' }
          ],
          flow_type:[
            { required: true, message: '请选择流程类型', trigger: 'change' }
          ],
          flow:[
            { required: true, message: '请选择流程', trigger: 'change' }
          ],
          comment:[
            { required: true, message: '请填写描述', trigger: 'change' }
          ],
          title:[
            { required: true, message: '请填写标题', trigger: 'change' }
          ],
          platform:[
            { required: true, message: '请填选择涉及端', trigger: 'change' }
          ],
          development:[
            { required: true, message: '请填写开发', trigger: 'blur' }
          ],
          devManage:[
            { required: true, message: '请填写开发管理', trigger: 'blur' }
          ],
          productor:[
            { required: true, message: '请填写产品', trigger: 'blur' }
          ],
          test:[
            { required: true, message: '请填写测试', trigger: 'blur' }
          ],
        }
      }
    },
    components:{
      vuescroll,
      requirementDialog,
      editor
    },
    computed: {
      projectId () {
        return parseInt(this.$route.params.projectId)
      },
      userList(){
        return this.$store.state.project.userList
      },
    },
    methods:{
      checkFlow(item,index) {
        if(this.flowData.flow && this.flowData.flow == item.id){
          this.flowSteps[index].checked = !this.flowSteps[index].checked
        }else{
          this.flowSteps.forEach((item,In)=>{
            if(In != index){
              item.checked = false
            }
          })
          this.flowSteps[index].checked = true
        }
        if(this.flowSteps[index].checked){
          this.flowData.flow = item.id
        }else{
          this.flowData.flow = ''
        }
      },
      commitFlow() {
        this.$refs.flowForm.validate((valid) => {
          if (valid) {
            let params = {
              name:this.flowData.title,
              requirement_list:this.flowData.requirement,
              flow_assemble_id:this.flowData.flow,
              project_id:this.projectId,
              user_dev:this.flowData.development,
              user_owner:this.flowData.devManage,
              user_prod:this.flowData.productor,
              user_test:this.flowData.test,
              flow_type:this.flowData.flow_type,
              platform:this.flowData.platform,
              dependence:this.flowData.dependence,
            }
            if(this.flowData.flow_type == 1||this.flowData.flow_type == 4||this.flowData.flow_type == 6){
              params.comment = JSON.stringify(this.flowComment)
            }else{
              params.comment = this.flowData.comment
            }
            flowApi.addFlow(params).then(res=>{
              let data = res.data.data[0]
              this.$message.success('创建成功！')
              this.$router.push({
                name:'flowDetail',
                params:{
                  'flowId':data.flow_id
                }
              })
            },error=>{
              this.$message.error(`创建失败:${error.message}`)
            })
          }else{
            this.$message.warning('请填写必填字段！')
          }
        })
      },
      getFlowSteps(){
        flowApi.getFlowSteps().then(res=>{
          let data =  res.data.data
          this.flowSteps =  data.map(item =>{
            item.checked = false
            return item
          })
        },error=>{
          console.log('获取流程步骤失败！')
        })
      },
      getStepDatas(){
        flowApi.getStepData().then(res=>{
          this.stepDatas = res.data.data
        },error=>{
          console.log('获取步骤数据失败！')
        })
      },
      getStepsName(flowStep){
        let stepsId = []
        let stepsName = []
        if(flowStep.length>0){
          stepsId = flowStep.split(',')
          stepsName = this.stepDatas.filter(item => {
            if(stepsId.indexOf(item.id.toString())!= -1){
              return item
            }
          })
        }
        return stepsName
      },
      selectRequireFun(){
        this.showRequirement = true
      },
      getRequireData(rqId,rqData){
        this.flowData.requirement = rqId
        this.selectRequirement = rqData
        this.flowComment = this.selectRequirement.map(item=>{
          let rItem = {
            id:item.id,
            title:item.title,
            jira_id:item.jira_id,
            description:item.description
          }
          return rItem
        })
        console.log('flowcomment',this.flowComment)
      },
      getFlowSet(){
        setApi.getFlowSet().then(res=>{
          this.flowSet = res.data.data
        })
      }
    },
    created(){
      this.getFlowSet()
      this.getFlowSteps()
      this.getStepDatas()
    }
  }
</script>
<style lang="scss">
.flow-add{
  .el-form-item__content{
    width:50%;
  }
  .el-step__head{
    width:auto;
  }
  .el-step__line{
    display:none;
  }
  .el-step__title{
    font-size:14px;
    line-height:1;
    padding:0 8px;
    position:relative;
    background-color:#fff;
    white-space: nowrap;
    &::after{
      content: "";
      height: 1px;
      width: 9999px;
      background: #e8e8e8;
      display: block;
      position: absolute;
      top: 7px;
      left: 100%;
    }
  }
  .el-step__icon.is-text{
    border-width:1px;
  }
  .el-step__description{
    margin-top:0;
    line-height:1;
  }
  .el-step__icon-inner{
    font-weight:400;
  }
}
</style>
<style lang="scss" scoped>
.flow-add{
  .el-form-item__content{
    width:50%;
  }
  .el-select{
    width:100%;
  }
  .flow-item{
    position: relative;
    border: 1px solid #ddd;
    padding: 12px 16px;
    margin-bottom: 8px;
    cursor: pointer;
    .el-checkbox{
      position: absolute;
      top: 12px;
      right: 20px;
      margin-right:0;
    }
    .el-steps{
      margin-top:8px;
      padding-bottom:10px;
    }
    &.checked{
      border-color: #1890ff;
      box-shadow: 0 0 2px #1890ff;
    }
  }
  .el-step.is-horizontal{
    display: flex;
    align-items: center;
    flex: 1 0 auto;
    margin-right:12px!important;
    overflow:hidden;
  }
  .el-step__head.is-wait{
    border-color: rgba(0,0,0,.25);
    color:rgba(0,0,0,.25);
  }
  .flowForm{
    .requirement-list{
      display:flex;
      align-items:flex-start;
      ul{
        margin-left:20px;
        width:90%;
        li{
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          em{
            margin-right:8px;
            display:inline-block;
            width:50px;
          }
          i{
            margin-right:2px;
            color:#0f91f1;
          }
        }
      }
    }
    .rq-tips{
      margin-top:5px;
      color:#f58011;
    }
  }
  
}
</style>

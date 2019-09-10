<template>
  <div class="flow-list-detail" v-loading="loading">
    <el-card class="box-card">
        <div class="title">
          <h2>{{flowDetailData.name}}</h2>
          <a @click="editFlowDialog = true">人员调整</a>
        </div>
        <div class="detail">
          <span>流程: {{flowDetailData.flow_assemble_name}}</span><span>涉及端: <i v-for="(item,index) in flowDetailData.platform" :key="index">{{flowSet.platform[item]}}</i></span><span>创建人: {{flowDetailData.creator_name}}</span>  <span>创建于:{{flowDetailData.start_time}}</span>
        </div>
        <div class="flow-person">
          <div class="item">
            <label>开发：</label><span v-for="devUser in flowDetailData.user_dev" :key="devUser.user_id">{{devUser.user_name}}</span>
          </div>
          <div class="item">
            <label>负责人：</label><span v-for="ownerUser in flowDetailData.user_owner" :key="ownerUser.user_id">{{ownerUser.user_name}}</span>
          </div>
          <div class="item">
            <label>产品：</label>
            <span v-for="prodUser in flowDetailData.user_prod" :key="prodUser.user_id">{{prodUser.user_name}}</span>
          </div>
          <div class="item">
            <label>测试：</label>
            <span v-for="testUser in flowDetailData.user_test" :key="testUser.user_id">{{testUser.user_name}}</span>
          </div>
        </div>
    </el-card>
    <el-card class="collapse-box">
    <el-collapse v-model="collapsedActive">
      <el-collapse-item name="1">
        <template slot="title">
        {{commentTitle}}<i class="header-icon el-icon-info"></i>
      </template>
        <dl v-if="flowDetailData.flow_type ==1||flowDetailData.flow_type ==4||flowDetailData.flow_type ==6" class="flow-requirement" v-for="flowR in flowDetailRequirement" :key="flowR.id">
          <dt><em>ID:</em><span>{{flowR.id}}</span><em>标题:</em><i>{{flowR.jira_id}}</i>{{flowR.title}}</dt>
          <dd v-if="flowR.description" class="title">描述：</dd>
          <dd v-html="flowR.description"></dd>
        </dl>
        <div class="comment-des" v-if="flowDetailData.flow_type ==2||flowDetailData.flow_type ==3||flowDetailData.flow_type ==5" v-html="flowDetailData.comment"></div>
      </el-collapse-item>
      <el-collapse-item name="2">
        <template slot="title">
        关联流程<i class="header-icon el-icon-info"></i>
      </template>
        <div class="flow-item">
        <div class="meta">
          <div class="avatar">
            <img v-if="flowDetailData.picture" :src="flowDetailData.picture" alt="">
            <img v-else src="../../assets/img/avatar.jpg" alt="">
          </div>
          <div class="meta-content">
              <div class="user">{{flowDetailData.creator_name}}</div>
              <div class="title">{{flowDetailData.name}}</div>
          </div>
        </div>
        <div class="content">
          <div class="list-content-wrap">
            <p class="list-content-item">流程: {{flowDetailData.flow_assemble_name}}</p>
            <p class="list-content-item">当前阶段: {{flowDetailData.action&&flowDetailData.action.hasOwnProperty('current_step_name')?flowDetailData.action.current_step_name:''}}</p>
          </div>
          <div class="list-content-wrap">
            <p class="list-content-item">开始时间: {{flowDetailData.start_time}}</p>
            <p class="list-content-item"><el-progress :percentage="flowDetailData.action&&flowDetailData.action.hasOwnProperty('process')?flowDetailData.action.process:0"></el-progress></p>
          </div>
        </div>
      </div>
      </el-collapse-item>
         <el-collapse-item name="3">
          <template slot="title">
          上线依赖<i class="header-icon el-icon-info"></i>
        </template>
         <div class="text-wrapper" v-if="flowDetailData.dependence" v-html="flowDetailData.dependence.replace(/\n/g, '<br>')">
        </div>
      </el-collapse-item>
    </el-collapse>
    </el-card>
    <el-card class="flow-detail-box">
      <div class="scroll-steps">
        <!-- <vuescroll :ops="ops"> -->
          <div class="scroll-btn scroll-left" @click="scrollSt('left')"><i class="el-icon-arrow-left"></i></div>
          <div class="scroll-btn scroll-right" @click="scrollSt('right')"><i class="el-icon-arrow-right"></i></div>
          <div class="scroll-bar" ref="scrollBar">
            <a-steps v-if="flowDetailData.action&&flowDetailData.action.hasOwnProperty('process')&&flowDetailData.action.process!=100" :current="getStepIndex(flowDetailData.action,flowDetailData.flow_base_list)" :style="stepStyle">
              <a-step v-for="s in getStepsName(flowDetailData.flow_base_list)" :key="s.id" :title="s.name"/>
            </a-steps>
            <a-steps v-else :style="stepStyle">
              <a-step v-for="s in getStepsName(flowDetailData.flow_base_list)" :key="s.id" :title="s.name" status="finish"/>
            </a-steps>
          </div>
        <!-- </vuescroll> -->
      </div>
      <el-row :gutter="15">
        <el-col :span="18">
          <div class="main-wrap">
             <p class="no-right" v-show="!hasRight"><i class="fa fa-lock"></i>抱歉, 你无操作权限</p>
             <div  v-if="flowDetailData.status != 2&&flowDetailData.status != 3 && hasRight" class="opt-wrap">
               <el-tabs v-model="flowStepDatas.result" type="card">
                <el-tab-pane  v-for="(step,index) in getStepActions()" :key="index" :name="Object.keys(step)[0]" :label="Object.values(step)[0]">
                  <div class="tab-wrap" v-if="flowStepDatas.result == Object.keys(step)[0]">
                  <test-result v-if="Object.values(step)[0] === '自动化测试'" @autoResult="getAutoResult"></test-result>
                  <deploy-table v-if="Object.values(step)[0] === '部署'" :project-id="projectId" :flow-id="flowId" @getFlowDetail="getFlowDetail"></deploy-table>
                  <el-form v-else-if="flowStepDatas.result == Object.keys(step)[0]" ref="flowSteps" :model="flowStepDatas" :rules="stepRules">
                    <el-form-item prop="comment">
                      <p>备注：</p>
                      <editor v-model="flowStepDatas.comment"></editor>
                      <el-button type="primary" v-if="flowDetailData.action&&flowDetailData.action.hasOwnProperty('process')&&flowDetailData.action.process!=100" @click="doFlow">执行</el-button>
                    </el-form-item>
                  </el-form>
                </div>
                </el-tab-pane>
              </el-tabs>
             </div>
             <ul class="log-wrap">
               <li class="item"  v-for="(actionItem,index) in getFlowSteps(flowDetailData.action)" :key="index">
                  <div class="avatar">
                    <span class="circle">
                      <img src="../../assets/img/avatar.jpg" alt="">
                    </span>
                  </div>
                  <div class="list-content">
                    <div class="content-title">
                      <div class="des">
                        {{actionItem.user_name}}在[ {{getSingleStepName(actionItem.id)}}]步骤执行了[{{getStepActionsName(actionItem.id)[actionItem.result]}}]操作
                      </div>
                      <div class="status"><el-tag :type="getStepResult(actionItem.result)">{{getStepActionsName(actionItem.id)[actionItem.result]}}</el-tag></div>
                    </div>
                    <div class="list-des">
                       <div class="cont-box">
                         <div class="row">
                           <h4>备注</h4>
                           <div v-html="actionItem.comment"></div>
                         </div>
                       </div>
                       <div class="cont-time">{{actionItem.creation_time}}</div>
                    </div>
                  </div>
               </li>
             </ul>
          </div>
        </el-col>
        <el-col :span="6">
          <section class="description-wrap" v-if="flowAction">
            <h3>{{flowAction.current_step_name}}操作说明</h3>
            <ul>
              <li>
                <!-- <dl>
                  <dt>当日报告操作</dt>
                  <dd>该步骤执行后<span style="color: rgb(24, 144, 255);">会停留在当前步骤</span></dd>
                  <dd>可操作人:<span class="action-user">小行星</span></dd>
                </dl> -->
                <dl v-for="fa in flowAction.step_tab">
                  <dt>{{fa.step_tab_name}}<span>操作</span></dt>
                  <dd>该步骤执行后<span :style="getFontColor(fa.step_tab_result)">{{fa.step_tab_result}}</span></dd>
                  <dd>可操作人:<span class="action-user">{{fa.step_tab_user}}</span></dd>
                </dl>
              </li>
            </ul>
          </section>
        </el-col>
      </el-row>
    </el-card>
    <el-dialog
      title="编辑流程"
      :visible.sync="editFlowDialog"
      width="500px"
      :close-on-click-modal="false"
    >
    <el-form ref="flowForm" :model="editflowData" :rules="rules" label-width="100px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="editflowData.title"></el-input>
      </el-form-item>
      <el-form-item label="开发" prop="development">
        <el-select v-model="editflowData.development" filterable placeholder="请选择" clearable  multiple>
          <el-option
            v-for="item in userList"
            :key="item.userid"
            :label="item.nickname"
            :value="item.userid">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开发负责人" prop="devManage">
        <el-select v-model="editflowData.devManage" filterable placeholder="请选择" clearable  multiple>
          <el-option
            v-for="item in userList"
            :key="item.userid"
            :label="item.nickname"
            :value="item.userid">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="产品" prop="productor">
        <el-select v-model="editflowData.productor" filterable placeholder="请选择" clearable  multiple>
          <el-option
            v-for="item in userList"
            :key="item.userid"
            :label="item.nickname"
            :value="item.userid">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="测试" prop="test">
        <el-select v-model="editflowData.test" filterable placeholder="请选择" clearable  multiple>
          <el-option
            v-for="item in userList"
            :key="item.userid"
            :label="item.nickname"
            :value="item.userid">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上线依赖" prop="dependence">
        <el-input type="textarea" v-model="editflowData.dependence"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="editFlowDialog = false">取消</el-button>
        <el-button type="primary" @click="sureEditFlow">确定</el-button>
      </span>
  </el-dialog>
  </div>
</template>
<script>
import userApi from '@/api/user.js'
import editor from '@/components/editor'
import flowApi from '@/api/flow.js'
import DeployTable from './DeployTable.vue'
import testResult from './autotestResult.vue'
import setApi from '@/api/settingType.js'
  export default{
    data() {
      return {
        loading:true,
        searchData:{
          statu:'',
          owner:'',
          title:''
        },
        editFlowDialog:false,
        editflowData:{
          title:'',
          development:'',
          devManage:'',
          productor:'',
          test:'',
          dependence:''
        },
        collapsedActive:[],
        flowStepDatas:{
          comment:'',
          result:'1',
        },
        flowDetailData:{},
        flowDetailRequirement:[],
        actionStep:'1',
        stepDatas:[],
        flowSet:{
          type:'',
          platform:''
        },
        rules:{
          title:[
            { required: true, message: '请填写标题', trigger: 'change' }
          ],
          development:[
            { required: true, message: '请填写开发', trigger: 'change' }
          ],
          devManage:[
            { required: true, message: '请填写开发管理', trigger: 'change' }
          ],
          productor:[
            { required: true, message: '请填写产品', trigger: 'change' }
          ],
          test:[
            { required: true, message: '请填写测试', trigger: 'change' }
          ],
        },
        stepRules:{
          comment:[
            { required: true, message: '请填写备注', trigger: 'change' }
          ],
        },
        stepStyle:{
          'min-width': 'auto',
          'transform': 'translateX(0px)'
        },
        stepsLength:0,
        stepCurrentIndex:0,
        autoResult:{}
      }
    },
    components:{
      editor,
      DeployTable,
      testResult
    },
    computed: {
      projectId () {
        return parseInt(this.$route.params.projectId)
      },
      flowId(){
        return parseInt(this.$route.params.flowId)
      },
      userId(){
        return this.$store.state.login.userid
      },
      userList(){
        return this.$store.state.project.userList
      },
      hasRight(){
        let right = false
        if(this.flowDetailData.hasOwnProperty('all_user_list')&&this.flowDetailData.all_user_list.indexOf(this.userId)!=-1){
          right = true
        }else{
          right = false
        }
        return right
      },
      flowAction(){
        if(this.flowDetailData.action){
          return this.flowDetailData.action
        }else{
          return ''
        }
      },
      commentTitle(){
        let text = "需求详情"
        if(this.flowDetailData.flow_type == 2){
          text = '搜索推荐描述'
        }
        if(this.flowDetailData.flow_type == 3){
          text = '问题修复描述'
        }
        if(this.flowDetailData.flow_type == 5){
          text = '优化描述'
        }
        return text
      }
    },
    watch:{
      'flowStepDatas.result':{
        handler:function(val){
          if(this.flowAction.current_step_name == '预发布上线'&&val == 1){
            this.flowStepDatas.comment= `<p>[依赖kafka]：</p><p>[PR]:</p><p>[数据库变动]：</p><p>[依赖ab实验]:</p><p>[依赖配置]:</p><p>[服务端上线顺序]</p><p>[OMS/MMS]</p><p>[需求JIRA]</p>`
          }else if(this.flowAction.current_step_name == '功能测试'&&this.autoResult.url){
            this.flowStepDatas.comment= `<p><label>接口名称：</label>${this.autoResult.name}</p><p><label>报告链接：</label><a href="${this.autoResult.url}" target="_blank">${this.autoResult.url}</a></p>`
          }else{
            this.flowStepDatas.comment = '' //重置备注变量
          }
        },
        deep:true
      },
      'flowAction.current_step_name':{//变化的时候清空自动化测试的数据记录
        handler:function(val){
          this.autoResult = {}
        },
        deep:true

      }
    },
    methods:{
      getAutoResult(val){
        this.autoResult = val
        this.flowStepDatas.comment= `<p><label>接口名称：</label>${this.autoResult.name}</p><p><label>报告链接：</label><a href="${this.autoResult.url}" target="_blank">${this.autoResult.url}</a></p>`
      },
      getFlowDetail(){
        flowApi.getFlowDetail(this.flowId).then(res=>{
          this.loading = false
          this.flowDetailData = res.data.data[0]
          this.stepsLength = this.flowDetailData.flow_base_list?this.flowDetailData.flow_base_list.split(',').length : 0
          console.log('steplent',this.stepsLength)
          console.log('flowDetailData',this.flowDetailData)
          this.stepCurrentIndex = this.getStepIndex(this.flowDetailData.action,this.flowDetailData.flow_base_list)
          this.stepStyle['min-width'] = this.stepsLength?this.stepsLength*160 + 'px' : 'auto'
          this.initStepStyle()//滚动样式
          this.editflowData = {
            title:this.flowDetailData.name,
            development:this.flowDetailData.user_dev_id,
            devManage:this.flowDetailData.user_owner_id,
            productor:this.flowDetailData.user_prod_id,
            test:this.flowDetailData.user_test_id,
            dependence:this.flowDetailData.dependence
          }
          //初始化结果选择
          let stepAction = this.getStepActions()

          this.flowStepDatas.result = stepAction.length>0?Object.keys(stepAction[0])[0]:'1'
          console.log('getflowdata',this.flowDetailData,'-',stepAction,'-',this.flowStepDatas)
          this.flowDetailRequirement = this.flowDetailData.comment&&(this.flowDetailData.flow_type == 1||this.flowDetailData.flow_type == 4||this.flowDetailData.flow_type == 6)?JSON.parse(this.flowDetailData.comment):[]
          if(this.flowAction.current_step_name == '预发布上线'&&this.flowStepDatas.result == 1){
            this.flowStepDatas.comment= `[依赖kafka]：
                                        [PR]:
                                        [数据库变动]：
                                        [依赖kafka]: [依赖ab实验]:
                                        [依赖配置]:
                                        [服务端上线顺序]
                                        [OMS/MMS]
                                        [需求JIRA]`
          }else{
            this.flowStepDatas.comment = '' //重置备注变量
          }
          // console.log('editflowdata',this.flowDetailData,'--',this.editflowData)

        },error=>{
          this.loading = false
          console.log('加载失败')

        })
      },
      scrollSt(btn){//right,left 按钮
        let barWidth = this.$refs.scrollBar.offsetWidth
        let currentWidth = (this.stepCurrentIndex + 1) * 160
        let stepWidth = this.stepsLength * 160
        if(barWidth>=stepWidth){
          return false
        }
        if(btn == 'left'){
          this.stepStyle['transform'] = 'translateX(0px)'
          this.stepStyle['-ms-transform'] = 'translateX(0px)'
          this.stepStyle['-moz-transform'] = 'translateX(0px)'
          this.stepStyle['-webkit-transform'] = 'translateX(0px)'
          this.stepStyle['-o-transform'] = 'translateX(0px)'
        }
        if(btn == 'right'){
          this.stepStyle['transform'] = `translateX(-${stepWidth - barWidth}px)`
          this.stepStyle['-ms-transform'] = `translateX(-${stepWidth - barWidth}px)`
          this.stepStyle['-moz-transform'] = `translateX(-${stepWidth - barWidth}px)`
          this.stepStyle['-webkit-transform'] = `translateX(-${stepWidth - barWidth}px)`
          this.stepStyle['-o-transform'] = `translateX(-${stepWidth - barWidth}px)`
        }

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
        if(flowStep&&flowStep.length>0){
          stepsId = flowStep.split(',')
          stepsName = this.stepDatas.filter(item => {
            if(stepsId.indexOf(item.id.toString())!= -1){
              return item
            }
          })
        }
        return stepsName
      },
      getStepActions(){
        let action = this.flowDetailData.action 
        let steps = []
        let sId = ''
        if(action&&action.hasOwnProperty('current_step')){
          sId = action.current_step
        }else{
          sId = ''
        }
        this.stepDatas.forEach(item =>{
          if(item.id == sId){
            steps = item.step
          }
        })
        return steps
      },
      getStepActionsName(stepId){
        let steps = []
        let stepsObj = {}
        let sId = ''
        if(stepId){
          sId = stepId
        }
        this.stepDatas.forEach(item =>{
          if(item.id == sId){
            steps = item.step
          }
        })
        steps.forEach(item=>{
          stepsObj[Object.keys(item)[0]] = Object.values(item)[0]
        })
        return stepsObj
      },
      getSingleStepName(stepId){
        let sName = {}
        this.stepDatas.forEach(item =>{
          if(item.id == stepId){
            sName = item.name
          }
        })
        return sName
      },
      getFontColor(text){
        let color = ''
        if(text.indexOf('下一步')!=-1){
          color='color: rgb(73, 175, 30)'
        }else if(text.indexOf('当前')!=-1){
          color = 'color: rgb(24, 144, 255)'
        }else if(text.indexOf('第一步')!=-1){
          color = 'color: rgb(255, 85, 0)'
        }
        return color
      },
      getStepResult(type){
        let text = 'success'
        if(type ==2){
          text = 'danger'
        }else{
          text = 'success'
        }
        return text
      },
      getStepIndex(action,flowStep){
        let stepsId = []
        let stepId = action&&action.hasOwnProperty('current_step')?action.current_step:''
        let stepIndex = 0
        if(flowStep&&flowStep.length>0){
          stepsId = flowStep.split(',')
          stepIndex = stepsId.indexOf(stepId)
        }
        return stepIndex
      },
      getFlowSteps(action){
        let steps= []
        action&&action.hasOwnProperty('steps')?steps = action.steps : []
        steps = [].concat(steps)
        steps.reverse()
        return steps
      },
      sureEditFlow(){
        this.$refs.flowForm.validate((valid) => {
          if (valid) {
            let params = {
              name:this.editflowData.title,
              project_id:this.projectId,
              user_dev:this.editflowData.development,
              user_owner:this.editflowData.devManage,
              user_prod:this.editflowData.productor,
              user_test:this.editflowData.test,
              dependence:this.editflowData.dependence
            }
            flowApi.updateFlow(this.flowId,params).then(res=>{
              this.$message.success('修改成功！')
              this.editFlowDialog = false
              this.getFlowDetail()//重新获取数据
            },error=>{
              this.$message.error(`修改失败:${error.message}`)
            })
              }
            })

      },
      doFlow(){
        this.$refs.flowSteps[0].validate((valid) => {
          if (valid) {
            let params ={
              id:parseInt(this.flowDetailData.action.current_step),
              name:this.flowDetailData.name,
              result:this.flowStepDatas.result,
              comment:this.flowStepDatas.comment
            }
            flowApi.doFlow(this.flowId,params).then(res=>{
              this.$message.success('执行成功！')
              this.getFlowDetail() //刷新数据
              if(this.flowDetailData.action.current_step_name == '提测'&&this.flowStepDatas.result == 1){
                //发起自动化测试
                flowApi.runAutoTestReport({"project_id":this.projectId,"run_list":[1]}).then(res=>{
                  console.log('发起自动化测试成功！')
                },error=>{
                  console.log('发起自动化测试失败！')
                })
              }
              this.flowStepDatas.comment = '' //重置备注变量
              this.$refs.flowSteps[0].resetFields();
            },error=>{
              this.flowStepDatas.comment = '' //重置备注变量
              this.$message.error(`执行失败:${error.message}`)
            })
          }
        })

      },
      initStepStyle(){
        this.$nextTick(()=>{
          let barWidth = this.$refs.scrollBar.offsetWidth
          let currentWidth = (this.stepCurrentIndex + 1) * 160
          let stepWidth = this.stepsLength * 160
          if((barWidth < stepWidth) && (currentWidth > barWidth/2)&& currentWidth < barWidth) {
            this.stepStyle['transform'] = `translateX(-${currentWidth - barWidth/2}px)`
            this.stepStyle['-ms-transform'] = `translateX(-${currentWidth - barWidth/2}px)`
            this.stepStyle['-moz-transform'] = `translateX(-${currentWidth - barWidth/2}px)`
            this.stepStyle['-webkit-transform'] = `translateX(-${currentWidth - barWidth/2}px)`
            this.stepStyle['-o-transform'] = `translateX(-${currentWidth - barWidth/2}px)`
          }
          if((barWidth < stepWidth) && currentWidth > barWidth){
            this.stepStyle['transform'] = `translateX(-${stepWidth - barWidth}px)`
            this.stepStyle['-ms-transform'] = `translateX(-${stepWidth - barWidth}px)`
            this.stepStyle['-moz-transform'] = `translateX(-${stepWidth - barWidth}px)`
            this.stepStyle['-webkit-transform'] = `translateX(-${stepWidth - barWidth}px)`
            this.stepStyle['-o-transform'] = `translateX(-${stepWidth - barWidth}px)`
          }
          if(currentWidth < barWidth/2){
            this.stepStyle['transform'] = `translateX(0px)`
            this.stepStyle['-ms-transform'] = `translateX(0px)`
            this.stepStyle['-moz-transform'] = `translateX(0px)`
            this.stepStyle['-webkit-transform'] = `translateX(0px)`
            this.stepStyle['-o-transform'] = `translateX(0px)`
          }
        })
      },
      getFlowSet(){
        setApi.getFlowSet().then(res=>{
          this.flowSet = res.data.data
        })
      }
    },
    created(){
      this.getFlowSet()
      this.getFlowDetail()
      this.getStepDatas()
    },
    mounted(){

    }
  }
</script>
<style lang="scss" scoped>
.flow-list-detail{
  .el-select{
    width:360px;
  }
  .flow-requirement{
    border-bottom:1px solid #ccc;
    padding-bottom:8px;
    &:last-child{
      border-bottom:none;
    }
    dt{
      color:#666;
      span{
        margin-right:10px;
      }
      em{
        font-weight:700;
        margin-right:10px;
      }
      i{
        margin-right:2px;
        color:#0f91f1;
      }
    }
    dd{
      margin-bottom:0;
      &.title{
        margin-top:10px;
        color:#666;
        font-weight:700;
      }
      font-size:12px;
      color:#999;
      img{
        max-width:90%;
      }
    }
    .comment-des{
      padding-bottom:8px;
      img{
        max-width:90%;
        display:block;
      }
    }
  }
  .box-card{
    .title{
      position:relative;
      text-align: center;
      margin-bottom:6px;
      h2{
        display:inline;
        font-size:18px;
      }
      a{
        position: absolute;
        right: 0;
        margin: auto;
      }
    }
    .detail{
      text-align:center;
      font-size:12px;
      color:#999;
      span{
        margin:0 10px;
      }
      i{
        margin-left:3px;
      }
    }
    .flow-person{
      display: flex;
      justify-content: space-between;
      flex-flow: row wrap;
      .item{
        font-size:14px;
        padding: 7px 0;
        flex:1;
        color:#666;
        span{
          margin-left:5px;
        }
      }
    }
  }
  .el-collapse-item__header{
    i{
      margin-left:10px;
    }
  }
  .el-card{
    margin-bottom:15px;
  }
  .scroll-steps{
    position: relative;
    width: 100%;
    margin-bottom: 36px;
    padding: 0 32px;
    overflow: hidden;
    .ant-steps{
      transition: all .5s ease;
    }
    .scroll-btn{
      height: 100%;
      position: absolute;
      width: 32px;
      display: inline-block;
      cursor: pointer;
      text-align: center;
      line-height: 32px;
    }
    .scroll-left{
      left:0;
    }
    .scroll-right{
      right:0;
    }
    .scroll-bar{
      max-width: 100%;
      min-width: 100%;
      overflow: hidden;
    }
  }
  .main-wrap{
    .no-right{
      display:flex;
      align-items:center;
      justify-content:center;
      font-size:16px;
      i{
        color:#1890ff;
        margin-right:10px;
        font-size:40px;
      }
    }
    .opt-wrap{
      padding-bottom:20px;
    }
    .log-wrap{
      margin-top:20px;
      .item{
        display: flex;
        align-items: flex-start;
        padding-top: 12px;
        padding-bottom: 12px;
        border-bottom: 1px solid #e8e8e8;
        .avatar{
          margin-right: 16px;
          .circle{
            display:inline-block;
            vertical-align: middle;
            width: 32px;
            height: 32px;
            line-height: 32px;
            border-radius: 50%;
            overflow:hidden;
            img{
              width:100%;
              height:100%;
              line-height: 32px;
            }
          }
        }
        .list-content{
          flex:1;
          .content-title{
            display:flex;
            align-items:center;
            margin-bottom:20px;
            .des{
              width:83%;
            }
            .status{
              width:17%;
              .el-tag{
                float:right;
              }
            }
          }
        }
        .list-des{
          color: rgba(0,0,0,.45);
          font-size: 14px;
          line-height: 22px;
          .cont-box{
            padding: 24px;
            background: #fbfbfb;
            border: 1px solid #d9d9d9;
            .row{
               position: relative;
              margin-left: 0;
              margin-right: 0;
              margin-top:10px;
              height: auto;
              zoom: 1;
              display: block;
              box-sizing: border-box;
              h4{
                margin-top: 0;
                margin-bottom: .5em;
                color: rgba(0,0,0,.85);
                font-weight: 500;
              }
            }
          }
          .cont-time{
            position: relative;
            margin-left: 0;
            margin-right: 0;
            margin-top:20px;
            height: auto;
            zoom: 1;
            display: block;
            box-sizing: border-box;
          }
        }
      }
    }
  }
  .description-wrap{
    h3{
      margin-top: 0;
      margin-bottom: .5em;
      color: rgba(0,0,0,.85);
      font-weight: 500;
    }
    ul{
      list-style: none;
      font-size: 14px;
      padding-left: 10px;
      li{
        margin-bottom: 16px;
        color: rgba(0,0,0,.85);
        font-size:14px;
        dt{
          margin-bottom:.5em;
          // span{
          //   color:#999;
          // }
        }
        dd{
          margin-bottom:.5em;
        }
        .action-user{
          padding-left: 8px;
          font-weight: bold;
        }
      }
    }
  }
  .flow-item{
      display:flex;
      align-items:center;
      .meta{
        display:flex;
        align-items: flex-start;
        flex: 1 1;
        font-size: 0;
        .avatar{
          margin-right: 16px;
            width: 48px;
            height: 48px;
            line-height: 48px;
        }
        .meta-content{
          flex:1 0;
          .user{
            color: rgba(0,0,0,.65);
            margin-bottom: 4px;
            font-size: 14px;
            line-height: 22px;
          }
          .title{
            color: rgba(0,0,0,.45);
            font-size: 14px;
            line-height: 22px;
          }
        }
      }
      .content{
        display:flex;
        flex: 1 1;
        justify-content: flex-end;
        .list-content-wrap{
          color: rgba(0,0,0,.45);
          text-align: right;
          margin-left: 30px;
          font-size: 14px;
        }
        .list-content-item{
              margin-top: 6px;
        }
      }
      .action{
        font-size: 0;
        flex: 0 0 auto;
        margin-left: 28px;
        padding: 0;
        list-style: none;
        li{
          display: inline-block;
          color: rgba(0,0,0,.45);
          cursor: pointer;
          padding: 0 8px;
          position: relative;
          font-size: 14px;
          line-height: 22px;
          text-align: center;
          &:first-child {
            padding-left: 0;
          }
        }
      }
    }
}
.text-wrapper{
  white-space: pre-wrap;
}
</style>

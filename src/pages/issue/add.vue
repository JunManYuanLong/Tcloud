<template>
  <div class="issue-dialog-wrap">
    <el-dialog
        :title="titleText"
        :visible.sync="dialogVisible"
        width="1000px"
        :before-close="handleClose" :close-on-click-modal="false" :lock-scroll="true">
        <div class="issue-preview-content">
        <!-- <div slot="header" class="clearfix">
          <span>新增用户</span>
        </div> -->
        <el-form :model="addData" :rules="rules" ref="addForm" label-width="110px" class="addForm" :inline="true">
            <el-form-item label="标题：" prop="title" class="blockItem">
              <el-input v-model.trim="addData.title" ></el-input>
            </el-form-item>
            <el-form-item label="所属模块：" prop="module_id">
              <el-select v-model="addData.module_id"  filterable  placeholder="请选择"  clearable>
               <el-option
                  v-for="item in moduleList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="处理人:" prop="handler">
              <el-select v-model="addData.handler" filterable placeholder="请选择"  clearable>
                <el-option
                  v-for="item in userList"
                  :key="item.userid"
                  :label="item.nickname"
                  :value="item.userid">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="issue类型：" prop="issue_type">
              <el-select v-model="addData.issue_type" placeholder="请选择"  clearable>
               <el-option
                  v-for="(value,key) in issueSet.type"
                  :key="key"
                  :label="value"
                  :value="parseInt(key)">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="出现机率：" prop="chance">
              <el-select v-model="addData.chance" placeholder="请选择"  clearable>
                <el-option
                  v-for="(value,key) in issueSet.chance"
                  :key="key"
                  :label="value"
                  :value="parseInt(key)">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="级别：" prop="level">
              <el-select v-model="addData.level" placeholder="请选择"  clearable>
                <el-option
                  v-for="(value,key) in issueSet.level"
                  :key="key"
                  :label="value"
                  :value="parseInt(key)">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="优先级：" prop="priority">
              <el-select v-model="addData.priority" placeholder="请选择"  clearable>
                <el-option
                  v-for="(value,key) in issueSet.priority"
                  :key="key"
                  :label="value"
                  :value="parseInt(key)">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属系统：" prop="system">
              <el-select v-model="addData.system" placeholder="请选择"  clearable>
                <el-option
                  v-for="(value,key) in issueSet.systems"
                  :key="key"
                  :label="value"
                  :value="parseInt(key)">
                </el-option>
              </el-select>
            </el-form-item>
						
            <el-form-item label="用户识别度：" prop="detection_chance">
              <el-select v-model="addData.detection_chance" placeholder="请选择"  clearable>
                <el-option
                  v-for="(value,key) in issueSet.detection_chance"
                  :key="key"
                  :label="value"
                  :value="parseInt(key)">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="绑定需求：" prop="requirement_id">
              <el-select
                  v-model="addData.requirement_id"
                  filterable
                  clearable
                  remote
                  placeholder="请输入需求标题的关键字或者id进行搜索"
                  :remote-method="getRequirements"
                  :loading="rqLoading">
                  <el-option  class="rq_select"
                    v-for="item in requirements"
                    :key="item.id"
                    :label="item.title"
                    :value="item.id">
                  </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="是否用例覆盖：" prop="case_covered">
                  <el-select
                      v-model="addData.case_covered"
                      placeholder="请选择是否覆盖">
                      <el-option  
                        label="未覆盖"
                        :value="0">
                      </el-option>
                      <el-option  
                        label="已覆盖"
                        :value="1">
                      </el-option>
                    </el-select>
                </el-form-item>
            <el-form-item label="描述：" prop="description"  class="blockItem">
              <editor v-if="dialogVisible" v-model="addData.description"></editor>
            </el-form-item>
            <el-form-item label="图片附件：" class="blockItem">
              <imageUpload v-if="ossData.hasOwnProperty('host')" :ossData="ossData" :showModal="false" v-model="uploadFile.images"></imageUpload>
            </el-form-item>
            <el-form-item label="视频附件：" class="blockItem">
              <videoUpload v-if="ossData.hasOwnProperty('host')" :ossData="ossData" :showModal="false" v-model="uploadFile.videos"></videoUpload>
            </el-form-item>
            <el-form-item label="普通文件附件：" class="blockItem">
              <fileUpload v-if="ossData.hasOwnProperty('host')" :ossData="ossData" v-model="uploadFile.files"></fileUpload>
            </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button @click="hangleEdit" type="primary">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="picPreview">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
import editor from '@/components/editor'
import issueApi from '@/api/issue.js'
import moduleApi from '@/api/module.js'
import taskApi from '@/api/task.js'
import setApi from '@/api/settingType.js'
import requirementApi from '@/api/requirement'
import imageUpload from '@/pages/requirement/imageUpload'
import videoUpload from '@/pages/requirement/videoUpload'
import fileUpload from '@/pages/requirement/fileUpload'
import {generateUUID, getSuffix} from '@/utils/util.js'
  export default{
    name:'issueDialog',
    props:['issueId','isShow'],
    data() {
      return {
        dialogVisible: this.isShow,
        addData: {
         module_id:'',
         handler:'',
         issue_type:'',
         chance:'',
         level:'',
         priority:'',
         system:'',
         stage:'',
         title:'',
         attach:'',
         handle_status:'',
         description:'',
				 detection_chance:'',
         requirement_id:'',
         case_covered:''
        },
        rqLoading:false,
        requirements:[],
        uploadImages:[],
        uploadFile:{
          images:[],
          files:[],
          videos:[]
        },
        rules: {
					chance:[
					{ required: true, message: '请填写issue出现概率', trigger: 'change' }
					],
          title: [
            { required: true, message: '请填写issue标题', trigger: 'blur' }
          ],
          level: [
          { required: true, message: '请选择issue级别', trigger: 'change' }
          ],
          priority: [
          { required: true, message: '请选择issue优先级', trigger: 'change' }
          ],
// 					detection_chance:[
// 					{ required: true, message: '请选择issue用户识别度', trigger: 'change' }
// 					],
        },
        moduleList: [],
        picPreview:false,
        dialogImageUrl:''
      }
    },
    watch:{
      'isShow': function (cval) {
        this.dialogVisible = cval
      },
      'issueId':{
        handler:function(cval){
          if(cval){
            this.getEditData(cval)
          }else{
            this.$refs.addForm.resetFields()
          }
        },
        deep:true
      }
    },
    components:{
      imageUpload,
      videoUpload,
      fileUpload,
      editor
    },
    computed:{
      projectId(){
        return this.$route.params.projectId
      },
      version(){
        return this.$route.params.versionId
      },
      userId(){
        return this.$store.state.login.userid
      },
      userList(){
        return this.$store.state.project.userList
      },
      titleText() {
        let text = "新增"
        if(this.issueId){
          text = "编辑"
        }
        return text + 'Issue'
      },
      ossData(){
        return this.$store.state.project.ossData
      },
      uploadParams () {
        return {
          OSSAccessKeyId: this.ossData.accessid,
          policy: this.ossData.policy,
          signature: this.ossData.signature,
          key: `${this.ossData.dir}${this.filename}`,
          success_action_status: 200
        }
      },
      issueSet() {
        let set = {
          chance:{},
          detection_chance:{},
          level:{},
          priority:{},
          status:{},
          systems:{},
          type:{}
        }
        return this.$store.state.project.settings.issue_config?this.$store.state.project.settings.issue_config:set;
      },
    },
    methods: {
      handleClose () {
        this.uploadFile = {
            images:[],
            files:[],
            videos:[]
          }
        this.requirements = []
        this.$refs.addForm.resetFields()
        this.$emit('close')
      },
      hangleEdit() {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            let params = Object.assign({},this.addData)
            params.project_id = parseInt(this.projectId)
            params.attach = JSON.stringify(this.uploadFile)
            if(this.version!== 'all'){
              params.version = parseInt(this.version)
            }
            params.creator = this.userId
            params.modifier = this.userId
            params = dealObjectValue(params)
            if(this.issueId){//编辑
              issueApi.editIssue(this.issueId,params).then(res => {
                this.$message({
                   message: 'Issue修改成功！',
                   type: 'success'
                })
                this.uploadImages = []
                this.requirements = []
                this.$refs.addForm.resetFields()
                this.$emit('refreshIssue')
              },error=>{
                this.$message.error('操作失败：' + error.message)
              })
            }else{//添加
              issueApi.addIssue(params).then(res => {
                this.$message({
                   message: 'Issue添加成功！',
                   type: 'success'
                })
                this.$emit('close')
                this.$emit('refreshIssue')
                this.handleClose()
              },error=>{
                this.$message.error('操作失败：' + error.message)
              })
            }
          } else {
            this.$message.error('请填写相关字段！')
            return false;
          }
        })
      },
      getEditData() {
        this.uploadImages = []
        issueApi.getSingleIssue({id: this.issueId}).then(res => {
          let data = res.data.data[0]
          this.addData ={
            system:data.system,
             issue_type:data.issue_type,
             chance:data.chance,
             level:data.level,
             priority:data.priority,
             stage:data.stage,
             title:data.title,
             // attach:data.attach,
             handle_status:data.handle_status,
             description:data.description,
						 detection_chance: data.detection_chance,
						 
          }
          let upload = JSON.parse(data.attach)
          this.uploadImages = upload.images.map(item => {
            return {url: item}
          })
          if(data.creator&&data.creator.length!=0){
            this.addData.creator = data.creator[0].id
          }
          if(data.version&&data.version.length!=0){
            this.addData.version = data.version[0].id
          }
          if(data.handler&&data.handler.length!=0){
            this.addData.handler = data.handler[0].id
          }
          if(data.module&&data.module.length!=0){
            this.addData.module_id = data.module[0].id
          }

        })
      },
      getModuleList() {
        moduleApi.getModuleByProject(this.projectId).then(res => {
          this.moduleList = res.data.data
        })
      },
      getTaskCaseList() {
        taskApi.getTCaseByProject(this.projectId).then(res => {
          this.taskCaseList = res.data.data
        })
      },
      getRequirements(query){
        if(query){
          this.rqLoading = true
          let params = {
            projectid:this.projectId,
            id_or_title:query
          }
          requirementApi.getAllRqList(params).then(res=>{
            this.requirements = res.data.data
            this.rqLoading = false
          },error=>{
            this.rqLoading = false
            console.log('获取需求失败！')
          })
        }else{
          this.rqLoading = false
          this.requirements = []
        }
      }
    },
    created() {
      if(this.issueId){ 
        this.getEditData()
      }
      this.getModuleList()
    }
  }
  function dealObjectValue(obj){
    var param = {};
    if ( obj === null || obj === undefined || obj === "" ) return param;
    for ( var key in obj ){
        if ( typeof obj[key] === "Object" ){
            param[key] = dealObjectValue(obj[key]);
        }else if(  obj[key] !== null && obj[key] !== undefined && obj[key] !== ""  ){
            param[key] = obj[key];
        }
    }
    return param;
}
</script>
<style lang="scss">
.el-card__header{
  text-align:left;
}
.issue-dialog-wrap{
  .addForm{
    .el-form-item__content{
      text-align:left;
      width:300px;
    }
    .el-select{
      width:100%;
    }

  
  }
  .el-form--inline{
     .blockItem .el-form-item__content{
        width:730px;
      }
    }
    .el-form--inline{
     .imageItem .el-form-item__content{
        width:560px;
      }
    }
  
}


</style>
<style lang="scss" scoped>

.issue-edit{
  .title{
    font-size:16px;
    padding:10px 0;
    text-align:left;
  }
}
.addForm{
  .blockItem{
  display:block;

  }

}
.issue-preview-content{
  max-height:400px;
  overflow:auto;
}
.rq_select{
  max-width:300px;
}
</style>

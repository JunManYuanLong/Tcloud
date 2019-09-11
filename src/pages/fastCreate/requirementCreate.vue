<template>
  <div class="drawer" v-transfer-dom :data-transfer="transfer">
    <transition name="fade">
        <div class="drawer-mask" v-show="visible" @click="handleMask"></div>
    </transition>
    <div :class="wrapClasses" @click="handleWrapClick">
      <transition name="moveRight">
        <div class="drawer-right" :style="drawerStyle" v-show="visible">
          <div class="drawer-content">
            <div class="require-detail-wrap">
            <div class="button-bar">
              <el-button @click="handleAdd" type="primary">确定</el-button>
              <el-button @click="handleClose">取消</el-button>
            </div>
            <el-form :model="addData" :rules="rules" ref="addForm" label-width="130px" class="addForm">
              <el-form-item label="标题：" prop="title">
                <el-input v-model="addData.title" type="textarea"></el-input>
              </el-form-item>
              <el-form-item label="版本：" prop="version">
                <el-select v-model="addData.version" placeholder="请选择" clearable>
                  <el-option
                    v-for="item in versionList"
                    :key="item.id"
                    :label="item.title"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="处理人：" prop="handler">
                <el-select v-model="addData.handler" placeholder="请选择"  clearable  filterable>
                  <el-option
                    v-for="item in userList"
                    :key="item.userid"
                    :label="item.nickname"
                    :value="item.userid">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="优先级：" prop="priority">
                <el-select v-model="addData.priority" placeholder="请选择"  clearable>
                  <el-option
                  v-for="(val,key) in rqSet.priority"
                  :key="key"
                  :label="val"
                  :value="parseInt(key)">
                </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="类型：" prop="requirement_type">
                <el-select v-model="addData.requirement_type" placeholder="请选择"  clearable>
                  <el-option
                  v-for="(val,key) in rqSet.type"
                  :key="key"
                  :label="val"
                  :value="parseInt(key)">
                </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="状态：" prop="board_status">
                <el-select v-model="addData.board_status" placeholder="请选择"  clearable>
                  <el-option
                  v-for="(val,key) in rqSet.status"
                  :key="key"
                  :label="val"
                  :value="parseInt(key)">
                </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="需求价值：" prop="worth">
                  <el-select v-model="addData.worth" placeholder="请选择">
                    <el-option
                      label="高价值"
                      :value="1">
                    </el-option>
                    <el-option
                      label="非高价值"
                      :value="2">
                    </el-option>
                  </el-select>
                </el-form-item>
                <!-- 为高价值时的一些操作 -->
                <template v-if="addData.worth == 1">
                  <el-form-item label="高价值的预期值：">
                    <editor v-if="visible" v-model="addData.report_expect"></editor>
                  </el-form-item>
                  <el-form-item label="获取置信结果：">
                     <!-- <el-input v-model="addData.report_time" type="number"></el-input> -->
                     <el-input v-model="addData.report_time" type="number" :min="0" style="display: inline-block;width:100px;"></el-input>
                      <span>天</span>
                  </el-form-item>
                  <el-form-item label="高价值的实际值：">
                      <editor v-if="visible" v-model="addData.report_real"></editor>
                  </el-form-item>
                  <el-form-item label="需求价值确认：">
                     <el-radio-group v-model="addData.worth_sure">
                        <el-radio :label="1">超出预期</el-radio>
                        <el-radio :label="2">符合预期</el-radio>
                        <el-radio :label="3">低于预期</el-radio>
                      </el-radio-group>
                  </el-form-item>
                  
                </template>
                <el-form-item label="jira号：" prop="jira_id">
                  <el-input v-model="addData.jira_id" style="width:200px;"></el-input>
                </el-form-item>
                <el-form-item label="预期完成时间：" prop="expect_time">
                  <el-date-picker
                    v-model="addData.expect_time"
                    type="date"
                    placeholder="选择日期时间">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="关联用例：" prop="case_ids">
                  <span v-if="addData.case_ids.length>0">选中了{{addData.case_ids.length}}条用例</span>
                      <el-button size="small" @click="createCaseDialogVisible = true" icon="el-icon-circle-plus-outline">
                        {{addData.case_ids && addData.case_ids.length > 0 ? '继续选择' : '请选择'}}
                      </el-button>
                </el-form-item>
              <el-form-item label="需求描述：" prop="description">
                <editor v-if="visible"  v-model="addData.description"></editor>
              </el-form-item>
              <el-form-item label="图片附件：">
                <imageUpload v-if="ossData.hasOwnProperty('host')" :ossData="ossData" v-model="uploadFile.images"></imageUpload>
              </el-form-item>
              <el-form-item label="视频附件：">
                <videoUpload v-if="ossData.hasOwnProperty('host')" :ossData="ossData" v-model="uploadFile.videos"></videoUpload>
              </el-form-item>
              <el-form-item label="普通文件附件：">
                <fileUpload v-if="ossData.hasOwnProperty('host')" :ossData="ossData" v-model="uploadFile.files"></fileUpload>
              </el-form-item>
           </el-form>
         </div>
        </div>
        </div>
      </transition>
    </div>
    <case-dialog v-if="createCaseDialogVisible" ref="addCaseDialog" :isShow="createCaseDialogVisible" :taskCaseList="addData.case_ids" type="create" @close="isShowCaseDialog(false)" @caseSelect="caseSelected"></case-dialog>
  </div>
</template>
<script>
import userApi from '@/api/user.js'
import editor from '@/components/editor'
import imageUpload from '@/pages/requirement/imageUpload'
import videoUpload from '@/pages/requirement/videoUpload'
import fileUpload from '@/pages/requirement/fileUpload'
import caseDialog from '@/components/caseDialog.vue'
import ossApi from '@/api/oss.js'
import requirementApi from '@/api/requirement.js'
import setApi from '@/api/settingType.js'
import {generateUUID, getSuffix} from '@/utils/util.js'
import TransferDom from '@/directives/transfer-dom';
const prefixCls = 'drawer';
  export default{
    name:'rqCreate',
    directives: { TransferDom },
     props: {
      value: {
          type: Boolean,
          default: false
      },
      drawerStyle:{
        type:Object,
        default(){
          return {}
        }
      },
    },
    data(){
      return {
        transfer:true,
        visible: this.value,
        addData: {
          "title": "",
          "version":"",
          "priority": "",
          "handler":"",
          "attach": "",
          "board_status": "",
          "description": "",
          "requirement_type": "",
          "worth":2,
          "report_time":"",
          "report_expect":"",
          "report_real":"",
          "worth_sure":"",
          "jira_id":'',
          "case_ids":[]
        },
        createCaseDialogVisible:false,
        rules: {
          title: [
            { required: true, message: '请填写需求标题', trigger: 'change' }
          ]
        },
        stepValid: true,
        uploadFile:{
          images:[],
          files:[],
          videos:[]
        },
        logData:[],
        comment:{
          status:false,
          text:''
        },
        addDataChange:false,
        addChangeCount:0
      }
    },
    components:{
      editor,
      imageUpload,
      videoUpload,
      fileUpload,
      caseDialog
    },
    computed:{
      wrapClasses () {
          return [
              `${prefixCls}-wrap`,
              {
                  [`${prefixCls}-hidden`]: !this.visible
              }
          ];
      },
      projectId(){
        return this.$route.params.projectId
      },
      userId(){
        return this.$store.state.login.userid
      },
      userList(){
        return this.$store.state.project.userList
      },
      ossData(){
        return this.$store.state.project.ossData
      },
      versionList(){
        return this.$store.state.project.versionList
      },
      rqSet() {
        return this.$store.state.project.settings.requirement_config;
      },
    },
    watch:{
      'value':{
        handler:function(val){
          this.visible = val
          if(val){
            this.addChangeCount = 0
          }
        },
        deep:true
      },
      addData:{
        handler:function(val){
          this.addDataChange = true
          this.addChangeCount++
        },
        deep:true
      },
      'uploadFile':{
        handler:function(val){
          this.addDataChange = true
          this.addChangeCount++
        },
        deep:true
      },
      'addData.worth':function(val){
        if(val == 2){
          this.addData.report_time = ""
          this.addData.report_expect = ""
          this.addData.report_real = ""
          this.addData.worth_sure = ""
        }
      }
    },
    methods:{
      close () {
          if(this.addDataChange&&this.addChangeCount>0){
            this.$confirm('你有修改未保存，是否要关闭窗口?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.closeResetData()
              }).catch(() => {
                // this.$message({
                //   type: 'info',
                //   message: '已取消关闭'
                // });          
              });
          }else{
            this.closeResetData()
          }
          
      },
      closeResetData(){
        this.uploadFile = {
            images:[],
            files:[],
            videos:[]
          }
          this.$refs.addForm.resetFields()
          this.visible = false;
          this.$emit('input', false);
        this.addDataChange = false
      },
      handleMask () {
        this.close();
      },
      handleWrapClick (event) {
        // use indexOf,do not use === ,because ivu-modal-wrap can have other custom className
        const className = event.target.getAttribute('class');
        if (className && className.indexOf('drawer-wrap') > -1) this.handleMask();
      },
      handleClose () {
        this.close()
      },
      handleAdd() {
         this.$refs.addForm.validate((valid) => {
          if (valid) {
            let params = Object.assign({},this.addData)
            params.project_id = parseInt(this.projectId)
            params.creator = this.userId
            params.attach = JSON.stringify(this.uploadFile)
            if(this.addData.report_time!==''){
              params.report_time = this.addData.report_time.toString()
            }
            params = dealObjectValue(params)
            requirementApi.addRequirement(params).then(res=>{
              this.$message.success('需求添加成功！')
              this.addDataChange=false
              this.addChangeCount=0
              this.close()
              // 跳转到需求页面
              this.$router.push({
                name:'requirementList',
                params:{
                  requirementClassId:'a1'
                }
              })

            },error=>{
              this.$message.error(`添加失败: ${error.message}`)
            })
          }else{
            this.$message.error('请填写相关字段！')
            return false
          }
        })
      },
      isShowCaseDialog(val){
        this.createCaseDialogVisible = val
      },
      caseSelected(val){
        this.addData.case_ids = val
        this.isShowCaseDialog(false)
      },
    },
    created() {
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
<style lang="scss" >
.require-detail-wrap{
  .showDetailItem{
  .el-form-item__label {
    color: #99a9bf;
  }
}
}
.require-comment{
  .el-textarea__inner{
  resize:none;
  border:none;
}
}
.drawer-content{
  .el-upload-list{
    width:80%;
  }
}
  
</style>
<style lang="scss" scoped>
.drawer-mask{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(55,55,55,.6);
    height: 100%;
    z-index: 1000;
}
.drawer-hidden{
  display:none!important;
}
.drawer-wrap{
  position: fixed;
    overflow: auto;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1000;
    -webkit-overflow-scrolling: touch;
    outline: 0;
    *{
      box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
    }
    .drawer-right{
      right:0;
      height: 100%;
      position: fixed;
      top: 0;
      width:340px;
    }
  .drawer-content{
    padding-top:20px;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    background-color: #fff;
    border: 0;
    background-clip: padding-box;
    box-shadow: 0 4px 12px rgba(0,0,0,.15);
  }
  .addForm{
    padding-right:20px;
    
  }
  
}
.moveRight-enter-active, .moveRight-appear {
  opacity: 0;
  animation-timing-function: ease-in-out;
  animation-duration: .5s;
  animation-fill-mode: both;
  animation-play-state: paused;
   animation-name: moveRightIn;
  animation-play-state: running;
}
.moveRight-leave-active {
  animation-timing-function: ease-in-out;
  animation-duration: .5s;
  animation-fill-mode: both;
  animation-play-state: paused;
   animation-name: moveRightOut;
  animation-play-state: running;
}
@keyframes moveRightIn {
    0% {
        opacity: 0;
        transform-origin: 0 0;
        transform: translateX(100%);
    }
    100% {
        opacity: 1;
        transform-origin: 0 0;
        transform: translateX(0%);
    }
}

@keyframes moveRightOut {
    0% {
        transform-origin: 0 0;
        transform: translateX(0%);
        opacity: 1;
    }
    100% {
        transform-origin: 0 0;
        transform: translateX(100%);
        opacity: 0;
    }
}
.require-detail-wrap{
  height:100%;
  overflow:auto;
  .split-line{
  margin:10px 0;
  border-bottom:1px solid #eee;
}
}
.button-bar{
  position:fixed;
  right:60px;
  bottom:150px;
  z-index:1003;
  button{
  display:block;
  margin-bottom:15px;
}
.el-button+.el-button{
  margin-left:0;
}
}
.require-comment{
  position:fixed;
  padding-right:60px;
  right:60px;
  bottom:104px;
  z-index:19;
  width:725px;
  border-radius:5px;
  border:1px solid #dcdfe6;
  box-shadow: 0 0 10px rgba(144, 144, 144, 0.4);

}
.require-number{
  padding:10px 0 10px 0;
  margin-bottom:10px;
  background-color:#e3effd;
  label{
  display:inline-block;
  width:100px;
  text-align:right;
}
}
.timeline{
  margin: 20px 0 0 165px;
  padding-left: 25px;
  position: relative;
  color: #5e6d82;
  max-width:490px;
  & > li:first-child h3:before {
    left: -33px;
    top: 4px;
    width: 17px;
    height: 17px;
    background-color: #20a0ff;
    border: 0;
  }

   h3:before {
    content: "";
    display: block;
    position: absolute;
    left: -31px;
    top: 6px;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    border: 2px solid #20a0ff;
    box-sizing: border-box;
    background-color: #fff;
  }

  &:before {
    display:block;
    content: "";
    width: 1px;
    height: 100%;
    position: absolute;
    left: 0;
    top: 5px;
    border-left:1px solid #eaeefa;
  }

  li li:before {
    content: "";
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: #5e6d82;
    margin-right: 5px;
    display: inline-block;
    vertical-align: middle;
  }
  h3 {
    font-family: 微软雅黑;
    font-size:14px;
    max-width:490px;
    display:flex;
    span{
     color: rgb(7, 95, 184);
     min-width:65px;
    }
  }
  & > li {
    list-style: none;
    position: relative;
    line-height: 1.8;
    margin-bottom: 40px;
  }


  li li {
    font-size: 14px;
    list-style: none;
    padding-left: 0;
    word-break: break-all;
  }

  a {
    opacity: 1;
    float: none;
    margin-left: 0;
    color: inherit;
  }

  
  p {
    margin: 0;
  }

  em {
    position: absolute;
    left: -175px;
    font-style: normal;
    top: 0px;
    font-size: 12px;
    color: #99a9bf;
  }
}
</style>

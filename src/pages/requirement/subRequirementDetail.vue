<template>
  <div class="drawer" v-transfer-dom :data-transfer="transfer">
    <transition name="fade">
      <div class="drawer-mask" v-show="visible" @click="handleMask"></div>
    </transition>
    <div :class="wrapClasses" @click="handleWrapClick">
      <transition name="moveRight">
        <div class="drawer-right" :style="drawerStyle" v-show="visible">
          <div class="drawer-content requirement-detail-content">
            <div class="require-detail-wrap" @click="closeComment">
              <div class="button-bar">
                <el-button @click="handleEdit" type="primary">确定</el-button>
                <el-button @click="deleteRequire" type="danger">删除</el-button>
                <el-button @click="doComment" type="success" class="comment-btn">{{comment.status?'提交':'留言'}}
                </el-button>
              </div>
              <div class="require-comment" v-if="comment.status">
                <el-input class="comment-text" v-model.trim="comment.text" type="textarea" :rows="4"
                          id="commentInput"></el-input>
              </div>
              <div class="require-number"><label>需求ID：</label>{{requireData.id}}<button ref="copy" data-clipboard-action="copy" :data-clipboard-text="rqDetailUrl" class="copyRLink" @click="copyLink">复制详情链接</button></div>
              <el-form :model="editData" :rules="rules" ref="addForm" label-width="130px" class="addForm"
                       :inline="true">
                <el-form-item label="标题：" prop="title" class="blockItem">
                  <el-input v-model="editData.title" type="textarea"></el-input>
                </el-form-item>
                <el-form-item label="版本：" prop="version">
                  <el-select v-model="editData.version" placeholder="请选择" clearable>
                    <el-option
                      v-for="item in versionList"
                      :key="item.id"
                      :label="item.title"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="处理人：" prop="handler">
                  <el-select v-model="editData.handler" placeholder="请选择" clearable filterable>
                    <el-option
                      v-for="item in userList"
                      :key="item.userid"
                      :label="item.nickname"
                      :value="item.userid">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="优先级：" prop="priority">
                  <el-select v-model="editData.priority" placeholder="请选择" clearable>
                    <el-option
                      v-for="(val,key) in rqSet.priority"
                      :key="key"
                      :label="val"
                      :value="parseInt(key)">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="类型：" prop="requirement_type">
                  <el-select v-model="editData.requirement_type" placeholder="请选择" clearable>
                    <el-option
                      v-for="(val,key) in rqSet.type"
                      :key="key"
                      :label="val"
                      :value="parseInt(key)">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="状态：" prop="board_status">
                  <el-select v-model="editData.board_status" placeholder="请选择" clearable>
                    <el-option
                      v-for="(val,key) in rqSet.status"
                      :key="key"
                      :label="val"
                      :value="parseInt(key)">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="需求价值：" prop="worth">
                    <el-select v-model="editData.worth" placeholder="请选择">
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
                  <template v-if="editData.worth == 1">
                    <el-form-item label="高价值的预期值：">
                      <editor v-model="editData.report_expect"></editor>
                    </el-form-item>
                    <el-form-item label="获取置信结果：">
                       <el-input v-model="editData.report_time" type="number" :min="0" style="display: inline-block;width:100px;"></el-input>
                      <span>天</span>
                    </el-form-item>
                    <el-form-item label="高价值的实际值：">
                        <editor v-model="editData.report_real"></editor>
                    </el-form-item>
                    <el-form-item label="需求价值确认：">
                       <el-radio-group v-model="editData.worth_sure">
                        <el-radio :label="1">超出预期</el-radio>
                        <el-radio :label="2">符合预期</el-radio>
                        <el-radio :label="3">低于预期</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </template>
                  <el-form-item label="jira号：" prop="jira_id"  class="blockItem">
                    <el-input v-model="editData.jira_id" style="width:200px;"></el-input>
                  </el-form-item>
                  <el-form-item label="预期完成时间：" prop="expect_time">
                    <el-date-picker
                      v-model="editData.expect_time"
                      type="date"
                      placeholder="选择日期时间"  value-format="yyyy-MM-dd">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item label="关联用例：" prop="case_ids">
                    <span v-if="editData.case_ids&&editData.case_ids.length>0">选中了{{editData.case_ids.length}}条用例</span>
                        <el-button size="small" @click="createCaseDialogVisible = true" icon="el-icon-circle-plus-outline">
                          {{editData.case_ids && editData.case_ids.length > 0 ? '继续选择' : '请选择'}}
                        </el-button>
                  </el-form-item>
                  <el-form-item label="标签：" prop="tag" class="blockItem">
                    <el-select v-model="editData.tag" placeholder="请选择" multiple  clearable style="width:80%">
                      <el-option
                      v-for="item in tagList"
                      :key="item.id"
                      :label="item.tag"
                      :value="item.id">
                    </el-option>
                    </el-select>
                  </el-form-item>
                <el-form-item label="描述：" prop="description" class="blockItem">
                  <editor v-model="editData.description"></editor>
                </el-form-item>
                <el-form-item label="图片附件：" class="blockItem">
                  <imageUpload v-if="ossData.hasOwnProperty('host')" :ossData="ossData" :showModal="false"
                               v-model="uploadFile.images"></imageUpload>
                </el-form-item>
                <el-form-item label="视频附件：" class="blockItem">
                  <videoUpload v-if="ossData.hasOwnProperty('host')" :ossData="ossData" :showModal="false"
                               v-model="uploadFile.videos"></videoUpload>
                </el-form-item>
                <el-form-item label="普通文件附件：" class="blockItem">
                  <fileUpload v-if="ossData.hasOwnProperty('host')" :ossData="ossData"
                              v-model="uploadFile.files"></fileUpload>
                </el-form-item>
              </el-form>
               <el-collapse class="issue-detail-wrap" v-model="collapsedActive">
                <el-collapse-item name="1">
                  <template slot="title">关联issue信息 <span class="tips">(点击可展开详情)</span>
                </template>
                   <p  v-if="!hasIusse" class="tips">暂无相关issue</p>
                  <div class="issue-wrap" v-if="hasIusse">
                    <dl class="parent">
                      <dt>{{editData.title}}</dt>
                      <dd v-for="issue in editData.issue" :key="issue.id"><i class="el-icon-info"></i><em>ID:{{issue.issueid}}</em><el-tooltip class="item" effect="dark" :content="issue.title" placement="top-start"><a :href="issueDetailUrlPre+issue.issueid" target="_blank" :class="{throughLine:issue.handle_status == 4}">{{issue.title}}</a></el-tooltip><span>状态：{{issueSet.status[issue.handle_status]}}</span></dd>
                    </dl>
                  </div>
                </el-collapse-item>
              </el-collapse>
              <ul class="timeline" ref="timeline">
                <li v-for="item in logData">
                  <h3><span>{{item.modifier_name}}</span><span class="logContent" v-html="item.operation"></span></h3>
                  <p><em>{{item.modified_time}}</em></p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <case-dialog v-if="createCaseDialogVisible" ref="addCaseDialog" :isShow="createCaseDialogVisible" :taskCaseList="editData.case_ids" type="create" @close="isShowCaseDialog(false)" @caseSelect="caseSelected"></case-dialog>
  </div>
</template>
<script>
  import userApi from '@/api/user.js'
  import versionApi from '@/api/version'
  import editor from '@/components/editor'
  import imageUpload from '@/pages/requirement/imageUpload'
  import videoUpload from '@/pages/requirement/videoUpload'
  import fileUpload from '@/pages/requirement/fileUpload'
  import caseDialog from '@/components/caseDialog'
  import ossApi from '@/api/oss.js'
  import requirementApi from '@/api/requirement.js'
  import {generateUUID, getSuffix} from '@/utils/util.js'
  import TransferDom from '@/directives/transfer-dom';
  import setApi from '@/api/settingType.js'
  import Clipboard from 'clipboard'
  const prefixCls = 'drawer';
  export default {
    name: 'requireDetail',
    directives: {TransferDom},
    props: {
      value: {
        type: Boolean,
        default: false
      },
      drawerStyle: {
        type: Object,
        default() {
          return {}
        }
      },
      requireData: {
        type: Object
      },
      tagList:{
        type:Array,
        default() {
          return []
        }
      }
    },
    data() {
      return {
        saveChange: {
          title: '',
          description: '',
          attach: ''
        },
        transfer: true,
        visible: false,
        editData: {
          "title": "",
          "version": "",
          "priority": "",
          "handler": "",
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
          "case_ids":[],
          "issue":[],
          "expect_time":'',
          "tag":[]
        },
        createCaseDialogVisible:false,
        rules: {
          title: [
            {required: true, message: '请填写需求标题', trigger: 'change'}
          ]
        },
        stepValid: true,
        uploadFile: {
          images: [],
          files: [],
          videos: []
        },
        logData: [],
        comment: {
          status: false,
          text: ''
        },
        editDataChange: false,
        changeCount: 0,
        copyBtn:'',
        collapsedActive:[]
      }
    },
    components: {
      editor,
      imageUpload,
      videoUpload,
      fileUpload,
      caseDialog
    },
    computed: {
      wrapClasses() {
        return [
          `${prefixCls}-wrap`,
          {
            [`${prefixCls}-hidden`]: !this.visible
          }
        ];
      },
      projectId() {
        return this.$route.params.projectId
      },
      userId() {
        return this.$store.state.login.userid
      },
      userList(){
        return this.$store.state.project.userList
      },
      versionList(){
        return this.$store.state.project.versionList
      },
      ossData(){
        return this.$store.state.project.ossData
      },
      rqDetailUrl(){
        let origin  = window.location.origin 
        let url = `${origin}/#/project/${this.projectId}/requirement/a1/requirementDetail/${this.requireData.id}`
        return url
      },
      issueDetailUrlPre(){
        let origin  = window.location.origin 
        let url = `${origin}/#/project/${this.projectId}/issue/all/issueDetail/`
        return url
      },
      hasIusse(){
        let hasI = false
        if(this.editData.issue&&this.editData.issue.length>0){
          hasI = true
        }
        if(this.editData.parent_list&&this.editData.parent_list.length>0){
          this.editData.parent_list.forEach(item=>{
            if(item.issue&&item.issue.length>0){
              hasI = true
            }
          })
        }
        return hasI
      },
      rqSet() {
        return this.$store.state.project.settings.requirement_config;
      },
      issueSet() {
        return this.$store.state.project.settings.issue_config;
      },
    },
    watch: {
      'requireData': {
        handler: function (val) {
          this.getEditData(val)
          this.getRequireLog()
        },
        deep: true
      },
      'value': {
        handler: function (val) {
          this.visible = val
          this.getEditData(this.requireData)
          // this.getRequireLog()
        },
        deep: true
      },
      'editData': {
        handler: function (val) {
          this.editDataChange = true
          this.changeCount++ //首次初始化不算
        },
        deep: true
      },
      'uploadFile': {
        handler: function (val) {
          this.editDataChange = true
          this.changeCount++ //首次初始化不算
        },
        deep: true
      },
      'editData.worth':function(val){
        if(val == 2){
          this.editData.report_time = ""
          this.editData.report_expect = ""
          this.editData.report_real = ""
          this.editData.worth_sure = ""
        }
      }
    },
    methods: {
      close() {
        if (this.editDataChange && this.changeCount > 2) {
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
        } else {
          this.closeResetData()
        }

      },
      closeResetData() {
        this.uploadFile = {
          images: [],
          files: [],
          videos: []
        }
        this.$refs.addForm.resetFields()
        this.visible = false;
        this.comment.text = ''
        this.comment.status = false
        this.$emit('input', false);
        this.editDataChange = false
        this.collapsedActive = []
      },
      handleMask() {
        this.close();
      },
      handleWrapClick(event) {
        // use indexOf,do not use === ,because ivu-modal-wrap can have other custom className
        const className = event.target.getAttribute('class');
        if (className && className.indexOf('drawer-wrap') > -1) this.handleMask();
      },
      handleClose() {
        this.uploadImages = []
        this.$refs.addForm.resetFields()
        this.handler = ''
        this.module_id = ''
        this.close()
      },
      // 是否修改了title description attch等
      isChange (title, description, attach) {
        let isStatus = this.requireData.review_status !== 1
        if (title !== this.saveChange.title && isStatus) {
          return true
        }
        if (description !== this.saveChange.description && isStatus) {
          return true
        }
        if (attach !== this.saveChange.attach && isStatus) {
          return true
        }
        return false
      },
      handleEdit() {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            let params = Object.assign({}, this.editData)
            params.project_id = parseInt(this.projectId)
            params.attach = JSON.stringify(this.uploadFile)
            if(this.editData.report_time!==''){
              params.report_time = this.editData.report_time.toString()
            }
            params.tag = this.editData.tag.toString()
            let changes = params
            params = dealObjectValue(params)
            params.parent_id = this.requireData['parent_id']
            requirementApi.editRequirement(params, this.requireData.id).then(res => {
              // 判断是否修改了title description attch等
              if (this.isChange(params.title, this.editData.description, params.attach)) {
                requirementApi.changeReviewState({requirement_id: this.requireData.id}).then((res) => {
                  console.log(res.data.code)
                }, (err) => {

                })
              }
              console.log('eidtData11111', params)
              this.$message.success('需求修改成功！')
              this.visible = false;
              this.$emit('input', false);
              this.$refs.addForm.resetFields()
              this.editDataChange = false
              this.changeCount = 0
              this.close()
              changes.id = this.requireData.id
              changes.creator_id = this.requireData.creator_id
              changes.creator_name = this.requireData.creator_name
              this.$emit('data-change', changes)
            }, error => {
              this.$message.error(`修改失败: ${error.message}`)
            })
          } else {
            this.$message.error('请填写相关字段！')
            return false
          }
        })
      },
      deleteRequire() {
        this.$confirm(`此操作将删除该需求:${this.requireData.id}, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          requirementApi.deleteRequire(this.requireData.id).then(res => {
            if (res.data.code == 0) {
              this.$message({
                message: '需求删除成功！',
                type: 'success'
              })
              this.editDataChange = false
              this.changeCount = 0
              this.close()
              this.$emit('data-delete')
              // 触发父组件的方法，重新刷新子需求列表
            }
          }, error => {
            this.$message.error('删除失败: '+error.message)
            // this.close()
          })
        })
      },
      doComment() {
        if (this.comment.status && !this.comment.text) {
          this.$message.error('请先填写留言！')
          return false
        }
        this.comment.status = !this.comment.status
        if (this.comment.status) {
          this.$nextTick(() => {
            document.getElementById('commentInput').focus()
          })
        }
        if (!this.comment.status) {
          requirementApi.addComment(this.requireData.id, {comment: this.comment.text}).then(res => {
            this.$message.success('添加留言成功！')
            this.comment.text = ''
            this.getRequireLog()
          }, error => {
            this.$message.error('添加留言失败: ' + error.message)
          })

        }

      },
      closeComment(event) {
        if (event.target.className.indexOf('comment-btn') == -1 && event.target.parentElement.className.indexOf('comment-btn') == -1 && event.target.parentElement.className.indexOf('comment-text') == -1 && event.target.className.indexOf('require-comment') == -1) {
          this.comment.status = false
          this.comment.text = ''
        }
        // if(event.target)
      },
      getEditData(detailData) {
        console.log('detaildata', detailData)
        this.changeCount = 0
        this.editData = {
          title: detailData.title,
          version: detailData.version_id,
          handler: detailData.handler_id,
          creator: detailData.creator_id,
          priority: detailData.priority,
          board_status: detailData.board_status,
          description: detailData.description,
          requirement_type: detailData.requirement_type,
          worth:detailData.worth?detailData.worth:2,
          jira_id:detailData.jira_id,
          report_time : detailData.report_time,
          report_expect : detailData.report_expect,
          report_real : detailData.report_real,
          worth_sure : detailData.worth_sure,
          case_ids:detailData.case_ids,
          issue:detailData.issue,
          expect_time:detailData.expect_time,
          tag:detailData.tag?detailData.tag.split(',').map(Number):[],
        }
        let upload = detailData.attach != '' ? JSON.parse(detailData.attach) : {
          images: [],
          files: [],
          videos: []
        }
        this.uploadFile = upload
        if (detailData.creator_name) {
          this.editData.creator = detailData.creator_id
        } else {
          this.editData.creator = ''
        }
        //  保存一份title和discription和attach
        this.saveChange.title = detailData.title
        this.saveChange.description = detailData.description
        this.saveChange.attach = detailData.attach
      },
      // 请求日志接口
      getRequireLog() {
        console.log(this.requireData.id)
        requirementApi.getRequirementLog(this.requireData.id).then(res => {
          this.logData = res.data.data
        }, error => {
          this.$message.error('获取需求记录失败: ' + error.message)
        })
      },
      copyLink(){
          let _this = this;
          let clipboard = _this.copyBtn;
          clipboard.on('success', function() {
              _this.$message({ /*这是使用了element-UI的信息弹框*/
                  message: '复制成功！',
                  type: 'success'
              });
          });
          clipboard.on('error', function() {
              _this.$message({
                  message: '复制失败，请手动选择复制！',
                  type: 'error'
              });
          });
      },
      isShowCaseDialog(val){
        this.createCaseDialogVisible = val
      },
      caseSelected(val){
        this.editData.case_ids = val
        this.isShowCaseDialog(false)
      },
    },
    created() {
    },
    mounted(){
      this.copyBtn = new Clipboard(this.$refs.copy);
    }
  }

  function dealObjectValue(obj) {
    var param = {};
    if (obj === null || obj === undefined || obj === "") return param;
    for (var key in obj) {
      if (typeof obj[key] === "Object") {
        param[key] = dealObjectValue(obj[key]);
      } else if (obj[key] !== null && obj[key] !== undefined && obj[key] !== "") {
        param[key] = obj[key];
      }
    }
    return param;
  }
</script>
<style lang="scss">
  .require-detail-wrap {
    .showDetailItem {
      .el-form-item__label {
        color: #99a9bf;
      }
    }

    .blockItem .el-form-item__content {
      width: 722px;
    }
  }

  .require-comment {
    .el-textarea__inner {
      resize: none;
      border: none;
    }
  }

  .drawer-content {
    .el-upload-list {
      width: 80%;
    }
  }
.issue-detail-wrap{
    .el-collapse-item__content,.el-collapse-item__header{
      font-size:14px;
    }
  }
</style>
<style lang="scss" scoped>
  .drawer-mask {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(55, 55, 55, .6);
    height: 100%;
    z-index: 1001;
  }

  .drawer-hidden {
    display: none !important;
  }

  .drawer-wrap {
    position: fixed;
    overflow: auto;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1002;
    -webkit-overflow-scrolling: touch;
    outline: 0;

    * {
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent;
    }

    .drawer-right {
      right: 0;
      height: 100%;
      position: fixed;
      top: 0;
      width: 340px;
    }

    .drawer-content {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      bottom: 0;
      background-color: #fff;
      border: 0;
      background-clip: padding-box;
      box-shadow: 0 4px 12px rgba(0, 0, 0, .15);
    }

    .addForm {
      padding-right: 20px;

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

  .require-detail-wrap {
    height: 100%;
    overflow: auto;

    .split-line {
      margin: 10px 0;
      border-bottom: 1px solid #eee;
    }
  }

  .button-bar {
    position: fixed;
    right: 60px;
    bottom: 150px;
    z-index: 10002;

    button {
      display: block;
      margin-bottom: 15px;
    }

    .el-button + .el-button {
      margin-left: 0;
    }
  }

  .require-comment {
    position: fixed;
    padding-right: 60px;
    right: 60px;
    bottom: 104px;
    z-index: 19;
    width: 725px;
    border-radius: 5px;
    border: 1px solid #dcdfe6;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(144, 144, 144, 0.4);

  }

  .require-number {
    padding: 10px 0 10px 0;
    margin-bottom: 10px;
    background-color: #e3effd;

    label {
      display: inline-block;
      width: 100px;
      text-align: right;
    }
  }

  .timeline {
    margin: 20px 0 0 165px;
    padding-left: 25px;
    position: relative;
    color: #5e6d82;
    max-width: 490px;
    .logContent {
      word-break: break-all;

      img {
        max-width: 98%;
      }
    }

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
      display: block;
      content: "";
      width: 1px;
      height: 100%;
      position: absolute;
      left: 0;
      top: 5px;
      border-left: 1px solid #eaeefa;
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
      font-size: 14px;
      max-width: 490px;
      display: flex;
      word-break: break-all;

      span {
        color: rgb(7, 95, 184);
        min-width: 65px;
      }

      img {
        max-width: 100px !important;
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

  .addForm {
    .blockItem {
      display: block;

    }

  }
  .copyRLink{
  padding:5px 10px;
  margin-left:20px;
  color: #409eff;
  background: #ecf5ff;
  border-color: #b3d8ff;
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;
  outline: none;
}
.issue-detail-wrap{
  padding:0 20px;
  .el-collapse-item__content{
    font-size:14px;
  }
  .tips{
    padding:0 5px;
    color:#999;
  }
  dt{
    color:#333;
    font-weight:bold;
  }
  dd{
    display: flex;
    align-items:center;
    i{
      color:#ccc;
    }
    a{
      white-space: nowrap;
      width:500px;
      overflow: hidden;
      text-overflow:ellipsis;
      outline: none;
      &.throughLine{
        text-decoration:line-through;
      }
    }
    em{
      padding:0 5px;
    }
  }
  // .issue-wrap{
  //   position: relative;
  //   .line{
  //     left:5px;
  //     top:20px;
  //     position: absolute;
  //     display:block;
  //     height:80%;
  //     border-left:1px solid #ccc;
  //   }
  // }
  .parent{
    dd{
      margin-left:16px;
      position:relative;
      &::before{
        left:-10px;
        top:11px;
        position: absolute;
        content:"";
        display:block;
        width:8px;
        border-bottom:1px solid #ccc;
      }
      &::after{
        left:-10px;
        top:-5px;
        position: absolute;
        content:"";
        display:block;
        height:24px;
        border-left:1px solid #ccc;
      }
    }
  }
  .child{
    margin-left:16px;
    position: relative;
    &::before{
      left:-10px;
      top:-5px;
      position: absolute;
      content:"";
      display:block;
      height:100%;
      border-left:1px solid #ccc;
    }
    &:last-child{
      &::before{
        height:17px;
      }
    }
    dt{
      position:relative;
      &::before{
        left:-10px;
        top:11px;
        position: absolute;
        content:"";
        display:block;
        width:8px;
        border-bottom:1px solid #ccc;
      }
      
    }
    dd{
      margin-left:16px;
      position:relative;
      &::before{
        left:-10px;
        top:11px;
        position: absolute;
        content:"";
        display:block;
        width:8px;
        border-bottom:1px solid #ccc;
      }
      &::after{
        left:-10px;
        top:-3px;
        position: absolute;
        content:"";
        display:block;
        height:24px;
        border-left:1px solid #ccc;
      }
      &:last-child{
        &::after{
          height:15px;
        }
      }
    a{
      width:485px;
    }
    }
  }
}
</style>

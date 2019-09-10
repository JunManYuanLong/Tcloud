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
              <!--<div class="button-bar">&lt;!&ndash; <el-button @click="handleClose">取消</el-button> &ndash;&gt;
                <el-button @click="handleEdit" type="primary">确定</el-button>
                <el-button @click="deleteRequire" type="danger">删除</el-button>
                <el-button @click="doComment" type="success" class="comment-btn">{{comment.status?'提交':'留言'}}
                </el-button>
              </div>-->
              <div class="require-comment" v-if="comment.status">
                <el-input class="comment-text" v-model.trim="comment.text" type="textarea" :rows="4"
                          id="commentInput"></el-input>
              </div>
              <div class="require-number"><label>需求ID：</label>{{requireData.requirement_id}}</div>
              <el-form :model="editData" :rules="rules" ref="addForm" label-width="130px" class="addForm"
                       :inline="true">
                <el-form-item label="标题：" prop="title" class="blockItem">
                  <el-input v-model="editData.title" type="textarea" :readonly="readOnly"></el-input>
                </el-form-item>
                <el-form-item label="版本：" prop="version">
                  <el-select v-model="editData.version" placeholder="请选择" clearable :disabled="readOnly">
                    <el-option
                      v-for="item in versionList"
                      :key="item.id"
                      :label="item.title"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="处理人：" prop="handler">
                  <el-select v-model="editData.handler" placeholder="请选择" clearable filterable :disabled="readOnly">
                    <el-option
                      v-for="item in userList"
                      :key="item.userid"
                      :label="item.nickname"
                      :value="item.userid">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="优先级：" prop="priority">
                  <el-select v-model="editData.priority" placeholder="请选择" clearable :disabled="readOnly">
                    <el-option
                      v-for="item in priority"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="类型：" prop="requirement_type">
                  <el-select v-model="editData.requirement_type" placeholder="请选择" clearable :disabled="readOnly">
                    <el-option
                      v-for="item in typeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="状态：" prop="board_status">
                  <el-select v-model="editData.board_status" placeholder="请选择" clearable :disabled="readOnly">
                    <el-option
                      v-for="item in statusList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="需求价值：" prop="worth">
                    <el-select v-model="editData.worth" placeholder="请选择" :disabled="readOnly">
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
                  <div v-if="editData.worth == 1">
                    <el-form-item label="高价值的预期值：" class="blockItem mask">
                      <div class="mask-desc"></div>
                      <editor v-if="visible" v-model="editData.report_expect"></editor>
                    </el-form-item>
                    <el-form-item label="获取置信结果：">
                       <!-- <el-input v-model="addData.report_time" type="number"></el-input> -->
                       <el-input v-model="editData.report_time" type="number" :min="0" style="display: inline-block;width:100px;" :disabled="readOnly"></el-input>
                      <span>天</span>
                    </el-form-item>
                    <el-form-item label="高价值的实际值：" class="blockItem mask">
                      <div class="mask-desc"></div>
                        <editor v-if="visible" v-model="editData.report_real"></editor>
                    </el-form-item>
                    <el-form-item label="需求价值确认：" prop="worth_sure">
                       <el-radio-group v-model="editData.worth_sure" :disabled="readOnly">
                        <el-radio :label="1">超出预期</el-radio>
                        <el-radio :label="2">符合预期</el-radio>
                        <el-radio :label="3">低于预期</el-radio>
                      </el-radio-group>
                    </el-form-item>
                    
                  </div>
                  <el-form-item label="jira号：" prop="jira_id"  class="blockItem">
                    <el-input v-model="editData.jira_id" style="width:200px;" :disabled="readOnly"></el-input>
                  </el-form-item>
                <el-form-item label="需求描述：" prop="description" class="blockItem mask">
                  <div class="mask-desc"></div>
                  <editor v-if="visible" v-model="editData.description"></editor>
                </el-form-item>
                <el-form-item label="图片附件：" class="blockItem">
                  <imageUpload v-if="ossData.hasOwnProperty('host')" :ossData="ossData" :showModal="false"
                               v-model="uploadFile.images" :read-only="readOnly"></imageUpload>
                </el-form-item>
                <el-form-item label="视频附件：" class="blockItem">
                  <videoUpload v-if="ossData.hasOwnProperty('host')" :ossData="ossData" :showModal="false"
                               v-model="uploadFile.videos" :read-only="readOnly"></videoUpload>
                </el-form-item>
                <el-form-item label="普通文件附件：" class="blockItem">
                  <fileUpload v-if="ossData.hasOwnProperty('host')" :ossData="ossData"
                              v-model="uploadFile.files" :read-only="readOnly"></fileUpload>
                </el-form-item>
              </el-form>
              <!--<div class="sub-require-list">
                <div class="sub-require-title">
                  子需求
                </div>
                <div class="sub-require-content">
                  <div v-for="item in parent_list" :key="item.id" class="sub-list-item title-item" @click="toDetailFun(item.id)">{{item.title}}</div>
                  <div v-show="addSubShow" class="sub-list-item">
                    <el-input v-model="addSubTitle" size="mini" @keydown.enter.native="addSubRequest"></el-input>
                  </div>
                  <el-button type="text" style="margin-top: 5px; font-size: 15px;" v-show="!addSubShow" @click="addSubShow = true"> ＋ 新增子需求</el-button>
                  <div v-show="addSubShow">
                    <el-button type="primary" size="mini" style="margin-top: 20px" @click="cancelAddSub">取消</el-button>
                    <el-button type="primary" size="mini" style="margin-top: 20px" @click="addSubRequest">保存</el-button>
                  </div>
                </div>
              </div>-->
              <div class="split-line"></div>
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
    <subRequirementDetail v-model="requirementDrawer" :requireData="subRequirementDetail" :drawerStyle="drawerStyle"
                          @data-change="initTableData" @data-delete="initTableData"></subRequirementDetail>
  </div>
</template>
<script>
  import userApi from '@/api/user.js'
  import versionApi from '@/api/version'
  import editor from '@/components/editor'
  import imageUpload from '@/pages/requirement/imageUpload'
  import videoUpload from '@/pages/requirement/videoUpload'
  import fileUpload from '@/pages/requirement/fileUpload'
  import ossApi from '@/api/oss.js'
  import requirementApi from '@/api/requirement.js'
  import {generateUUID, getSuffix} from '@/utils/util.js'
  import TransferDom from '@/directives/transfer-dom';
  import subRequirementDetail from '@/pages/requirement/subRequirementDetail'
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
      }
    },
    data() {
      return {
        readOnly: true,
        saveChange: {
          title: '',
          description: '',
          attach: ''
        },
        getSublistParams: {},
        addSubRequestParams: {},
        parent_list: [],
        addSubShow: false,
        addSubTitle: '',
        // 新增
        requirementDrawer: false,
        // 新增
        subRequirementDetail: {
          attach: '{"images":[],"files":[],"videos":[]}',
          board_status: 1,
          comment: "nihao",
          creator_id: 26,
          creator_name: "张素浈1",
          description: "<p>123</p>",
          handler_id: 26,
          handler_name: "张素浈1",
          id: 95,
          modified_time: "2019-05-15 15:40:08",
          priority: 3,
          project_id: 4,
          requirement_type: 0,
          title: "测试版本消失bug，发货上的尽是的回复还是短发",
          version_id: 121,
          version_name: "1.1.2"
        },
        transfer: true,
        visible: this.value,
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
          "parent_list": [
            {
              id: 15,
              title: '子需求1'
            },
            {
              id: 16,
              title: '子需求2'
            },
            {
              id: 12,
              title: '子需求3'
            }
          ]
        },
        priority: [
          {
            value: 0,
            label: "紧急"
          }, {
            value: 1,
            label: "高"
          }, {
            value: 2,
            label: '中'
          }, {
            value: 3,
            label: '低'
          }],
        typeList: [{
          value: 0,
          label: "功能需求"
        }, {
          value: 1,
          label: "优化需求"
        }, {
          value: 2,
          label: "自动化需求"
        }, {
          value: 3,
          label: "性能需求"
        }, {
          value: 4,
          label: "兼容性需求"
        }, {
          value: 5,
          label: "报表需求"
        }, {
          value: 6,
          label: "临时需求"
        }, {
          value: 7,
          label: "紧急需求"
        }, {
          value: 8,
          label: "新功能需求"
        }, {
          value: 9,
          label: "其他"
        }],
        statusList: [{
          value: 0,
          label: "规划中"
        }, {
          value: 1,
          label: "实现中"
        }, {
          value: 2,
          label: "测试中"
        }, {
          value: 3,
          label: "已拒绝"
        }, {
          value: 4,
          label: "待验收"
        }, {
          value: 5,
          label: "待发布"
        }, {
          value: 6,
          label: "完成"
        }],
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
      }
    },
    components: {
      editor,
      imageUpload,
      videoUpload,
      fileUpload,
      subRequirementDetail
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
    },
    watch: {
      'requireData': {
        handler: function (val) {
          this.getEditData(val)
          this.getSubList(val)
          this.addSubRequestParams = {
            project_id: val.project_id,
            version: val.version_id,
            parent_id: val.requirement_id,
            attach: '{"images":[],"files":[],"videos":[]}'
          }
          this.getSublistParams = {
            id: val.requirement_id,
            project_id: val.project_id,
            version_id: val.version_id,
          }
        },
        deep: true
      },
      'value': {
        handler: function (val) {
          this.visible = val
          this.getEditData(this.requireData)
          this.getRequireLog()
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
    },
    methods: {
      // 获取子需求列表
      getSubList (val) {
        let params = {
          requirement_id: val.id,
          project_id: val.project_id,
          version: val.version_id
        }
        if (!params.version) {
          delete params.version
        }
        requirementApi.getSubRequireList(params).then(res => {
          console.log(res)
          if (res.data.code === 0) {
            this.parent_list = res.data.data
          }
        }, (err) => {
          // this.$message.error(`修改失败${err.message}`)
        })
      },
      // 取消新增
      cancelAddSub () {
        this.addSubShow = false
        this.addSubTitle = ''
      },
      // 保存新增
      addSubRequest () {
        if (!this.addSubTitle) {
          this.$message({
            message: '请输入子需求名称',
            type: 'warning'
          })
          return
        }
        this.addSubRequestParams.title = this.addSubTitle
        if (!this.addSubRequestParams.version) {
          delete this.addSubRequestParams.version
        }
        // 请求保存接口
        requirementApi.saveSubItem(this.addSubRequestParams).then((res) => {
          if (res.data.code === 0) {
            // 再次获取子需求列表，页面更新
            this.getSubList(this.getSublistParams)
            this.cancelAddSub()
          }
        }, (err) => {
          this.$message.error(`添加失败: ${err.message}`)
        })
      },
      // 点击子需求，进入详情
      toDetailFun(id) {
        this.requirementDrawer = true
        console.log(id)
        requirementApi.getDetailById(id).then((res) => {
          if (res.data.code === 0) {
            this.subRequirementDetail = res.data.data[0]
          }
        }, (err) => {

        })
      },
      // 刷新子需求列表
      initTableData () {
        this.getSubList(this.getSublistParams)
      },
      close() {
        // 清空掉状态
        this.cancelAddSub()
        // 刷新列表
        this.$emit('refresh-list')
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
      },
      handleMask() {
        this.close()
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
            console.log('eidtData', params)
            let changes = params
            params = dealObjectValue(params)
            params.parent_id = this.requireData['parent_id']
            requirementApi.editRequirement(params, this.requireData.requirement_id).then(res => {
              // 判断是否修改了title description attch等
              if (this.isChange(params.title, this.editData.description, params.attach)) {
                requirementApi.changeReviewState({requirement_id: this.requireData.requirement_id}).then((res) => {
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
              changes.id = this.requireData.requirement_id
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
        this.$confirm(`此操作将删除该需求:${this.requireData.requirement_id}, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          requirementApi.deleteRequire(this.requireData.requirement_id).then(res => {
            console.log(res)
            if (res.data.code === 0) {
              this.$message({
                message: '需求删除成功！',
                type: 'success'
              })
              this.editDataChange = false
              this.changeCount = 0
              this.close()
              this.$emit('data-delete')
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
          requirementApi.addComment(this.requireData.requirement_id, {comment: this.comment.text}).then(res => {
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
          worth:detailData.worth,
          jira_id:detailData.jira_id,
          report_time : detailData.report_time,
          report_expect : detailData.report_expect,
          report_real : detailData.report_real,
          worth_sure : detailData.worth_sure
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
      getRequireLog() {
        console.log(this.requireData)
        requirementApi.getRequirementLog(this.requireData.requirement_id).then(res => {
          this.logData = res.data.data
        }, error => {
          this.$message.error('获取需求记录失败: ' + error.message)
        })
      }
    },
    created() {
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
    /*描述加遮罩*/
    .blockItem.mask .el-form-item__content {
      .mask-desc {
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 1200;
      }
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
    z-index: 1000;
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
    z-index: 1000;
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
    .sub-require-list {
      padding: 20px;
      font-size: 14px;
      color: #606266;
      .sub-require-title {

      }
      .sub-require-content {
        margin-top: 10px;
        border: 1px solid #ccc;
        padding: 10px;
        .sub-list-item {
          padding: 5px 0;
          cursor: pointer;
          &.title-item {
            color: #409eff;
            text-decoration: underline;
          }
        }
      }
    }
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
      display: flex;
      flex-wrap: wrap;
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
</style>

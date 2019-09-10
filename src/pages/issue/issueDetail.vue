<template>
  <div class="drawer" v-transfer-dom :data-transfer="transfer">
    <transition name="fade">
      <div class="drawer-mask" v-show="visible" @click="handleMask"></div>
    </transition>
    <div :class="wrapClasses" @click="handleWrapClick">
      <transition name="moveRight">
        <div class="drawer-right" :style="drawerStyle" v-show="visible">
          <div class="drawer-content">
            <div class="issue-detail-wrap" @click="closeComment">
              <div class="button-bar">
                <!-- <el-button @click="handleClose">取消</el-button> -->
                <!-- 编辑需要对应的版本信息，所以全部的时候不给操作 -->
                <el-button @click="hangleEdit" type="primary">确定</el-button>
                <el-button @click="deleteIssue" type="danger">删除</el-button>
                <el-button
                  @click="doComment"
                  type="success"
                  class="comment-btn"
                >{{comment.status?'提交':'留言'}}</el-button>
              </div>
              <div class="issue-comment" v-if="comment.status">
                <el-input
                  class="comment-text"
                  id="commentInput"
                  ref="commentInput"
                  v-model.trim="comment.text"
                  type="textarea"
                  :rows="4"
                ></el-input>
              </div>
              <div class="issue-number">
                <label>Bug ID：</label>
                {{issueData.issue_number}}
                <button
                  ref="copy"
                  data-clipboard-action="copy"
                  :data-clipboard-text="issueDetailUrl"
                  class="copyIssueLink"
                  @click="copyLink"
                >复制详情链接</button>
              </div>
              <el-form
                :model="editData"
                :rules="rules"
                ref="addForm"
                label-width="110px"
                class="addForm"
                :inline="true"
              >
                <el-form-item label="标题：" prop="title" class="blockItem">
                  <el-input v-model.trim="editData.title"></el-input>
                </el-form-item>
                <el-form-item label="所属模块：" prop="module_id">
                  <el-select v-model="module_id" placeholder="请选择" filterable clearable>
                    <el-option
                      v-for="item in moduleList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="处理人:" prop="handler">
                  <el-select v-model="handler" placeholder="请选择" filterable clearable>
                    <el-option
                      v-for="item in userList"
                      :key="item.userid"
                      :label="item.nickname"
                      :value="item.userid"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="issue类型：" prop="issue_type">
                  <el-select v-model="editData.issue_type" placeholder="请选择" clearable>
                    <el-option
                      v-for="(value,key) in issueSet.type"
                      :key="key"
                      :label="value"
                      :value="parseInt(key)"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="出现机率：" prop="chance">
                  <el-select v-model="editData.chance" placeholder="请选择" clearable>
                    <el-option
                      v-for="(value,key) in issueSet.chance"
                      :key="key"
                      :label="value"
                      :value="parseInt(key)"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="级别：" prop="level">
                  <el-select v-model="editData.level" placeholder="请选择" clearable>
                    <el-option
                      v-for="(value,key) in issueSet.level"
                      :key="key"
                      :label="value"
                      :value="parseInt(key)"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="优先级：" prop="priority">
                  <el-select v-model="editData.priority" placeholder="请选择" clearable>
                    <el-option
                      v-for="(value,key) in issueSet.priority"
                      :key="key"
                      :label="value"
                      :value="parseInt(key)"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="状态：" prop="handle_status">
                  <el-select v-model="editData.handle_status" placeholder="请选择" clearable>
                    <el-option
                      v-for="(value,key) in issueSet.status"
                      :key="key"
                      :label="value"
                      :value="parseInt(key)"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="所属系统：" prop="system">
                  <el-select v-model="editData.system" placeholder="请选择" clearable>
                    <el-option
                      v-for="(value,key) in issueSet.systems"
                      :key="key"
                      :label="value"
                      :value="parseInt(key)"
                    ></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="用户识别度：" prop="detection_chance">
                  <el-select v-model="editData.detection_chance" placeholder="请选择" clearable>
                    <el-option
                      v-for="(value,key) in issueSet.detection_chance"
                      :key="key"
                      :label="value"
                      :value="parseInt(key)"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="绑定的需求：" prop="requirement" class="blockItem">
                  <div v-if="editData.requirement_id&&!showEditRq">
                    ID:{{editData.requirement_id}}&nbsp;
                    <a
                      :href="rqDetailUrlPre+editData.requirement_id"
                      target="_blank"
                    >{{editData.requirement_title}}</a>
                    <i class="el-icon-edit" style="color:#409eff" @click="showEditRq = true"></i>
                  </div>
                  <el-select
                    v-if="!editData.requirement_id || showEditRq"
                    v-model="editData.requirement"
                    filterable
                    clearable
                    remote
                    placeholder="请输入需求标题的关键字或者id进行搜索"
                    :remote-method="getRequirements"
                    :loading="rqLoading"
                    style="width:80%;"
                  >
                    <el-option
                      class="rq_select"
                      v-for="item in requirements"
                      :key="item.id"
                      :label="item.title"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="是否用例覆盖：" prop="case_covered">
                  <el-select
                      v-model="editData.case_covered"
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
                <el-form-item label="版本：" prop="version">
                  <el-select v-model="editData.version" placeholder="请选择">
                    <el-option
                      v-for="item in versionList"
                      :key="item.id"
                      :label="item.title"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="描述：" prop="description" class="blockItem">
                  <editor v-if="visible" v-model="editData.description"></editor>
                </el-form-item>
                <el-form-item class="blockItem" label="图片附件：">
                  <imageUpload
                    v-if="ossData.hasOwnProperty('host')"
                    :ossData="ossData"
                    :showModal="false"
                    v-model="uploadFile.images"
                  ></imageUpload>
                </el-form-item>
                <el-form-item class="blockItem" label="视频附件：">
                  <videoUpload
                    v-if="ossData.hasOwnProperty('host')"
                    :ossData="ossData"
                    :showModal="false"
                    v-model="uploadFile.videos"
                  ></videoUpload>
                </el-form-item>
                <el-form-item class="blockItem" label="普通文件附件：">
                  <fileUpload
                    v-if="ossData.hasOwnProperty('host')"
                    :ossData="ossData"
                    v-model="uploadFile.files"
                  ></fileUpload>
                </el-form-item>
                <el-form-item
                  label="处理状态："
                  class="showDetailItem"
                >{{issueSet.status[issueData.handle_status]}}</el-form-item>
                <el-form-item label="创建时间：" class="showDetailItem">{{issueData.creation_time}}</el-form-item>
                <el-form-item label="修改时间：" class="showDetailItem">{{issueData.modified_time}}</el-form-item>
              </el-form>
              <div class="split-line"></div>
              <ul class="timeline" ref="timeline">
                <li v-for="(item,index) in logData" :key="index">
                  <h3>
                    <span>{{item.modifier_name}}</span>
                    <span class="logContent" v-html="item.operation"></span>
                  </h3>
                  <p>
                    <em>{{item.modified_time}}</em>
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <el-dialog :visible.sync="picPreview">
      <img width="100%" :src="dialogImageUrl" alt>
    </el-dialog>
  </div>
</template>
<script>
import editor from "@/components/editor";
import issueApi from "@/api/issue.js";
import projectApi from "@/api/project.js";
import moduleApi from "@/api/module.js";
import userApi from "@/api/user.js";
import taskApi from "@/api/task.js";
import versionApi from "@/api/version.js";
import setApi from "@/api/settingType.js";
import requirementApi from "@/api/requirement";
import { generateUUID, getSuffix } from "@/utils/util.js";
import TransferDom from "@/directives/transfer-dom";
import imageUpload from "@/pages/requirement/imageUpload";
import videoUpload from "@/pages/requirement/videoUpload";
import fileUpload from "@/pages/requirement/fileUpload";
import Clipboard from "clipboard";
const prefixCls = "drawer";
export default {
  name: "issueDetai",
  directives: { TransferDom },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    drawerStyle: {
      type: Object,
      default() {
        return {};
      }
    },
    issueData: {
      type: Object
    }
  },
  components: {
    editor,
    imageUpload,
    videoUpload,
    fileUpload
  },
  data() {
    return {
      transfer: true,
      visible: this.value,
      editData: {
        module_id: "",
        handler: "",
        issue_type: "",
        chance: "",
        level: "",
        priority: "",
        system: "",
        stage: "",
        title: "",
        attach: "",
        handle_status: "",
        description: "",
        detection_chance: "",
        requirement_id: "",
        requirement: "",
        case_covered:'',
        version:''
      },
      showEditRq: false,
      rqLoading: false,
      requirements: [],
      module_id: "",
      handler: "",
      uploadImages: [],
      uploadFile: {
        images: [],
        files: [],
        videos: []
      },
      rules: {
        chance: [
          { required: true, message: "请填写issue发生概率", trigger: "blur" }
        ],
        title: [
          { required: true, message: "请填写issue标题", trigger: "blur" }
        ],
        level: [
          { required: true, message: "请选择issue级别", trigger: "change" }
        ],
        priority: [
          { required: true, message: "请选择issue优先级", trigger: "change" }
        ]
        // 					detection_chance:[
        // 					{ required: true, message: '请选择issue用户识别度', trigger: 'change' },
        // 					]
      },
      moduleList: [],
      picPreview: false,
      dialogImageUrl: "",
      logData: [],
      comment: {
        status: false,
        text: ""
      },
      editDataChange: false,
      changeCount: 0,
      descriptionChangeCount: 0,
      descriptionEmitChange: false,
      copyBtn: ""
    };
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
    ossData() {
      return this.$store.state.project.ossData;
    },
    uploadParams() {
      return {
        OSSAccessKeyId: this.ossData.accessid,
        policy: this.ossData.policy,
        signature: this.ossData.signature,
        key: `${this.ossData.dir}${this.filename}`,
        success_action_status: 200
      };
    },
    projectId() {
      return this.$route.params.projectId;
    },
    version() {
      return this.$route.params.versionId;
    },
    userId() {
      return this.$store.state.login.userid;
    },
    actionUrl() {
      return this.ossData.host ? this.ossData.host : "";
    },
    userList() {
      return this.$store.state.project.userList;
    },
    issueDetailUrl() {
      let origin = window.location.origin;
      let url = `${origin}/#/project/${this.projectId}/issue/all/issueDetail/${
        this.issueData.issueid
      }`;
      return url;
    },
    rqDetailUrlPre() {
      let origin = window.location.origin;
      let url = `${origin}/#/project/${
        this.projectId
      }/requirement/a1/requirementDetail/`;
      return url;
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
    versionList(){
      return this.$store.state.project.versionList
    },
  },
  watch: {
    issueData: {
      handler: function(val) {
        console.log("detailData", val);
        this.getEditData(val);
        this.changeCount = 0;
      },
      deep: true
    },
    value: {
      handler: function(val) {
        this.visible = val;
        if (val) {
          this.getEditData(this.issueData);
          this.getIssueLog();
          this.changeCount = 0;
          this.descriptionChangeCount = 0;
          setTimeout(() => {
            if (this.descriptionChangeCount == 2) {
              this.descriptionEmitChange = true;
            } else {
              this.descriptionEmitChange = false;
            }
          }, 10);
        }
      },
      deep: true
    },
    editData: {
      handler: function(val) {
        console.log(val)
        this.editDataChange = true;
        this.changeCount++; //首次初始化不算
        console.log("editorchange", val, "--", this.changeCount);
      },
      deep: true
    },
    "editData.description": {
      handler: function(val) {
        this.descriptionChangeCount++;
      },
      deep: true
    },
    module_id: {
      handler: function(val) {
        this.editDataChange = true;
        this.changeCount++; //首次初始化不算
      },
      deep: true
    },
    handler: {
      handler: function(val) {
        this.editDataChange = true;
        this.changeCount++; //首次初始化不算
      },
      deep: true
    },
    uploadFile: {
      handler: function(val) {
        this.editDataChange = true;
        this.changeCount++; //首次初始化不算
      },
      deep: true
    }
  },
  methods: {
    close() {
      let limit = 2;
      if (this.handler && this.module_id) {
        limit = 4;
      } else if (this.handler || this.module_id) {
        limit = 3;
      }
      if (this.descriptionEmitChange) {
        limit = limit + 1;
      }
      console.log("close", this.changeCount, "limit", limit);
      if (this.editDataChange && this.changeCount > limit) {
        this.$confirm("你有修改未保存，是否要关闭窗口?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.closeResetData();
          })
          .catch(() => {
            // this.$message({
            //   type: 'info',
            //   message: '已取消关闭'
            // });
          });
      } else {
        this.closeResetData();
      }
    },
    closeResetData() {
      this.uploadFile = {
        images: [],
        files: [],
        videos: []
      };
      this.$refs.addForm.resetFields();
      this.visible = false;
      this.comment.text = "";
      this.comment.status = false;
      this.handler = "";
      this.module_id = "";
      this.showEditRq = false;
      this.rqLoading = false;
      this.requirements = [];
      console.log("han-mo", this.handler, this.module_id);
      this.$emit("input", false);
      this.editDataChange = false;
    },
    handleMask() {
      this.close();
    },
    handleWrapClick(event) {
      // use indexOf,do not use === ,because ivu-modal-wrap can have other custom className
      const className = event.target.getAttribute("class");
      if (className && className.indexOf("drawer-wrap") > -1) this.handleMask();
    },
    handleClose() {
      this.uploadFile = {
        images: [],
        files: [],
        videos: []
      };
      this.$refs.addForm.resetFields();
      this.handler = "";
      this.module_id = "";
      this.close();
    },
    hangleEdit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          let params = Object.assign({}, this.editData);
          params.handler = this.handler;
          params.module_id = this.module_id;
          params.project_id = parseInt(this.projectId);
          params.attach = JSON.stringify(this.uploadFile);
          if (this.editData.requirement) {
            //绑定需求有修改的情况
            params.requirement_id = this.editData.requirement;
            params.requirement_title = this.requirements.filter(
              item => item.id == this.editData.requirement
            )[0].title;
          }
          // if (this.version != "all") {
          //   params.version = parseInt(this.version);
          // }
          // params.creator = this.userId
          params.modifier = this.userId;
          let changes = params;
          params = dealObjectValue(params);
          issueApi.editIssue(this.issueData.issueid, params).then(
            res => {
              this.$message({
                message: "Issue修改成功！",
                type: "success"
              });
              this.uploadImages = [];
              this.visible = false;
              this.$refs.addForm.resetFields();
              this.editDataChange = false;
              this.changeCount = 0;
              changes.issueid = this.issueData.issueid;
              let dict_data = { "0": 5, "1": 4, "2": 3, "3": 2, "4": 1 };
              changes.rank = dict_data[params.chance] * dict_data[params.level];
              this.$emit("data-change", changes);
              this.close();
              this.rqLoading;
              this.$emit("input", false);
            },
            error => {
              this.$message.error("操作失败：" + error.message);
            }
          );
        } else {
          this.$message.error("请填写相关字段！");
          return false;
        }
      });
    },
    deleteIssue() {
      this.$confirm(
        `此操作将删除该缺陷:${this.issueData.issue_number}, 是否继续?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        issueApi.deleteIssue({ id: this.issueData.issueid }).then(
          res => {
            this.$message({
              message: "issue删除成功！",
              type: "success"
            });
            this.editDataChange = false;
            this.changeCount = 0;
            this.close();
            this.$emit("data-delete");
          },
          error => {
            this.$message.error(`删除失败: ${error.message}`);
            // this.close()
          }
        );
      });
    },
    doComment() {
      if (this.comment.status && !this.comment.text) {
        this.$message.error("请先填写留言！");
        return false;
      }
      this.comment.status = !this.comment.status;
      if (this.comment.status) {
        this.$nextTick(() => {
          document.getElementById("commentInput").focus();
        });
      }
      if (!this.comment.status) {
        issueApi
          .addComment(this.issueData.issueid, { comment: this.comment.text })
          .then(
            res => {
              this.$message.success("添加留言成功！");
              this.comment.text = "";
              this.getIssueLog();
            },
            error => {
              this.$message.error("添加留言失败: " + error.message);
            }
          );
      }
    },
    closeComment(event) {
      if (
        event.target.className.indexOf("comment-btn") == -1 &&
        event.target.parentElement.className.indexOf("comment-btn") == -1 &&
        event.target.parentElement.className.indexOf("comment-text") == -1 &&
        event.target.className.indexOf("issue-comment") == -1
      ) {
        this.comment.status = false;
        this.comment.text = "";
      }
      // if(event.target)
    },
    getEditData(detailData) {
      console.log("editIssueDetaildatas", detailData);
      this.changeCount = 0;
      this.editData = {
        system: detailData.system,
        issue_type: detailData.issue_type,
        chance: detailData.chance,
        level: detailData.level,
        priority: detailData.priority,
        stage: detailData.stage,
        title: detailData.title,
        handle_status: detailData.handle_status,
        description: detailData.description,
        detection_chance: detailData.detection_chance,
        requirement_id: detailData.requirement_id,
        requirement_title: detailData.requirement_title,
        case_covered: detailData.case_covered
      };
      let upload =
        detailData.attach != ""
          ? JSON.parse(detailData.attach)
          : {
              images: [],
              files: [],
              videos: []
            };
      this.uploadFile = upload;
      if (detailData.creator && detailData.creator.length != 0) {
        this.editData.creator = detailData.creator[0].id;
      } else {
        this.editData.creator = "";
      }
      if (detailData.version && detailData.version.length != 0) {
        this.$set(this.editData,'version',detailData.version[0].id)
      } else {
        this.editData.version = "";
      }
      if (detailData.handler && detailData.handler.length != 0) {
        this.editData.handler = detailData.handler[0].id;
        this.handler = detailData.handler[0].id;
      } else {
        this.editData.handler = "";
        this.handler = "";
      }
      if (detailData.module && detailData.module.length != 0) {
        this.editData.module_id = detailData.module[0].id;
        this.module_id = detailData.module[0].id;
      } else {
        this.editData.module_id = "";
        this.module_id = "";
      }
    },
    getModuleList() {
      moduleApi.getModuleByProject(this.projectId).then(res => {
        this.moduleList = res.data.data;
      });
    },
    getTaskCaseList() {
      taskApi.getTCaseByProject(this.projectId).then(res => {
        this.taskCaseList = res.data.data;
      });
    },
    getIssueLog() {
      issueApi.getIssueLog(this.issueData.issueid).then(
        res => {
          this.logData = res.data.data;
        },
        error => {
          this.$message.error("获取缺陷记录失败:" + error.message);
        }
      );
    },
    copyLink() {
      let _this = this;
      let clipboard = _this.copyBtn;
      clipboard.on("success", function() {
        _this.$message({
          /*这是使用了element-UI的信息弹框*/
          message: "复制成功！",
          type: "success"
        });
      });
      clipboard.on("error", function() {
        _this.$message({
          message: "复制失败，请手动选择复制！",
          type: "error"
        });
      });
    },
    getRequirements(query) {
      if (query) {
        this.rqLoading = true;
        let params = {
          projectid: this.projectId,
          id_or_title: query
        };
        requirementApi.getAllRqList(params).then(
          res => {
            this.requirements = res.data.data;
            this.rqLoading = false;
          },
          error => {
            this.rqLoading = false;
            console.log("获取需求失败！");
          }
        );
      } else {
        this.rqLoading = false;
        this.requirements = [];
      }
    }
  },
  created() {
    this.getModuleList();
  },
  mounted() {
    this.copyBtn = new Clipboard(this.$refs.copy);
  }
};
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
<style lang="scss" >
.issue-detail-wrap {
  .showDetailItem {
    .el-form-item__label {
      color: #99a9bf;
    }
  }
  .blockItem .el-form-item__content {
    width: 740px;
  }
}
.issue-comment {
  .el-textarea__inner {
    resize: none;
    border: none;
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
  background-color: rgba(55, 55, 55, 0.6);
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
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}
.moveRight-enter-active,
.moveRight-appear {
  opacity: 0;
  animation-timing-function: ease-in-out;
  animation-duration: 0.5s;
  animation-fill-mode: both;
  animation-play-state: paused;
  animation-name: moveRightIn;
  animation-play-state: running;
}
.moveRight-leave-active {
  animation-timing-function: ease-in-out;
  animation-duration: 0.5s;
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
.issue-detail-wrap {
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
  z-index: 20;
  button {
    display: block;
    margin-bottom: 15px;
  }
  .el-button + .el-button {
    margin-left: 0;
  }
}
.issue-comment {
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
.issue-number {
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
    span {
      color: rgb(7, 95, 184);
      min-width: 65px;
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
.copyIssueLink {
  padding: 5px 10px;
  margin-left: 20px;
  color: #409eff;
  background: #ecf5ff;
  border-color: #b3d8ff;
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;
  outline: none;
}
.rq_select {
  max-width: 700px;
}
</style>

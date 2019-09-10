<template>
  <div
    class="taskResult"
    :style="{height:winHeight+'px','margin-left': versionPanelVisible ? '240px' : '0px'}"
  >
    <el-breadcrumb separator="/" class="taskResultCrumb">
      <el-breadcrumb-item class="title_name">
        <icon-font iconClass="dakaisanshu" @click.native="toggleSide"></icon-font>
      </el-breadcrumb-item>
      <el-breadcrumb-item class="title_name">
        <span>{{curProject.name}}</span>
      </el-breadcrumb-item>
      <el-breadcrumb-item
        v-if="versionId == 'all'"
        class="title_name"
        :to="{ name:'versionDetail',params:{versionId:versionId}}"
      >
        <span>所有任务</span>
      </el-breadcrumb-item>
      <el-breadcrumb-item
        v-if="versionId !== 'all'"
        class="title_name"
        :to="{ name:'versionDetail',params:{versionId:versionId}}"
      >
        <span>{{version.title}}</span>
      </el-breadcrumb-item>
      <el-breadcrumb-item class="title_name">
        <span>任务详情</span>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="task-result-wrap">
      <div class="result-count">
        <div class="counts">
          <div class="des">
            <span>
              <em class="pass-per">{{passPercent}}%</em>测试通过
            </span>
            <span class="dot-span"></span>
            <span>
              已测用例
              <em class="complete">{{testedCount}}</em>
              <em class="all">/ {{allCount}}</em>
            </span>
          </div>
          <div class="bar">
            <div class="bar-inner">
              <el-tooltip :content="'测试通过率：'+ bar.success.width" placement="top">
                <div class="success" :style="bar.success"></div>
              </el-tooltip>
              <el-tooltip :content="'测试失败率：'+ bar.fail.width" placement="top">
                <div class="fail" :style="bar.fail"></div>
              </el-tooltip>
              <el-tooltip :content="'测试跳过率：'+ bar.skip.width" placement="top">
                <div class="skip" :style="bar.skip"></div>
              </el-tooltip>
              <el-tooltip
                class="unexecuted"
                :content="'未测试率：'+ bar.unexecuted.width"
                placement="top"
              >
                <div :style="bar.unexecuted"></div>
              </el-tooltip>
            </div>
          </div>
        </div>
        <div class="split-line"></div>
        <div class="status">
          <span class="up">{{caseCovers}} %</span>
          <span class="down">用例库覆盖</span>
        </div>
      </div>
      <template v-if="testReport||taskResult.image || taskResult.files.length>0">
        <div class="switch-edit">
          <el-button type="primary" @click="uploadTaskResult">确定</el-button>
        </div>
      </template>
      <template v-else>
        <div class="switch-edit-1" v-if="!showEditArea">
          添加测试总结：
          <el-button type="primary" icon="el-icon-edit" circle @click="showEditAreaFun"></el-button>
        </div>
        <div class="switch-edit" v-if="showEditArea">
          <el-button type="primary" @click="uploadTaskResult">确定</el-button>
        </div>
      </template>

      <ul class="result-des" v-if="showEditArea">
        <li>
          <label>测试总结：</label>
          <editor class="task-testReport" v-model="testReport"></editor>
        </li>
        <!-- 
        <li><label>图片附件：</label><imageUpload v-if="ossData.hasOwnProperty('host')" :ossData="ossData" v-model="taskResult.image"></imageUpload></li>-->
        <li>
          <label>文件附件：</label>
          <fileUpload
            v-if="ossData.hasOwnProperty('host')"
            :ossData="ossData"
            v-model="taskResult.files"
          ></fileUpload>
        </li>
      </ul>
      <div class="split-line"></div>
      <el-button
        v-if="taskCaseList.length>0"
        type="primary"
        style="margin-top: 10px;"
        @click="exoportCase"
      >导出用例</el-button>
      <div class="module-cases">
        <div class="m-item" v-for="(item,index) in taskCaseList">
          <div class="module" @click="toggleOpen(item,index)">
            <span class="title">
              <img src="../../../../assets/img/moduleTag1.png" alt>
              {{item.module_name}}
            </span>
            <span class="case-total">{{item.info.length}}</span>
            <i class="el-icon el-icon-arrow-left" :class="{open:item.isOpen}"></i>
          </div>
          <ul class="cases" v-if="item.isOpen">
            <li class="title-bar">
              <span class="status">用例结果</span>
              <span class="number">编号</span>
              <span class="title">标题</span>
              <span class="handler">处理人</span>
              <span class="priority">优先级</span>
            </li>
            <li class="case-item" v-for="subItem in item.info">
              <span class="status">
                <i class="status-icon" :class="getStatusIcon(subItem.status)"></i>
                {{getTaskCaseStatus(subItem.status)}}
              </span>
              <span class="number">{{subItem.cnumber}}</span>
              <span class="title">{{subItem.title}}</span>
              <span class="handler">{{subItem.handler_name}}</span>
              <span class="priority">{{getCasePriority(subItem.priority)}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import editor from "@/components/editor";
import taskApi from "@/api/task.js";
import taskcaseApi from "@/api/taskcase.js";
import ossApi from "@/api/oss.js";
import imageUpload from "@/pages/project/version/task/imageUpload";
import fileUpload from "@/pages/project/version/task/fileUpload";
export default {
  name: "TaskResult",
  data() {
    return {
      winHeight: window.innerHeight - 70,
      taskInfo: {},
      bar: {
        success: {
          width: "0"
        },
        fail: {
          width: "0"
        },
        skip: {
          width: "0"
        },
        unexecuted: {
          width: "0"
        }
      },
      taskResult: {
        image: "",
        files: []
      },
      testReport: "",
      taskCaseList: [],
      passPercent: "100",
      testedCount: 0,
      allCount: 0,
      caseCovers: 0,
      showEditArea: false
    };
  },
  components: {
    editor,
    imageUpload,
    fileUpload
  },
  computed: {
    versionPanelVisible() {
      return this.$store.state.version.visible;
    },
    projectId() {
      return parseInt(this.$route.params.projectId);
    },
    taskId() {
      return this.$route.params.taskId;
    },
    versionId() {
      if (this.$route.params.versionId == "all") {
        return "all";
      } else {
        return parseInt(this.$route.params.versionId);
      }
    },
    ossData() {
      return this.$store.state.project.ossData;
    },
    curProject() {
      return this.$store.state.project.currentProject;
    },
    versionList() {
      return this.$store.state.project.versionList;
    },
    version() {
      let v = {};
      let v1 = [];
      if (this.versionList && this.versionList.length > 0) {
        v1 = this.versionList.filter(item => {
          if (item.id == this.versionId) {
            return item;
          }
        });
        v = v1[0];
      }
      return v;
    }
  },
  created() {
    this.getTaskData();
    this.getTaskCaseList();
  },
  watch: {
    taskId() {
      this.getTaskData();
    }
  },
  beforeDestroy() {
    this.$store.commit("CHANGE_VISIBLE", true);
  },
  methods: {
    toggleSide() {
      this.$store.commit("TOGGLE_VISIBLE");
    },
    getTaskData() {
      taskApi.getSingleTask({ id: this.taskId }).then(
        res => {
          this.taskInfo = res.data.data[0];
          console.log("taskInfo", this.taskInfo);
          this.passPercent =
            this.taskInfo.casestatus.sum === 0
              ? 100
              : Math.round(
                  (this.taskInfo.casestatus.pass * 100) /
                    this.taskInfo.casestatus.sum
                );
          this.allCount = this.taskInfo.casestatus.sum;
          this.testedCount =
            this.taskInfo.casestatus.pass + this.taskInfo.casestatus.fail;
          if (this.taskInfo.casestatus.sum !== 0) {
            let successWidth = Math.round(
              (this.taskInfo.casestatus.pass * 100) /
                this.taskInfo.casestatus.sum
            );
            let failWidth = Math.round(
              (this.taskInfo.casestatus.fail * 100) /
                this.taskInfo.casestatus.sum
            );
            let skipWidth = Math.round(
              (this.taskInfo.casestatus.skip * 100) /
                this.taskInfo.casestatus.sum
            );
            let unexecutedWidth = Math.round(
              (this.taskInfo.casestatus.unexecuted * 100) /
                this.taskInfo.casestatus.sum
            );

            if (this.taskInfo.unexecuted == 0) {
              unexecutedWidth = 0;
              skipWidth = 100 - successWidth - failWidth;
            }
            this.bar.success.width = successWidth + "%";
            this.bar.fail.width = failWidth + "%";
            this.bar.skip.width = skipWidth + "%";
            this.bar.unexecuted.width = unexecutedWidth + "%";
            this.caseCovers = successWidth + failWidth + skipWidth;
          }
          this.testReport = this.taskInfo.testreport;
          if (this.taskInfo.attach) {
            let attach = JSON.parse(this.taskInfo.attach);
            this.taskResult.image = attach.image;
            this.taskResult.files = attach.files;
          }
          if (
            this.testReport ||
            this.taskResult.image ||
            this.taskResult.files.length > 0
          ) {
            this.showEditArea = true;
          }
        },
        error => {
          this.$message.error("获取任务详情失败:" + error.message);
        }
      );
    },
    getStatusIcon(status) {
      let type = "";
      switch (status) {
        case 0:
          type = "new-icon";
          break;
        case 2:
          type = "el-icon-remove";
          break;
        case 3:
          type = "el-icon-success";
          break;
        case 4:
          type = "el-icon-error";
          break;
      }
      return type;
    },
    getTaskCaseStatus(status) {
      let text = "其他";
      switch (status) {
        case 0:
          text = "新增";
          break;
        case 1:
          text = "已删除";
          break;
        case 2:
          text = "跳过";
          break;
        case 3:
          text = "通过";
          break;
        case 4:
          text = "失败";
          break;
      }
      return text;
    },
    getCasePriority(p) {
      let text = "无";
      switch (p) {
        case 0:
          text = "紧急";
          break;
        case 1:
          text = "高";
          break;
        case 2:
          text = "中";
          break;
        case 3:
          text = "低";
          break;
      }
      return text;
    },
    getTaskCaseList() {
      let params = {
        projectid: this.projectId,
        taskid: this.taskId
      };
      if (this.versionId != "all") {
        params.versionid = this.versionId;
      }
      taskcaseApi.searchTaskcaseList(params).then(
        res => {
          let tData = res.data.data;
          if (tData.length && tData.length > 0) {
            console.log("tasklist", this.taskCaseList);
            tData.forEach((item, index) => {
              item.isOpen = true;
            });
          }
          this.taskCaseList = tData;
        },
        error => {
          this.$message.error(`获取失败:${error.message}`);
          this.loading = false;
        }
      );
    },
    toggleOpen(item, index) {
      this.taskCaseList[index].isOpen = !item.isOpen;
    },
    showEditAreaFun() {
      this.showEditArea = true;
    },
    uploadTaskResult() {
      // this.showEditArea = false
      let attach = JSON.stringify(this.taskResult);
      let params = { testreport: this.testReport, attach: attach };
      taskApi.editTaskResult(this.taskId, params).then(
        res => {
          this.$message.success("提交成功！");
          this.getTaskData();
        },
        error => {
          this.$message.error(`提交失败: ${error.message}`);
        }
      );
    },
    exoportCase() {
      let params = {
        project_id: this.projectId,
        task_id: this.taskId
      };
      taskcaseApi.exportTaskcase(params).then(
        res => {
          let url = res.data.data.url;
          window.open(url);
          this.$message.success("导出成功");
        },
        error => {
          this.$message.error("导出失败:" + error.message);
        }
      );
    },
    $resize() {
      this.winHeight = window.innerHeight - 70;
    }
  },
  mounted() {
    window.addEventListener("resize", this.$resize, true);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.$resize);
  }
};
</script>
<style lang="scss">
.taskResult {
  padding: 20px 0 0 20px;
  overflow: auto;
}
.taskResult_content {
  padding-left: 40px;
}
.title_name {
  span {
    font-weight: 800;
    color: black;
  }
}
.q-crumb {
  padding: 0 0 10px 0;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ddd;
  margin-bottom: 20px;
  .el-icon-tickets {
    display: block;
    margin-right: 5px;
    color: #33c0fb;
    font-size: 18px;
  }
  .el-breadcrumb {
    font-size: 16px;
  }
}

.q-opt {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  .q-search {
    width: 200px;
  }
}
</style>
<style lang="scss" scoped>
.split-line {
  width: 100%;
  height: 1px;
  background: rgba(0, 0, 0, 0.07);
}
.task-testReport {
  width: 90%;
}
.permission-unit {
  display: inline-block;
  padding: 0 10px;
  margin: 0 5px;
  background-color: #b9dbff;
  border-radius: 3px;
  color: #fff;
}

.detail-content {
  display: flex;
  label {
    display: block;
    width: 120px;
  }
  ul {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    li {
      margin: 2px 5px;
    }
  }
}

.case-wrap {
  max-height: 600px;
  overflow: auto;
}

ul.module {
  > li {
    margin-bottom: 10px;
    img {
      width: 25px;
      margin-right: 10px;
      vertical-align: middle;
    }
  }
}

ul.case {
  margin: 10px 0 10px 15px;
  span {
    margin: 2px 5px;
  }
}

.case {
  .el-checkbox + .el-checkbox {
    margin-left: 0;
  }
}
.taskResultCrumb {
  margin-bottom: 20px;
}
.result-count {
  padding: 10px 20px 10px 10px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  .counts {
    flex: 1;
    .des {
      display: flex;
      align-items: center;
      color: #000;
      font-weight: 700;
      margin-bottom: 10px;
      .pass-per {
        margin-right: 5px;
      }
      .complete {
        margin-left: 5px;
      }
      .all {
        color: #999;
      }
      .dot-span {
        width: 3px;
        height: 3px;
        border-radius: 50%;
        margin: 0px 16px;
        background: #c9cfd7;
      }
    }
    .bar {
      height: 12px;
      width: 100%;
      background-color: #ebeef5;
      overflow: hidden;
      position: relative;
      vertical-align: middle;
      .bar-inner {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        .success {
          height: 100%;
          background-color: #67c23a;
        }
        .fail {
          height: 100%;
          background-color: #f56c6c;
        }
        .skip {
          height: 100%;
          background-color: #908f8f;
        }
        .unexecuted {
          height: 100%;
        }
      }
    }
  }
  .split-line {
    width: 1px;
    height: 56px;
    margin: 0px 32px;
    background: rgba(0, 0, 0, 0.07);
  }
  .status {
    display: flex;
    flex-direction: column;
    align-items: center;
    span {
      display: block;
      flex: 1;
      &.up {
        font-size: 24px;
      }
    }
  }
}
.result-des {
  margin-top: 10px;
  padding-right: 20px;
  li {
    display: flex;
    align-items: flex-start;
    margin-bottom: 10px;
    label {
      width: 100px;
    }
  }
}
.module-cases {
  margin-top: 10px;
  padding: 10px;
  background-color: rgba(176, 176, 176, 0.1);
  .m-item {
    margin-bottom: 10px;
    background-color: #fff;
    background: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
  .module {
    display: flex;
    align-items: center;
    padding: 10px;
    height: 40px;
    position: relative;
    .title {
      display: flex;
      align-items: center;
      margin-right: 10px;

      img {
        height: 18px;
        margin-right: 10px;
      }
    }
    .el-icon {
      position: absolute;
      right: 30px;
      top: 14px;
      margin-right: 5px;
      color: #999;
    }
    .el-icon.open {
      transform: rotate(-90deg);
    }
    .case-total {
      min-width: 24px;
      font-weight: bold;
      font-size: 12px;
      height: 16px;
      line-height: 14px;
      color: white;
      margin-left: 8px;
      -webkit-box-flex: 0;
      -ms-flex: 0 1 auto;
      flex: 0 1 auto;
      padding: 0px 8px;
      background: #5697f7;
      border-radius: 8px;
    }
  }
  .cases {
    margin: 0;
    padding: 0;
    .title-bar {
      display: flex;
      color: #aaa;
      padding: 0 10px 10px;
      position: relative;
      font-size: 12px;
      &::after {
        position: absolute;
        content: "";
        width: 100%;
        height: 2px;
        background-color: #eee;
        bottom: 1px;
        left: 0;
      }
    }
    .case-item {
      display: flex;
      padding: 8px 10px;
      font-size: 14px;
      .status {
        display: flex;
        align-items: center;
        .status-icon {
          margin-right: 8px;
          min-width: 10px;
          &.el-icon-success {
            color: #67c23a;
          }
          &.el-icon-error {
            color: #f56c6c;
          }
          &.el-icon-remove {
            color: #909399;
          }
          &.el-icon-circle-plus {
            color: #b5d1ef;
          }
        }
      }
    }
    .status {
      width: 90px;
    }
    .number {
      width: 100px;
    }
    .title {
      flex: 1;
    }
    .handler {
      width: 100px;
    }
    .priority {
      width: 80px;
    }
  }
}
.switch-edit-1 {
  padding-left: 10px;
}
.new-icon {
  position: relative;
  width: 17px;
  display: inline-block;
  &::after {
    content: "N";
    position: absolute;
    left: 3px;
    top: -9px;
    color: #84f305;
  }
}
</style>

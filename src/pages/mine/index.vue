<template>
  <div>
    <div class="mine-wrap">
      <div class="mine-nav">
        <div class="type-wrap">
          <i class="el-icon-time"></i>
          <el-select v-model="taskType" filterable placeholder="请选择">
            <el-option
              v-for="item in tasks"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <vuescroll :ops="ops">
          <ul class="projects" title="可拖动查看更多的项目">
            <li
              v-for="item in projects"
              :key="item.id"
              :class="{active:selectPro == item.id}"
              @click="selectProFun(item.id)"
            >{{item.name}}</li>
          </ul>
        </vuescroll>
      </div>
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="issue" name="first">
          <el-input placeholder="输入标题或ID关键字" v-model="issueTitle" class="m-search" clearable>
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <a-table :dataSource="filterIssueData" :rowKey="record => record.id"  :scroll="{ x: true }">
            <a-table-column title="ID" width="80px" data-index="id" key="id">
              <template slot-scope="text, record">
              <router-link
                :to="{name:'issueDetailPage',params:{projectId:record.project_id,versionId:'all',issueId:record.id}}"
              >{{record.id}}</router-link>
            </template>
            </a-table-column>
            <a-table-column title="标题" data-index="title" key="title" width="300px">
              <template slot-scope="text, record">
              <router-link  class="fixed-width-title" :title="record.title"
                :to="{name:'issueDetailPage',params:{projectId:record.project_id,versionId:'all',issueId:record.id}}"
              >{{record.title}}</router-link>
            </template>
            </a-table-column>
            <a-table-column title="版本" data-index="version_name" key="version_name"/>
            <a-table-column title="严重程度" data-index="level" key="level">
              <template slot-scope="text, record">{{getLevel(record.level)}}</template>
            </a-table-column>
            <a-table-column title="优先级" data-index="priority" key="priority">
              <template slot-scope="text, record">{{getPriority(record.priority)}}</template>
            </a-table-column>
            <a-table-column title="状态" data-index="handle_status" key="handle_status">
              <template slot-scope="text, record">{{issueStatus[record.handle_status]}}</template>
            </a-table-column>
            
            <a-table-column title="处理人" data-index="handler_name" key="handler_name"/>
            <a-table-column title="创建人" data-index="creator_name" key="creator_name"/>
          </a-table>
        </el-tab-pane>
        <el-tab-pane label="任务" name="second">
          <el-input placeholder="输入标题或ID关键字" v-model="taskTitle" class="m-search" clearable>
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <a-table :dataSource="filterTaskData" :rowKey="record => record.id">
            <a-table-column title="ID" width="80px" data-index="id" key="id">
              <template slot-scope="text, record">
                <router-link
                  :to="{name:'taskResult',params:{projectId:record.project_id,versionId:'all',taskId:record.id}}"
                >{{record.id}}</router-link>
              </template>
            </a-table-column>
            <a-table-column title="标题" data-index="name" key="name">
              <template slot-scope="text, record">
                <router-link class="fixed-width-title" :title="record.name"
                  :to="{name:'taskResult',params:{projectId:record.project_id,versionId:'all',taskId:record.id}}"
                >{{record.name}}</router-link>
              </template>
            </a-table-column>
            <a-table-column title="任务方法" data-index="tmethod" key="tmethod"/>
            <a-table-column title="任务类型" data-index="ttype" key="ttype"/>
            <a-table-column title="开始时间" data-index="start_time" key="start_time"/>
            <a-table-column title="结束时间" data-index="end_time" key="end_time"/>
            <a-table-column title="版本" data-index="version_name" key="version_name"/>
            <a-table-column title="执行人" data-index="executor_name" key="executor_name"/>
            <a-table-column title="创建人" data-index="creator_name" key="creator_name"/>
          </a-table>
        </el-tab-pane>
        <el-tab-pane label="执行用例" name="third" v-if="taskType!=3">
          <el-input placeholder="输入标题或ID关键字" v-model="taskcaseTitle" class="m-search" clearable>
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <a-table :dataSource="filterTaskcaseData" :rowKey="record => record.cnumber">
            <a-table-column title="编号" width="90px" data-index="cnumber" key="cnumber">
              <template slot-scope="text, record">
                <router-link
                  :to="{name:'taskcaseDetail',params:{projectId:record.project_id,versionId:'all',taskcaseId:record.taskcaseid}}"
                >{{record.cnumber}}</router-link>
              </template>
            </a-table-column>
            <a-table-column title="标题" data-index="title" key="title">
              <template slot-scope="text, record">
                <router-link class="fixed-width-title" :title="record.title"
                  :to="{name:'taskcaseDetail',params:{projectId:record.project_id,versionId:'all',taskcaseId:record.taskcaseid}}"
                >{{record.title}}</router-link>
              </template>
            </a-table-column>
            <a-table-column title="所属模块" data-index="module_name" key="module_name"/>
            <a-table-column title="测试结果" data-index="status" key="status">
              <template slot-scope="text, record">{{getTaskCaseStatus(record.status)}}</template>
            </a-table-column>
            <a-table-column title="处理人" data-index="handler_name" key="handler_name"/>
          </a-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import projectApi from "@/api/project.js";
import mineApi from "@/api/mine.js";
import vuescroll from "vuescroll";
export default {
  data() {
    return {
      loading: true,
      taskType: 1,
      tasks: [
        {
          value: 1,
          label: "我的待办"
        },
        {
          value: 2,
          label: "我的已办"
        },
        {
          value: 3,
          label: "我创建的"
        }
      ],
      activeName: "first",
      projects: [],
      issueData: [],
      taskCaseData: [],
      taskData: [],
      selectPro: "",
      ops: {
        vuescroll: {
          mode: "slide",
          zooming: false
        },
        scrollPanel: {},
        rail: {
          background: "#000",
          opacity: 0,
          size: "6px",
          specifyBorderRadius: false,
          gutterOfEnds: null,
          gutterOfSide: "2px",
          keepShow: false
        },
        bar: {
          showDelay: 500,
          onlyShowBarOnScroll: true,
          keepShow: false,
          background: "#c1c1c1",
          opacity: 1,
          hoverStyle: false,
          specifyBorderRadius: false,
          minSize: false,
          size: "6px"
        }
      },
      issueTitle: "",
      taskTitle: "",
      taskcaseTitle: "",
      settings:{
        issue_config:{}
      }
    };
  },
  components: {
    vuescroll
  },
  watch: {
    taskType: {
      handler: function(val) {
        this.selectPro = "";
        this.getInitData(val);
      },
      deep: true
    }
  },
  computed: {
    projectId() {
      return this.$route.params.projectId;
    },
    userId() {
      return this.$store.state.login.userid;
    },
    filterIssueData() {
      let data = this.issueData;
      if (this.issueTitle) {
        data = data.filter(item => {
          if (item.title.includes(this.issueTitle)||item.id.toString().includes(this.issueTitle)) {
            return item;
          }
        });
      }
      return data;
    },
    filterTaskData() {
      let data = this.taskData;
      if (this.taskTitle) {
        data = data.filter(item => {
          if (item.name.includes(this.taskTitle)||item.id.toString().includes(this.taskTitle)) {
            return item;
          }
        });
      }
      return data;
    },
    filterTaskcaseData() {
      let data = this.taskCaseData;
      if (this.taskcaseTitle) {
        data = data.filter(item => {
          if (item.title.includes(this.taskcaseTitle)||item.id.toString().includes(this.taskcaseTitle)) {
            return item;
          }
        });
      }
      return data;
    },
    issueStatus(){
      return this.settings.issue_config.status
    }
  },
  methods: {
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
    getIssueStatus(type) {
      let text = "";
      switch (type) {
        case 1:
          text = "待办";
          break;
        case 2:
          text = "修复中";
          break;
        case 3:
          text = "测试中";
          break;
        case 4:
          text = "已关闭";
          break;
        case 5:
          text = "已拒绝";
          break;
        case 6:
          text = "延时处理";
          break;
      }
      return text;
    },
    getPriority(type) {
      let text = "";
      switch (type) {
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
    getLevel(level) {
      let text = "";
      switch (level) {
        case 0:
          text = "阻塞";
          break;
        case 1:
          text = "严重";
          break;
        case 2:
          text = "重要";
          break;
        case 3:
          text = "次要";
          break;
        case 4:
          text = "微小";
          break;
      }
      return text;
    },
    getMineProjects() {
      projectApi.getProjectList({ userid: this.userId }).then(res => {
        this.projects = res.data.data;
      });
    },
    getInitData(type, projectId) {
      let params = {};
      if (projectId) {
        params = {
          projectid: projectId
        };
      }
      if (type == 1) {
        mineApi.getUnfinish(params).then(res => {
          this.loading = false;
          this.issueData = res.data.data.issue_info;
          this.taskCaseData = res.data.data.task_case_info;
          this.taskData = res.data.data.task_info;
        });
      }
      if (type == 2) {
        mineApi.getFinish(params).then(res => {
          this.loading = false;
          this.issueData = res.data.data.issue_info;
          this.taskCaseData = res.data.data.task_case_info;
          this.taskData = res.data.data.task_info;
        });
      }
      if (type == 3) {
        this.activeName = "first";
        mineApi.getCreated(params).then(res => {
          this.loading = false;
          this.issueData = res.data.data.issue_info;
          this.taskData = res.data.data.task_info;
          this.taskCaseData = [];
        });
      }
    },
    selectProFun(id) {
      this.selectPro = id;
      this.getInitData(this.taskType, id);
    },
    getSettings(){
      projectApi.getProjectSettings().then(res=>{
        let data = res.data.data;
        this.settings = data
      },error=>{

      })
    }
  },
  created() {
    this.getSettings()
    this.getMineProjects();
    this.getInitData(this.taskType);
  }
};
</script>
<style lang="scss">
.mine-wrap {
  .m-search {
    width: 260px;
  }
  .mine-nav {
    .el-select > .el-input {
      width: 100px;
    }
    .el-input__inner {
      background-color: #eee;
      padding-left: 4px;
      border-color: #eee;
      color: #0d6dd6;
      font-size: 14px;
    }
    .el-icon-time,
    .el-select .el-input .el-select__caret {
      color: #0d6dd6;
    }
    .el-select .el-input.is-focus .el-input__inner {
      border-color: #eee;
    }
  }
}
</style>
<style lang="scss" scoped>
.mine-wrap {
  padding: 10px 15px;
  max-width: 1600px;
  margin: 30px auto 0;
  text-align: left;
  .mine-nav {
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    background: #eee;
    .type-wrap {
      padding: 0 15px;
      display: flex;
      position: relative;
      align-items: center;
      justify-content: center;
      &::before {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        content: "";
        width: 0;
        height: 0;
        border-width: 10px;
        z-index: 1;
        border-style: dashed solid dashed dashed;
        border-color: transparent #fff transparent transparent;
      }
    }
    .__vuescroll {
      background-color: #fff;
    }
    .projects {
      position: relative;
      margin-left: 15px;
      padding: 10px;
      flex: 1;
      display: flex;
      align-items: center;
      background: #fff;
      justify-content: flex-start;
      li {
        padding: 0 15px;
        cursor: pointer;
        white-space: nowrap;
        &.active {
          color: #317ffe;
        }
      }
    }
  }
}
.ant-table-wrapper {
  margin-top: 10px;
}
.el-tabs{
  padding:5px 8px;
  background: #fff
}
</style>
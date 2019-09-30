<template>
  <div>
    <el-container class="flow-page">
      <el-aside width="auto">
        <el-scrollbar wrap-class="specialList">
          <el-menu
            :default-active="navigationName"
            background-color="#ffffff"
            text-color="#333"
            active-text-color="#fff"
            router
            :collapse="collapsed"
            class="el-menu-vertical-demo"
          >
            <el-submenu index="1">
              <template slot="title">
                <i class="fa fa-reorder"></i>
                <span>流程管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item :index="'/flow/add'" :route="{name:'flowAdd'}">发起流程</el-menu-item>
                <el-menu-item :index="'/flow/list'" :route="{name:'flowList'}">流程列表</el-menu-item>
                <el-menu-item :index="'/flow/flowStatistics'" :route="{name:'flowStatistics'}">流程统计</el-menu-item>
                <el-menu-item :index="'/flow/flowSource'" :route="{name:'flowSource'}">流程资源</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-scrollbar>
      </el-aside>
      <el-container>
        <el-main>
          <div class="flow-content" :style="{'height':winHeight+'px'}">
            <el-breadcrumb separator="/" class="breadCrumb">
              <el-breadcrumb-item class="title_name">
                <icon-font iconClass="dakaisanshu" @click.native="collapse"></icon-font>
              </el-breadcrumb-item>
              <el-breadcrumb-item class="title_name">
                <span>{{project.name}}</span>
              </el-breadcrumb-item>
              <el-breadcrumb-item>
                <span>{{title}}</span>
              </el-breadcrumb-item>
            </el-breadcrumb>
            <router-view></router-view>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import projectApi from "@/api/project.js";
export default {
  data() {
    return {
      collapsed: false,
      navigationName: "",
      project: {},
      winHeight: window.innerHeight - 70
    };
  },
  watch: {
    $route(to) {
      console.log("route", to);
      if (to.name == "flowAdd") {
        this.navigationName = "/flow/add";
      } else if (to.name == "flowSource") {
        this.navigationName = "/flow/flowSource";
      } else if (to.name == "flowStatistics") {
        this.navigationName = "/flow/flowStatistics";
      } else {
        this.navigationName = "/flow/list";
      }
    }
  },
  computed: {
    projectId() {
      return parseInt(this.$route.params.projectId);
    },
    title() {
      let text = "发起流程";
      console.log("this.$route.path", this.$route.path);
      if (this.$route.path.indexOf("/flow/list") != -1) {
        text = "流程列表";
      } else if (this.$route.path.indexOf("/flow/detail") != -1) {
        text = "流程详情";
      } else if (this.$route.path.indexOf("/flow/flowStatistics") != -1) {
        text = "流程统计";
      } else if (this.$route.path.indexOf("/flow/flowSource") != -1) {
        text = "流程资源";
      }
      return text;
    }
  },
  methods: {
    collapse() {
      this.collapsed = !this.collapsed;
    },
    getProjectDetail() {
      projectApi.getSingleProject({ id: this.projectId }).then(res => {
        this.project = res.data.data[0];
      });
    },
    initNavActive() {
      if (this.$route.name == "flowAdd") {
        this.navigationName = "/flow/add";
      } else if (this.$route.name == "flowSource") {
        this.navigationName = "/flow/flowSource";
      } else if (this.$route.name == "flowStatistics") {
        this.navigationName = "/flow/flowStatistics";
      } else {
        this.navigationName = "/flow/list";
      }
    }
  },
  created() {
    this.getProjectDetail();
  },
  mounted() {
    let _this = this;
    window.addEventListener(
      "resize",
      function() {
        _this.winHeight = window.innerHeight - 70;
      },
      true
    );
    this.initNavActive();
  }
};
</script>
<style lang="scss" scoped>
.flow-page {
  .el-aside {
    box-shadow: rgba(0, 0, 0, 0.05) 1px 0px 10px 0px;
  }
  .flow-content {
    padding: 20px 20px 0 20px;
    .breadCrumb {
      margin-bottom: 20px;
    }
  }
  .flow-content {
    overflow: auto;
  }
}
</style>

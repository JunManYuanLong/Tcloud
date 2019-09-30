<template>
  <el-container class="tag-manager">
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
              <span>项目管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item :index="'/tag/staff'" :route="{name:'Staff'}">人员管理</el-menu-item>
              <el-menu-item :index="'/tag/tag'" :route="{name:'Tag'}">标签管理</el-menu-item>
              <el-menu-item :index="'/tag/panelset'" :route="{name:'panelset'}">看板管理</el-menu-item>
              <el-menu-item :index="'/tag/flowset'" :route="{name:'flowset'}">流程管理</el-menu-item>

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
      if (to.name == "Tag") {
        this.navigationName = "/tag/tag";
      } else if (to.name == "panelset") {
        this.navigationName = "/tag/panelset";
      } else if (to.name == "flowset") {
        this.navigationName = "/tag/flowset";
      } else {
        this.navigationName = "/tag/staff";
      }
    }
  },
  computed: {
    projectId() {
      return parseInt(this.$route.params.projectId);
    },
    title() {
      let text = "标签管理";
      console.log("this.$route.path", this.$route.path);
      if (this.$route.path.indexOf("/tag/tag") != -1) {
        text = "标签管理";
      } else if (this.$route.path.indexOf("/tag/staff") != -1) {
        text = "人员管理";
      } else if (this.$route.path.indexOf("/tag/panelset") != -1) {
        text = "看板管理";
      } else if (this.$route.path.indexOf("/tag/flowset") != -1) {
        text = "流程管理";
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
      if (this.$route.name == "Tag") {
        this.navigationName = "/tag/tag";
      } else if (this.$route.name == "panelset") {
        this.navigationName = "/tag/panelset";
      } else if (this.$route.name == "Staff") {
        this.navigationName = "/tag/staff";
      } else if (this.$route.name == "flowset") {
        this.navigationName = "/tag/flowset";
      }
    },
    $resize () {
      this.winHeight = window.innerHeight - 70
    }
  },
  mounted(){
    window.addEventListener('resize', this.$resize, true)
    this.initNavActive();
  },
  beforeDestroy(){
    window.removeEventListener("resize", this.$resize);
  },
  created() {
    this.getProjectDetail();
  }
};
</script>

<style scoped lang="scss">
.tag-manager {
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

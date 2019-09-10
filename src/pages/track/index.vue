<template>
  <div slot="main-content">
    <el-container class="track-manager" v-if="!isRepair">
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
                <span>埋点管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item :index="'/track/sdk'" :route="{name:'sdk'}">SDK</el-menu-item>
                <el-menu-item :index="'/track/report'" :route="{name:'trackReport'}">上报测试</el-menu-item>
                <el-menu-item :index="'/track/track'" :route="{name:'track'}">埋点管理</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-scrollbar>
      </el-aside>
      <el-container>
        <el-main>
          <div class="track-content" :style="{'height':winHeight+'px'}">
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
    <Repair></Repair>
  </div>
</template>

<script>
import Repair from "@/components/Repair";
import projectApi from "@/api/project.js";
import trackApi from "@/api/track.js";
import { mapGetters, mapMutations } from "vuex";

export default {
  data() {
    return {
      isRepair: true,
      collapsed: false,
      navigationName: "",
      project: {},
      winHeight: window.innerHeight - 70
    };
  },
  components: {
    Repair
  },
  watch: {
    $route(to) {
      console.log("route", to);
      if (to.name == "sdk") {
        this.navigationName = "/track/sdk";
      } else if (to.name == "trackReport") {
        this.navigationName = "/track/report";
      } else {
        this.navigationName = "/track/track";
      }
    }
  },
  computed: {
    projectId() {
      return parseInt(this.$route.params.projectId);
    },
    title() {
      let text = "埋点";
      console.log("this.$route.path", this.$route.path);
      if (this.$route.path.indexOf("/track/sdk") != -1) {
        text = "SDK";
      } else if (this.$route.path.indexOf("/track/report") != -1) {
        text = "上报测试";
      } else {
        text = "埋点管理";
      }
      return text;
    },
    projectId() {
      return this.$route.params.projectId / 1;
    }
  },
  methods: {
    ...mapMutations("testing", ["setPlatformInfo"]),
    // 获取埋点平台相关信息
    getPlatformInfo() {
      let params = {
        project_id: this.projectId
      };
      trackApi
        .getPlatformInfo(params)
        .then(res => {
          console.log(res);
          // 存入store中
          this.setPlatformInfo(res.data.data);
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    collapse() {
      this.collapsed = !this.collapsed;
    },
    getProjectDetail() {
      projectApi.getSingleProject({ id: this.projectId }).then(res => {
        this.project = res.data.data[0];
      });
    },
    initNavActive() {
      if (this.$route.name == "sdk") {
        this.navigationName = "/track/sdk";
      } else if (this.$route.name == "trackReport") {
        this.navigationName = "/track/report";
      } else {
        this.navigationName = "/track/track";
      }
    }
  },
  created() {
    // this.getProjectDetail();
    // this.getPlatformInfo();
  },
  mounted() {
    /* let _this = this;
    window.addEventListener(
      "resize",
      function() {
        _this.winHeight = window.innerHeight - 70;
      },
      true
    ); */
    // this.initNavActive();
  }
};
</script>

<style scoped lang="scss">
.track-manager {
  .el-aside {
    box-shadow: rgba(0, 0, 0, 0.05) 1px 0px 10px 0px;
  }

  .track-content {
    padding: 15px 20px 0 20px;

    .breadCrumb {
      margin-bottom: 15px;
    }
  }

  .track-content {
    overflow: auto;
  }
}
</style>

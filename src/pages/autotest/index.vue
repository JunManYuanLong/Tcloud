<template>
  <el-container class="container">
    <!-- 侧边栏 -->
    <el-aside class="aside" width="auto">
      <el-menu
        style="border: 0;"
        :default-active="defaultActive"
        class="auto-el-menu"
        :collapse="isCollapse"
        background-color="#00142a"
        text-color="white"
        active-text-color="white"
        :router="true"
      >
        <el-menu-item index="random">
          <i class="el-icon-document"></i>
          <span slot="title">随机测试</span>
        </el-menu-item>
        <el-menu-item index="report">
          <i class="el-icon-setting"></i>
          <span slot="title">测试报告</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <!-- 面包屑 -->
      <el-header>
        <el-breadcrumb separator="/" style="margin-top: 20px">
          <el-breadcrumb-item  @click.native="switchCollapse" style="cursor: pointer;">
            <icon-font iconClass="dakaisanshu"></icon-font>
          </el-breadcrumb-item>
          <el-breadcrumb-item>自动化测试</el-breadcrumb-item>
          <el-breadcrumb-item>{{ breadText }}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-header>
      <!-- 页面主体 -->
      <el-main style="padding: 0 20px;">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      isCollapse: false,
      defaultActive: 'random',
      breadText: '测试报告'
    };
  },
  methods: {
    // 伸缩侧边栏
    switchCollapse () {
      this.isCollapse = !this.isCollapse
    },
    // 通过当前路由,确定侧边栏active,面包屑文案
    setDefaultActive () {
      this.defaultActive = this.$route.meta.active
      this.breadText = this.$route.meta.breadText
    }
  },
  created () {
    this.setDefaultActive()
  },
  watch: {
    '$route' (newVal) {
      this.defaultActive = this.$route.meta.active
      this.breadText = newVal.meta.breadText
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  height: 100%;
  text-align: left;
  .aside {
    background-color: #00142a;
    .auto-el-menu:not(.el-menu--collapse) {
      width: 200px;
    }
  }
}
</style>


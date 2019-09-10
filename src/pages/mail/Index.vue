<template>
  <el-container class="container">
    <!-- 侧边栏 -->
    <el-aside class="aside" width="auto">
      <el-menu
        style="border: 0;"
        :default-active="defaultActive"
        class="auto-el-menu"
        background-color="white"
        text-color="#00142a"
        active-text-color="#00142a"
        :router="true"
      >
        <el-menu-item index="all">
          <i class="el-icon-message"></i>
          <span slot="title">所有消息</span>
        </el-menu-item>
        <el-menu-item index="unread">
          <i class="el-icon-bell"></i>
          <span slot="title">
            <el-badge :value="getUnReadNum" class="badge-dot" :hidden="!hasDot">未读消息</el-badge>
          </span>
        </el-menu-item>
        <el-menu-item index="hasread">
          <i class="el-icon-tickets"></i>
          <span slot="title">已读消息</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <!-- 页面主体 -->
      <el-main class="mail-main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import mailApi from "@/api/mail.js";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
export default {
  name: "MailIndex",
  data() {
    return {
      defaultActive: "all",
      timer: ""
    };
  },
  computed: {
    ...mapGetters("mail", ["getUnReadNum", "hasDot"]),
    userId() {
      return this.$store.state.login.userid;
    }
  },
  methods: {
    ...mapMutations("mail", ["setUnReadList", "setUnReadNum"]),
    ...mapActions("mail", ["UnReadList"]),
    setDefaultActive() {
      this.defaultActive = this.$route.meta.defaultActive;
    },
    // 轮询未读消息
    loopData() {
      this.timer = setInterval(() => {
        this.UnReadList({ userId: this.userId, timer: this.timer });
      }, 3000);
    }
  },
  created() {
    this.setDefaultActive();
  },
  mounted() {
    this.UnReadList({ userId: this.userId });
    this.loopData();
  },
  watch: {
    $route(newVal) {
      this.defaultActive = this.$route.meta.defaultActive;
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = "";
    }
  }
};
</script>

<style lang="scss" scoped>
.mail-index {
  padding: 15px;
}
.container {
  height: 100%;
  text-align: left;
  padding: 20px;
  .aside {
    background-color: white;
    .auto-el-menu:not(.el-menu--collapse) {
      width: 200px;
    }
  }
  .el-menu-item.is-active {
    background-color: #dfe1e5 !important;
  }
}
.el-main.mail-main {
  padding: 0;
}
</style>
<style>
.badge-dot sup.el-badge__content.is-fixed {
  top: 15px;
  right: 5px;
}
</style>




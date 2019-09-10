<template>
  <div class="caseHeader">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>
        <icon-font iconClass="dakaisanshu" @click.native="handlerCollapse"></icon-font>
      </el-breadcrumb-item>
      <el-breadcrumb-item v-for="(item, index) in title" :key="index">{{title[index]}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>
<script>
import bus from "@/api/bus.js";
export default {
  name: "caseHeader",
  data() {
    return {
      title: ["项目管理", "项目"],
      collapse: false,
      userName: "",
      passwordData: {
        oldPassword: "",
        newPassword: "",
        surePassword: "",
        formVisible: false,
        formLabelWidth: "80px"
      }
    };
  },
  methods: {
    handlerCollapse () {
      this.collapse = !this.collapse;
      bus.$emit('collapse', this.collapse);
    },
    getUserName() {
      // this.$store.state.userName = this.userName;
      this.userName = this.$store.state.userName;
    },
    changePassword() {
      // this.$store.state.userName = this.userName;
      this.$axios
        .post(this.$api.changePasswordApi, {
          oldPassword: this.passwordData.oldPassword,
          newPassword: this.passwordData.newPassword,
          surePassword: this.passwordData.surePassword
        })
        .then(response => {
          if (this.messageShow(this, response)) {
            this.passwordData.formVisible = false;
          }
        });
    },
    logOut(command) {
      if (command === "a") {
        this.$store.commit(types.LOGOUT);
        this.$router.push({ path: "/login" });
        this.$axios.get(this.$api.logoutApi).then(response => {
          if (response.data["status"] === 0) {
            this.$message({
              showClose: true,
              message: response.data["msg"],
              type: "warning"
            });
          } else {
            this.tableData = response.data["msg"];
          }
        });
      } else if (command === "b") {
        this.passwordData.oldPassword = "";
        this.passwordData.newPassword = "";
        this.passwordData.surePassword = "";
        this.passwordData.formVisible = true;
      }
    },

    showTitle(path) {
      if (path === "/manage/projectManage") {
        this.title = ["接口管理", "项目管理"];
      } else if (path === "/manage/caseManage") {
        this.title = ["接口管理", "接口信息"];
      } else if (path === "/manage/sceneConfig") {
        this.title = ["接口管理", "业务配置"];
      } else if (path === "/manage/sceneManage") {
        this.title = ["接口管理", "接口用例"];
      } else if (path === "/manage/buildInFunc") {
        this.title = ["接口管理", "内置函数"];
      } else if (path === "/manage/reportManage") {
        this.title = ["报告管理", "接口报告"];
      }
    },
    getTitle: function() {
      this.showTitle(this.$route.path);
    }
  },
  watch: {
    $route: function(to) {
      this.showTitle(to.path);
      //from 对象中包含当前地址
      //to 对象中包含目标地址
      //其实还有一个next参数的，这个参数是控制路由是否跳转的，如果没写，可以不用写next()来代表允许路由跳转，如果写了就必须写next(),否则路由是不会生效的。
    }
  },
  mounted() {
    this.getTitle();
    this.getUserName();
  }
};
</script>

<style>
.el-header {
  line-height: 60px;
}

.password-style {
  line-height: 10px;
  border-radius: 5px;
}

.el-breadcrumb__inner {
  color: #333;
}

.el-breadcrumb__item:last-child .el-breadcrumb__inner,
.el-breadcrumb__item:last-child .el-breadcrumb__inner a,
.el-breadcrumb__item:last-child .el-breadcrumb__inner a:hover,
.el-breadcrumb__item:last-child .el-breadcrumb__inner:hover {
  color: #333;
}
</style>

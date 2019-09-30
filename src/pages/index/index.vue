<template>
  <div class="common-layout-1">
    <div class="header">
      <router-link :to="{ name: 'index'}" class="logo">
        <img src="../../assets/img/logo.png" alt="logo">
        <span>云测平台</span>
      </router-link>
      <ul class="header-nav" v-if="showBar">
        <router-link
          :class="{current:(activeLink=='Proj'||activeLink == 'team'||activeLink == 'property'||activeLink == 'selfPassword'||activeLink == 'mine'||activeLink == 'feedback'||activeLink == 'selfInfo'||activeLink == 'adminUser'||activeLink == 'adminRole')}"
          tag="li"
          :to="{ name: 'index'}"
        >
          <span>测试中心</span>
        </router-link>
        <router-link
          :class="{current:activeLink=='DeviceList' || activeLink=='useDetail' ||  activeLink.indexOf('useDevices') != -1}"
          tag="li"
          :to="{name:'stf'}"
        >
          <span>云真机</span>
        </router-link>
        <router-link
          :class="{current:(activeLink=='CiList'||activeLink=='ciedit')}"
          tag="li"
          :to="{name:'ci'}"
        >
          <span>持续集成</span>
        </router-link>
        <router-link
          :class="{current: activeLink == 'RandomTest' || activeLink == 'TestReport' || activeLink == 'PerTest' || activeLink == 'PerReport' || activeLink == 'AutoChart'}"
          tag="li"
          :to="{name:'auto'}"
        >
          <span>自动化测试</span>
        </router-link>
        <router-link
          :class="{current:(activeLink=='tool'||activeLink=='toolList')}"
          tag="li"
          :to="{name:'tool'}"
        >
          <span>小工具</span>
        </router-link>
      </ul>
      <div class="user-info">
        <el-popover placement="bottom" trigger="hover" class="feedback" @after-leave="poperLeave">
          <div class="feedback-content">
            <el-form
              :model="feedbackData"
              :rules="feedbackRule"
              label-width="80px"
              ref="feedback"
              class="feedback-form"
            >
              <el-form-item label="描述" prop="comment">
                <el-input type="textarea" :rows="3" v-model.trim="feedbackData.comment"></el-input>
              </el-form-item>
              <el-form-item label="联系方式" prop="contact">
                <el-input v-model.trim="feedbackData.contact"></el-input>
              </el-form-item>
            </el-form>
            <div class="opt">
              <el-button type="primary" @click="feedbackFun">反馈</el-button>
              <router-link :to="{name:'feedback'}" class="toList">已有反馈&gt;&gt;</router-link>
            </div>
          </div>
          <p slot="reference">
            <i class="fa fa-keyboard-o"></i>反馈
          </p>
        </el-popover>
        <el-dropdown class="about-us">
          <p class="el-dropdown-link">
            <i class="fa fa-weixin"></i>联系我们
          </p>
          <el-dropdown-menu slot="dropdown">
            <div class="about-us-content">
              <img src="../../assets/img/wangjie.png" alt>
              <p class="tips">
                企业微信扫描二维码
                <br>联系相关人员处理问题
              </p>
            </div>
          </el-dropdown-menu>
        </el-dropdown>
        <TopBar></TopBar>
        <el-dropdown class="cur-user">
          <p class="el-dropdown-link login-user">
            <img v-if="picture" :src="picture" alt>
            <img class="default" v-else src="../../assets/img/user-icon.png" alt>
            <span>{{nickname}}</span>
          </p>
          <el-dropdown-menu slot="dropdown" class="user-action">
            <el-dropdown-item>
              <div @click="changePassword">
                <i class="fa el-icon-edit"></i>修改密码
              </div>
            </el-dropdown-item>
            <el-dropdown-item>
              <div @click="toSelfInfo">
                <i class="fa fa-user"></i>个人信息
              </div>
            </el-dropdown-item>
            <el-dropdown-item>
              <div @click="loginOutFun">
                <i class="fa fa-power-off"></i>退出登录
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <el-main class="page-main" :style="{'height':winHeight+'px'}">
      <router-view></router-view>
    </el-main>
  </div>
</template>
<script>
import jwtDecode from "jwt-decode";
import Cookies from "js-cookie";
import axios from "axios";
import feedbackApi from "@/api/feedback.js";
import moment from "moment";
import ossApi from "@/api/oss.js";
import userApi from "@/api/user.js";
export default {
  props: {
    showTopBar: {
      type: Boolean,
      default() {
        return true;
      }
    },
    showBar: {
      type: Boolean,
      default() {
        return true;
      }
    }
  },
  name: "layout1",
  data() {
    return {
      dialogVisible: true,
      activeIndex: "1",
      winHeight: window.innerHeight - 66,
      feedbackData: {
        contact: "",
        comment: ""
      },
      feedbackRule: {
        comment: [
          { required: true, message: "请填写反馈描述！", trigger: "change" }
        ],
        contact: [
          { required: true, message: "请填写联系方式！", trigger: "change" }
        ]
      }
    };
  },
  components: {
    TopBar: () => import("@/pages/mail/TopBar.vue")
  },
  computed: {
    nickname() {
      return this.$store.state.login.nickname;
    },
    username() {
      return this.$store.getters.userName;
    },
    userRole() {
      return this.$store.getters.userRole;
    },
    picture() {
      return this.$store.state.login.picture;
    },
    sidebarData() {
      let side = [
        {
          icon: "fa fa-tasks",
          dropdown: true,
          text: "任务管理",
          index: "taskManage",
          children: [
            {
              dropdown: false,
              text: "任务列表",
              index: "task",
              route: { name: "task" }
            }
          ]
        },
        {
          icon: "fa fa-wrench",
          dropdown: true,
          text: "issue管理",
          index: "issueManage",
          children: [
            {
              dropdown: false,
              text: "issue列表",
              index: "issue",
              route: { name: "issue" }
            }
          ]
        },
        {
          icon: "fa fa-reorder",
          dropdown: true,
          text: "用例管理",
          index: "caseManage",
          children: [
            {
              dropdown: false,
              text: "用例列表",
              index: "case",
              route: { name: "case" }
            }
          ]
        },
        {
          icon: "fa fa-product-hunt",
          dropdown: true,
          text: "项目管理",
          index: "projectManage",
          children: [
            {
              dropdown: false,
              text: "项目列表",
              index: "project",
              route: { name: "project" }
            }
          ]
        },
        {
          icon: "fa fa-product-hunt",
          dropdown: true,
          text: "云真机",
          index: "stfManage",
          children: [
            {
              dropdown: false,
              text: "项目列表",
              index: "stf",
              route: { name: "stf" }
            }
          ]
        },
        {
          icon: "fa fa-product-hunt",
          dropdown: true,
          text: "CI",
          index: "ciManage",
          children: [
            {
              dropdown: false,
              text: "CI",
              index: "ci",
              route: { name: "ci" }
            }
          ]
        },
        {
          icon: "fa fa-tablet",
          dropdown: true,
          text: "资产管理",
          index: "propertyManage",
          children: [
            {
              dropdown: false,
              text: "资产列表",
              index: "property",
              route: { name: "property" }
            }
          ]
        },
        {
          icon: "fa fa-list",
          dropdown: true,
          text: "模块管理",
          index: "moduleManage",
          children: [
            {
              dropdown: false,
              text: "模块列表",
              index: "module",
              route: { name: "module" }
            }
          ]
        },
        {
          icon: "fa fa-modx",
          dropdown: true,
          text: "功能管理",
          index: "featureManage",
          children: [
            {
              dropdown: false,
              text: "功能列表",
              index: "feature",
              route: { name: "feature" }
            }
          ]
        },
        {
          icon: "fa fa-user",
          dropdown: true,
          text: "用户管理",
          index: "userManage",
          children: [
            {
              dropdown: false,
              text: "用户列表",
              index: "user",
              route: { name: "user" }
            }
          ]
        }
      ];
      return side;
    },
    isAdmin() {
      return this.$store.getters.isAdmin;
    },
    activeLink() {
      return this.$route.name;
    },
    ossData() {
      return this.$store.state.project.ossData;
    },
    userId() {
      return this.$store.state.login.userid;
    }
  },
  methods: {
    handleClose() {
      this.isShowAboutus = false;
    },
    loginOutFun() {
      this.$store.commit("CLEAR_TOKEN");
      this.$router.push({
        name: "login"
      });
    },
    changePassword() {
      this.$router.push({ name: "selfPassword" });
    },
    toSelfInfo() {
      this.$router.push({ name: "selfInfo" });
    },
    async gettoken() {
      let token = await axios.get("http://stf.ywopt.com/auth/api/skip/mock", {
        params: { name: this.$store.getters.userName }
      });
      return token;
    },
    toStfPage() {
      this.gettoken().then(res => {
        // console.log('tooken',res)
        let url = `http://stf.ywopt.com/?jwt=${res.data.token}`;
        window.open(url);
        // window.location.href = url
      });
    },
    feedbackFun() {
      this.$refs.feedback.validate(valid => {
        if (valid) {
          feedbackApi.createFeedback(this.feedbackData).then(
            res => {
              this.$message.success("提交成功！");
              this.$refs.feedback.resetFields();
            },
            error => {
              this.$message.error(`提交失败，${error.message}`);
              this.$refs.feedback.resetFields();
            }
          );
        }
      });
    },
    poperLeave() {
      this.$refs.feedback.resetFields();
    },
    getOssAuth() {
      let exp = this.ossData.expire; //过期就重新获取
      if (
        this.ossData &&
        this.ossData.expire > 0 &&
        0 < moment.unix(exp).diff(moment().utc(), "days", true) &&
        moment.unix(exp).diff(moment().utc(), "days", true) < 1
      ) {
        return false;
      }
    },
    poperLeave() {
      this.$refs.feedback.resetFields();
    },
    getOssAuth() {
      let exp = this.ossData.expire; //过期就重新获取
      if (
        this.ossData &&
        this.ossData.expire > 0 &&
        0 < moment.unix(exp).diff(moment().utc(), "days", true) &&
        moment.unix(exp).diff(moment().utc(), "days", true) < 1
      ) {
        return false;
      }
      ossApi.getOssAuth().then(res => {
        let data = res.data.data;
        this.$store.commit("SET_OSS_DATA", data);
      });
    },
    $resize () {
      this.winHeight = window.innerHeight - 66;  
    }
  },
  created() {
    this.getOssAuth();
    //读取用户信息获取头像
    if (!this.picture) {
      userApi.getSingleUser({ id: this.userId }).then(res => {
        let data = res.data.data[0];
        let picture = data.picture;
        if (picture) {
          this.$store.commit("SET_PICTURE", picture);
        }
      }).catch(err => {
        console.log(err)
      })
    }
  },
  mounted() {
    let _this = this;
    window.addEventListener(
      "resize",
      this.$resize,
      true
    );
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.$resize);
  }
};
</script>
<style lang="scss">
* {
  box-sizing: border-box;
}

.el-menu-item {
  background-color: #ebf1f6;
  &.is-active {
    background-color: #188fff !important;
  }
}

.el-submenu [class^="fa"] {
  vertical-align: middle;
  margin-right: 5px;
  width: 24px;
  text-align: center;
  font-size: 16px;
}

.el-step__head.is-process {
  color: #c0c4cc;
  border-color: #c0c4cc;
}

.el-step__title.is-process {
  font-weight: 400;
  color: #c0c4cc;
}

.q-icon {
  margin-right: 10px;
}

.q-crumb {
  padding: 0 0 10px 0;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ddd;
  margin-bottom: 20px;
  .q-icon {
    display: block;
    margin-right: 5px;
    color: #33c0fb;
    font-size: 18px;
  }
  .el-breadcrumb {
    font-size: 16px;
  }
}
.user-action {
  width: 130px;
  .el-dropdown-menu__item {
    font-size: 14px;
    height: 40px;
    i {
      margin: 0 8px 0 10px;
    }
  }
  &.el-dropdown-menu--mini .el-dropdown-menu__item {
    line-height: 40px;
  }
}
.feedback-content {
  .el-textarea__inner {
    resize: none;
  }
}
</style>
<style lang="scss" scoped>
.top-sidebar {
  margin: 20px auto 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  width: 300px;
  border: 1px solid #ccc;
  border-radius: 8px;
  li {
    flex: 1;
    list-style: none;
    cursor: pointer;
    border-left: 1px solid #ccc;
    text-align: center;
    &:first-child {
      border-left: none;
    }
    span {
      margin-left: 5px;
    }
    &.router-link-exact-active {
      color: #317ffe;
    }
  }
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 0 20px 0 15px;
  height: 66px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #00142a;
  z-index: 100;
  .logo {
    text-decoration: none;
    img {
      width: 40px;
      margin-right: 10px;
      vertical-align: middle;
    }
    span {
      line-height: 64px;
      color: #fff;
      text-align: center;
      font-size: 20px;
      font-weight: 600;
      text-decoration: none;
      vertical-align: middle;
    }
  }
}

.push-sidebar {
  position: fixed;
  top: 66px;
  left: 0;
  width: 256px;
  text-align: left;
  overflow-y: auto;
  background: #00142a;
  box-shadow: 0 0 10px 0 #ebf1f6;
}

.common-layout-1 {
  margin-top: 66px;
  background-color: rgb(243, 244, 246);
}

.user-info {
  display: flex;
  align-items: center;
  .el-dropdown-link {
    outline: none;
  }
  .about-us {
    margin-right: 10px;
    color: #fff;
    font-size: 14px;
    padding-top: 3px;
    cursor: pointer;
    i {
      font-size: 24px;
      margin-right: 5px;
      vertical-align: middle;
      color: #317ffe;
    }
  }
  .feedback {
    margin-right: 20px;
    color: #fff;
    font-size: 14px;
    cursor: pointer;
    i {
      font-size: 24px;
      margin-right: 5px;
      margin-top: -4px;
      vertical-align: top;
      color: #317ffe;
    }
  }
  .cur-user {
    img {
      width: 30px;
      height: 30px;
      margin: 0 8px 0 12px;
      border-radius: 4px;
      &.default {
        width: 24px;
        height: 24px;
      }
    }
  }
  .self-info {
    margin-left: 15px;
    .el-popover__reference {
      color: #fff;
      font-size: 14px;
      cursor: pointer;
    }
    .fa {
      color: #317ffe;
      font-size: 18px;
      margin-right: 5px;
    }
  }
}
.self-content {
  li {
    margin-bottom: 5px;
    label {
      color: #999;
    }
  }
}
.login-user {
  display: flex;
  align-items: center;
  span {
    display: block;
    color: #fff;
  }
}
.el-main {
  padding: 0px;
}
.header-nav {
  position: absolute;
  left: 240px;
  display: flex;
  color: #fff;
  width: 550px;
  height: 100%;
  li {
    // flex:1;
    height: 100%;
    padding: 0 21px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    cursor: pointer;
    &.current {
      &::after {
        content: "";
        position: absolute;
        display: block;
        left: 0;
        bottom: 0;
        height: 5px;
        width: 100%;
        background-color: #1b73ff;
      }
    }
  }
}
.about-us-content {
  padding: 20px;
  img {
    width: 200px;
  }
  .tips {
    font-size: 12px;
    color: #999;
    text-align: center;
  }
}
.feedback-content {
  padding: 20px;
  .opt {
    padding-left: 80px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .toList {
    font-size: 12px;
  }
}
</style>

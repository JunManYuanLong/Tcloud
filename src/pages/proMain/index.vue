<template>
  <div class="common-layout" :style="marginLeft">
    <div class="header">
      <div class="header-left">
        <div class="slidebar-menu" v-if="sidebarVisible" @click="collapse=!collapse">
          <i class="fa fa-navicon"></i>
        </div>
        <router-link :to="{ name: 'index'}" class="logo">
          <img src="../../assets/img/logo.png" alt="logo">
          <span>云测平台</span>
        </router-link>
        <div class="project-select" v-if="projectId">
          <el-dropdown>
            <span class="el-dropdown-link">
              {{curProject.name}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown" class="project-select-dropdown">
              <el-dropdown-item
                v-for="item in userProjects"
                :key="item.id"
                :class="{cur:projectName == item.name}"
              >
                <div @click="switchProject(item.id)">{{item.name}}</div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <el-dropdown class="quick-create" v-if="sidebarVisible">
          <p class="el-dropdown-link quick-create-down">
            <i class="fa fa-pencil"></i>
            <span>快速创建</span>
          </p>
          <el-dropdown-menu slot="dropdown" class="user-action">
            <el-dropdown-item>
              <div @click="createIssue(true)">
                <i class="el-icon-info"></i>创建缺陷
              </div>
            </el-dropdown-item>
            <el-dropdown-item>
              <div @click="createRequirement">
                <i class="fa fa-book"></i>创建需求
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
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
    <sidebar v-if="sidebarVisible" :collapse="collapse" :sidebar="sidebarData"></sidebar>
    <el-main class="page-main" :style="{'min-height':winHeight+'px'}">
      <router-view></router-view>
    </el-main>
    <div v-if="issueDialog">
      <issueCreate v-if="sidebarVisible" :isShow="issueDialog" @close="createIssue(false)"></issueCreate>
    </div>
    <div v-if="requirementAddDrawer">
      <rqCreate v-if="sidebarVisible" v-model="requirementAddDrawer" :drawerStyle="drawerStyle"></rqCreate>
    </div>
  </div>
</template>
<script>
import sidebar from "@/components/sidebar1.vue";
import projectApi from "@/api/project";
import userApi from "@/api/user.js";
import versionApi from "@/api/version.js";
import ossApi from "@/api/oss.js";
import feedbackApi from "@/api/feedback.js";
import moment from "moment";
//导入快速创建的组件
import issueCreate from "@/pages/fastCreate/issueCreate.vue";
import rqCreate from "@/pages/fastCreate/requirementCreate.vue";
export default {
  name: "ProMain",
  data() {
    return {
      userName: "",
      winHeight: window.innerHeight - 66,
      curProjectId: "",
      feedbackData: {
        contact: "",
        comment: ""
      },
      collapse: false,
      feedbackRule: {
        comment: [
          { required: true, message: "请填写反馈描述！", trigger: "change" }
        ],
        contact: [
          { required: true, message: "请填写联系方式！", trigger: "change" }
        ]
      },
      issueDialog: false,
      requirementAddDrawer: false,
      drawerStyle: {
        width: "960px"
      }
    };
  },
  components: {
    sidebar,
    issueCreate,
    rqCreate,
    TopBar: () => import("@/pages/mail/TopBar.vue")
  },
  props: {
    sidebarVisible: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    marginLeft() {
      let mr = {
        "margin-left": "143px"
      };
      if (this.collapse) {
        mr["margin-left"] = "64px";
      } else {
        mr["margin-left"] = "143px";
      }
      return mr;
    },
    sidebarData() {
      return this.$store.state.admin.siderBarData;
    },
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
    versionList() {
      return this.$store.state.project.versionList;
    },
    lastVersion() {
      if (this.versionList && this.versionList.length > 0) {
        return this.versionList[0].id;
      } else {
        return "all";
      }
    },
    projectId() {
      return this.$route.params && this.$route.params.projectId
        ? this.$route.params.projectId
        : "";
    },
    userId() {
      return this.$store.state.login.userid;
    },
    isAdmin() {
      return this.$store.getters.isAdmin;
    },
    projectList() {
      return this.$store.state.project.projectList;
    },
    curProject() {
      return this.$store.state.project.currentProject;
    },
    projectName() {
      return this.curProject.name;
    },
    userList() {
      return this.$store.state.project.userList;
    },
    ossData() {
      return this.$store.state.project.ossData;
    },
    storeProjectId() {
      return this.$store.state.project.projectId;
    },
    proSettings() {
      return this.$store.state.project.settings;
    },
    userProjects() {
      let projects = [];
      if (this.isAdmin) {
        projects = this.projectList;
      } else {
        this.projectList.map(item => {
          item.user.forEach(subitem => {
            if (subitem.id == this.userId) {
              projects.push(item);
            }
          });
        });
      }
      return projects;
    },
    showManage(){
      return this.$store.state.admin.showManage
    },
  },
  watch: {
    projectId(val) {
      if (val) {
        this.$store.commit("SET_CURRENT_PROJECT", "");
        this.$store.commit("SET_USERLIST", []);
        this.$store.commit("SET_VERSION", []);
        this.$store.commit("SET_PROJECT_SETTINGS",'');
        this.getProjectName();
        this.getUserList();
        this.getVesionList();
        this.getOssAuth();
        this.getProjectSets()
        this.$store.commit("PROJECT_ID", val);
      }
    },
    $route() {
      this.$store.commit("PROJECT_ID", this.projectId);
      if(this.lastVersion){
        if(this.showManage){ // 显示人员管理
              this.$store.commit('ASIDE_HAS_ADMIN', this.lastVersion)
          } else { // 不显示人员管理
              this.$store.commit('ASIDE_NO_ADMIN', this.lastVersion)
          }
      }
    },
    sidebarVisible(val) {
      if (!val) {
        this.collapse = true;
      }
    }
  },
  methods: {
    loginOutFun() {
      this.$store.commit("CLEAR_TOKEN");
      this.$router.push({ name: "login" });
    },
    changePassword() {
      this.$router.push({ name: "selfPassword" });
    },
    toSelfInfo() {
      this.$router.push({ name: "selfInfo" });
    },
    getProjectInfo() {
      console.log(this.projectList);
      if (this.projectList && this.projectList.length > 0) {
        return false;
      }
      projectApi.getProjectList().then(
        res => {
          let data = res.data.data;
          this.$store.commit("SET_PROJECT_LIST", data);
        },
        error => {
          this.$message.error(`获取项目失败${error.message}`);
        }
      );
    },
    getProjectName() {
      if (this.curProject) {
        return false;
      }
      projectApi.getSingleProject({ id: this.projectId }).then(
        res => {
          let data = res.data.data[0];
          this.$store.commit("SET_CURRENT_PROJECT", data);
        },
        error => {
          this.$message.error(`获取项目失败${error.message}`);
        }
      );
    },
    getUserList() {
      if (this.userList && this.userList.length > 0) {
        return false;
      }
      userApi.getUserByProject(this.projectId).then(res => {
        let data = res.data.data;
        this.$store.commit("SET_USERLIST", data);
      });
    },
    getVesionList() {
      if (this.versionList && this.versionList.length > 0) {
        return false;
      }
      versionApi
        .getVersionByProject({ projectid: this.projectId })
        .then(res => {
          let data = res.data.data;
          this.$store.commit("SET_VERSION", data);
        });
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
    getProjectSets(){
      if(this.proSettings){
        return false
      }
      projectApi.getProjectSettings().then(res=>{
        let data = res.data.data;
        this.$store.commit("SET_PROJECT_SETTINGS", data);
      },error=>{

      })
    },
    switchProject(id) {
      this.$router.push({
        name: "dashboard",
        params: {
          projectId: id
        }
      });
      this.getSideBarData();
    },
    async gettoken() {
      let token = await axios.get("http://stf.ywopt.com/auth/api/skip/mock", {
        params: { name: this.$store.getters.userName }
      });
      return token;
    },
    toStfPage() {
      this.gettoken().then(res => {
        let url = `http://stf.ywopt.com/?jwt=${res.data.token}`;
        window.open(url);
      });
    },
    // 判断是否是该项目的owner
    async isOwner() {
      // 拿到当前用户的角色role
      let role = this.$store.state.login.role;
      let hasOwner =
        role.findIndex((item, index) => {
          return item.name == "owner";
        }) > -1
          ? true
          : false;
      // 然后看角色里有没有owner，如果有就调用接口，没有就返回false
      if (hasOwner) {
        let params = {
          user_id: this.userId
        };
        // 接口返回一个projectid列表，判断当前项目在不在列表中，在就返回true，不在返回false
        let res = await projectApi.getProjectListByUserId(params).catch(err => {
          this.$message.error(`${err.message}`);
        });
        if (res.data.code == 0) {
          let data = res.data.data;
          let hasProject =
            data.findIndex((item, index) => {
              return item.project_id == this.projectId;
            }) > -1
              ? true
              : false;
          if (hasProject) {
            return true;
          } else {
            return false;
          }
        }
      } else {
        return false;
      }
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
    enterFun() {
      return false;
    },
    // 触发action获取接口数据
    getSideBarData() {
      let params = {
        user_id: this.userId,
        project_id: this.projectId,
        lastVersion: this.lastVersion // 新增到sidebar中
      };
      this.$store.dispatch("GET_ASIDE", params);
    },
    createIssue(val) {
      this.issueDialog = val;
    },
    createRequirement() {
      this.requirementAddDrawer = true;
    },
    $resize () {
      this.winHeight = window.innerHeight - 66;  
    }
  },
  created() {
    if (this.projectId) {
      if (this.projectId != this.storeProjectId) {
        this.$store.commit("SET_PROJECT_LIST", []);
        this.$store.commit("SET_CURRENT_PROJECT", "");
        this.$store.commit("SET_USERLIST", []);
        this.$store.commit("SET_VERSION", []);
        this.$store.commit("SET_PROJECT_SETTINGS", '');
      }
      this.getProjectInfo();
      this.getProjectName();
      this.getUserList();
      this.getVesionList();
      this.getOssAuth();
      this.getProjectSets()
    }
    this.getSideBarData();
    if (!this.sidebarVisible) {
      this.collapse = true;
    }
  },
  mounted() {
    let _this = this;
    
    window.addEventListener(
      "resize",
      this.$resize,
      true
    );
    this.curProjectId = this.projectId;
    this.$store.commit("PROJECT_ID", this.projectId); //首次做存储
  },
  beforeDestroy() {
    window.removeEventListener(
      "resize",
      this.$resize
    );
  }
};
</script>
<style lang="scss">
* {
  box-sizing: border-box;
}

.el-main {
  padding: 0 !important;
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
.project-select {
  .el-dropdown {
    color: #317ffe;
  }
}
.project-select-dropdown {
  .el-dropdown-menu__item {
    &.cur {
      background-color: #ecf5ff;
      color: #66b1ff;
    }
  }
}
.el-menu {
  .el-menu-item {
    text-align: left;
    i.fa {
      margin-right: 5px;
      width: 24px;
      text-align: center;
      font-size: 16px;
      vertical-align: middle;
    }
  }
  &.el-menu--collapse {
    .el-menu-item {
      text-align: center;
    }
  }
}

.feedback-content {
  .el-textarea__inner {
    resize: none;
  }
}
</style>
<style lang="scss" scoped>
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
  z-index: 1000;
  .header-left {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .logo {
    text-decoration: none;
    margin-right: 30px;
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
    em {
      margin-left: 30px;
      position: relative;
      bottom: -3px;
    }
  }
  .quick-create {
    margin-left: 25px;
    .quick-create-down {
      cursor: pointer;
      color: #fff;
      i {
        margin-right: 5px;
      }
    }
  }
}

.push-sidebar {
  position: fixed;
  top: 66px;
  left: 0;
  text-align: left;
  overflow-y: auto;
  background: #00142a;
  box-shadow: 0 0 10px 0 #ebf1f6;
}

.common-layout {
  margin-top: 66px;
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
.page-main {
  position: relative;
  text-align: left;
  height: 100%;
}

.login-user {
  display: flex;
  align-items: center;
  span {
    display: block;
    color: #fff;
  }
}
.slidebar-menu {
  cursor: pointer;
  margin-right: 30px;
  margin-left: 10px;
  i {
    color: #c5cbd2;
    font-size: 24px;
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

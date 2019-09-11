<template>
  <div>
    <ul class="top-sidebar">
      <router-link tag="li" :to="{name:'Proj'}">
        <i class="fa fa-product-hunt"></i>
        <span>项目</span>
      </router-link>
      <router-link tag="li" :to="{name:'mine'}">
        <i class="el-icon-star-off"></i>
        <span>我的</span>
      </router-link>
      <router-link tag="li" :to="{name: 'team'}" v-if="isAdmin">
        <i class="fa fa-users"></i>
        <span>团队</span>
      </router-link>
      <router-link tag="li" :to="{name:'property'}">
        <i class="fa fa-dollar"></i>
        <span>资产</span>
      </router-link>
    </ul>
    <router-view></router-view>
  </div>
</template>
<script>
import projectApi from "@/api/project.js";
import userApi from "@/api/user.js";
export default {
  name: "Center",
  data() {
    return {
      loading: true,
      tabActive: "1",
      filterValue: "",
      dialogVisible: false,
      editDialogVisible: false,
      projectList: [],
      projectInfo: {},
      projectId: "",
      userList: [],
      projectBindUserVisible: false,
      projectBindUserForm: {
        id: "",
        name: "",
        userids: []
      }
    };
  },
  computed: {
    userId() {
      return this.$store.state.login.userid;
    },
    isAdmin() {
      return this.$store.getters.isAdmin;
    }
  },
  methods: {
    logo_image(item) {
      if (this.isSelfProject(item.user)) {
        this.$router.push({
          name: "dashboard",
          params: {
            projectId: item.id
          }
        });
      } else {
        this.noRight();
      }
    },
    isSelfProject(user) {
      let result = false;
      if (this.isAdmin) {
        result = true;
      }
      if (user.length > 0) {
        user.forEach(item => {
          if (item.id == this.userId) {
            result = true;
          }
        });
      }
      return result;
    },
    projectBindUser() {
      projectApi
        .projectBindUser(
          this.projectBindUserForm.id,
          this.projectBindUserForm.userids
        )
        .then(res => {
          this.$message.success("操作成功");
          this.projectBindUserVisible = false;
          this.getProjectData();
        })
        .catch(err => {
          this.$message.error(`操作失败：${err.message}`);
        });
    },
    openBindUserDialog(row) {
      this.projectBindUserVisible = true;
      this.projectBindUserForm.id = row.id;
      this.projectBindUserForm.name = row.name;
      this.projectBindUserForm.userids = row.user.map(i => i.id);
    },
    closeBindUserDialog() {
      this.projectBindUserForm.id = "";
      this.projectBindUserForm.name = "";
      this.projectBindUserForm.userids = [];
    },
    getUserList() {
      this.loading = true;
      userApi
        .getUserList()
        .then(res => {
          this.loading = false;
          this.userList = res.data.data;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    getProjectData() {
      projectApi.getProjectList().then(res => {
        this.projectList = res.data.data;
        console.log(this.projectList);
      });
    },
    openProjectBindUserDialog() {},
    editFun(item) {
      this.projectId = item.id;
      this.editDialogVisible = true;
    },
    deleteFun(item) {
      this.dialogVisible = true;
      this.projectInfo = item;
    },
    delProject() {
      projectApi.deleteProject({ id: this.projectInfo.id }).then(res => {
        this.dialogVisible = false;
        this.$message({
          message: "项目删除成功！",
          type: "success"
        });
        this.getProjectData();
      });
    },
    refreshDataFun() {
      this.editDialogVisible = false;
      this.projectId = "";
      this.getProjectData();
    },
    showDialog(val) {
      if (!val) {
        this.projectId = "";
      }
      this.editDialogVisible = val;
    },
    noRight() {
      this.$message({
        message: "对不起，您没有权限！",
        type: "warning"
      });
    }
  },
  created() {
    this.getProjectData();
    this.getUserList();
  }
};
</script>
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
.permission-unit {
  display: inline-block;
  padding: 0 10px;
  margin: 0 5px;
  background-color: #b9dbff;
  border-radius: 3px;
  color: #fff;
}
.project-wrap {
  max-width: 1400px;
  margin: auto;
  .el-tabs__item {
    font-size: 18px;
  }
}
.project-box {
  display: flex;
  min-height: 100%;
  margin: 0px auto;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding-left: 39px;
  .item {
    height: 170px;
    min-width: 308px;
    max-width: 308px;
    box-sizing: border-box;
    position: relative;
    box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 4px 0px;
    cursor: pointer;
    flex: 1 1 auto;
    margin: 0px 0px 16px 16px;
    padding: 16px;
    background: rgb(255, 255, 255);
    border-radius: 3px;
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1) 0s;
    &:hover {
      box-shadow: rgba(25, 25, 26, 0.08) 0px 6px 28px -3px,
        rgba(0, 0, 0, 0.05) 0px 3px 9px -1px;
    }
    &.add {
      &::before,
      &::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: block;
      }
      &::before {
        width: 30px;
        border-width: 1px;
        border-style: solid;
        border-color: rgb(16, 113, 211);
        border-image: initial;
      }
      &::after {
        height: 30px;
        border-width: 1px;
        border-style: solid;
        border-color: rgb(16, 113, 211);
        border-image: initial;
      }
    }
    a {
      display: block;
      height: 100%;
      color: #333;
      text-decoration: none;
      text-align: left;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .opts {
      padding: 0;
      list-style: none;
      display: flex;
      position: absolute;
      right: 10px;
      bottom: 10px;
      li {
        width: 30px;
        &.edit-btn {
          color: #11d847;
        }
        &.setting-btn {
          color: #409eff;
        }
        &.delete-btn {
          color: #f56c6c;
        }
      }
    }
    .p-logo {
      max-width: 70%;
      max-height: 55%;
      position: absolute;
      right: 50%;
      top: 50%;
      transform: translate(50%, -50%);
      border-radius: 10%;
    }
  }
}
</style>

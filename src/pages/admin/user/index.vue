<template>
  <div class="AdminUser">
    <div class="q-crumb">
      <i class="q-icon fa fa-user"></i>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{name:'team'}">用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="opt-bar">
      <el-button type="primary" @click="toAddFun">新增用户</el-button>
      <el-input class="userinfos" v-model="search.names" placeholder="输入用户名或者昵称" clearable>
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
    </div>
    <a-table :dataSource="filterUser" :rowKey="record => record.userid" :loading="loading">
      <a-table-column title="ID" width="80px" data-index="userid" key="userid"/>
      <a-table-column title="头像" width="50" data-index="picture" key="picture">
        <template slot-scope="text, record">
          <div class="table-icon">
            <img :src="record.picture" alt="" v-if="record.picture">
            <img src="@/assets/img/avatar.jpg" alt="" v-else>
          </div>
        </template>
      </a-table-column>
      <a-table-column title="用户名" data-index="username" key="username"/>
      <a-table-column title="昵称" data-index="nickname" key="nickname"/>
      <!-- <a-table-column title="角色" data-index="role" key="role">
        <template slot-scope="text, record">
          <span style="font-weight: bold">{{getRoledata(record.role)}}</span>
        </template>
      </a-table-column>
      <a-table-column title="所在项目" data-index="project" key="project">
        <template slot-scope="text, record">
          <span style="font-weight: bold">{{getProjectdata(record.project)}}</span>
        </template>
      </a-table-column> -->
      <a-table-column title="操作" key="action">
        <template slot-scope="text, record">
          <!-- <el-button type="primary" @click="openBindRoleDialog(record)">绑定角色</el-button>
          <el-button
            type="primary"
            @click="openBindProject(record)"
            :disabled="isAdmin(record)"
          >绑定项目</el-button> -->
          <el-button type="primary" @click="editFun(record)" icon="el-icon-edit">重置密码</el-button>
          <el-button type="danger" @click="deleteFun(record)" icon="el-icon-delete">删除</el-button>
        </template>
      </a-table-column>
    </a-table>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="400px" :close-on-click-modal="false">
      <span>您确定要删除（ {{userInfo.nickname}} ）用户？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="delUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 绑定项目 -->
    <el-dialog
      title="绑定项目"
      :visible.sync="showbindProject"
      :show-close="false"
      width="600px"
      :close-on-click-modal="false">
      请选择要绑定的项目：
      <el-select v-model="projectIds" clearable multiple :style="{width: '400px'}">
        <el-option v-for="item in projectIdList" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelBindProject">取 消</el-button>
        <el-button type="primary" @click="sureUserBindProject">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="用户绑定角色"
      :visible.sync="userBindRoleVisible"
      width="600px"
      @close="closeBindRoleDialog"
    >
      <el-form :model="userBindRoleForm" ref="userBindRoleForm" labelWidth="100px">
        <el-form-item label="用户昵称" prop="nickname">
          <span>{{userBindRoleForm.nickname}}</span>
        </el-form-item>
        <el-form-item label="角色" prop="roleids">
          <el-select
            v-model="userBindRoleForm.roleids"
            clearable
            multiple
            :style="{width: '400px'}"
            @change="changeRole"
          >
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.comment"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 新增项目列表，有owner角色就不显示 -->
        <!-- <el-form-item label="项目列表" prop="projectIds" v-if="showProject">
          <el-select v-model="userBindRoleForm.projectIds" clearable multiple :style="{width: '400px'}">
            <el-option
              v-for="item in projectIdList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="userBindRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="userBindRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import userApi from "@/api/user.js";
import roleApi from "@/api/role.js";
import projectApi from "@/api/project";
export default {
  name: "AdminUser",
  data() {
    return {
      rowData: {},
      projectIds: [],
      showbindProject: false,
      showProject: false,
      loading: false,
      ownerId: "",
      data: [],
      filterValue: "",
      dialogVisible: false,
      userInfo: {},
      userId: "",
      userBindRoleVisible: false,
      roledata: [],
      userBindRoleForm: {
        userid: "",
        nickname: "",
        roleids: [],
        projectIds: []
      },
      roleList: [],
      projectIdList: [],
      search: {
        names: ""
      }
    };
  },
  created() {
    this.getUserList();
    this.getRoleList();
    this.getProjectList();
  },
  computed: {
    filterUser() {
      let users = this.data;
      if (this.search.names) {
        users = users.filter(item => {
          if (
            item.nickname.includes(this.search.names) ||
            item.username.includes(this.search.names)
          ) {
            return item;
          }
        });
      }
      return users;
    }
  },
  methods: {
    // 如果是admin，就不可以绑定项目
    isAdmin(row) {
      console.log(row);
      if (
        row.role.some(item => {
          return item.name == "admin";
        })
      ) {
        return true;
      } else {
        return false;
      }
    },
    // 打开绑定项目
    openBindProject(row) {
      this.showbindProject = true;
      this.rowData = row;
      console.log(this.rowData);
      this.projectIds = this.rowData.project.map(item => {
        // 回显项目列表
        return item.id;
      });
    },
    // 确认绑定项目
    sureUserBindProject() {
      let params = {
        user_id: this.rowData.userid,
        project_ids: this.projectIds
      };
      userApi
        .userBindProject(params)
        .then(res => {
          if (res.data.code == 0) {
            this.$message.success("绑定成功");
            this.getUserList();
          }
        })
        .catch(err => {
          this.$message.error(`绑定项目失败: ${err.message}`);
        });
      this.cancelBindProject();
    },
    // 取消绑定项目
    cancelBindProject() {
      this.showbindProject = false;
      this.projectIds = [];
    },
    // select 切换角色
    changeRole(val) {
      console.log(val);
    },
    // 获取项目列表
    getProjectList() {
      projectApi.getProjectList().then(
        res => {
          console.log(res);
          if (res.data.code == 0) {
            this.projectIdList = res.data.data;
          }
        },
        error => {
          console.log(`获取项目失败${error.message}`);
        }
      );
    },
    // 判断是否有owner角色
    hasOwner(row) {
      let hasOwner = row.role.some(item => {
        return item.name == "owner";
      });
      return hasOwner;
    },
    openBindRoleDialog(row) {
      this.rowData = row;
      this.userBindRoleVisible = true;
      this.userBindRoleForm.nickname = row.nickname;
      this.userBindRoleForm.userid = row.userid;
      this.userBindRoleForm.roleids = row.role.map(i => i.id);
    },
    closeBindRoleDialog() {
      this.userBindRoleForm.userid = "";
      this.userBindRoleForm.nickname = "";
      this.userBindRoleForm.roleids = [];
    },
    // 获取所有的用户列表
    getUserList() {
      this.loading = true;
      userApi
        .getUserListWhole()
        .then(res => {
          this.loading = false;
          this.data = res.data.data.sort((a, b) => a.userid > b.userid);
        })
        .catch(err => {
          this.loading = false;
          this.$message.error(`数据获取失败：${err.message}`);
        });
    },
    getRoleList() {
      roleApi.getRoleList().then(res => {
        this.roleList = res.data.data;
        this.ownerId = this.roleList.find(item => {
          return item.name == "owner";
        }).id;
      });
    },
    getRoledata(result) {
      let rr = result.map(x => x.comment);
      var temp = "";
      for (var i in rr) {
        temp = temp + rr[i] + ", ";
      }
      return temp.substring(0, temp.length - 2);
    },
    getProjectdata(result) {
      let rr = result.map(x => x.name);
      var temp = "";
      for (var i in rr) {
        temp = temp + rr[i] + ", ";
      }
      return temp.substring(0, temp.length - 2);
    },
    userBindRole() {
      let params = {
        user_id: this.userBindRoleForm.userid,
        role_ids: this.userBindRoleForm.roleids
      };
      userApi
        .userBindRole(
          this.userBindRoleForm.userid,
          this.userBindRoleForm.roleids
        )
        .then(res => {
          this.$message.success("操作成功");
          this.userBindRoleVisible = false;
          this.getUserList();
        })
        .catch(err => {
          this.$message.error(`操作失败：${err.message}`);
        });
    },
    toAddFun() {
      this.$router.push({
        name: "adminUserAdd"
      });
    },
    editFun(row) {
      this.$router.push({
        name: "adminUserEdit",
        params: {
          id: row.userid
        }
      });
    },
    deleteFun(row) {
      this.dialogVisible = true;
      this.userId = row.userid;
      this.userInfo = row;
    },
    delUser() {
      userApi.deleteUser({ id: this.userId }).then(
        res => {
          this.dialogVisible = false;
          this.$message.success("用户删除成功！");
          this.getUserList();
        }
      ).catch(err => {
          this.$message.error(err.message);
      })
    }
  }
};
</script>
<style lang="scss">
.AdminUser {
  margin-top: 20px;
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
</style>
<style lang="scss" scoped>
.userinfos {
  display: inline-block;
  width: 240px;
  margin-left: 25px;
}
.opt-bar {
  margin-bottom: 10px;
}
.table-icon {
  width: 36px;
  height: 30px;
  position: relative;
  img {
    width: 36px;
    height: 36px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 6px;
    position: absolute;
  }
}
.ant-table-wrapper{
  background: #fff;
}
</style>
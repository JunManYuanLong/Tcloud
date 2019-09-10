<template>
  <div class="AdminUser">
    <div class="q-crumb">
      <i class="q-icon fa fa-user"></i>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{name:'team'}">用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="opt-bar">
      <el-button type="primary" @click="openAddRoleDialog">新增角色</el-button>
    </div>
    <a-table :dataSource="roleList" :rowKey="record => record.id">
      <a-table-column title="ID" data-index="id" key="id"/>
      <a-table-column title="角色" data-index="name" key="name"/>
      <a-table-column title="别称" data-index="comment" key="comment"/>
      <a-table-column title="操作" key="action" width="200px" align="center">
        <template slot-scope="text, record">
          <el-button type="primary" @click="openEditRoleDialog(record)" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" @click="deleteFun(record)" icon="el-icon-delete">删除</el-button>
        </template>
      </a-table-column>
    </a-table>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="400px" :close-on-click-modal="false">
      <span>您确定要删除（ {{roleInfo.name}} ）角色？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="delUser">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="编辑角色"
      :visible.sync="editRoleVisible"
      width="600px"
      @close="closeBindRoleDialog">
      <el-form :model="editRole" :rules="rules" ref="editRole" labelWidth="100px">
        <el-form-item label="角色名称：" prop="name">
          <el-input v-model.trim="editRole.name" readonly></el-input>
        </el-form-item>
        <el-form-item label="角色别称：" prop="comment">
          <el-input v-model.trim="editRole.comment"></el-input>
        </el-form-item>
        <el-form-item label="角色权限" prop="abilitys">
          <div class="check-box">
            <el-table :data="abilityList" style="width: 100%">
              <el-table-column prop="label" label="模块" width="100" align="center"></el-table-column>
              <el-table-column label="权限">
                <template slot-scope="scope">
                  <div class="check-list-box">
                    <el-checkbox-group
                      v-model="scope.row.checkedList"
                      @change="handleCheckedEditChange">
                      <el-checkbox
                        v-for="item in scope.row.data"
                        :label="item.id"
                        :key="item.id"
                      >{{ item.name }}</el-checkbox>
                    </el-checkbox-group>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="userEditRole">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="新增角色"
      :visible.sync="addRoleVisible"
      width="600px"
      @close="closeBindRoleDialog"
    >
      <el-form :model="addRole" :rules="rules" ref="addRole" labelWidth="100px">
        <el-form-item label="角色名称：" prop="name">
          <el-input v-model.trim="addRole.name"></el-input>
        </el-form-item>
        <el-form-item label="角色别称：" prop="comment">
          <el-input v-model.trim="addRole.comment"></el-input>
        </el-form-item>
        <el-form-item label="角色权限" prop="abilitys">
          <div class="check-box">
            <el-table :data="abilityList" style="width: 100%">
              <el-table-column prop="label" label="模块" width="100" align="center"></el-table-column>
              <el-table-column label="权限">
                <template slot-scope="scope">
                  <div class="check-list-box">
                    <el-checkbox-group
                      v-model="scope.row.checkedList"
                      @change="handleCheckedAddChange"
                    >
                      <el-checkbox
                        v-for="item in scope.row.data"
                        :label="item.id"
                        :key="item.id"
                      >{{ item.name }}</el-checkbox>
                    </el-checkbox-group>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="userAddRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import userApi from "@/api/user.js";
import roleApi from "@/api/role.js";
export default {
  name: "adminRole",
  data() {
    return {
      loading: false,
      data: [],
      filterValue: "",
      dialogVisible: false,
      roleInfo: {},
      roleId: "",
      editRoleVisible: false,
      addRoleVisible: false,
      roledata: [],
      editRole: {
        id: "",
        name: "",
        comment: "",
        abilitys: [],
        checkAll: false,
        isIndeterminate: false
      },
      addRole: {
        name: "",
        comment: "",
        abilitys: [],
        checkAll: false,
        isIndeterminate: false
      },
      roleList: [],
      abilityList: [],
      rules: {
        name: [
          { required: true, message: "请填写角色名称", trigger: "change" }
        ],
        comment: [
          { required: true, message: "请填写角色别称", trigger: "change" }
        ]
      }
    };
  },
  created() {
    this.getRoleList();
    this.getAbilityList();
  },
  methods: {
    openEditRoleDialog(row) {
      this.editRoleVisible = true;
      this.editRole.name = row.name;
      this.editRole.comment = row.comment;
      this.editRole.id = row.id;
      this.editRole.abilitys = row.ability.map(i => i.id);
      for (let i = 0; i < this.abilityList.length; i++) {
        this.abilityList[i].checkedList = this.editRole.abilitys.filter(
          item => {
            return this.abilityList[i].data.some(item2 => {
              return item2.id === item;
            });
          }
        );
      }
    },
    openAddRoleDialog(row) {
      this.addRoleVisible = true;
      this.addRole = {
        name: "",
        comment: "",
        abilitys: [],
        checkAll: false,
        isIndeterminate: false
      };
      if (this.$refs['addRole']) {
        this.$refs['addRole'].resetFields();
      }
      this.abilityList.forEach(item => {
        item.checkedList = [];
      });
      console.log(this.abilityList);
    },

    closeBindRoleDialog() {
      //        this.editRole.id = ''
      //        this.editRole.name = ''
    },
    getRoleList() {
      roleApi.getRoleList().then(res => {
        this.roleList = res.data.data;
        console.log(this.roleList);
      });
    },
    getAbilityList() {
      roleApi.getAbilityList().then(res => {
        let data = res.data.data;
        data.forEach(item => {
          item.data.sort((a, b) => {
            return a.order - b.order;
          });
          item.checkedList = [];
        });
        this.abilityList = data;
        console.log(this.abilityList);

        return;
        this.abilityList = data.map(item => {
          if (item.name.includes("编辑")) {
            item.tip = `勾选此权限，即可进行创建、${item.name}操作！`;
          } else {
            item.tip = `勾选此权限，即可进行${item.name}操作！`;
          }
          return item;
        });
      });
    },
    getAbilitydata(result) {
      let rr = result.map(x => x.name);
      var temp = "";
      for (var i in rr) {
        temp = temp + rr[i] + ", ";
      }
      return temp.substring(0, temp.length - 2);
    },
    userAddRole() {
      this.$refs["addRole"].validate(valid => {
        if (valid) {
          userApi
            .addRole({
              name: this.addRole.name,
              comment: this.addRole.comment,
              ability_ids: this.addRole.abilitys,
              weight: 1
            })
            .then(res => {
              this.$message.success("操作成功");
              this.addRoleVisible = false;
              this.getRoleList();
            })
            .catch(err => {
              this.$message.error(`操作失败：${err.message}`);
            });
        } else {
          return false;
        }
      });
    },
    userEditRole() {
      this.$refs["editRole"].validate(valid => {
        if (valid) {
          userApi
            .editRole(this.editRole.id, {
              name: this.editRole.name,
              comment: this.editRole.comment,
              ability_ids: this.editRole.abilitys,
              weight: 1
            })
            .then(res => {
              this.$message.success("操作成功");
              this.editRoleVisible = false;
              this.getRoleList();
            })
            .catch(err => {
              this.$message.error(`操作失败：${err.message}`);
            });
        } else {
          return false;
        }
      });
    },
    toAddFun() {
      this.$router.push({
        name: "adminUserAdd"
      });
    },
    editFun(row) {
      this.editRoleVisible = true;
    },
    deleteFun(row) {
      this.dialogVisible = true;
      this.roleId = row.id;
      this.roleInfo = row;
    },
    delUser() {
      userApi.deleteRole(this.roleId).then(
        res => {
          this.dialogVisible = false;
          this.$message.success("角色删除成功！");
          this.getRoleList();
        },
        error => {
          this.$message.error(error.message);
        }
      );
    },
    handleAddAllChange(val) {
      if (val) {
        this.addRole.abilitys = this.abilityList.map(item => {
          return item.id;
        });
        this.addRole.isIndeterminate = false;
      } else {
        this.addRole.abilitys = [];
      }
    },
    handleCheckedAddChange(val) {
      this.addRole.abilitys = [];
      this.abilityList.forEach(item => {
        this.addRole.abilitys.push(...item.checkedList);
      });
    },
    handleEditAllChange(val) {
      if (val) {
        this.editRole.abilitys = this.abilityList.map(item => {
          return item.id;
        });
        this.editRole.isIndeterminate = false;
      } else {
        this.editRole.abilitys = [];
      }
    },
    handleCheckedEditChange(val) {
      this.editRole.abilitys = [];
      this.abilityList.forEach(item => {
        this.editRole.abilitys.push(...item.checkedList);
      });
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
.check-box {
  padding: 5px 10px;
  border: 1px solid #dcdfe6;
}
.checkWrap {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-wrap: wrap;
  width: 100%;
  .el-checkbox {
    margin-right: 20px;
  }
  .el-checkbox + .el-checkbox {
    margin: 0 20px 0 0;
  }
}
.opt-bar {
  margin-bottom: 10px;
}
.check-list-box .el-checkbox-group {
  display: flex;
  justify-content: start;
  flex-wrap: wrap;
  label.el-checkbox {
    margin: 0 20px 0 0;
  }
}
.ant-table-wrapper{
  background: #fff;
}
</style>

<template>
  <el-card class="box-card">
    <div class="q-crumb">
      <i class="q-icon fa fa-user"></i>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>修改密码</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :model="editData" :rules="rules" ref="addForm" label-width="100px" class="addForm">
      <template v-if="!isResetPassword">
        <el-form-item label="账号：" prop="username">
          <el-input v-model="editData.username"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input v-model="editData.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label=" ">
          <p style="color:#999;">（ 这里的修改只针对本平台有效！）</p>
        </el-form-item>
      </template>
      <template v-else>
        <el-form-item label="旧密码：" prop="oldpassword">
          <el-input v-model="editData.oldpassword" type="password"></el-input>
        </el-form-item>
        <el-form-item label="新密码：" prop="newpassword">
          <el-input v-model="editData.newpassword" type="password"></el-input>
        </el-form-item>
      </template>
      <el-form-item>
        <el-button @click="cancelFun">取消</el-button>
        <el-button type="primary" @click="sureFun">确定</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
import userApi from "@/api/user.js";
export default {
  data() {
    return {
      editData: {
        username: "",
        password: "",
        oldpassword: "",
        newpassword: ""
      },
      isResetPassword: false,
      rules: {
        username: [
          { required: true, message: "请填写用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请填写密码", trigger: "blur" }],
        oldpassword: [
          { required: true, message: "请填写旧密码", trigger: "blur" }
        ],
        newpassword: [
          { required: true, message: "请填写新密码", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    userId() {
      return this.$store.state.login.userid;
    },
    userName() {
      return this.$store.state.login.username;
    }
  },
  methods: {
    cancelFun() {
      this.$router.go(-1); //返回上一层
    },
    sureFun() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          if (this.isResetPassword) {
            let params = {
              oldpassword: this.editData.oldpassword,
              newpassword: this.editData.newpassword
            };
            userApi.editUser(this.userId, params).then(
              res => {
                this.$message({
                  message: "密码修改成功！",
                  type: "success"
                });
                this.$router.go(-1); //返回上一层
              },
              error => {
                this.$message.error(`密码修改失败:${error.message}`);
              }
            );
          } else {
            let sUserName = new Promise((resolve, reject) => {
              userApi
                .updateUserName({
                  userid: this.userId,
                  username: this.editData.username
                })
                .then(
                  res => {
                    resolve(res.data);
                  },
                  error => {
                    reject(error);
                  }
                );
            });
            let sPassword = new Promise((resolve, reject) => {
              userApi
                .editUser(this.userId, {
                  oldpassword: "",
                  newpassword: this.editData.password
                })
                .then(
                  res => {
                    resolve(res.data);
                  },
                  error => {
                    reject(error);
                  }
                );
            });
            Promise.all([sUserName, sPassword])
              .then(v => {
                this.$message({
                  message: "账号密码设置成功！",
                  type: "success"
                });
                this.$router.go(-1); //返回上一层
              })
              .catch(error => {
                this.$message.error(`账号密码设置失败:${error.message}`);
              });
          }
        }
      });
    },
    isReset() {
      userApi.getIsSetPwd(this.userId).then(
        res => {
          this.isResetPassword = Boolean(res.data.data[0].is_reset_password);
        },
        error => {
          this.$message.error("获取用户重置信息失败:" + error.message);
        }
      );
    }
  },
  created() {
    this.isReset();
  },
  mounted() {
    this.editData.username = this.userName;
  }
};
</script>
<style lang="scss" scoped>
.addForm {
  width: 500px;
}
</style>

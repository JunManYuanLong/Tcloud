<template>
  <div class="UserAdd">
    <div class="q-crumb">
      <i class="q-icon fa fa-user"></i>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{crumbText}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-card class="box-card">
      <!-- <div slot="header" class="clearfix">
        <span>新增用户</span>
      </div> -->
      <el-form v-if="!editId" :model="addData" :rules="rules" ref="addForm" label-width="100px" class="addForm">
        <el-form-item label="用户名：" prop="username">
          <el-input v-model="addData.username"></el-input>
        </el-form-item>
        <el-form-item label="昵称：" prop="nickname">
          <el-input v-model="addData.nickname"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input v-model="addData.password" type='password'></el-input>
        </el-form-item>
        <el-form-item label="邮箱：" prop="email">
          <el-input v-model="addData.email"></el-input>
        </el-form-item>
        <el-form-item label="电话：" prop="telephone">
          <el-input v-model="addData.telephone"></el-input>
        </el-form-item>
        <!-- <el-form-item label="角色ID：" prop="roleids">
          <el-input v-model="addData.roleids"></el-input>
        </el-form-item> -->
            <!--<el-form-item label="角色：" prop="roleids">-->
          <!--<el-select v-model="roleData" clearable multiple :style="{width: '300px'}">-->
            <!--<el-option-->
              <!--v-for="item in roleList"-->
              <!--:key="item.id"-->
              <!--:label="item.name"-->
              <!--:value="item.id">-->
            <!--</el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <el-form-item>
          <el-button @click="cancelFun">取消</el-button>
          <el-button type="primary" @click="sureFun">确定</el-button>
        </el-form-item>
      </el-form>
      <el-form v-if="editId" :model="editData" :rules="rules" ref="addForm" label-width="100px" class="addForm">
        <!--<el-form-item label="旧密码：" prop="oldpassword">-->
          <!--<el-input v-model="editData.oldpassword" type='password'></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="新密码：" prop="newpassword">
          <el-input v-model="editData.newpassword" type='password'></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="cancelFun">取消</el-button>
          <el-button type="primary" @click="sureFun">确定</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
  import userApi from '@/api/user.js'
  import roleApi from '@/api/role.js'

  export default{
    name: 'UserAdd',
    data() {
      return {
        addData: {
          "username": "",
          "nickname": "",
          "password": "",
          "roleids": [],
          "email": "",
          "telephone": ""
        },
        editData: {
          oldpassword: '',
          newpassword: ''
        },
        roleList: [],
        roleData: [],
        rules: {
          username: [
            {required: true, message: '请填写用户名称', trigger: 'blur'}
          ],
          nickname: [
            {required: true, message: '请填写用户昵称', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请填写密码', trigger: 'blur'}
          ],
          email: [
            {required: true, message: '请填写邮箱', trigger: 'blur'}
          ],
          // telephone: [
          //   {required: true, message: '请填写手机号码', trigger: 'blur'}
          // ],

        },
        rules1: {
          oldpassword: [
            {required: true, message: '请填写旧密码', trigger: 'blur'}
          ],
          newpassword: [
            {required: true, message: '请填写新密码', trigger: 'blur'}
          ],
        },
        permissionData: [{
          value: 1,
          label: '只读'
        }, {
          value: 2,
          label: '写入'
        }]
      }
    },
    computed: {
      editId() {
        return this.$route.params && this.$route.params.id ? this.$route.params.id : ''
      },
      crumbText() {
        let text = "新增用户"
        if (this.editId) {
          text = "重置密码"
        }
        return text
      }
    },
    methods: {
      cancelFun () {
        if (this.$route.params.source == 'staff') {
          this.$router.push({
            name: 'Staff',
            params: {
              projectId: this.$route.params.projectId
            }
          })
        } else {
          this.$router.push({name: 'adminUser'})
        }
      },
      sureFun () {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            if (this.editId) {
              userApi.resetPassword({userid:this.editId, newpassword:this.editData.newpassword}).then(res => {
                this.$message({
                  message: '密码重置成功！',
                  type: 'success'
                })
                if (this.$route.params.source == 'staff') {
                  this.$router.push({
                    name: 'Staff',
                    params: {
                      projectId: this.$route.params.projectId
                    }
                  })
                } else {
                  this.$router.push({name: 'adminUser'})
                }
              },error=>{
                this.$message.error(`密码重置失败:${error.message}`)
              })
            } else {
              userApi.addUser(this.addData).then(res => {
                this.$message({
                  message: '用户添加成功！',
                  type: 'success'
                })
                if (this.$route.params.source == 'staff') {
                  this.$router.push({
                    name: 'Staff',
                    params: {
                      projectId: this.$route.params.projectId
                    }
                  })
                } else {
                  this.$router.push({name: 'adminUser'})
                }
              },error=>{
                this.$message.error(`用户添加失败:${error.message}`)
              })
            }
          } else {
            this.$message.error('请填写相关字段！')
            return false;
          }
        })
      },
      getRoleList () {
        roleApi.getRoleList().then(res => {
          this.roleList = res.data.data
        })
      },
      getEditData() {
        userApi.getSingleUser({id: this.editId}).then(res => {
          this.addData = res.data.data[0]
        })
      }
    },
    created() {
        this.getRoleList();
      if (this.editId) {
        this.getEditData()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .UserAdd {
    margin-top: 20px;
  }

  .el-card__header {
    text-align: left;
  }

  .addForm {
    .el-input {
      width: 200px;
    }
    .el-form-item__content {
      text-align: left;
    }
  }
</style>

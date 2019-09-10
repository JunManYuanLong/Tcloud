<template>
  <div class="staff">
    <!-- 新增人员 -->
    <el-button type="primary" @click="addUser">新增人员</el-button>
    <!--用户筛选-->
    <el-input
      placeholder="请输入用户名或昵称进行搜索"
      v-model="search.names"
      style="width: 210px"
      clearable>
    </el-input>
    <el-select v-model="search.role" filterable placeholder="请选择角色" clearable @change="roleChange">
      <el-option
        v-for="item in roleList"
        :key="item.id"
        :label="item.comment"
        :value="item.id">
      </el-option>
    </el-select>
    <!--用户列表-->
    <a-table :dataSource="filterUser" :rowKey="record => record.userid" :loading="loading">
       <a-table-column title="ID"
              width="80px"
              dataIndex="userid"
              key="userid"/>
       <a-table-column title="用户名"
              dataIndex="username"
              key="username"/>
       <a-table-column title="昵称"
              dataIndex="nickname"
              key="nickname"/>
        <a-table-column
              title="角色"
              dataIndex="role"
              key="role">
              <template slot-scope="text, record">
                <span style="font-weight: bold">{{getRoledata(record.role)}}</span>
              </template>
          </a-table-column> 
          <a-table-column
              title="操作"
              width="445px"
              key="action">
              <template slot-scope="text, record">
                <el-button type="primary" @click="openNickNameDialog(record)" icon="el-icon-edit">修改昵称</el-button>
                <el-button type="primary" @click="openBindRoleDialog(record)" icon="el-icon-edit">绑定角色</el-button>
                <el-button type="primary" @click="editFun(record)" icon="el-icon-edit">重置密码</el-button>
                <el-button type="danger" @click="removeUser(record)" icon="el-icon-delete">移除</el-button>
              </template>
          </a-table-column> 
        </a-table>
    <!--删除对话框-->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="400px" :close-on-click-modal="false">
      <span>您确定要将（ {{userInfo.nickname}} ）用户从项目中移除？</span>
      <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="sureRemoveUser">确 定</el-button>
        </span>
    </el-dialog>
    <!--修改昵称对话框-->
    <el-dialog
      title="修改昵称"
      :visible.sync="nicknameVisible"
      width="600px"
      @close="closeNickname"
    >
      <el-form :model="nickNameEdit" :rules="nicknameRules" ref="addForm" label-width="100px" class="addForm">
        <el-form-item label="昵称：" prop="nickname">
          <el-input v-model="nickNameEdit.nickname" type='text'></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="closeNickname">取消</el-button>
          <el-button type="primary" @click="sureEditNickname">确定</el-button>
        </span>
    </el-dialog>
    <!--绑定角色对话框-->
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
          <el-select v-model="userBindRoleForm.roleids" clearable multiple :style="{width: '400px'}">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.comment"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="userBindRoleVisible = false">取 消</el-button>
          <el-button type="primary" @click="userBindRole">确 定</el-button>
        </span>
    </el-dialog>
    <!--重置密码对话框-->
    <el-dialog
      title="重置密码"
      :visible.sync="resetPasswordShow"
      width="600px"
      @close="closeResetPassword"
    >
      <el-form :model="resetPasswordData" :rules="rules" ref="addForm" label-width="100px" class="addForm">
        <el-form-item label="新密码：" prop="newPassword">
          <el-input v-model="resetPasswordData.newPassword" type='password'></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="closeResetPassword">取消</el-button>
          <el-button type="primary" @click="sureReset">确定</el-button>
        </span>
    </el-dialog>
    <!-- 添加人员对话框 -->
    <el-dialog
      title="新增人员"
      :visible.sync="addUserListShow"
      width="600px"
      @close="closeAddUser"
    >
      <el-form :model="addUserFormData">
        <el-form-item label="选择要添加的人员">
          <el-select v-model="addUserFormData.addUserList" filterable multiple placeholder="请选择">
            <el-option
              v-for="item in allUserList"
              :key="item.id"
              :label="item.nickname"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAddUser">取消</el-button>
        <el-button type="primary" @click="addUserApi">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import userApi from '@/api/user.js'
  import roleApi from '@/api/role.js'
  export default {
    name: "Staff",
    data() {
      return {
        addUserListShow: false,
        addUserFormData: {
          addUserList: [] // 被选中的人员列表
        },
        allUserList: [], // 所有人员列表
        resetPasswordShow: false,
        resetPasswordData: {
          newPassword: ''
        },
        rules: {
          newPassword: [
            {required: true, message: '请填写新密码', trigger: 'blur'}
          ]
        },
        nicknameRules: {
          nickname: [
            {required: true, message: '请填写要修改的昵称', trigger: 'blur'}
          ]
        },
        loading: false,
        data: [],
        filterValue: '',
        dialogVisible: false,
        userInfo: {},
        userId: '',
        userBindRoleVisible: false,
        roledata: [],
        userBindRoleForm: {
          userid: '',
          nickname: '',
          roleids: []
        },
        roleList: [],
        search:{
          names:'',
          role: ''
        },
        nicknameVisible:false,
        nickNameEdit:{
          "nickname": '',
          "userid": ''
        },
        changePassWordId: '' //  当前被重置密码的userId
      }
    },
    created () {
      this.getUserList()
      this.getRoleList()
    },
    // 根据用户名或者昵称进行筛选
    computed:{
      filterUser(){
        let users = this.data
        if(this.search.names){
          users = users.filter(item =>{
            if(item.nickname.includes(this.search.names)||item.username.includes(this.search.names)){
              return item
            }
          })
        }
        return users
      }
    },
    methods: {
      // 通过角色筛选
      roleChange () {
        this.getUserList()
      },
      // 获取不属于当前项目的人员列表
      getNoUserList () {
        let project_id = this.$route.params.projectId / 1
        let params = {
          project_id 
        }
        userApi.getNoUser(params).then(res => { 
          if (res.data.code == 0) {
            let data = res.data.data
            this.allUserList = data
          }
        }).catch(err => {
          this.$message.error(`非项目人员数据获取失败：${err.message}`)
        })
      },
      // 点击新增人员
      addUser () {
        this.addUserListShow = true
        this.getNoUserList()
      },
      // 确定新增人员
      addUserApi () {
        if (this.addUserFormData.addUserList.length === 0) {
          this.closeAddUser()
          return
        }
        let params = {
          project_id: this.$route.params.projectId / 1,
          user_list: this.addUserFormData.addUserList
        }
        userApi.addProjectUser(params).then(res => { 
          if (res.data.code == 0) {
            this.$message.success('新增人员成功')
            this.closeAddUser() 
            this.getUserList()
          }
        }).catch(err => {
          this.$message.error(`新增人员失败：${err.message}`)
        })

      },
      // 关闭新增人员对话框
      closeAddUser () {
        this.addUserListShow = false
        this.addUserFormData.addUserList = []
      },
      // 点击移除人员
      removeUser(row) {
        this.dialogVisible = true
        this.userId = row.userid
        this.userInfo = row
      },
      // 确定移除人员
      sureRemoveUser () {
        let params = {
          project_id: this.$route.params.projectId / 1,
          user_id: this.userId
        }
        userApi.removeProjectUser(params).then(res => {
          if (res.data.code == 0) {
            this.$message.success('用户移除成功！')
            this.getUserList()
            this.dialogVisible = false
          }
        }).catch(err => {
          this.$message.error(`移除用户失败：${err.message}`)
        })
      },
      openNickNameDialog(row){
        this.nickNameEdit.userid = row.userid
        this.nickNameEdit.nickname = row.nickname
        this.nicknameVisible = true
      },
      //关闭修改昵称对话框
      closeNickname(){
        this.nicknameVisible = false
      },
      sureEditNickname(){
        userApi.updateNickName(this.nickNameEdit).then(res=>{
          this.$message.success('昵称修改成功！')
          this.closeNickname()
          //刷新列表
          this.getUserList()
        },error=>{
          this.$message.error(`修改失败：${error.message}`)
        })
      },
      // 关闭重置密码对话框
      closeResetPassword () {
        this.resetPasswordShow = false
        this.resetPasswordData.newPassword = ''
        this.$refs['addForm'].resetFields();
        this.changePassWordId = ''
      },
      // 重置密码
      sureReset () {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            let params = { 
              userid:this.changePassWordId, 
              newpassword:this.resetPasswordData.newPassword,
              project_id: this.$route.params.projectId / 1
            }
            userApi.resetPassword(params).then(res => {
              if (res.data.code == 0) {
                this.$message({
                  message: '密码重置成功！',
                  type: 'success'
                })
              } else {
                this.$message.error(`密码重置失败`)
              }
            },error=>{
              this.$message.error(`密码重置失败:${error.message}`)
            })
            this.closeResetPassword()
          } else {
            this.$message.error('请填写新密码！')
            return false;
          }
        })
      },
      // 打开绑定绝对对话框
      openBindRoleDialog (row) {
        this.userBindRoleVisible = true
        this.userBindRoleForm.nickname = row.nickname
        this.userBindRoleForm.userid = row.userid
        this.userBindRoleForm.roleids = row.role.map(i => i.id)
      },
      // 关闭绑定角色对话框
      closeBindRoleDialog () {
        this.userBindRoleForm.userid = ''
        this.userBindRoleForm.nickname = ''
        this.userBindRoleForm.roleids = []
      },
      // 获取当前项目的人员列表
      getUserList() {
        this.loading = true
        let params = {
          role: this.search.role
        }
        userApi.getUserByProject(this.$route.params.projectId / 1, params).then(res => { 
          if (res.data.code == 0) {
            this.$store.commit('SET_USERLIST',res.data.data) //做一次store重新存储
            this.data = res.data.data.sort((a, b) => a.userid > b.userid)
          }
          this.loading = false
        }).catch(err => {
          this.loading = false
          this.$message.error(`数据获取失败：${err.message}`)
        })
      },
      // 获取所有角色列表
      getRoleList () {
        roleApi.getRoleListNoAdmin().then(res => {
          if (res.data.code == 0) {
            this.roleList = res.data.data
          }
        })
      },
      // 得到角色名称，以逗号拼接
      getRoledata (result) {
        let rr = result.map(x => x.comment)
        var temp = ''
        for(var i in rr){
          temp = temp + rr[i] + ", "
        }
        return temp.substring(0, temp.length-2)
      },
      // 人员绑定角色
      userBindRole () {
        userApi.userBindRole(this.userBindRoleForm.userid, this.userBindRoleForm.roleids, this.$route.params.projectId / 1).then(res => {
          this.$message.success('操作成功')
          this.userBindRoleVisible = false
          this.getUserList()
        }).catch(err => {
          this.$message.error(`操作失败：${err.message}`)
        })
      },
      // 重置密码
      editFun(row) {
        this.resetPasswordShow = true
        this.changePassWordId = row.userid
      }
    }
  }
</script>

<style scoped lang="scss">
.staff{
  padding: 0px 20px;
}
.ant-table-wrapper{
  margin-top:10px;
}
</style>

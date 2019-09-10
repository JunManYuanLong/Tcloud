<template>
  <el-card class="box-card">
    <div class="q-crumb">
      <i class="q-icon fa fa-user"></i>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>个人信息</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <ul class="user-info">
      <li>
        <label>昵称：</label>
        {{userData.nickname}}
      </li>
      <li>
        <label>用户名：</label>
        {{userData.username}}
      </li>
      <li>
        <label>角色：</label>
        <span v-for="(item,index) in  userData.role" :key="item.id">
          {{item.comment}}
          <i v-if="index!=userData.role.length-1">、</i>
        </span>
      </li>
      <li>
        <label>所在项目：</label>
        <span v-for="(item,index) in  userData.project" :key="item.id">
          {{item.name}}
          <i v-if="index!=userData.project.length-1">、</i>
        </span>
      </li>
      <li>
        <label>邮箱：</label>
        {{userData.email}}
      </li>
    </ul>
  </el-card>
</template>
<script>
import userApi from "@/api/user.js";
export default {
  data() {
    return {
      userData: {}
    };
  },
  computed: {
    userId() {
      return this.$store.state.login.userid;
    }
  },
  methods: {
    getSelfInfo() {
      userApi.getSingleRoleUser({ id: this.userId }).then(res => {
        this.userData = res.data.data[0];
      });
    }
  },
  created() {
    this.getSelfInfo();
  }
};
</script>
<style lang="scss" scoped>
.user-info {
  padding-left: 20px;
  text-align: left;
  font-size: 14px;
  label {
    display: inline-block;
    width: 90px;
    color: #999;
  }
  li {
    margin-bottom: 10px;
  }
}
</style>

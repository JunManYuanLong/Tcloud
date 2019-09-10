<template>
  <div class="error-page">
    <div class="error-code">
      4
      <span>0</span>3
    </div>
    <div class="error-desc">啊哦~ 你没有权限访问该页面哦</div>
    <div class="error-handle">
      <router-link to="/">
        <el-button type="primary" size="large">返回首页</el-button>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "Permission",
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>


<style scoped>
.error-page {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  margin-top: 100px;
}
.error-code {
  line-height: 1;
  font-size: 250px;
  font-weight: bolder;
  color: #f02d2d;
}
.error-code span {
  color: #00a854;
}
.error-desc {
  font-size: 30px;
  color: #777;
}
.error-handle {
  margin-top: 30px;
  padding-bottom: 200px;
}
.error-btn {
  margin-left: 100px;
}
</style>

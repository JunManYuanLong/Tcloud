<template>
  <div class="auto-chart">
    <el-tabs v-model="activeName">
      <el-tab-pane label="响应时间(内核&录屏)" name="first">
          <ResponseTime v-if="activeName === 'first'"></ResponseTime>
      </el-tab-pane>
      <el-tab-pane label="首词首屏正确率" name="second">
          <CorrectRate v-if="activeName === 'second'"></CorrectRate>
      </el-tab-pane>
      <el-tab-pane label="响应时间(log)" name="third">
          <ResponseTimeLog v-if="activeName === 'third'"></ResponseTimeLog>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: "AutoChart",
  data() {
    return {
      activeName: "first"
    };
  },
  components: {
    ResponseTime: () => import("./components/ResponseTime.vue"),
    CorrectRate: () => import("./components/CorrectRate.vue"),
    ResponseTimeLog: () => import("./components/ResponseTimeLog.vue")
  }
};
</script>

<style scoped lang="scss">
.auto-chart {
  
}
</style>



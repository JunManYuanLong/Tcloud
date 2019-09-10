<template>
  <div class="panel-wraps">
    <el-tabs v-model="activeTab" type="card">
      <el-tab-pane label="缺陷" name="1" class="task-wrap">
        <keep-alive>
          <issue v-if="activeTab==1"></issue>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="需求" name="2">
        <keep-alive>
          <requirement v-if="activeTab==2"></requirement>
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import issue from './issue.vue'
import requirement from './requirement.vue'
  export default{
    data() {
      return {
        activeTab:"1"
      }
    },
    components:{
      issue,
      requirement
    },
    created(){
    }
  }
</script>
<style lang="scss">
  .panel-wraps .el-tabs__header {
    padding: 0;
    position: relative;
     margin: 0;
    }
</style>

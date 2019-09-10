<template>
  <el-popover
    placement="top-start"
    trigger="hover"
    :content="`电量：${leftVal}%`">
    <span class="battery-content" :class="color" slot="reference">
      <!--  小于20是红色，20到80为黄色，大于80为绿色  -->
      <progress id="pg" max="100" :value="leftVal" class="battery-progress"></progress>
    </span>
  </el-popover>
</template>
<script>
export default {
  name: 'Battery',
  data() {
    return {};
  },
  computed: {
      color () {
          let val = this.leftVal / 1
          if (val <= 20) {
              return 'little'
          }
          if (val < 80) {
              return 'medium'
          }
          return 'full'
      }
  },
  props: [ 'leftVal' ]
};
</script>
<style lang="scss" scoped>
.battery-content {
  width: 25px;
  height: 12px;
  display: inline-block;
}
.battery-progress {
  width: 100%;
  height: 100%;
  border: 1px solid black;
  border-radius: 0.1rem;
}
/* 表示总长度背景色 */
.battery-progress::-webkit-progress-bar {
  background-color: white;
}
.little {
  .battery-progress {
    border: 1px solid red;
  }
  .battery-progress::-webkit-progress-value {
    background: red;
  }
}
.medium {
  .battery-progress {
    border: 1px solid rgb(243, 141, 7);
  }
  .battery-progress::-webkit-progress-value {
    background: rgb(243, 141, 7);
  }
}
.full {
  .battery-progress {
    border: 1px solid rgb(29, 196, 27);
  }
  .battery-progress::-webkit-progress-value {
    background: rgb(29, 196, 27);
  }
}
</style>

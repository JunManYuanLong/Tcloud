<template>
  <div class="push-sidebar" :style="{'height':winHeight+'px'}">
    <el-menu
      :default-openeds="openedsOnRoutes"
      :default-active="activeOnRoutes"
      :collapse = "collapse"
      uniqueOpened
      router
      text-color="#a6adb5"
      active-text-color="#ffffff"
      background-color = "#00142a"
      style="border-right: 0px">
      <el-menu-item v-for="item in sidebar" :key="item.index" :index="item.index" :route="item.route">
        <i :class="item.icon"></i>
        <span slot="title">{{item.text}}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
//  需要配合sidebaritem组件一起使用，配合vue-route一起使用，在route中配置sidebar属性
export default {
  name: 'SideBar',
  props: {
    sidebar: {
      type: Array,
      default () {
        return [{
          icon: 'el-icon-menu',
          dropdown: false,
          text: '测试列表',
          index: 'appList',
          route: {name: 'appList'}
        }]
      }
    },
    collapse:{
      type:Boolean,
      default(){
        return false
      }
    }
  },
  data () {
    return {
      winHeight: window.innerHeight - 60
    }
  },
  computed: {
    activeOnRoutes () {
      if (this.$route.meta.active) {
        return this.$route.meta.active.replace(/\$\(\w*\)/g, key => {
          return this.$route.params[key.slice(2, -1)]
        })
      }
    },
    openedsOnRoutes () {
      return [this.$route.meta.openeds]
    }
  },
  mounted () {
    let _this = this
    window.addEventListener('resize', function () {
      _this.winHeight = window.innerHeight - 60
    }, true)
  },
  beforeDestroy() {
     window.removeEventListener('resize', function () {})
  }
}
</script>

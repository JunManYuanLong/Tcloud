<template>
  <div class="push-sidebar" :style="{'height':winHeight+'px'}">
    <el-menu
      :default-openeds="openedsOnRoutes"
      :default-active="activeOnRoutes"
      :collapse = "true"
      uniqueOpened
      router
      text-color="#a6adb5"
      active-text-color="#ffffff"
      background-color = "#00142a"
      style="border-right: 0px"
    >
      <side-bar-item
        v-for="(item, index) in sidebar"
        :sidebar="item"
        :key="index">
      </side-bar-item>
    </el-menu>
  </div>
</template>

<script>
//  需要配合sidebaritem组件一起使用，配合vue-route一起使用，在route中配置sidebar属性
import SideBarItem from './SideBarItem.vue'
export default {
  name: 'SideBar',
  components: {
    'side-bar-item': SideBarItem
  },
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
  created () {
    //   if (this.$store.getters.isAdmin) {
    //     console.log('是管理员用户，获取所有公司列表')
    //     company.getCompanyList().then(res => {
    //       res.data.data.forEach(item => {
    //         this.sidebar[1].children.push({
    //           icon: 'el-icon-document',
    //           dropdown: false,
    //           text: item.name,
    //           index: 'service_list_' + item.id,
    //           route: {name: 'service_list', params: {companyid: item.id}}
    //         })
    //       })
    //     }).catch(err => {
    //       console.log(err)
    //       this.$message.error('获取侧边栏公司列表失败，请重试')
    //     })
    //   } else {
    //     console.log('不是管理员用户，获取该用户所在公司列表')
    //     this.$store.state.login.company.forEach(item => {
    //       this.sidebar[1].children.push({
    //         icon: 'el-icon-document',
    //         dropdown: false,
    //         text: item.name,
    //         index: 'service_list_' + item.id,
    //         route: {name: 'service_list', params: {companyid: item.id}}
    //       })
    //     })
    //   }
  },
  mounted () {
    let _this = this
    window.addEventListener('resize', function () {
      _this.winHeight = window.innerHeight - 60
    }, true)
  }
}
</script>

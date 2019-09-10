<template>
  <div id="app">
    <!-- <img src="./assets/img/logo.png"> -->
    <router-view/>
  </div>
</template>

<script>
  import userApi from '@/api/user.js'
export default {
  name: 'App',
  computed:{
    userId(){
      return this.$store.state.login.userid
    },
    projects(){
      return this.$store.state.project.projects
    },
  },
  methods:{
    getUserRights(){
      if(this.userId){
        userApi.getUserRoleAndProject({user_id:this.userId}).then(res=>{
          let data = res.data.data
          this.$store.commit('SET_ROLE',data.role)
          
            this.$store.commit('CLEAR_PROJECT_INFOS')
          // if(data.project.toString()!=this.projects){
          // }
          // this.$store.commit('USER_PROJECTS',data.project.toString())
        })
      }
    }
  },
  created(){
    this.getUserRights()
  },
  mounted(){
    //不同标签的用户变化监测刷新
    let _this = this
     window.addEventListener("storage",function(event){
       _this.$store.commit('FLASH_TOKEN')
     },false); 
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>

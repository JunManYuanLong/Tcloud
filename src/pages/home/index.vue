<template>
  <div class="home-page">
    <header>
      <img src="../../assets/img/all_logo.png" alt="">
    </header>
    <div class="body">
       <h3>应用</h3>
       <ul class="list">
         <li class="box-card">
             <div class="logo">
                <img src="../../assets/img/yunce.png" alt="">
             </div>
             <div class="cont">
               <div class="title">云测平台</div>
               <!-- <div class="des"></div> -->
               <router-link :to="{name:'index'}" target="_blank"><el-button type="primary">进入</el-button></router-link>
             </div>
             
         </li>
         <li class="box-card">
             <div class="logo">
                <img src="../../assets/img/yuancheng.png" alt="">
             </div>
             <div class="cont">
               <div class="title">远程调试</div>
               <!-- <div class="des"></div> -->
               <a><el-button type="primary" @click="toStfPage">进入</el-button></a>
             </div>
             
         </li>
       </ul>
    </div>
  </div>
</template>
<script type="text/javascript">
import axios from 'axios'
  export default{
    data(){
      return {}
    },
    // http://stf.ywopt.com:7100/auth/mock/
    // /auth/api/skip/mock?name=
    methods:{
      async gettoken(){
        let token = await axios.get('http://stf.ywopt.com/auth/api/skip/mock',{params:{name:this.$store.getters.userName}})
        return token 
      }, 
      toStfPage(){
        this.gettoken().then(res=>{
          // console.log('tooken',res)
          let url = `http://stf.ywopt.com/?jwt=${res.data.token}`
          window.open(url)
          // window.location.href = url
        })
      }
    },
    created(){
      // console.log('store',this.$store)
    }
  }
</script>
<style lang="scss" scoped>
.home-page{
  h3{
    margin: 20px 0 0 80px;
    color: rgba(0,0,0,.65);
    font-size: 20px;
    padding-left: 8px;
    border-left: 3px solid;
    display: block;
    font-weight: 700;
    text-align: left;
  }
  .logo{
    width: 264px;
    height: 113px;
    display: flex;
    align-items: center;
  }
  .title{
    font-family: PingFangSC-Medium,sans-serif;
    font-size: 16px;
    color: rgba(0,0,0,.85);
    line-height: 24px;
    margin-bottom: 8px;
    text-align: left;
  }
  .des{
    font-family: PingFangSC-Regular,sans-serif;
    font-size: 14px;
    color: rgba(0,0,0,.45);
    line-height: 22px;
    margin-bottom: 20px;
    text-align: left;
  }
  .box-card{
    margin: 0 20px 20px 0;
    width: 264px;
    height: 206px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    border: 1px solid #ebeef5;
    background-color: #fff;
    color: #303133;
    transition: .3s;
    border-radius: 4px;
    overflow: hidden;
  }
  header{
    display:flex;
    padding:10px 20px;
    background-color:#efefef;
  }
  .list{
    display:flex;
    padding:20px 20px 20px 80px
  }
  .cont{
    text-align: left;
    margin-left: 20px;
  }
}
</style>
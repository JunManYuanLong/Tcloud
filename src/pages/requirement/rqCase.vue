<template>
  <div class="rq-case-wrap">
    <p class="rq-info">
    需求ID: {{rqDetail.id}}<span>{{rqDetail.title}}</span>
  </p>
    <p v-if="caseList.length==0">还没有绑定的case! <a :href="rqDetailUrl">前往需求详情页绑定case</a></p>
  <div class="modules-w" v-for="(item,index) in caseList" :key="index">
      <div class="module-bar">
        <div class="info">
          <span class="expend-btn"  @click="handlerOpen(index)" :class="{open:item.isOpen}"></span>
          <img src="../../assets/img/module.png" alt="">
          <span class="module-name">{{item.module_name}}</span>
          <span class="module-count">{{item.info.length}}</span>
        </div>
      </div>
      <div class="task-case-list" v-show="item.isOpen">
        
          <div class="case-item" v-for = "(subItem,subIndex) in item.info" :key="subItem.taskcaseid">
            <div class="checkbox">
              <el-tooltip class="item" effect="dark" content="点击查看详情" placement="top-start"><strong class="view-link" @click="viewCaseDetail(subItem,subIndex,item.info)"><span class="case-number">{{subItem.cnumber}}</span><span class="case-name">{{subItem.title}}</span></strong></el-tooltip>
            </div>
          </div>
      </div>
    </div>
    <caseDetail v-model="showDetailDrawer" :caseData="caseDetailData" :moduleCases="moduleCases" :caseIndex="caseIndex">
      </caseDetail>
  </div>
</template>
<script>
  import requirementApi from '@/api/requirement.js'
  import caseDetail from './caseDetail.vue'
  export default {
    data() {
      return {
        caseList:[],
        rqDetail:{},
        showDetailDrawer:false,
        caseDetailData:{},
        caseIndex:'',
        moduleCases:[]
      }
    },
    components: {
      caseDetail
    },
    watch:{
      
    },
    computed: {
      projectId() {
        return this.$route.params.projectId
      },
      userId() {
        return this.$store.state.login.userid
      },
      requireClass() {
        return this.$route.params.requirementClassId
      },
      requirementId() {
        return this.$route.params.requirementId
      },
      rqDetailUrl(){
        let origin  = window.location.origin 
        let url = `${origin}/#/project/${this.projectId}/requirement/a1/requirementDetail/${this.requirementId}`
        return url
      }
    },
    methods: {
      viewCaseDetail(item,index,moduleCases){
        this.showDetailDrawer= true
        this.caseDetailData = item
        this.caseIndex = index
        this.moduleCases = moduleCases
      },
      getRqCase(){
        requirementApi.getRequirementCase(this.requirementId).then(res=>{
          let data = res.data.data
          let cases = data.map((item,index) =>{
            if(this.caseList.length>0 && this.caseList[index] && this.caseList[index].hasOwnProperty('isOpen')){
                item.isOpen = this.caseList[index].isOpen
              }else{
                if(index == 0){
                   item.isOpen = true
                 }else{
                  item.isOpen = false
                }
              }
              return item
          })
          this.caseList = cases
          console.log('this.caselist',this.caseList)
        },error=>{

        })
      },
      getRqDetail(){
        requirementApi.getDetailById(this.requirementId).then((res) => {
          if (res.data.code === 0) {
            this.rqDetail = res.data.data[0]
          }
        }, (err) => {

        })
      },
      handlerOpen(index){
        let open = !this.caseList[index].isOpen
        this.$set(this.caseList[index],'isOpen',open)
      },
    },
    created() {
      this.getRqCase()
      this.getRqDetail()
    }
  }
</script>

<style lang="scss" scoped>
  .modules-w{
    padding:0 20px 0 0;
    border-bottom: 3px solid #eee;
    .module-bar{
      display:flex;
      justify-content:space-between;
      padding:10px 20px;
      &:hover{
        background-color: rgba(16, 113, 211, 0.08);
      }
      .expend-btn{
        display: -webkit-inline-box;
        position: relative;
        width: 12px;
        height: 12px;
        cursor: pointer;
        flex: 0 0 12px;
        border-width: 1px;
        border-style: solid;
        border-color: rgb(201, 207, 215);
        border-image: initial;
        border-radius: 2px;
        transition: border-color 0.3s ease 0s;
        &:hover{
          border-color: rgb(16, 113, 211);
          &::before,&::after{
            background-color: rgb(16, 113, 211);
          }
        }
        &::before,&::after{
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          display: block;
          width: 6px;
          height: 2px;
          background-color: rgb(201, 207, 215);
          transform: translate(-50%, -50%);
        }
        &::before{
          transition: background-color 0.3s ease 0s;
        }
        &::after{
          transform: translate(-50%, -50%) rotate(-270deg);
          transition: background-color 0.3s ease 0s, transform 0.3s ease 0s;
        }
        &.open::after{
          transform: translate(-50%, -50%);
          transition: background-color 0.3s ease 0s, transform 0.3s ease 0s;
        }
      }
      .info{
        display:flex;
        align-items:center;
        .el-checkbox{
          margin-left:10px;
        }
        img{
          display: block;
          width: 16px;
          height: 16px;
          margin:0 10px;
          flex: 0 0 16px;
        }
        .module-count{
          min-width: 24px;
          font-weight: bold;
          font-size: 12px;
          height: 16px;
          line-height: 14px;
          color: rgb(255, 255, 255);
          margin-left: 8px;
          flex: 0 1 auto;
          padding: 0px 8px;
          background: rgb(212, 216, 222);
          border-radius: 8px;
        }
      }
      .ctr-wrap{
        display:flex;
        text-align:center;
        span{
          display:block;
          color: rgb(145, 153, 163);
        }
        .m-title-1{
          width:76px;
        }
        .m-title-2{
          width:114px;
        }
        .m-title-3{
          width:65px;
        }
      }
    }
  }
  .task-case-list{
    position:relative;
    &::before{
      content: "";
      position: absolute;
      display: block;
      top: 0px;
      left: 25px;
      width: 2px;
      height: 100%;
      background-color: rgb(247, 248, 250);
      transform: translateX(-50%);
      pointer-events: none;
      transition: background-color 0.3s ease 0s;
    }
  }
  .case-item{
    display:flex;
    align-items:center;
    justify-content:space-between;
    padding:10px 20px 10px 42px;
    &:hover{
      background-color: rgba(16, 113, 211, 0.08); 
    }
    .case-number{
      margin-left:8px;
    }
    .checkbox{
      display:flex;
      align-items:center;
      strong{
        display:flex;
      align-items:center;
      }
      .el-checkbox{
        display:flex;
        align-items:center;
      }
      .el-checkbox__label{
        display:none;
      }
    }
    .view-link{
      font-weight:400;
    }
    .case-name{
      margin-left:25px;
      color:#27A9E3;
      cursor:pointer;
    }
    .el-checkbox,.case-name{
      display:block;
    }
    .el-checkbox-group &{
      font-size:14px;
    }
    .ctr-wrap{
      display:flex;
      text-align:center;
      .title-success{
        color:#67c23a;
      }
      .title-info{
        color:#909399;
      }
      .title-danger{
        color:#f56c6c;
      }
      .priority-hred{
        color:#f70707;
      }
      .priority-red{
        color:#f56c6c;
      }
      .priority-wraning{
        color:#e6a23c;
      }
      .ctr-1{
          width:76px;
        }
        .ctr-2{
          width:114px;
        }
        .ctr-3{
          width:65px;
        }
    }
  }
  .case-dropdown-wrap{
    .users{
      max-height:200px;
      overflow:auto;
    }
  }
  .case-priority-list{
    width:80px;
  }
  .rq-info{
    padding:10px 20px;
    background:#eeee;
    span{
      margin-left: 30px;
    }
  }
</style>

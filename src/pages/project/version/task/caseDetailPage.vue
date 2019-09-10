<template>
  <div class="taskcase-detail-page" :style="{height:winHeight+'px','margin-left': versionPanelVisible ? '240px' : '0px'}">
    <el-breadcrumb separator="/" class="com-crumb">
      <el-breadcrumb-item class="title_name">
        <icon-font iconClass="dakaisanshu" @click.native="toggleSide"></icon-font>
      </el-breadcrumb-item>
      <el-breadcrumb-item class="title_name">
        <span>{{curProject.name}}</span>
      </el-breadcrumb-item>
      <el-breadcrumb-item class="title_name" :to="{ name:'versionDetail',params:{versionId:'all'}}">
        <span>
        所有迭代版本
        </span>
      </el-breadcrumb-item>
      <el-breadcrumb-item class="title_name">
        <span>
        执行用例详情
        </span>
      </el-breadcrumb-item>
    </el-breadcrumb>
     <ul class="drawer-case-list">
                <li><label>标题：</label><span>{{caseDetail.title}}</span></li>
                <li><label>前置条件：</label><span>{{caseDetail.precondition}}</span></li>
                <li><label>类型：</label><span>{{getCaseType(caseDetail.ctype)}}</span></li>
                <li><label>优先级：</label><span>{{caseSet.priority[caseDetail.priority]}}</span></li>
                <li><label>步骤描述：</label><ul class="step">
                  <li><div class="index">#</div><div>步骤</div>
                  <div>预期</div></li>
                 <li v-for="(item,index) in step"><div class="index"><span>{{index+1}}</span></div><div v-html="item.step"></div><div v-html="item.expect"></div></li>
                </ul></li>
                <li><label>测试结果：</label>
                  <ul class="case-result">
                    <li class="disabled" :class="{selected:caseDetail.status == 0}">新建</li>
                    <li class="disabled" :class="{selected:caseDetail.status == 1}">已删除</li>
                    <li :class="{selected:caseDetail.status == 3}" @click="checkCaseStatus(3)"><i class="el-icon-circle-check"></i>成功</li>
                    <li :class="{selected:caseDetail.status == 4}"  @click="checkCaseStatus(4)"><i class="el-icon-circle-close"></i>失败</li>
                    <li :class="{selected:caseDetail.status == 2}"  @click="checkCaseStatus(2)"><i class="el-icon-remove"></i>跳过</li>
                  </ul>
                </li>
                <li class="comment-wrap"><label>备注：</label><el-input type="textarea" :rows="4" v-model="comment.text"></el-input></li>
                <li><label></label><el-button @click="doComment" type="success" class="comment-btn">提交</el-button></li>
              </ul>
  </div>
</template>
<script>
import taskcaseApi from '@/api/taskcase'
import setApi from '@/api/settingType.js'
const prefixCls = 'drawer';
  export default{
    data(){
      return {
        winHeight: window.innerHeight - 70,
        visible: this.value,
        caseTypes:['功能回归','冒烟','UI自动化','接口自动化'],
        transfer:true,
        comment:{
          status:false,
          text:''
        },
        caseDetail:[],
        index:this.caseIndex,
        step:[]
      }
    },
    computed:{
      wrapClasses () {
          return [
              `${prefixCls}-wrap`,
              {
                  [`${prefixCls}-hidden`]: !this.visible
              }
          ];
      },
      taskcaseId(){
        return this.$route.params.taskcaseId
      },
      versionPanelVisible () {
        return this.$store.state.version.visible
      },
      projectId(){
        return this.$route.params.projectId
      },
      curProject(){
        return this.$store.state.project.currentProject
      },
      caseSet(){
        return this.$store.state.project.settings.case_config;
      }
    },
    methods:{
      initCaseDetail(){
        taskcaseApi.getTaskcaseById(this.taskcaseId).then(res=>{
          this.caseDetail = res.data.data[0]
          this.comment.text = this.caseDetail.comment
          this.steps()
        })
        
      },
      steps(){
        let step = this.caseDetail.step_result?this.caseDetail.step_result:''
        let stepResult = []
        
        if(step!='' && step.indexOf('step_result')!=-1){
          let res = JSON.parse(step)
          stepResult = res.step_result
        }
        console.log('step',stepResult)
        this.step = stepResult
      },
      close () {
          this.visible = false;
          this.$emit('input', false);
          this.comment.text = ''
          this.$emit('on-close');
      },
      handleMask () {
        this.close();
      },
      handleWrapClick (event) {
        // use indexOf,do not use === ,because ivu-modal-wrap can have other custom className
        const className = event.target.getAttribute('class');
        if (className && className.indexOf('drawer-wrap') > -1) this.handleMask();
        },
       getCaseType(types){
        let ctype = []
        let text = ''
        if(types&&types.indexOf(',')){
          ctype = types.split(',')
        }else{
          ctype = [types]
        }
        ctype.forEach((item,index) => {
          if(index !=ctype.length -1){
            text += this.caseSet.ctype[item] + '，'
          }else{
            text += this.caseSet.ctype[item]
          }
        })
        return text;
      },
      checkCaseStatus(type){
        taskcaseApi.taskcaseStatusUpdate({status:type},this.taskcaseId).then(res=>{
          this.caseDetail = Object.assign(this.caseDetail,{status:type})
          this.$message.success('测试结果修改成功！')
        },error=>{
          this.$message.error(`测试结果修改失败:${error.message}`)
        })
      },
      closeComment(event){
        if(event.target.className.indexOf('comment-btn')==-1&&event.target.parentElement.className.indexOf('comment-btn')==-1&&event.target.parentElement.className.indexOf('comment-text')==-1&&event.target.className.indexOf('issue-comment')==-1){
          this.comment.status  = false
          this.comment.text = ''
        }
        // if(event.target)
      },
      doComment(){
        if(this.comment.status&&!this.comment.text){
          this.$message.error('请先填写留言！')
          return false
        }
        taskcaseApi.taskcaseComment({comment:this.comment.text},this.taskcaseId).then(res=>{
          this.caseDetail = Object.assign(this.caseDetail,{comment:this.comment.text})
            this.$message.success('添加留言成功！')
            // this.comment.text = ''
              // this.getIssueLog()
          },error=>{
            this.$message.error('添加留言失败:'+error.message)
          })
        // this.comment.status = !this.comment.status
      },
      nextCase(){
        if(this.index < this.moduleCases.length - 1){
          this.index++
          let data = this.moduleCases[this.index]
          console.log('next',data)
          this.initCaseDetail(data)
        }else{
          this.$message.warning('已经是此模块最后一条！')
        }
      },
      $resize () {
        this.winHeight = window.innerHeight - 70
      }
    },
    mounted(){
      window.addEventListener('resize', this.$resize, true)
    },
    beforeDestroy(){
      window.removeEventListener("resize", this.$resize);
    },
    created(){
      this.initCaseDetail()
    }
  }
</script>
<style lang="scss" scoped>
.comment-wrap{
  .el-textarea{
    flex:1;
  }
}
.drawer-mask{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(55,55,55,.6);
    height: 100%;
    z-index: 1000;
}
.drawer-hidden{
  display:none!important;
}
.drawer-wrap{
  position: fixed;
    overflow: auto;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1000;
    -webkit-overflow-scrolling: touch;
    outline: 0;
    *{
      box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
    }
    .drawer-right{
      right:0;
      height: 100%;
      position: fixed;
      top: 0;
      width:720px;
    }
  .drawer-content{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    background-color: #fff;
    border: 0;
    background-clip: padding-box;
    box-shadow: 0 4px 12px rgba(0,0,0,.15);
  }
}
.moveRight-enter-active, .moveRight-appear {
  opacity: 0;
  animation-timing-function: ease-in-out;
  animation-duration: .5s;
  animation-fill-mode: both;
  animation-play-state: paused;
   animation-name: moveRightIn;
  animation-play-state: running;
}
.moveRight-leave-active {
  animation-timing-function: ease-in-out;
  animation-duration: .5s;
  animation-fill-mode: both;
  animation-play-state: paused;
   animation-name: moveRightOut;
  animation-play-state: running;
}
@keyframes moveRightIn {
    0% {
        opacity: 0;
        transform-origin: 0 0;
        transform: translateX(100%);
    }
    100% {
        opacity: 1;
        transform-origin: 0 0;
        transform: translateX(0%);
    }
}

@keyframes moveRightOut {
    0% {
        transform-origin: 0 0;
        transform: translateX(0%);
        opacity: 1;
    }
    100% {
        transform-origin: 0 0;
        transform: translateX(100%);
        opacity: 0;
    }
}
.case-detail{
  height:100%;
  overflow:auto;
  .case-number{
    position:relative;
    padding:10px;
    margin-bottom:10px;
    background-color:#e3effd;
    label:nth-of-type(2){
      margin-left:10px;
      padding-left:10px;
      border-left:1px solid #aaa;
    }
    span{
      color:#1086ef;
    }
  }
}
.drawer-case-list{
  padding:0 10px;
  &>li{
    margin-bottom:10px;
    display:flex;
    label{
      display:block;
      width:100px;
      text-align:right;
      color: #999;
    }
    span{
      display:block;
      max-width:220px;
    }
  }
  .step{
    width:590px;
    li{
      margin-bottom:5px;
      display:flex;
      div{
        width:270px;
        &.index{
          width:50px;
          text-align:center;
          span{
            display: inline-block;
            box-sizing: border-box;
            min-width: 18px;
            height: 18px;
            line-height: 14px;
            text-align: center;
            color: white;
            font-size: 12px;
            border-radius: 100%;
            background: #c9cfd7;
            padding: 2px 4px;
          }
        }
        &:nth-of-type(2){
          padding-right:5px;
        }
        &:nth-of-type(3){
          padding-left:5px;
          border-left:1px solid #ccc;
        }
      }
      &:first-child{
        color:#99a9bf;
      }
    }
    &>li{
      border-bottom:1px solid #eee;
      div{
        margin-bottom:5px;
      }
      label{
        text-align:left;
        margin-bottom:5px;
        color: #99a9bf;
      }
    }
    
  }
}
.case-result{
  display:flex;
  margin-bottom:10px;
  li{
    width:80px;
    text-align:center;
    height:34px;
    line-height:34px;
    border:1px solid #ccc;
    border-radius:5px;
    margin-right:10px;
    cursor:pointer;
    &.selected,&:hover{
      background-color:#409eff;
      color:#fff;
      i{
        color:#fff!important;
      }
    }
    &.disabled{
        color: rgb(188, 190, 194);
        background-color: rgb(244, 244, 245);
        border-color: rgb(233, 233, 235);
        cursor:default;
        &.selected{
          color: rgb(188, 190, 194);
          background-color: rgb(244, 244, 245);
          border-color:#409eff;
        }
    }
    i{
      margin-right:5px;
      &.el-icon-circle-check{
        color:#67c23a;
      }
      &.el-icon-circle-close{
        color:#f56c6c;
      }
      &.el-icon-remove{
        color:#e6a23c;
      }
      &.el-icon-warning{
        color:#909399;
      }
    }
  }
}
.button-bar{
  position:fixed;
  right:60px;
  bottom:150px;
  z-index:20;
  button{
    display:block;
    margin-bottom:15px;
  }
}
.issue-comment{
  position:fixed;
  padding-right:60px;
  right:60px;
  bottom:104px;
  z-index:19;
  width:625px;
  border-radius:5px;
  border:1px solid #dcdfe6;
  box-shadow: 0 0 10px rgba(144, 144, 144, 0.4);

}
.next-btn{
  position:absolute;
  right:20px;
  top:5px;
}
.com-crumb{
  margin:20px 0 20px 20px;
}
</style>
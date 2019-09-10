<template>
  <div class="drawer" v-transfer-dom :data-transfer="transfer">
    <transition name="fade">
        <div class="drawer-mask" v-show="visible" @click="handleMask"></div>
    </transition>
    <div :class="wrapClasses" @click="handleWrapClick" >
      <transition name="moveRight">
        <div class="drawer-right" :style="drawerStyle" v-show="visible">
          <div class="drawer-content">
            <div class="case-detail">
              <div class="case-number">
                <label>用例编号：</label><span>{{caseData.cnumber}}</span><label>模块：</label><span>{{caseData.module}}</span>
              </div>
              <ul class="drawer-case-list">
                <li><label>标题：</label><span>{{caseData.title}}</span></li>
                <li><label>前置条件：</label><span>{{caseData.precondition}}</span></li>
                <li><label>类型：</label><span>{{getCaseType(caseData.ctype)}}</span></li>
                <li><label>优先级：</label><span>{{caseSet.priority[caseData.priority]}}</span></li>
                <li><label>步骤描述：</label><ul class="step">
                  <li><div class="index">#</div><div>步骤</div>
                  <div>预期</div></li>
                  <li v-for="(item,index) in step"><div class="index"><span>{{index+1}}</span></div><div v-html="item.step"></div><div v-html="item.expect"></div></li>
                </ul></li>
                <li><label>创建人：</label><span>{{caseData.username}}</span></li>
                <li><label>创建时间：</label><span>{{caseData.creation_time}}</span></li>
                <li><label>修改时间：</label><span>{{caseData.modified_time}}</span></li>
              </ul>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
import TransferDom from '@/directives/transfer-dom';
import setApi from '@/api/settingType.js'
const prefixCls = 'drawer';
  export default{
    name:'caseDetail',
    directives: { TransferDom },
     props: {
      value: {
          type: Boolean,
          default: false
      },
      drawerStyle:{
        type:Object,
        default(){
          return {}
        }
      },
      caseData:{
        type:Object
      }
    },
    data(){
      return {
        visible: this.value,
        caseTypes:['功能回归','冒烟','UI自动化','接口自动化','新功能'],
        transfer:true
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
      caseDetail(){
        return this.caseData
      },
      step(){
        let step = this.caseData.step_result?this.caseData.step_result:''
        let stepResult = []
        
        if(step!='' && step.indexOf('step_result')!=-1){
          let res = JSON.parse(step)
          stepResult = res.step_result
        }
        console.log('step',stepResult)
        return stepResult
      },
      caseSet(){
        return this.$store.state.project.settings.case_config;
      }
    },
    watch:{
      'value':{
        handler:function(val){
          this.visible = val
        },
        deep:true
      }
    },
    methods:{
      close () {
          this.visible = false;
          this.$emit('input', false);
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
    },
    created(){
    }
  }
</script>
<style lang="scss" scoped>
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
</style>
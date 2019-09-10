<template>
  <div class="step-wrap">
    <ul class="steps steps-header">
      <li><div class="index">#</div><div class="step">步骤</div><div class="expect">预期</div></li>
    </ul>
    <ul class="steps steps-content">
      <li v-for="(item,index) in addSteps" :key="index"><div class="index"><span>{{index + 1}}</span></div><div class="step"><divTextarea :id="'step'+index" v-model="item.step" class="input"></divTextarea></div><div class="expect"><divTextarea v-model='item.expect' :id="'expect'+index"></divTextarea></div><div class="opts"><span class="del" title="删除" @click="delStepFun(index)"><i class="el-icon-delete"></i></span><span title="前插入步骤" @click="beforeStepFun(index)"><i class="fa fa-arrow-left"></i></span><span title="后插入步骤" @click="afterStepFun(index)"><i class="fa fa-arrow-right"></i></span></div></li>
    </ul>
    <div class="step-opt" @click="addStepFun">
      <i class="el-icon-plus"></i>增加步骤
    </div>
  </div>
</template>
<script>
import divTextarea from '@/components/divTextarea'
  export default{
    name:'step',
    props:['stepData'],
    data() {
      return {
        addSteps: []
      }
    },
    components:{
      divTextarea
    },
    watch:{
      stepData(val){
        if(val){
          let data = JSON.parse(val)
          this.addSteps = data.step_result
        }
      },
      'addSteps':{
        handler:function(val) {   
          // console.log('watchaddSteps', val)
            //发生变化就给父组件传递
            this.$emit('stepChange',val)
        },
        deep: true    //深度监听
      }
    },
    methods:{
      addStepFun(){
        let obj = {
          step: '',
          expect: ''
        }
        this.addSteps.push(obj)
        this.$nextTick(()=>{
          document.querySelectorAll('.step .input')[this.addSteps.length-1].focus()
        })
        console.log('add',this.addSteps)
        // console.log('this.$refs.cstep',this.$refs.cstep)
        // this.$refs.cstep.focus()
      },
      delStepFun(index){
        console.log('del',index)
        this.addSteps.splice(index,1)
      },
      beforeStepFun(index){
        let obj = {
          step: '',
          expect: ''
        }
        console.log('beforeadd',index,this.addSteps)
        if(index === 0){
          this.addSteps.unshift(obj)
        }else{
          this.addSteps.splice(index,0,obj)
        }
        
      },
      afterStepFun(index){
        let obj = {
          step: '',
          expect: ''
        }
        console.log('afteradd',index,this.addSteps)
        this.addSteps.splice(index + 1,0,obj)
      }
    }
  }
</script>
<style lang="scss" scoped>
.steps{
  width:760px;
  li{
    display:flex;
    align-items:flex-start;
    min-height:40px;
    text-align:left;
    border-bottom: 1px solid rgba(0, 0, 0, 0.07);
    .index{
      width:50px;
      text-align:center;
      span{
        display:inline-block;
        box-sizing: border-box;
        min-width: 18px;
        height: 18px;
        line-height: 14px;
        text-align: center;
        color: rgb(255, 255, 255);
        font-size: 12px;
        border-radius: 100%;
        background: rgb(201, 207, 215);
        padding: 2px 4px;
      }
    }
    .step{
      flex:1;
      border-right: 1px solid #ccc;
      margin-right: 10px;
    }
    .expect{
      flex:1;
    }
  }
  
}
.steps-content{
  position:relative;
  li{
    position:relative;
  }
  li:hover{
    .opts{
      display:flex;
    }
  }
  .opts{
    display:none;
    position:absolute;
    left:-80px;
    top:5px;
    align-items:center;
    z-index:10;
    width:90px;
    background:#fff;
    span{
      display:block;
      flex:1;
      text-align:center;
      color:#409EFF;
      border:1px solid #eee;
      &.del{
        color:#f56c6c;;
      }
    }
  }
}
.step-opt{
  width:760px;
  display: flex;
  align-items: center;
  height: 39px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.07);
  color: rgb(7, 95, 184);
  i{
    display:block;
    padding:0 10px 0 18px;
    font-size: 18px;
    line-height: 16px;
    cursor: pointer;
    user-select: none;
    position: relative;
    color: rgb(7, 95, 184);
  }
}
</style>
<template>
  <div class="drawer" v-transfer-dom :data-transfer="transfer">
    <transition name="fade">
        <div class="drawer-mask" v-show="visible" @click="handleMask"></div>
    </transition>
    <div :class="wrapClasses" @click="handleWrapClick" >
      <transition name="moveRight">
        <div class="drawer-right" :style="drawerStyle" v-show="visible">
          <div class="drawer-content">
            <slot name="drawer-ct"></slot>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
import TransferDom from '@/directives/transfer-dom';
const prefixCls = 'drawer';
  export default{
    name:'drawer',
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
      }
    },
    data(){
      return {
        visible: this.value,
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
      }
    }
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
      width:340px;
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
</style>
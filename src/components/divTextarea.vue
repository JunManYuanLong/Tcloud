<template>
    <div class="edit-div"
         v-html="innerText"
         :contenteditable="canEdit"
         @blur="changeText">
    </div>
</template>
<script type="text/ecmascript-6">
    export default{
        name: 'editDiv',
        props: {
            value: {
                type: String,
                default: ''
            },
            canEdit: {
                type: Boolean,
                default: true
            }
        },
        data(){
            return {
                innerText: this.value,
                isLocked: false
            }
        },
        watch: {
            'value'(val){
              this.innerText = this.value
            }
        },
        methods: {
            changeText(){
                this.$emit('input', this.$el.innerHTML);
            }
        },
        mounted(){
          // this.innerText = this.value
          // console.log('this.innertext',this.innerText,'===',this.value)
        }
    }
</script>
<style lang="scss" scoped>
.edit-div{
  box-sizing: border-box;
  padding: 5px 5px 5px 0;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  outline: 0;
  word-wrap: break-word;
  word-break: break-all;
  overflow-x: hidden;
  overflow-y: auto;
  _overflow-y: visible;
  -webkit-user-modify: read-write-plaintext-only; 
  /*只是编辑text文本，只能解决webkit内核里面问题，手机端适用*/
  -webkit-user-select: text;  
  /*解决IOS部分手机不支持contenteditable=true属性问题*/
}
</style>
<template>
  <div>
    <el-upload
    :action="ossData.host"
    list-type="picture-card"
    :on-remove="handleRemove"
    :on-success="handleSuccess"
    :on-error="handleUploadError"
    :on-exceed="handleExceed"
    :before-upload="handleBeforeUpload"
    :on-preview="handlePictureCardPreview"
    :data="uploadParams"
    :limit="6"
    accept="image/*"
    :fileList="uploadImages"
    :disabled="readOnly"
  >
    <i class="el-icon-plus"></i>
  </el-upload>
    <el-dialog :modal="showModal" :visible.sync="picPreview">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
import {generateUUID, getSuffix} from '@/utils/util.js'
  export default{
    name:'imgUpload',
    props:{
      value:{
        type:Array,
        default(){
          return []
        }
      },
      ossData:{
        type:Object
      },
      showModal:{
        type:Boolean,
        default(){
          return true
        }
      },
      readOnly: {
        type: Boolean,
        default () {
          return false
        }
      }
    },
    data() {
      return {
        uploadImages:this.value,
        // ossData: {},
        picPreview:false,
        dialogImageUrl:'',
        loading:false
      }
    },
    watch:{
      'value':{
        handler:function(cval){
          this.uploadImages = cval
        },
        deep:true
      }
    },
    components:{
    },
    computed:{
      uploadParams () {
      return {
        OSSAccessKeyId: this.ossData.accessid,
        policy: this.ossData.policy,
        signature: this.ossData.signature,
        key: `${this.ossData.dir}${this.filename}`,
        success_action_status: 200
      }
    }
    },
    methods: {
      handleExceed (file, fileList) {
        this.$message.error('上传图片超过上限')
      },
      handleUploadError (error, file, fileList) {
        this.$message.error(error)
      },
      handleRemove (file, fileList) {
        console.log('remove', file)
        if (this.uploadImages.findIndex(item => item.uid === file.uid) !== -1) {
          this.uploadImages.splice(this.uploadImages.findIndex(item => item.uid === file.uid), 1)
        } 
      },
      handleSuccess (response, file, fileList) {
        console.log('success',response)
        file.url = `${this.ossData.cdn_host}/${this.uploadParams.key}`
        this.uploadImages.push(file)
        this.$emit('input',this.uploadImages)
      },
       handlePictureCardPreview(file) {
          this.dialogImageUrl = file.url;
          this.picPreview = true;
        },
      handleBeforeUpload (file) {
        console.log('beforupload', file)
        //文件类型校验
        if (file.type.indexOf('image') === -1) {
          this.$message.error('您上传的不是图片格式的文件！')
          return false
        }
        this.uploadParams.key = `${this.ossData.dir}${generateUUID()}${getSuffix(file.name)}`
      },
      // getOssAuth(){
      //   ossApi.getOssAuth().then(res=>{
      //     console.log('oss',res.data.data)
      //     this.ossData = res.data.data
      //     this.loading = true
      //   },error=>{
      //     this.$message.error('获取oss授权失败' + error.message)
      //   })
      // }
    },
    created() {
      // this.getOssAuth()
    }
  }
</script>

<style lang="scss" scoped>
.issue-edit{
  .title{
    font-size:16px;
    padding:10px 0;
    text-align:left;
  }
}
.addForm{
  .blockItem{
  display:block;

  }

}
.issue-preview-content{
  max-height:400px;
  overflow:auto;
}
</style>

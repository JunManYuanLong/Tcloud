<template>
  <div>
    <el-upload class="taskResult-file-upload"
    :action="ossData.host"
    list-type="text"
    :on-remove="handleRemove"
    :on-success="handleSuccess"
    :on-error="handleUploadError"
    :on-exceed="handleExceed"
    :before-upload="handleBeforeUpload"
    :on-progress="handlerUploadProcess"
    :on-preview="handleFilePreview"
    :data="uploadParams"
    :limit="6"
    :fileList="uploadfiles"
  >
     <!-- <el-progress v-if="fileFlag == true"
       color="#8e71c7"
       :percentage="fileUploadPercent"
       style="margin-top:30px;"></el-progress> -->
       <el-button class="file-btn"
         slot="trigger"
         size="small"
         type="primary">选取文件</el-button>
  </el-upload>
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
      }
    },
    data() {
      return {
        uploadfiles:this.value,
        // ossData: {},
        loading:false,
        fileUploadPercent:0,
        fileFlag:false,
        isShowUploadfile: true,
        filePreview: false,
        fileUrl:''
      }
    },
    watch:{
      'value':{
        handler:function(cval){
          this.uploadfiles = cval
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
        if (this.uploadfiles.findIndex(item => item.uid === file.uid) !== -1) {
          this.uploadfiles.splice(this.uploadfiles.findIndex(item => item.uid === file.uid), 1)
        } 
      },
      handleSuccess (response, file, fileList) {
        console.log('success',response)
        file.url = `${this.ossData.cdn_host}/${this.uploadParams.key}`
        this.uploadfiles.push(file)
        this.fileFlag = false
        this.isShowUploadfile = true
        this.$emit('input',this.uploadfiles)
      },
       handleFilePreview(file) {
          // this.fileUrl = file.url;
          // this.filePreview = true;
          window.open(file.url)
        },
      handleBeforeUpload (file) {
        console.log('beforupload', file)
        
        //文件类型校验
        // const isLt20M = file.size / 1024 / 1024 < 20;
        // if (['file/mp4','file/ogg','file/wmv', 'file/rmvb'].indexOf(file.type) == -1) { //'file/ogg', 'file/flv', 'file/avi', 'file/wmv', 'file/rmvb'
        //     this.$message.error('请上传正确的视频格式');
        //     return false;
        // }
        // if (!isLt20M) {
        //     this.$message.error('上传视频大小不能超过20MB哦!');
        //     return false;
        // }
        this.uploadParams.key = `${this.ossData.dir}${generateUUID()}${getSuffix(file.name)}`
        this.isShowUploadfile = false
      },
      handlerUploadProcess(event, file, fileList){
        this.fileFlag = true;
        this.fileUploadPercent = file.percentage.toFixed(0) * 1;
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
<style lang="scss">
.taskResult-file-upload{
  .el-upload-list{
    width:80%;
    min-width:400px;
  }
}
</style>

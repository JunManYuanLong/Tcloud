<template>
  <div>
    <el-upload class="avatar-uploader el-upload--text" 
    :action="ossData.host"
    list-type="text"
    :on-remove="handleRemove"
    :on-success="handleSuccess"
    :on-error="handleUploadError"
    :on-exceed="handleExceed"
    :before-upload="handleBeforeUpload"
    :on-preview="handleVideoPreview"
    :on-progress="handlerUploadProcess"
    :data="uploadParams"
    :limit="6"
    accept="video/*"
    :fileList="uploadVideos"
    :disabled="readOnly"
  >
     <!-- <el-progress v-if="videoFlag == true"
       type="circle"
       :percentage="videoUploadPercent"
       style="margin-top:30px;"></el-progress> -->
       <el-button class="video-btn"
         slot="trigger"
         size="small"
         type="primary">选取文件</el-button>
  </el-upload>
  <el-dialog  :modal="showModal" :visible.sync="videoPreview" @close="pauseVideo" width="800px" class="video-dialog">
      <video style="width:auto;max-height:450px;" :src="videoUrl" controls="controls" ref="video">您的浏览器不支持 video 标签</video>
    </el-dialog>
  </div>
</template>
<script>
import ossApi from '@/api/oss.js'
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
        uploadVideos:[],
        // ossData: {},
        loading:false,
        videoUploadPercent:0,
        videoFlag:false,
        isShowUploadVideo: true,
        videoPreview: false,
        videoUrl:''
      }
    },
    watch:{
      'value':{
        handler:function(cval){
          this.uploadVideos = cval
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
        this.$message.error('上传视频超过上限')
      },
      handleUploadError (error, file, fileList) {
        this.$message.error(error)
      },
      handleRemove (file, fileList) {
        console.log('remove', file)
        if (this.uploadVideos.findIndex(item => item.uid === file.uid) !== -1) {
          this.uploadVideos.splice(this.uploadVideos.findIndex(item => item.uid === file.uid), 1)
        } 
      },
      handleSuccess (response, file, fileList) {
        console.log('success',response)
        file.url = `${this.ossData.cdn_host}/${this.uploadParams.key}`
        this.uploadVideos.push(file)
        this.videoFlag = false
        this.isShowUploadVideo = true
        this.$emit('input',this.uploadVideos)
      },
       handleVideoPreview(file) {
          this.videoUrl = file.url;
          this.videoPreview = true;
        },
      handleBeforeUpload (file) {
        console.log('beforupload', file)
        
        //文件类型校验
        const isLt20M = file.size / 1024 / 1024 < 20;
        if (['video/mp4','video/ogg','video/wmv', 'video/rmvb'].indexOf(file.type) == -1) { //'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb'
            this.$message.error('请上传正确的视频格式');
            return false;
        }
        // if (!isLt20M) {
        //     this.$message.error('上传视频大小不能超过20MB哦!');
        //     return false;
        // }
        this.uploadParams.key = `${this.ossData.dir}${generateUUID()}${getSuffix(file.name)}`
        this.isShowUploadVideo = false
      },
      handlerUploadProcess(event, file, fileList){
        this.videoFlag = true;
        this.videoUploadPercent = file.percentage.toFixed(0) * 1;
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
      pauseVideo(){
        this.$refs.video.pause()
      }
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
<style lang="scss" scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.video-avatar {
  width: 400px;
  height: 200px;
}
</style>

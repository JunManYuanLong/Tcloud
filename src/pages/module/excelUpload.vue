<template>
  <div class="Excel-up-wrap" v-loading="loading">
    <el-upload  v-if="!excelUrl" class="Excel-upload"
    :action="ossData.host"
    :show-file-list="false"
    :http-request="uploadFun"
    :on-success="handleSuccess"
    :on-error="handleUploadError"
    :before-upload="handleBeforeUpload"
    :data="uploadParams"
    accept=".xls,.csv,.xlsx"
  >
    <img src="../../assets/img/excel-up-1.png" alt="点击上传" title="点击上传" class="up-btn">
  </el-upload>
  <div class="excel-tmp" v-if="!excelUrl"><label for="load">模板下载：</label><a href="http://tcloud-static.oss-cn-beijing.aliyuncs.com/case_import/nobody/example.xls" target="_blank" name="load">case用例模板</a></div>
  <div class="has-file" v-if="excelUrl">
    <img src="../../assets/img/excel-up.png" alt="">
    <i class="delete-btn el-icon-circle-close" @click="deleteExcel"></i>
  </div>
  <p class="error">{{errorMsg}}</p>
    <!-- <el-dialog :visible.sync="picPreview">
      <img width="100%" :src="dialogexcelUrl" alt="">
    </el-dialog> -->
  </div>
</template>
<script>
import axios from 'axios'
const { CancelToken, isCanCel } = axios;
const source = CancelToken.source();
const fileCancel = 'FILE_CANCEL'
import {generateUUID, getSuffix} from '@/utils/util.js'
  export default{
    name:'imgUpload',
    props:{
      value:{
        type:String,
        default(){
          return ''
        }
      },
      ossData:{
        type:Object
      },
      errorMsg:{
        type:String,
        default(){
          return ''
        }
      }
    },
    data() {
      return {
        excelUrl:this.value,
        uploadExcels:[],
        // ossData: {},
        picPreview:false,
        dialogexcelUrl:'',
        loading:false
      }
    },
    watch:{
      'value':{
        handler:function(cval){
          this.excelUrl = cval
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
      uploadFun(params){
        let data = new FormData()
        let file = params.file
        let key = `${this.ossData.dir}${generateUUID()}${getSuffix(file.name)}`
        data.append('OSSAccessKeyId', this.ossData.accessid)
        data.append('policy', this.ossData.policy)
        data.append('signature', this.ossData.signature)
        data.append('success_action_status', 200)
        data.append('key', key)
        data.append('file', file)
         // let config = {
         //   headers:{'Content-Type':'multipart/form-data'}
         // };  //添加请求头
        axios.post(this.ossData.host,data,{cancelToken:source.token}).then(res =>{
          let url = `${this.ossData.cdn_host}/${key}`
          this.excelUrl = url
          this.$emit('input',this.excelUrl)
          this.loading = false
           // params.onSuccess()
        }).catch(err=>{
          if (typeof isCanCel == 'function'&&isCanCel(err)) {
            // 获取 取消请求 的相关信息
            console.log('Request canceled', err);
          } else {
            // 处理其他异常
            console.log('上传失败！')
          }
          this.loading = false 
        })

      },
      cancelFileUpload(){
        if(this.loading){
          source.cancel()
        }
        this.loading = false
      },
      handleExceed (file, fileList) {
        this.$message.error('上传文件超过上限')
      },
      handleUploadError (error, file, fileList) {
        this.$message.error(error)
      },
      handleSuccess (response, file, fileList) {
        console.log('success',response)
        file.url = `${this.ossData.cdn_host}/${this.uploadParams.key}`
        this.excelUrl = file.url
        console.log('excelUrl',this.excelUrl)
        this.$emit('input',this.excelUrl)
        this.loading = false
      },
       handlePictureCardPreview(file) {
          this.dialogexcelUrl = file.url;
          this.picPreview = true;
        },
      handleBeforeUpload (file) {
        console.log('beforupload', file)
        // this.excelUrl = ''
        //文件类型校验
        if (file.name.indexOf('.csv') === -1&&file.name.indexOf('.xls') === -1&&file.name.indexOf('.xlsx') === -1) {
          this.$message.error('您上传的不是excel格式的文件！')
          return false
        }
        this.uploadParams.key = `${this.ossData.dir}case_import/${generateUUID()}${getSuffix(file.name)}`
        this.loading = true
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
      deleteExcel(){
        this.excelUrl = ''
        this.$emit('input',this.excelUrl)
        this.$emit('clearMsg','')
      }
    },
    created() {
      // this.getOssAuth()
    }
  }
</script>
<style lang="scss" scoped>
.Excel-up-wrap{
  position:relative;
  text-align:center;
  .delete-btn{
    position: absolute;
    top: -12px;
    left: -12px;
    z-index: 10;
    font-size: 24px;
    color: #fd5252;
    cursor:pointer;
  }
  .excel-tmp{
    margin-top:10px;
  }
  .error{
    color:#f56c6c;
    margin-top:10px;
  }
  .has-file{
    display:inline-block;
    text-align:center;
    position:relative;
    img{
      width:60px;
    }
  }

}
.Excel-upload{
  position:relative;
  text-align:center;
  margin:15px 0 10px;
  .up-btn{
     width:60px;
  }

}
</style>

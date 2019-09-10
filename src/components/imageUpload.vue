<template>
  <div class="ph-fileUpload2">
      <el-upload
        class="ph-uploader2"
        :class="{imgUpload:!useButton}"
        :action="ossHost"
        :accept="accept"
        :auto-upload="true"
        :multiple="multiple"
        :limit="limit"
        :data="uploadParams"
        list-type="picture-card"
        :show-file-list="showFileList"
        :on-success="handleUploadSuccess"
        :on-error="handleUploadError"
        :before-upload="handleBeforeUpload"
        :on-exceed="handleExceed"
        :on-remove="handleRemove"
        :fileList="files"
        ref="fileUpload"
      >
        <img ref="image" v-if="files.length>0&&isImage" v-for="(item,index) in files" :key="index" :src="item" class="ph-img2">
        <div class="ph-file-list"  v-if="files.length>0&&!isImage">
          <span v-for="(item,index) in files" :key="index" class="ph-files2">{{item}}</span>
        </div>
        <i v-if="files.length==0&&!useButton" class="el-icon-plus ph-uploader-icon2"></i>
        <el-button v-if="files.length==0&&useButton" size="small" type="primary">选择文件</el-button>
      </el-upload>
      <!-- <el-button v-if="files.length&&multiple" class="ph-files-clear" @click="clearFiles">清除文件</el-button> -->
  </div>
</template>
<script>
export default {
  name: 'imageUpload',
  props: {
    ossData: {
      type: Object
    },
    multiple: {
      type: Boolean,
      default () {
        return false
      }
    },
    showFileList: {
      type: Boolean,
      default () {
        return false
      }
    },
    limit: {
      type: Number
    },
    accept: {
      type: String,
      default () {
        return 'image/*'
      }
    },
    maxSize: {
      type: Number
    },
    useButton: {
      type: Boolean,
      default () {
        return false
      }
    },
    useRandomName: {
      type: Boolean,
      default () {
        return true
      }
    },
    value: {
      type: [Array, String],
      default () {
        return []
      }
    }
  },
  data () {
    return {
      uploadParams: {
        OSSAccessKeyId: '',
        policy: '',
        signature: '',
        key: '',
        success_action_status: 200
      },
      files: [],
      randomName: []
    }
  },
  computed: {
    cdnHost () {
      return this.ossData.cdn_host
    },
    ossHost () {
      return this.ossData.host || ''
    },
    isImage () {
      if (this.accept.indexOf('image') !== -1) {
        return true
      } else {
        return false
      }
    },
    getOssData () {
      return this.ossData
    }
  },
  watch: {
    ossData (oss) {
      console.log('oss', oss)
      this.uploadParams.OSSAccessKeyId = oss.accessid
      this.uploadParams.policy = oss.policy
      this.uploadParams.signature = oss.signature
    },
    'value': {
      handler: function (val, oldVal) {
        if (typeof val === 'string') {
          this.files = val ? [val] : []
        } else {
          this.files = val
        }
      },
      deep: true
    }
  },
  methods: {
    handleUploadSuccess (response, file, fileList) {
      console.log('success')
      // console.log('filelist', response, file, fileList)
      this.files = []
      if (this.useRandomName) {
        fileList.forEach((item, index) => {
          let file = `${this.cdnHost}/${this.randomName[index]}`
          this.files.push(file)
        })
        this.$emit('getFiles', this.files)
        if (!this.multiple && this.files.length === 1) {
          this.$emit('input', this.files[0])
        } else {
          this.$emit('input', this.files)
        }
      } else {
        fileList.forEach((item) => {
          let file = `${this.cdnHost}/${this.getOssData.dir}${item.name}`
          this.files.push(file)
        })
        this.$emit('getFiles', this.files)
        if (!this.multiple && this.files.length === 1) {
          this.$emit('input', this.files[0])
        } else {
          this.$emit('input', this.files)
        }
      }
      // 如果只允许单文件的话，上传后就清空文件列表
      if (!this.multiple) {
        this.$refs.fileUpload.clearFiles()
        this.randomName = []
      }
    },
    handleUploadError (error, file, fileList) {
      this.$message.error(error)
    },
    handleBeforeUpload (file) {
      console.log('beforupload', file)
      // 判断文件大小1kb=1024b
      let size = Math.ceil(file.size / 1024)
      if (this.maxSize && (size > this.maxSize)) {
        this.$message.error('文件大小超出了限制！')
        return false
      }
      // 文件类型校验
      if (this.isImage && file.type.indexOf('image') === -1) {
        this.$message.error('您上传的不是图片格式的文件！')
        return false
      } else if (!this.isImage && file.type !== this.accept) {
        this.$message.error('您上传的文件格式不正确！')
        return false
      }
      // 设置上传路径和文件名字
      if (this.useRandomName) {
        let suffix = this.get_suffix(file.name)
        this.uploadParams.key = this.getOssData.dir + this.random_string(10) + suffix
        this.randomName.push(this.uploadParams.key)
      } else {
        this.uploadParams.key = this.getOssData.dir + file.name
      }
    },
    handleExceed (files, fileList) {
      this.$message.error('文件超出个数限制了！')
    },
    handleRemove (file, fileList) {
      console.log('remove', file)
      // this.files.splice()
      // if (this.files.findIndex(item => item.uid === file.uid) !== -1) {
      //   this.files.splice(this.files.findIndex(item => item.uid === file.uid), 1)
      // } else {
      //   this.$message.error('删除图片异常，请重试')
      // }
    },
    clearFiles () {
      this.files = []
      this.randomName = []
      // 清除上传列表的文件
      this.$refs.fileUpload.clearFiles()
      this.$emit('getFiles', this.files)
    },
    random_string (len) {
      len = len || 32
      var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
      var maxPos = chars.length
      var pwd = ''
      var time = new Date().getTime().toString()
      for (var i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos))
      }
      return pwd + time
    },
    get_suffix (filename) {
      var pos = filename.lastIndexOf('.')
      var suffix = ''
      if (pos !== -1) {
        suffix = filename.substring(pos)
      }
      return suffix
    }
  },
  created () {
    if (typeof this.value === 'string') {
      this.files = this.value ? [this.value] : []
    } else {
      this.files = this.value
    }
    console.log('createFile', this.files)
    this.uploadParams.OSSAccessKeyId = this.ossData.accessid
    this.uploadParams.policy = this.ossData.policy
    this.uploadParams.signature = this.ossData.signature
  }
}
</script>
<style>
  .ph-uploader.imgUpload .el-upload2 {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .ph-uploader .el-upload2:hover {
    border-color: #409EFF;
  }
  .ph-uploader-icon2 {
    font-size: 28px;
    color: #8c939d;
    width: 48px;
    height: 48px;
    line-height: 48px;
    text-align: center;
  }
  .ph-img2 {
    border-radius: 50%;
    width: 48px;
    height: 48px;
    display: inline-block;
    /*margin-right: 10px;*/
    vertical-align: top;
  }
  .ph-files {
    color:#666;
    display: block;
    margin-bottom: 5px;
  }
  .ph-file-list {
    padding:5px 10px;
    border:1px solid #d9d9d9;
    border-radius:5px;
  }
</style>
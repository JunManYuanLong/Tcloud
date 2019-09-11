<template>
  <div class="image-up-wrap" v-loading="loading">
    <el-upload
      class="image-upload"
      :action="ossData.host"
      :show-file-list="false"
      :on-success="handleSuccess"
      :on-error="handleUploadError"
      :before-upload="handleBeforeUpload"
      :data="uploadParams"
      accept="image/*"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar" />
      <i v-if="imageUrl" class="edit-icon el-icon-edit-outline"></i>
      <i v-if="!imageUrl" class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
    <i v-if="imageUrl" class="el-icon-delete delete-btn" @click="deleteImg"></i>
    <!-- <el-dialog :visible.sync="picPreview">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>-->
  </div>
</template>
<script>
import { generateUUID, getSuffix } from "@/utils/util.js";
export default {
  name: "imgUpload",
  props: {
    value: {
      type: String,
      default() {
        return "";
      }
    },
    ossData: {
      type: Object
    }
  },
  data() {
    return {
      imageUrl: this.value,
      uploadImages: [],
      // ossData: {},
      picPreview: false,
      dialogImageUrl: "",
      loading: false
    };
  },
  watch: {
    value: {
      handler: function(cval) {
        this.imageUrl = cval;
      },
      deep: true
    }
  },
  components: {},
  computed: {
    uploadParams() {
      return {
        OSSAccessKeyId: this.ossData.accessid,
        policy: this.ossData.policy,
        signature: this.ossData.signature,
        key: `${this.ossData.dir}${this.filename}`,
        success_action_status: 200
      };
    }
  },
  methods: {
    handleExceed(file, fileList) {
      this.$message.error("上传图片超过上限");
    },
    handleUploadError(error, file, fileList) {
      this.$message.error(error);
    },
    handleSuccess(response, file, fileList) {
      console.log("success", response);
      file.url = `${this.ossData.cdn_host}/${this.uploadParams.key}`;
      this.imageUrl = file.url;
      this.$emit("input", this.imageUrl);
      this.loading = false;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.picPreview = true;
    },
    handleBeforeUpload(file) {
      console.log("beforupload", file);
      // this.imageUrl = ''
      //文件类型校验
      if (file.type.indexOf("image") === -1) {
        this.$message.error("您上传的不是图片格式的文件！");
        return false;
      }
      this.uploadParams.key = `${this.ossData.dir}${generateUUID()}${getSuffix(
        file.name
      )}`;
      this.loading = true;
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
    deleteImg() {
      this.imageUrl = "";
      this.$emit("input", this.imageUrl);
    }
  },
  created() {
    // this.getOssAuth()
  }
};
</script>
<style lang="scss" scoped>
.image-up-wrap {
  position: relative;
  .delete-btn {
    position: absolute;
    top: 0;
    left: 30px;
    z-index: 10;
    font-size: 20px;
    padding: 2px;
    color: #fff;
    background: #fd5252;
  }
}
.image-upload {
  position: relative;
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    &:hover {
      border-color: #409eff;
    }
  }
  img {
    min-height: 178px;
    max-width: 90%;
  }
  .edit-icon {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    font-size: 20px;
    color: #fff;
    background: #59f30d;
    padding: 2px;
  }
}
</style>

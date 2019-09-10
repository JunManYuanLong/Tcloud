<template>
  <div>
    <el-upload
      class="upload-box"
      drag
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
      :limit="10"
      :fileList="uploadfiles"
      :disabled="readOnly"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        <p style="font-size: 16px;">
          将文件拖到此处，或
          <em>点击上传</em>
        </p>
        <p style="font-size: 14px; color: rgba(0,0,0,.45);">
          暂时只支持android包
          <br>请注意上传文件的格式与大小，避免上传出现问题
        </p>
      </div>
    </el-upload>
  </div>
</template>
<script>
import { generateUUID, getSuffix } from "@/utils/util.js";
export default {
  name: "imgUpload",
  props: {
    value: {
      type: Array,
      default() {
        return [];
      }
    },
    ossData: {
      type: Object
    },
    readOnly: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  data() {
    return {
      uploadfiles: this.value,
      loading: false,
      fileUploadPercent: 0,
      fileFlag: false,
      isShowUploadfile: true,
      filePreview: false,
      fileUrl: ""
    };
  },
  watch: {
    value: {
      handler: function(cval) {
        this.uploadfiles = cval;
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
    // 上传数量超过限制回调
    handleExceed(file, fileList) {
      this.$message.error("上传apk包数量超过上限");
    },
    // 上传失败的回调
    handleUploadError(error, file, fileList) {
      this.$message.error(error);
    },
    // 上传成功的回调
    handleSuccess(response, file, fileList) {
      console.log("success", response);
      file.url = `${this.ossData.cdn_host}/${this.uploadParams.key}`;
      this.uploadfiles.push(file);
      this.fileFlag = false;
      this.isShowUploadfile = true;
      this.$emit("input", this.uploadfiles);
      // 调用接口，将url传给后台
      this.$emit('uploadUrl', file)
    },
    // 移除成功的回调
    handleRemove(file, fileList) {
      console.log("remove", file);
      if (this.uploadfiles.findIndex(item => item.uid === file.uid) !== -1) {
        this.uploadfiles.splice(this.uploadfiles.findIndex(item => item.uid === file.uid), 1);
      }
    },
    // 预览
    handleFilePreview(file) {
      window.open(file.url);
    },
    // 文件上传之前的钩子
    handleBeforeUpload(file) {
      // 校验上传的是否是apk包
      console.log("beforupload", file);
      let fileNameSplit = file.name.split(".");
      let fileSuffix = fileNameSplit[fileNameSplit.length - 1];
      if (fileSuffix === "apk") {
        this.uploadParams.key = `${
          this.ossData.dir
        }${generateUUID()}${getSuffix(file.name)}`;
        this.isShowUploadfile = false;
      } else {
        this.$message.warning('暂时只支持android包上传')
        return false
      }
    },
    // 文件上传的钩子
    handlerUploadProcess(event, file, fileList) {
      this.fileFlag = true;
      this.fileUploadPercent = file.percentage.toFixed(0) * 1;
    }
  },
  created() {}
};
</script>

<style lang="scss" scoped>
</style>

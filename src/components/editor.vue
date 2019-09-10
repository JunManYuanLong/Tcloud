<template>
  <div id="editor" class="full" ref="editorone">
    <el-button type="text" @click="fullFunc" class="full-btn">
      <span class="iconfont" :class="fullClass" style="color: #666666;"></span>
    </el-button>
    <ckeditor
      id="ck-editor"
      :editor="editor"
      v-model="editorData"
      :config="editorConfig"
      @ready="onReady"
    ></ckeditor>
  </div>
</template>
<script>
import { generateUUID, getSuffix } from "@/utils/util.js";
import axios from "axios";
import ossApi from "@/api/oss.js";

let ossData = {};
ossApi.getOssAuth().then(
  res => {
    if (res) {
      ossData = res.data.data;
    }
  },
  error => {
    console.log("获取oss授权失败" + error.message);
  }
);

//图片上传适配器。
class UploadImageAdapter {
  constructor(loader) {
    this.loader = loader;
  }

  upload() {
    return new Promise((resolve, reject) => {
      const data = new FormData();
      this.loader.file.then(file => {
        console.log("loaderfile", file);
        let key = `${ossData.dir}${generateUUID()}${getSuffix(file.name)}`;
        console.log("loaderfile", file);
        data.append("OSSAccessKeyId", ossData.accessid);
        data.append("policy", ossData.policy);
        data.append("signature", ossData.signature);
        data.append("success_action_status", 200);
        data.append("key", key);
        data.append("file", file);
        axios.post(ossData.host, data).then(
          res => {
            let url = `${ossData.cdn_host}/${key}`;
            resolve({
              default: url
            });
          },
          error => {
            // reject(`上传失败${error}`);
            reject(`上传失败，请强制刷新页面，重新操作！`);
          }
        );
      });
    });
  }

  abort() {}
}

// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CKEditor from '@ckeditor/ckeditor5-vue'

import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document";
import "@ckeditor/ckeditor5-build-decoupled-document/build/translations/zh-cn.js";

export default {
  name: "editor",
  props: {
    value: String
  },
  components: {
      // Use the <ckeditor> component in this view.
      ckeditor: CKEditor.component
  },
  data() {
    return {
      // 全屏按钮样式
      fullClass: "icon-quanping",
      editor: DecoupledEditor,
      editorData: this.value,
      editorConfig: {
        language: "zh-cn",
        toolbar: {
          items: [
            "heading",
            "|",
            "fontSize",
            "fontFamily",
            "|",
            "bold",
            "Underline",
            "Strikethrough",
            "highlight",
            "alignment",
            "|",
            "link",
            "blockQuote",
            "imageUpload",
            "insertTable",
            "|",
            "undo",
            "redo"
          ]
        }
      }
    };
  },
  watch: {
    editorData: {
      handler: function(val) {
        this.$emit("input", val);
      },
      deep: true
    },
    value: {
      handler: function(val) {
        this.editorData = val;
      },
      deep: true
    }
  },
  methods: {
    // 新增全屏
    fullFunc() {
      // 判断是否是全屏状态, 改变按钮状态
      if (this.isFull()) {
        this.exitFullscreen();
        this.fullClass = "icon-quanping";
      } else {
        this.fullScreen(this.$refs.editorone);
        this.fullClass = "icon-tuichuquanping";
      }
    },
    // 全屏方法（兼容）
    fullScreen(ele) {
      if (ele.requestFullscreen) {
        ele.requestFullscreen();
      } else if (ele.mozRequestFullScreen) {
        ele.mozRequestFullScreen();
      } else if (ele.webkitRequestFullscreen) {
        ele.webkitRequestFullscreen();
      } else if (ele.msRequestFullscreen) {
        ele.msRequestFullscreen();
      }
    },
    // 取消全屏（兼容）
    exitFullscreen() {
      if (document.exitFullScreen) {
        document.exitFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (element.msExitFullscreen) {
        element.msExitFullscreen();
      }
    },
    // 判断是否是全屏状态（兼容）
    isFull() {
      return !!(
        document.fullscreen ||
        document.mozFullScreen ||
        document.webkitIsFullScreen ||
        document.webkitFullScreen ||
        document.msFullScreen
      );
    },
    // 绑定全屏事件
    addFullListen() {
      document.addEventListener("fullscreenchange", this.$fullscreenchange);
    },
    $fullscreenchange() {
      if (!this.isFull()) {
        this.fullClass = "icon-quanping";
      }
    },
    onReady(editor) {
      // Insert the toolbar before the editable area.
      this.$editor = editor;
      editor.ui
        .getEditableElement()
        .parentElement.insertBefore(
          editor.ui.view.toolbar.element,
          editor.ui.getEditableElement()
        );
      editor.plugins.get("FileRepository").createUploadAdapter = loader => {
        return new UploadImageAdapter(loader);
      };
    }
  },
  mounted() {
    this.addFullListen(); // 绑定全屏监测事件
  },
  beforeDestroy() {
    document.removeEventListener("fullscreenchange", this.$fullscreenchange);
  },
  destroyed () {
    document.removeEventListener("fullscreenchange", this.$fullscreenchange); 
  }
};
</script>
<style lang="scss">
#ck-editor {
  background-color: white;
  border-left: 1px solid #c4c4c4;
  border-bottom: 1px solid #c4c4c4;
  border-right: 1px solid #c4c4c4;
  min-height: 200px;
}

.full:fullscreen {
  #ck-editor {
    height: 100vh;
  }
}

#editor {
  position: relative;

  .full-btn {
    position: absolute;
    top: 5px;
    right: 15px;
  }
}
</style>

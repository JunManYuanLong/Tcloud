<template>
  <div class="random-test">
    <el-card class="card-auto" shadow="nerver">
      <el-steps :active="activeNum" align-center>
        <el-step title="测试方案介绍"></el-step>
        <el-step title="上传apk"></el-step>
        <el-step title="选择测试机型"></el-step>
        <el-step title="更多配置"></el-step>
        <el-step title="提交测试"></el-step>
      </el-steps>
      <div class="random-content">
        <Introduce v-show="showTab[0]"></Introduce>
        <UploadApk v-show="showTab[1]"></UploadApk>
        <ChooseModel v-show="showTab[2]" @selectModel="selectModel"></ChooseModel>
        <MoreConfig v-show="showTab[3]"></MoreConfig>
        <SubmitTest v-show="showTab[4]"></SubmitTest>
      </div>
      <el-button style="margin-top: 20px;" v-if="showBack" @click="lastStep">上一步</el-button>
      <el-button
        type="primary"
        style="margin-top: 20px;"
        @click="nextStep"
        :disabled="!canNextStep"
      >{{stepText}}</el-button>
    </el-card>
  </div>
</template>
<script>
import Introduce from "./components/Introduce";
import UploadApk from "./components/UploadApk";
import ChooseModel from "./components/ChooseModel";
import MoreConfig from "./components/MoreConfig";
import SubmitTest from "./components/SubmitTest";
import monkeyApi from "@/api/monkey.js";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
export default {
  data() {
    return {
      activeNum: 1,
      stepText: "下一步",
      canNextStep: true,
      selectedList: [] // 选中的手机列表
    };
  },
  computed: {
    ...mapState('autotest', ['selectApk', 'runTime', 'selectPhoneList', 'testType']),
    ...mapGetters('autotest', ['getJumpLogin', 'getIsInstallApp']),
    showBack() {
      return this.activeNum !== 1;
    },
    showTab() {
      let arr = [false, false, false, false, false];
      arr.forEach(item => {
        item = false;
      });
      arr[this.activeNum - 1] = true;
      return arr;
    },
    userId() {
      return this.$store.state.login.userid;
    }
  },
  components: {
    Introduce,
    UploadApk,
    ChooseModel,
    MoreConfig,
    SubmitTest
  },
  methods: {
    ...mapMutations("autotest", ["setSelectApk"]),
    // 提交测试
    submitTest() {
      let mobileData = JSON.parse(JSON.stringify(this.selectPhoneList))
      let mobile_infos = mobileData.map(item => {
        return {
          mobile_id: item.serial,
          mobile_version: item.version,
          mobile_model: item.manufacturer + ' ' + item.model,
          mobile_resolution: `${item.display.height} x ${item.display.width}`
        }
      })
      let params = {
        user_id: this.userId,
        mobile_infos,
        system_device: 0, 
        login_required: this.getJumpLogin,  
        app_install_required: this.getIsInstallApp,
        login_username: '',
        login_password: '',
        type_id: this.testType / 1,
        run_time: this.runTime / 1,
        app_id: this.selectApk.id
      };
      monkeyApi
        .submiTest(params)
        .then(res => {
          // 跳转到列表页
          this.$message.success("提交成功");
          window.location.hash = "#/auto/report";
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    // 下一步
    nextStep() {
      if (this.activeNum === 2) {
        // 判断有没有选中安装包
        if (JSON.stringify(this.selectApk) === "{}") {
          this.$message.warning("请选择安装包");
          return;
        }
      }
      if (this.activeNum < 5) {
        this.activeNum++;
        this.stepStatus(this.activeNum);
        return;
      }
      if (this.activeNum === 5) {
        // 调用提交接口
        this.submitTest();
      }
    },
    // 上一步
    lastStep() {
      if (this.activeNum > 1) {
        this.activeNum--;
        this.stepStatus(this.activeNum);
      }
    },
    // 确定按钮状态
    stepStatus(activeNum) {
      if (this.activeNum === 3) {
        if (this.selectedList.length === 0) {
          this.stepText = "下一步 [ 请先选择手机 ]";
          this.canNextStep = false;
        } else {
          this.canNextStep = true;
          this.stepText = `下一步 [您已选择${this.selectedList.length}台手机]`;
        }
      } else if (this.activeNum === 5) {
        this.canNextStep = true;
        this.stepText = "提交";
      } else {
        this.canNextStep = true;
        this.stepText = "下一步";
      }
    },
    // 选中模型后的回调
    selectModel(selectedList) {
      this.selectedList = selectedList;
      console.log(this.selectedList)
      if (this.activeNum === 3) {
        if (selectedList.length > 0) {
          this.canNextStep = true;
          this.stepText = `下一步 [您已选择${this.selectedList.length}台手机]`;
        } else {
          this.canNextStep = false;
          this.stepText = "下一步 [ 请先选择手机 ]";
        }
      }
    }
  },
  beforeDestroy() {
    this.setSelectApk({});
  }
};
</script>

<style scoped lang="scss">
.random-test {
  font-size: 14px;
}
</style>
<style lang="scss">
</style>


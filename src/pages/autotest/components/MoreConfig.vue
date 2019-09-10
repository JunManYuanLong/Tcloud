<template>
  <div class="more-config">
    <ArrowContainer head-text="配置填写说明">
      <div slot="content" class="more-config-desc">
        <p class="desc-line">
          <el-tag size="mini" type="info">运行时间</el-tag>：最好大于等于3小时，可以覆盖更多的页面，发现问题的概率更高。
        </p>
        <p class="desc-line">
          <el-tag size="mini" type="info">自动安装</el-tag>：支持大多数手机型号，但OPPO，VIVO，小米手机在安装时失败概率较大，不建议使用。
        </p>
        <p class="desc-line">
          <el-tag size="mini" type="info">自动登陆</el-tag>：暂不支持。
        </p>
      </div>
    </ArrowContainer>
    <ArrowContainer head-text="填写更多配置">
      <div slot="content" class="more-config-more">
        <div class="runtime">
          <el-input v-model="time" style="text-align: center;" @change="changeRunTime">
            <template slot="prepend">运行时间</template>
            <template slot="append">分钟</template>
          </el-input>
        </div>
        <div class="installApp">
          测试类型：
          <el-radio-group v-model="testTypeRadio" @change="changeTestType">
            <el-radio :label="1">MIX（混合模式）</el-radio>
            <el-radio :label="2">DFS（深度遍历）</el-radio>
            <!-- <el-radio :label="3">TROY（可配置的深度遍历）</el-radio> -->
          </el-radio-group>
        </div>
        <div class="installApp">
          <p>
            安装APP：
            <el-switch
              v-model="install"
              active-color="#13ce66"
              inactive-color="#C0CCDA"
              @change="changeInstall"
            ></el-switch>
          </p>
          <p>( 如果选择跳过安装, 请先手动连接设备，进行安装 )</p>
        </div>
        <div class="installApp">
          <p>
            跳过登陆：
            <el-switch
              v-model="login"
              active-color="#13ce66"
              inactive-color="#C0CCDA"
              @change="changeLogin"
              disabled
            ></el-switch>
          </p>
          <p>( 暂不支持跳过登录 )</p>
        </div>
      </div>
    </ArrowContainer>
  </div>
</template>
<script>
import ArrowContainer from "../common/ArrowContainer";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
export default {
  name: "MoreConfig",
  data() {
    return {
      time: 240,
      install: true,
      login: false,
      testTypeRadio: 1
    };
  },
  computed: {
    ...mapState('autotest', ['runTime', 'isInstallApp', 'jumpLogin', 'testType'])
  },
  methods: {
    ...mapMutations('autotest', [
      'setRunTime',
      'setIsInstallApp',
      'setJumpLogin',
      'setTestType'
    ]),
    changeRunTime(val) {
      this.setRunTime(val);
    },
    changeInstall(val) {
      this.setIsInstallApp(val);
    },
    changeLogin(val) {
      this.setJumpLogin(val);
    },
    changeTestType (val) {
      this.setTestType(val)
    },
    initialization() {
      this.time = this.runTime;
      this.install = this.isInstallApp;
      this.login = this.jumpLogin;
      this.testTypeRadio = this.testType
    }
  },
  components: {
    ArrowContainer
  },
  created() {
    this.initialization();
  },
  beforeDestroy() {
    this.setRunTime(240);
    this.setIsInstallApp(true);
    this.setJumpLogin(false);
    this.setTestType(1)
  }
};
</script>
<style scoped lang="scss">
.more-config {
  .more-config-desc {
    .desc-line {
      font-size: 14px;
      padding: 3px 0;
    }
  }
  .more-config-more {
    .runtime {
      width: 230px;
      padding-bottom: 10px;
    }
    .installApp {
      padding: 10px 0;
    }
  }
}
</style>

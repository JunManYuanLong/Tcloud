<template>
  <div>
    <el-card>
      <div
        class="q-crumb"
        style="border-bottom: 0px solid #ddd;margin-bottom: 5px;padding: 0 0 0px 0;"
      >
        <i class="q-icon el-icon-mobile-phone"></i>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>移动云</el-breadcrumb-item>
          <el-breadcrumb-item>设备控制</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </el-card>
    <el-row style="float: left;margin-left:30px;margin-top:20px;">
      <el-button class="btn-group" type="primary">{{serial}}</el-button>
      <el-button class="btn-group" type="primary" @click="stopUseDevices">断开</el-button>
      <el-tooltip
        class="item"
        effect="dark"
        :content="'已累计使用'+tcdevice.use_time+'分钟'"
        placement="top"
      >
        <!--<el-button class="btn-group" type="primary">{{str_time}}</el-button>-->
        <el-button
          class="btn-group"
          type="primary"
          :sendSync="sendSync"
          :autoStart="autoStart"
          :defaultVal="defaultVal"
        >{{countString}}</el-button>
      </el-tooltip>
      <el-button class="btn-group" type="primary" @click="instruction" target="_blank">使用说明</el-button>
      <el-button class="btn-group" type="primary" @click="phonePassword">手机密码</el-button>
    </el-row>
    <iframe
      style="margin-left:30px;margin-right:60px;"
      v-if="stfurl"
      name="myiframe"
      id="myiframe"
      :src="srcurl"
      frameborder="0"
      align="left"
      width="80%"
      :height="600"
      scrolling="no"
    >
      <p>你的浏览器不支持iframe标签</p>
    </iframe>
  </div>
</template>
<script>
import userApi from "@/api/user.js";
import axios from "axios";
import tcdevicesApi from "@/api/tcdevices.js";

export default {
  data() {
    return {
      winHeight: window.innerHeight - 66,
      stfurl: "",
      h: 0, //定义时，分，秒，毫秒并初始化为0；
      m: 0,
      ms: 0,
      s: 0,
      time: 0,
      str_time: "",
      mytime: "",
      temp_device: {},
      flag: true,
      timer: null,
      isStart: false,
      globalTimer: null, //获取setInterval对象值
      countString: "00:00:00", //用来显示时间
      day: 0,
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
      countVal: this.defaultVal, //获取初始值
      pauseTime: 0
    };
  },
  computed: {
    userId() {
      return this.$store.state.login.userid;
    },
    tcdevice() {
      return this.$route.params.tcdevice;
    },
    serial() {
      return this.$route.params.serial;
    },
    srcurl() {
      return `${process.env.STF_URL}/#!/control/${this.$route.params.serial}`;
    },
    devices_uuid() {
      return this.$route.params.devices_uuid;
    },
    needSendSunc: function() {
      return this.sendSync;
    }
  },
  methods: {
    counterFn: function(counterTime) {
      var vm = this;
      var nowDate = new Date().getTime();
      if (vm.pauseTime == 0) {
        var num = nowDate - counterTime; //计算时间毫秒差
      } else {
        vm.pauseTime = vm.pauseTime + 10;
        var num = vm.pauseTime - counterTime; //计算时间毫秒差
      }
      var leave1 = num % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
      var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
      var leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
      vm.day = Math.floor(num / (24 * 3600 * 1000)); //计算相差天数
      vm.hour = Math.floor(leave1 / (3600 * 1000)); //计算相差小时
      vm.minute = Math.floor(leave2 / (60 * 1000)); //计算相差分钟
      vm.second = Math.round(leave3 / 1000); //计算相差秒
      if (vm.day > 0) {
        vm.countString = `${this.toDub(vm.day)}:${this.toDub(
          vm.hour
        )}:${this.toDub(vm.minute)}:${this.toDub(vm.second)}`;
      } else {
        vm.countString = `${this.toDub(vm.hour)}:${this.toDub(
          vm.minute
        )}:${this.toDub(vm.second)}`;
      }
    },
    startCountFn: function() {
      var vm = this;
      if (!vm.isStart) {
        vm.countVal = vm.countVal ? vm.countVal : new Date().getTime();
        var timer = setInterval(function() {
          vm.counterFn(vm.countVal);
        }, 300);
        vm.globalTimer = timer;
        vm.isStart = true;
      }
    },
    stopCountFn: function() {
      var vm = this;
      if (vm.isStart) {
        window.clearInterval(vm.globalTimer);
        vm.globalTimer = null;
        vm.isStart = false;
        vm.pauseTime = new Date().getTime();
      }
    },
    passToParent: function(data) {
      var vm = this;
      this.$emit("getDataFromChild", data);
    },
    setTimer() {
      if (this.timer == null) {
        this.timer = setInterval(() => {
          this.stopUseReport();
        }, 3000);
        //            this.time = setInterval(this.runtimer, 50);  //弃用的计时器
      }
    },
    runtimer() {
      //定义计时函数
      this.ms = this.ms + 50; //毫秒
      if (this.ms >= 1000) {
        this.ms = 0;
        this.s = this.s + 1; //秒
      }
      if (this.s >= 60) {
        this.s = 0;
        this.m = this.m + 1; //分钟
      }
      if (this.m >= 60) {
        this.m = 0;
        this.h = this.h + 1; //小时
      }
      this.str_time =
        this.toDub(this.h) +
        ":" +
        this.toDub(this.m) +
        ":" +
        this.toDub(this.s);
    },
    toDub(n) {
      //补0操作
      if (n < 10) {
        return "0" + n;
      } else {
        return "" + n;
      }
    },
    toStfPage() {
      tcdevicesApi.getTcToken({ name: this.$store.getters.userName }).then(
        res => {
          this.token = res.data.data.token;
          this.stfurl = `${process.env.STF_URL}?jwt=${this.token}`;
          console.log(this.stfurl);
        },
        error => {
          this.$message.error(`获取设备token失败: ${error.message}`);
        }
      );
    },
    disconnectDevice() {
      var data = { userid: 1, serial: this.temp_device.serial };
      tcdevicesApi.disconnectDevices(data).then(
        res => {
          console.info("断开设备" + this.temp_device.serial);
          console.info(res.data.data);
        },
        error => {
          this.$message.error(`断开设备失败: ${error.message}`);
        }
      );
    },
    stopUseDevices() {
      this.$router.push({
        name: "stf"
      });
    },
    stopUseReport() {
      var data = {
        use_type: 2,
        manufacturer: this.temp_device.manufacturer,
        model: this.temp_device.model,
        platform: this.temp_device.platform,
        version: this.temp_device.version,
        serial: this.temp_device.serial,
        resolution:
          this.temp_device.display.height +
          "x" +
          this.temp_device.display.width,
        uuid: this.devices_uuid
      };
      tcdevicesApi.devicesReport(data).then(
        res => {
          //      console.log('-------stopUseReport------');
          //      console.log(data)
        },
        error => {
          this.$message.error(`使用设备数据上报失败: ${error.message}`);
        }
      );
    },
    phonePassword() {
      window.open(
        "http://www.baidu.com",
        "_blank"
      );
      //          this.$confirm('确定要查看密码吗?', '提示', {
      //                confirmButtonText: '确定',
      //                cancelButtonText: '取消',
      //                type: 'warning'
      //              }).then(() => {
      //                this.$message.success('查看成功!')
      //              }).catch(() => {
      ////                this.$message.error('查看失败!')
      //              });
    },
    instruction() {
      window.open(
        "http://www.baidu.com",
        "_blank"
      );
    },
    $resize () {
      this.winHeight = window.innerHeight - 66
    },
    $message(){
      if (this.flag) {
        this.stopUseDevices();
      }
      this.flag = false;
    }
  },
  created() {
    this.toStfPage();
    clearInterval(this.timer);
    clearInterval(this.globalTimer);
    this.timer = null;
    this.setTimer();
    this.startCountFn();
  },
  beforeDestroy() {
    this.stopUseReport();
    clearInterval(this.timer);
  },
  destroyed: function() {
    // 每次离开当前界面时，清除定时器
    clearInterval(this.timer);
    clearInterval(this.globalTimer);
    this.disconnectDevice();
    window.removeEventListener("resize", this.$resize);
    window.removeEventListener("message", this.$message);
  },
  mounted() {
    window.addEventListener("resize",this.$resize,true);
    window.addEventListener("message",this.$message,false);
    this.temp_device = this.tcdevice;
    this.stopUseReport();
    var vm = this;
    if (vm.autoStart) {
      vm.startCountFn();
    }
  },
  watch: {
    countString: {
      deep: true,
      handler: function(val, oldVal) {
        var vm = this;
        if (vm.needSendSunc) {
          vm.passToParent(val);
        }
      }
    },
    needSendSunc: {
      deep: true,
      handler: function(val) {
        var vm = this;
        if (val) {
          vm.passToParent(vm.countString);
        }
      }
    }
    //    '$route': function(to, from) {
    //        console.log('beforeRouteEnter')
    //        console.log(to, from);
    //      }
  },
  props: {
    sendSync: {
      type: Boolean,
      default: false
    },
    autoStart: {
      type: Boolean,
      default: false
    },
    defaultVal: {
      type: Number,
      default: 0
    }
  }
};
</script>
<style lang="scss" scoped>
.btn-group {
  margin-left: 0px;
  padding: 10px 15px;
  font-size: 13px;
}
</style>

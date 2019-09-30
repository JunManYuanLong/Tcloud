<template>
  <div>
    <iframe
      style="margin-left:30px;margin-right:60px;"
      v-if="stfurl"
      name="stfiframe"
      id="myiframe"
      :src="stfurl"
      frameborder="0"
      align="left"
      width="10%"
      :height="0"
      scrolling="no"
    >
      <p>你的浏览器不支持iframe标签</p>
    </iframe>
    <p class="tips" v-if="stfurl&&issafariBrowser">此浏览器不支持云真机授权，建议使用Chrome或其他浏览器访问!</p>
    <el-card>
      <div
        class="q-crumb"
        style="border-bottom: 0px solid #ddd;margin-bottom: 5px;padding: 0 0 0px 0;justify-content: space-between;"
      >
        <!--<i class="q-icon ios-home-outline"></i>-->
        <div class="nav">
          <i class="q-icon el-icon-mobile-phone"></i>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{name:'stf'}">云真机</el-breadcrumb-item>
            <el-breadcrumb-item>设备列表</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="level-setright">
          <el-button type="text" icon="el-icon-setting" size="large" @click="toUseDetailPage">设备使用详情</el-button>
        </div>
      </div>
    </el-card>
    <div class="layout_devces">
      <div class="contain___2VRL_">
        <dl>
          <span>平台：</span>
          <el-radio-group v-model="radio1" size="small" @change="getStfDevices">
            <el-radio-button
              v-for="value in radio1value"
              :label="value.id"
              :key="value.id"
            >{{value.name}}</el-radio-button>
          </el-radio-group>
        </dl>
        <dl>
          <span>品牌：</span>
          <el-radio-group v-model="radio2" size="small" @change="getStfDevices">
            <el-radio-button
              v-for="value in radio2value"
              :label="value.id"
              :key="value.id"
              :value="value.id"
            >{{value.name}}</el-radio-button>
          </el-radio-group>
        </dl>
        <dl>
          版本：
          <el-radio-group v-model="radio3" size="small" @change="getStfDevices">
            <el-radio-button label="0">全部</el-radio-button>
            <el-radio-button v-for="value in radio3value" :label="value" :key="value"></el-radio-button>
          </el-radio-group>
        </dl>
        <dl style="margin-top: 13px;margin-left: 16px;float: left;font-size: 14px;">
          分辨率：
          <el-radio-group v-model="radio4" size="small" @change="getStfDevices">
            <el-radio-button label="0">全部</el-radio-button>
            <el-radio-button v-for="value in radio4value" :label="value" :key="value"></el-radio-button>
          </el-radio-group>
        </dl>
        <dl>
          状态：
          <el-radio-group v-model="radio5" size="small" @change="getStfDevices">
            <el-radio-button
              v-for="value in radio5value"
              :label="value.id"
              :key="value.id"
            >{{value.name}}</el-radio-button>
          </el-radio-group>
        </dl>
        <dl>
          标签：
          <el-radio-group v-model="radio6" size="small" @change="getStfDevices">
            <el-radio-button
              v-for="value in radio6value"
              :label="value.id"
              :key="value.id"
            >{{value.name}}</el-radio-button>
          </el-radio-group>
        </dl>
      </div>
    </div>
    <div class="contain___3Plup" v-loading="loading">
      <div
        class="deviceslist"
        v-for="item in getdevice"
        :key="item.serial"
        style="margin-left: 20px"
      >
        <div class="ant-card-head">
          <div>{{item.manufacturer}} {{item.model}}</div>
        </div>
        <div style="height: 160px;margin-top: 15px">
          <!--<img alt="example" class="card_img___1p-OX" src="http://qa.qutoutiao.net/static/mc/img/device/xiaomi_2014813.jpg" />-->
          <img v-if="item.pic" alt="example" class="card_img___1p-OX" :src="item.pic">
          <img
            v-else
            alt="example"
            class="card_img___1p-OX"
            src="http://qa.qutoutiao.net/static/mc/img/device/xiaomi_2014813.jpg"
          >
          <ul class="card_info___17TpC">
            <li
              style="overflow:hidden;word-break: keep-all;white-space:nowrap;text-overflow:ellipsis;"
            >型号：{{item.model}}</li>
            <li>版本：{{item.version}}</li>
            <li
              v-if="item.display.height && item.display.width"
            >分辨率：{{item.display.height}}x{{item.display.width}}</li>
            <li v-if="item.battery.level">电量：{{item.battery.level}}%</li>
            <li>使用次数：{{item.times}}</li>
            <li>累计使用：{{item.use_time}}分钟</li>
          </ul>
        </div>
        <ul class="ant-card-actions" v-if="item.owner && item.owner.name==userName">
          <li style="width: 50%;">
            <span @click="useScreen1(item)" style="color: red;cursor:pointer;">
              <i title="使用中" class="anticon anticon-play-circle">
                <svg
                  viewBox="64 64 896 896"
                  class
                  data-icon="play-circle"
                  width="1em"
                  height="1em"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"
                  ></path>
                  <path
                    d="M719.4 499.1l-296.1-215A15.9 15.9 0 0 0 398 297v430c0 13.1 14.8 20.5 25.3 12.9l296.1-215a15.9 15.9 0 0 0 0-25.8zm-257.6 134V390.9L628.5 512 461.8 633.1z"
                  ></path>
                </svg>
              </i>
              <span style="color: deepskyblue;">使用中</span>
            </span>
          </li>
          <li style="width: 50%;">
            <span>
              <div
                @click="viewScreen(item.serial,item.manufacturer+item.model)"
                style="cursor:pointer;"
              >
                <i title="显示屏幕" class="anticon anticon-search">
                  <svg
                    viewBox="64 64 896 896"
                    class
                    data-icon="search"
                    width="1em"
                    height="1em"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0 0 11.6 0l43.6-43.5a8.2 8.2 0 0 0 0-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z"
                    ></path>
                  </svg>
                </i>
                <span>显示屏幕</span>
              </div>
            </span>
          </li>
        </ul>
        <ul
          class="ant-card-actions"
          v-else-if="item.owner && !item.using"
          style="overflow:hidden;word-break: keep-all;white-space:nowrap;text-overflow:ellipsis;"
        >
          <li style="width: 50%;overflow: hidden;text-overflow: ellipsis;">
            <span>
              <div>
                <i title="使用中" class="anticon anticon-lock" style="color: red;">
                  <svg
                    viewBox="64 64 896 896"
                    class
                    data-icon="lock"
                    width="1em"
                    height="1em"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      d="M832 464h-68V240c0-70.7-57.3-128-128-128H388c-70.7 0-128 57.3-128 128v224h-68c-17.7 0-32 14.3-32 32v384c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V496c0-17.7-14.3-32-32-32zM332 240c0-30.9 25.1-56 56-56h248c30.9 0 56 25.1 56 56v224H332V240zm460 600H232V536h560v304zM484 701v53c0 4.4 3.6 8 8 8h40c4.4 0 8-3.6 8-8v-53a48.01 48.01 0 1 0-56 0z"
                    ></path>
                  </svg>
                </i>
                <span style="color: deepskyblue;width: 50%;">{{item.nickname}}使用中</span>
              </div>
            </span>
          </li>
          <li style="width: 50%;">
            <span>
              <div
                @click="viewScreen(item.serial,item.manufacturer+item.model)"
                style="cursor:pointer;"
              >
                <i title="显示屏幕" class="anticon anticon-search">
                  <svg
                    viewBox="64 64 896 896"
                    class
                    data-icon="search"
                    width="1em"
                    height="1em"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0 0 11.6 0l43.6-43.5a8.2 8.2 0 0 0 0-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z"
                    ></path>
                  </svg>
                </i>
                <span>显示屏幕</span>
              </div>
            </span>
          </li>
        </ul>
        <ul class="ant-card-actions" v-else-if="item.present && !item.using &&item.ready">
          <li style="width: 50%;">
            <span @click="useScreen(item)" style="color: deepskyblue;cursor:pointer;">
              <i title="立即使用" class="anticon anticon-play-circle">
                <svg
                  viewBox="64 64 896 896"
                  class
                  data-icon="play-circle"
                  width="1em"
                  height="1em"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"
                  ></path>
                  <path
                    d="M719.4 499.1l-296.1-215A15.9 15.9 0 0 0 398 297v430c0 13.1 14.8 20.5 25.3 12.9l296.1-215a15.9 15.9 0 0 0 0-25.8zm-257.6 134V390.9L628.5 512 461.8 633.1z"
                  ></path>
                </svg>
              </i>
              <span>立即使用</span>
            </span>
          </li>
          <li style="width: 50%;">
            <span>
              <div
                @click="viewScreen(item.serial,item.manufacturer+item.model)"
                style="cursor:pointer;"
              >
                <i title="显示屏幕" class="anticon anticon-search">
                  <svg
                    viewBox="64 64 896 896"
                    class
                    data-icon="search"
                    width="1em"
                    height="1em"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0 0 11.6 0l43.6-43.5a8.2 8.2 0 0 0 0-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z"
                    ></path>
                  </svg>
                </i>
                <span>显示屏幕</span>
              </div>
            </span>
          </li>
        </ul>
        <ul class="ant-card-actions" v-else-if="item.present && !item.using && !item.ready">
          <li style="width: 100%;">
            <span>
              <div>
                <i title="准备中" class="anticon anticon-lock" style="color: gray;">
                  <svg
                    viewBox="64 64 896 896"
                    class
                    data-icon="lock"
                    width="1em"
                    height="1em"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      d="M832 464h-68V240c0-70.7-57.3-128-128-128H388c-70.7 0-128 57.3-128 128v224h-68c-17.7 0-32 14.3-32 32v384c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V496c0-17.7-14.3-32-32-32zM332 240c0-30.9 25.1-56 56-56h248c30.9 0 56 25.1 56 56v224H332V240zm460 600H232V536h560v304zM484 701v53c0 4.4 3.6 8 8 8h40c4.4 0 8-3.6 8-8v-53a48.01 48.01 0 1 0-56 0z"
                    ></path>
                  </svg>
                </i>
                <span style="color: springgreen">准备中...</span>
              </div>
            </span>
          </li>
        </ul>
        <ul class="ant-card-actions" v-else>
          <li style="width: 100%;">
            <span>
              <div>
                <i title="已离线" class="anticon anticon-lock" style="color: gray;">
                  <svg
                    viewBox="64 64 896 896"
                    class
                    data-icon="lock"
                    width="1em"
                    height="1em"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      d="M832 464h-68V240c0-70.7-57.3-128-128-128H388c-70.7 0-128 57.3-128 128v224h-68c-17.7 0-32 14.3-32 32v384c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V496c0-17.7-14.3-32-32-32zM332 240c0-30.9 25.1-56 56-56h248c30.9 0 56 25.1 56 56v224H332V240zm460 600H232V536h560v304zM484 701v53c0 4.4 3.6 8 8 8h40c4.4 0 8-3.6 8-8v-53a48.01 48.01 0 1 0-56 0z"
                    ></path>
                  </svg>
                </i>
                <span>已离线</span>
              </div>
            </span>
          </li>
        </ul>
      </div>
    </div>
    <div>
      <el-dialog
        :title="'实时屏幕 ( '+current_devices+' )'"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="cancelViewScreen"
        class="stf-dialog"
      >
        <div style="text-align: center; min-width: 200px; min-height: 334px;">
          <img :src="imgsrc" style="width:280px; heght:280px">
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelViewScreen">Cancel</el-button>
          <el-button type="primary" @click="cancelViewScreen">OK</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import userApi from "@/api/user.js";
import axios from "axios";
import tcdevicesApi from "@/api/tcdevices.js";

export default {
  data() {
    return {
      loading: true,
      timer: null,
      devices_uuid: "",
      current_devices: "",
      getdevice: [],
      activeDevices: [],
      dialogVisible: false,
      isviewScreen: false,
      text: "",
      data: "",
      imgsrc: "",
      websock: null,
      winHeight: window.innerHeight - 66,
      stfurl: "",
      radio1: 0,
      radio2: 0,
      radio3: 0,
      radio4: 0,
      radio5: 0,
      radio6: 0,
      radio1value: [
        { id: 0, name: "全部" },
        { id: 1, name: "Android" },
        { id: 2, name: "IOS" }
      ],
      radio2value: [
        { id: 0, name: "全部" },
        { id: 1, name: "小米" },
        { id: 2, name: "华为" },
        {
          id: 3,
          name: "魅族"
        },
        { id: 4, name: "OPPO" },
        { id: 5, name: "Vivo" },
        { id: 6, name: "三星" },
        {
          id: 7,
          name: "努比亚"
        },
        { id: 8, name: "中兴" },
        { id: 9, name: "一加" },
        { id: 10, name: "联想" },
        {
          id: 11,
          name: "乐视"
        },
        { id: 12, name: "金立" },
        { id: 13, name: "HTC" }
      ],
      radio3value: [
        "4.4.4",
        "5.0",
        "5.0.2",
        "5.1.0",
        "5.1.1",
        "6.0",
        "6.0.1",
        "7.0",
        "7.1.1",
        "7.1.2",
        "8.0.0",
        "8.1.0",
        "9.0.0"
      ],
      radio4value: [
        "2560x1080",
        "2280x1080",
        "2220x1080",
        "2160x1080",
        "1920x1080",
        "1520x720",
        "1440x720",
        "1280x720",
        "960x540",
        "800x480"
      ],
      radio5value: [
        { id: 0, name: "全部" },
        { id: 1, name: "空闲中" },
        { id: 2, name: "使用中" },
        {
          id: 3,
          name: "已接入"
        }
      ],
      radio6value: [{ id: 0, name: "全部" }, { id: 1, name: "公共设备" }]
    };
  },
  computed: {
    userId() {
      return this.$store.state.login.userid;
    },
    nickName() {
      return this.$store.state.login.nickname;
    },
    userName() {
      return this.$store.state.login.username;
    },
    issafariBrowser() {
      return (
        /Safari/.test(navigator.userAgent) &&
        !/Chrome/.test(navigator.userAgent)
      );
    }
  },
  methods: {
    toUseDetailPage() {
      this.$router.push({ name: "useDetail" });
    },
    setTimer() {
      if (this.timer == null) {
        this.timer = setInterval(() => {
          this.getStfDevices();
        }, 3000);
      }
    },
    sortNumber(a, b) {
      return b.use_time - a.use_time;
    },
    sortPersent(a, b) {
      return b.present - a.present;
    },
    useScreen1(item) {
      var data = {
        uuid: "1",
        use_type: 1,
        manufacturer: item.manufacturer,
        model: item.model,
        platform: item.platform,
        version: item.version,
        serial: item.serial,
        resolution: item.display.height + "x" + item.display.width
      };
      tcdevicesApi.devicesReport(data).then(
        res => {
          this.devices_uuid = res.data.data;
          this.$router.push({
            name: "useDevices",
            params: {
              serial: item.serial,
              tcdevice: item,
              devices_uuid: res.data.data
            }
          });
        },
        error => {
          this.$message.error(`使用设备数据上报失败: ${error.message}`);
        }
      );
    },
    useScreen(item) {
      var data = {
        use_type: 1,
        manufacturer: item.manufacturer,
        model: item.model,
        platform: item.platform,
        version: item.version,
        serial: item.serial,
        resolution: item.display.height + "x" + item.display.width
      };
      tcdevicesApi.devicesReport(data).then(
        res => {
          this.devices_uuid = res.data.data;
          this.$router.push({
            name: "useDevices",
            params: {
              serial: item.serial,
              tcdevice: item,
              devices_uuid: res.data.data
            }
          });
        },
        error => {
          this.$message.error(`使用设备数据上报失败: ${error.message}`);
        }
      );
    },
    viewScreen(serial, manufacturer) {
      this.current_devices = manufacturer;
      this.isviewScreen = true;
      this.dialogVisible = true;
      console.log("websocket start");
      let socketurl = this.getdevice.filter((item, index, data) => {
        return item.serial == serial;
      })[0];
      let socketurl1 = socketurl.display.url;
      console.log(socketurl1);
      if ("WebSocket" in window) {
        this.websocket = new WebSocket(socketurl1);
        this.initWebSocket();
      } else {
        alert("当前浏览器 Not support websocket");
      }
    },
    cancelViewScreen() {
      this.dialogVisible = false;
      this.closeWebSocket();
    },
    compare(name, minor) {
      return function(o, p) {
        var aaa, bbb;
        if (o && p && typeof o === "object" && typeof p === "object") {
          aaa = o[name];
          bbb = p[name];
          if (aaa === bbb) {
            return typeof minor === "function" ? minor(o, p) : 0;
          }
          if (typeof aaa === typeof bbb) {
            return bbb - aaa > 0 ? -1 : 1;
          }
          return typeof bbb < typeof aaa ? -1 : 1;
        } else {
          thro("error");
        }
      };
    },
    getStfDevices() {
      tcdevicesApi.getTcDevices().then(
        res => {
          this.loading = false;
          this.getdevice = res.data.data;
          this.getdevice = this.getdevice.filter((item, index, data) => {
            return item.hasOwnProperty("abi");
          });
          //            this.getdevice.sort(this.sortPersent)
          this.getdevice.sort(
            this.compare("present", this.compare("use_time"))
          );
          this.getdevice = this.getdevice.reverse();
          console.log(this.getdevice);
          this.changradio();
        },
        error => {
          this.loading = false;
          this.$message.error(`获取设备列表失败: ${error.message}`);
          clearInterval(this.timer);
        }
      );
    },
    changradio() {
      if (this.radio1 != 0 || this.radio1 != "0") {
        let platform = this.radio1value.filter((item, index, data) => {
          return item.id == this.radio1;
        })[0];
        this.getdevice = this.getdevice.filter((item, index, data) => {
          return item.platform == platform.name;
        });
      }
      if (this.radio2 != 0 || this.radio2 != "0") {
        if (this.radio2 == 1) {
          this.getdevice = this.getdevice.filter((item, index, data) => {
            return item.manufacturer == "XIAOMI";
          });
        }
        if (this.radio2 == 2) {
          this.getdevice = this.getdevice.filter((item, index, data) => {
            return item.manufacturer == "HUAWEI";
          });
        }
        if (this.radio2 == 3) {
          this.getdevice = this.getdevice.filter((item, index, data) => {
            return item.manufacturer == "MEIZU";
          });
        }
        if (this.radio2 == 4) {
          this.getdevice = this.getdevice.filter((item, index, data) => {
            return item.manufacturer == "OPPO";
          });
        }
        if (this.radio2 == 5) {
          this.getdevice = this.getdevice.filter((item, index, data) => {
            return item.manufacturer == "VIVO";
          });
        }
        if (this.radio2 == 6) {
          this.getdevice = this.getdevice.filter((item, index, data) => {
            return item.manufacturer == "SAMSUNG";
          });
        }
        if (this.radio2 == 7) {
          this.getdevice = this.getdevice.filter((item, index, data) => {
            return item.manufacturer == "NUBIA";
          });
        }
        if (this.radio2 == 10) {
          this.getdevice = this.getdevice.filter((item, index, data) => {
            return item.manufacturer == "LENOVO";
          });
        }
        if (this.radio2 == 11) {
          this.getdevice = this.getdevice.filter((item, index, data) => {
            return item.manufacturer == "LE";
          });
        }
        if (this.radio2 == 12) {
          this.getdevice = this.getdevice.filter((item, index, data) => {
            return item.manufacturer == "GIONEE";
          });
        }
        if (this.radio2 == 13) {
          this.getdevice = this.getdevice.filter((item, index, data) => {
            return item.manufacturer == "HTC";
          });
        }
        if (this.radio2 == 8) {
          this.getdevice = this.getdevice.filter((item, index, data) => {
            return item.manufacturer == "ZTE";
          });
        }
        if (this.radio2 == 9) {
          this.getdevice = this.getdevice.filter((item, index, data) => {
            return item.manufacturer == "ONEPLUS";
          });
        }
      }
      if (this.radio3 != 0 || this.radio3 != "0") {
        this.getdevice = this.getdevice.filter((item, index, data) => {
          return item.version == this.radio3;
        });
      }
      if (this.radio4 != 0 || this.radio4 != "0") {
        this.getdevice = this.getdevice.filter((item, index, data) => {
          return item.display.height == this.radio4.split("x")[0];
        });
        this.getdevice = this.getdevice.filter((item, index, data) => {
          return item.display.width == this.radio4.split("x")[1];
        });
      }
      if (this.radio5 == 1) {
        this.getdevice = this.getdevice.filter((item, index, data) => {
          return item.present == true && item.owner == null;
        });
      } else if (this.radio5 == 2) {
        this.getdevice = this.getdevice.filter((item, index, data) => {
          return item.owner != null;
        });
      } else if (this.radio5 == 3) {
        this.getdevice = this.getdevice.filter((item, index, data) => {
          return item.present == true;
        });
      }
    },
    toStfPage() {
      tcdevicesApi.getTcToken({ name: this.$store.getters.userName }).then(
        res => {
          this.token = res.data.data.token;
          console.info(res.data.data);
          console.log("跳转到STF");
          this.stfurl = `${process.env.STF_URL}?jwt=${this.token}`;
          console.log(this.stfurl);
        },
        error => {
          this.$message.error(`获取设备token失败: ${error.message}`);
        }
      );
    },
    initWebSocket() {
      //连接错误
      this.websocket.onerror = this.setErrorMessage;
      // //连接成功
      this.websocket.onopen = this.setOnopenMessage;
      //收到消息的回调
      this.websocket.onmessage = this.setOnmessageMessage;
      //连接关闭的回调
      this.websocket.onclose = this.setOncloseMessage;
      //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
      window.onbeforeunload = this.onbeforeunload;
      //        this.websocket.send('size 692x692')
      //        this.websocket.send('on')
    },
    setErrorMessage() {
      this.data =
        "WebSocket连接发生错误" + "   状态码：" + this.websocket.readyState;
    },
    setOnopenMessage() {
      this.data =
        "WebSocket连接成功" + "   状态码：" + this.websocket.readyState;
      this.websocket.send("size 550x800");
      this.websocket.send("on");
    },
    setOnmessageMessage(event) {
      this.data = "服务端返回：" + event.data;
      if (event.data instanceof Blob) {
        var URL = window.URL || window.webkitURL;
        var blob = new Blob([event.data], { type: "image/jpeg" });
        var url = URL.createObjectURL(blob);
        this.data = url;
        this.imgsrc = url;
      }
    },
    setOncloseMessage() {
      this.data =
        "WebSocket连接关闭" + "   状态码：" + this.websocket.readyState;
    },
    onbeforeunload() {
      this.closeWebSocket();
    },
    //websocket发送消息
    send() {
      this.websocket.send(this.text);
      this.text = "";
    },
    closeWebSocket() {
      this.websocket.close();
    },
    $resize () {
      this.winHeight = window.innerHeight - 66
    }
  },
  created() {
    clearInterval(this.timer);
    this.timer = null;
    this.toStfPage();
    this.setTimer();
  },
  beforeDestroy() {
    clearInterval(this.timer);
    if (this.isviewScreen) {
      this.onbeforeunload();
    }
    window.removeEventListener("resize", this.$resize);
  },
  mounted() {
    window.addEventListener('resize', this.$resize, true)
    this.getStfDevices();
  }
};
</script>
<style lang="scss" scoped>
.tips {
  color: #e6a13d;
  padding: 5px;
  text-align: center;
  a {
    text-decoration: underline;
    padding: 0 8px;
  }
}
.addForm {
  width: 500px;
}

.contain___2VRL_ dl {
  clear: both;
  margin-bottom: 5px;
  height: 22px;
  padding: 3px 2px;
  margin-top: 13px;
  margin-left: 30px;
  float: left;
  font-size: 14px;
}

.layout_devces {
  background: rgb(255, 255, 255);
  /*padding: 24px;*/
  margin: 0px;
  min-height: 280px;
}

.box-card2 {
  margin: 0 20px 20px 0;
  width: 264px;
  height: 206px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #ebeef5;
  background-color: #fff;
  color: #303133;
  transition: 0.3s;
  border-radius: 4px;
  overflow: hidden;
}

.deviceslist {
  height: 285px;
  margin-bottom: 25px;
  width: 250px;
  display: inline-block;
  margin-right: 10px;
  margin-top: 20px;
  vertical-align: top;
  float: left;
  border: 1px solid #e8e8e8;
  background: rgb(255, 255, 255);
  font-family: "Chinese Quote", -apple-system, BlinkMacSystemFont, "Segoe UI",
    "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue",
    Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
    "Segoe UI Symbol";
}

.contain___3Plup .card_img___1p-OX {
  width: 68px;
  height: auto;
  margin-top: 9px;
}

.contain___3Plup .card_info___17TpC {
  list-style-type: none;
  display: inline-block;
  padding: 0;
  margin-left: 8px;
  vertical-align: top;
  font-size: 12px;
  width: 127px;
}

.contain___3Plup .card_info___17TpC li {
  /*float: left;*/
  margin-top: 8px;
  text-align: left;
}

.ant-card-head {
  background: transparent;
  border-bottom: 1px solid #e8e8e8;
  padding: 0 24px;
  border-radius: 2px 2px 0 0;
  zoom: 1;
  margin-bottom: -1px;
  height: 61px;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ant-card-actions {
  border-top: 1px solid #e8e8e8;
  background: #fafafa;
  zoom: 1;
  list-style: none;
  margin: 0;
  padding: 0;

  li {
    float: left;
    text-align: center;
    margin: 12px 0;
    color: rgba(0, 0, 0, 0.45);
  }

  li:not(:last-child) {
    border-right: 1px solid #e8e8e8;
  }
}

.anticon {
  display: inline-block;
  font-style: normal;
  vertical-align: -0.125em;
  text-align: center;
  text-transform: none;
  line-height: 0;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.devicesviewBox {
  padding-top: 1px;
}

.ant-steps-icon {
  font-size: 24px;
  line-height: 32px;
  top: 0;
  left: 0.5px;
  width: 32px;
  height: 32px;
}

.level-setright {
  .el-button {
    padding: 0px 0px;
  }

  font-size: 15px;
}

.nav {
  display: flex;
}
</style>
<style lang="scss">
.stf-dialog {
  .el-dialog__body {
    border-bottom: 1px solid #e8eaec;
    border-top: 1px solid #e8eaec;
  }
}
</style>

<template>
  <div class="choose-model">
    <ArrowContainer head-text="选择测试设备">
      <div slot="content" class="choose-model-list">
        <Model
          v-for="(item, index) in deviceList"
          :key="index"
          :device-data="item"
          @selectChange="selectChange"
        ></Model>
      </div>
    </ArrowContainer>
    <ArrowContainer head-text="建议">
      <div slot="content">
        <p>
          每次测试，最好选择手机3～5台，可以有效避免因手机性能，电量，网络以及其他原因导致的无效运行
          <br>并且覆盖到多种手机厂商与android系统版本，分辨率等，可以让测试结果更有信服力。
          <br>目前OPPO,VIVO,小米手机在安装时失败概率较高，不建议使用。
          <br>注意：选择手机前，请先到远程真机页面，检查一下手机是否锁屏。如果锁屏，请先手动解锁，以免测试任务卡在锁屏页
        </p>
      </div>
    </ArrowContainer>
  </div>
</template>
<script>
import ArrowContainer from "../common/ArrowContainer";
import Model from "../common/Model";
import tcdevicesApi from "@/api/tcdevices.js";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
export default {
  name: "ChooseModel",
  data() {
    return {
      deviceList: [],
      timer: ''
    };
  },
  components: {
    ArrowContainer,
    Model
  },
  methods: {
    ...mapMutations("autotest", ["setSelectPhoneList"]),
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
        }
      };
    },
    // 获取云真机列表
    getDeviceList() {
      tcdevicesApi.getTcDevices().then(
        res => {
          this.deviceList = res.data.data;
          this.deviceList.forEach(item => {
            item.isSelected = false;
          });
          this.deviceList = this.deviceList.filter(item => {
            return item.hasOwnProperty("abi");
          });
          this.deviceList.sort(
            this.compare("present", this.compare("use_time"))
          );
          this.deviceList = this.deviceList.reverse();
          console.log(this.deviceList);
        },
        error => {
          this.$message.error(`获取设备列表失败: ${error.message}`);
        }
      );
    },
    // model切换选中
    selectChange() {
      let selectedList = this.deviceList.filter(item => {
        return item.isSelected;
      });
      this.$emit("selectModel", selectedList);
      this.setSelectPhoneList(selectedList);
    },
    // 轮询手机列表
    intervalList() {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = ''
      }
      this.timer = setInterval(() => {
        this.getDeviceList()
      }, 3000)
    }
  },
  created() {
    this.getDeviceList();
    this.intervalList()
  },
  beforeDestroy() {
    this.setSelectPhoneList([]);
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = ''
    }
  }
};
</script>
<style scoped lang="scss">
.choose-model {
  .choose-model-list {
    display: flex;
    justify-content: start;
    flex-wrap: wrap;
  }
}
</style>
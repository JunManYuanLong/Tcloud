<template>
  <div class="test-detail-sub">
    <el-tabs v-model="activeName">
      <el-tab-pane
        v-for="(item, index) in subData.monkey_device_status"
        :key="index"
        :label="item.mobile_model || 'no-name'"
      >
        <ArrowContainer head-text="设备详情">
          <div slot="content">
            <el-table :data="[item]" style="width: 100%">
              <el-table-column prop="mobile_model" label="测试机型"></el-table-column>
              <el-table-column prop="mobile_version" label="版本"></el-table-column>
              <el-table-column prop="mobile_resolution" label="分辨率"></el-table-column>
              <el-table-column prop="mobile_use_times" label="使用次数"></el-table-column>
              <el-table-column label="操作">
                <el-button type="text" size="small" @click="goRemote(item)">远程控制</el-button>
              </el-table-column>
            </el-table>
          </div>
        </ArrowContainer>
        <ArrowContainer head-text="设备概况">
          <div slot="content">
            <el-table :data="[item]" style="width: 100%">
              <el-table-column prop="mobile_model" label="测试机型" width="150"></el-table-column>
              <el-table-column prop="mobile_version" label="系统版本" width="150"></el-table-column>
              <el-table-column label="运行状态" width="180">
                <template slot-scope="scope">
                  <el-tag>{{scope.row.current_stage}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="process" label="完成度"></el-table-column>
              <el-table-column label="安装">
                <template slot-scope="scope">
                  <i
                    class="el-icon-success success"
                    :class="{'no-success': scope.row.setup_install_app_status !== 1}"
                  ></i>
                </template>
              </el-table-column>
              <el-table-column label="启动">
                <template slot-scope="scope">
                  <i
                    class="el-icon-success success"
                    :class="{'no-success': scope.row.start_app_status !== 1}"
                  ></i>
                </template>
              </el-table-column>
              <el-table-column label="登陆">
                <template slot-scope="scope">
                  <i
                    class="el-icon-success success"
                    :class="{'no-success': scope.row.login_app_status !== 1}"
                  ></i>
                </template>
              </el-table-column>
              <el-table-column prop="crash_count" label="Crash"></el-table-column>
              <el-table-column prop="anr_count" label="ANR"></el-table-column>
              <el-table-column prop="exception_count" label="Exception"></el-table-column>
              <el-table-column prop="activity_count" width="180">
                <template slot="header">
                  activety数
                  <el-tooltip effect="dark" content="本次执行遍历的Activity总数,值越大遍历越深" placement="top">
                    <i class="el-icon-question" style="font-size: 16px;"></i>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </ArrowContainer>
        <ArrowContainer head-text="异常汇总">
          <div slot="content">
            <el-table :data="item.errorLog || []" style="width: 100%">
              <el-table-column type="expand">
                <!-- 展开列表详细 -->
                <template slot-scope="scope">
                  <p
                    v-for="(item, index) in formateMessage(scope.row.error_message)"
                    :key="index"
                  >{{item}}</p>
                </template>
              </el-table-column>
              <el-table-column prop="error_type" label="类别" width="80px"></el-table-column>
              <el-table-column prop="error_count" label="出现次数" width="80px"></el-table-column>
              <el-table-column label="描述">
                <template slot-scope="scope">{{formateMessage(scope.row.error_message)[1]}}</template>
              </el-table-column>
            </el-table>
            <div v-show="item.total > 0" style="text-align: center; padding-top: 10px;">
              <el-pagination
                @current-change="pageChange(item)"
                :current-page.sync="item.pageIndex"
                :page-size="item.pageSize"
                layout="total, prev, pager, next"
                :total="item.total"
              ></el-pagination>
            </div>
          </div>
        </ArrowContainer>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import ArrowContainer from "../../common/ArrowContainer";
import tcdevicesApi from "@/api/tcdevices.js";
import monkeyApi from "@/api/monkey.js";
export default {
  name: "TestDetailSub",
  data() {
    return {
      activeName: 0,
      total: 0,
      pageIndex: 1,
      pageSize: 10,
      deviceList: []
    };
  },
  components: {
    ArrowContainer
  },
  props: ["subData"],
  watch: {
    subData(data) {
      data.monkey_device_status.forEach(item => {
        item.errorLog = [];
        (item.total = 0), (item.pageIndex = 1), (item.pageSize = 10);
        this.getErrorTable(item.id, item);
      });
    }
  },
  methods: {
    getErrorTable(id, itemData) {
      let params = {
        page_size: itemData.pageSize,
        page_index: itemData.pageIndex,
        monkey_id: "",
        task_id: id
      };
      monkeyApi
        .getErrorList(params)
        .then(res => {
          itemData.errorLog = [];
          res.data.data.forEach(item => {
            itemData.errorLog.push(item);
          });
          itemData.total = res.data.total;
          this.$forceUpdate();
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    // 处理错误日志描述
    formateMessage(logMessage) {
      if (logMessage) {
        let logArr = JSON.parse(logMessage);
        return logArr;
      }
      return [];
    },
    pageChange(val) {
      this.getErrorTable(val.id, val);
      this.$forceUpdate();
    },
    // 使用云真机
    goRemote(params) {
      let itemData = this.deviceList.find(item => {
        return item.serial === params.mobile_serial;
      });
      let data = {
        use_type: 1,
        manufacturer: itemData.manufacturer,
        model: itemData.model,
        platform: itemData.platform,
        version: itemData.version,
        serial: itemData.serial,
        resolution: itemData.display.height + "x" + itemData.display.width
      };
      tcdevicesApi.devicesReport(data).then(
        res => {
          this.devices_uuid = res.data.data;
          this.$router.push({
            name: "useDevices",
            params: {
              serial: itemData.serial,
              tcdevice: itemData,
              devices_uuid: res.data.data
            }
          });
        },
        error => {
          this.$message.error(`使用设备数据上报失败: ${error.message}`);
        }
      );
    },
    // 获取云真机数据
    getDeviceList() {
      tcdevicesApi.getTcDevices().then(
        res => {
          this.deviceList = res.data.data;
          this.deviceList = this.deviceList.filter(item => {
            return item.hasOwnProperty("abi");
          });
          /* this.deviceList.sort(
            this.compare("present", this.compare("use_time"))
          ); */
          this.deviceList = this.deviceList.reverse();
          console.log(this.deviceList);
        },
        error => {
          this.$message.error(`获取设备列表失败: ${error.message}`);
        }
      );
    }
  },
  created() {
    this.getDeviceList();
  }
};
</script>
<style lang="scss" scoped>
.test-detail-sub {
  padding-top: 15px;
  .success {
    color: #67c23a;
    font-size: 16px;
  }
  .no-success {
    color: #666;
  }
}
</style>



<template>
  <div>
    <el-card>
      <div
        class="q-crumb"
        style="border-bottom: 0px solid #ddd;margin-bottom: 5px;padding: 0 0 0px 0;"
      >
        <i class="q-icon el-icon-mobile-phone"></i>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{name:'stf'}">云真机</el-breadcrumb-item>
          <el-breadcrumb-item>设备使用详情</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </el-card>
    <div class="mine-wrap">
      <div class="dashboard-devices-page">
        <div class="select-wrap">
          <div class="date-select">
            <label>日期：</label>
            <el-date-picker
              v-model="date"
              type="daterange"
              align="right"
              format="yyyy-MM-dd"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </div>
        </div>
        <div class="title-bar">设备使用统计</div>
        <div class="charts-wrap">
          <div class="chart-item">
            <ve-line :data="devicesUseTimeData" :settings="devicesUseTimeSettings" height="350px"></ve-line>
          </div>
          <div class="chart-item">
            <ve-histogram :data="devicesTimesData" :settings="devicesTimesSettings" height="350px"></ve-histogram>
          </div>
        </div>
      </div>
      <!--<el-button v-if="swith_detail" type="text" icon="el-icon-refresh" size="large" @click="changSwithDetail">个人使用详情</el-button>-->
      <!--<el-button v-if="!swith_detail" type="text" icon="el-icon-refresh" size="large" @click="changSwithDetail">设备使用详情</el-button>-->
      <el-radio-group v-model="swith_detail_radio" size="small">
        <el-radio-button label="1" key="1">设备使用详情</el-radio-button>
        <el-radio-button label="0" key="0">个人使用详情</el-radio-button>
      </el-radio-group>
      <a-table
        v-if="swith_detail_radio==1"
        :dataSource="devicesList"
        :rowKey="record => record.id"
        :loading="loading"
      >
        <a-table-column title="ID" width="80px" data-index="id" key="id"/>
        <a-table-column title="设备名" data-index="comment" key="comment">
          <template slot-scope="text, record">
            <span style="font-weight: bold">{{record.comment}}</span>
          </template>
        </a-table-column>
        <a-table-column title="序列号" data-index="serial" key="serial"/>
        <a-table-column title="使用次数" data-index="times" key="times"/>
        <a-table-column title="使用时间" data-index="use_time" key="use_time">
          <template slot-scope="text, record">
            <span>{{record.use_time}} 分钟</span>
          </template>
        </a-table-column>
      </a-table>
      <a-table
        v-if="swith_detail_radio==0"
        :dataSource="userDevicesList"
        :rowKey="record => record.id"
        :loading="loading"
      >
        <a-table-column title="ID" width="80px" data-index="id" key="id"/>
        <a-table-column title="设备名" data-index="manufacturer" key="manufacturer">
          <template slot-scope="text, record">
            <span style="font-weight: bold">{{record.manufacturer}}</span>
          </template>
        </a-table-column>
        <a-table-column title="序列号" data-index="serial" key="serial"/>
        <a-table-column title="系统版本" data-index="version" key="version"/>
        <a-table-column title="分辨率" data-index="resolution" key="resolution">
          <template slot-scope="text, record">
            <span>{{record.resolution}}</span>
          </template>
        </a-table-column>
        <a-table-column title="使用者" data-index="user_name" key="user_name"/>
        <a-table-column title="创建时间" data-index="creation_time" key="creation_time"/>
        <a-table-column title="使用时长" data-index="use_time" key="use_time">
          <template slot-scope="text, record">
            <span>{{record.use_time}} 分钟</span>
          </template>
        </a-table-column>
      </a-table>
    </div>
  </div>
</template>
<script>
import moment from "moment";
import userApi from "@/api/user.js";
import roleApi from "@/api/role.js";
import tcdevicesApi from "@/api/tcdevices.js";
const endDate = new Date();
const startDate = new Date();
startDate.setTime(startDate.getTime() - 3600 * 1000 * 24 * 90);
export default {
  name: "usedetail",
  data() {
    this.devicesTimesSettings = {
      labelMap: {
        times: "设备使用次数"
      },
      yAxisName: ["次数"]
    };
    this.devicesUseTimeSettings = {
      labelMap: {
        use_time: "设备使用时长(分钟)"
      },
      yAxisName: ["时长"]
    };
    return {
      date: [startDate, endDate],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      devicesTimesData: {
        columns: ["date", "times"],
        rows: []
      },
      devicesUseTimeData: {
        columns: ["date", "use_time"],
        rows: []
      },
      swith_detail: true,
      swith_detail_radio: 1,
      loading: false,
      data: [],
      devicesList: [],
      userDevicesList: []
    };
  },
  computed: {
    userId() {
      return this.$store.state.login.userid;
    }
  },
  created() {
    this.getUseDetail();
    this.getUserUseDetail();
    if (this.date) {
      let start = moment(this.date[0]).format("YYYY-MM-DD");
      let end = moment(this.date[1]).format("YYYY-MM-DD");
      this.getDashData(start, end);
    }
  },
  watch: {
    date: {
      handler: function(val) {
        if (val) {
          let start = moment(val[0]).format("YYYY-MM-DD");
          let end = moment(val[1]).format("YYYY-MM-DD");
          this.getDashData(start, end);
        } else {
          this.getDashData("", "");
        }
      },
      deep: true
    },
    $route() {
      //监听路由变化
      this.getDashData();
    }
  },
  methods: {
    getDashData(start, end) {
      let params = {
        start_time: start,
        end_time: end
      };
      tcdevicesApi.getDevicesDashboard(params).then(
        res => {
          let data = res.data.data[0];
          this.devicesUseTimeData.rows = data.devices_use_time.reverse();
          this.devicesTimesData.rows = data.devices_times.reverse();
        },
        error => {
          this.$message.error("获取dashboard数据失败: " + error.message);
        }
      );
    },
    changSwithDetail() {
      if (this.swith_detail) {
        this.swith_detail = false;
      } else {
        this.swith_detail = true;
      }
    },
    getUseDetail() {
      tcdevicesApi.getUseDetail().then(res => {
        this.devicesList = res.data.data;
      });
    },
    getUserUseDetail() {
      tcdevicesApi.getUserUseDetail().then(res => {
        this.userDevicesList = res.data.data;
        for (var i = 0; i < this.userDevicesList.length; i++) {
          this.userDevicesList[i].manufacturer =
            this.userDevicesList[i].manufacturer +
            " " +
            this.userDevicesList[i].model;
        }
        this.userDevicesList = this.userDevicesList.filter(
          (item, index, data) => {
            return item.user_id == this.userId;
          }
        );
      });
    }
  }
};
</script>
<style lang="scss">
.AdminUser {
  margin-top: 20px;
}
.q-crumb {
  padding: 0 0 10px 0;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ddd;
  margin-bottom: 20px;
  .el-icon-tickets {
    display: block;
    margin-right: 5px;
    color: #33c0fb;
    font-size: 18px;
  }
  .el-breadcrumb {
    font-size: 16px;
  }
}

.q-opt {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  .q-search {
    width: 200px;
  }
}

.permission-unit {
  display: inline-block;
  padding: 0 10px;
  margin: 0 5px;
  background-color: #b9dbff;
  border-radius: 3px;
  color: #fff;
}
.dashboard-devices-page {
  .select-wrap {
    padding: 7px;
    display: flex;
    margin-bottom: 10px;
  }
  .charts-wrap {
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    padding-right: 180px;
    flex-wrap: wrap;
    .chart-item {
      width: 40%;
      /*height: 350px;*/
      margin-bottom: 1px;
    }
  }
  .title-bar {
    margin: 10px 0 20px 20px;
    padding: 5px 14px;
    border-left: 3px solid #1b73ff;
    background: linear-gradient(left, #d1ecff, #ffffff);
    em {
      color: #008bef;
    }
  }
}
</style>
<style lang="scss" scoped>
.ant-table-wrapper {
  margin-top: 10px;
}
.mine-wrap {
  background: #fff;
  padding: 10px 15px 55px;
  max-width: 1600px;
  margin: 0 auto;
  text-align: left;
}
</style>

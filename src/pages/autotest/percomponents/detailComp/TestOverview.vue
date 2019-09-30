<template>
  <div class="detail-overview">
    <ArrowContainer head-text="设备概况">
      <div slot="content">
        <el-table :data="subData.monkey_device_status" style="width: 100%">
          <el-table-column prop="mobile_model" label="测试机型" width="180px"></el-table-column>
          <el-table-column prop="mobile_version" label="系统版本" width="150px"></el-table-column>
          <el-table-column label="运行状态" width="180px">
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
        </el-table>
      </div>
    </ArrowContainer>
    <ArrowContainer head-text="性能数据">
      <div slot="content">
        <div>
          请选择场景：
          <el-select v-model="scene" filterable placeholder="请选择" @change="changeScene">
            <el-option v-for="item in sceneList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </div>
        <el-table :data="testData" style="width: 100%; margin-top: 20px;">
          <el-table-column prop="mobile" label="设备" align="center"></el-table-column>
          <el-table-column prop="cpu_average" label="cpu平均值" width="100" align="center">
            <template slot-scope="scope">
              {{`${scope.row.cpu_average} %`}}
            </template>
          </el-table-column>
          <el-table-column prop="cpu_top" label="cpu峰值" align="center">
            <template slot-scope="scope">
              {{`${scope.row.cpu_top} K`}}
            </template>
          </el-table-column>
          <el-table-column prop="heap_alloc_average" label="内存申请平均值" width="120" align="center">
            <template slot-scope="scope">
              {{`${scope.row.heap_alloc_average} K`}}
            </template>
          </el-table-column>
          <el-table-column prop="heap_alloc_top" label="内存申请峰值" width="120" align="center">
            <template slot-scope="scope">
              {{`${scope.row.heap_alloc_top} K`}}
            </template>
          </el-table-column>
          <el-table-column prop="heap_size_average" label="内存使用平均值" width="120" align="center">
            <template slot-scope="scope">
              {{`${scope.row.heap_size_average} K`}}
            </template>
          </el-table-column>
          <el-table-column prop="heap_size_top" label="内存使用峰值" width="120" align="center">
            <template slot-scope="scope">
              {{`${scope.row.heap_size_top} K`}}
            </template>
          </el-table-column>
          <el-table-column prop="rss_average" label="rss平均值" align="center">
            <template slot-scope="scope">
              {{`${scope.row.rss_average} K`}}
            </template>
          </el-table-column>
          <el-table-column prop="rss_top" label="rss峰值" align="center">
            <template slot-scope="scope">
              {{`${scope.row.rss_top} K`}}
            </template>
          </el-table-column>
          <el-table-column prop="run_time" label="运行时间" align="center">
            <template slot-scope="scope">
              {{`${scope.row.run_time} 分钟`}}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </ArrowContainer>
  </div>
</template>

<script>
import ArrowContainer from "../../common/ArrowContainer";
import monkeyApi from "@/api/monkey.js";
const echarts = require("echarts");

export default {
  data() {
    return {
      sceneList: [],
      scene: "",
      testData: []
    };
  },
  components: {
    ArrowContainer
  },
  props: ["subData"],
  methods: {
    // 获取场景列表
    getSceneList(id) {
      let params = {
        performance_id: id
      };
      monkeyApi
        .getSceneList(params)
        .then(res => {
          this.sceneList = res.data.data;
          this.scene = this.sceneList[0];
          this.getTestData(id);
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    // 获取场景下的测试信息
    getTestData(id) {
      if (!this.scene) return
      let params = {
        monkey_id: id || this.subData.id,
        run_type: this.scene
      };
      monkeyApi
        .getTestDataByScene(params)
        .then(res => {
          console.log(res);
          this.testData = this.formateData(res.data.data)
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    // 切换场景
    changeScene() {
      this.getTestData();
    },
    // 格式化数据
    formateData (data) {
      let arr = []
      data.forEach(item => {
        for (let k in item) {
          item[k].mobile = k
          arr.push(item[k])
        }
      })
      return arr
    }
  },
  watch: {
    subData() {
      if (this.subData.monkey_device_status.length === 0) {
        return;
      }
      if (this.subData.id) {
        this.getSceneList(this.subData.id);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.detail-overview {
  padding-top: 15px;

  .success {
    color: #67c23a;
    font-size: 16px;
  }
  .no-success {
    color: #666;
  }

  .chart-content {
    display: flex;
    // justify-content: start;
    // flex-wrap: wrap;
    justify-content: space-around;
    align-items: center;
    .chart-item {
      height: 330px;
      &.chart-one {
        width: 400px;
      }

      &.chart-two {
        width: 450px;
      }

      &.chart-three {
        width: 450px;
      }

      .chart-item-title {
        font-weight: 500;
      }
    }
  }
}
</style>

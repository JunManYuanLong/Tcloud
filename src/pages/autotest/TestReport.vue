<template>
  <div class="test-report">
    <el-card class="box-card">
      <el-tabs v-model="activeName">
        <el-tab-pane label="我的提测任务" name="mineTask">
          <div class="test-report-list">
            <!-- 表格开始 -->
            <ExpendTable
              :total="mineTotal"
              :table-data="mineTableData"
              @showDetailHandler="showDetailHandler"
              @changePage="mineChangePage"
            ></ExpendTable>
          </div>
        </el-tab-pane>
        <el-tab-pane label="所有提测任务" name="allTask">
          <div class="test-report-list">
            <!-- 表格开始 -->
            <ExpendTable
              :total="allTotal"
              :table-data="allTableData"
              @showDetailHandler="showDetailHandler"
              @changePage="allChangePage"
            ></ExpendTable>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 详情页 -->
    <div class="detail-panel" v-if="showDetail">
      <TestDetail @closeDetail="closeDetail" :detail-data="detailData"></TestDetail>
    </div>
  </div>
</template>
<script>
import TestDetail from "./components/TestDetail";
import ExpendTable from "./common/ExpendTable";
import monkeyApi from "@/api/monkey.js";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
export default {
  name: "TestReport",
  data() {
    return {
      activeName: "mineTask",
      showDetail: false,
      mineTableData: [],
      allTableData: [],
      minePageIndex: 1,
      allPageIndex: 1,
      mineTotal: 0,
      allTotal: 0,
      detailData: {},
      timer: ""
    };
  },
  computed: {
    userId() {
      return this.$store.state.login.userid;
    }
  },
  methods: {
    showDetailHandler(row) {
      this.showDetail = true;
      this.getDetailData(row.id);
    },
    closeDetail() {
      this.showDetail = false;
    },
    // 获取测试报告详情
    getDetailData(id) {
      let params = {
        id: id
      };
      monkeyApi
        .getTestList(params)
        .then(res => {
          this.detailData = res.data.data[0];
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    // 获取所有提测列表
    getTestList() {
      let params = {
        page_size: 10,
        page_index: this.allPageIndex,
        user_id: "",
        id: ""
      };
      monkeyApi
        .getTestList(params)
        .then(res => {
          this.allTableData = res.data.data;
          this.allTotal = res.data.total;
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    // 获取我的提测列表
    getTestListMine() {
      let params = {
        page_size: 10,
        page_index: this.minePageIndex,
        user_id: this.userId,
        id: ""
      };
      monkeyApi
        .getTestList(params)
        .then(res => {
          this.mineTableData = res.data.data;
          this.mineTotal = res.data.total;
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    // 切换page的回调
    mineChangePage(val) {
      this.minePageIndex = val;
      this.getTestListMine();
    },
    allChangePage(val) {
      this.allPageIndex = val;
      this.getTestList();
    },
    // 轮询刷新列表
    getDataInterval() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = "";
      }
      this.timer = setInterval(() => {
        this.getTestList();
        this.getTestListMine();
      }, 3000);
    }
  },
  components: {
    TestDetail,
    ExpendTable
  },
  created() {
    this.getTestList();
    this.getTestListMine();
    this.getDataInterval();
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = "";
    }
  }
};
</script>

<style lang="scss" scoped>
.test-report {
  position: relative;
  overflow: auto;
  height: 100%;
  padding-bottom: 20px;
  .box-card {
    height: 100%;
    overflow: auto;
  }
  .detail-panel {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    z-index: 2006;
    background-color: rgb(158, 233, 123);
  }
}
div#pane-mineTask.el-tab-pane, div#pane-allTask.el-tab-pane {
  height: 550px;
  .test-report-list {
    width: 100%;
    height: 100%;
    overflow: auto;
  }
}
</style>
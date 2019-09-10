<template>
  <div class="error-log">
    <ArrowContainer head-text="测试报告">
      <div slot="content">
        <el-table :data="logTableData" style="width: 100%">
          <el-table-column label="日志类型">
            <template slot-scope="scope">{{reportType[scope.row.report_type]}}</template>
          </el-table-column>
          <el-table-column label="设备">
              <template slot-scope="scope">{{scope.row.mobile_model}}</template>
          </el-table-column>  
          <el-table-column label="链接 🔗">
            <template slot-scope="scope">
              <a :href="scope.row.report_url" target="_blank">查看日志</a>
            </template>
          </el-table-column>
        </el-table>
        <div v-show="total > 0" style="text-align: center; padding-top: 10px;">
          <el-pagination
            @current-change="pageChange"
            :current-page.sync="pageIndex"
            :page-size="pageSize"
            layout="total, prev, pager, next"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </ArrowContainer>
  </div>
</template>
<script>
import ArrowContainer from "../../common/ArrowContainer";
import monkeyApi from "@/api/monkey.js";
export default {
  name: "ErrorLog",
  data() {
    return {
      logTableData: [],
      reportType: {
        1: 'ADB-Bug-Report',
        2: 'Monkey-Log',
        3: 'Crash-Dump-Log'
      },
      total: 0,
      pageIndex: 1,
      pageSize: 10,
      monkeyId: ""
    };
  },
  props: ["subData"],
  components: {
    ArrowContainer
  },
  methods: {
    getLogData(id) {
      let params = {
        monkey_id: id,
        task_id: "",
        page_size: this.pageSize,
        page_index: this.pageIndex
      };
      monkeyApi
        .getLogData(params)
        .then(res => {
          this.logTableData = res.data.data;
          console.log(this.logTableData)
          this.total = res.data.total;
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    pageChange(val) {
      this.getLogData(this.monkeyId);
    }
  },
  watch: {
    subData(val) {
      this.monkeyId = val.id;
      this.getLogData(this.monkeyId);
    }
  }
};
</script>
<style lang="scss" scoped>
.error-log {
}
</style>



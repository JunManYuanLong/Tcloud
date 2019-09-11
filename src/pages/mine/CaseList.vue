<template>
  <div class="case-list">
    <el-input
      placeholder="输入标题或ID关键字"
      v-model="searchText"
      class="m-search"
      clearable
      @keyup.native="searchTitle"
      @change="searchTitle"
      style="margin: 10px 0 20px 0;"
    >
      <i slot="prefix" class="el-input__icon el-icon-search"></i>
    </el-input>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="编号" width="80">
        <template slot-scope="scope">
          <router-link
            :to="{name:'taskcaseDetail',params:{projectId: scope.row.project_id,versionId:'all',taskcaseId:scope.row.taskcaseid}}"
          >{{scope.row.cnumber}}</router-link>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题" width="230"></el-table-column>
      <el-table-column prop="module_name" label="所属模块"></el-table-column>
      <el-table-column prop="level" label="测试结果">
        <template slot-scope="scope">
          {{taskCaseStatus[scope.row.status]}}
        </template>
      </el-table-column>
      <el-table-column prop="handler_name" label="处理人"></el-table-column>
    </el-table>
    <div style="text-align: center; padding: 15px 0;">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="pageIndex"
        :page-size="pageSize"
        layout="total, prev, pager, next"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import mineApi from "@/api/mine.js";
export default {
  name: "CaseList",
  data() {
    return {
      searchText: "",
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      taskCaseStatus: {
        '0': '新增',
        '1': '已删除',
        '2': '跳过',
        '3': '通过',
        '4': '失败'
      }
    };
  },
  methods: {
    // 获取列表数据
    getListData() {
      let params = {
        projectid: this.proId,
        type: "task_case",
        page_index: this.pageIndex,
        page_size: this.pageSize,
        title: this.searchText
      };
      if (this.taskType == 1) {
        mineApi
          .getUnfinish(params)
          .then(res => {
            this.tableData = res.data.data;
            this.total = res.data.total;
          })
          .catch(err => {
            this.$message.error(err.message);
          });
      }
      if (this.taskType == 2) {
        mineApi
          .getFinish(params)
          .then(res => {
            this.tableData = res.data.data;
            this.total = res.data.total;
          })
          .catch(err => {
            this.$message.error(err.message);
          });
      }
      if (this.taskType == 3) {
        // todo this.activeName = "first";
        mineApi
          .getCreated(params)
          .then(res => {
            this.tableData = res.data.data;
            this.total = res.data.total;
          })
          .catch(err => {
            this.$message.error(err.message);
          });
      }
    },
    // 搜索
    searchTitle() {
      this.getListData();
    },
    // 切换分页
    handleCurrentChange() {
      this.getListData();
    }
  },
  props: ["taskType", "proId"],
  watch: {
    taskType() {
      console.log(this.taskType, this.proId);
      this.getListData();
    },
    proId() {
      console.log(this.taskType, this.proId);
      this.getListData();
    }
  },
  mounted() {
    console.log(this.taskType, this.proId);
    this.getListData();
  }
};
</script>

<style lang="scss" scoped>
.case-list {
}
</style>
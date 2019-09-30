<template>
  <div class="task-list">
    <el-input
      placeholder="请输入标题或ID关键字"
      v-model="searchText"
      class="m-search"
      clearable
      @keyup.native="searchTitle"
      @change="searchTitle"
      style="margin: 10px 0 20px 0;"
    >
      <i slot="prefix" class="el-input__icon el-icon-search"></i>
    </el-input>
    <el-table :data="tableData" style="width: 100%;font-size: 14px;" >
      <el-table-column prop="id" label="ID" width="60"></el-table-column>
      <el-table-column prop="name" label="标题" width="520">
        <template slot-scope="scope">
          <router-link
            :to="{name:'taskResult',params:{projectId: scope.row.project_id,versionId:'all',taskId:scope.row.id}}"
          >{{scope.row.name}}</router-link>
        </template>
      </el-table-column>
      <el-table-column prop="tmethod" label="任务方法"></el-table-column>
      <el-table-column prop="ttype" label="任务类型"></el-table-column>
      <el-table-column prop="start_time" label="开始时间"></el-table-column>
      <el-table-column prop="end_time" label="结束时间"></el-table-column>
      <el-table-column prop="version_name" label="版本"></el-table-column>
      <el-table-column prop="executor_name" label="执行人"></el-table-column>
      <el-table-column prop="creator_name" label="创建人"></el-table-column>
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
  name: "TaskList",
  data() {
    return {
      searchText: "",
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      tableData: []
    };
  },
  methods: {
    // 获取列表数据
    getListData() {
      let params = {
        projectid: this.proId,
        type: "task",
        page_index: this.pageIndex,
        page_size: this.pageSize,
        title: this.searchText
      };
      if (this.taskType == 1) {
        mineApi
          .getUnfinish(params)
          .then(res => {
            console.log(res)
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
.task-list {
  .el-table--mini{
    font-size: 14px;
  }
}

</style>

<template>
  <div class="issue-list">
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
      <el-table-column prop="id" label="ID" width="80"></el-table-column>
      <el-table-column prop="title" label="标题" width="180">
        <template slot-scope="scope">
          <router-link
            :to="{name:'issueDetailPage',params:{projectId: scope.row.project_id,versionId:'all',issueId:scope.row.id}}"
          >{{scope.row.title}}</router-link>
        </template>
      </el-table-column>
      <el-table-column prop="version_name" label="版本"></el-table-column>
      <el-table-column prop="level" label="严重程度">
        <template slot-scope="scope">
          {{level[scope.row.level]}}
        </template>
      </el-table-column>
      <el-table-column prop="priority" label="优先级">
        <template slot-scope="scope">
          {{priority[scope.row.priority]}}
        </template>
      </el-table-column>
      <el-table-column prop="handle_status" label="状态">
        <template slot-scope="scope">
          {{issueStatus[scope.row.handle_status]}}
        </template>
      </el-table-column>
      <el-table-column prop="handler_name" label="处理人"></el-table-column>
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
  name: "IssueList",
  data() {
    return {
      searchText: "",
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      level: {
        '0': '阻塞',
        '1': '严重',
        '2': '重要',
        '3': '次要',
        '4': '微小'
      },
      priority: {
        '0': '紧急',
        '1': '高',
        '2': '中',
        '3': '低'
      },
      issueStatus: {
        '1': '待办',
        '2': '修复中',
        '3': '测试中',
        '4': '已关闭',
        '5': '已拒绝',
        '6': '延时处理',
      }
    };
  },
  methods: {
    // 获取列表数据
    getListData() {
      let params = {
        projectid: this.proId,
        type: "issue",
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
.issue-list {
}
</style>
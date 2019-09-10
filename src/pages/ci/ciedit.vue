<template>
  <div>
    <div class="ciList-wrap">
      <p class="desciption">
        {{ciDescription}}
        <el-button class="goback" type="primary" plain @click="cancelFun">返回上一页</el-button>
      </p>
      <div class="search-bar">
        <label>触发者：</label>
        <div>
          <el-input
            placeholder="输入标题关键字"
            v-model="searchData.start_name"
            clearable
            @change="filterData"
          >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
        <label>日期：</label>
        <div>
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
      <a-table
        :rowKey="record => record.id"
        :dataSource="ciData"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <a-table-column title="ID" data-index="id" key="id"></a-table-column>
        <a-table-column title="url" data-index="url" key="url"></a-table-column>
        <a-table-column title="触发者" data-index="start_name" key="start_name"></a-table-column>
        <a-table-column title="触发时间" data-index="run_date" key="run_date"></a-table-column>
        <a-table-column title="运行时长（s)" data-index="run_time" key="run_time"></a-table-column>
        <a-table-column title="用例个数" data-index="job_count" key="job_count"></a-table-column>
        <a-table-column title="正确率" data-index="job_accuracy" key="job_accuracy">
          <template slot-scope="text, record">
            <div class="accuracy-btn">{{gainaccuracy(record)}}</div>
          </template>
        </a-table-column>
        <a-table-column title="详情" data-index="report" key="report">
          <template slot-scope="text, record">
            <a v-if="record.job_count === 0" class="noCount">查看报告</a>
            <a v-else class="toDetail" @click="clickreport(record)">查看报告</a>
          </template>
        </a-table-column>
      </a-table>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
import userApi from "@/api/user.js";
import axios from "axios";
import projectApi from "@/api/project.js";
import ciApi from "@/api/ci.js";
import moment from "moment";

const endDate = new Date();
const startDate = new Date();
startDate.setTime(startDate.getTime() - 3600 * 1000 * 24 * 90);
export default {
  data() {
    return {
      ciDescription: "",
      date: [startDate, endDate],
      loading: true,
      winHeight: window.innerHeight - 66,
      rememberPage: "",
      rememberSize: "",
      start_name: "",
      pagination: {
        current: 1,
        pageSize: 10,
        showTotal: total => `共 ${total} 条数据`
      },
      ciData: [],
      tData: {
        data: [],
        total: 1
      },
      searchData: {
        start_name: ""
      },
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
      }
    };
  },
  computed: {
    ciId() {
      return this.$route.params.jobId;
    },
    currentPage() {
      return this.$route.query && this.$route.query.page
        ? parseInt(this.$route.query.page)
        : 1;
    },
    pageSize() {
      return this.$route.query && this.$route.query.size
        ? parseInt(this.$route.query.size)
        : 10;
    }
  },
  methods: {
    gainaccuracy(row) {
      // console.log(scope)
      let item = row.job_accuracy;
      let num = Number(item * 100);
      let numStr = num.toString();
      if (numStr.indexOf(".") != -1 && numStr.split(".")[1] > 100) {
        num = num.toFixed(2);
      }
      return num + "%";
    },
    clickreport(row) {
      if (row.report == "" || row.job_count == 0) {
        this.$message({
          message: "对不起，当前job无报告！",
          type: "warning"
        });
      } else {
        window.open(row.report, "_blank");
      }
    },
    cancelFun() {
      this.$router.go(-1); //返回上一层
    },
    handleTableChange(pagination, filters, sorter) {
      console.log(pagination);
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.getCiData({
        page_size: pagination.pageSize,
        page_index: pagination.current
      });
    },
    getCiData(par = {}) {
      let params = { ...par };
      let start = moment(this.date[0]).format("YYYY-MM-DD");
      let end = moment(this.date[1]).format("YYYY-MM-DD");

      params.start_time = start;
      params.end_time = end;
      params.start_name = this.searchData.start_name;

      this.loading = false;
      ciApi.jobList(this.ciId, params).then(
        res => {
          const pagination = { ...this.pagination };
          pagination.total = res.data.total;
          this.ciData = res.data.data;
          console.log(this.ciData)
          this.pagination = pagination;
          this.loading = false;
        },
        error => {
          this.ciData = [];
          this.loading = false;
        }
      );
    },
    filterData() {
      this.pagination.current = 1;
      this.getCiData({
        page_size: this.pagination.pageSize,
        page_index: this.pagination.current
      });
    },
    getCiInfo() {
      ciApi.getCiById(this.ciId).then(res => {
        this.ciDescription = res.data.data[0].description;
      });
    }
  },
  watch: {
    date: {
      handler: function() {
        this.filterData();
      },
      deep: true
    },
    $route() {
      //监听路由变化
      this.pagination.current = 1;
      this.getCiData({
        page_size: this.pagination.pageSize,
        page_index: this.pagination.current
      });
    },
    "searchData.start_name": {
      handler: function() {
        this.filterData();
      },
      deep: true
    }
  },
  created() {
    this.getCiInfo();
    this.getCiData({
      page_size: this.pagination.pageSize,
      page_index: this.pagination.current
    });
  }
};
</script>
<style lang="scss" scoped>
.ciList-wrap {
  padding: 20px;
  .desciption {
    width: 100%;
    text-align: left;
    font-weight: 700;
    .goback {
      margin-left: 15px;
    }
  }
  .search-bar {
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    background: #e5edf5;
    padding: 10px;
    margin-bottom: 12px;
    label {
      display: block;
      width: 100px;
    }
  }
  .noCount {
    color: #999;
  }
}
</style>

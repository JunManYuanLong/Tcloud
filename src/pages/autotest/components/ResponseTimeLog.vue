<template>
  <div class="response-time-log">
    <el-card class="box-card">
      <!-- 筛选条件与新增按钮 -->
      <div class="response-time-log-serach">
        <div class="serach-select">
          <el-select
            class="margin-right"
            v-model="data_source"
            filterable
            clearable
            placeholder="请选择数据来源"
            @change="serachChange"
          >
            <el-option
              v-for="item in dataSourceList"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-select
            class="margin-right"
            v-model="phone_model"
            filterable
            clearable
            placeholder="请选择手机型号"
            @change="serachChange"
          >
            <el-option
              v-for="item in phoneModelList"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-select
            class="margin-right"
            v-model="apk_version"
            filterable
            clearable
            placeholder="请选择apk版本"
            @change="serachChange"
          >
            <el-option
              v-for="item in apkVersionList"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-select
            class="margin-right"
            v-model="kernel_version"
            filterable
            clearable
            placeholder="请选择内核版本"
            @change="serachChange"
          >
            <el-option
              v-for="item in kernelVersionList"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            ></el-option>
          </el-select>
          <!-- </div>
          <div class="serach-select">-->
          <el-select
            class="margin-right"
            v-model="system_version"
            filterable
            clearable
            placeholder="请选择系统版本"
            @change="serachChange"
          >
            <el-option
              v-for="item in systemVersionList"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-select
            class="margin-right"
            v-model="thesaurus_version"
            filterable
            clearable
            placeholder="请选择词库版本"
            @change="serachChange"
          >
            <el-option
              v-for="item in thesaurusVersionList"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-select
            class="margin-right"
            v-model="corpus_version"
            filterable
            clearable
            placeholder="请选择语料版本"
            @change="serachChange"
          >
            <el-option
              v-for="item in corpusVersionList"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
        <el-button type="primary" style="float: right; margin: 20px 0" @click="addItem">新增数据</el-button>
      </div>
      <!-- 表格 -->
      <div class="response-time-log-table">
        <el-table
          :data="tableData"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          ref="multipleTable"
          :row-key="getRowKeys"
        >
          <el-table-column
            type="selection"
            width="55"
            :selectable="isDisabled"
            :reserve-selection="true"
          ></el-table-column>
          <el-table-column prop="data_source" label="数据来源" align="center"></el-table-column>
          <el-table-column prop="phone_model" label="手机型号" align="center"></el-table-column>
          <el-table-column prop="apk_version" label="apk版本" align="center"></el-table-column>
          <el-table-column prop="kernel_version" label="内核版本" align="center"></el-table-column>
          <el-table-column prop="system_version" label="系统版本" align="center"></el-table-column>
          <el-table-column prop="thesaurus_version" label="词库版本" align="center"></el-table-column>
          <el-table-column prop="corpus_version" label="语料版本" align="center"></el-table-column>
          <el-table-column
            prop="key_9_kernel_click_time_average"
            label="9键点击-请求内核时间平均值"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="key_26_kernel_click_time_average"
            label="26键点击-请求内核时间平均值"
            align="center"
          ></el-table-column>
          <el-table-column prop="key_9_kernel_response_time" label="9键请求内核-响应时间" align="center"></el-table-column>
          <el-table-column prop="key_26_kernel_response_time" label="26键请求内核-响应时间" align="center"></el-table-column>
          <el-table-column prop="cpu_average" label="cpu均值" align="center"></el-table-column>
          <el-table-column prop="ram_average" label="内存均值" align="center"></el-table-column>
          <el-table-column prop="battery_use" label="耗电量" align="center"></el-table-column>
          <el-table-column prop="creator_nickname" label="创建人" align="center"></el-table-column>
          <el-table-column prop="creation_time" label="创建时间" align="center" width="140"></el-table-column>
          <el-table-column
            prop="comment"
            label="备注"
            align="center"
            width="100"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button @click="editItem(scope.row)" type="text" size="small">编辑</el-button>
              <el-button @click="delItem(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin-top: 10px" v-show="total > 0">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="pageIndex"
            :page-size="pageSize"
            layout="total, prev, pager, next"
            :total="total"
          ></el-pagination>
        </div>
      </div>
      <!-- 图表 -->
      <div class="response-time-log-chart">
        <div style="padding: 20px 0;">
          <el-button type="primary" icon="el-icon-date" round @click="showLast(1)">展示最近七天</el-button>
          <el-button type="primary" icon="el-icon-date" round @click="showLast(2)">展示近一个月</el-button>
           <el-button type="primary" icon="el-icon-date" round @click="getCharData">默认展示</el-button>
        </div>
        <div ref="passRate" style="height: 500px;"></div>
        <div ref="passRate2" style="height: 500px; margin-top: 80px;"></div>
      </div>
      <!-- 新增和编辑弹出框 -->
      <el-dialog
        :title="dialog.title"
        :visible.sync="dialog.dialogVisible"
        width="60%"
        :show-close="false"
      >
        <el-form ref="form" :model="form" :rules="rules" label-width="210px" label-position="left">
          <el-form-item label="数据来源" prop="data_source">
            <el-select v-model="form.data_source" filterable clearable placeholder="请选择数据来源">
              <el-option
                v-for="item in dataSourceList"
                :key="item.id"
                :label="item.value"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-button type="primary" @click="addPropList(1)">添加选项</el-button>
          </el-form-item>
          <el-form-item label="手机型号" prop="phone_model">
            <el-select v-model="form.phone_model" filterable clearable placeholder="请选择手机型号">
              <el-option
                v-for="item in phoneModelList"
                :key="item.id"
                :label="item.value"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-button type="primary" @click="addPropList(2)">添加选项</el-button>
          </el-form-item>
          <el-form-item label="请选择apk版本" prop="apk_version">
            <el-select v-model="form.apk_version" filterable clearable placeholder="请选择apk版本">
              <el-option
                v-for="item in apkVersionList"
                :key="item.id"
                :label="item.value"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-button type="primary" @click="addPropList(3)">添加选项</el-button>
          </el-form-item>
          <el-form-item label="内核版本" prop="kernel_version">
            <el-select v-model="form.kernel_version" filterable clearable placeholder="请选择内核版本">
              <el-option
                v-for="item in kernelVersionList"
                :key="item.id"
                :label="item.value"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-button type="primary" @click="addPropList(4)">添加选项</el-button>
          </el-form-item>
          <el-form-item label="系统版本" prop="system_version">
            <el-select v-model="form.system_version" filterable clearable placeholder="请选择系统版本">
              <el-option
                v-for="item in systemVersionList"
                :key="item.id"
                :label="item.value"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-button type="primary" @click="addPropList(5)">添加选项</el-button>
          </el-form-item>
          <el-form-item label="词库版本" prop="thesaurus_version">
            <el-select v-model="form.thesaurus_version" filterable clearable placeholder="请选择词库版本">
              <el-option
                v-for="item in thesaurusVersionList"
                :key="item.id"
                :label="item.value"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-button type="primary" @click="addPropList(6)">添加选项</el-button>
          </el-form-item>
          <el-form-item label="语料版本" prop="corpus_version">
            <el-select v-model="form.corpus_version" filterable clearable placeholder="请选择语料版本">
              <el-option
                v-for="item in corpusVersionList"
                :key="item.id"
                :label="item.value"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-button type="primary" @click="addPropList(7)">添加选项</el-button>
          </el-form-item>
          <el-form-item label="9键点击-请求内核时间平均值">
            <el-input v-model="form.key_9_kernel_click_time_average" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="26键点击-请求内核时间平均值">
            <el-input v-model="form.key_26_kernel_click_time_average" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="9键请求内核-响应时间">
            <el-input v-model="form.key_9_kernel_response_time" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="26键请求内核-响应时间">
            <el-input v-model="form.key_26_kernel_response_time" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="cpu均值">
            <el-input v-model="form.cpu_average" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="内存均值">
            <el-input v-model="form.ram_average" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="耗电量">
            <el-input v-model="form.battery_use" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="创建时间" v-if="this.dialog.title === '编 辑'">
            <el-input v-model="form.creation_time" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.comment" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="是否在曲线图中展示">
            <el-switch v-model="form.show_in_chart" active-color="#13ce66" inactive-color="#ccc"></el-switch>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="addOrEdit">{{dialog.btn}}</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
const echarts = require("echarts");
import monkeyApi from "@/api/monkey.js";
export default {
  name: "ResponseTimeLog",
  data() {
    return {
      // 筛选条件
      data_source: "",
      phone_model: "",
      apk_version: "",
      kernel_version: "",
      system_version: "",
      thesaurus_version: "",
      corpus_version: "",
      // 筛选条件列表
      dataSourceList: [],
      phoneModelList: [],
      apkVersionList: [],
      kernelVersionList: [],
      systemVersionList: [],
      thesaurusVersionList: [],
      corpusVersionList: [],
      // 表格数据
      tableData: [],
      pageIndex: 1,
      pageSize: 10,
      total: 10,
      // 对话框数据
      dialog: {
        title: "",
        dialogVisible: false,
        btn: ""
      },
      form: {
        data_source: "",
        phone_model: "",
        apk_version: "",
        kernel_version: "",
        system_version: "",
        thesaurus_version: "",
        corpus_version: "",
        key_9_kernel_click_time_average: "",
        key_26_kernel_click_time_average: "",
        key_9_kernel_response_time: "",
        key_26_kernel_response_time: "",
        cpu_average: "",
        ram_average: "",
        battery_use: "",
        creation_time: "",
        comment: "",
        show_in_chart: true
      },
      multipleSelection: {},
      rules: {
        data_source: [
          { required: true, message: "请选择数据来源", trigger: "change" }
        ],
        phone_model: [
          { required: true, message: "请选择手机型号", trigger: "change" }
        ],
        apk_version: [
          { required: true, message: "请选择apk版本", trigger: "change" }
        ],
        kernel_version: [
          { required: true, message: "请选择内核版本", trigger: "change" }
        ],
        system_version: [
          { required: true, message: "请选择系统版本", trigger: "change" }
        ],
        thesaurus_version: [
          { required: true, message: "请选择词库版本", trigger: "change" }
        ],
        corpus_version: [
          { required: true, message: "请选择语料版本", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    // 获取下拉列表数据
    getSerchList() {
      monkeyApi
        .getSerchList()
        .then(res => {
          console.log(res.data.data);
          let data = res.data.data;
          this.dataSourceList = data["1"];
          this.phoneModelList = data["2"];
          this.apkVersionList = data["3"];
          this.kernelVersionList = data["4"];
          this.systemVersionList = data["5"];
          this.thesaurusVersionList = data["6"];
          this.corpusVersionList = data["7"];
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    // 新增下拉列表
    addPropList(type) {
      this.$prompt("请输入要添加的值", "添加选项", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(val => {
          let params = {
            data_type: type / 1,
            data_value: val.value
          };
          monkeyApi
            .addSerchList(params)
            .then(res => {
              console.log(res);
              this.getSerchList();
            })
            .catch(err => {
              this.$message.error(err.message);
            });
        })
        .catch(() => {});
    },
    // 获取表格数据
    getTableData() {
      let params = {
        data_source: this.data_source,
        phone_model: this.phone_model,
        apk_version: this.apk_version,
        kernel_version: this.kernel_version,
        system_version: this.system_version,
        thesaurus_version: this.thesaurus_version,
        corpus_version: this.corpus_version,
        page_index: this.pageIndex,
        page_size: this.pageSize
      };
      monkeyApi
        .getLogList(params)
        .then(res => {
          console.log(res);
          this.tableData = res.data.data;
          this.total = res.data.total;
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    // 表格行是否禁用checkbox
    isDisabled(row) {
      if (row.show_in_chart === 0) {
        return true;
      } else {
        return false;
      }
    },
    // 搜索表格数据
    serachChange() {
      this.getTableData();
    },
    // 编辑数据对话框
    editItem(row) {
      this.clearForm(this.form);
      this.dialog = {
        title: "编 辑",
        dialogVisible: true,
        btn: "编 辑"
      };
      for (let k in this.form) {
        this.form[k] = row[k];
      }
      this.form.data_source = this.serchId(
        this.dataSourceList,
        row.data_source
      );
      this.form.phone_model = this.serchId(
        this.phoneModelList,
        row.phone_model
      );
      this.form.apk_version = this.serchId(
        this.apkVersionList,
        row.apk_version
      );
      this.form.kernel_version = this.serchId(
        this.kernelVersionList,
        row.kernel_version
      );
      this.form.system_version = this.serchId(
        this.systemVersionList,
        row.system_version
      );
      this.form.thesaurus_version = this.serchId(
        this.thesaurusVersionList,
        row.thesaurus_version
      );
      this.form.corpus_version = this.serchId(
        this.corpusVersionList,
        row.corpus_version
      );
      this.form.show_in_chart = this.form.show_in_chart === 0 ? true : false;
      this.form.id = row.id;
    },
    // 编辑接口
    editItemSure(params) {
      this.$refs["form"].validate(valid => {
        if (valid) {
          monkeyApi
            .editLogList(params, params.id)
            .then(res => {
              this.dialog.dialogVisible = false;
              this.$message.success("编辑成功");
              this.getTableData();
              this.getCharData();
            })
            .catch(err => {
              this.$message.error(err.message);
            });
        } else {
          return false;
        }
      });
    },
    // 新增数据对话框
    addItem() {
      this.clearForm(this.form);
      this.dialog = {
        title: "新 增",
        dialogVisible: true,
        btn: "新 增"
      };
      if (this.$refs["form"]) {
        this.$refs["form"].resetFields();
      }
    },
    // 新增接口
    addItemSure(params) {
      this.$refs["form"].validate(valid => {
        if (valid) {
          monkeyApi
            .addLogList(params)
            .then(res => {
              this.dialog.dialogVisible = false;
              this.$message.success("新增成功");
              this.getTableData();
              this.getCharData();
            })
            .catch(err => {
              this.$message.error(err.message);
            });
        } else {
          return false;
        }
      });
    },
    // 确认
    addOrEdit() {
      let params = JSON.parse(JSON.stringify(this.form));
      params.show_in_chart = params.show_in_chart ? 0 : 1;
      if (this.dialog.title === "新 增") {
        this.addItemSure(params);
      } else {
        this.editItemSure(params);
      }
    },
    // 取消
    cancel() {
      this.dialog = {
        title: "",
        dialogVisible: false,
        btn: ""
      };
      this.$refs["form"].resetFields();
    },
    // 删除数据对话框
    delItem(row) {
      this.$confirm("确定要删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          monkeyApi
            .delLogList(row.id)
            .then(res => {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getTableData();
              this.getCharData();
            })
            .catch(err => {
              this.$message.error(err.message);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 切换分页
    handleCurrentChange() {
      this.getTableData();
    },
    // 获取echars数据
    getCharData() {
      let params = {
        show_in_chart: 0
      };
      monkeyApi
        .getLogList(params)
        .then(res => {
          this.getChars(res.data.data);
        })
        .catch(err => {
          console.log(err.message);
          // this.$message.error(err.message);
        });
    },
    // 加载echars
    getChars(data) {
      if (!data) {
        return;
      }
      console.log(data);
      let xAxis = [];
      let key_9_kernel_click_time_average = [];
      let key_26_kernel_click_time_average = [];
      let key_9_kernel_response_time = [];
      let key_26_kernel_response_time = [];
      let cpu_average = [];
      let ram_average = [];
      let battery_use = [];
      data.forEach(item => {
        xAxis.push(item.apk_version);
        key_9_kernel_click_time_average.push(
          item.key_9_kernel_click_time_average
        );
        key_26_kernel_click_time_average.push(
          item.key_26_kernel_click_time_average
        );
        key_9_kernel_response_time.push(item.key_9_kernel_response_time);
        key_26_kernel_response_time.push(item.key_26_kernel_response_time);
        cpu_average.push(item.cpu_average);
        ram_average.push(item.ram_average);
        battery_use.push(item.battery_use);
      });
      let legend = [
        "9键点击-请求内核时间平均值",
        "26键点击-请求内核时间平均值",
        "9键请求内核-响应时间",
        "26键请求内核-响应时间"
      ];
      let legend2 = ["cpu均值", "内存均值", "耗电量"];
      let series = [
        {
          name: "9键点击-请求内核时间平均值",
          type: "line",
          data: key_9_kernel_click_time_average // 有几个x轴，就有几条数据
        },
        {
          name: "26键点击-请求内核时间平均值",
          type: "line",
          data: key_26_kernel_click_time_average
        },
        {
          name: "9键请求内核-响应时间",
          type: "line",
          data: key_9_kernel_response_time
        },
        {
          name: "26键请求内核-响应时间",
          type: "line",
          data: key_26_kernel_response_time
        }
      ];
      let series2 = [
        {
          name: "cpu均值",
          type: "line",
          data: cpu_average // 有几个x轴，就有几条数据
        },
        {
          name: "内存均值",
          type: "line",
          data: ram_average
        },
        {
          name: "耗电量",
          type: "line",
          data: battery_use
        }
      ];
      let myChart = echarts.init(this.$refs["passRate"]);
      let myChart2 = echarts.init(this.$refs["passRate2"]);
      myChart.setOption(this.getOptions(xAxis, legend, series));
      myChart2.setOption(this.getOptions(xAxis, legend2, series2));
    },
    // 获取option
    getOptions(xAxis, legend, series) {
      return {
        title: {
          text: "折线图"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          // 几条曲线
          data: legend
        },
        grid: {
          left: "10%",
          right: "4%",
          bottom: "6%",
          containLabel: false
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          // x轴
          type: "category",
          boundaryGap: false,
          data: xAxis
        },
        yAxis: {
          type: "value"
        },
        series: series
      };
    },
    // 切换勾选
    handleSelectionChange(rows) {
      this.multipleSelection = rows;
      console.log(rows);
      if (rows.length === 0) {
        this.getCharData();
        return;
      }
      this.getChars(rows); // 更新视图
    },
    // 设置row-key
    getRowKeys(row) {
      return row.id;
    },
    // 展示最近七天或者最近一个月
    showLast(val) {
      let params = {
        show_in_chart: 0,
        date_time: val
      };
      monkeyApi
        .getLogList(params)
        .then(res => {
          this.getChars(res.data.data);
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    // 清空form
    clearForm(data) {
      for (let k in data) {
        data[k] = "";
      }
      data.show_in_chart = true;
    },
    // 匹配搜索id
    serchId(arr, val) {
      return arr.find(item => {
        return item.value === val;
      }).id;
    }
  },
  created() {
    this.getSerchList(); // 获取下拉数据
    this.getTableData(); // 获取表格数据
  },
  mounted() {
    this.getCharData(); // 获取图数据
  }
};
</script>

<style scoped lang="scss">
.response-time-log {
  .box-card {
    padding: 20px;
    .response-time-log-serach {
      padding-bottom: 20px;
      .serach-select {
        padding: 10px;
        display: flex;
        justify-content: space-between;
        .margin-right {
          margin-right: 10px;
        }
      }
    }
    .response-time-log-table {
      padding: 0 0 30px 0;
    }
    .response-time-log-chart {
      padding: 30px 10px 30px 0;
    }
  }
}
</style>



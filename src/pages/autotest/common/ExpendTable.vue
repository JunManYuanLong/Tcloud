<template>
  <div class="expend-table">
    <el-table
      :data="tableData"
      style="width: 100%"
      :row-key="getRowKey"
      @expand-change="expandChange"
      :expand-row-keys="currentExpendRow">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-table :data="scope.row.monkey_device_status" style="width: 100%">
            <el-table-column label="TaskID" prop="id"></el-table-column>
            <el-table-column label="手机名" prop="mobile_model"></el-table-column>
            <el-table-column label="手机版本" prop="mobile_version"></el-table-column>
            <el-table-column label="开始时间" prop="begin_time"></el-table-column>
            <el-table-column label="结束时间" prop="end_time"></el-table-column>
            <el-table-column label="状态">
              <template slot-scope="subScope">
                <el-tag>{{subScope.row.current_stage || '未知'}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="进度" prop="process">
              <template slot-scope="scope">
                <el-tag>{{scope.row.process + '%'}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" prop="process">
              <template slot-scope="scope">
                <el-button type="text" @click="shutDownTask(scope.row)" :disabled="scope.row.process == 100">中断</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="图标" align="center">
        <template slot-scope="scope">
          <div class="table-image-icon">
            <img :src="scope.row.app_picture.startsWith('http') ? scope.row.app_picture : `data:image/png;base64,${scope.row.app_picture}`" alt>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="手机数量" align="center">
        <template slot-scope="scope">{{scope.row.monkey_device_status.length}}</template>
      </el-table-column>
      <el-table-column label="APP" prop="app_name" align="center"></el-table-column>
      <el-table-column label="版本" prop="app_version" align="center"></el-table-column>
      <el-table-column label="测试类型" width="183px" align="center">
        <template slot-scope="scope">
          <el-tag>{{typeMap[scope.row.type_id]}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="设置参数" align="center" width="150px">
        <template slot-scope="scope">
          <el-tag type="info">{{`运行时间：${scope.row.run_time}分钟`}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="任务提交时间" prop="creation_time" width="200px" align="center"></el-table-column>
      <el-table-column label="提测人" prop="user_nickname" align="center"></el-table-column>
      <el-table-column label="进度" prop="process" align="center">
        <template slot-scope="scope">
          <el-tag>{{scope.row.process + '%'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150">
        <template slot-scope="scope">
          <el-button type="text" @click="shutDownMonkey(scope.row)" :disabled="scope.row.process == 100">中断</el-button>
          <el-button type="text" @click="showDetailHandler(scope.row)">查看报表</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="padding: 20px 0;" v-show="total > 0">
      <el-pagination
        v-show="total"
        background
        layout="prev, pager, next"
        :total="total"
        @current-change="changePage"
      ></el-pagination>
    </div>
    <!-- 中断对话框 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>确定执行中断操作？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureCancel">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import monkeyApi from "@/api/monkey.js";
export default {
  name: "ExpendTable",
  data() {
    return {
      currentExpendRow: [],
      typeMap: {
          1: 'MIX（混合模式）',
          2: 'DFS（深度遍历）',
          3: 'TROY（可配置的深度遍历）'  
      },
      dialogVisible: false,
      rowData: {},
      rowType: ''
    };
  },
  methods: {
    getRowKey (row) {
      return row.id
    },
    changePage(val) {
      this.$emit("changePage", val);
    },
    showDetailHandler(row) {
      this.$emit("showDetailHandler", row);
    },
    expandChange(row, expandedRows) {
      console.log(row)
      if (expandedRows.length > 1) {
        // 只展开当前选项
        expandedRows.shift()
      }
    },
    shutDown (id, type) {
      let params = {
        [type]: id
      }
      monkeyApi.shutDownMonkey(params).then(res => {
        this.$message.success('中断成功')
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    shutDownMonkey (row) {
      this.dialogVisible = true
      this.rowData = row
      this.rowType = 'monkey_id'
    },
    shutDownTask (row) {
      this.dialogVisible = true
      this.rowData = row
      this.rowType = 'task_id'
    },
    sureCancel () {
      this.dialogVisible = false
      this.shutDown(this.rowData.id, this.rowType)
    }
  },
  props: ["tableData", "total"]
};
</script>
<style scoped lang="scss">
.expend-table {
  .table-image-icon {
    width: 45px;
    height: 45px;
    text-align: center;
    display: inline-block;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>



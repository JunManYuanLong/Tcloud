<template>
  <div class="deploy">
    <el-form
      :inline="true"
      :model="formData"
      ref="formData"
      class="demo-form-inline"
      :rules="rules"
    >
      <!-- 部署选项 -->
      <template>
        <el-form-item label="服务" prop="serveData">
          <el-select
            v-model="formData.serveData"
            filterable
            placeholder="请选择"
            clearable
            @change="changeServe"
          >
            <el-option v-for="item in serveList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="节点" prop="nodeData">
          <el-select v-model="formData.nodeData" filterable placeholder="请选择" clearable multiple>
            <el-option v-for="item in nodeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分支" prop="branchData">
          <el-select v-model="formData.branchData" placeholder="请选择" clearable>
            <el-option v-for="item in branchList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
      </template>
      <el-form-item>
        <el-button type="primary" @click="deployHandler" :loading="doingDeploy">一键部署</el-button>
      </el-form-item>
    </el-form>
    <el-card class="box-card" shadow="never">
      <!-- 当前部署日志 -->
      <el-row style="margin-bottom: 10px;" v-show="showTable">
        <el-col :span="24">本次部署</el-col>
      </el-row>
      <el-table :data="tableData" style="width: 100%" v-show="showTable">
        <el-table-column fixed prop="id" label="ID"></el-table-column>
        <el-table-column prop="serveName" label="服务名"></el-table-column>
        <el-table-column prop="nodeName" label="节点"></el-table-column>
        <el-table-column prop="branch" label="分支"></el-table-column>
				<el-table-column prop="version" label="版本"></el-table-column>
        <el-table-column prop="result" label="部署状态"> 
          <template slot-scope="scope">
            <el-tag>{{getResult(scope.row.result)}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="operation" label="操作">
          <template slot-scope="scope">
            <el-button @click="viewDetail(scope.row)" type="text" size="small">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 历史记录列表 -->
      <el-row style="margin: 20px 0 10px 0; ">
        <el-col :span="24">部署记录</el-col>
      </el-row>
      <el-table :data="historyTableData" style="width: 100%" height="395px">
        <el-table-column fixed prop="id" label="ID"></el-table-column>
        <el-table-column prop="serveName" label="服务名"></el-table-column>
        <el-table-column prop="nodeName" label="节点"></el-table-column>
        <el-table-column prop="branch" label="分支"></el-table-column>
				<el-table-column prop="version" label="版本"></el-table-column>
        <el-table-column prop="result" label="部署状态">
          <template slot-scope="scope">
            <el-tag>{{getResult(scope.row.result)}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="operation" label="操作">
          <template slot-scope="scope">
            <el-button @click="viewDetail(scope.row)" type="text" size="small">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 历史记录分页 -->
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </el-card>
    <!-- 部署详情 -->
    <el-dialog title="日志详情" :visible.sync="deployDialogVisible" width="60%" @close="closeDetail">
      <codemirror v-model="code" :options="cmOptions"></codemirror>
      <span slot="title" class="dialog-footer">
        <!-- <el-button type="primary" @click="viewDetail(rowData)">刷新</el-button> -->
        <el-button type="primary" @click="viewDetail(rowData)" icon="el-icon-refresh" circle></el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import oneKeyDeployApi from "@/api/onekeydeploy.js";
import { splitLine } from '@/utils/util.js'
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
export default {
  name: "Deploy",
  data() {
    return {
      code: '加载中. . .',
      cmOptions: {
          tabSize: 4,
          mode: 'java',
          lineNumbers: true,
          line: true,
          lineWrapping: false,
          readOnly: true,
          theme: 'abcdef'
      },
      doingDeploy: false,
      formData: {
        serveData: [],
        nodeData: [],
        branchData: ""
      },
      serveList: [],
      nodeList: [],
      branchList: [],
      rules: {
        serveData: [
          {
            required: true,
            message: "请选择服务",
            trigger: "change"
          }
        ],
        nodeData: [
          {
            required: true,
            message: "请选择节点",
            trigger: "change"
          }
        ],
        branchData: [
          {
            required: true,
            message: "请选择分支",
            trigger: "change"
          }
        ]
      },
      tableData: [],
      showTable: false,
      historyTableData: [],
      deployDialogVisible: false,
      timer: '',
      currentPage: 1,
      pageSize: 10,
      total: 0,
      rowData: {}
    };
  },
  computed: {},
  methods: {
    // 获取部署的历史记录
    getHistoryList () {
      let params = {
        project_id: this.projectId,
        // project_id: 1,
        flow_id: this.flowId,
        page_size: this.pageSize,
        page_index: this.currentPage
      }
      oneKeyDeployApi.getHistoryList(params).then(res => {
        console.log(res)
        if (res.data.code == 0) {
          this.historyTableData = res.data.data
          this.total = res.data.total
          console.log(this.historyTableData)
          this.historyTableData.forEach(item => {
            item.serveName = item.server_name
            item.nodeName = item.node_name
          })
        }
      }).catch(err => {
        this.$message.error(`部署记录获取失败:${err.message}}`);
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getHistoryList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getHistoryList()
    },
    // 获取服务，节点，分支列表
    getAllList() {
      let params = {
        project_id: this.projectId
        // project_id: 1
      };
      oneKeyDeployApi
        .getServer(params)
        .then(res => {
          console.log(res);
          if (res.data.code == 0) {
            this.serveList = res.data.data
            this.getHistoryList()
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 服务，节点和分支联动
    changeServe(val) {
      if (val) {
        // 过滤得到该服务下的nodeList和branchList
        this.formData.nodeData = []
        this.formData.branchData = ''
        this.nodeList = this.serveList.find(item => {
          return item.id == val;
        }).node_list;
        // 通过serverId获取分支列表
        this.getBranchList(val)
      } else {
        this.hasServe = false;
        this.nodeList = [];
        this.formData.nodeData = []
        this.branchList = [];
        this.formData.branchData = ''
      }
    },
    // 通过serverId获取分支列表
    getBranchList (id) {
      let params = {
        server_id: id
      }
      oneKeyDeployApi
        .getBranchById(params)
        .then(res => {
          console.log(res);
          if (res.data.code == 0) {
            this.branchList = res.data.data
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 一键部署
    deployHandler() {
      this.$refs["formData"].validate(valid => {
        if (valid) {
          // 调用部署接口, 回调后可以得到id
          this.doingDeploy = true
          this.sendDeploy()
            .then(res => {
              if (res.data.code == 0) {
                let deployId = res.data.data[0].deploy_id;
                // 通过id轮询刷新列表
                if (this.timer) {
                  clearInterval(this.timer)
                  this.timer = ''
                }
                this.timer = setInterval(() => {
                  this.getCurrentStatus(deployId)
                }, 1000)
              } else {
                this.$message.info(res.data.message)
                this.doingDeploy = false
              }
            })
            .catch(err => {
              this.doingDeploy = false
              this.$message.error(`部署失败:${err.message}`);
            });
          this.showTable = true;
        } else {
          console.log("error submit!");
          return false;
        }
      });
    },
    formatServer (id) {
      return this.serveList.find(item => {
        return item.id == id
      }).name
    },
    formatNode (ids) {
      let arr = []
      for (let i = 0; i < ids.length; i++) {
        arr.push({
          node_id: ids[i],
          node_name: this.nodeList.find(item => {
            return item.id == ids[i]
          }).name
        })
      }
      return arr
    },
    // 调用部署接口
    sendDeploy() {
      let server_list = [
        {
          server_id: this.formData.serveData,
          server_name: this.formatServer(this.formData.serveData)
        }
      ]
      let params = {
        project_id: this.projectId,
        // project_id: 1,
        flow_id: this.flowId,
        server_list,
        node_list: this.formatNode(this.formData.nodeData),
        branch: this.formData.branchData
      };
      console.log(params)
      return oneKeyDeployApi.oneKeyDeploy(params)
    },
    // 通过id拉取当前状态
    getCurrentStatus (deployId) {
      let params = {
        project_id: this.projectId,
        // project_id: 1,
        flow_id: this.flowId,
        deploy_id: deployId
      }
      return oneKeyDeployApi.currentStatus(params).then(res => {
        if (res.data.code == 0) {
          this.tableData = res.data.data.data
          console.log(res.data.data['is_one_Key'])
          if (res.data.data['is_one_Key'] == 0) {
            this.doingDeploy = false
            this.getHistoryList()
            // this.$emit('getFlowDetail') // 刷新日志
            clearInterval(this.timer)
          }
          this.tableData.forEach(item => {
            let lineData = this.serveList.find(item2 => {
              return item2.id == item.server_id
            })
            item.serveName = lineData.name
            item.nodeName = lineData['node_list'].find(item3 => {
              return item3.id == item.node_id
            }).name
          })
        } else {
          this.doingDeploy = false
        }
      }).catch(err => {
        // this.$message.error(`${err.message}}`)
        this.doingDeploy = false
      })
    },
    resetForm (formName) {
      this.$refs["formData"].resetFields();
    },
    // 查看日志详情
    viewDetail (row) {
      console.log(row);
      this.rowData = row
      this.deployDialogVisible = true;
      let params = {
        record_id: row.id
      }
      oneKeyDeployApi.getLogDetail(params).then(res => {
        if (res.data.code == 0) {
          this.getCode(res.data.data)
        }
      }).catch(err => {
        this.$message.error(`${err.message}}`);
      })
    },
    // 处理日志详情数据展示
    getCode (data) {
      console.log(data)
      // command(status stderr stdout) compile deploy refresh restart
      this.code = `${this.getItemCode(data, 'command')}${this.getItemCode(data, 'compile')}
      ${this.getItemCode(data, 'deploy')}${this.getItemCode(data, 'refresh')}
      ${this.getItemCode(data, 'restart')}`
    },
    getItemCode (data, key) {
      let itemData = data[key]
      let status = `status: ${itemData.status}`
      let stdout = `stdout: ${splitLine(itemData.stdout, '↵')}`
      let stderr = `stderr: ${splitLine(itemData.stderr, '↵')}`
      return `${key}\n\n${status}\n${stdout}\n${stderr}\n\n`
    },
    // 关闭日志详情
    closeDetail () {
      this.deployDialogVisible = false
      this.code = '加载中. . .'
      this.rowData = {}
    },
    // 转化result
    getResult (id) {
      let result = ''
      switch (id) {
        case 0: 
          result = '编译中'
          break;
        case 1:
          result = '打包失败'
          break;
        case 2:
          result = '发布失败'
          break;
        case 3:
          result = '重启失败'
          break;
        case 4:
          result = '成功'
          break;
        default:
          break;
      }
      return result
    }
  },
  props: ["projectId", "flowId"],
  created() {
    this.getAllList(); // 获取所有的服务列表
  },
  mounted() {
    this.resetForm();
  },
  components: {
    codemirror
  },
  beforeDestroy() {
    console.log(this.timer)
    if (this.timer) {
      clearInterval(this.timer)
    }
    this.doingDeploy = false
  }
};
</script>

<style scoped lang="scss">
.deploy {
  .pagination {
    display: flex;
    justify-content: center;
    margin-top: 10px;
  }
}
</style>


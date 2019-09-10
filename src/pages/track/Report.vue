<template>
  <div class="testing-report">
    <el-row class="choose">
      <el-col :span="24">
        <span>设备号类型:</span>
        <el-select
          v-model="device"
          size="small"
          placeholder="请选择"
          :disabled="isConnect"
          style="width:120px"
        >
          <el-option
            v-for="item in deviceList"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
        <span>设备号:</span>
        <el-input
          v-model="imei"
          placeholder="请输入"
          size="small"
          :disabled="isConnect"
          style="width:200px"
        ></el-input>
        <span>筛选字段:</span>
        <el-input
          placeholder="请输入需要筛选的字段,以英文逗号分隔"
          v-model.trim="hightlight"
          size="small"
          style="width:300px"
          :disabled="isConnect"
        ></el-input>
        <span>环境:</span>
        <el-select
          v-model="isTest"
          size="small"
          placeholder="请选择"
          :disabled="isConnect"
          style="width:100px"
        >
          <el-option label="测试" value="true"></el-option>
          <el-option label="正式" value="false"></el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row class="filter">
      <el-col :span="17">
        <el-button
          type="primary"
          size="small"
          @click="connect"
          :disabled="device === '' || imei === ''"
          >{{ isConnect ? '断开' : '开启' }}</el-button
        >
        <el-button
          type="primary"
          size="small"
          @click="onHideMsg"
          :disabled="message.length <= 0"
          >清除</el-button
        >
        <a
          href="http://km.innotechx.com/pages/viewpage.action?pageId=69737663"
          target="_blank"
          class="help"
        >
          <span>帮助文档</span>
        </a>
      </el-col>
      <el-col :span="7" class="filter-handle right">
        <span>只看自定义事件:</span>
        <el-switch
          class="report-text-switch"
          v-model="filterCommon"
          active-color="#13ce66"
          inactive-color="#ddd"
          @change="filterCommonChange"
        ></el-switch>
      </el-col>
    </el-row>
    <div class="content">
      <el-table
        ref="table"
        :data="message"
        stripe
        row-key="msgIndex"
        @row-click="onRowClick"
        @expand-change="expandChange"
        :expand-row-keys="currentExpendRow"
        style="min-width:1000px"
      >
        <el-table-column
          :label="field"
          v-for="field in tableFiled"
          :key="field"
          fixed
        >
          <template slot-scope="scope">
            <span :style="{ color: scope.row['waring-color'] }">
              {{ scope.row[field] }}
            </span>
          </template>
        </el-table-column>
        <el-table-column type="expand" fixed>
          <template slot-scope="scope">
            <p>{</p>
            <p
              class="filed-detail"
              v-for="(val, key, index) in scope.row"
              :key="index"
            >
              <span v-show="key !== 'waring-color'">
                <b>{{ key }} :</b>
                {{ val }}
              </span>
            </p>
            <p>}</p>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import trackApi from "@/api/track.js";
import { mapState, mapGetters, mapActions } from 'vuex'
import { getTestingConnect, sendTestingData } from '@/api/testing.js'
export default {
  data() {
    return {
      heart: 0,
      deviceList: [],
      device: '',
      imei: '',
      hightlight: '',
      currentExpendRow: [],
      isTest: 'true',
      filterCommon: true
    }
  },
  computed: {
    ...mapState('testing', ['isConnect', 'sessionId', 'stateMsg', 'command']),
    // ...mapState('login', ['userInfo']), // ？
    ...mapGetters('testing', ['tableFiled', 'message', 'getRequestParams', 'platformInfo'])
  },
  mounted() {
    this.getDevice()
  },
  watch: {
    isConnect: function(val) {
      if (val) {
        this.sentMsg()
        clearInterval(this.heart)
        this.heart = setInterval(() => {
          sendTestingData(
            {
              value: this.sessionId
            },
            this.command.heart
          )
        }, 60000)
      } else {
        clearInterval(this.heart)
      }
    },
    message: function() {
      this.$nextTick(() => {
        if (this.currentExpendRow.length === 0) {
          console.log('this.$refs.table', this.$refs)
          this.$refs.table.bodyWrapper.scrollTop = this.$refs.table.bodyWrapper.scrollHeight
        }
      })
    },
    userInfo: function() {
      if (this.getRequestParams) {
        this.device = this.getRequestParams.type || ''
        this.isTest = this.getRequestParams.is_test.toString() || 'false'
        this.imei = this.getRequestParams.value || ''
        this.hightlight = this.getRequestParams.field || ''
        this.filterCommon =
          this.getRequestParams.filter_general !== undefined
            ? this.getRequestParams.filter_general
            : true
        if (this.hightlight) {
          this.setHightLightFiled(this.hightlight)
        }
      }
    }
  },
  methods: {
    ...mapActions('testing', ['clear', 'hideMsg', 'setHightLightFiled']),
    getDevice() {
      trackApi.getDevice()
        .then(res => {
          this.deviceList = res.data.data
        })
        .catch(err => {
          console.log(err.message)
        })
    },
    connect() {
      if (this.isConnect) {
        clearInterval(this.heart)
        this.closed()
      } else {
        if (!this.device) {
          this.$message.error('请选择设备信息')
        } else if (!this.imei) {
          this.$message.error('参数不能为空')
        } else if (!this.platformInfo.project_id) {
          this.$message.error('项目不能为空')
        } else {
          if (this.hightlight) {
            this.setHightLightFiled(this.hightlight)
          }
          getTestingConnect()
        }
      }
    },
    sentMsg() {
      const type = this.device
      let obj = {
        project_id: this.platformInfo.project_id,
        is_test: this.isTest === 'false' ? Boolean(0) : Boolean(1),
        filter_general: this.filterCommon,
        type: this.device,
        value: this.imei
      }
      sendTestingData(obj, this.command.connect)
    },
    closed() {
      console.log('this.sessionId:', this.sessionId)
      sendTestingData(
        {
          value: this.sessionId || 0
        },
        this.command.close
      )
    },
    onHideMsg() {
      console.log('hideMsg:')
      this.hideMsg()
    },
    onRowClick(row, colimn, e) {
      console.log('row click:', row.msgIndex)
      if (this.currentExpendRow.indexOf(row.msgIndex) >= 0) {
        console.log('收起当前行')
        this.currentExpendRow.shift()
        return false
      }
      this.currentExpendRow.shift()
      this.currentExpendRow.push(row.msgIndex)
      console.log('row click:', this.currentExpendRow)
    },
    expandChange(row, expandedRows) {
      if (expandedRows.length > 1) {
        // 只展开当前选项
        expandedRows.shift()
      }
    },
    filterCommonChange(bo) {
      if (!this.isConnect) {
        return false
      }
      sendTestingData(
        {
          value: bo
        },
        this.command.filter
      )
    }
  },
  beforeDestroy() {
    clearInterval(this.heart)
    this.clear()
    if (this.isConnect) {
      this.closed()
    }
  }
}
</script>

<style lang="less" scoped>
.testing-report {
  position: relative;
  height: 100%;
}
.choose {
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
  margin-bottom: 10px;
  width: 1050px;
  span {
    margin-left: 15px;
    &:first-child {
      margin-left: 0;
    }
  }
}
.filter {
  margin-top: 10px;
  .filter-handle {
    height: 32px;
    padding-top: 10px;
  }
}
.right {
  text-align: right;
}
.el-input {
  width: 200px;
}
.content {
  position: absolute;
  min-height: 500px;
  top: 95px;
  bottom: 50px;
  left: 0;
  right: 0;
  padding: 0px 15px;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 5px;
  overflow: hidden;
  overflow-y: auto;
  overflow-x: auto;
  background-color: #fff;
  font-size: 13px;
  .msg {
    border-bottom: 1px dotted #ddd;
    padding: 10px 0 20px 0;
    margin: 0;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
  p {
    &.filed-detail {
      margin: 0;
      padding: 0;
      padding-left: 15px;
      line-height: 30px;
    }
  }
  .el-switch {
    margin-top: -5px;
  }
}
.help {
  display: inline-block;
  margin-left: 10px;
  padding: 9px 12px;
  border-radius: 3px;
  font-size: 12px;
  line-height: 1;
  font-weight: 500;
  background-color: #409eff;
  color: #fff;
  text-align: center;
}
span {
  &.last-one {
    margin-left: 10px;
  }
}
.report-text-switch {
  margin-top: -4px;
  margin-right: 10px;
}
</style>

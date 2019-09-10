<template>
  <div class="add-event-item">
    <!--折叠面板头部-->
    <div class="collapse-item-header">
      <div class="collapse-item-header-event">
        <el-form :inline="true" :model="eventData">
          <el-form-item label="事件名">
            <el-input
              v-model="eventData.name"
              size="mini"
              placeholder="只允许英文和数字"
            ></el-input>
          </el-form-item>
          <el-form-item label="平台">
            <el-select
              v-model="eventData.platformList"
              multiple
              size="mini"
              collapse-tags
              placeholder="请选择所属平台"
            >
              <el-option
                v-for="item in availablePlatformList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="版本号">
            <el-input
              v-model="versionGloup.first"
              size="mini"
              class="number-input"
              @keyup.native="limitNumber('first')"
            ></el-input>
            <span>.</span>
            <el-input
              v-model="versionGloup.sec"
              size="mini"
              class="number-input"
              @keyup.native="limitNumber('sec')"
            ></el-input>
            <span>.</span>
            <el-input
              v-model="versionGloup.third"
              size="mini"
              class="number-input"
              @keyup.native="limitNumber('third')"
            ></el-input>
            <span class="waring">*只允许数字</span>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!--列表内容-->
    <div class="collapse-item-content">
      <!--事件描述-->
      <el-form :inline="true" :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item
          label="事件描述"
          style="margin-left: 10px"
          prop="description"
        >
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="ruleForm.description"
            resize="none"
            class="event-desc"
          ></el-input>
        </el-form-item>
      </el-form>
      <!--属性列表-->
      <el-table
        :data="eventData.paramList"
        style="width:100%;"
        v-show="eventData.paramList.length > 0"
      >
        <el-table-column
          ref="multipleTable"
          prop="name"
          label="属性名称"
          width="150"
        >
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.name"
              placeholder="请输入内容"
              size="mini"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="isOptional" label="是否必填" width="100">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isOptional"
              active-color="#13ce66"
              inactive-color="#a4a4a4"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="platformLabel" label="所属平台">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.platformList"
              multiple
              placeholder="请选择所属平台"
              size="mini"
              collapse-tags
            >
              <el-option
                v-for="item in availableParamPlatList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="属性描述">
          <template slot-scope="scope">
            <el-input v-model="scope.row.description" size="mini"></el-input>
          </template>
        </el-table-column>
        <el-table-column width="50">
          <template slot-scope="scope">
            <el-button
              style="color: #8a8a8a;"
              type="text"
              size="mini"
              icon="el-icon-delete"
              @click="handleDelete(scope.$index, scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--添加属性-->
      <el-row>
        <el-col :span="24">
          <el-button type="text" @click="addProps">+ 添加属性</el-button>
          <div style="float: right; margin: 10px 10px 0 0;">
            <el-button type="primary" size="small" @click="addHandle"
              >确认</el-button
            >
            <el-button type="primary" size="small" @click="addCancel"
              >取消</el-button
            >
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import trackApi from "@/api/track.js";
import { checkingParam } from '@/utils/util.js'
export default {
  name: 'AddEventItem',
  data() {
    return {
      // 新增事件数据
      eventData: {
        name: '',
        paramList: [],
        platformList: [],
        projectId: 0,
        updateComment: '',
        version: ''
      },
      versionGloup: {
        first: 0,
        sec: 0,
        third: 0
      },
      // 所有可选的平台列表
      availablePlatformList: [
        { name: 'android', id: 1 },
        { name: 'ios', id: 2 },
        { name: 'javascript', id: 3 },
        { name: '微信小程序', id: 4 },
        { name: 'noSdk', id: 5 }
      ],
      // 事件选中的id列表
      platIdList: [],
      ruleForm: {
        description: ''
      },
      rules: {
        description: [
          { required: true, message: '请输入事件描述', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    // 参数可选的平台列表
    availableParamPlatList() {
      return this.availablePlatformList.filter(item => {
        return this.eventData.platformList.includes(item.id)
      })
    },
    projectId() {
      return this.$route.params.projectId / 1
    }
  },
  methods: {
    // 事件-确认添加
    addHandle() {
      this.eventData.projectId = this.projectId
      this.eventData.description = this.ruleForm.description
      // 验证数据
      if (!this.checkingData(this.eventData)) {
        return
      }
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          if (!checkingParam(this.eventData.paramList, this)) {
            return
          }
          trackApi.addTrack(this.eventData)
            .then((res) => {
              console.log(res)
              this.$message.success('操作成功')
              this.$emit('cancelAdd')
              this.$emit('refreshTrackList')
            })
            .catch(err => {
              this.$message.error(err.message)
            })
        } else {
          return false
        }
      })
    },
    // 事件-取消添加
    addCancel() {
      this.$emit('cancelAdd')
    },
    // 验证头部信息
    checkingData(data) {
      // if (!data.name || data.name.length < 2) {
      //   this.$message.error('事件名称请输入2到15位字符')
      //   return false
      // }
      if (data.platformList.length === 0) {
        this.$message.error('请选择事件所属平台')
        return false
      }
      return true
    },
    // 属性-添加
    addProps() {
      this.eventData.paramList.push({
        name: '',
        isOptional: false,
        platformList: [], // 内层选中的id列表
        description: '',
        eventId: 0,
        id: 0,
        status: 0
      })
    },
    // 属性-删除行
    handleDelete(index, row) {
      let arr = this.eventData.paramList
      if (arr.length > 0) {
        this.eventData.paramList.splice(index, 1)
      }
    },
    // 限制输入
    limitName() {
      this.eventData.name = this.eventData.name.replace(/\W/g, '').substr(0, 15)
    },
    limitNumber(field) {
      this.versionGloup[field] = this.versionGloup[field].replace(/[^\d]/g, '')
      this.eventData.version =
        this.versionGloup.first +
        '.' +
        this.versionGloup.sec +
        '.' +
        this.versionGloup.third
    }
  },
  components: {},
  props: [],
  created () {
    
  }
}
</script>

<style scoped lang="scss">
.add-event-item {
  margin-bottom: 10px;
  width: 100%;
  background-color: white;
  /* 面板头部 */
  .collapse-item-header {
    background-color: #f0f2f5;
    height: 50px;
    /* 面板头部左侧信息 */
    .collapse-item-header-event {
      height: 100%;
      width: 100%;
      float: left;
      box-sizing: border-box;
      padding-top: 12px;
      margin: 0 20px;
    }
    /* 面板头部右侧操作 */
    .collapse-item-header-operation {
      height: 100%;
      float: right;
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
  }
  .collapse-item-content {
    padding-top: 15px;
  }
}
.event-desc {
  width: 380px;
}
.waring {
  color: #f56c6c;
}
.number-input {
  width: 28px;
}
</style>
<style>
.collapse-item-header-event .number-input input.el-input__inner {
  width: 28px;
  padding: 0;
  text-align: center;
}
</style>


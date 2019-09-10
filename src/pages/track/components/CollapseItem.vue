<template>
  <div class="collapse-item">
    <!--折叠面板头部-->
    <div class="collapse-item-header" @click="collapseHandler">
      <div class="collapse-item-header-event">
        <el-form :inline="true" :model="eventData" class="demo-form-inline">
          <el-form-item label="事件名:">
            <span class="autofix e-name">{{ eventData.name }}</span>
          </el-form-item>
          <el-form-item label="事件描述:">
            <span class="autofix e-desc">{{ eventDesc }}</span>
          </el-form-item>
          <el-form-item label="版本:">
            <span class="autofix e-platform">
              {{ eventData.version || '未填' }}
            </span>
          </el-form-item>
          <el-form-item label="更新时间">
            <span class="e-time">{{ eventData.update_at }}</span>
          </el-form-item>
          <el-form-item label="平台:">
            <span v-if="!isEdit">{{ platNameText || '微信小程序' }}</span>
            <el-select
              v-model="savePlatIdList"
              multiple
              size="mini"
              collapse-tags
              placeholder="所属平台"
              style="width:150px"
              v-else
            >
              <el-option
                v-for="item in availablePlatformList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="collapse-item-header-operation">
        <!--删除整项-->
        <el-button
          type="text"
          icon="el-icon-delete"
          style="font-size: 20px; color: #8a8a8a"
          @click.stop="delEventItem(eventData)"
        ></el-button>
        <el-button
          type="text"
          icon="el-icon-edit-outline"
          style="font-size: 20px; color: #8a8a8a"
          @click.stop="editItem"
        ></el-button>
        <i
          class="el-icon-arrow-down"
          style="font-size: 25px; color: #8a8a8a; margin: 0 10px;"
          :class="showContent ? 'rotate' : ''"
        ></i>
      </div>
    </div>
    <!--列表内容-->
    <el-collapse-transition>
      <div class="collapse-item-content" v-show="showContent">
        <!--事件描述-->
        <el-row class="base-info">
          <el-col :span="7">
            <span>创建时间: {{ eventData.create_at || '暂无' }}</span>
          </el-col>
          <el-col :span="6">
            <span>更新时间: {{ eventData.update_at || '暂无' }}</span>
          </el-col>
          <el-col :span="4" style="padding-left:10px">
            <span>创建人: {{ eventData.creator || '暂无' }}</span>
          </el-col>
          <el-col :span="5" style="padding-left:35px">
            <span>版本: {{ eventData.version || '未填' }}</span>
          </el-col>
        </el-row>
        <el-row class="base-info" style="margin-bottom:10px">
          <el-col :span="24">
            <span>所属平台: {{ platNameText || '未填' }}</span>
          </el-col>
        </el-row>

        <el-form :inline="true" :rules="rules" ref="ruleForm" :model="ruleForm">
          <el-form-item label="事件名: " style="margin-left:20px">
            <span>{{ eventData.name }}</span>
          </el-form-item>

          <el-form-item
            label="事件描述: "
            style="margin-left: 10px"
            prop="description"
          >
            <span v-show="!isEdit">{{ eventData.description }}</span>
            <el-input
              v-show="isEdit"
              placeholder="请输入内容"
              v-model="ruleForm.description"
              class="event-desc"
            ></el-input>
          </el-form-item>
          <el-form-item
            v-show="isEdit"
            label="修改理由: "
            style="margin-left: 10px"
            prop="updateComment"
          >
            <el-input
              placeholder="请输入内容"
              v-model="ruleForm.updateComment"
              class="event-desc"
              style="width:400px"
            ></el-input>
          </el-form-item>
        </el-form>
        <!--展示的数据列表-->
        <param-list
          :item-data="eventData.paramList"
          v-if="!isEdit"
          @refreshData="$emit('refreshData')"
        ></param-list>
        <!--编辑的数据列表-->
        <param-list-edit
          :item-data="saveData.paramList"
          :plat-id-list="savePlatIdList"
          v-else
        ></param-list-edit>
        <!--添加属性-->
        <div v-if="!isEdit && showAddItem">
          <add-param-item
            :add-param-list="addParamList"
            :plat-id-list="platIdList"
          ></add-param-item>
          <el-row style="text-align: center;">
            <el-button type="primary" size="mini" @click="sureAdd"
              >确定添加</el-button
            >
            <el-button type="primary" size="mini" @click="cancelAdd"
              >取消</el-button
            >
          </el-row>
        </div>
        <el-button type="text" v-if="!isEdit" @click="addParamsDirect"
          >+ 添加属性</el-button
        >
        <el-row v-else>
          <el-col :span="24">
            <!--编辑-->
            <el-button type="text" @click="addParamsItem">+ 添加属性</el-button>
            <div style="float: right; margin: 10px 10px 0 0;">
              <el-popover
                placement="top"
                width="300"
                v-model="showAddNewVersion">
                <p>请输入版本号:</p>
                <el-form>
                  <el-form-item label class="version-group">
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
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="cancelAddNew"
                    >取消</el-button
                  >
                  <el-button type="primary" size="mini" @click="doAddNewHandle"
                    >确定</el-button
                  >
                </div>
                <el-button
                  type="primary"
                  size="small"
                  style="margin-right: 10px"
                  slot="reference"
                  >生成新版本</el-button
                >
              </el-popover>
              <el-button type="primary" size="small" @click="editHandle"
                >确认</el-button
              >
              <el-button type="primary" size="small" @click="editCancel"
                >取消</el-button
              >
            </div>
          </el-col>
        </el-row>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
import ParamList from './ParamList.vue'
import ParamListEdit from './ParamListEdit.vue'
import AddParamItem from './AddParamItem.vue'
import trackApi from "@/api/track.js"
import { checkingParam } from '@/utils/util.js'
export default {
  name: 'CollapseTitle',
  data() {
    return {
      showContent: false,
      isEdit: false,
      showAddItem: false,
      saveData: {},
      platIdList: [],
      savePlatIdList: [],
      platNameText: '',
      editItemData: {},
      addParamList: [], // 添加参数项
      ruleForm: {
        description: '',
        updateComment: ''
      },
      rules: {
        description: [
          { required: true, message: '请输入事件描述', trigger: 'blur' }
        ],
        updateComment: [
          { required: true, message: '请输入修改理由', trigger: 'blur' }
        ]
      },
      showAddNewVersion: false,
      newVersion: '',
      versionGloup: {
        first: 0,
        sec: 0,
        third: 0
      }
    }
  },
  props: ['eventData', 'availablePlatformList'],
  computed: {
    eventDesc () {
      if (this.eventData.description.length >= 25) {
        return this.eventData.description.substr(0, 25) + '...'
      } else {
        return this.eventData.description
      }
    }
  },
  methods: {
    limitNumber(field) {
      this.versionGloup[field] = this.versionGloup[field].replace(/[^\d]/g, '')
    },
    initVersion() {
      let version = []
      console.log('version-------', this.eventData.version)
      if (!this.eventData.version) {
        version = [0, 0, 0]
      } else {
        version = this.eventData.version.split('.')
      }
      this.versionGloup = {
        first: version[0],
        sec: version[1],
        third: version[2]
      }
      console.log(' this.versionGloup------------', this.versionGloup)
    },
    cancelAddNew() {
      this.initVersion()
      this.showAddNewVersion = false
    },
    // 初始化平台id列表
    getPlatIdList() {
      this.platIdList = this.eventData.platformList.map(item => {
        return item.id
      })
      this.savePlatIdList = [...this.platIdList]
      this.platNameText = this.eventData.platformList
        .map(item => {
          return item.description
        })
        .join(',')
    },
    saveEventData() {
      this.saveData = JSON.parse(JSON.stringify(this.eventData))
      this.ruleForm.description = this.saveData.description
    },
    // 伸缩折叠面板
    collapseHandler() {
      this.showContent = !this.showContent
    },
    // 通过id查询name
    getPlatName(id) {
      let platName = ''
      this.availablePlatformList.forEach(item => {
        if (id === item.id) {
          platName = item.name
        }
      })
      return platName
    },
    // 编辑事件
    editItem() {
      this.isEdit = true
      this.showContent = true
      this.savePlatIdList = [...this.platIdList]
    },
    doAddNewHandle() {
      let params = JSON.parse(JSON.stringify(this.saveData))
      params.updateComment = this.ruleForm.updateComment
      params.description = this.ruleForm.description
      params.platformList = this.savePlatIdList
      params.version =
        this.versionGloup.first +
        '.' +
        this.versionGloup.sec +
        '.' +
        this.versionGloup.third
      if (!checkingParam(params.paramList, this)) {
        return
      }
      this.$emit('addNewHandle', this.eventData.id, params, this.editCancel)
    },
    // 编辑确认
    editHandle() {
      let params = JSON.parse(JSON.stringify(this.saveData))
      params.updateComment = this.ruleForm.updateComment
      params.description = this.ruleForm.description
      params.platformList = this.savePlatIdList
      if (!this.checkingData(params)) {
        return
      }
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          if (!checkingParam(params.paramList, this)) {
            return
          }
          this.$emit('editHandle', this.eventData.id, params, this.editCancel)
        } else {
          return false
        }
      })
    },
    // 验证头部信息
    checkingData(data) {
      if (data.platformList.length === 0) {
        this.$message.error('请选择事件所属平台')
        return false
      }
      return true
    },
    // 编辑取消
    editCancel() {
      this.isEdit = false
      this.saveEventData()
      this.ruleForm.updateComment = ''
      this.savePlatIdList = [...this.platIdList]
      this.showAddItem = false
      this.addParamList = []
      this.cancelAddNew()
    },
    // 删除整条事件
    delEventItem(track) {
      this.$emit('delEventItem', track)
    },
    // 编辑添加属性
    addParamsItem() {
      this.saveData.paramList.push({
        description: '',
        eventId: 0,
        id: 0,
        isOptional: false,
        name: '',
        platformList: [],
        paramPlatIdList: [],
        status: 0
      })
    },
    // 直接添加属性
    addParamsDirect() {
      this.showAddItem = true
      this.addParamList.push({
        name: '',
        isOptional: false,
        platformList: [],
        eventId: 0,
        status: 0,
        description: ''
      })
    },
    // 确认添加
    sureAdd() {
      this.addParamList.forEach(item => {
        item.eventId = this.eventData.id
        item.opt = item.isOptional
      })
      console.log(this.addParamList)
      if (!checkingParam(this.addParamList, this)) {
        return
      }
      trackApi.addPropItem(this.addParamList)
        .then((res) => {
          console.log(res)
          this.$message({ type: 'success', message: '添加成功!' })
          this.addParamList = []
          this.showAddItem = false
          this.$emit('refreshData')
          this.$forceUpdate()
        })
        .catch(({ data }) => {
          this.$message.error(data)
        })
    },
    // 取消添加
    cancelAdd() {
      this.addParamList = []
      this.showAddItem = false
    }
  },
  components: {
    ParamList,
    ParamListEdit,
    AddParamItem
  },
  created() {},
  mounted() {
    this.getPlatIdList()
    this.saveEventData()
    this.initVersion()
  },
  watch: {
    eventData() {
      this.saveEventData()
    }
  }
}
</script>

<style scoped lang="less">
.collapse-item {
  margin-bottom: 10px;
  width: 100%;
  background-color: white;
  min-width: 1050px;
  overflow-x: auto;
  /* 面板头部 */
  .collapse-item-header {
    background-color: #f0f2f5;
    height: 50px;
    overflow-y: hidden;
    /* 面板头部左侧信息 */
    .collapse-item-header-event {
      height: 100%;
      width: 85%;
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
      i {
        transition: all 0.5s;
      }
      .rotate {
        transform: rotate(-90deg);
      }
    }
  }
  .collapse-item-content {
    padding-top: 15px;
  }
  .event-desc {
    width: 200px;
  }
  .e-name {
    display: block;
    width: 195px;
    padding-right: 20px;
  }
  .e-desc {
    display: block;
    width: 300px;
  }
  .e-platform {
    display: block;
    width: 100px;
  }
  .e-time {
    display: block;
    width: 160px;
  }
  .base-info {
    margin-left: 20px;
    width: 985px;
    overflow: hidden;
    padding: 10px 0;
    color: #606266;
    font-size: 14px;
    border-bottom: 1px solid #ebeef5;
    &:last-child {
      margin-bottom: 10px;
    }
  }
}
</style>
<style>
.number-input {
  width: 28px;
}
.version-group .number-input input.el-input__inner {
  width: 28px;
  padding: 0;
  text-align: center;
}
</style>


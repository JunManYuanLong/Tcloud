<template>
  <div class="add-param-item">
    <!--添加列表-->
    <el-table :data="addParamList" :show-header="false" style="width: 100%">
      <el-table-column prop="name" label="" width="150">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.name"
            placeholder="请输入内容"
            size="mini"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="isOptional" label="" width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isOptional"
            active-color="#13ce66"
            inactive-color="#a4a4a4"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="platformLabel" label="">
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.platformList"
            multiple
            placeholder="请选择所属平台"
            size="mini"
            collapse-tags
          >
            <el-option
              v-for="item in availablePlatformList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="">
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
            @click="delItem(scope.$index, scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'AddParamItem',
  data() {
    return {
      availablePlatformList: [
        {
          id: '',
          name: ''
        }
      ]
    }
  },
  methods: {
    // 可选参数平台列表
    getAvailablePlatformList() {
      let allPlatformList = [
        { name: 'android', id: 1 },
        { name: 'ios', id: 2 },
        { name: 'javascript', id: 3 },
        { name: '微信小程序', id: 4 },
        { name: 'noSdk', id: 5 }
      ]
      this.availablePlatformList = allPlatformList.filter(item => {
        return this.platIdList.includes(item.id)
      })
    },
    delItem(index) {
      if (this.addParamList.length > 1) {
        this.addParamList.splice(index, 1)
      }
    }
  },
  mounted() {
    this.getAvailablePlatformList()
  },
  props: ['addParamList', 'platIdList'],
  watch: {
    platIdList() {
      this.getAvailablePlatformList()
    }
  }
}
</script>

<style scoped lang="less">
.add-param-item {
  margin-bottom: 10px;
}
</style>

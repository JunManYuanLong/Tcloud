<template>
  <div class="param-list-edit">
    <el-table :data="itemData" style="width: 100%">
      <el-table-column prop="name" label="属性名称" width="150">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.name"
            placeholder="请输入内容"
            size="mini"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="is_optional" label="是否必填" width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.is_optional"
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
              v-for="item in availablePlatformList"
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
            @click="editParamsDelete(scope.$index, scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'ParamListEdit',
  data() {
    return {
      tableData: [
        {
          name: 'aaaa',
          isOptional: '否',
          platformLabel: 'android',
          description: '描述描述描述'
        }
      ],
      availablePlatformList: [
        {
          id: '',
          name: ''
        }
      ]
    }
  },
  props: [
    'itemData',
    'platIdList' // 餐素选中的id列表
  ],
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
    // 删除参数行
    editParamsDelete(index) {
      if (this.itemData.length > 0) {
        this.itemData.splice(index, 1)
      }
    },
    // 将平台列表转化为可渲染数组
    formDataPlatList() {
      this.itemData.forEach(item => {
        let arr = item.platformList.map(item => {
          return item['id']
        })
        item.platformList = arr
      })
    }
  },
  mounted() {
    this.getAvailablePlatformList()
    this.formDataPlatList()
  },
  watch: {
    platIdList() {
      this.getAvailablePlatformList()
    }
  }
}
</script>

<style scoped>
.param-list-edit {
  padding-left: 10px;
}
</style>

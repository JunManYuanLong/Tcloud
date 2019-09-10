<template>
  <div class="param-list">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column
        prop="name"
        label="属性名称"
        width="150"
      ></el-table-column>
      <el-table-column
        prop="isOptionalText"
        label="是否必填"
        width="100"
      ></el-table-column>
      <el-table-column prop="platformLabel" label="所属平台"></el-table-column>
      <el-table-column prop="description" label="属性描述"></el-table-column>
      <el-table-column fixed="right" width="50">
        <template slot-scope="scope">
          <el-button
            style="color: #8a8a8a;"
            type="text"
            size="mini"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import trackApi from "@/api/track.js";
export default {
  name: 'ParamList',
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
        { name: 'android', id: 1 },
        { name: 'ios', id: 2 },
        { name: 'javascript', id: 3 },
        { name: '微信小程序', id: 4 },
        { name: 'noSdk', id: 5 }
      ]
    }
  },
  props: ['itemData'],
  methods: {
    // 渲染列表数据
    getTabelData() {
      this.tableData = this.itemData.map(item => {
        item.platformLabel =
          item.platformList
            .map(item => {
              return item.description
            })
            .join(',') || '未填'
        item.isOptionalText = item.is_optional ? '是' : '否'
        return item
      })
    },
    getPlatName(id) {
      let platName = ''
      this.availablePlatformList.forEach(item => {
        if (id === item.id) {
          platName = item.name
        }
      })
      return platName
    },
    handleDelete(row) {
      this.$confirm('确定删除该属性?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          trackApi.deletePropItem([{ id: row.id, status: -1 }])
            .then((res) => {
              console.log(res)
              this.$message({ type: 'success', message: '删除成功!' })
              this.$emit('refreshData') 
              this.$forceUpdate()
            })
            .catch((err) => {
              this.$message.error(err.message)
            }) 
        })
        .catch(() => {}) 
    }
  },
  mounted() {
    this.getTabelData()
  },
  watch: {
    itemData() {
      this.getTabelData()
    }
  }
}
</script>

<style scoped>
.param-list {
  padding-left: 10px;
}
</style>

<template>
  <div class="tag">
    <!--头部搜索-->
    <el-row>
      <el-col :span="24">
        <el-form ref="form" label-width="80px" :inline="true">
          <el-form-item label="标签名称">
            <el-input placeholder="请输入标签名" v-model="searchText" clearable></el-input>
          </el-form-item>
          <el-form-item label="类型">
            <el-select v-model="tag_type" clearable placeholder="请选择">
              <el-option
                v-for="item in typeList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="margin-left: 30px">
            <el-button type="primary" @click="createTagDialogVisible = true">新增标签</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!--列表区域-->
    <el-card class="card" shadow="never">
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="date"
          label="日期"
          width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="address"
          label="地址">
        </el-table-column>
      </el-table>
      <!--分页-->
      <div class="pagination">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next"
          :total="total">
        </el-pagination>
      </div>
    </el-card>
    <!--新增标签-->
    <el-dialog
      title="新增标签"
      :visible.sync="createTagDialogVisible"
      @close="closeCreateTagDialog"
      width="480px" :close-on-click-modal="false">
      <el-form label-width="80px" :model="createTagForm" :rules="rules" ref="createTagForm">
        <el-form-item label="标签名称" prop="title">
          <el-input v-model.trim="createTagForm.title" style="width: 350px"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model.trim="createTagForm.description" style="width: 350px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="closeCreateTagDialog">取 消</el-button>
          <el-button type="primary" @click="createVersion">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
  import tagApi from '@/api/tag.js'

  export default {
    name: "Tag",
    data () {
      return {
        searchText: '',
        tag_type: '',
        typeList: [
          {
            label: '任务',
            value: 'task'
          },
          {
            label: '需求',
            value: 'requirement'
          },
          {
            label: '缺陷',
            value: 'bug'
          }
        ],
        tableData: [{
          tag: '2016-05-02',
          description: '',
          tagType: '',
          id: ''
        }],
        currentPage: 1,
        total: 100,
        pageSize: 10,
        createTagDialogVisible: false,  // 新增tag对话框可见
        createTagForm: { // 新增tag的数据
          title: '',
          description: '',
          tag_type: ''
        },
        rules: {
          title: [
            {required: true, message: '请输入标签', trigger: 'blur'}
          ]
        },
      }
    },
    computed: {
      projectId () {
        return this.$route.params.projectId
      }
    },
    methods: {
      /*
        获取tag列表
      */
      getTagList() {
        let params = {
          tag: this.searchText,
          tag_type: this.tag_type,
          project_id: this.projectId,
          page_size: this.pageSize,
          page_num: this.currentPage
        }
        tagApi.getTag(params).then(res => {
          this.tagData = res.data.data
          console.log(this.tagData)
        })
      },
      /*
        切换tab分页，重新请求数据
      */
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.getTagList()
      },
      /*
        关闭或取消 Dialog
      */
      closeCreateTagDialog() {
        this.createTagDialogVisible = false
        this.createVersionForm.title = ''
        this.createVersionForm.description = ''
      },
      /*
        新增tag
      */
      createVersion() {
        this.$refs.createTagForm.validate(valid => {
          if (valid) {
            tagApi.addTag({
              tag: this.createTagForm.title,
              project_id: this.projectId,
              description: this.createTagForm.description,
              tag_type: 'task'
            }).then(res => {
              this.$message.success('添加标签成功')
              this.closeCreateTagDialog()
              this.getTagList()
            }).catch(err => {
              this.closeCreateTagDialog()
              this.$message.error('添加标签失败: ' + err.message)
            })
          }
        })
      }
    },
    created () {
      this.getTagList() // 初始化tag列表
    }
  }
</script>

<style scoped lang="scss">
  .tag {
    padding: 20px;

    .card {
      height: 580px;
      position: relative;

      .pagination {
        position: absolute;
        width: 100%;
        bottom: 20px;
        display: flex;
        justify-content: center;
      }
    }
  }
</style>

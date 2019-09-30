<template>
  <div class="tag">
    <!--头部搜索-->
    <el-row>
      <el-col :span="24">
        <el-button type="primary" @click="createTagDialogVisible = true">新增标签</el-button>
      </el-col>
    </el-row>
    <!--列表区域-->
      <a-table
        :rowKey="record => record.id"
        :dataSource="tagData"
        :loading="loading"
      >
        <a-table-column title="ID" data-index="id" width="90px" key="id"></a-table-column>
        <a-table-column title="标签名" data-index="tag" key="tag"></a-table-column>
        <a-table-column title="被引用数" data-index="reference_nums" key="reference_nums"></a-table-column>
        <a-table-column title="描述" data-index="description" key="description"></a-table-column>
        <a-table-column title="操作" width="90px"  key="action">
          <template slot-scope="text, record">
            <el-button
              type="danger"
              @click="deleteTag(record)"
            >删除</el-button>
          </template>
        </a-table-column>
      </a-table>
    <!--新增标签-->
    <el-dialog
      title="新增标签"
      :visible.sync="createTagDialogVisible"
      @close="closeCreateTagDialog"
      width="480px" :close-on-click-modal="false">
      <el-form label-width="80px" :model="createTagForm" :rules="rules" ref="createTagForm">
        <el-form-item label="标签名称" prop="tag">
          <el-input v-model.trim="createTagForm.tag" style="width: 350px"></el-input>
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
        loading:true,
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
        tagData:[],
        currentPage: 1,
        total: 100,
        pageSize: 10,
        createTagDialogVisible: false,  // 新增tag对话框可见
        createTagForm: { // 新增tag的数据
          tag: '',
          description: '',
        },
        rules: {
          tag: [
            {required: true, message: '请输入标签名称', trigger: 'blur'}
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
          project_id: this.projectId / 1
        }
        tagApi.getTag(params).then(res => {
          this.tagData = res.data.data
          this.loading = false
          console.log(this.tagData)
        },error=>{
          this.$message.error(error.message)
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
        // this.createVersionForm.title = ''
        // this.createVersionForm.description = ''
      },
      /*
        新增tag
      */
      createVersion() {
        this.$refs.createTagForm.validate(valid => {
          if (valid) {
            tagApi.addTag({
              tag: this.createTagForm.tag,
              project_id: this.projectId / 1,
              description: this.createTagForm.description
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
      },
      deleteTag(row){
        console.log(row)
         this.$confirm(`您确定要删除标签：${row.id}？`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            tagApi.delTag(row.id).then(res=>{
              this.$message.success('删除成功！')
              this.getTagList()
            },error=>{
              this.$message.error(error.message)
            })
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
  .ant-table-wrapper{
    margin-top: 10px;
  }
</style>

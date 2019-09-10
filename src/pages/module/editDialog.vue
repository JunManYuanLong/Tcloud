<template>
  <div class="q-detail">
    <el-dialog
        :title="titleText"
        :visible.sync="dialogVisible"
        width="648px"
        :before-close="handleClose" :close-on-click-modal="false">
        <div class="push-preview-content">
            <el-form :model="addData" :rules="rules" ref="addForm" label-width="100px" class="addForm">
            <el-form-item label="模块名：" prop="name">
              <el-input v-model.trim="addData.name"></el-input>
            </el-form-item>
            <el-form-item label="模块描述：" prop="description">
              <el-input v-model="addData.description"></el-input>
            </el-form-item>
        </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button @click="handleEdit">确定</el-button>
        </span>
      </el-dialog>
  </div>
</template>
<script>
import moduleApi from '@/api/module.js'
  export default{
    name: 'detail',
    props: ['moduleId','moduleParentId', 'isShow'],
    data() {
      return {
        dialogVisible: this.isShow,
        addData: {
         name:'',
         description: ''
        },
        rules: {
          name: [
            { required: true, message: '请填写模块名称', trigger: 'blur' }
          ]
        }
      }
    },
    computed:{
      titleText() {
        let text = "添加模块"
        if(this.moduleId){
          text= "修改模块"
        }
        return text
      },
      projectId(){
        return this.$route.params.projectId
      }
    },
     watch: {
        'isShow': function (cval) {
          this.dialogVisible = cval
        },
        'moduleId':{
          handler:function(cval){
            if(cval){
              this.getEditData(cval)
            }else{
              this.$refs.addForm.resetFields()
            }
          },
          deep:false
        }
      },
    methods:{
      handleClose () {
        this.$refs.addForm.resetFields()
        this.$emit('close')
      },
      handleEdit() {
          this.$refs.addForm.validate((valid) => {
          if (valid) {
            let params = Object.assign({project_id: parseInt(this.projectId)},this.addData)
            if(this.moduleId){
                moduleApi.editModule(this.moduleId,params).then( res => {
                  this.$message({
                     message: '模块修改成功！',
                     type: 'success'
                  })
                  this.$emit('refreshData')
                  this.$refs.addForm.resetFields()
                },error=>{
                  this.$message.error(error.message)
                })
              }else{
                if(this.moduleParentId){
                  params.parent_id = this.moduleParentId
                }
                moduleApi.addModule(params).then( res => {
                  this.$message({
                     message: '模块添加成功！',
                     type: 'success'
                  })
                  this.$emit('refreshData')
                  this.$refs.addForm.resetFields()
                },error=>{
                  this.$message.error(error.message)
                })
              }
              
          } else {
            this.$message.error('请填写相关字段！')
            return false;
          }
        })
      },
      getEditData(val) {
        moduleApi.getSingleModule({id: val}).then(res => {
          this.addData = res.data.data[0]
        })
      },
    },
    created(){
      console.log('parentid',this.moduleParentId)
    }
  }
</script>
<style lang="scss" scoped>
.q-crumb{
  padding:0 0 10px 0;
  display:flex;
  align-items:center;
  border-bottom:1px solid #ddd;
  margin-bottom:20px;
  .el-icon-tickets{
    display:block;
    margin-right:5px;
    color:#33c0fb;
    font-size:18px;
  }
  .el-breadcrumb{
    font-size:16px;
  }
}
.q-opt{
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:20px;
  .q-search{
    width:200px;
  }
}
.permission-unit{
  display:inline-block;
  padding:0 10px;
  margin:0 5px;
  background-color:#b9dbff;
  border-radius:3px;
  color:#fff;
}
.detail-content{
 display:flex;
 label{
  display:block;
  width:120px;
 }
 ul{
  flex:1;
  display:flex;
  flex-wrap:wrap;
  li{
    margin:2px 5px;
  }
 }
}
</style>
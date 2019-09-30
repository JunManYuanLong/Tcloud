<template>
  <div class="q-detail">
    <el-dialog
        :title="titleText"
        :visible.sync="dialogVisible"
        width="648px"
        :before-close="handleClose" :close-on-click-modal="false">
        <div class="push-preview-content">
            <el-form :model="addData" :rules="rules" ref="addForm" label-width="120px" class="addForm">
            <el-form-item label="项目名称：" prop="name">
              <el-input v-model.trim="addData.name"></el-input>
            </el-form-item>
            <el-form-item label="项目描述：" prop="description">
              <el-input v-model="addData.description" type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="图片附件：" >
              <imageUpload  v-if="ossData.hasOwnProperty('host')" :ossData="ossData"  :showModal="false" v-model="taskResult.image"></imageUpload>
            </el-form-item>
            <el-form-item label="项目权重：" prop="weight" v-if="projectId">
              <el-input v-model.number="addData.weight"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button @click="hangleEdit">确定</el-button>
        </span>
      </el-dialog>
  </div>
</template>
<script>
import projectApi from '@/api/project.js'
import imageUpload from '@/pages/index/imageUpload'
import ossApi from '@/api/oss.js'

  export default{
    name: 'detail',
    props: ['projectId', 'isShow'],
    data() {
      return {
        dialogVisible: this.isShow,
        addData: {
         name:'',
         code: '',
         line:'',
         ptype:'',
         description: '',
         weight: '',
				 logo: [],
        },
        rules: {
          name: [
            { required: true, message: '请填写项目名称', trigger: 'change' }
          ],
          weight: [
            { required: true, type: 'number', min: 1, max: 99, message: '请填写正确的权重信息', trigger: 'change' }
          ]
        },
        taskResult:{
          image:'',
          files:[]
        },
      }
    },
    components:{
      imageUpload,
    },
    computed:{
      titleText() {
        let text = "添加项目"
        if(this.projectId){
          text= "修改项目"
        }
        return text
      },
      ossData(){
        return this.$store.state.project.ossData
      },
    },
     watch: {
        'isShow': function (cval) {
          this.dialogVisible = cval
        },
        'projectId':{
          handler:function(cval){
            if(cval){
                this.getEditData(cval)
            }else{
              this.$refs.addForm.resetFields()
            }
          },
          deep:true
        }
      },
    methods:{
      getDataDetail(id) {
        API.getUserUnot({userid:id}).then(res => {
          if(res.data.code == 200){
            this.detailData = res.data.data.units
          }
        })
      },
      handleClose () {
        this.$refs.addForm.resetFields()
        this.$emit('close')
				this.taskResult.image = ''

      },
      hangleEdit() {
          this.$refs.addForm.validate((valid) => {
          if (valid) {
            if(this.projectId){
							  this.addData['logo']= this.taskResult.image
                let params = Object.assign({},this.addData)
                params.weight = parseInt(params.weight)
                projectApi.editProject(this.projectId,params).then( res => {
                  this.$message({
                     message: '项目修改成功！',
                     type: 'success'
                  })
                  this.$emit('refreshData')
                  this.$refs.addForm.resetFields()
									this.taskResult.image = ''
                },error=>{
                  this.$message.error(error.message)
                })
              }else{
								this.addData['logo']= this.taskResult.image          
                let params = Object.assign({},this.addData)
                params.weight = parseInt(params.weight)
								
                projectApi.addProject(params).then( res => {
                  this.$message({
                     message: '项目添加成功！',
                     type: 'success'
                  })
                  this.$emit('refreshData')
                  this.$refs.addForm.resetFields()
									this.taskResult.image = ''
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
      getEditData() {
        projectApi.getSingleProject({id: this.projectId}).then(res => {
					let editData = res.data.data[0]
          this.addData = editData
					this.taskResult.image = editData.logo
					
        })
      },
    },
    created(){
      if(this.projectId){
        this.getEditData()
      }

    }
  }
</script>
<style lang="scss">
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

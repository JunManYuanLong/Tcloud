<template>
  <div class="common-right-content task-edit">
      <div class="q-crumb">
        <i class="q-icon fa fa-tasks"></i>
        <span>{{crumbText}}任务</span>
      </div>
      <el-card class="box-card">
        <el-form :model="addData" :rules="rules" ref="addForm" label-width="100px" class="addForm">
            <el-form-item label="任务名：" prop="name">
              <el-input v-model="addData.name"></el-input>
            </el-form-item>
            <el-form-item label="任务方法：" prop="tmethod">
              <el-select v-model="addData.tmethod" placeholder="请选择">
                <el-option
                  v-for="item in taskMthod"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="任务类型：" prop="ttype">
              <el-select v-model="addData.ttype" placeholder="请选择">
                <el-option
                  v-for="item in taskType"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="状态：">
              <el-switch
                v-model="taskStatus"
                active-text="开启"
                inactive-text="关闭">
              </el-switch>
            </el-form-item>
            <el-form-item label="案列列表：" prop="case_list">
              <span v-for="item in addData.case_list" :key="item">{{item}},</span>
              <el-button size="small" @click="showCaseDialog(true)" icon="el-icon-circle-plus-outline">{{addData.case_list&&addData.case_list.length>0?'继续选择':'请选择'}}</el-button></li>
            </el-form-item>
            <el-form-item label="优先级：" prop="priority">
              <el-select v-model="addData.priority" placeholder="请选择">
                <el-option
                  v-for="item in priorityData"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="任务执行人：" prop="executor">
              <el-select v-model="addData.executor" filterable  placeholder="请选择">
                <el-option
                  v-for="item in userList"
                  :key="item.userid"
                  :label="item.username"
                  :value="item.userid">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="开始时间：" prop="start_date">
              <el-date-picker  type="date" v-model="addData.start_date" :picker-options="startDatepicker"></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间：" prop="end_date">
              <el-date-picker  type="date" v-model="addData.end_date" :picker-options="endDatepicker"></el-date-picker>
            </el-form-item>
            <el-form-item label="任务描述：" prop="description">
              <el-input v-model="addData.description" type="textarea"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button @click="cancelFun">取消</el-button>
              <el-button type="primary" @click="sureFun">确定</el-button>
            </el-form-item>
        </el-form>
      </el-card>
      <caseDialog :isShow="dialogVisible"  @close="showCaseDialog(false)" @caseSelect="caseSelectFun"></caseDialog>
    </div>
</template>
<script>
import taskApi from '@/api/task.js'
import userApi from '@/api/user.js'
import projectApi from '@/api/project.js'
import caseApi from '@/api/case.js'
import caseDialog from '@/components/caseDialog.vue'
  export default{
    data() {
      return {
        addData: {
         description:'',
         tmethod: '',
         ttype:'',
         status:'',
         executor: '',
         priority:0,
         case_list: [],
         name: '',
         project_id: '',
         start_date: "",
         end_date: "",
         version: '',
        },
        taskMthod:['人工测试','自动化测试'],
        taskType:['功能测试','兼容性测试','冒烟测试','接口测试','新功能测试','改进优化测试','报表测试','发布测试'],
        priorityData: [
        {value: 0,
          label: "紧急"}, {
            value:1,
            label:"高"
          }, {
            value:2,
            label:'中'
          },{
            value:3,
            label:'低价'
          }],
        rules: {
          name: [
            { required: true, message: '请填写任务名称', trigger: 'blur' }
          ]
        },
        taskStatus: true,
        permissionData:[{
          value: 1,
          label: '只读'      
        },{
          value: 2,
          label: '写入'
        }],
        projectList: [],
        caseList: [],
        dialogVisible:false
      }
    },
    components:{
      caseDialog 
    },
    watch:{
      taskStatus(val){
        if(val){
          this.addData.status = 1
        }else{
          this.addData.status = 0
        }
      }
    },
    computed:{
      startDatepicker () {
        return {
            disabledDate (time) {
              return time.getTime() < Date.now() - 8.64e7
            }
          }
      },
      endDatepicker () {
        let _this = this
          if(this.addData.start_date){
            return {
              disabledDate (time) {
                return time.getTime() < new Date(_this.addData.start_date)
              }
            }
          }else{
            return{
              disabledDate (time) {
                return time.getTime() < Date.now() - 8.64e7
              }
            }
            
          }
      },
      taskId() {
        return this.$route.params && this.$route.params.taskId? this.$route.params.taskId : ''
      },
      projectId(){
        return this.$route.params.projectId
      },
      crumbText() {
        let text = "新增"
        if(this.taskId){
          text = "编辑"
        }
        return text
      },
      userId(){
        return this.$store.state.login.userid
      },
      version(){
        return this.$route.params.versionId
      },
      userList(){
        return this.$store.state.project.userList
      },
    },
    methods: {
      cancelFun () {
        this.$router.push({
          name:'taskAndIssue',
          params:{
            versionId: this.version
          }
        })
      },
      sureFun () {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            let params = Object.assign({},this.addData)
                params.project_id = parseInt(this.projectId)
                params.version = parseInt(this.version)
                params.creator = this.userId
            if(this.taskId){
                taskApi.editTask(this.taskId,params).then( res => {
                  this.$message({
                     message: 'task修改成功！',
                     type: 'success'
                  })
                  this.$router.push({
                    name:'taskAndIssue',
                    params:{
                      versionId: this.version
                    }
                  })
                })
            }else{
                taskApi.addTask(params).then( res => {
                  this.$message({
                     message: 'task添加成功！',
                     type: 'success'
                  })
                  this.$router.push({
                    name:'taskAndIssue',
                    params:{
                      versionId: this.version
                    }
                  })
                })
            }
          } else {
            this.$message.error('请填写相关字段！')
            return false;
          }
        })
      },
      getEditData() {
        taskApi.getSingleTask({id: this.taskId}).then(res => {
          this.addData = res.data.data[0]
          if(this.addData.executor){
            this.addData.executor = this.addData.executor[0]?this.addData.executor[0].id:''
          }
          this.taskStatus = Boolean(this.addData.status)
        })
      },
      getCaseList() {
        caseApi.getCaseList().then(res => {
          this.caseList = res.data.data
        })
      },
      showCaseDialog(val){
        this.dialogVisible = val
      },
      caseSelectFun(val){
        this.addData.case_list = val
        this.showCaseDialog(false)
      }
    },
    created() {
      if(this.taskId){
        this.getEditData()
      }
      //初始化一些列表数据
      this.getCaseList()
    }
  }
</script>
<style lang="scss" scoped>
.el-card__header{
  text-align:left;
}
.addForm{
  .el-input{
    width:300px;
  }
  .el-form-item__content{
    text-align:left;
  }
  .el-textarea__inner{
    width:300px;
  }
}
</style>
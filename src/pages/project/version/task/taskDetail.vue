<template>
  <div class="TaskDetail">
    <!--<div class="common-right-content task-edit">-->
    <div class="q-crumb">
      <i class="q-icon fa fa-tasks"></i>
      <span>{{crumbText}}任务</span>
    </div>
    <el-card class="box-card">
      <el-form :model="addData" :rules="rules" ref="addForm" labelWidth="120px" class="addForm">
        <el-form-item label="任务名：" prop="name">
          <el-input v-model="addData.name"></el-input>
        </el-form-item>
        <el-form-item label="任务方法：" prop="tmethod">
          <el-radio-group v-model="addData.tmethod">
            <el-radio-button label="自动化测试"></el-radio-button>
            <el-radio-button label="人工测试"></el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="任务类型：" prop="ttype">
          <el-radio-group v-model="addData.ttype">
            <el-radio-button label="功能测试"></el-radio-button>
            <el-radio-button label="兼容性测试"></el-radio-button>
            <el-radio-button label="冒烟测试"></el-radio-button>
            <el-radio-button label="接口测试"></el-radio-button>
            <el-radio-button label="新功能测试"></el-radio-button>
            <el-radio-button label="改进优化测试"></el-radio-button>
            <el-radio-button label="报表测试"></el-radio-button>
            <el-radio-button label="发布测试"></el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="案列列表：" prop="case_list">
          <span v-for="item in addData.case_list" :key="item">{{item}},</span>
          <el-button size="small" @click="showCaseDialog(true)" icon="el-icon-circle-plus-outline">
            {{addData.case_list && addData.case_list.length > 0 ? '继续选择' : '请选择'}}
          </el-button>
        </el-form-item>
        <el-form-item label="优先级：" prop="priority">
          <el-select v-model="addData.priority" placeholder="请选择">
            <el-option
            v-for="(val,key) in taskSet.priority"
            :key="key"
            :label="val"
            :value="parseInt(key)">
          </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务执行人：" prop="executor">
          <el-select v-model="addData.executor" filterable placeholder="请选择">
            <el-option
              v-for="item in userList"
              :key="item.userid"
              :label="item.username"
              :value="item.userid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="起止时间：" prop="duration_time">
          <el-date-picker
            v-model="addData.duration_time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="任务描述：" prop="description">
          <el-input v-model="addData.description" type="textarea" :rows="4"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button @click="cancelFun">取消</el-button>
          <el-button type="primary" @click="sureFun">确定</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <caseDialog :isShow="dialogVisible" @close="showCaseDialog(false)" @caseSelect="caseSelectFun"></caseDialog>
  </div>
</template>
<script>
  import moment from 'moment'
  import taskApi from '@/api/task.js'
  import userApi from '@/api/user.js'
  import caseApi from '@/api/case.js'
  import setApi from '@/api/settingType.js'
  import caseDialog from '@/components/caseDialog.vue'
  export default{
    name: 'TaskDetail',
    components: {
      caseDialog
    },
    data() {
      return {
        addData: {
          description: '',
          tmethod: '',
          ttype: '',
          status: '',
          executor: '',
          priority: 2,
          case_list: [],
          name: '',
          project_id: '',
          duration_time: [],
          version: '',
        },
        rules: {
          name: [
            {required: true, message: '请填写任务名称', trigger: 'change'}
          ],
          tmethod: [
            {required: true, message: '请选择任务方法', trigger: 'change'}
          ],
          ttype: [
            {required: true, message: '请选择类型', trigger: 'change'}
          ],
          priority: [
            {required: true, message: '请选择优先级', trigger: 'change'}
          ],
          executor: [
            {required: true, type: 'number', message: '请选择处理人', trigger: 'change'}
          ],
          duration_time: [
            {required: true, message: '请选择起止时间', trigger: 'change'}
          ]
        },
        taskStatus: true,
        projectList: [],
        caseList: [],
        dialogVisible: false
      }
    },
    watch: {
      taskStatus(val){
        if (val) {
          this.addData.status = 1
        } else {
          this.addData.status = 0
        }
      }
    },
    computed: {
      taskId() {
        return this.$route.params && this.$route.params.taskId ? this.$route.params.taskId : ''
      },
      projectId(){
        return this.$route.params.projectId
      },
      crumbText() {
        let text = "新增"
        if (this.taskId) {
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
      taskSet() {
        return this.$store.state.project.settings.task_config;
      },
    },
    methods: {
      cancelFun () {
        this.$router.push({
          name: 'versionDetail',
          params: {
            versionId: this.version
          }
        })
      },
      sureFun () {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            let params = Object.assign({}, this.addData)
            params.project_id = parseInt(this.projectId)
            params.version = parseInt(this.version)
            params.creator = this.userId
            params.start_time = params.duration_time.length > 1 ? moment(params.duration_time[0]).format("YYYY-MM-DD") : ''
            params.end_time = params.duration_time.length > 1 ? moment(params.duration_time[1]).format("YYYY-MM-DD") : ''
            delete params.duration_time
            if (this.taskId) {
              taskApi.editTask(this.taskId, params).then(res => {
                this.$message({
                  message: 'task修改成功！',
                  type: 'success'
                })
                this.$router.push({
                  name: 'versionDetail',
                  params: {
                    versionId: this.version
                  }
                })
              })
            } else {
              taskApi.addTask(params).then(res => {
                this.$message({
                  message: 'task添加成功！',
                  type: 'success'
                })
                this.$router.push({
                  name: 'versionDetail',
                  params: {
                    versionId: this.version
                  }
                })
              })
            }
          }
        })
      },
      getEditData() {
        taskApi.getSingleTask({id: this.taskId}).then(res => {
          this.addData = res.data.data[0]
          let start_time = moment(res.data.data[0].start_time).format("YYYY-MM-DD")
          let end_time = moment(res.data.data[0].end_time).format("YYYY-MM-DD")
          this.addData.duration_time = [start_time, end_time]
          if (this.addData.executor) {
            this.addData.executor = this.addData.executor[0] ? this.addData.executor[0].id : ''
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
      },
    },
    created() {
      if (this.taskId) {
        this.getEditData()
      }
      //初始化一些列表数据
      this.getCaseList()
    }
  }
</script>
<style lang="scss" scoped>
  .el-card__header {
    text-align: left;
  }

  .addForm {
    .el-input {
      width: 350px;
    }
    .el-form-item__content {
      text-align: left;
    }
    .el-textarea__inner {
      width: 350px;
    }
  }
</style>

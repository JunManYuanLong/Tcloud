<template>
  <div class="TaskCase" :style="{height:winHeight+'px','margin-left': versionPanelVisible ? '240px' : '0px'}">
    <el-breadcrumb separator="/" class="taskcaseCrumb">
      <el-breadcrumb-item class="title_name">
        <icon-font iconClass="dakaisanshu" @click.native="toggleSide"></icon-font>
      </el-breadcrumb-item>
      <el-breadcrumb-item class="title_name">
        <span>{{curProject.name}}</span>
      </el-breadcrumb-item>
      <el-breadcrumb-item v-if="versionId == 'all'" class="title_name" :to="{ name:'versionDetail',params:{versionId:versionId}}">
        <span>
        所有任务
        </span>
      </el-breadcrumb-item>
      <el-breadcrumb-item v-if="versionId !== 'all'" class="title_name" :to="{ name:'versionDetail',params:{versionId:versionId}}">
        <span>
        {{version.title}}
        </span>
      </el-breadcrumb-item>
      <el-breadcrumb-item class="title_name">
        <span>
        任务用例
        </span>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <el-button class="add-issue-btn" type="primary" @click="handleIssueDialog(true)" v-if="">添加issue</el-button>
    <!-- <pDataTable :loading="loading" cssStyle="width:100%;text-align:left;" :data="data" ref="dataTable">
      <template  slot="head-button">
        <el-button type="primary" @click="handleIssueDialog(true)">添加issue</el-button>
      </template>
      <template slot="el-table-column">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-form label-position="top">
              <el-form-item label="【前置条件】：">
                <span class="taskcase_content">{{ scope.row.precondition }}</span>
              </el-form-item>
              <el-form-item label="【测试步骤】：">
                <div class="taskcase_content" v-for="(item, index) in JSON.parse(scope.row.step_result).step_result">
                  <div>步骤{{ index + 1}}.</div>
                  <div>操作步骤：{{item.step}}</div>
                  <div>预期结果：{{item.expect}}</div>
                </div>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="cnumber" label="用例编号" width="80">
        </el-table-column>
        <el-table-column prop="ctype" label="用例类型" width="140">
          <template slot-scope="scope">
            {{getCaseType(scope.row.ctype)}}
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="operation" label="用例状态" width="140">
          <template slot-scope="scope">
            <span class="taskcaseResult" @click="handleCaseDialog(scope.row)">{{getTaskCaseStatus(scope.row.status)}}<i class="el-icon-edit"></i></span>
            <el-dropdown split-button :type="getTaskCaseStatusType(scope.row.status)">
              {{getTaskCaseStatus(scope.row.status)}}
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <el-button type="success" @click="handleSuccess(scope.row)">成功</el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button type="danger" @click="handleFailure(scope.row)">失败</el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button type="info" @click="handleSkip(scope.row)">跳过</el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </template>
    </pDataTable> -->
    <div class="option-bar">
      <div class="search">
        <div>测试结果：</div>
        <el-select v-model="searchData.status" placeholder="请选择" clearable multiple @change="filterData">
                <el-option
                  v-for="item in caseStatus"
                  :key="item.status"
                  :label="item.text"
                  :value="item.status">
                </el-option>
              </el-select>
              <div>处理人：</div>
        <el-select v-model="searchData.handler" filterable placeholder="请选择" clearable multiple  @change="filterData">
          <el-option
            v-for="item in userList"
            :key="item.userid"
            :label="item.nickname"
            :value="item.userid">
          </el-option>
        </el-select>
        <div>优先级：</div>
        <el-select v-model="searchData.priority" placeholder="请选择" clearable multiple  @change="filterData">
          <el-option
            v-for="(val,key) in taskSet.priority"
            :key="key"
            :label="val"
            :value="parseInt(key)">
          </el-option>
        </el-select>
        <el-input
          placeholder="请输入case的title"
          v-model="searchData.title" class="m-search" clearable  @change="filterData">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </div>
      <div class="opt" :class="{disabled:selectedCase.length==0}">
        <template v-if="selectedCase.length>0">
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            <i class="priority-icon"></i><span>优先级</span><i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown" class="case-priority-list">
            <el-dropdown-item v-for="(val,key) in taskSet.priority" :key="key"><div @click="taskcasePriority(key,1)">{{val}}</div></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown trigger="click" class='user-dropdown' @visible-change="dropdownChange">
                <span class="el-dropdown-link">
                  <i class="user-icon"></i><span>分配给</span><i class="el-icon-arrow-down el-icon--right" ></i>
                </span>
                <el-dropdown-menu slot="dropdown" class="case-dropdown-wrap">
                  <div class="users">
                    <el-input
                      placeholder="搜索"
                      v-model="multipleSearchUser" class="m-search" clearable>
                      <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    </el-input>
                      <el-dropdown-item v-for="item in multipleUserList" :key="item.userid" ><div  @click="taskcaseAssign(item.userid,1)" >
                      {{item.nickname}}</div>
                      </el-dropdown-item>
                  </div>
                </el-dropdown-menu>
              </el-dropdown>
        </template>
        <template v-else>
          <span class="el-dropdown-link mr-25">
            <i class="priority-icon"></i><span>优先级</span><i class="el-icon--seat"></i>
          </span>
          <span class="el-dropdown-link">
            <i class="user-icon"></i><span>分配给</span><i class="el-icon--seat"></i>
          </span>
        </template>
      </div>
    </div>
    <div class="modules-w" v-for="(item,index) in taskCaseList" :key="index">
      <div class="module-bar">
        <div class="info">
          <span class="expend-btn"  @click="handlerOpen(index)" :class="{open:item.isOpen}"></span>
          <el-checkbox :indeterminate="item.isIndeterminate" v-model="item.isCheckAll"  @change="handleCheckAllChange(item.isCheckAll,index)"></el-checkbox>
          <img src="../../../../assets/img/module.png" alt="">
          <span class="module-name">{{item.module_name}}</span>
          <span class="module-count">{{item.info.length}}</span>
        </div>
        <div class="ctr-wrap">
          <span class="m-title-1">优先级</span>
          <span class="m-title-2">分配给</span>
          <span class="m-title-3">测试结果</span>
        </div>
      </div>
      <div class="task-case-list" v-show="item.isOpen" >
        <el-checkbox-group v-model="item.checkCases" @change="handleCheckCaseChange(item.checkCases,index)">
          <div class="case-item" v-for = "(subItem,subIndex) in item.info" :key="subItem.taskcaseid">
            <div class="checkbox">
              <el-checkbox :key="subItem.taskcaseid" :label="subItem.taskcaseid"></el-checkbox><el-tooltip class="item" effect="dark" content="点击查看详情" placement="top-start"><strong class="view-link" @click="viewCaseDetail(subItem,subIndex,item.info)"><span class="case-number">{{subItem.cnumber}}</span><span class="case-name">{{subItem.title}}</span></strong></el-tooltip>
            </div>
            <div class="ctr-wrap">
              <div class="ctr-1">
                <el-dropdown  trigger="click">
                  <span class="el-dropdown-link">
                    <span :class="'priority-'+ getCasePriorityType(subItem.priority)">{{taskSet.priority[subItem.priority]?taskSet.priority[subItem.priority]:'无'}}</span><i class="el-icon-arrow-down el-icon--right"></i>
                  </span> 
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="(val,key) in taskSet.priority" :key="key"><div @click="taskcasePriority(key,2,subItem.taskcaseid)">{{val}}</div></el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
              <div class="ctr-2">
                <el-dropdown   trigger="click" @visible-change="dropdownChange">
                  <span class="el-dropdown-link">
                    <span>{{subItem.handler_name?subItem.handler_name:'无'}}</span><i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown" class="case-dropdown-wrap">
                  <div class="users">
                    <el-input
                      placeholder="搜索"
                      v-model="singleSearchUser" class="m-search" clearable>
                      <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    </el-input>
                      <el-dropdown-item v-for="uitem in singleUserList" :key="uitem.userid" ><div  @click="taskcaseAssign(uitem.userid,2,subItem.taskcaseid)" >
                      {{uitem.nickname}}</div>
                      </el-dropdown-item>
                  </div>
                </el-dropdown-menu>
                </el-dropdown>
              </div>
              <div class="ctr-3">
                <el-dropdown  trigger="click">
                  <span class="el-dropdown-link">
                    <span :class="'title-'+getTaskCaseStatusType(subItem.status)">{{getTaskCaseStatus(subItem.status)}}</span><i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>
                      <el-button type="success" @click="handleSuccess(subItem)">成功</el-button>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-button type="danger" @click="handleFailure(subItem)">失败</el-button>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-button type="info" @click="handleSkip(subItem)">跳过</el-button>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-button type="primary" @click="handleCaseDialog(subItem)">备注</el-button>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                 </el-dropdown>
                </div>
            </div>
          </div>
        </el-checkbox-group>
      </div>
    </div>
    <el-dialog
      title="用例执行结果备注"
      :visible.sync="taskcaseResultDialog"
      width="30%" :close-on-click-modal="false">
      <div class="result-content">
        <!-- <ul>
          <li :class="{selected:taskcaseStatus == 1}" @click="checkCaseStatus(1)"><i class="el-icon-circle-check"></i>成功</li>
          <li :class="{selected:taskcaseStatus == 2}"  @click="checkCaseStatus(2)"><i class="el-icon-circle-close"></i>失败</li>
          <li :class="{selected:taskcaseStatus == 3}"  @click="checkCaseStatus(3)"><i class="el-icon-remove"></i>跳过</li>
          <li><i class="el-icon-warning"></i>其他</li>
        </ul> -->
        <el-input type="textarea" rows="5" v-model="taskcaseComment"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="taskcaseResultDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleTaskcaseComment">确 定</el-button>
      </span>
    </el-dialog>
    <addDialog :isShow="addDialogVisible" @close="handleIssueDialog(false)"></addDialog>
    <caseDetail v-model="showDetailDrawer" :caseData="caseDetailData" :moduleCases="moduleCases" :caseIndex="caseIndex">
      </caseDetail>
  </div>
</template>
<script>
  import moduleApi from '@/api/module.js'
  import taskApi from '@/api/task.js'
  import taskcaseApi from '@/api/taskcase.js'
  import userApi from '@/api/user.js'
  import setApi from '@/api/settingType.js'
  import addDialog from '@/pages/issue/add.vue'
  import  debounce  from "debounce"
  import caseDetail from './caseDetail.vue'
  export default{
    name: 'TaskCase',
    data() {
      return {
        winHeight: window.innerHeight - 70,
        loading: false,
        data: [],
        taskCaseList:[],
        taskcaseResultDialog: false,
        taskcaseId: '',
        addDialogVisible: false,
        taskcaseStatus: 0,
        searchUser:'',
        dropdownUserList:[],
        taskcaseData:[{
          'module-name':'module1',
          case:[{
            cnumber:'t20',
            cname:'发送'
          }]
        }],
        caseStatus:[{
          status:3,
          text:'成功'
        },{
          status:4,
          text:'失败'
        },{
          status:2,
          text:'跳过'
        }],
        searchData:{
          status:[],
          handler:[],
          priority:[],
          title:''
        },
        multipleSearchUser:'',
        singleSearchUser:'',
        selectedCase:[],
        taskcaseComment:'',
        showDetailDrawer:false,
        caseDetailData:{},
        caseIndex:'',
        moduleCases:[]
      }
    },
    components:{
      addDialog,
      caseDetail
    },
    computed: {
      versionPanelVisible () {
        return this.$store.state.version.visible
      },
      projectId () {
        return this.$route.params.projectId
      },
      taskId () {
        return this.$route.params.taskId
      },
      userList(){
        return this.$store.state.project.userList
      },
      multipleUserList() {
         let data = this.userList
        if(this.multipleSearchUser){
          data = data.filter(item => {
            if(item.nickname.includes(this.multipleSearchUser)){
              return item
            }
          })
        }
        return data
      },
      singleUserList(){
        let data = this.userList
        if(this.singleSearchUser){
          data = data.filter(item => {
            if(item.nickname.includes(this.singleSearchUser)){
              return item
            }
          })
        }
        return data
      },
      curProject(){
        return this.$store.state.project.currentProject
      },
      versionList(){
        return this.$store.state.project.versionList
      },
      versionId () {
        if(this.$route.params.versionId == 'all'){
          return 'all'
        }else{
          return parseInt(this.$route.params.versionId)
        }
      },
      version(){
        let v = {}
        let v1 = []
        if(this.versionList&&this.versionList.length>0){
          v1 =  this.versionList.filter(item=>{
            if(item.id == this.versionId){
              return item
            }
          })
          v = v1[0]
        }
        return v
      },
      taskSet() {
        return this.$store.state.project.settings.task_config;
      },
    },
    watch: {
      'searchData.title':{
        handler:function(){
          this.filterData()
        },
        deep:true
      }
    },
    beforeDestroy () {
      this.$store.commit('CHANGE_VISIBLE', true)
    },
    methods: {
      toggleSide () {
        this.$store.commit('TOGGLE_VISIBLE')
      },
      getTaskCaseStatus (status) {
        let text = '其他'
        switch (status) {
          case 0:
            text = '新增';
            break;
          case 1:
            text = '已删除';
            break;
          case 2:
            text = '跳过';
            break;
          case 3:
            text = '通过';
            break;
          case 4:
            text = '失败';
            break;
        }
        return text
      },
      getTaskCaseStatusType (status) {
        let text = ''
        switch (status) {
          case 0:
            text = 'primary';
            break;
          case 1:
            text = '';
            break;
          case 2:
            text = 'info';
            break;
          case 3:
            text = 'success';
            break;
          case 4:
            text = 'danger';
            break;
        }
        return text
      },
      getCasePriorityType(p){
        let type = 'normal'
        switch(p){
          case 0:
            type = 'hred'
            break
          case 1:
            type = 'red'
            break
          case 2:
            type = 'wraning'
            break
          case 3:
            type = 'normal'
            break
        }
        return type
      },
      getTaskCaseList() {
        this.loading = true
        console.log('=========gettaskcaselist',this.searchData.status)
        let params = {
          projectid:this.projectId,
          taskid:this.taskId,
          status:this.searchData.status.toString(),
          handler:this.searchData.handler.toString(),
          priority:this.searchData.priority.toString(),
          title:this.searchData.title
        }
        if(this.versionId !== 'all'){
          params.versionid = this.versionId 
        }
        taskcaseApi.searchTaskcaseList(params).then(res => {
          let tData = res.data.data
          if(tData.length&&tData.length>0){
            console.log('tasklist',this.taskCaseList)
            tData.forEach((item,index) =>{
              if(this.taskCaseList.length>0 && this.taskCaseList[index] && this.taskCaseList[index].hasOwnProperty('isOpen')){
                item.isOpen = this.taskCaseList[index].isOpen
              }else{
                if(index == 0){
                   item.isOpen = true
                 }else{
                  item.isOpen = false
                }
              }
              if(this.selectedCase.length>0){
                // item.isCheckAll = true
                item.checkCases = []
                
                item.info.forEach(sitem => {
                  if(this.selectedCase.includes(sitem.taskcaseid)){
                    item.checkCases.push(sitem.taskcaseid)
                  }
                })
                if(item.checkCases.length>0){
                  item.isCheckAll = true
                  if(item.checkCases.length!=item.info.length){
                    item.isIndeterminate = true
                  }else{
                    item.isIndeterminate = false
                  }
                }
              }else{
                item.isCheckAll = false
                item.isIndeterminate = false
                item.checkCases = []
              }
            })
          }
          this.taskCaseList = tData
          this.loading = false
        },error=>{
          this.$message.error(`获取失败: ${error.message}`)
          this.loading = false
        })
      },
      checkCaseStatus(type){
        this.taskcaseStatus = type
      },
      handleSuccess (row) {
        taskcaseApi.taskcaseSuccess(row.taskcaseid).then(res => {
          this.$message.success('操作成功')
          this.getTaskCaseList()
        }).catch(err => {
          this.$message.success(`操作失败${err.message}`)
        })
      },
      handleFailure (row) {
        taskcaseApi.taskcaseFailure(row.taskcaseid).then(res => {
          this.$message.success('操作成功')
          this.getTaskCaseList()
        }).catch(err => {
          this.$message.success(`操作失败${err.message}`)
        })
      },
      handleSkip (row) {
        taskcaseApi.taskcaseSkip(row.taskcaseid).then(res => {
          this.$message.success('操作成功')
          this.getTaskCaseList()
        }).catch(err => {
          this.$message.success(`操作失败${err.message}`)
        })
      },
      handleTaskcaseComment(){
        if(!this.taskcaseComment){
          this.$message.error('请填写备注！')
          return false
        }
          taskcaseApi.taskcaseComment({comment:this.taskcaseComment},this.taskcaseId).then(res => {
            this.$message.success('添加成功')
            this.taskcaseResultDialog = false
            this.getTaskCaseList() 
          }).catch(err => {
            this.$message.success(`添加失败${err.message}`)
          })
      },
      handleIssueDialog(val){
        this.addDialogVisible = val
      },
      handleCaseDialog(row){
        this.taskcaseResultDialog = true
        this.taskcaseId = row.taskcaseid
        this.taskcaseStatus = row.status
        this.taskcaseComment = row.comment
      },
      dropdownChange(val){
        if(!val){
          this.singleSearchUser = ''
          this.multipleSearchUser = ''
        }
      },
      handlerOpen(index){
        let open = !this.taskCaseList[index].isOpen
        this.$set(this.taskCaseList[index],'isOpen',open)
      },
      handleCheckAllChange(value,index){
        console.log('allchecked',value,index)
        if(value){
          let checkData = []
          this.taskCaseList[index].info.forEach(item=>{
            checkData.push(item.taskcaseid)
          })
          this.taskCaseList[index].checkCases = checkData
          
          
        }else{
          this.taskCaseList[index].checkCases = []
          
        }
        this.selectedCase = []
        this.taskCaseList.forEach(item => {
          this.selectedCase = this.selectedCase.concat(this.taskCaseList[index].checkCases)
        })
      },
      handleCheckCaseChange(value,index) {
        console.log('casechecked',value,index)
        if(value.length != 0){
          this.taskCaseList[index].isCheckAll = true
          if(this.taskCaseList[index].checkCases.length !=this.taskCaseList[index].info.length){
            this.taskCaseList[index].isIndeterminate = true
          }else{
            this.taskCaseList[index].isIndeterminate = false
            this.taskCaseList[index].isCheckAll = true
          }
        }else{
          this.taskCaseList[index].isCheckAll = false
          this.taskCaseList[index].isIndeterminate = false
        }
        this.selectedCase = []
        this.taskCaseList.forEach(item => {
          this.selectedCase = this.selectedCase.concat(this.taskCaseList[index].checkCases)
        })
      },
      taskcasePriority(value,type,id){
        //type 1 表示批量修改 2 表示单个修改
        let case_list = []
        if(type == 1){
          case_list = this.selectedCase
        }
        if(type == 2){
          case_list = [id]
        }
        taskcaseApi.taskcasePriority({'project_id':parseInt(this.projectId),'case_list':case_list,'priority':parseInt(value)}).then(res=>{
          this.$message.success('操作成功')
          this.getTaskCaseList()
        },error=>{
          this.$message.error(`操作失败: ${error.message}`)
        })
      },
      taskcaseAssign(value,type,id){
        //type 1 表示批量修改 2 表示单个修改
        let case_list = []
        if(type == 1){
          case_list = this.selectedCase
        }
        if(type == 2){
          case_list = [id]
        }
        taskcaseApi.taskcaseAssign({'project_id':parseInt(this.projectId),case_list:case_list,handler:value}).then(res=>{
          this.$message.success('操作成功')
          this.getTaskCaseList()
        },error=>{
          this.$message.success(`操作失败${error.message}`)
        })
      },
      filterData(value){
        console.log('filterchagne',value)
        // let _this = this
        // debounce(function(){
        //   _this.getTaskCaseList()
        // },500)
        this.getTaskCaseList()
      },
      viewCaseDetail(item,index,moduleCases){
        this.showDetailDrawer= true
        this.caseDetailData = item
        this.caseIndex = index
        this.moduleCases = moduleCases
      },
      $resize () {
        this.winHeight = window.innerHeight - 70
      }
    },
    mounted(){
      window.addEventListener('resize', this.$resize, true)
    },
    beforeDestroy(){
      window.removeEventListener("resize", this.$resize);
    },
    created(){
      this.getTaskCaseList()
    }
  }
</script>
<style lang="scss">
  .TaskCase {
    padding: 20px 0 0 20px;
    overflow:auto;
  }
  .taskcase_content {
    padding-left: 40px;
  }
  .title_name {
    span {
      font-weight: 800;
      color: black;
    }
  }
  .q-crumb {
    padding: 0 0 10px 0;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ddd;
    margin-bottom: 20px;
    .el-icon-tickets {
      display: block;
      margin-right: 5px;
      color: #33c0fb;
      font-size: 18px;
    }
    .el-breadcrumb {
      font-size: 16px;
    }
  }

  .q-opt {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    .q-search {
      width: 200px;
    }
  }

  .permission-unit {
    display: inline-block;
    padding: 0 10px;
    margin: 0 5px;
    background-color: #b9dbff;
    border-radius: 3px;
    color: #fff;
  }

  .detail-content {
    display: flex;
    label {
      display: block;
      width: 120px;
    }
    ul {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      li {
        margin: 2px 5px;
      }
    }
  }

  .case-wrap {
    max-height: 600px;
    overflow: auto;
  }

  ul.module {
    > li {
      margin-bottom: 10px;
      img {
        width: 25px;
        margin-right: 10px;
        vertical-align: middle;
      }
    }
  }

  ul.case {
    margin: 10px 0 10px 15px;
    span {
      margin: 2px 5px;
    }
  }

  .case {
    .el-checkbox + .el-checkbox {
      margin-left: 0;
    }
  }
  .taskcaseCrumb{
    margin-bottom:20px;
  }
  .result-content{
    ul{
      display:flex;
      margin-bottom:10px;
      li{
        width:80px;
        text-align:center;
        height:34px;
        line-height:34px;
        border:1px solid #ccc;
        border-radius:5px;
        margin-right:10px;
        cursor:pointer;
        &.selected,&:hover{
          background-color:#409eff;
          color:#fff;
          i{
            color:#fff!important;
          }
        }
        i{
          margin-right:5px;
          &.el-icon-circle-check{
            color:#67c23a;
          }
          &.el-icon-circle-close{
            color:#f56c6c;
          }
          &.el-icon-remove{
            color:#e6a23c;
          }
          &.el-icon-warning{
            color:#909399;
          }
        }
      }
    }
  }
  .option-bar{
    display:flex;
    align-items:center;
    justify-content:space-between;
    background:#f3f4f6;
    padding:10px;
    margin-bottom:8px;
    .search{
      display:flex;
      align-items:center;
      .el-select{
        margin-right:8px;
      }
      .m-search{
        width:200px;
      }
    }
    .opt{
      min-width: 210px;
      .el-dropdown{
        margin-right:10px;
        cursor:default;
        &:nth-of-type(1){
          margin-right:25px;
        }
        &:focus{
          outline:none;
        }
      }
      .el-dropdown-link{
        cursor:default;
        color: #606266;
        font-size: 14px;
        &.mr-25{
          margin-right:25px;
        }
      }
      .el-icon--seat{
        display:inline-block;
        width:24px;
      }
      .priority-icon{
        margin-right: 8px;
        display: inline-block;
        width: 16px;
        height: 16px;
        background: url(../../../../assets/img/priority.svg) center center / 14px no-repeat;
      }
      .user-icon{
          flex-shrink: 0;
          margin-right: 8px;
          display: inline-block;
          width: 16px;
          height: 16px;
          border-radius: 0px;
          background: url(../../../../assets/img/user.svg) center center / cover no-repeat;
      }
      &.disabled{
        .priority-icon{
          background-image: url(../../../../assets/img/priority-disable.svg);
        }
        .user-icon{
          background-image: url(../../../../assets/img/user-disable.svg);
        }
      }
    }
  }
  .modules-w{
    padding:0 20px 0 0;
    border-bottom: 3px solid #eee;
    .module-bar{
      display:flex;
      justify-content:space-between;
      padding:10px 20px;
      &:hover{
        background-color: rgba(16, 113, 211, 0.08);
      }
      .expend-btn{
        display: -webkit-inline-box;
        position: relative;
        width: 12px;
        height: 12px;
        cursor: pointer;
        flex: 0 0 12px;
        border-width: 1px;
        border-style: solid;
        border-color: rgb(201, 207, 215);
        border-image: initial;
        border-radius: 2px;
        transition: border-color 0.3s ease 0s;
        &:hover{
          border-color: rgb(16, 113, 211);
          &::before,&::after{
            background-color: rgb(16, 113, 211);
          }
        }
        &::before,&::after{
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          display: block;
          width: 6px;
          height: 2px;
          background-color: rgb(201, 207, 215);
          transform: translate(-50%, -50%);
        }
        &::before{
          transition: background-color 0.3s ease 0s;
        }
        &::after{
          transform: translate(-50%, -50%) rotate(-270deg);
          transition: background-color 0.3s ease 0s, transform 0.3s ease 0s;
        }
        &.open::after{
          transform: translate(-50%, -50%);
          transition: background-color 0.3s ease 0s, transform 0.3s ease 0s;
        }
      }
      .info{
        display:flex;
        align-items:center;
        .el-checkbox{
          margin-left:10px;
        }
        img{
          display: block;
          width: 16px;
          height: 16px;
          margin:0 10px;
          flex: 0 0 16px;
        }
        .module-count{
          min-width: 24px;
          font-weight: bold;
          font-size: 12px;
          height: 16px;
          line-height: 14px;
          color: rgb(255, 255, 255);
          margin-left: 8px;
          flex: 0 1 auto;
          padding: 0px 8px;
          background: rgb(212, 216, 222);
          border-radius: 8px;
        }
      }
      .ctr-wrap{
        display:flex;
        text-align:center;
        span{
          display:block;
          color: rgb(145, 153, 163);
        }
        .m-title-1{
          width:76px;
        }
        .m-title-2{
          width:114px;
        }
        .m-title-3{
          width:65px;
        }
      }
    }
  }
  .task-case-list{
    position:relative;
    &::before{
      content: "";
      position: absolute;
      display: block;
      top: 0px;
      left: 25px;
      width: 2px;
      height: 100%;
      background-color: rgb(247, 248, 250);
      transform: translateX(-50%);
      pointer-events: none;
      transition: background-color 0.3s ease 0s;
    }
  }
  .case-item{
    display:flex;
    align-items:center;
    justify-content:space-between;
    padding:10px 20px 10px 42px;
    &:hover{
      background-color: rgba(16, 113, 211, 0.08); 
    }
    .case-number{
      margin-left:8px;
    }
    .checkbox{
      display:flex;
      align-items:center;
      strong{
        display:flex;
      align-items:center;
      }
      .el-checkbox{
        display:flex;
        align-items:center;
      }
      .el-checkbox__label{
        display:none;
      }
    }
    .view-link{
      font-weight:400;
    }
    .case-name{
      margin-left:25px;
      color:#27A9E3;
      cursor:pointer;
    }
    .el-checkbox,.case-name{
      display:block;
    }
    .el-checkbox-group &{
      font-size:14px;
    }
    .ctr-wrap{
      display:flex;
      text-align:center;
      .title-success{
        color:#67c23a;
      }
      .title-info{
        color:#909399;
      }
      .title-danger{
        color:#f56c6c;
      }
      .priority-hred{
        color:#f70707;
      }
      .priority-red{
        color:#f56c6c;
      }
      .priority-wraning{
        color:#e6a23c;
      }
      .ctr-1{
          width:76px;
        }
        .ctr-2{
          width:114px;
        }
        .ctr-3{
          width:65px;
        }
    }
  }
  .case-dropdown-wrap{
    .users{
      max-height:200px;
      overflow:auto;
    }
  }
  .case-priority-list{
    width:80px;
  }
  .add-issue-btn{
    margin-bottom:8px;
  }
</style>

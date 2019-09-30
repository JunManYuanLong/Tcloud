<template>
  <div class="flow-list-wrap">
    <div class="filter-bar">
      <el-radio-group v-model="searchData.status">
        <el-radio-button label="1">全部</el-radio-button>
        <el-radio-button label="0">进行中</el-radio-button>
        <el-radio-button label="2">已完成</el-radio-button>
        <el-radio-button label="3">已终止</el-radio-button>
      </el-radio-group>
    <el-radio-group v-model="searchData.owner">
      <el-radio-button label="0">全部</el-radio-button>
      <el-radio-button label="1">与我相关</el-radio-button>
    </el-radio-group>
      <label>日期：</label>
      <el-date-picker
        v-model="date"
        type="daterange"
        align="right"
        format="yyyy-MM-dd"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions">
      </el-date-picker>
        <el-button class="export-btn" type="primary" plain @click="exportFlowFun">流程导出</el-button>
        <!-- <router-link class="flow-statistics" :to="{name:'flowStatistics'}"><i class="fa  fa-line-chart"></i>流程统计</router-link> -->
    </div>
    <div class="search-bar">
      <el-input
          placeholder="请输入标题或ID关键字"
          v-model="searchData.title" class="m-search" clearable  @change="filterData" clearable>
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      <el-select v-model="searchData.flow_type" multiple filterable placeholder="请选择流程类型" clearable class="select-more">
          <el-option
            v-for="(val,key) in flowSet.type"
            :key="key"
            :label="val"
            :value="parseInt(key)">
          </el-option>
        </el-select>
        <el-select v-model="searchData.flow_assemble_id" multiple filterable placeholder="请选择流程" clearable class="select-more">
          <el-option
            v-for="item in flowSteps"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <el-select v-model="searchData.platform" filterable placeholder="请选择涉及端" clearable>
          <el-option
            v-for="(val,key) in flowSet.platform"
            :key="key"
            :label="val"
            :value="parseInt(key)">
          </el-option>
        </el-select>
        <el-select v-model="searchData.user" v-if="searchData.owner == 0 " filterable placeholder="请选择人员" clearable style="width:200px;">
          <el-option
            v-for="item in userList"
            :key="item.userid"
            :label="item.nickname"
            :value="item.userid">
          </el-option>
        </el-select>
    </div>
    <p v-if="flowList.length == 0" class="no-data">暂无数据</p>
    <ul class="flow-list">
      <li class="item" v-for="(item,index) in flowList">
        <div class="meta">
          <div class="avatar">
            <img v-if="item.picture" :src="item.picture" alt="">
            <img v-else src="../../assets/img/avatar.jpg" alt="">
          </div>
          <div class="meta-content created">
              <div class="user">{{item.creator_name}}</div>
              <el-tooltip placement="top" :content="item.name"><div class="title">{{item.name}}</div></el-tooltip>
          </div>
          <div class="meta-content">
            <div class="user">
              <label>测试：</label>
             <span v-for="testUser in item.user_test" :key="testUser.user_id">{{testUser.user_name}}&nbsp;&nbsp;</span>
            </div>
            <div class="title"><span><label>ID：</label>{{item.id}}</span><label>类型：</label>{{flowSet.type[item.flow_type]}}</div>
          </div>
        </div>
        <div class="content">
          <div class="list-content-wrap">
            <p class="list-content-item">流程: {{item.flow_assemble_name}}</p>
            <p class="list-content-item">当前阶段: {{item.action&&item.action.hasOwnProperty('current_step_name')?item.action.current_step_name:''}}</p>
          </div>
          <div class="list-content-wrap">
            <p class="list-content-item">开始时间: {{item.start_time}}</p>
            <p class="list-content-item"><a-progress :percent="item.action&&item.action.hasOwnProperty('process')?item.action.process:0"/></p>
          </div>
        </div>
        <!--item.status != 2 ? 'cursor': 'not-allowed' : -->
        <ul class="action">
          <li><router-link :to="{name:'flowDetail',params:{'flowId':item.id}}">查看</router-link><em class="ant-list-item-action-split"></em></li>
          <li :class="[(item.status == 2 || item.status == 3)?'disabled':'']"><a @click="editFlow(item)">编辑</a><em class="ant-list-item-action-split"></em></li>
          <li :class="[(item.status == 2 || item.status == 3)?'disabled':'']"><el-popover
          placement="top"
          width="160"
          v-model="item.pop2Visible" :disabled = "item.status == 2 || item.status == 3">
          <p>确定终止此流程？</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="item.pop2Visible = false">取消</el-button>
            <el-button type="primary" size="mini" @click="stopFlow(item,index)">确定</el-button>
          </div>
          <a slot="reference">终止</a>
          </el-popover></li>
          <li><el-popover
          placement="top"
          width="160"
          v-model="item.popVisible">
          <p>确定删除此流程？</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="item.popVisible = false">取消</el-button>
            <el-button type="primary" size="mini" @click="deleteFlow(item,index)">确定</el-button>
          </div>
          <a slot="reference">删除</a>
          </el-popover></li>1
        </ul>
      </li>
    </ul>
    <div class="flow-page">
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageSet.page_index"
      :page-sizes="[10, 50, 100, 200]"
      :page-size="pageSet.page_size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageSet.total">
    </el-pagination>
    </div>

    <el-dialog
      title="编辑流程"
      :visible.sync="editFlowDialog"
      width="500px"
      :close-on-click-modal="false"
    >
    <el-form ref="flowForm" :model="editflowData" :rules="rules" label-width="100px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="editflowData.title"></el-input>
      </el-form-item>
      <el-form-item label="开发" prop="development">
        <el-select v-model="editflowData.development" filterable placeholder="请选择" clearable  multiple>
          <el-option
            v-for="item in userList"
            :key="item.userid"
            :label="item.nickname"
            :value="item.userid">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开发负责人" prop="devManage">
        <el-select v-model="editflowData.devManage" filterable placeholder="请选择" clearable  multiple>
          <el-option
            v-for="item in userList"
            :key="item.userid"
            :label="item.nickname"
            :value="item.userid">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="产品" prop="productor">
        <el-select v-model="editflowData.productor" filterable placeholder="请选择" clearable  multiple>
          <el-option
            v-for="item in userList"
            :key="item.userid"
            :label="item.nickname"
            :value="item.userid">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="测试" prop="test">
        <el-select v-model="editflowData.test" filterable placeholder="请选择" clearable  multiple>
          <el-option
            v-for="item in userList"
            :key="item.userid"
            :label="item.nickname"
            :value="item.userid">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上线依赖" prop="dependence">
        <el-input type="textarea" v-model="editflowData.dependence"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="editFlowDialog = false">取消</el-button>
        <el-button type="primary" @click="sureEditFlow">确定</el-button>
      </span>
  </el-dialog>
  </div>
</template>
<script>
import moment from 'moment'
import userApi from '@/api/user.js'
import flowApi from '@/api/flow.js'
import setApi from '@/api/settingType.js'
import editor from '@/components/editor'
  export default{
    data() {
      return {
        searchData:{
          status:0,
          owner:0,//0 全部，1 与我相关
          user:'',
          title:'',
          flow_assemble_id:[],
          flow_type:[],
          platform:''
        },
        flowSteps:[],
        flowSet:{
          type:'',
          platform:''
        },
        editFlowDialog:false,
        editflowData:{
          id:'',
          title:'',
          development:'',
          devManage:'',
          productor:'',
          test:'',
          dependence:''
        },
        flowList:[],
        stepDatas:[],
        pageSet:{
          page_size:10,
          page_index:1,
          total:0
        },
        date:'',
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        rules:{
          title:[
            { required: true, message: '请填写标题', trigger: 'change' }
          ],
          development:[
            { required: true, message: '请填写开发', trigger: 'change' }
          ],
          devManage:[
            { required: true, message: '请填写开发管理', trigger: 'change' }
          ],
          productor:[
            { required: true, message: '请填写产品', trigger: 'change' }
          ],
          test:[
            { required: true, message: '请填写测试', trigger: 'change' }
          ],
        }
      }
    },
    components:{
      editor
    },
    computed: {
      projectId () {
        return parseInt(this.$route.params.projectId)
      },
      userId(){
        return this.$store.state.login.userid
      },
      userList(){
        return this.$store.state.project.userList
      },
    },
    watch:{
      'searchData':{
        handler:function(val){
          console.log('searklkk------------------',val)
          this.pageSet.page_index = 1
          this.getFlowList()
        },
        deep: true
      },
      'date':{
        handler:function(val){
          this.pageSet.page_index = 1
          this.getFlowList()
        },
        deep:true
      },
      'searchData.owner':function(val){
        if(val == 1){
          this.searchData.user = ''
        }
      }
    },
    methods:{
      getFlowList(){
        let params= {
          projectid:this.projectId,
          name:this.searchData.title,
          page_size:this.pageSet.page_size,
          page_index:this.pageSet.page_index,
        }
        if(this.date){
          params.start_time = moment(this.date[0]).format("YYYY-MM-DD")
          params.end_time = moment(this.date[1]).format("YYYY-MM-DD")
        }
        if(this.searchData.status!= 1){
          params.status = this.searchData.status
        }
        if(this.searchData.owner == 1){
          params.userid = this.userId
        }else if(this.searchData.user){
          params.userid = this.searchData.user
        }
        if(this.searchData.flow_assemble_id){
          params.flow_assemble_id = this.searchData.flow_assemble_id.toString()
        }
        if(this.searchData.flow_type){
          params.flow_type = this.searchData.flow_type.toString()
        }
        if(this.searchData.platform){
          params.platform = this.searchData.platform.toString()
        }

        flowApi.getFlowList(params).then(res=>{
          let data = res.data.data
          this.flowList = data.map(item=>{
            item.popVisible = false
            item.pop2Visible = false
            return item
          })
          this.pageSet.total = res.data.total
        },error=>{
          console.log('获取流程列表失败！')
        })
      },
      filterData(){
        this.pageSet.page_index = 1
        this.getFlowList()
      },
      editFlow(item){
        if(item.status == 2 || item.status ==3){
          return false
        }
        this.editflowData={
          id:item.id,
          title:item.name,
          development:item.user_dev_id,
          devManage:item.user_owner_id,
          productor:item.user_prod_id,
          test:item.user_test_id,
          dependence:item.dependence
        }
        this.editFlowDialog = true
      },
      sureEditFlow(){
        this.$refs.flowForm.validate((valid) => {
          if (valid) {
            let params = {
              name:this.editflowData.title,
              project_id:this.projectId,
              user_dev:this.editflowData.development,
              user_owner:this.editflowData.devManage,
              user_prod:this.editflowData.productor,
              user_test:this.editflowData.test,
              dependence:this.editflowData.dependence
            }
            flowApi.updateFlow(this.editflowData.id,params).then(res=>{
              this.$message.success('修改成功！')
              this.editFlowDialog = false
              this.getFlowList()//重新获取数据
            },error=>{
              this.$message.error(`修改失败: ${error.message}`)
            })
              }
            })

      },
      deleteFlow(item,index){
        flowApi.deleteFlow(item.id).then(res=>{
          this.$message.success('删除成功！')
          this.flowList[index].popVisible = false
          this.getFlowList()//重新获取数据
        },error=>{
          this.$message.error(`删除失败: ${error.message}`)
          this.flowList[index].popVisible = false
        })
      },
      stopFlow(item,index){
        flowApi.stopFlow(item.id).then(res=>{
          this.$message.success('终止成功！')
          this.flowList[index].pop2Visible = false
          this.getFlowList()//重新获取数据
        },error=>{
          this.$message.error(`终止失败: ${error.message}`)
          this.flowList[index].pop2Visible = false
        })
      },
      handleSizeChange(val) {
        this.pageSet.page_size = val
        this.getFlowList()
      },
      handleCurrentChange(val) {
        this.pageSet.page_index = val
        this.getFlowList()
      },
      getFlowSteps(){
        flowApi.getFlowSteps().then(res=>{
          let data =  res.data.data
          this.flowSteps =  data.map(item =>{
            item.checked = false
            return item
          })
        },error=>{
          console.log('获取流程步骤失败！')
        })
      },
      exportFlowFun(){
        let params = {
          user_id:this.userId,
          projectid:this.projectId,
          name:this.searchData.title
        }
        if(this.date){
          params.start_time = moment(this.date[0]).format("YYYY-MM-DD")
          params.end_time = moment(this.date[1]).format("YYYY-MM-DD")
        }
        if(this.searchData.status!= 1){
          params.status = this.searchData.status
        }
        if(this.searchData.owner == 1){
          params.userid = this.userId
        }else if(this.searchData.user){
          params.userid = this.searchData.user
        }
        if(this.searchData.flow_assemble_id){
          params.flow_assemble_id = this.searchData.flow_assemble_id.toString()
        }
        if(this.searchData.flow_type){
          params.flow_type = this.searchData.flow_type.toString()
        }
        if(this.searchData.platform){
          params.platform = this.searchData.platform.toString()
        }
        if(this.searchData.flow_id){
          params.flow_id = this.searchData.flow_id
        }
        if(this.date){
          params.start_time = moment(this.date[0]).format("YYYY-MM-DD")
          params.end_time = moment(this.date[1]).format("YYYY-MM-DD")
        }
        flowApi.exportFlow(params).then(res=>{
          let url = res.data.data.url
          window.open(url)
          this.$message.success('导出成功')
        },error=>{
          this.$message.error('导出失败:'+error.message)
        })
      },
      getFlowSet(){
        setApi.getFlowSet().then(res=>{
          this.flowSet = res.data.data
        })
      }
    },
    created(){
      this.getFlowSteps()
      this.getFlowList()
      this.getFlowSet()
    }
  }
</script>
<style lang="scss" scoped>
.flow-list-wrap{
  .el-select{
    width:360px;
  }
  .filter-bar{
    position:relative;
    .el-radio-group{
      margin-right:20px;
    }
    label{
      font-size:12px;
    }
    .m-search{
      display:inline-block;
      width:260px;
    }
    .flow-statistics{
      position:absolute;
      right:80px;
      top:-100%;
      cursor:pointer;
      color:#0071e6;
      i{
        margin-right:6px;
      }
    }
    .export-btn{
      position: absolute;
      right: 160px;
      top:-34px;
    }
    .el-range-editor--mini.el-input__inner{
      bottom:-1px;
    }
  }
  .search-bar{
    display:flex;
    align-items:flex-start;
    flex-wrap:wrap;
    margin-top:10px;
    .el-input,.el-select{
      margin-right:10px;
      margin-bottom:10px;
      width:200px;
    }
    .el-select.select-more{
      width:300px;
    }
  }
  .flow-list{
    .item{
      display:flex;
      align-items:center;
      padding-top: 16px;
      padding-bottom: 16px;
      border-bottom: 1px solid #e8e8e8;
      .meta{
        display:flex;
        align-items: flex-start;
        flex: 1 1;
        font-size: 0;
        .avatar{
          margin-right: 16px;
            width: 48px;
            height: 48px;
            line-height: 48px;
        }
        .meta-content{
          flex:1 0;
          .user{
            color: rgba(0,0,0,.65);
            margin-bottom: 4px;
            font-size: 14px;
            line-height: 22px;
          }
          .title{
            color: rgba(0,0,0,.45);
            font-size: 14px;
            line-height: 22px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 200px;
            span{
              display: inline-block;
              width:80px;
            }
          }
        }
      }
      .content{
        display:flex;
        flex: 1 1;
        justify-content: flex-end;
        .list-content-wrap{
          color: rgba(0,0,0,.45);
          text-align: right;
          margin-left: 30px;
          font-size: 14px;
        }
        .list-content-item{
              margin-top: 6px;
        }
      }
      .action{
        font-size: 0;
        flex: 0 0 auto;
        margin-left: 28px;
        padding: 0;
        list-style: none;
        li{
          display: inline-block;
          color: rgba(0,0,0,.45);
          cursor: pointer;
          padding: 0 8px;
          position: relative;
          font-size: 14px;
          line-height: 22px;
          text-align: center;
          &:first-child {
            padding-left: 0;
          }
          &.disabled a{
            color:#999;
            cursor: not-allowed;
          }
        }
      }
    }
  }
  .flow-page{
    padding:15px 0;
    .el-pagination{
      float:right;
    }
  }
  .el-progress{
    text-align:left;
  }
  .no-data{
    text-align:center;
    color:#999;
    padding:25px;
    margin-top:20px;
    border:1px solid #eee;
  }
}
</style>

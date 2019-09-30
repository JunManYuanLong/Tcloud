<template>
  <div>
    <div class="case-list" v-show="moduleId" :style="{'height':winHeight+'px'}">
        <div class="case-header">
          <div class="s-module">
            <img src="../../assets/img/moduleTag.png" alt="">
          <p>{{moduleId == 'all'? '所有模块':moduleName}}</p>
          </div>
          <el-button v-if="moduleId !== 'all'" type="primary" @click="toAddFun" class="case-add-btn">新增用例</el-button>
          <el-button  type="success" v-if="moduleId !== 'all'" plain @click="openImportDialog">导入用例</el-button>
          <el-button  type="primary" plain @click="exportCases">导出用例</el-button>
        </div>
        <div class="case-search-bar">
          <div class="item">
            <label>优先级：</label>
            <el-select v-model="searchData.priority" placeholder="请选择" clearable multiple  @change="filterData">
               <el-option
                v-for="(val,key) in caseSet.priority"
                :key="key"
                :label="val"
                :value="parseInt(key)">
              </el-option>
            </el-select>
          </div>
          <div class="item">
            <label>用例类型：</label>
            <el-select v-model="searchData.ctype" placeholder="请选择" clearable  @change="filterData">
              <el-option
                v-for="(val,key) in caseSet.ctype"
                :key="key"
                :label="val"
                :value="parseInt(key)">
              </el-option>
            </el-select>
          </div>
          <div class="item">
            <label>创建人：</label>
              <el-select v-model="searchData.user_id" filterable placeholder="请选择人员" clearable multiple  @change="filterData">
                <el-option
                  v-for="item in userList"
                  :key="item.userid"
                  :label="item.nickname"
                  :value="item.userid">
                </el-option>
              </el-select>
          </div>
          <div class="item">
            <label>时间：</label>
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
          </div>
          <div class="item">
            <el-input
              placeholder="输入标题或ID关键字"
              v-model="searchData.title" class="m-search" clearable  @change="filterData">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </div>
    </div>
    <a-table
      :rowKey="record => record.id"
      :dataSource="caseList"
      :pagination="pagination"
      :loading="loading"
      :scroll="{x:1300}"
      @change="handleTableChange">
      <a-table-column
          title="编号"
          dataIndex="cnumber"
          key="cnumber">
          <template slot-scope="text, record">
            <span class="case-link" @click="caseDetailFun(record)">{{record.cnumber}}</span>
          </template>
      </a-table-column>
      <a-table-column
          title="标题"
          dataIndex="title"
          key="title">
      </a-table-column>
      <a-table-column
          title="类型"
          dataIndex="ctype"
          key="ctype">
          <template slot-scope="text, record">
            {{getCaseType(record.ctype)}}
          </template>
      </a-table-column>
      <a-table-column
          title="优先级"
          dataIndex="priority"
          key="priority">
          <template slot-scope="text, record">
             {{caseSet.priority[record.priority]}}
          </template>
      </a-table-column>
      <a-table-column
          title="创建人"
          dataIndex="username"
          key="username">
      </a-table-column>
      <a-table-column
          title="创建时间"
          dataIndex="creation_time"
          key="creation_time">
      </a-table-column>
      <a-table-column
          title="操作"
          key="action">
          <template slot-scope="text, record">
             <el-button  v-if="moduleId!=='all'"  type="primary" @click="editFun(record)">编辑</el-button>
             <el-button type="success" @click="copyCase(record)">复制</el-button>
              <el-button type="danger" @click="deleteFun(record)">删除</el-button>
          </template>
      </a-table-column>
    </a-table>
      </div>
      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="400px" :close-on-click-modal="false">
        <span>您确定要删除（ {{deleteName}} ）用例？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="sureDelFun">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="用例导入"
        :visible.sync="importCaseDialog"
        width="400px" :close-on-click-modal="false">
        <div>
          <excelUpload :ossData = "ossData" :errorMsg="errorMsg" v-model="excelUrl" @clearMsg="errorMsg = ''" ref="excelUpload"></excelUpload>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeImportCase">取 消</el-button>
          <el-button type="primary" @click="importCases">确 定</el-button>
        </span>
      </el-dialog>
      <caseDetail v-model="showDetailDrawer" :caseData="caseDetailData">
      </caseDetail>
  </div>
</template>
<script>
import moment from 'moment'
import caseApi from '@/api/case.js'
import moduleApi from '@/api/module.js'
import caseDetail from '@/pages/module/caseDetail.vue'
import ossApi from '@/api/oss.js'
import setApi from '@/api/settingType.js'
import excelUpload from '@/pages/module/excelUpload.vue'
  export default{
    data(){
      return {
        deleteName: '',
        editCaseId: '',
        loading:true,
        moduleName:'',
        dialogVisible:false,
        tData: {
          data: [],
          total: 1
        },
        caseList:[],
        pagination:{
          current:1,
          pageSize:10,
          showTotal: total => `共 ${total} 条数据`,
        },
        rememberPage:'',
        rememberSize:'',
          statuDatas:[{
            value: 0,
            label: '新增'
          }, {
            value: 1,
            label: '已删除'
          }, {
            value: 2,
            label: '已完成'
          }],
        showDetailDrawer:false,
        caseDetailData:{},
        winHeight: window.innerHeight - 70,
        importCaseDialog: false,
        errorMsg:'',
        excelUrl:'',
        searchData:{
          priority:[],
          ctype:'',
          title:'',
          user_id:[],
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
      }
    },
    components:{
      caseDetail,
      excelUpload
    },
    computed:{
      projectId(){
        return this.$route.params.projectId
      },
      moduleId(){
        return this.$route.params.moduleId
      },
      userId(){
        return this.$store.state.login.userid
      },
      currentPage(){
        return this.$route.query&&this.$route.query.page?parseInt(this.$route.query.page) : 1
      },
      pageSize(){
        return this.$route.query&&this.$route.query.size?parseInt(this.$route.query.size) : 10
      },
      ossData(){
        return this.$store.state.project.ossData
      },
      userList(){
        return this.$store.state.project.userList
      },
      caseSet(){
        return this.$store.state.project.settings.case_config;
      }
    },
    watch: {
      $route() {
        //重置搜索条件
        this.searchData = {
          priority:[],
          ctype:[],
          title:'',
          user_id:[],
        }
        this.date = ''
        this.pagination.current = 1
        this.getCaseList({page_size:this.pagination.pageSize,page_index:this.pagination.current})
        this.getSingleModule()
      },
      'searchData.title':{
        handler:function(){
          this.filterData()
        },
        deep:true
      },
      'date':{
        handler:function(val){
          this.filterData()
        },
        deep:true
      },
    },
    methods:{
      getCaseType(types){
        let ctype = []
        let text = ''
        if(types&&types.indexOf(',')){
          ctype = types.split(',')
        }else{
          ctype = [types]
        }
        ctype.forEach((item,index) => {
          if(index !=ctype.length -1){
            text += this.caseSet.ctype[item] + '，'
          }else{
            text += this.caseSet.ctype[item]
          }
        })
        return text;
      },
      handleTableChange (pagination, filters, sorter) {
          console.log(pagination);
        const pager = { ...this.pagination };
        pager.current = pagination.current;
        this.pagination = pager;
        this.getCaseList({
          page_size: pagination.pageSize,
          page_index: pagination.current
        });
      },
      getCaseList(par = {}) {
        console.log('params----------',par)
        let params = {...par}
        this.rememberPage = params.page_index
        this.rememberSize = params.page_size
        console.log('remeberpage----------',this.rememberPage)
        this.loading = false
        if(this.date){
          params.start_time = moment(this.date[0]).format("YYYY-MM-DD")
          params.end_time = moment(this.date[1]).format("YYYY-MM-DD")
        }
        if(this.moduleId&&this.moduleId!='all'){
          params.priority = this.searchData.priority.toString()
          params.ctype = this.searchData.ctype
          params.title = this.searchData.title
          params.user_ids = this.searchData.user_id.toString()
          caseApi.getCaseByModule(this.moduleId,params).then(res => {
              const pagination = { ...this.pagination };
              pagination.total = res.data.total;
              this.caseList = res.data.data
              this.pagination = pagination;
              this.loading = false
          }, error => {
            this.caseList = []
            this.loading = false
          })
        }else{
          params.project_id = this.projectId
          params.priority = this.searchData.priority.toString()
          params.ctype = this.searchData.ctype
          params.title = this.searchData.title
          params.user_ids = this.searchData.user_id.toString()
          caseApi.getCaseList(params).then(res => {
              const pagination = { ...this.pagination };
              pagination.total = res.data.total;
              this.caseList = res.data.data
              this.pagination = pagination;
              this.loading = false
          }, error => {
            this.caseList = []
            this.loading = false
          })
        }
      },
      getSingleModule(){
        if(this.moduleId == 'all'){
          return false
        }
        moduleApi.getSingleModule({id: this.moduleId}).then(res=>{
          this.moduleName = res.data.data[0].name
        })
      },
      toAddFun(){
        if(this.rememberSize){
          this.$router.push({
            name:'caseAdd',
            params: {
              moduleId: this.moduleId
            },
            query:{
              page:1,
              size:this.rememberSize
            }
          })
        }else{
          this.$router.push({
            name:'caseAdd',
            params: {
              moduleId: this.moduleId
            }
          })
        }
        
      },
      editFun(row) {
        if(this.rememberPage&&this.rememberSize){
          this.$router.push({
          name:'caseEdit',
          params: {
            moduleId: this.moduleId,
            caseId: row.id
          },
          query:{
            page:this.rememberPage,
            size:this.rememberSize
          }
        })
        }else{
          this.$router.push({
            name:'caseEdit',
            params: {
              moduleId: this.moduleId,
              caseId: row.id
            }
          })
        }
      },
      deleteFun(row) {
        this.deleteName = row.cnumber
        this.editCaseId = row.id
        this.dialogVisible = true
      },
      editModuleFun(item) {
        console.log('mid', item.id)
        this.editModuleId = item.id
        this.showDialog(true)
      },
      sureDelFun(){
        caseApi.deleteCase({id: this.editCaseId}).then(res => {
            this.dialogVisible = false
            this.$message({
               message: 'case删除成功！',
               type: 'success'
            })
            this.getCaseList({page_size:this.pagination.pageSize,page_index:this.pagination.current})
          },error=>{
            this.$message.error('用例删除失败:' + error.message)
          })
      },
      caseDetailFun(row){
        this.showDetailDrawer= true
        this.caseDetailData = row
        console.log('caseDetail',row)
      },
      exportCases(){
        let params = {}
        params.project_id = parseInt(this.projectId)
        params.user_id = parseInt(this.userId)
        if(this.date){
          params.start_time = moment(this.date[0]).format("YYYY-MM-DD")
          params.end_time = moment(this.date[1]).format("YYYY-MM-DD")
        }
        params.priority = this.searchData.priority.toString()
        params.ctype = this.searchData.ctype
        params.title = this.searchData.title
        params.user_ids = this.searchData.user_id.toString()
        if(this.moduleId == 'all'){
          params.module_data = ''
        }else{
          params.module_data = this.moduleId
        }
        caseApi.exportCase(params).then(res=>{
          let url = res.data.data.url
          window.open(url)
          this.$message.success('导出成功')
        },error=>{
          this.$message.error('发送失败:'+error.message)
        })
      },
      openImportDialog(){
        this.importCaseDialog = true
      },
      closeImportCase(){
        this.importCaseDialog = false
        this.$refs.excelUpload.cancelFileUpload()
        this.excelUrl = ''
        this.errorMsg = ''
      },
      importCases(){
        if(!this.excelUrl){
          this.$message.error('请上传excel文件！')
          return false
        }
        let params = {
          url:this.excelUrl,
          creator:this.userId,
          project_id:parseInt(this.projectId),
          module_id:parseInt(this.moduleId)
        }
        caseApi.importCase(params).then(res=>{
          this.$message.success("导入成功！");
          this.importCaseDialog = false
          this.$store.commit('MODULE_CHANGE')
          this.getCaseList({page_size:this.pagination.pageSize,page_index:this.pagination.current})
          this.excelUrl = ''
        },error=>{
          this.errorMsg = error.message
        })
      },
      filterData(){
        this.pagination.current = 1
        this.getCaseList({page_size:this.pagination.pageSize,page_index:this.pagination.current})
      },
      $resize () {
        this.winHeight = window.innerHeight - 70
      },
      copyCase(caseItem) {
        let copycase = Object.assign({}, caseItem);
        let copyData = copycase;
        copyData.creator = this.$store.state.login.userid
        copyData.module_id = copycase.moduleid
        this.$confirm(`您确定你要复制:"${copycase.title}" 这个用例吗?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          caseApi
            .addCase(copyData)
            .then(res => {
              this.$message({
                message: "case复制成功！",
                type: "success"
              });
              // this.getcaseData()
              this.pagination.current = 1;
              this.getCaseList({page_size:this.pagination.pageSize,page_index:this.pagination.current})
            })
            .catch(err => {
              this.$message.error("复制失败: " + err.message);
              console.log(err);
            });
        });
      },
    },
    mounted(){
      window.addEventListener('resize', this.$resize, true)
    },
    beforeDestroy(){
      window.removeEventListener("resize", this.$resize);
    },
    created(){
      this.pagination.current = this.currentPage
      this.pagination.pageSize = this.pageSize
      this.getSingleModule()
      this.getCaseList({page_size:this.pagination.pageSize,page_index:this.pagination.current})
    }
  }
</script>
<style lang="scss" scoped>
.case-link{
  cursor:pointer;
  color:#409eff;
}
.case-list{
  overflow:auto;
  margin-left:370px;
  padding:10px 10px 0 0;
  .case-header{
    display:flex;
    align-items:center;
    margin-bottom:10px;
    img{
      height:20px;
      margin-right:10px;
    }
    .s-module{
      display:flex;
      height:30px;
      align-items:center;
      width:375px;
    }
  }
}
.no-select-module{
  margin-left:360px;
  p{
    width:300px;
    margin:80px;
    text-align:center;
    font-size:20px;
    color:#e6a23c;
    border:1px solid #f5c781;
    padding:10px;
    border-radius:10px;
    position:relative;
    &:after{
      position:absolute;
      top:20px;
      left:-89px;
      content:"";
      display:block;
      width:90px;
      height:91px;
      background:url('../../assets/img/arrow.png') no-repeat;
      background-size:100%;
    }
  }
}
.case-link{
  color:#409EFF;
}
.case-search-bar{
    display:flex;
    align-items:center;
    padding:0 10px 10px;
    margin-bottom: 12px;
    flex-wrap:wrap;
    .el-select{
      margin-right:8px;
    }
    .m-search{
      width:200px;
    }
    .item{
      margin-top:10px;
      margin-right:10px;
    }
  }
</style>
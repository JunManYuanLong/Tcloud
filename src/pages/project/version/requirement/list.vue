<template>
  <div>
    <ul class="filter-field">
      <li><label>标题：</label>
        <el-input v-model="filterData.title" placeholder="请输入标题或ID关键字" clearable @keyup.native="getRdataChange"></el-input>
      </li>
      <li><label>状态：</label>
        <el-select v-model="filterData.status" placeholder="请选择" clearable multiple @change="getRdataChange">
          <el-option
            v-for="(val,key) in rqSet.status"
            :key="key"
            :label="val"
            :value="parseInt(key)">
          </el-option>
        </el-select>
      </li>
      <li><label>优先级：</label>
        <el-select v-model="filterData.priority" placeholder="请选择" clearable multiple @change="getRdataChange">
          <el-option
            v-for="(val,key) in rqSet.priority"
            :key="key"
            :label="val"
            :value="parseInt(key)">
          </el-option>
        </el-select>
      </li>
      <li><label>处理人：</label>
        <el-select v-model="filterData.handler" filterable placeholder="请选择" clearable multiple @change="getRdataChange">
          <el-option
            v-for="item in userList"
            :key="item.userid"
            :label="item.nickname"
            :value="item.userid">
          </el-option>
        </el-select>
      </li>
      <!--新增-->
      <li><label>评审状态：</label>
        <el-select v-model="filterData.review_status" placeholder="请选择" clearable @change="getRdataChange">
          <el-option
            v-for="(item, index) in statusList"
            :key="index"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </li>
      <li><label>需求价值：</label>
        <el-select v-model="filterData.worth" filterable placeholder="请选择" clearable  @change="getRdataChange">
          <el-option
          label="高价值"
          :value="1">
        </el-option>
        <el-option
          label="非高价值"
          :value="2">
        </el-option>
        </el-select>
      </li>
      <li><label>高价值结果：</label>
        <el-select v-model="filterData.worth_sure" filterable placeholder="请选择" clearable  @change="getRdataChange">
          <el-option :value="1" label="超出预期"></el-option>
          <el-option :value="2" label="符合预期"></el-option>
          <el-option :value="3" label="低于预期"></el-option>
        </el-select>
      </li>
      <li><label>标签：</label>
        <el-select v-model="filterData.tag" placeholder="请选择"   clearable   @change="getRdataChange">
          <el-option
            v-for="item in tagList"
            :key="item.id"
            :label="item.tag"
            :value="item.id">
          </el-option>
        </el-select>
      </li>
    </ul>
    <div class="opt-bar">
       <el-button type="primary" @click="toAddFun" v-if="versionId !='all'">新增需求</el-button>
        <el-button @click="refreshFun" icon="el-icon-refresh" class="issue-refresh">刷新</el-button>
    </div>
    <a-table
          :rowKey="record => record.id"
          :dataSource="requirementList"
          :pagination="pagination"
          :loading="loading"
          :scroll="scroll"
          @change="handleTableChange">
          <a-table-column
              title="需求ID"
              dataIndex="id"
              width="90px"
              key="id">
          </a-table-column>
          <a-table-column
              title="标题"
              dataIndex="title"
              key="title">
            <template slot-scope="text, record">
                <p class="toDetail fixed-width-title" :title="record.title" @click="toDetailFun(record)">{{record.title}}</p>
              </template>
          </a-table-column>
          <a-table-column
              title="创建人"
              dataIndex="creator_name"
              key="creator_name">
          </a-table-column>
          <a-table-column
              title="处理人"
              dataIndex="handler"
              key="handler">
            <template slot-scope="text, record">
              <el-dropdown trigger="click" class='issue-edit-dropdown' @visible-change="dropdownChange">
                <span class="el-dropdown-link">
                  <span>{{record.handler_name}}</span><i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown" class="issue-edit-dropdow-wrap">
                  <div class="requirement-down-wrap">
                    <el-input
                      placeholder="搜索"
                      v-model="searchUser" class="m-search" clearable>
                      <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    </el-input>
                    <ul class="user">
                      <el-dropdown-item v-for="item in dropdownUserList" :key="item.userid"
                                        :class="{selected:record.handler_name ==item.nickname}">
                        <div @click="updateHandler(record,item)">
                          {{item.nickname}}
                        </div>
                      </el-dropdown-item>
                    </ul>
                  </div>
                </el-dropdown-menu>
              </el-dropdown>
              </template>
          </a-table-column>
          <a-table-column
              title="优先级"
              dataIndex="priority"
              key="priority">
            <template slot-scope="text, record">
                <span>{{rqSet.priority[record.priority]}}</span>
              </template>
          </a-table-column>
                <a-table-column
              title="状态"
              dataIndex="board_status"
              key="board_status">
            <template slot-scope="text, record">
                <el-dropdown trigger="click" class='issue-edit-dropdown'>
                    <span class="el-dropdown-link">
                      <span>{{rqSet.status[record.board_status]}}</span><i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                  <el-dropdown-menu slot="dropdown" class="issue-edit-dropdow-wrap">
                    <div class="requirement-down-wrap">
                      <ul>
                        <el-dropdown-item v-for="(val,key) in rqSet.status" :key="key"
                                          :class="{selected:record.board_status ==key}">
                          <div @click="updateStatus(record,key)">
                            {{val}}
                          </div>
                        </el-dropdown-item>
                      </ul>
                    </div>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
          </a-table-column>
          <a-table-column
              title="类型"
              dataIndex="requirement_type"
              key="requirement_type">
            <template slot-scope="text, record">
                <span>{{rqSet.type[record.requirement_type]}}</span>
              </template>
          </a-table-column>
          <a-table-column
              title="需求价值"
              dataIndex="worth"
              key="worth">
            <template slot-scope="text, record">
                <span>{{record.worth == 1?'高价值':'非高价值'}}</span>
              </template>
          </a-table-column>
          <a-table-column
              title="高价值结果"
              dataIndex="worth_sure"
              key="worth_sure">
            <template slot-scope="text, record">
                <span>{{getWortSure(record.worth_sure)}}</span>
              </template>
          </a-table-column>
          <a-table-column
              title="创建时间"
              dataIndex="creation_time"
              key="creation_time">
          </a-table-column>



          <a-table-column
              title="评审状态"
              dataIndex="review_status"
              key="review_status">
            <template slot-scope="text, record">
                <span>{{getReviewStatus(record.review_status)}}</span>
              </template>
          </a-table-column>
          <a-table-column
              title="关联case"
              key="aboutcase">
            <template slot-scope="text, record">
                <a @click="toCaseList(record)">查看</a>
              </template>
          </a-table-column>
    </a-table>
    <requirementAdd v-model="requirementAddDrawer" :drawerStyle="drawerStyle" :tagList="tagList" @data-add="requirementAdd"></requirementAdd>
    <requirementDetail v-model="requirementDrawer" :requireData="requirementDetail"  :tagList="tagList" :drawerStyle="drawerStyle"
                       @data-change="detailchange" @data-delete="requirementDelete"></requirementDetail>
  </div>
</template>
<script>
  import requirementApi from '@/api/requirement'
  import userApi from '@/api/user'
  import requirementAdd from '@/pages/project/version/requirement/add'
  import requirementDetail from '@/pages/project/version/requirement/requirementDetail'
  import setApi from '@/api/settingType.js'
  import tagApi from '@/api/tag.js'
  export default {
    data() {
      return {
        totalCount: 0,
        loading: true,
        tableCurPage: 1,
        tablePageSize: 10,
        requirementList: [],
        scroll:{
          x:1480
        },
        pagination:{
          current:1,
          pageSize:10,
          showTotal: total => `共 ${total} 条数据`,
        },
       statusList: [
        {
          value: 1,
          label: '未评审'
        },
        {
          value: 2,
          label: '评审成功'
        },
        {
          value: 3,
          label: '评审失败'
        }
      ],
        searchUser: '',
        requirementDrawer: false,
        requirementAddDrawer: false,
        requirementDetail: {},
        drawerStyle: {
          width: '960px'
        },
        filterData: {
          title: '',
          handler: [],
          status: [],
          priority: [],
          review_status: '', // 新增
          tag:''
        },
        tagList:[]
      }
    },
    components: {
      requirementDetail,
      requirementAdd
    },
    watch: {
      $route() {
        this.pagination.current = 1
        this.getRdata({page_size:this.pagination.pageSize,page_index:this.pagination.current})
      },
      'filterData.title':function(val){
        if(val==''){
          this.getRdataChange()
        }
      }
    },
    computed: {
      projectId() {
        return this.$route.params.projectId
      },
      userList(){
        return this.$store.state.project.userList
      },
      // todo 做分页
      /*filterResult() {
        let result = this.requirementList
        // 新增
        if (this.filterData.review_status) {
          result = result.filter(item => {
            if (this.filterData.review_status === item.review_status) {
              return item
            }
          })
        }
        if (this.filterData.title) {
          result = result.filter(item => {
            if (item.title.includes(this.filterData.title)) {
              return item
            }
          })
        }
        if (this.filterData.handler.length > 0) {
          result = result.filter(item => {
            if (this.filterData.handler.includes(item.handler_id)) {
              return item
            }
          })

        }
        if (this.filterData.status.length > 0) {
          result = result.filter(item => {
            if (this.filterData.status.includes(item.board_status)) {
              return item
            }
          })

        }
        if (this.filterData.priority.length > 0) {
          result = result.filter(item => {
            if (this.filterData.priority.includes(item.priority)) {
              return item
            }
          })

        }
        return result
      },*/
      versionId() {
        if (this.$route.params.versionId == 'all') {
          return 'all'
        } else {
          return parseInt(this.$route.params.versionId)
        }
      },
      dropdownUserList() {
        let data = this.userList
        if (this.searchUser) {
          data = data.filter(item => {
            if (item.nickname.includes(this.searchUser)) {
              return item
            }
          })
        }
        return data
      },
      rqSet() {
        return this.$store.state.project.settings.requirement_config;
      },
    },
    methods: {
      changeCurrentPage (val) {
        this.tableCurPage = val
        this.getRdata()
      },
      sizeChange (val) {
        this.tablePageSize = val
        this.getRdata()
      },
      // 新增
      getReviewStatus (value) {
        let text = ""
        switch (value) {
          case 1:
            text = "未评审";
            break;
          case 2:
            text = "评审成功";
            break;
          case 3:
            text = "评审失败";
            break;
        }
        return text
      },
      getWortSure(type){
        let text = ''
        if(type==1){
          text = '超出预期'
        }else if(type == 2){
          text = '符合预期'
        }else if(type == 3){
          text = '低于预期'
        }else{
          text = ''
        }
        return text
      },
      toAddFun() {
        this.requirementAddDrawer = true
      },
      toCaseList(row){
        this.$router.push({
          name: 'requirementCase',
          params:{
            requirementId:row.id,
            requirementClassId:row.version_id?row.version_id:'a1'
          }
        })
      },
      refreshFun() {
        this.getRdata({page_size:this.pagination.pageSize,page_index:this.pagination.current})
      },
      // 切换条件后，page_index应该变为1
      getRdataChange () {
        this.pagination.current = 1
        this.getRdata({page_size:this.pagination.pageSize,page_index:this.pagination.current})
      },
       handleTableChange (pagination, filters, sorter) {
          console.log(pagination);
        const pager = { ...this.pagination };
        pager.current = pagination.current;
        this.pagination = pager;
        this.getRdata({
          page_size: pagination.pageSize,
          page_index: pagination.current
        });
      },
      getRdata(par = {}) {
        let params = {...par}
        params.projectid = this.projectId
        if (this.versionId != 'all') {
          params.versionid = this.versionId
        } else {
          params.notype = 0  //查询有版本分类的需求
        }
        // todo 接口换为getRequirementListNew，params添加page_size , page_index
        // params.page_index = this.tableCurPage
        // params.page_size = this.tablePageSize
        params.title = this.filterData.title
        params.handler_id = this.filterData.handler.toString()
        params.board_status = this.filterData.status.toString()
        params.priority = this.filterData.priority.toString()
        params.tag = this.filterData.tag
        params.review_status = this.filterData.review_status
        params.worth = this.filterData.worth
        params.worth_sure = this.filterData.worth_sure
        requirementApi.getRequirementListNew(params).then(res => {
          const pagination = { ...this.pagination };
            pagination.total = res.data.total;
            this.requirementList = res.data.data
            this.pagination = pagination;
            this.loading = false
        },error=>{

        })
        /*requirementApi.getRequirementList(params).then(res => {
          if (res.data.code == 0) {
            this.loading = false
            this.requirementList = res.data.data
          }
        })*/
      },
      updateStatus(row, status) {
        let st = parseInt(status)
        requirementApi.updateBoardStatus(row.id, {board_status: st}).then(res => {
          row.board_status = st
          // this.getRdata()
        }, error => {
          this.$message.error('操作失败：' + error.message)
        })
      },
      dropdownChange(val) {
        if (!val) {
          this.searchUser = ''
        }
      },
      updateHandler(row, user) {
        console.log('upload', row, user)
        requirementApi.updateHandler({handler: user.userid}, row.id).then(res => {
          row.handler_id = user.userid
          row.handler_name = user.nickname
          // this.getRdata()
          this.$message.success('修改成功！')
        }, error => {
          this.$message.error('操作失败：' + error.message)
        })
      },
      toDetailFun(row) {
        console.log('rowclic', row)
        requirementApi.getDetailById(row.id).then((res) => {
          if (res.data.code === 0) {
            this.requirementDrawer = true
            this.requirementDetail = res.data.data[0]
          }
        }, (err) => {

        })
      },
      detailchange(val) {
        console.log('backdetaildata', val)
        let backdetail = {
          "id": val.id,
          "attach": val.attach,
          "description": val.description,
          "board_status": val.board_status,
          "handler_id": val.handler,
          "project_id": val.project_id,
          "title": val.title,
          "requirement_type": val.requirement_type,
          "priority": val.priority,
          "version_id": this.versionId,
          "version_name": val.version_name,
          "creator_id": val.creator_id,
          "creator_name": val.creator_name,
          "review_status": val.review_status,
          "worth":val.worth,
          "worth_sure":val.worth_sure,
          "report_time":val.report_time,
          "report_expect":val.report_expect,
          "report_real":val.report_real,
          "jira_id":val.jira_id,
        }
        if (val.handler) {
          this.userList.map(item => {
            if (item.userid == val.handler) {
              backdetail.handler_name = item.nickname
            }
          })
        } else {
          backdetail.handler_name = ""
        }

        console.log('editbackdetail', backdetail)

        this.requirementList.map((item, index) => {
          if (item.id == backdetail.id) {
            item = Object.assign(item, backdetail)
            console.log('editdetail', item, '---', index, 'ixxx', item.id)

          }
        })

        // this.refreshFun()
        // this.getRdata()
        // this.$refs.pdataTable.clearSort()
      },
      requirementDelete() {
        this.refreshFun()
      },
      requirementAdd() {
        this.refreshFun()
      },
      getTagList() {
        let params = {
          project_id: this.projectId
        }
        tagApi.getTag(params).then(res => {
          this.tagList = res.data.data
        },error=>{
          this.$message.error(error.message)
        })
      },
    },
    created() {
      this.getRdata({page_size:this.pagination.pageSize,page_index:this.pagination.current})
      this.getTagList()
    }
  }
</script>
<style lang="scss">
  .filter-field {
    .el-select {
      span:focus-within {
        border: none;
        outline: none;
      }

      .el-tag {
        display: inline-block;
        margin: 0 5px;
      }
    }
  }
</style>
<style lang="scss" scoped>
  .filter-field {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
    margin: 10px 0 10px;
    font-size:13px;
    li {
      margin-left: 8px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      margin-bottom: 10px;
    }

    label {
      display: block;
      min-width: 60px;
    }

    .el-select {
      // width:150px;
      span:focus-within {
        border: none;
        outline: none;
      }

      .el-tag {
        margin: 0 !important;
      }
    }
  }

  .requirement-page {
    .nav {
      position: absolute;
      padding: 20px 0 20px 20px;
      width: 240px;
      top: 0;
      left: 0;
      height: 100%;
      box-shadow: rgba(0, 0, 0, 0.05) 1px 0px 10px 0px;

      h2 {
        font-size: 20px;
        margin-bottom: 15px;
      }
    }

    .list {
      margin-left: 240px;
      padding: 0 20px;

      h3 {
        min-height: 50px;
        line-height: 50px;
        font-size: 14px;
        color: #666;
      }
    }
  }

  .toDetail {
    cursor: pointer;
    color: #409eff;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .requirement-down-wrap {
    ul.user {
      max-height: 300px;
      overflow: auto;
    }
  }
  .opt-bar{
    margin:10px 0;
  }
</style>

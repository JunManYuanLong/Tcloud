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
        <el-select v-model="filterData.tag" placeholder="请选择"   clearable  @change="getRdataChange">
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
      <el-button type="primary" @click="toAddFun">新增需求</el-button>
        <el-button @click="refreshFun" icon="el-icon-refresh" class="issue-refresh">刷新</el-button>
        <el-button v-if="canReview" class="btn-right" type="primary" @click="toReviewFun">需求评审</el-button>
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
                <p class="toDetail fixed-width-title" :title="record.title"  @click="toDetailFun(record)">{{record.title}}</p>
              </template>
          </a-table-column>
      <a-table-column
              title="创建人"
              dataIndex="creator_name"
              key="creator_name">
          </a-table-column><a-table-column
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
              title="优先级"
              dataIndex="priority"
              key="priority">
            <template slot-scope="text, record">
                <span>{{rqSet.priority[record.priority]}}</span>
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
    <requirementDetail v-model="requirementDrawer" :requireData="requirementDetail" :drawerStyle="drawerStyle" :tagList="tagList"
                       @data-change="detailchange" @data-delete="requirementDelete" @refresh-list="refreshFun"></requirementDetail>
  </div>
</template>
<script>
  import requirementApi from '@/api/requirement'
  import userApi from '@/api/user'
  import versionApi from '@/api/version'
  import requirementDetail from '@/pages/requirement/requirementDetail'
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
        requirementDetail: {},
        drawerStyle: {
          width: '910px'
        },
        filterData: {
          title: '',
          handler: [],
          status: [],
          priority: [],
          review_status: '',
          worth:'',
          worth_sure:'',
          tag:''
        },
        tagList:[]
      }
    },
    components: {
      requirementDetail
    },
    watch: {
      $route() {
        console.log('routerchange')
        this.requirementList = []
        requirementApi.cancelRequirementList()
        this.pagination.current = 1
        this.getRdata({page_size:this.pagination.pageSize,page_index:this.pagination.current})
      },
      'filterData.title':function(val){
        console.log('titlechagne')
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
      requirementClassId() {
        return this.$route.params.requirementClassId ? this.$route.params.requirementClassId : ''
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
      canReview () {
        const reg = /^[0-9]*$/;
        return reg.test(this.requirementClassId)
      },
      versionList(){
        return this.$store.state.project.versionList
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
      // 改变页数大小时，调接口
      changePageSize (val) {
        this.tablePageSize = val
        this.getRdata()
      },
      getPriority(value) {
        let text = ''
        switch (value) {
          case 0:
            text = "紧急";
            break;
          case 1:
            text = "高";
            break;
          case 2:
            text = "中";
            break;
          case 3:
            text = "低";
            break;
        }
        return text;
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
        console.log(this.$route)
        this.$router.push({
          name: 'requirementAdd'
        })
      },
      toCaseList(row){
        this.$router.push({
          name: 'requirementCase',
          params:{
            requirementId:row.id
          }
        })
      },
      toReviewFun () {
//        this.$store.commit('CHANGE_VISIBLE', false)
        this.$router.push({name: 'requirementReview'})
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
        if (this.requirementClassId == 'a2') {
          params.notype = 1
        }
        if (this.requirementClassId == 'a3') {
          params.notype = 0
        }
        if (this.requirementClassId.toString().indexOf('a') == -1) {
          params.versionid = this.requirementClassId
        }

        // 接口换为getRequirementListNew
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
        console.log('toEditpage', row)
        this.requirementDrawer = true
        this.requirementDetail = row
        //查询单个需求的详情，传递给组件，因为列表中没有case_ids字段
        // requirementApi.getDetailById(row.id).then((res) => {
        //   if (res.data.code === 0) {
        //     console.log('rq-detail',res.data.data[0])
        //     this.requirementDrawer = true
        //     this.requirementDetail = res.data.data[0]
        //   }
        // }, (err) => {

        // })
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
          "version_id": val.version,
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
        if (val.version) {
          this.versionList.map(item => {
            if (item.id == val.version) {
              backdetail.version_name = item.title
            }
          })
        } else {
          backdetail.version_name = ""
        }

        console.log('editbackdetail', backdetail)
        if ((this.requirementClassId == 'a2' && val.version) || (this.requirementClassId.toString().indexOf('a') == -1 && this.requirementClassId != val.version)) {
          this.refreshFun()
         } else {
          this.requirementList.map((item, index) => {
            if (item.id == backdetail.id) {
              item = Object.assign(item, backdetail)
              console.log('editdetail', item, '---', index, 'ixxx', item.id)
            }
          })
        }

        // this.refreshFun()
        // this.getRdata()
        // this.$refs.pdataTable.clearSort()
      },
      requirementDelete() {
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
      this.getTagList()
      this.getRdata({page_size:this.pagination.pageSize,page_index:this.pagination.current})
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
    margin: 0 0 10px;

    li {
      margin-left: 8px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      margin-bottom: 10px;
    }

    label {
      display: block;
      min-width: 56px;
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

  .btn-right {
    float: right;
  }
  .opt-bar{
    margin:10px 0;
  }
</style>


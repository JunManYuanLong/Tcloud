<template>
  <div class="issue-wrap">
    <!-- 分页表格封装 -->
    <ul class="filter-field">
      <li>
        <label>标题：</label>
        <el-input v-model="filterData.title" placeholder="输入标题或ID关键字" clearable></el-input>
      </li>
      <li>
        <label>创建人：</label>
        <el-select v-model="filterData.creator_id" filterable placeholder="请选择" clearable multiple>
          <el-option
            v-for="item in userList"
            :key="item.userid"
            :label="item.nickname"
            :value="item.userid"
          ></el-option>
        </el-select>
      </li>
      <li>
        <label>处理人：</label>
        <el-select v-model="filterData.handler_id" filterable placeholder="请选择" clearable multiple>
          <el-option
            v-for="item in userList"
            :key="item.userid"
            :label="item.nickname"
            :value="item.userid"
          ></el-option>
        </el-select>
      </li>
      <li>
        <label>状态：</label>
        <el-select v-model="filterData.handle_status" placeholder="请选择" clearable multiple>
          <el-option
            v-for="(value,key) in issueSet.status"
            :key="key"
            :label="value"
            :value="parseInt(key)"
          ></el-option>
        </el-select>
      </li>
      <li>
        <label>优先级：</label>
        <el-select v-model="filterData.priority" placeholder="请选择" clearable multiple>
          <el-option
            v-for="(value,key) in issueSet.priority"
            :key="key"
            :label="value"
            :value="parseInt(key)"
          ></el-option>
        </el-select>
      </li>
      <li>
        <label>所属模块：</label>
        <el-select v-model="filterData.module_id" filterable placeholder="请选择" clearable multiple>
          <el-option v-for="item in moduleList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </li>
      <li>
        <label>级别：</label>
        <el-select v-model="filterData.level" filterable placeholder="请选择" clearable multiple>
          <el-option v-for="(value,key) in issueSet.level" 
            :key="key"
            :label="value"
            :value="parseInt(key)">
          </el-option>
        </el-select>
      </li>
    </ul>
    <div class="action-bar">
      <el-button type="primary" @click="toAddFun" v-if="version!='all'">新增Issue</el-button>
      <el-button type="primary" @click="exportFun">导出Issue</el-button>
    </div>
    <a-table
      :rowKey="record => record.issueid"
      :dataSource="issueData"
      :pagination="pagination"
      :loading="loading"
      :scroll="scroll"
      @change="handleTableChange"
    >
      <a-table-column title="ID" data-index="issue_number" width="90px" key="issue_number">
        <template slot-scope="text, record">
          <p class="toDetail" @click="tableRowClickFun(record)">{{record.issue_number}}</p>
        </template>
      </a-table-column>
      <a-table-column title="标题" width="300px" data-index="title" key="title">
        <template slot-scope="text, record">
          <p class="toDetail fixed-width-title" :title="record.title" @click="tableRowClickFun(record)">{{record.title}}</p>
        </template>
      </a-table-column>
      <a-table-column title="优先级"  data-index="priority" key="priority">
        <template slot-scope="text, record">
          <el-dropdown trigger="click" class="issue-edit-dropdown">
            <span class="el-dropdown-link">
              <span>{{issueSet.priority[record.priority]}}</span>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown" class="issue-edit-dropdow-wrap">
              <div class="issue-down-wrap">
                <ul>
                  <el-dropdown-item
                    v-for="(val,key) in issueSet.priority"
                    :key="key"
                    :class="{selected:record.priority ==key}"
                  >
                    <div @click="updatePriority(record,key)">{{val}}</div>
                  </el-dropdown-item>
                </ul>
              </div>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </a-table-column>
      <a-table-column title="级别"  data-index="level" key="level">
        <template slot-scope="text, record">
          <el-dropdown trigger="click" class="issue-edit-dropdown">
            <span class="el-dropdown-link">
              <span>{{issueSet.level[record.level]}}</span>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown" class="issue-edit-dropdow-wrap">
              <div class="issue-down-wrap">
                <ul>
                  <el-dropdown-item
                    v-for="(val,key) in issueSet.level"
                    :key="key"
                    :class="{selected:record.level ==key}"
                  >
                    <div @click="updateLevel(record,key)">{{val}}</div>
                  </el-dropdown-item>
                </ul>
              </div>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </a-table-column>
      <a-table-column title="创建人" data-index="creator" key="creator">
        <template slot-scope="text, record">{{record.creator[0]?record.creator[0].name:''}}</template>
      </a-table-column>
      <a-table-column title="处理人"  data-index="handler" key="handler">
        <template slot-scope="text, record">
          <el-dropdown trigger="click" class="issue-edit-dropdown" @visible-change="dropdownChange">
            <span class="el-dropdown-link">
              <span>{{record.handler.length>0?record.handler[0].name:''}}</span>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown" class="issue-edit-dropdow-wrap">
              <div class="issue-down-wrap">
                <el-input placeholder="搜索" v-model="searchUser" class="m-search" clearable>
                  <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
                <ul>
                  <el-dropdown-item
                    v-for="item in dropdownUserList"
                    :key="item.userid"
                    :class="{selected:record.handler.length>0&&record.handler[0].name ==item.nickname}"
                  >
                    <div @click="updateHandler(record,item)">{{item.nickname}}</div>
                  </el-dropdown-item>
                </ul>
              </div>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </a-table-column>
      <a-table-column title="状态"  data-index="handle_status" key="handle_status">
        <template slot-scope="text, record">
          <el-dropdown trigger="click" class="issue-edit-dropdown">
            <span class="el-dropdown-link">
              <span>{{issueSet.status[record.handle_status]}}</span>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown" class="issue-edit-dropdow-wrap">
              <div class="issue-down-wrap">
                <ul>
                  <el-dropdown-item
                    v-for="(val,key) in issueSet.status"
                    :key="key"
                    :class="{selected:record.handle_status ==key}"
                  >
                    <div @click="updateStatus(record,key)">{{val}}</div>
                  </el-dropdown-item>
                </ul>
              </div>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </a-table-column>
      <a-table-column title="issue分数" data-index="rank" key="rank"/>
      <a-table-column title="创建时间" data-index="creation_time" key="creation_time"/>
      <a-table-column title="修改时间" data-index="modified_time" key="modified_time"/>
    </a-table>
    <addDialog
      :isShow="editDialogVisible"
      :issueId="editIssueId"
      @close="closeDialog"
      @refreshIssue="refreshFun"
    ></addDialog>
    <issueDetail
      v-model="issueDetailDrawer"
      :issueData="issueDetail"
      :drawerStyle="drawerStyle"
      @data-change="detailchange"
      @data-delete="IssueDelete"
    ></issueDetail>
  </div>
</template>
<script>
import issueApi from "@/api/issue.js";
import moduleApi from "@/api/module.js";
import userApi from "@/api/user.js";
import setApi from "@/api/settingType.js";
import addDialog from "@/pages/issue/add.vue";
import issueDetail from "@/pages/issue/issueDetail.vue";
export default {
  data() {
    return {
      loading: false,
      scroll: {
        x: 1480
      },
      pagination: {
        current: 1,
        pageSize: 10,
        showTotal: total => `共 ${total} 条数据`
      },
      issueData: [],
      // columns,
      tData: [],
      tableCurPage: 1,
      filterValue: "",
      dialogVisible: false,
      issueInfo: {},
      editDialogVisible: false,
      editIssueId: "",
      filterData: {
        title: "",
        creator_id: [],
        handler_id: [],
        handle_status: [],
        priority: [],
        module_id: [],
        level:[]
      },
      moduleList: [],
      searchUser: "",
      issueDetailDrawer: false,
      issueDetail: {},
      drawerStyle: {
        width: "910px"
      }
    };
  },
  components: {
    addDialog,
    issueDetail
  },
  computed: {
    projectId() {
      return parseInt(this.$route.params.projectId);
    },
    version() {
      if (this.$route.params.versionId == "all") {
        return "all";
      } else {
        return parseInt(this.$route.params.versionId);
      }
    },
    userList() {
      return this.$store.state.project.userList;
    },
    dropdownUserList() {
      let data = this.userList;
      if (this.searchUser) {
        data = data.filter(item => {
          if (item.nickname.includes(this.searchUser)) {
            return item;
          }
        });
      }
      return data;
    },
    issueSet() {
      let set = {
        chance:{},
        detection_chance:{},
        level:{},
        priority:{},
        status:{},
        systems:{},
        type:{}
      }
      return this.$store.state.project.settings.issue_config?this.$store.state.project.settings.issue_config:set;
    },
    versionList(){
      return this.$store.state.project.versionList
    },
  },
  watch: {
    $route() {
      console.log("issuerouterchange");
      this.pagination.current = 1;
      //初始化搜索条件
      this.filterData = {
        title: "",
        creator_id: [],
        handler_id: [],
        handle_status: [],
        priority: [],
        module_id: [],
        level:[]
      };
      // this.getIssueData({page_size:this.pagination.pageSize,page_index:this.pagination.current})
      this.getModuleList();
      // this.$refs.dataTable.refreshMethod()
    },
    filterData: {
      handler: function(val) {
        console.log("filterchange", this.pagination);
        this.pagination.current = 1;
        this.getIssueData({
          page_size: this.pagination.pageSize,
          page_index: this.pagination.current
        });
      },
      deep: true
    }
  },
  methods: {
    getModuleList() {
      moduleApi.getModuleByProject(this.projectId).then(res => {
        this.moduleList = res.data.data;
      });
    },
    handleTableChange(pagination, filters, sorter) {
      console.log(pagination);
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.getIssueData({
        page_size: pagination.pageSize,
        page_index: pagination.current
      });
    },
    getIssueData(params = {}) {
      console.log("params:", params);
      this.loading = true;
      let filter = { ...this.filterData };
      Object.keys(filter).map(item => {
        console.log("filter", item, "--", filter[item]);
        if (filter[item] && Array.isArray(filter[item])) {
          filter[item] = filter[item].toString();
        }
      });
      let fparams = {
        project_id: this.projectId,
        ...filter,
        ...params
      };
      console.log("fparams", fparams);
      if (this.version == "all") {
        issueApi.getIssueList(fparams).then(
          res => {
            const pagination = { ...this.pagination };
            pagination.total = res.data.total;
            this.issueData = res.data.data;
            this.pagination = pagination;
            this.loading = false;
          },
          error => {
            this.issueData = [];
            this.loading = false;
          }
        );
      } else {
        fparams.versionid = this.version;
        issueApi.getIssueList(fparams).then(
          res => {
            const pagination = { ...this.pagination };
            pagination.total = res.data.total;
            this.issueData = res.data.data;
            this.pagination = pagination;
            this.loading = false;
          },
          error => {
            this.issueData = [];
            this.loading = false;
          }
        );
      }
    },
    handlerEditDialog(val) {
      this.editDialogVisible = val;
    },
    toAddFun() {
      this.editIssueId = "";
      this.handlerEditDialog(true);
    },
    searchFun() {},
    editFun(row) {
      this.editIssueId = row.issueid;
      this.handlerEditDialog(true);
    },
    closeDialog() {
      this.editIssueId = "";
      this.handlerEditDialog(false);
    },
    deleteFun(row) {
      this.issueInfo = row;
      this.dialogVisible = true;
    },
    sureDelFun() {
      issueApi.deleteIssue({ id: this.issueInfo.issueid }).then(res => {
        this.$message({
          message: "issue删除成功！",
          type: "success"
        });
        this.dialogVisible = false;
        this.getIssueData({
          page_size: this.pagination.pageSize,
          page_index: this.pagination.current
        });
      });
    },
    refreshFun() {
      this.handlerEditDialog(false);
      this.pagination.current = 1;
      this.getIssueData({
        page_size: this.pagination.pageSize,
        page_index: this.pagination.current
      });
    },
    exportFun() {
      let filter = { ...this.filterData };
      Object.keys(filter).map(item => {
        console.log("filter", item, "--", filter[item]);
        if (filter[item] && Array.isArray(filter[item])) {
          filter[item] = filter[item].toString();
        }
      });
      let fparams = {
        project_id: this.projectId,
        ...filter
      };
      if (this.version == "all") {
        issueApi.getIssueListExport(fparams).then(
          res => {
            let url = res.data.data;
            window.open(url);
            this.$message.success("导出成功");
          },
          error => {
            this.$message.error("导出失败：error.message");
          }
        );
      } else {
        fparams.versionid = this.version;
        issueApi.getIssueListExport(fparams).then(
          res => {
            let url = res.data.data;
            window.open(url);
            this.$message.success("导出成功");
          },
          error => {
            this.$message.error("导出失败：error.message");
          }
        );
      }
    },
    updateHandler(row, user) {
      console.log("upload", row, user);
      issueApi.updateIssueHandler(row.issueid, { handler: user.userid }).then(
        res => {
          row.handler = [{ id: user.userid, name: user.nickname }];
          // this.initTableData()
        },
        error => {
          this.$message.error("操作失败：" + error.message);
        }
      );
    },
    clearSearchUser(val) {
      console.log("drownchange", val);
      if (!val) {
        this.searchUser = "";
      }
    },
    updateStatus(row, status) {
      console.log("upload", row, status);
      let st = parseInt(status);
      issueApi.updateIssueStatus(row.issueid, { handle_status: st }).then(
        res => {
          row.handle_status = st;
          // this.initTableData()
        },
        error => {
          this.$message.error("操作失败：" + error.message);
        }
      );
    },
    dropdownChange(val) {
      if (!val) {
        this.searchUser = "";
      }
    },
    updatePriority(row, status) {
      console.log("upload", row, status);
      let st = parseInt(status);
      issueApi.updateIssuePriority(row.issueid, { priority: st }).then(
        res => {
          row.priority = st;
          // this.initTableData()
        },
        error => {
          this.$message.error("操作失败：" + error.message);
        }
      );
    },
    updateLevel(row, status) {
      let st = parseInt(status);
      issueApi.updateIssueLevel(row.issueid, { level: st }).then(
        res => {
          row.level = st;
          let dict_data = { "0": 5, "1": 4, "2": 3, "3": 2, "4": 1 };
          row.rank = dict_data[row.chance] * dict_data[row.level];
          // this.initTableData()
        },
        error => {
          this.$message.error("操作失败：" + error.message);
        }
      );
    },
    tableRowClickFun(row) {
      console.log("rowclic", row);
      this.issueDetailDrawer = true;
      console.log("toEditpage", row);
      this.issueDetail = row;
    },
    detailchange(val) {
      //弹框更新，进行列表单项更新，刷新接口会导致修改的数据在第一页

      console.log("backdetaildata", val);
      let backdetail = {
        issueid: val.issueid,
        module_id: val.module_id,
        modifier: val.modifier,
        handler: val.handler,
        issue_type: val.issue_type,
        chance: val.chance,
        level: val.level,
        system: val.system,
        priority: val.priority,
        stage: val.stage,
        title: val.title,
        attach: val.attach,
        handle_status: val.handle_status,
        description: val.description,
        rank: val.rank,
        requirement_id: val.requirement_id,
        requirement_title: val.requirement_title,
        case_covered:val.case_covered,
        version:val.version
      };
      if (backdetail.module_id) {
        this.moduleList.map(item => {
          if (item.id == backdetail.module_id) {
            backdetail.module = [{ id: item.id, name: item.name }];
          }
        });
      } else {
        backdetail.module = [];
      }
      if (backdetail.handler) {
        this.userList.map(item => {
          if (item.userid == backdetail.handler) {
            backdetail.handler = [{ id: item.userid, name: item.nickname }];
          }
        });
      } else {
        backdetail.handler = [];
      }
      if (backdetail.version) {
        this.versionList.map(item => {
          if (item.id == backdetail.version) {
            backdetail.version = [{ id: item.id, name: item.title }];
          }
        });
      } else {
        backdetail.handler = [];
      }
      if (backdetail.modifier) {
        this.userList.map(item => {
          if (item.userid == backdetail.modifier) {
            backdetail.modifier = [{ id: item.userid, name: item.nickname }];
          }
        });
      } else {
        backdetail.modifier = [];
      }

      console.log("editbackdetail", backdetail);

      this.issueData.map((item, index) => {
        if (item.issueid == backdetail.issueid) {
          item = Object.assign(item, backdetail);
          console.log("editdetail", item, "---", index, "ixxx", item.id);
        }
      });
      console.log("afterEdit", this.issueData);
    },
    IssueDelete() {
      this.refreshFun();
    },
  },
  created() {
    // this.initTableData()
    this.getIssueData({
      page_size: this.pagination.pageSize,
      page_index: this.pagination.current
    });
    this.getModuleList();
  }
};
function dealObjectValue(obj) {
  var param = {};
  if (obj === null || obj === undefined || obj === "") return param;
  for (var key in obj) {
    if (typeof obj[key] === "Object") {
      param[key] = dealObjectValue(obj[key]);
    } else if (obj[key] !== null && obj[key] !== undefined && obj[key] !== "") {
      param[key] = obj[key];
    }
  }
  return param;
}
</script>
<style lang="scss">
.issue-wrap {
  .ph-datatable {
    .table-expand {
      font-size: 0;
    }
    .table-expand .el-form-item__label {
      width: 90px;
      color: #99a9bf;
    }
    .table-expand .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      width: 50%;
    }
  }
}

.issue-edit-dropdown.el-dropdown{
  font-size: 12px;
}
.issue-down-wrap {
  .m-search .el-input__inner {
    border: none;
    border-radius: 0;
    border-bottom: 1px solid #dcdfe6;
  }
}
.issue-edit-dropdow-wrap {
  &.el-popper[x-placement^="bottom"] {
    margin-top: 5px;
  }
  &.el-popper[x-placement^="top"] {
    margin-bottom: 5px;
  }
}
.ph-datatable .ph-table-head {
  opacity: 0;
  width: 1px;
}
.issue-refresh:focus {
  background: #fff;
  border: 1px solid #dcdfe6;
  color: #606266;
  &:hover {
    color: #409eff;
    border-color: #c6e2ff;
    background-color: #ecf5ff;
  }
}
.filter-field {
  font-size:12px;
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
.ph-datatable {
  margin-top: 20px;
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
.filter-field {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  margin: 10px 0 10px;
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
.issue-edit-dropdown {
  .el-dropdown-link {
    span {
      display: inline-block;
      min-width: 50px;
    }
  }
}

.issue-down-wrap {
  ul {
    padding-top: 10px;
    max-height: 250px;
    overflow: auto;
    li {
      div {
        padding: 1px 10px;
      }
      margin: 3px 0;
      &:hover,
      &.selected {
        background-color: rgba(16, 113, 211, 0.08);
      }
    }
  }
}
.toDetail {
  cursor: pointer;
  color: #409eff;
  overflow: hidden;
  text-overflow: ellipsis;
}
.action-bar {
  margin-bottom: 10px;
  .el-button {
    margin-right: 10px;
  }
}
</style>

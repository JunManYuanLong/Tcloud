<template>
  <div class="property-wrap">
    <el-tabs
      v-model="propertyTab"
      class="property-inner"
       type="card"
      @tab-click="tabClickFun"
    >
      <el-tab-pane label="手机设备" name="4">
        <template v-if="propertyTab == 4">
          <div class="q-opt">
            <!-- 新增搜索条件 -->
            <el-form ref="searchForm" label-width="96px" :inline="true">
              <el-form-item style="display: block;">
                <el-button type="primary" @click="toAddFun">新增资产</el-button>
              </el-form-item>
              <el-form-item label="设备名称">
                <el-input
                  v-model="phoneSearch.name"
                  clearable
                  placeholder="通过设备名称进行搜索"
                ></el-input>
              </el-form-item>
              <el-form-item label="制造商">
                <el-input
                  v-model="phoneSearch.vendor"
                  clearable
                  placeholder="通过制造商进行搜索"
                ></el-input>
              </el-form-item>
              <el-form-item label="系统">
                <el-input
                  v-model="phoneSearch.os"
                  clearable
                  placeholder="通过系统进行搜索"
                ></el-input>
              </el-form-item>
              <el-form-item label="分辨率">
                <el-input
                  v-model="phoneSearch.resolution"
                  clearable
                  placeholder="通过分辨率进行搜索"
                ></el-input>
              </el-form-item>
              <el-form-item label="设备来源">
                <el-input
                  v-model="phoneSearch.device_source"
                  clearable
                  placeholder="通过设备来源进行搜索"
                ></el-input>
              </el-form-item>
              <el-form-item label="设备归属部门">
                <el-input
                  v-model="phoneSearch.device_belong"
                  clearable
                  placeholder="通过设备归属进行搜索"
                ></el-input>
              </el-form-item>
              <el-form-item label="持有人">
                <el-select
                  v-model="phoneSearch.borrower_id"
                  filterable
                  clearable
                  remote
                  placeholder="请输入关键字触发搜索"
                  :remote-method="getHolders"
                  :loading="holderLoading"
                >
                  <el-option
                    v-for="item in holders"
                    :key="item.id"
                    :label="item.nickname"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="设备归属人" prop="creator_id">
                <el-select
                  v-model="phoneSearch.creator_id"
                  filterable
                  clearable
                  remote
                  placeholder="请输入用户名关键字"
                  :remote-method="getUsers"
                  :loading="userLoading"
                >
                  <el-option
                    v-for="item in users"
                    :key="item.userid"
                    :label="item.nickname"
                    :value="item.userid"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <!-- 分页表格封装 -->

          <a-table
            :rowKey="record => record.id"
            :dataSource="propertyData"
            :pagination="pagination"
            :loading="loading"
            @change="handleTableChange"
            >
            <div slot="expandedRowRender" slot-scope="record">
              <el-form label-position="left" inline class="table-expand">
                <el-form-item label="CPU">
                  <span>{{ record.cpu }}</span>
                </el-form-item>
                <el-form-item label="Core">
                  <span>{{ record.core }}</span>
                </el-form-item>
                <el-form-item label="内存（单位G）">
                  <span>{{ record.ram }} G</span>
                </el-form-item>
                <el-form-item label="硬盘（单位G）">
                  <span>{{ record.rom }} G</span>
                </el-form-item>
                <el-form-item label="采购时间">
                  <span>{{ formatDate(record.buy_date) }}</span>
                </el-form-item>
                <el-form-item label="所在地">
                  <span>{{ record.region }}</span>
                </el-form-item>
                <el-form-item label="设备状态">
                  <span>{{ record.borrow_status }}</span>
                </el-form-item>
                <el-form-item label="设备号">
                  <span>{{ record.device_number }}</span>
                </el-form-item>
              </el-form>
            </div>
            <a-table-column title="设备名称" data-index="name" key="name"></a-table-column>
            <a-table-column title="资产编号" data-index="asset_id" key="asset_id"></a-table-column>
            <a-table-column title="制造商" data-index="vendor" key="vendor"></a-table-column>
            <a-table-column title="系统" data-index="os" key="os"></a-table-column>
            <a-table-column title="分辨率" data-index="resolution" key="resolution"></a-table-column>
            <a-table-column title="持有人" data-index="borrow_nickname" key="borrow_nickname"></a-table-column>
            <a-table-column title="设备来源" data-index="device_source" key="device_source"></a-table-column>
            <a-table-column title="设备归属部门" data-index="device_belong" key="device_belong"></a-table-column>
            <a-table-column title="设备归属人" data-index="creator_nickname" key="creator_nickname"></a-table-column>
            <a-table-column title="操作" width="355" key="action">
              <template slot-scope="text, record">
                <el-button
                  type="success"
                  v-if="record.confirm_status == 0"
                  @click="phoneConfirmFun(record)"
                >接收</el-button>
                <el-button
                  type="success"
                  style="background-color:#4aa71c;"
                  v-if="record.move_status == 0&&record.confirm_status != 0"
                  @click="phoneBorrowFun(record)"
                >借用</el-button>
                <el-button
                  type="success"
                  style="background-color: #2a7305;"
                  v-if="(record.move_status == 1||record.move_status == 3 )&&record.creator_id!=userId"
                  @click="phoneRenewFun(record)"
                >续借</el-button>
                <el-button
                  type="primary"
                  v-if="(record.move_status == 1 ||record.move_status == 3 || isAdmin)&&record.move_status!=2"
                  @click="phoneMoveFun(record)"
                  :disabled="record.move_status!=3"
                >流转</el-button>
                <el-button
                  type="warning"
                  v-if="(record.move_status == 1||record.move_status == 3 )&&record.creator_id!=userId"
                  @click="phoneBackFun(record)"
                >退回</el-button>
                <template>
                  <el-button
                    type="primary"
                    style="background-color:#0770dc;"
                    @click="editFun(record)"
                  >编辑</el-button>
                  <el-button type="danger" @click="deleteFun(record)">删除</el-button>
                </template>
              </template>
            </a-table-column>
          </a-table>
        </template>
      </el-tab-pane>
      <el-tab-pane label="手机号" name="5">
        <template v-if="propertyTab == 5">
          <div class="q-opt">
            <el-button type="primary" @click="toAddFun">新增资产</el-button>
          </div>
          <!-- 分页表格封装 -->

          <a-table
            :rowKey="record => record.id"
            :dataSource="propertyData"
            :pagination="pagination"
            :loading="loading"
            @change="handleTableChange"
            >
            <a-table-column title="资产" data-index="asset_id" key="asset_id"></a-table-column>
            <a-table-column title="资产所属人" data-index="administrator" key="administrator"></a-table-column>
            <a-table-column title="注册人" data-index="bind_tel" key="bind_tel"></a-table-column>
            <a-table-column title="身份证号" data-index="idcard" key="idcard"></a-table-column>
            <a-table-column title="运营商" data-index="operator" key="operator"></a-table-column>
            <a-table-column title="操作" key="action">
              <template slot-scope="text, record">
                <template>
                  <el-button type="primary" @click="editFun(record)">编辑</el-button>
                  <el-button type="danger" @click="deleteFun(record)">删除</el-button>
                </template>
              </template>
            </a-table-column>
          </a-table>
        </template>
      </el-tab-pane>
      <el-tab-pane label="微信号" name="6">
        <template v-if="propertyTab == 6">
          <div class="q-opt">
            <el-button type="primary" @click="toAddFun">新增资产</el-button>
            <!--  <el-input
              placeholder="请搜索"
              v-model="filterValue" suffix-icon="el-icon-search" class="q-search" @click="searchFun">
            </el-input>-->
          </div>
          <!-- 分页表格封装 -->
          <a-table
            :rowKey="record => record.id"
            :dataSource="propertyData"
            :pagination="pagination"
            :loading="loading"
            @change="handleTableChange"
            >
            <a-table-column title="资产" data-index="asset_id" key="asset_id"></a-table-column>
            <a-table-column title="密码" data-index="passwd" key="passwd"></a-table-column>
            <a-table-column title="资产所属人" data-index="administrator" key="administrator"></a-table-column>
            <a-table-column title="注册人" data-index="bind_tel" key="bind_tel"></a-table-column>
            <a-table-column title="身份证号" data-index="idcard" key="idcard"></a-table-column>
            <a-table-column title="运营商" data-index="operator" key="operator"></a-table-column>
            <a-table-column title="操作" key="action">
              <template slot-scope="text, record">
                <template>
                  <el-button type="primary" @click="editFun(record)">编辑</el-button>
                  <el-button type="danger" @click="deleteFun(record)">删除</el-button>
                </template>
              </template>
            </a-table-column>
          </a-table>
        </template>
      </el-tab-pane>
    </el-tabs>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="400px" :close-on-click-modal="false">
      <span>您确定要删除（ {{deleteProperty}} ）资产？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureDelFun">确 定</el-button>
      </span>
    </el-dialog>
    <editDialog v-if="editDialogVisible"
      :isShow="editDialogVisible"
      :type="dialogType"
      :virtualType="virtualType"
      :propertyId="editPropertyID"
      @refreshData="refreshDataFun"
      @close="showEditDialog(false)"
    ></editDialog>
    <addDialog  v-if="addDialogVisible"
      :isShow="addDialogVisible"
      :type="dialogType"
      :virtualType="virtualType"
      @refreshData="refreshDataFun"
      @close="showAddDialog(false)"
    ></addDialog>
    <moveDialog v-if="moveDialogVisible"
      :isShow="moveDialogVisible"
      :phoneId="movePhoneId"
      @refreshData="refreshDataFun"
      @close="showMoveDialog(false)"
    ></moveDialog>
  </div>
</template>
<script>
import addDialog from "./addDialog.vue";
import editDialog from "./editDialog.vue";
import moveDialog from "./moveDialog.vue";
import propertyApi from "@/api/property.js";
import userApi from "@/api/user.js";
export default {
  data() {
    return {
      loading: true,
      holderLoading: false,
      userLoading: false,
      users: [],
      holders: [],
      propertyTab: "4",
      tData: {
        data: [],
        total: 1
      },
      propertyData: [],
      pagination: {
        current: 1,
        pageSize: 10,
        showTotal: total => `共 ${total} 条数据`
      },
      phoneSearch: {
        name: "",
        vendor: "",
        os: "",
        resolution: "",
        borrower_id: "",
        device_source: "",
        device_belong: "",
        creator_id: ""
      },
      fileterList: [],
      tableCurPage: 1,
      filterValue: "",
      deleteProperty: "",
      deletePropertyId: "",
      dialogVisible: false,
      addDialogVisible: false,
      editDialogVisible: false,
      dialogType: "",
      virtualType: "",
      editPropertyID: "",
      movePhoneId: "",
      moveDialogVisible: false
    };
  },
  components: {
    addDialog,
    editDialog,
    moveDialog
  },
  computed: {
    isAdmin() {
      return this.$store.getters.isAdmin;
    }
  },
  watch:{
    'phoneSearch':{
      handler: function(val) {
        //只有手机设备发起搜索请求
        if(this.propertyTab == 4){
          this.fileterData()
        }
      },
      deep:true
    }
  },
  components: {
    addDialog,
    editDialog,
    moveDialog
  },
  computed: {
    isAdmin() {
      return this.$store.getters.isAdmin;
    },
    userId() {
      return this.$store.state.login.userid;
    }
  },
  methods: {
    // 获取所有人员列表
    async getUserList() {
      return await userApi.getAllUser();
    },
    // 筛选过滤
    fileterData(){
      this.pagination.current = 1;
      this.getPropertyData({
        page_size: this.pagination.pageSize,
        page_index: this.pagination.current
      });
    },
    getPropertyType() {
      let type = "";
      switch (this.propertyTab) {
        case "1":
          type = "pad";
          break;
        case "2":
          type = "pc";
          break;
        case "3":
          type = "displayer";
          break;
        case "4":
          type = "phone";
          break;
        case "5":
          type = "virtual";
          break;
        case "6":
          type = "virtual";
          break;
        case "7":
          type = "virtual";
          break;
      }
      return type;
    },
    getVirtualType() {
      let type = "";
      switch (this.propertyTab) {
        case "5":
          type = 1;
          break;
        case "6":
          type = 2;
          break;
        case "7":
          type = 3;
          break;
      }
      return type;
    },
    handleTableChange(pagination, filters, sorter) {
      console.log(pagination);
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.getPropertyData({
        page_size: pagination.pageSize,
        page_index: pagination.current
      });
    },
    getPropertyData(p = {}) {
      let ty = this.getPropertyType(); //对应接口路径配置
      let vty = this.getVirtualType(); //虚拟资产接口
      let params = { ...p };
      if (vty) {
        params.type = vty;
        propertyApi.getPropertyList(ty, params).then(
          res => {
            let data = res.data;
            const pagination = { ...this.pagination };
            pagination.total = res.data.total;
            this.propertyData = data.data;
            this.pagination = pagination;
            this.loading = false;
          },
          error => {
            this.loading = false;
            consloe.log("获取资产失败！");
          }
        );
      } else {
        params = Object.assign(params, this.phoneSearch);
        propertyApi.getPropertyList(ty, params).then(
          res => {
            let data = res.data;
            const pagination = { ...this.pagination };
            pagination.total = res.data.total;
            this.propertyData = data.data;
            this.pagination = pagination;
            this.loading = false;
          },
          error => {
            this.loading = false;
            consloe.log("获取资产失败！");
          }
        );
      }
    },
    toAddFun() {
      this.dialogType = this.getPropertyType();
      this.virtualType = this.getVirtualType();
      console.log("index virtualType", this.virtualType);
      this.showAddDialog(true);
    },
    searchFun() {},
    editFun(row) {
      this.dialogType = this.getPropertyType();
      this.virtualType = this.getVirtualType();
      this.editPropertyID = row.id;
      this.showEditDialog(true);
    },
    deleteFun(row) {
      this.deleteProperty = this.getPropertyType();
      this.deletePropertyId = row.id;
      this.dialogVisible = true;
    },
    sureDelFun() {
      let ty = this.getPropertyType();
      propertyApi
        .deleteProperty(ty, { id: this.deletePropertyId })
        .then(res => {
          this.$message({
            message: "资产删除成功！",
            type: "success"
          });
          this.dialogVisible = false;
          this.getPropertyData({
            page_size: this.pagination.pageSize,
            page_index: this.pagination.current
          });
        }).catch(err => {
          this.$message.error(err.message)
        })
    },
    phoneBackFun(row) {
      this.$confirm(`您确定要退回设备：${row.name}？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        propertyApi.phoneBack(row.id).then(
          res => {
            this.$message.success("退回申请成功！");
            this.getPropertyData({
              page_size: this.pagination.pageSize,
              page_index: this.pagination.current
            });
          },
          error => {
            this.$message.error(`${error.message}`);
          }
        );
      });
    },
    phoneBorrowFun(row) {
      this.$confirm(`您确定要借用设备：${row.name}？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        propertyApi.phoneBorrow(row.id).then(
          res => {
            this.$message.success("借用申请成功！");
            this.getPropertyData({
              page_size: this.pagination.pageSize,
              page_index: this.pagination.current
            });
          },
          error => {
            this.$message.error(`${error.message}`);
          }
        );
      });
    },
    phoneRenewFun(row) {
      this.$confirm(`您确定要续借设备：${row.name}？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        propertyApi.phoneBorrow(row.id).then(
          res => {
            this.$message.success("续借成功！");
            this.getPropertyData({
              page_size: this.pagination.pageSize,
              page_index: this.pagination.current
            });
          },
          error => {
            this.$message.error(`${error.message}`);
          }
        );
      });
    },
    phoneConfirmFun(row) {
      this.$confirm(`您确定要接收设备：${row.name}？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        propertyApi.phoneBorrowConfirm(row.id).then(
          res => {
            this.$message.success("接收成功！");
            this.getPropertyData({
              page_size: this.pagination.pageSize,
              page_index: this.pagination.current
            });
          },
          error => {
            this.$message.error(`${error.message}`);
          }
        );
      });
    },
    phoneMoveFun(row) {
      this.movePhoneId = row.id;
      this.showMoveDialog(true);
    },
    showMoveDialog(val) {
      this.moveDialogVisible = val;
    },
    showAddDialog(val) {
      this.addDialogVisible = val;
    },
    showEditDialog(val) {
      this.editDialogVisible = val;
    },
    refreshDataFun() {
      this.showAddDialog(false);
      this.showEditDialog(false);
      this.showMoveDialog(false);
      this.pagination.current = 1;
      this.getPropertyData({
        page_size: this.pagination.pageSize,
        page_index: this.pagination.current
      });
    },
    tabClickFun() {
      //重置分页
      this.pagination = {
        current: 1,
        pageSize: 10
      };
      // 搜索条件置空
      this.phoneSearch = {
        name: "",
        vendor: "",
        os: "",
        resolution: "",
        borrower_id: "",
        device_source: "",
        device_belong: "",
        creator_id: ""
      };
      this.propertyData = []//重置表格数据
      this.loading = true
      this.getPropertyData({
        page_size: this.pagination.pageSize,
        page_index: this.pagination.current
      });
    },
    formatDate(time) {
      if (!time) {
        return "";
      } else {
        let date = new Date(time);
        let Y = date.getFullYear() + "-";
        let M =
          (date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1)
            : date.getMonth() + 1) + "-";
        let D = date.getDate() + " ";
        // let h = date.getHours() + ':'
        // let m = date.getMinutes() + ':'
        // let s = date.getSeconds()
        return Y + M + D;
      }
    },
    getHolders(query) {
      if (query) {
        this.holderLoading = true;
      }
      propertyApi.getPhoneHolder().then(
        res => {
          let data = res.data.data;
          if (query) {
            this.holders = data.filter(item => {
              if (item.nickname.includes(query) || item.id == query) {
                return item;
              }
            });
          } else {
            this.holders = data;
          }
          this.holderLoading = false;
        },
        error => {
          this.holderLoading = false;
          console.log("获取手机设备持有人失败！");
        }
      );
    },
    getUsers(query){
      if(query){
        this.userLoading = true
      }
      userApi.getUserBySearch({nickname:query}).then(res=>{
        this.users = res.data.data
        this.userLoading = false
      },error=>{
        this.userLoading = false
        console.log('获取手机设备归属人失败！')
      })
    }
  },
  created() {
    this.getPropertyData({
      page_size: this.pagination.pageSize,
      page_index: this.pagination.current
    });
  }
};
</script>
<style lang="scss">
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

.permission-unit {
  display: inline-block;
  padding: 0 10px;
  margin: 0 5px;
  background-color: #b9dbff;
  border-radius: 3px;
  color: #fff;
}
.property-wrap {
  .q-opt {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    .q-search {
      width: 200px;
    }
    .el-form-item--mini.el-form-item {
      margin-right: 5px;
    }
    .el-form {
      text-align: left;
    }
  }
  .table-expand {
    font-size: 0;
  }
  .table-expand label {
    width: 130px;
    color: #99a9bf;
  }
  .table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
}
</style>
<style lang="scss" scoped>
.property-wrap {
  padding: 40px 15px 0;
  width: 100%;
  display: flex;
  justify-content: center;
  .property-inner {
    width: 100%;
    max-width: 1600px;
    background-color:#fff;
    padding:5px;
  }
  .el-tab-pane{
    padding:0 10px;
  }
}
</style>
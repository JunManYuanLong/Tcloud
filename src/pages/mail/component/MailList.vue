<template>
  <div class="mail-list">
    <el-card class="box-card" shadow="never">
      <div slot="header">
        <span>{{listConfig.title}}</span>
        <el-button
          style="float: right;"
          type="text"
          v-show="listConfig.type !== 1"
          @click="allRead"
        >全部标记已读</el-button>
      </div>
      <!-- 消息列表 -->
      <el-table
        :data="tableData"
        style="width: 100%"
        :show-header="false"
        max-height="450"
        :highlight-current-row="true"
        @row-click="showDetail"
      >
        <el-table-column width="18">
          <template slot-scope="scope">
            <div
              style="box-sizing: border-box; padding-top: 8px;"
              :class="{visibel: scope.row.status !== 0}"
            >
              <el-badge is-dot></el-badge>
            </div>
          </template>
        </el-table-column>
        <!-- show-overflow-tooltip -->
        <el-table-column prop="content" class-name="limit">
          <template slot-scope="scope">
            <p class="content-ellipsis">
              {{ scope.row.content }}
            </p>
          </template>
        </el-table-column>
        <el-table-column width="160">
          <template slot-scope="scope">
            <i class="el-icon-date"></i>
            {{ scope.row.create_time }}
          </template>
        </el-table-column>
        <el-table-column width="40">
          <template slot-scope="scope">
            <el-button type="text" class="del" @click.stop="delItem(scope.row)">
              <i class="el-icon-delete"></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="mail-pagination" v-show="total > 0">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="page_index"
          :page-size="page_size"
          layout="total, prev, pager, next"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
    <!-- 详情对话框 -->
    <el-dialog title="消息详情" :visible.sync="dialogVisible" width="600px" :show-close="false">
      <div class="dialog-box">
        <div>内容：</div>
        <pre>{{content}}</pre>
      </div>
      <div class="dialog-box">
        <div>创建时间：</div>
        <p>{{create_time}}</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDetail">关 闭</el-button>
      </span>
    </el-dialog>
    <!-- 确定删除对话框 -->
    <el-dialog title="提示" :visible.sync="delDialogVisible" width="30%">
      <span style="padding-left: 20px;">确定要删除这条消息？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDel">取 消</el-button>
        <el-button type="primary" @click="delSure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mailApi from "@/api/mail.js";
export default {
  name: "MailList",
  data() {
    return {
      dialogVisible: false,
      content: "",
      create_time: "",
      page_index: 1,
      page_size: 10,
      page_total: 0,
      delDialogVisible: false
    };
  },
  props: ["tableData", "listConfig", "pageSize", "pageIndex", "total"],
  computed: {
    userId() {
      return this.$store.state.login.userid;
    }
  },
  watch: {},
  methods: {
    // 全部标记已读
    allRead() {
      let params = {
        user: this.userId,
        isall: 1
      };
      mailApi
        .changeStatus(params)
        .then(res => {
          this.$message.success("全部标记已读成功");
          this.refreshList({
            pageSize: this.page_size,
            pageIndex: this.page_index
          });
        })
        .catch(err => {});
    },
    // 调用已读接口
    changeStatus(id) {
      let params = {
        user: this.userId,
        id
      };
      mailApi
        .changeStatus(params)
        .then(res => {
          this.refreshList({
            pageSize: this.page_size,
            pageIndex: this.page_index
          });
        })
        .catch(err => {});
    },
    // 查看详情
    showDetail(row, event, column) {
      this.changeStatus(row.id);
      this.dialogVisible = true;
      this.content = row.content;
      this.create_time = row.create_time;
    },
    // 关闭详情
    closeDetail() {
      this.dialogVisible = false;
      this.content = "";
      this.create_time = "";
    },
    // 删除一条消息
    delItem(row) {
      this.delRow = row
      this.delDialogVisible = true
    },
    // 取消删除
    cancelDel () {
      this.delRow = {},
      this.delDialogVisible = false
    },
    // 确定删除
    delSure () {
      this.delDialogVisible = false
      let params = {
        user: this.userId,
        id: this.delRow.id
      };
      mailApi
        .deleteItem(params)
        .then(res => {
          this.$message.success("删除成功");
          this.page_index = 1;
          this.refreshList({
            pageSize: this.page_size,
            pageIndex: this.page_index
          });
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    // 刷新列表
    refreshList(obj) {
      this.$emit("refreshList", obj);
    },
    // 分页切换
    handleCurrentChange() {
      this.refreshList({
        pageSize: this.page_size,
        pageIndex: this.page_index
      });
    }
  },
  mounted() {
    this.page_index = this.pageIndex;
    this.page_size = this.pageSize;
  }
};
</script>

<style lang="scss" scoped>
.mail-list {
  height: 100%;
  .box-card {
    height: 100%;
    /* 分页 */
    .mail-pagination {
      text-align: center;
      padding-top: 20px;
    }
    /* 过渡样式 */
    .el-table__row {
      .del {
        display: none;
        font-size: 15px;
        transition: all 3s;
      }
      &:hover {
        .del {
          display: inline-block;
        }
      }
      /* 超出长度 */
      td.limit {
        width: 200px;
      }
    }
  }
  /* 详情对话框 */
  .dialog-box {
    display: flex;
    justify-content: left;
    padding: 15px 10px;
    & > div {
      width: 100px;
    }
    & > p {
      width: 500px;
    }
    & > pre {
      width: 500px;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
  }
}
.visibel {
  visibility: hidden;
}
.content-ellipsis {
  width: 80%;
  white-space:nowrap;
  overflow:hidden;
  text-overflow : ellipsis;
}
</style>
<style>
/* .mail-list td.limit {
  white-space:nowrap!important;
  overflow:hidden!important;
  text-overflow:ellipsis!important;
} */
</style>




<template>
  <div class="mail-has-read">
    <MailList :tableData="hasReadData" @refreshList="refreshList" :list-config="listConfig"
      :pageSize="pageSize" :pageIndex="pageIndex" :total="total">
    </MailList>
  </div>
</template>
<script>
import mailApi from "@/api/mail.js";
export default {
  name: "MailHasRead",
  data() {
    return {
      hasReadData: [],
      listConfig: {
        title: "已读消息",
        type: 1
      },
      timer: '',
      pageSize: 10,
      pageIndex: 1,
      total: 0
    };
  },
  computed: {
    userId() {
      return this.$store.state.login.userid;
    }
  },
  components: {
    MailList: () => import("./component/MailList.vue")
  },
  methods: {
    // 获取已读列表
    getListData() {
      let params = {
        user: this.userId,
        isread: 1, // 已读
        page_size: this.pageSize,
        page_index: this.pageIndex
      };
      mailApi
        .getMailByStatus(params)
        .then(res => {
          this.hasReadData = res.data.data;
          this.total = res.data.total
        })
        .catch(err => {
          clearInterval(this.timer)
          this.$message.error(err.message)
        });
    },
    // 刷新数据
    refreshList ({pageSize, pageIndex}) {
      this.pageSize = pageSize
      this.pageIndex = pageIndex
      this.getListData()
    },
    // 轮询数据
    loopData() {
      this.timer = setInterval(() => {
        this.getListData();
      }, 3000);
    }
  },
  mounted() {
    this.getListData();
    this.loopData();
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = ''
    }
  }
};
</script>

<style lang="scss" scoped>
.mail-has-read {
  padding-left: 20px;
  font-size: 14px;
  height: 100%;
}
</style>



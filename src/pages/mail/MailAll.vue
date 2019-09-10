<template>
  <div class="mail-all">
    <MailList :tableData="allListData" @refreshList="refreshList" :list-config="listConfig"
      :pageSize="pageSize" :pageIndex="pageIndex" :total="total">
    </MailList>
  </div>
</template>
<script>
import mailApi from "@/api/mail.js";
// import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
export default {
  name: "MailAll",
  data() {
    return {
      allListData: [],
      listConfig: {
        title: "所有消息",
        type: 9
      },
      timer: "",
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
    // 获取分页列表
    getListData() {
      let params = {
        user: this.userId,
        isall: 1, 
        page_size: this.pageSize,
        page_index: this.pageIndex
      };
      mailApi
        .getMail(params)
        .then(res => {
          this.allListData = res.data.data;
          this.total = res.data.total
        })
        .catch(err => {
          this.$message.error(err.message);
          clearInterval(this.timer)
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
.mail-all {
  padding-left: 20px;
  font-size: 14px;
  height: 100%;
}
</style>



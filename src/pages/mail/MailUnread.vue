<template>
  <div class="mail-unread">
    <MailList :tableData="getUnreadList" @refreshList="refreshList" :list-config="listConfig"
      :pageSize="unReadPageSize" :pageIndex="getUnReadPageIndex" :total="getUnReadNum">
    </MailList>
  </div>
</template>
<script>
import mailApi from "@/api/mail.js";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
export default {
  name: "MailUnread",
  data() {
    return {
      listConfig: {
        title: "未读消息",
        type: 0
      },
      timer: ""
    };
  },
  computed: {
    ...mapState('mail', ['unReadNum', 'unReadPageSize', 'unReadPageIndex']),
    ...mapGetters('mail', ['getUnReadNum', 'getUnReadPageIndex']),
    ...mapGetters('mail', ['getUnreadList']),
    userId() {
      return this.$store.state.login.userid;
    }
  },
  components: {
    MailList: () => import("./component/MailList.vue")
  },
  methods: {
    ...mapMutations('mail', ['setUnReadList', 'setUnReadPageSize', 'setUnReadPageIndex']),
    ...mapActions('mail', ['UnReadList']),
    // 获取未读列表
    getListData() {
      this.UnReadList({userId: this.userId})
    },
    // 刷新数据
    refreshList ({pageSize, pageIndex}) {
      this.setUnReadPageSize(pageSize)
      this.setUnReadPageIndex(pageIndex)
      this.getListData()
    }
  },
  mounted() {
    this.getListData()
  },
  beforeDestroy() {
    this.setUnReadList([])
    this.setUnReadPageIndex(1)
  }
};
</script>

<style lang="scss" scoped>
.mail-unread {
  padding-left: 20px;
  font-size: 14px;
  height: 100%;
}
</style>



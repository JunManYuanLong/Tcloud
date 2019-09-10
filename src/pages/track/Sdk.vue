<template>
  <div class="sdk">
    <el-table :data="sdkList" style="width: 100%" stripe v-loading="loading">
      <el-table-column
        :prop="item.prop"
        :label="item.text"
        :min-width="item.minwidth"
        v-for="(item, idx) in labelText"
        :key="idx"
      ></el-table-column>
      <el-table-column prop="downloadUrl" label="下载">
        <template slot-scope="scope">
          <a
            :href="scope.row.downloadUrl"
            download
            target="_blank"
            v-if="scope.row.downloadUrl"
          >{{ scope.row.platform + ' ' + 'SDK接入文档' }}</a>
          <span v-else>无</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="sdkList.length && sdkList.length > 0"
      class="global-pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
import trackApi from "@/api/track.js"
export default {
  data() {
    return {
      loading: false,
      sdkList: [],
      currentPage: 1,
      downloadSdkUrl: "",
      total: 0,
      pageSize: 10,
      labelText: [
        { text: "项目CID", prop: "projectEname" },
        { text: "项目名称", prop: "projectName" },
        { text: "sign_key", prop: "signKey", minwidth: "200" },
        { text: "平台", prop: "platform" }
      ]
    };
  },
  computed: {
    // ...mapGetters("project", ["currentProject"])
  },
  watch: {
    
  },
  methods: {
    getTheSdkList() {
      this.loading = true
      let params = {
        project_id: this.$route.params.projectId / 1,
        page_index: this.currentPage,
        page_size: this.pageSize
      };
      trackApi
        .getSdkList(params)
        .then(res => {
          this.loading = false
          this.sdkList = [];
          this.total = 0;
          if (res.data.code !== 0) {
            this.$message.error(res.data.message);
            return;
          }
          this.sdkList = res.data.data;
          this.total = res.data.total;
        })
        .catch(() => {
          this.loading = false
          this.$message.error(`${err.message}`)
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getTheSdkList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getTheSdkList();
    }
  },
  mounted() {
    // this.getTheSdkList();
  }
};
</script>

<style lang="scss" scoped>
.sdk {
}
</style>

<template>
  <div class="view-track-manage">
    <el-card class="track-card">
      <!--新增按钮-->
      <div class="track-add">
        <el-row class="event-filter">
          <el-col :span="20">
            <div class="filter-item">
              <span>事件名:</span>
              <el-input placeholder="请输入事件名" v-model="search.name" style="width:150px" size="mini"></el-input>
            </div>
            <div class="filter-item">
              <span>平台:</span>
              <el-select
                v-model="search.platform"
                multiple
                size="mini"
                collapse-tags
                placeholder="请选择所属平台"
              >
                <el-option
                  v-for="item in availablePlatformList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
            <div class="filter-item">
              <span>创建人:</span>
              <el-input
                v-model="search.creator"
                placeholder="请输入创建人"
                style="width:120px"
                size="mini"
              ></el-input>
            </div>
            <div class="filter-item">
              <span>更新人:</span>
              <el-input
                v-model="search.updator"
                placeholder="请输入更新人"
                style="width:120px"
                size="mini"
              ></el-input>
            </div>
            <div class="filter-item">
              <el-button type="primary" @click="searchEvent" class="addConfig" size="mini">搜索</el-button>
            </div>
          </el-col>
          <el-col :span="4" style="text-align:right">
            <el-button type="primary" @click="addEvent" class="addConfig" size="mini">新增事件</el-button>
          </el-col>
        </el-row>
      </div>
      <!--列表主体-->
      <div class="track-container">
        <div class="event-list" ref="trackContainer" v-loading="loading">
          <!--事件列表-->
          <collapse-item
            v-for="item in trackList"
            :key="item.id"
            :event-data="item"
            :available-platform-list="availablePlatformList"
            @delEventItem="delEventItem"
            @editHandle="editHandle"
            @refreshData="getTheTrackList"
            @addNewHandle="addNewVersion"
          ></collapse-item>
          <!-- 暂无数据展示 -->
          <div v-if="noData" style="text-align: center">暂无数据</div>
          <!--新增事件-->
          <add-event-item
            @cancelAdd="cancelAdd"
            @refreshTrackList="getTheTrackList"
            v-if="addEventShow"
          ></add-event-item>
        </div>
        <!--tab分页-->
        <el-pagination
          @current-change="handleCurrentChange"
          class="global-pagination"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import trackApi from "@/api/track.js";
import CollapseItem from "./components/CollapseItem.vue";
import AddEventItem from "./components/AddEventItem.vue";
export default {
  name: "trackManage",
  data() {
    return {
      loading: false,
      currentPage: 1,
      pageSize: 8,
      trackList: [],
      total: 0,
      addEventShow: false,
      search: {
        name: "",
        platform: [],
        updator: "",
        creator: ""
      },
      availablePlatformList: [
        { name: "android", id: 1 },
        { name: "ios", id: 2 },
        { name: "javascript", id: 3 },
        { name: "微信小程序", id: 4 },
        { name: "noSdk", id: 5 }
      ]
    };
  },
  computed: {
    projectId() {
      return this.$route.params.projectId / 1;
    },
    noData() {
      return this.trackList.length === 0;
    }
  },
  methods: {
    // 获取列表数据
    getTheTrackList() {
      this.loading = true
      let params = {
        project_id: this.projectId,
        page_index: this.currentPage,
        page_size: this.pageSize
      };
      trackApi.getTrackList(params).then(res => {
        console.log(res)
        this.loading = false
        this.trackList = res.data.data;
        this.total = res.data.total;
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    // 搜索筛选
    searchEvent() {
      this.loading = true
      let params = {
        project_id: this.projectId,
        page_index: 1,
        page_size: this.pageSize,
        name: this.search.name,
        platform: this.search.platform.join(","),
        updator: this.search.updator,
        creator: this.search.creator
      };
      trackApi.getTrackList(params).then(res => {
        console.log(res);
        this.loading = false
        if (res.data.code !== 0) {
          return;
        }
        this.trackList = res.data.data;
        this.total = res.data.total;
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message)
      })
    },
    // 新增事件
    addEvent() {
      this.addEventShow = true;
      setTimeout(() => {
        this.$refs.trackContainer.scrollTop = this.$refs.trackContainer.scrollHeight;
      }, 0);
    },
    // 取消新增
    cancelAdd() {
      this.addEventShow = false;
    },
    // 删除事件
    delEventItem(track) {
      this.$prompt(`您正在删除${track.name}事件，请输入删除理由`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          trackApi
            .deleteTrack(
              {
                deleteComment: value
              },
              track.id
            )
            .then(res => {
              console.log(res);
              this.$message.success("删除成功");
              this.getTheTrackList();
            })
            .catch(err => {
              this.$message.error(err.message);
            });
        })
        .catch(() => {});
    },
    addNewVersion(eventId, params, callback) {
      console.log("params-----", params);
      trackApi
        .addTrack({
          name: params.name,
          description: params.description,
          paramList: params.paramList,
          platformList: params.platformList,
          projectId: this.projectId,
          updateComment: "",
          version: params.version
        })
        .then(res => {
          console.log(res);
          this.$message.success("操作成功");
          this.getTheTrackList();
          callback();
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    // 编辑事件
    editHandle(eventId, params, callback) {
      params.projectId = this.projectId;
      console.log(eventId, params);
      trackApi
        .updateTrack(params, eventId)
        .then(res => {
          this.$message.success("操作成功");
          this.getTheTrackList();
          callback(); // 取消编辑状态
        })
        .catch(err => {
            this.$message.error(err.message);
        });
    },
    // 初始化子组件的状态
    initialList() {
      console.log(this.$children);
    },
    handleCurrentChange(val) {
      this.initialList();
      this.currentPage = val;
      this.getTheTrackList();
    }
  },
  mounted() {
    this.getTheTrackList();
  },
  watch: {},
  filters: {},
  components: {
    CollapseItem,
    AddEventItem
  }
};
</script>

<style lang="less" scoped>
.track-card {
  height: 650px;
  /*头部按钮*/
  .track-add {
    margin-bottom: 20px;
  }
  /*列表主体*/
  .track-container {
    /*事件列表*/
    height: 560px;
    .event-list {
      height: 90%;
      overflow: auto;
    }
    /*tab分页*/
  }
  .event-filter {
    margin-top: 10px;
    .filter-item {
      display: inline-block;
      vertical-align: top;
      margin-right: 10px;
    }
  }
}
</style>
<style lang="less">
.view-track-manage .el-collapse-item {
  position: relative;
  .hanlde-btn {
    z-index: 1000;
    position: absolute;
    right: 100px;
    top: 10px;
  }
  .el-collapse-item__header {
    line-height: 0px;
    background-color: #f0f2f5;
  }
  .el-form-item {
    margin: 0 0 0 20px;
  }
}
</style>

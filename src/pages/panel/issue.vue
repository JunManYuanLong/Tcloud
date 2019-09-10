<template>
  <div class="iTaskList">
    <div :style="{'margin-left': '15px','line-height': '55px'}">
      版本：
      <el-select v-model="lastversion" @change="changeversion(lastversion)">
        <el-option v-for="item in versionList" :key="item.id" :label="item.title" :value="item.id"></el-option>
      </el-select>
      <el-button @click="swithuser" :type="userprimary? 'primary' :''">我的问题</el-button>
      <el-button @click="swithdate" :type="dateprimary? 'primary' :''">最近更新</el-button>
    </div>
    <section class="main panel-wrap">
      <div class="container" style="margin-left:8px;font-size:14px;">
        <div class="drag-box" :style="{width: 320*issueSetSort.length + 'px'}">
          <div class="drag-box-item" v-for="key in issueSetSort" :key="key">
            <div class="item-title">{{getPanelItemData(key).length}} {{issueSet.status[key]}}</div>
            <draggable
              :list="getPanelItemData(key)"
              @remove="removeHandle"
              :move="onMove"
              @start="isDragging=true"
              @end="isDragging=false"
              :options="dragOptions"
            >
              <transition-group tag="div" :id="key" class="item-ul">
                <div
                  v-for="item in getPanelItemData(key)"
                  class="drag-list"
                  :key="item.issueid"
                  @click="toDetailFun(item)"
                >
                  <div :style="{display: 'flex','justify-content':'space-between'}">
                    <span class="case-link">{{item.issue_number}}—</span>
                    <span
                      :style="{'font-weight': 'bold', 'color': item.priority==0 ? '#ed4014' : item.priority==1 ?'#ff9900' : item.priority==2 ?'#2db7f5' :'#909399'}"
                    >{{priority[item.priority]}}</span>
                    <div
                      :style="{color:'#409eff', 'margin-left': 'auto'}"
                    >{{item.handler.length>0 ? item.handler[0].name : ''}}</div>
                  </div>
                  <span style="font-size: 14px;font-family: Arial">{{item.title}}</span>
                </div>
              </transition-group>
            </draggable>
          </div>
        </div>
      </div>
    </section>
    <!-- <div v-if="issueDetailDrawer"> -->
      <issueDetail v-model="issueDetailDrawer" :issueData="issueDetail" :drawerStyle="drawerStyle" @data-change="initTableData" @data-delete="initTableData"></issueDetail>
    <!-- </div> -->
  </div>
</template>
<script>
import draggable from "vuedraggable";
import issueApi from "@/api/issue.js";
import versionApi from "@/api/version.js";
import issueDetail from "@/pages/panel/issueDetail.vue";
import panelApi from "@/api/panel.js";
import setApi from "@/api/settingType.js";

export default {
  name: "panelIssue",
  data() {
    return {
      tData: [],
      dragOptions: {
        animation: 120,
        scroll: true,
        sort: false,
        group: "sortlist",
        ghostClass: "ghost-style"
      },
      todo: [],
      doing: [],
      testing: [],
      done: [],
      isDragging: false,
      delayedDragging: false,
      issueids: "",
      lastversion: "",
      value: "",
      userprimary: false,
      dateprimary: false,
      issueDetailDrawer: false,
      issueDetail: {},
      drawerStyle: {
        width: "900px"
      },
      issueSetSort: []
    };
  },
  components: {
    draggable,
    issueDetail
  },
  computed: {
    projectId() {
      return parseInt(this.$route.params.projectId);
    },
    userid() {
      return parseInt(this.$store.state.login.userid);
    },
    versionList() {
      return this.$store.state.project.versionList;
    },
    lastV() {
      let l = "";
      if (this.versionList && this.versionList.length > 0) {
        l = this.versionList[0].id;
      }
      return l;
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
    priority(){
      return this.issueSet.priority
    }
  },
  methods: {
    toDetailFun(row) {
      console.log("rowclic", row);
      this.issueDetailDrawer = true;
      console.log("toEditpage", row);
      this.issueDetail = row;
    },
    removeHandle(event) {
      console.log("removehandle", event);
      console.log("removeHandle===============");
      console.log(event.to.id);
      const fid = parseInt(event.to.id);
      this.updateStatus(this.issueids, fid);
    },
    end(evt) {
      this.isDragging = false;
      console.log("event");
      console.log(evt);
      evt.newIndex  // 可以知道拖动后的位置
    },
    onMove(evt) {
      console.log("onMove===============");
      this.issueids = evt.draggedContext.element.issueid;
      console.log("onmoveevt", evt);
      const issueid = evt.draggedContext.element.issueid;
      const fid = parseInt(evt.to.id);
    },
    updateStatus(issueid, status) {
      issueApi.updateIssueStatus(issueid, { handle_status: status }).then(
        res => {
          this.initTableData();
          this.$message.success("操作成功");
        },
        error => {
          this.initTableData();
          this.$message.error("操作失败：" + error.message);
        }
      );
    },

    swithuser() {
      console.log("user:" + this.userprimary);
      if (this.userprimary) {
        this.userprimary = false;
      } else {
        this.userprimary = true;
      }
      this.initTableData();
    },
    swithdate() {
      console.log("date:" + this.dateprimary);
      if (this.dateprimary) {
        this.dateprimary = false;
      } else {
        this.dateprimary = true;
      }
      this.initTableData();
    },

    changeversion(lastversion) {
      console.log("changeversion");
      console.log(lastversion);
      this.lastversion = lastversion;
      this.initTableData();
    },
    fun_date(date) {
      var date1 = new Date(),
        time1 =
          date1.getFullYear() +
          "-" +
          (date1.getMonth() + 1) +
          "-" +
          date1.getDate(); //time1表示当前时间
      var date2 = new Date(date1);
      date2.setDate(date1.getDate() + date);
      var time2 =
        date2.getFullYear() +
        "-" +
        (date2.getMonth() + 1) +
        "-" +
        date2.getDate();
      return time2;
    },
    compare(property) {
      return function(a, b) {
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
      };
    },

    initTableData() {
      console.log("initTableData");
      var data = { project_id: this.projectId, ispaginate:1 };
      if (this.lastversion) {
        data.versionid = parseInt(this.lastversion);
      }
      if (this.userprimary) {
        data["user"] = this.userid;
      }
      if (this.dateprimary) {
        console.log("datetime - 3=" + this.fun_date(-7));
        data["start_time"] = this.fun_date(-7);
        data["end_time"] = this.fun_date(1);
      }
      console.log(data);
      issueApi.getIssueList(data).then(res => {
        this.tData = res.data.data;
      });
    },
    getPanelItemData(status) {
      let list = this.tData.filter(item => {
        if (item.handle_status == status) {
          return item;
        }
      });
      list = list.sort(this.compare("priority"));
      return list;
    },
    getPanelSet() {
      panelApi.getPanelSet(this.projectId).then(
        res => {
          let data = res.data.data[0];
          this.issueSetSort = data.issue_sort;
          // }
        },
        error => {
          this.$message.error(error.message);
        }
      );
    },
  },
  created() {
    // this.getIssueSetType();
    console.log("created===============!");
    this.getPanelSet();
  },
  watch: {
    isDragging(newValue) {
      if (newValue) {
        this.delayedDragging = true;
        return;
      }
      this.$nextTick(() => {
        this.delayedDragging = false;
      });
    },
    lastV(val) {
      this.lastversion =
        this.versionList && this.versionList.length > 0
          ? this.versionList[0].id
          : "";
      this.initTableData();
    },
    $route() {
      //监听路由变化
      this.initTableData();
    }
  },
  mounted() {
    console.log("mounted===============!");
    // if(this.lastversion){
    if (this.versionList && this.versionList.length > 0) {
      this.lastversion =
        this.versionList && this.versionList.length > 0
          ? this.versionList[0].id
          : "";
      this.initTableData();
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  margin-left: 8px;
  font-size: 14px;
  overflow: auto;
}
.drag-box {
  display: flex;
  user-select: none;
  flex-wrap: nowrap;
  overflow-x: auto;
}
.drag-box-item {
  /*  flex: 1;
        max-width: 400px;
        min-width: 300px; */
  width: 320px;
  background-color: #eff1f5;
  margin-right: 16px;
  border-radius: 6px;
  border: 1px #e1e4e8 solid;
}
.item-title {
  padding: 8px 8px 8px 12px;
  font-size: 14px;
  line-height: 1.5;
  color: #24292e;
  font-weight: 600;
}
.item-ul {
  padding: 0 8px 8px;
  min-height: 550px;
  height: 580px;
  overflow-y: scroll;
}
.item-ul::-webkit-scrollbar {
  width: 0;
}
.drag-list {
  border: 1px #e1e4e8 solid;
  padding: 10px;
  margin: 5px 0 10px;
  list-style: none;
  background-color: #fff;
  border-radius: 6px;
  cursor: pointer;
  -webkit-transition: border 0.3s ease-in;
  transition: border 0.3s ease-in;
}
.drag-list:hover {
  border: 1px solid #20a0ff;
}
.drag-title {
  font-weight: 400;
  line-height: 25px;
  margin: 10px 0;
  font-size: 22px;
  color: #1f2f3d;
}
.ghost-style {
  display: block;
  color: transparent;
  border-style: dashed;
}
.case-link {
  cursor: pointer;
  color: #409eff;
}
</style>

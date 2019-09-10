<template>
  <div class="iTaskList">
    <div :style="{'margin-left': '15px','line-height': '55px'}">
      版本：
      <el-select v-model="lastversion" @change="changeversion(lastversion)">
        <el-option v-for="item in versionList" :key="item.id" :label="item.title" :value="item.id"></el-option>
      </el-select>
      <el-button @click="swithuser" :type="userprimary? 'primary' :''">我的需求</el-button>
      <el-button @click="swithdate" :type="dateprimary? 'primary' :''">最近更新</el-button>
    </div>
    <section class="main">
      <div class="crumbs"></div>
      <div class="container">
        <div class="drag-box" :style="{width: 320*requirementSort.length + 'px'}">
          <div class="drag-box-item" v-for="key in requirementSort" :key="key">
            <div class="item-title">{{getPanelItemData(key).length}} {{requirementSet[key]}}</div>
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
                  :key="item.id"
                  @click="toDetailFun(item)">
                  <div :style="{display: 'flex','justify-content':'space-between'}">
                    <span class="case-link">P{{item.id}}</span>
                    <!--<span :style="{'font-weight': 'bold', 'color': item.priority==0 ? '#ed4014' : item.priority==1 ?'#ff9900' : item.priority==2 ?'#2db7f5' :'#909399'}">{{getPriority(item.priority)}}</span>-->
                    <div :style="{color:'#409eff','margin-left': 'auto'}">{{item.handler_name}}</div>
                  </div>
                  <span style="font-size: 14px;font-family: Arial">{{item.title}}</span>
                  <div class="sub-task-num">
                    <i class="el-icon-tickets"></i>
                    {{ item.active_status || '0/0' }}
                  </div>
                </div>
              </transition-group>
            </draggable>
          </div>
        </div>
      </div>
    </section>
      <requirementDetail
        v-model="requirementDrawer"
        :requireData="requirementDetail"
        :drawerStyle="drawerStyle"
        @data-change="initTableData"
        @data-delete="initTableData"
        @refresh-list="initTableData"
      ></requirementDetail>
  </div>
</template>
<script>
import draggable from "vuedraggable";
import issueApi from "@/api/issue.js";
import versionApi from "@/api/version.js";
import requirementApi from "@/api/requirement.js";
import requirementDetail from "@/pages/requirement/requirementDetail";
import panelApi from "@/api/panel.js";

export default {
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
      publish: [],
      accept: [],
      isDragging: false,
      delayedDragging: false,
      issueids: "",
      lastversion: "",
      value: "",
      userprimary: false,
      dateprimary: false,
      requirementDrawer: false,
      requirementDetail: {},
      drawerStyle: {
        width: "910px"
      },
      requirementSet: {},
      requirementSort: []
    };
  },
  components: {
    draggable,
    requirementDetail
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
    }
  },
  methods: {
    toDetailFun(row) {
      console.log("rowclic", row);
      // this.requirementDrawer = true
      // console.log('toEditpage', row)
      // this.requirementDetail = row
      //查询单个需求的详情，传递给组件，因为列表中没有case_ids字段
      requirementApi.getDetailById(row.id).then(
        res => {
          if (res.data.code === 0) {
            console.log("rq-detail", res.data.data[0]);
            this.requirementDrawer = true;
            this.requirementDetail = res.data.data[0];
          }
        },
        err => {}
      );
    },
    requirementDelete() {},

    removeHandle(event) {
      console.log(event);
      console.log(event.to.id);
      const fid = parseInt(event.to.id);
      this.updateStatus(this.issueids, fid);
    },
    onMove(evt) {
      this.issueids = evt.draggedContext.element.id;
      console.log(evt);
      const issueid = evt.draggedContext.element.id;
      const fid = parseInt(evt.to.id);
    },
    updateStatus(mid, status) {
      requirementApi.updateBoardStatus(mid, { board_status: status }).then(
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

    initTableData() {
      console.log("initTableData");
      var data = { project_id: this.projectId , ispaginate:1};
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
      requirementApi.getRequirementListNew(data).then(res => {
        this.tData = res.data.data;
        // this.todo = res.data.data.filter((item, index, data) => {
        //   return item.board_status == 0
        // });
        // this.doing = res.data.data.filter((item, index, data) => {
        //   return item.board_status == 1
        // });
        // this.testing = res.data.data.filter((item, index, data) => {
        //   return item.board_status == 2
        // });
        // this.accept = res.data.data.filter((item, index, data) => {
        //   return item.board_status == 4
        // });
        // this.publish = res.data.data.filter((item, index, data) => {
        //   return item.board_status == 5
        // });
        // this.done = res.data.data.filter((item, index, data) => {
        //   return item.board_status == 6
        // });
      });
    },
    getPanelItemData(status) {
      let list = this.tData.filter(item => {
        if (item.board_status == status) {
          return item;
        }
      });
      return list;
    },
    getPanelSet() {
      panelApi.getPanelSet(this.projectId).then(
        res => {
          let data = res.data.data[0];
          // if(data.hasconfig){
          this.requirementSet = data.requirement;
          this.requirementSort = data.requirement_sort;
          // }
        },
        error => {
          this.$message.error(error.message);
        }
      );
    }
  },
  created() {
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
    $route() {
      //监听路由变化
      this.initTableData();
    }
  },
  mounted() {
    this.lastversion =
      this.versionList && this.versionList.length > 0
        ? this.versionList[0].id
        : "";
    this.initTableData();
  }
};
</script>
<style scoped>
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
    min-width: 200px; */
  width: 320px;
  background-color: #eff1f5;
  margin-right: 10px;
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

.sub-task-num {
  margin-top: 10px;
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

<template>
  <div class="top-bar">
    <el-popover placement="bottom" trigger="hover" class="self-info" v-model="visible">
      <div class="all-read">
        <el-button type="text" @click="allRead" style="margin-left: 100px;" v-if="hasMail">全部标记已读</el-button>
      </div>
      <!-- 提示 -->
      <div v-if="!hasMail" style="padding-top: 10px; text-align: center;">您没有收到任何消息</div>
      <!-- 消息列表 -->
      <ul class="mail-box">
        <li class="mail-item" v-for="item in listData" :key="item.id" @click="showDetail(item)">
          <el-badge is-dot class="item-dot" :class="{hidden: item.status == 1}"></el-badge>
          <p>{{item.content}}</p>
        </li>
      </ul>
      <!-- 获取更多 -->
      <div class="get-more" @click="visible = false">
        <router-link :to="{name: 'mail'}">{{hasMail ? '查看更多...' : '进入消息中心'}}</router-link>
      </div>
      <!-- 顶部栏按钮 -->
      <p slot="reference" class="top-button">
        <el-badge :is-dot="true" class="item" :hidden="!showDot">
          <i class="fa el-icon-bell"></i>
        </el-badge>
        <!-- <el-badge :value="12" class="item">
          <i class="fa el-icon-bell"></i>
        </el-badge> -->
        <span>消息通知</span>
      </p>
    </el-popover>
  </div>
</template>

<script>
import mailApi from "@/api/mail.js";
import wsConfig from "@/api/websocket.js";
export default {
  name: "TopBar",
  data() {
    return {
      listData: [],
      // dialogVisible: false,
      content: "",
      create_time: "",
      showDot: false,
      timer: "",
      visible: false,
      hasMail: false,
      over: null,
      unreadNum: 0
    };
  },
  computed: {
    userId() {
      return this.$store.state.login.userid;
    }
  },
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
          this.getList();
        })
        .catch(err => {});
    },
    // 获取最近五条数据
    getList() {
      let params = {
        user: this.userId
      };
      mailApi
        .getMail(params)
        .then(res => {
          this.listData = res.data.data;
          this.hasMail = this.listData.length > 0;
          this.showDot = this.listData.some(item => {
            return item.status === 0;
          });
        })
        .catch(err => {
          this.$message.error(err.message);
          clearInterval(this.timer);
        });
    },
    // 关闭详情
    closeDetail() {
      this.dialogVisible = false;
      this.content = "";
      this.create_time = "";
    },
    // 查看详情
    showDetail(item) {
      this.changeStatus(item.id);
      this.content = item.content;
      this.create_time = item.create_time;
      this.open();
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
          this.getList();
        })
        .catch(err => {});
    },
    open() {
      this.$alert(
        `<div class="dialog-box" style="text-align: left; display: flex; justify-content: center; padding: 15px 10px;">
        <div style="width: 100px;">内容：</div>
        <pre style="width: 450px;white-space: pre-wrap;word-wrap: break-word;">${
          this.content
        }</pre>
      </div>
      <div class="dialog-box" style="text-align: left; display: flex; justify-content: center; padding: 15px 10px;">
        <div style="width: 100px;">创建时间：</div>
        <p style="width: 450px;">${this.create_time}</p>
      </div>`,
        "消息详情",
        {
          dangerouslyUseHTMLString: true
        }
      );
    },
    // webSocket
    websocket() {
      let ws = new WebSocket(`${wsConfig.baseUrl}/v1/ws/message?user=${this.userId}`);
      // 建立 web socket 连接成功触发事件
      ws.onopen = (evt) => {
        ws.send('success')  // 通知服务端链接成功
      };
      // 接收服务端数据时触发事件
      ws.onmessage = (evt) => {
        let data = JSON.parse(evt.data)
        if (data.code === 0) {
          this.getList() // 未读有变化
        }
      };
      // web socket 关闭
      ws.onclose = () => {
        console.log("连接已关闭...");
      };
      this.over = () => {
        ws.close();
      };
    }
  },
  created() {
    // 启动websocket
    this.websocket();
    this.getList()
  },
  watch: {
    '$route' (val) {
      // this.getList()
    }
  },
  beforeDestroy() {
    // this.over();
  }
};
</script>

<style lang="scss" scoped>
.top-bar {
  padding: 8px;
  cursor: pointer;
  color: white;
  font-size: 14px;
  .self-info {
    .el-popover__reference {
      color: #fff;
      font-size: 14px;
      cursor: pointer;
    }
    .fa {
      color: #317ffe;
      font-size: 23px;
      margin-right: 5px;
    }
    .top-button {
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
  }
}
/* 全部标记已读 */
.all-read {
  text-align: right;
  padding-right: 20px;
}
/* 消息列表 */
ul.mail-box {
  padding: 10px;
  li.mail-item {
    display: flex;
    justify-content: space-between;
    padding: 5px;
    cursor: pointer;
    &:hover {
      background-color: #f5fafe;
    }
    .item-dot {
      padding-top: 3px;
    }
    & > p {
      width: 300px;
      padding-left: 10px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
/* 获取更多 */
.get-more {
  text-align: center;
  padding: 0 0 15px 0;
  cursor: pointer;
}
.hidden {
  visibility: hidden;
}
</style>
<style>
.el-message-box {
  width: 600px !important;
}
.top-button .el-badge__content.is-fixed.is-dot {
  right: 10px;
}
</style>




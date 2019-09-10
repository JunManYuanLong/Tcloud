<template>
  <div>
    <el-card class="box-card">
      <div class="q-crumb">
        <i class="q-icon fa fa-keyboard-o"></i>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>反馈列表</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <ul class="feedback-list">
        <li v-for="item in feedbackList" :key="item.id">
          <p class="des">
            <label>描述：</label>
            {{item.comment}}
          </p>
          <p class="cont">
            <label>联系方式：</label>
            {{item.contact}}
          </p>
        </li>
      </ul>
    </el-card>
  </div>
</template>
<script>
import feedbackApi from "@/api/feedback.js";
export default {
  data() {
    return {
      feedbackList: []
    };
  },
  computed: {
    userId() {
      return this.$store.state.login.userid;
    }
  },
  methods: {
    cancelFun() {
      this.$router.go(-1); //返回上一层
    },
    getFeedbackList() {
      feedbackApi.getFeedback().then(res => {
        this.feedbackList = res.data.data;
      });
    }
  },
  created() {
    this.getFeedbackList();
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
.feedback-list {
  text-align: left;
  padding: 10px 0;
  li {
    padding: 15px 20px;
    border: 1px solid #eee;
    margin-bottom: 15px;
    label {
      display: inline-block;
      width: 60px;
    }
  }
  .des {
    font-size: 16px;
    color: #333;
  }
  .cont {
    margin-top: 8px;
    font-size: 12px;
    color: #999;
  }
}
</style>

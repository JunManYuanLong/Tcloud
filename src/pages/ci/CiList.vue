<template>
  <div class="project-box">
    <div class="item" v-for="item in ciListData" :key="item.id" @click="checkdetail(item)">
      <dl class="main-des">
        <dt>{{item.description}}</dt>
        <dd>{{item.name}}</dd>
      </dl>
      <ul class="opts">
        <li class="accuracy-btn">
          <p>正确率 :</p>
          {{gainaccuracy(item.accuracy)}}
        </li>
        <li class="case—count-btn">
          <p>用例总数 :</p>
          {{item.case_count}}
        </li>
      </ul>
      <div class="detail-btn">
        <i class="el-icon-view"></i>查看详情
      </div>
    </div>
  </div>
</template>
<script>
import userApi from "@/api/user.js";
import axios from "axios";
import projectApi from "@/api/project.js";
import ciApi from "@/api/ci.js";

export default {
  data() {
    return {
      ciListData: []
    };
  },
  computed: {},
  methods: {
    gainaccuracy(item) {
      let num = Number(item * 100);
      let numStr = num.toString();
      if (numStr.indexOf(".") != -1 && numStr.split(".")[1] > 100) {
        num = num.toFixed(2);
      }
      return num + "%";
    },
    checkdetail(item) {
      console.log(item)
      this.$router.push({
        name: "ciedit",
        params: {
          jobId: item.id,
          description: item.description
        }
      });
    },
    cancelFun() {
      this.$router.go(-1); //返回上一层
    },
    getciData() {
      ciApi.ciList().then(res => {
        this.ciListData = res.data.data;
      });
    },
    $resize () {
      this.winHeight = window.innerHeight - 66
    }
  },
  mounted(){
    window.addEventListener('resize', this.$resize, true)
  },
  beforeDestroy(){
    window.removeEventListener("resize", this.$resize);
  },
  created() {
    this.getciData();
  }
};
</script>
<style lang="scss" scoped>
.addForm {
  width: 500px;
}
.project-box {
  display: flex;
  margin: 20px auto;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding-left: 39px;
  align-items: flex-start;
  .item {
    height: 180px;
    min-width: 308px;
    max-width: 308px;
    box-sizing: border-box;
    position: relative;
    box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 4px 0px;
    cursor: pointer;
    margin: 0px 0px 16px 16px;
    padding: 16px;
    background: rgb(255, 255, 255);
    border-radius: 3px;
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1) 0s;
    text-align: left;
    &:hover {
      box-shadow: rgba(25, 25, 26, 0.08) 0px 6px 28px -3px,
        rgba(0, 0, 0, 0.05) 0px 3px 9px -1px;
    }
    .main-des {
      dt {
        color: #333;
        font-size: 16px;
        font-weight: 700;
        margin-bottom: 5px;
      }
      dd {
        color: #999;
        font-size: 14px;
      }
    }
    .opts {
      list-style: none;
      display: flex;
      justify-content: space-between;
      margin-top: 15px;
      padding-bottom: 0px;
      li {
        font-size: 30px;
        &.case—count-btn {
          color: #11d847;
        }
        &.accuracy-btn {
          color: #f56c6c;
        }
        p {
          font-size: 12px;
          color: #999;
        }
      }
    }
  }
  .detail-btn {
    position: absolute;
    bottom: 5px;
    right: 16px;
    text-align: right;
    font-size: 14px;
    color: #27a9e3;
  }
}
</style>

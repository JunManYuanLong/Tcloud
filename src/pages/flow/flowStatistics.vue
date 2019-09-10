<template>
    <div class="dashboard-page">
      <div class="select-wrap">
        <div class="date-select">
        <label>日期：</label>
        <el-date-picker
          v-model="date"
          type="daterange"
          align="right"
          format="yyyy-MM-dd"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions">
        </el-date-picker>
      </div>
      </div>
      <div class="flow-type-charts-wrap">
        <div class="chart-item">
          <ve-line :data="flowLineData" :extend="chartExtend" :settings="flowLineSettings"></ve-line>
        </div>
      </div>
      <!-- <div class="flow-charts-wrap">
        <div class="chart-item">
          <ve-histogram :data="flowHistogramData" :settings="histogramSettings"></ve-histogram>
        </div>
      </div> -->

        <div class="title-bar">流程类型统计</div>
          <div class="flow-charts-wrap">
            <div class="chart-item">
              <ve-pie :data="flow_assemble_sum"></ve-pie>
            </div>
            <div class="chart-item">
              <ve-pie :data="flow_type_sum"></ve-pie>
            </div>
        </div>

        <div class="title-bar">流程节点平均耗时统计</div>
          <div class="flow-type-charts-wrap">
            <div v-if="flow_type_detail1.rows!=''" class="chart-item">
              <ve-histogram :data="flow_type_detail1" :settings="flowTypeDetail1Settings1"></ve-histogram>
            </div>
            <div v-if="flow_type_detail2.rows!=''"  class="chart-item">
              <ve-histogram :data="flow_type_detail2" :settings="flowTypeDetail1Settings2"></ve-histogram>
            </div>
            <div v-if="flow_type_detail3.rows!=''"  class="chart-item">
              <ve-histogram :data="flow_type_detail3" :settings="flowTypeDetail1Settings3"></ve-histogram>
            </div>
            <div v-if="flow_type_detail4.rows!=''"  class="chart-item">
              <ve-histogram :data="flow_type_detail4" :settings="flowTypeDetail1Settings4"></ve-histogram>
            </div>
            <div v-if="flow_type_detail5.rows!=''"  class="chart-item">
              <ve-histogram :data="flow_type_detail5" :settings="flowTypeDetail1Settings5"></ve-histogram>
            </div>
        </div>
        <div class="title-bar">团队管理</div>
          <div class="flow-type-charts-wrap">
            <div v-if="flow_test_count.rows!=''"  class="chart-item">
              <ve-histogram :data="flow_test_count" :extend="chartExtend" :settings="flow_test_countSettings"></ve-histogram>
            </div>
        </div>

    </div>
</template>
<script>
import moment from 'moment'
import flowApi from '@/api/flow.js'
const endDate = new Date();
const startDate = new Date();
startDate.setTime(startDate.getTime() - 3600 * 1000 * 24 * 90);
  export default{
    data() {
      this.flowLineSettings =  {
        labelMap: {
          'count': '流程新增数',
        },
        yAxisName:['数量']
      };
      this.chartExtend = {
        xAxis: {
          axisLabel: {
            rotate: 45
          }
        }
      };
      this.histogramSettings = {
        stack: { '时间': ['total_time','test_time']},
        labelMap: {
          'total_time': '流程耗时',
          'test_time':'流程测试步骤耗时'
        },
        yAxisName:['时间(h)']
      };
      this.flowTypeDetail1Settings1 = {
        stack: { '时间': ['time']},
        labelMap: {
          'time':'客户端流程平均耗时'
        },
        yAxisName:['时间(h)']
      };
      this.flowTypeDetail1Settings2 = {
        stack: { '时间': ['time']},
        labelMap: {
          'time':'H5&服务端流程平均耗时'
        },
        yAxisName:['时间(h)']
      };
      this.flowTypeDetail1Settings3 = {
        stack: { '时间': ['time']},
        labelMap: {
          'time':'SkipTest流程平均耗时'
        },
        yAxisName:['时间(h)']
      };
      this.flowTypeDetail1Settings4 = {
        stack: { '时间': ['time']},
        labelMap: {
          'time':'HotFix流程平均耗时'
        },
        yAxisName:['时间(h)']
      };
      this.flowTypeDetail1Settings5 = {
        stack: { '时间': ['time']},
        labelMap: {
          'time':'HotFix(需QA验证)流程平均耗时'
        },
        yAxisName:['时间(h)']
      };
      this.flow_test_countSettings = {
        labelMap: {
          'count':'流程数'
        },
        yAxisName:['数量']
      }

      return {
        date:[startDate,endDate],
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        flowLineData:{
          columns: ['date', 'count'],
          rows: [
          ]
        },
        flowHistogramData:{
          columns: ['name', 'total_time','test_time'],
          rows: [
          ]
        },
        flow_type_sum:{
          columns: ['flow_type', 'count'],
          rows: [
          ]
        },
        flow_assemble_sum:{
          columns: ['flow_assemble', 'count'],
          rows: [
          ]
        },
        flow_type_detail1:{
          columns: ['name', 'time'],
          rows: [
          ]
        },
        flow_type_detail2:{
          columns: ['name', 'time'],
          rows: [
          ]
        },
        flow_type_detail3:{
          columns: ['name', 'time'],
          rows: [
          ]
        },
        flow_type_detail4:{
          columns: ['name', 'time'],
          rows: [
          ]
        },
        flow_type_detail5:{
          columns: ['name', 'time'],
          rows: [
          ]
        },
        flow_test_count:{
          columns: ['nickname', 'count'],
          rows: [
          ]
        },
        
      }
    },
    computed:{
      projectId(){
        return this.$route.params.projectId
      },
    },
    watch:{
      'date':{
        handler:function(val){
          if(val){
            let start = moment(val[0]).format("YYYY-MM-DD")
            let end = moment(val[1]).format("YYYY-MM-DD")
            this.getDashData(start,end)
          }else{
            this.getDashData('','')
          }
        },
        deep:true
      },
      $route() {
      //监听路由变化
      this.getDashData()
    }
    },
    methods:{
      getDashData(start,end){
        let params= {
          project_id:parseInt(this.projectId),
          start_date:start,
          end_date:end
        }
        //接口请求
        flowApi.getFlowStatistics(params).then(res=>{
          let data = res.data.data
          this.flowLineData.rows = data.flow_add
          this.flowHistogramData.rows = data.flow_average
          this.flow_type_sum.rows = data.flow_type_sum
          this.flow_assemble_sum.rows = data.flow_assemble_sum
          this.flow_type_detail1.rows = data.flow_type_detail.flow_1
          this.flow_type_detail2.rows = data.flow_type_detail.flow_2
          this.flow_type_detail3.rows = data.flow_type_detail.flow_3
          this.flow_type_detail4.rows = data.flow_type_detail.flow_4
          this.flow_type_detail5.rows = data.flow_type_detail.flow_5
          this.flow_test_count.rows = data.end_flow_count
          console.log('flow_type_detail3.rows:' + this.flow_type_detail3.rows)
          console.log('flow_type_detail4.rows:' + this.flow_type_detail4.rows)
        },error=>{
          this.$message.error(error.message)
        })
      }
    },
    created(){
      if(this.date){
        let start = moment(this.date[0]).format("YYYY-MM-DD")
        let end = moment(this.date[1]).format("YYYY-MM-DD")
        this.getDashData(start,end)
      }
    }
  }
</script>
<style lang="scss">
.dashboard-page{
  .select-wrap{
    padding:20px;
    display:flex;
    margin-bottom:10px;
  }
  .flow-charts-wrap{
    padding:0 20px;
    display:flex;
    justify-content:flex-start;
    flex-wrap:wrap;
    .chart-item{
      width:40%;
      margin-bottom:10px;
      margin-right:40px;
    }
  }

  .flow-type-charts-wrap{
    padding:0 20px;
    display:flex;
    justify-content:flex-start;
    flex-wrap:wrap;
    .chart-item{
      width:80%;
      margin-bottom:10px;
      margin-right:40px;
    }
  }

  .title-bar{
    margin:10px 0 20px 20px;
    padding:5px 14px;
    border-left:3px solid #1b73ff;
    background:linear-gradient(left,  #d1ecff, #ffffff);
    em{
      color:#008bef;
    }
  }
}
</style>

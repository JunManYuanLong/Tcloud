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
    <div class="title-bar">issue统计<span>（总数：<em>{{countData.issue}}</em>）</span></div>
    <div class="charts-wrap">
      <div class="chart-item">
        <ve-line :data="issueLineData" :settings="issueLineSettings"></ve-line>
      </div>
      <div class="chart-item">
        <ve-histogram :data="issueHistogramData" :settings="histogramSettings"></ve-histogram>
      </div>
      <div class="chart-item">
        <ve-pie :data="issuePieData"></ve-pie>
      </div>
    </div>

    <div class="title-bar">issue版本质量走势<span>（总数：<em>{{countData.issue}}</em>）</span></div>
    <div class="charts-wrap">
      <div class="chart-item">
        <ve-line :data="issueLineRankData" :settings="issueLineRankSettings"></ve-line>
      </div>
    </div>

    <div class="title-bar">需求统计<span>（总数：<em>{{countData.requirement}}</em>）</span></div>
    <div class="charts-wrap">
      <div class="chart-item">
        <ve-line :data="rqLineData" :settings="rqLineSettings"></ve-line>
      </div>
    </div>
    <div class="title-bar">任务统计<span>（任务总数：<em>{{countData.task}}</em>个，执行用例：<em>{{countData.taskCase}}</em>条）</span></div>
    <div class="charts-wrap">
      <div class="chart-item">
        <ve-line :data="taskCaseLineData" :settings="tkLineSettings"></ve-line>
      </div>
    </div>
     <div class="title-bar">团队管理</div>
    <div class="charts-wrap-group">
      <div class="chart-item">
        <ve-histogram :data="teamWorkData" :extend="chartExtend" :settings="teamWorkSettings"></ve-histogram>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import projectApi from '@/api/project.js'
const endDate = new Date();
const startDate = new Date();
startDate.setTime(startDate.getTime() - 3600 * 1000 * 24 * 90);
  export default{
    data() {
      this.chartExtend = {
        xAxis: {
          axisLabel: {
            rotate: 45
          }
        }
      };
      this.issueLineSettings =  {
        labelMap: {
          'count': 'issue总数',
          'open':'issue 打开数',
        },
        yAxisName:['数量']
      };
			this.issueLineRankSettings = {
				labelMap:{
					'rank':'issue 分数',
				},
        yAxisName:['评分']
			};
      this.rqLineSettings =  {
        labelMap: {
          'count': '需求总数'
        },
        yAxisName:['数量']
      };
      this.tkLineSettings =  {
        labelMap: {
          'count': '任务总数'
        },
        yAxisName:['数量']
      };
      this.histogramSettings = {
        stack: { 'issue数': ['count','open'] },
        labelMap: {
          'count': 'issue总数',
          'open':'issue 打开数'
        },
        yAxisName:['数量']
      };
      this.teamWorkSettings = {
        stack: { '数量': ['case_count', 'issue_count'] },
        labelMap: {
          'case_count':'case 总数',
          'issue_count': 'issue 总数'
        },
        yAxisName:['数量']
      };
      return {
        date:[startDate,endDate],
        countData:{
          issue:'',
          requirement:'',
          task:'',
          taskCase:''
        },
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
        issueLineData:{
          columns: ['version_title', 'count', 'open'],
          rows: [
          ]
        },
				issueLineRankData:{
				columns: ['version_title','rank'],
				rows: [
				]
				},
        teamWorkData:{
          columns: ['nickname', 'case_count','issue_count'],
          rows: [
          ]
        },issueHistogramData:{
          columns: ['version_title', 'count','open'],
          rows: [
          ]
        },
        issuePieData:{
          columns: ['handle_status', 'count'],
          rows: [
          ]
        },
        rqLineData:{
          columns: ['version_title', 'count'],
          rows: [
          ]
        },
        taskCaseLineData:{
          columns: ['version_title', 'count'],
          rows: [
          ]
        }
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
      getIssueStatus(type){
        let text = ''
        switch(type){
          case 1:
          text = '待办';
          break;
          case 2:
          text = '修复中';
          break;
          case 3:
          text = '测试中';
          break;
          case 4:
          text = '已关闭';
          break;
          case 5:
          text = '已拒绝';
          break;
          case 6:
          text = '延时处理';
          break;
        }
        return text
      },
      getDashData(start,end){
        let params= {
          start_time:start,
          end_time:end
        }
        projectApi.getDashboardData(this.projectId,params).then(res=>{
          let data = res.data.data[0]
          let issueData = data.issue_info.reverse()
          let rqData = data.requirement_info.reverse()
          let taskCaseData = data.task_info.reverse()
          let issueStatus = data.issue_status.filter(item=>{
            item.handle_status = this.getIssueStatus(item.handle_status)
            return item
          })
          let teamWorkData = data.tester_data.reverse()
          this.countData.issue = data.issue_sum
          this.countData.requirement = data.requirement_sum
          this.countData.task = data.task_sum
          this.countData.taskCase = data.taskcase_sum
          this.issueLineData.rows = issueData
					this.issueLineRankData.rows = issueData
          this.rqLineData.rows = rqData
          this.taskCaseLineData.rows = taskCaseData
          this.issueHistogramData.rows = issueData
          this.issuePieData.rows = issueStatus
          this.teamWorkData.rows = teamWorkData
        },error=>{
          this.$message.error('获取dashboard数据失败:'+ error.message)
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
  .charts-wrap{
    padding:0 20px;
    display:flex;
    justify-content:space-between;
    padding-right:20px;
    flex-wrap:wrap;
    .chart-item{
      width:33%;
      margin-bottom:10px;
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
  .charts-wrap-group{
    padding:0 20px;
    display:flex;
    justify-content:space-between;
    padding-right:20px;
    flex-wrap:wrap;
    .chart-item{
      width:90%;
      margin-bottom:10px;
    }
  }
}
</style>

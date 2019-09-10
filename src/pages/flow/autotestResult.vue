<template>
	<div class="auto-test-wrap">
		<p class="runing" v-if="autoResult.isexcuting">自动化测试进行中...</p>
		<ul class="test-result" v-else>
			<li><label>接口名称：</label>{{autoResult.name}}</li>
			<li><label>报告链接：</label><a :href="autoResult.url" target="_blank">{{autoResult.url}}</a></li>
		</ul>
	</div>
</template>
<script type="text/javascript">
import flowApi from '@/api/flow.js'
export default{
  name:'autoResult',
  data(){
  	return {
  	  interval:null,
  	  autoResult:{}
  	}
  },
  computed:{
  	projectId () {
	  return parseInt(this.$route.params.projectId)
	},
  },
  watch:{
  	'autoResult.url':function(val){
  		console.log('testurl',val)
  		this.$emit('autoResult',this.autoResult)
  	}
  },
  methods:{
  	getAutoTestResult(){
  		this.interval = setInterval(()=>{
  			flowApi.getAutoTestReport({"project_id":this.projectId,"run_list":[1]}).then(res=>{
  				this.autoResult = res.data.data[0]
  			})
  		},2000)
  	}
  },
  created(){
  	this.getAutoTestResult()
  },
  beforeDestroy(){
  	clearInterval(this.interval)
  	this.autoResult = {}
  }
}
</script>
<style lang="scss" scoped>
	.auto-test-wrap{
		.runing{
			color: #12bf58;
    		padding:10px;
			text-align: center;
			font-size:18px;
		}
	}
	.test-result{
		padding:20px 0;
		font-size:14px;
		li{
			display:flex;
			align-items:center;
			justify-content: flex-start;
			margin-bottom: 10px;
			a{
				cursor: pointer;
			}
		}
		label{
			display: block;
			width:100px;
		}
	}
</style>
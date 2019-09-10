<template>
	<div class="panel-set-wrap">
		<el-card class="set-card">
		  <div slot="header" class="clearfix">
		    <span>Issue 看板显示配置</span>
		  </div>
		  <div class="issue-set">
			<el-checkbox-group 
			    v-model="issueSet">
			    <el-checkbox v-for="(value,key) in issueStatus" :label="key" :key="key">{{value}}</el-checkbox>
			  </el-checkbox-group>
		</div>
		</el-card>
		<el-card class="set-card">
		  <div slot="header" class="clearfix">
		    <span>需求 看板显示配置</span>
		  </div>
		  <div class="rq-set">
				<el-checkbox-group 
				    v-model="requirmentSet">
				    <el-checkbox v-for="(value,key) in requrementStatus" :label="key" :key="key">{{value}}</el-checkbox>
				  </el-checkbox-group>
			</div>
		</el-card>
		<el-button type="primary" @click="sureSet">确定</el-button>
	</div>
</template>
<script type="text/javascript">
import settingApi from '@/api/settingType.js'
import panelApi from '@/api/panel.js'
export default{
	data(){
		return {
			issueStatus:{},
			requrementStatus:{},
			issueSet:[],
			requirmentSet:[]
		}
	},
	computed:{
	  projectId(){
        return this.$route.params.projectId
      },
  	},
	methods:{
		getIssueStatus(){
			settingApi.getIssueSet().then(res=>{
				this.issueStatus = res.data.data.status
			})
		},
		getRequirementStatus(){
			settingApi.getRequirementSet().then(res=>{
				this.requrementStatus = res.data.data.status
			})
		},
		getPanelSet(){
			panelApi.getPanelSet(this.projectId).then(res=>{
				let data = res.data.data[0]
				console.log('issueset', data)
				// if(data.hasconfig){
					this.issueSet = Object.keys(data.issue)
					this.requirmentSet = Object.keys(data.requirement)
				// }
			},error=>{
				this.$message.error(error.message)
			})
		},
		sureSet(){
			let params = {
				issue:this.issueSet.toString(),
				requirement:this.requirmentSet.toString()
			} 
			if(!params.issue||!params.requirement){
				this.$message.error('您还没有配置缺陷或需求看板！')
				return false
			}
			panelApi.setPanelShow(this.projectId,params).then(res=>{
				this.$message.success('看板设置成功！')
			},error=>{
				this.$message.error(error.message)
			})
		}
	},
	created(){
		this.getIssueStatus()
		this.getRequirementStatus()
		this.getPanelSet()
	}
}
</script>
<style scoped lang="scss">
	.set-card{
		margin-bottom:10px;
  }
</style>
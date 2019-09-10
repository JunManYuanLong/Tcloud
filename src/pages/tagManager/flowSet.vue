<template>
  <div class="staff">
   <el-card class="set-card">
		<div slot="header" class="clearfix">
		    <span>流程人员权限控制检查</span>
		</div>
		<div class="issue-set">
			<el-checkbox  v-model="flowConfigSet">流程人员权限控制检查</el-checkbox>
		</div>
	</el-card>
	<br>
	<div>
		<el-button type="primary" @click="changeFlowPermissionCheck()" >确定</el-button>
	</div>
  </div>
</template>

<script>
  import flowApi from '@/api/flow.js'
  export default {
    data() {
      return {
		flowConfig:{},
		flowConfigSet: null,
      }
    },
    created () {
		this.getFlowConfigs();
	},
	computed: {
		projectId(){
			return this.$route.params.projectId
		}
	},
    methods: {
		test(v){
			getFlowConfig()
			console.log(v);
		},
		getFlowConfigs(){
			let params = {
				project_id:this.projectId,
				module:"flow_config",
				is_all:true
			}
			flowApi.getFlowConfig(params).then(res=>{
				this.flowConfig = res.data.data;
				this.flowConfigSet = Boolean(JSON.parse(this.flowConfig.content).permission_check);
			})
		},
		changeFlowPermissionCheck(){
			let content = JSON.parse(this.flowConfig.content);
			content.permission_check = this.flowConfigSet;
			let params = {
				project_id:parseInt(this.projectId),
				content
			};
			flowApi.updateFlowConfig(this.flowConfig.id, params).then(res=>{
				this.$message.success('设置成功！')
			},error=>{
				this.$message.error(error.message)
			});
		}
	}
  }
</script>

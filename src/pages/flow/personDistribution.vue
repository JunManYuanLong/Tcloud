<template>
	<div class="personnel-distribution">
		<div class="search-bar">
			<el-select v-model="searchData.user" multiple filterable placeholder="请选择人员" clearable>
	          <el-option
	            v-for="item in userList"
	            :key="item.userid"
	            :label="item.nickname"
	            :value="item.userid">
	          </el-option>
	        </el-select>
	         <el-radio-group v-model="searchData.flow">
		      <el-radio-button label="0">全部</el-radio-button>
		      <el-radio-button label="1">进行中</el-radio-button>
		      <el-radio-button label="2">当日已完成</el-radio-button>
		    </el-radio-group>
		    <el-button class="export-btn" type="primary" @click="exportFun">资源导出</el-button>
		</div>
		<p v-if="searchData.user.length ==0" class="tips">暂无数据展示，请先选择人员哦！！</p>
		<div class="source-wrap" v-else>
			<draggable
		        :list="sourceList"
		        @start="dragging = true"
		        @end="moveEnd"
		      >
				<div class="person-item" v-for="(person,index) in sourceList" :key="index">
					<h3>{{person.user_name}}（<span>{{getTotal(person)}}</span>）</h3>
					<vuescroll :ops="ops">
						<template v-if="searchData.flow == 0&&person.hasOwnProperty('flows')">
							<ul class="flows">
								<li v-for="item in person.flows.active" :key="item.id" @click="toDetail(item.id)"><div class="flow-id"><div>ID：<span>{{item.id}}</span></div><div>当前阶段：<span>{{item.step}}</span></div></div>
									<p class="flow-name">{{item.name}}</p>
								</li>
								<li v-for="item in person.flows.finished" :key="item.id"  @click="toDetail(item.id)"><div class="flow-id"><div>ID：<span>{{item.id}}</span></div><div>当前阶段：<span>完成</span></div></div>
									<p class="flow-name">{{item.name}}</p></li>
							</ul>
						</template>
						<template v-else>
							<ul class="flows" v-if="searchData.flow == 1&&person.hasOwnProperty('flows')">
							<li v-for="item in person.flows.active" :key="item.id" @click="toDetail(item.id)"><div class="flow-id"><div>ID：<span>{{item.id}}</span></div><div>当前阶段：<span>{{item.step}}</span></div></div>
								<p class="flow-name">{{item.name}}</p>
							</li>
						</ul>
						<ul class="flows" v-if="searchData.flow == 2&&person.hasOwnProperty('flows')">
							<li v-for="item in person.flows.finished" :key="item.id" @click="toDetail(item.id)"><div class="flow-id"><div>ID：<span>{{item.id}}</span></div><div>当前阶段：<span>完成</span></div></div>
								<p class="flow-name">{{item.name}}</p></li>
						</ul>
						</template>
					</vuescroll>
				</div>
			</draggable>
		</div>
	</div>
</template>
<script type="text/javascript">
import vuescroll from 'vuescroll'
import draggable from "vuedraggable";
import flowApi from '@/api/flow.js'
export default{
	data(){
		return {
		 	ops: {
	          vuescroll: {
	            mode: 'native',
	            detectResize: false,
	            zooming:false
	          },
	          scrollPanel: {
	            scrollingY:true,
	            scrollingX:false,
	          },
	          rail: {
	             background: '#000',
	            opacity: 0,
	            size: '6px',
	            specifyBorderRadius: false,
	            gutterOfEnds: null,
	             gutterOfSide: '2px',
	            keepShow: false
	          },
	          bar: {
	            showDelay: 500,
	            onlyShowBarOnScroll: false,
	            keepShow: false,
	            background: '#c1c1c1',
	            opacity: 1,
	            hoverStyle: false,
	            specifyBorderRadius: false,
	            minSize: false,
	            size: '6px'
	          }
	        },
			searchData:{
				user:[],
				flow:1
			},
			sourceList:[],
			dragging: false
		}
	},
	components:{
		vuescroll,
		draggable
	},
	computed: {
      projectId () {
        return parseInt(this.$route.params.projectId)
      },
      userList(){
        return this.$store.state.project.userList
      },
      userId(){
        return this.$store.state.login.userid
      },
    },
    watch:{
    	'searchData.user':{
    		handler:function(val){
    			//对选择的用户数据做本地存储，刷新页面的时候也可以做清理
    			let user = Array.from(new Set(val))//id 去重
    			user = JSON.stringify(user)
    			//存储用户选择的流程人员
    			flowApi.setPersonSource({project_id:this.projectId,user_ids:user})
    			this.getPersonnelSource()
    		},
    		deep:true
    	}
    },
    methods:{
    	async getPersonSource(){
    		 let res = await flowApi.getPersonSource({"project_id":this.projectId,"user_id":this.userId})
    		return res.data.data
    	},
    	getPersonnelSource(){
    		let params = {
    			projectid :this.projectId,
    			users:this.searchData.user.toString()
    		}
    		flowApi.getFlowResource(params).then(res=>{
    			this.sourceList = res.data.data
    		},error=>{
    			console.log('获取流程失败！')
    		})
    	},
    	toDetail(id){
    		this.$router.push({
    			name:'flowDetail',
    			params:{
    				'flowId':id
    			}
    		})
    	},
    	getTotal(per){
    		let total = 0
    		if(this.searchData.flow==0){
    			total = per.total_active + per.total_finished
    		}else if(this.searchData.flow==1){
    			total = per.total_active
    		}else if(this.searchData.flow==2){
    			total = per.total_finished
    		}
    		return total
    	},
    	exportFun(){
    		if(this.searchData.user.length == 0){
    			this.$message.warning('您还没有选择任何人员！')
    			return false
    		}
    		let params = {
	          projectid :this.projectId,
    		  users:this.searchData.user.toString(),
	          user_id:this.userId
	         }
	        flowApi.exportPersonSource(params).then(res=>{
	          let url = res.data.data
	          window.open(url)
	          this.$message.success('导出成功')
	        },error=>{
	          this.$message.error('导出失败:'+error.message)
	        })
    	},
    	moveEnd(e){
    		this.draggable = false
    		let userTemp = this.sourceList.map(item=>{
    			return parseInt(item.user_id)
    		})
    		if(userTemp.length>0){
    			let user = JSON.stringify(userTemp)
			   //重新存储人员id顺序
			   flowApi.setPersonSource({project_id:this.projectId,user_ids:user})
    		}
    		
    	}
    },
    created(){
    	// if(window.localStorage.getItem('flowSource')){
    	// 	let user = JSON.parse(window.localStorage.getItem('flowSource'))
    	// 	this.searchData.user = user
    	// }else{
    	// 	this.searchData.user = []
    	// }
    	this.getPersonSource().then(res=>{
    		if(res.length>0){
    			this.searchData.user = JSON.parse(res[0].user_ids)
    		}else{
    			this.searchData.user = []
    		}
    		this.getPersonnelSource()
    	})
    	
    }
}
</script>
<style lang="scss" scoped>
.personnel-distribution{
	.search-bar{
	  .el-select{
	  	margin-right: 15px;
	  	width:40%;
	  }
	}
	.source-wrap{
		&>div{
			margin-top:20px;
			display: flex;
			align-items: flex-start;
			justify-content: flex-start;
			flex-wrap: wrap;
		}
		
		.person-item{
			padding:8px;
			width:300px;
			margin-bottom: 20px;
			background-color: #eff1f5;
		    margin-right: 16px;
		    border-radius: 6px;
		    border: 1px #e1e4e8 solid;
		    font-size:14px;
		    h3{
		    	margin-bottom:12px;
		    	font-size: 16px;
		    	span{
		    		color:#409EFF;
		    	}
		    }
		    ul{
		      height: 420px;
			  // overflow:auto;
		    }
		    li{
		    	border: 1px #e1e4e8 solid;
			    padding: 10px;
			    margin: 5px 0 10px;
			    list-style: none;
			    background-color: #fff;
			    border-radius: 6px;
			    cursor: pointer;
			    .flow-id{
			    	font-size:12px;
			    	color:#999;
			    	margin-bottom:5px;
			    	display:flex;
			    	align-items: center;
			    	justify-content: space-between;
			    	span{
			    		color:#333;
			    	}
			    }
			    .flow-name{
			    	white-space: nowrap;
			    	overflow:hidden;
			    	text-overflow: ellipsis;
			    }
		    }
		}
	}
	.tips{
		margin-top:20px;
		color:#999;
	}
	.export-btn{
		margin-left: 60px;
	}
}

</style>
<template>
  <div>
    <div class="issue-page">
        <ul class="version-nav"  v-show="rqNavVisible">
          <li class="title"><h2>缺陷版本</h2></li>
          <li class="v-all" :class="{selected:versionId == 'all'}"><div  @click="toAll">所有版本</div><span class="opts" title="添加版本" @click="createVersionDialogVisible = true"><i class="el-icon-circle-plus"></i></span></li>
          <li v-for = "item in versionList" class="v-item" :class="{selected:versionId == item.id}" @click="toVersion(item)" :key="item.id"><i class="el-icon-document" style="color: #5FC9E8;"></i>&nbsp;{{item.title}}</li>
        </ul>
        <div class="list" :class="{noNav:!rqNavVisible}"  :style="{'height':winHeight+'px'}">
            <el-breadcrumb separator="/" class="issue-crumb">
              <el-breadcrumb-item class="title_name toggle">
                <icon-font iconClass="dakaisanshu" @click.native="toggleSide"></icon-font>
              </el-breadcrumb-item>
              <el-breadcrumb-item class="title_name">
                <span>{{curProject.name}}</span>
              </el-breadcrumb-item>
              <el-breadcrumb-item>
                <span v-if="versionId == 'all'">所有版本</span>
                <span v-else>
                {{version.title}}
                </span>
              </el-breadcrumb-item>
              <el-breadcrumb-item v-if="issueId">缺陷详情</el-breadcrumb-item>
            </el-breadcrumb>
            <router-view></router-view>
          </div>
    </div>
    <el-dialog
      title="新增版本"
      :visible.sync="createVersionDialogVisible"
      @close="closeCreateVersionDialog"
      width="480px" :close-on-click-modal="false">
      <el-form label-width="80px" :model="createVersionForm" :rules="rules" ref="createVersionForm" >
        <el-form-item label="版本名称" prop="title">
          <el-input v-model.trim="createVersionForm.title" style="width: 350px"></el-input>
        </el-form-item>
        <el-form-item label="版本描述" prop="description">
          <el-input
            style="width: 350px"
            type="textarea"
            :rows="2"
            placeholder="请输入版本描述"
            v-model.trim="createVersionForm.description">
          </el-input>
        </el-form-item>
        <el-form-item label="起止时间" prop="duration_time">
          <el-date-picker
            v-model="createVersionForm.duration_time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createVersionDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="createVersion">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
  import versionApi from '@/api/version'
  import moment from 'moment'
  export default{
    data(){
      return {
        rqNavVisible: true,
        createVersionDialogVisible:false,
        winHeight: window.innerHeight - 70,
        createVersionForm: {
          title: '',
          duration_time: '',
          description: ''
        },
        rules: {
          title: [
            { required: true, message: '请输入标题', trigger: 'blur' }
          ],
          description: [
            { required: true, message: '请输入描述', trigger: 'blur' }
          ],
          duration_time: [
            { required: true, message: '请选择起止时间', trigger: 'blur' }
          ]
        },
      }
    },
    computed:{
      curProject(){
        return this.$store.state.project.currentProject
      },
      projectId(){
        return this.$route.params.projectId
      },
      versionList(){
        return this.$store.state.project.versionList
      },
      versionId () {
        if(this.$route.params.versionId == 'all'){
          return 'all'
        }else{
          return parseInt(this.$route.params.versionId)
        }
      },
      issueId(){
        return this.$route.params.issueId
      },
      version(){
        let v = {}
        let v1 = []
        if(this.versionList&&this.versionList.length>0){
          v1 =  this.versionList.filter(item=>{
            if(item.id == this.versionId){
              return item
            }
          })
          v = v1[0]
        }
        return v
      },
      showManage(){
        return this.$store.state.admin.showManage
      },
    },
    methods:{
      toggleSide(){
        this.rqNavVisible = !this.rqNavVisible
      },
      createVersion() {
        this.$refs.createVersionForm.validate(valid => {
          if (valid) {
            let start_time = moment(this.createVersionForm.duration_time[0]).format("YYYY-MM-DD")
            let end_time = moment(this.createVersionForm.duration_time[1]).format("YYYY-MM-DD")
            versionApi.createVersion({
              title: this.createVersionForm.title,
              project_id: parseInt(this.projectId),
              start_time: start_time,
              end_time: end_time,
              creator: this.userid,
              description: this.createVersionForm.description
            }).then(res => {
              this.getVersions()//重新加载版本
              this.createVersionDialogVisible = false
            },error=>{
              this.$message.error(`版本创建失败: ${error.message}`)
            })
          }
        })
      },
      closeCreateVersionDialog () {
        this.createVersionForm.title = ''
        this.createVersionForm.description = ''
        this.createVersionForm.duration_time = ''
      },
      getVersions(){
        versionApi.getVersionByProject({projectid:this.projectId}).then(res=>{
            let  result = res.data.data
            let lastVersion = result[0]?result[0].id:'all'
            if(this.showManage){ // 显示人员管理
                this.$store.commit('ASIDE_HAS_ADMIN', lastVersion)
            } else { // 不显示人员管理
                this.$store.commit('ASIDE_NO_ADMIN', lastVersion)
            }
            this.$store.commit('SET_VERSION',result)
          },error=>{
            console.log('获取版本失败！')
          })
      },
      toVersion(item){
        this.$router.push({
          name:'issue',
          params:{
            versionId:item.id
          }
        })
      },
      toAll(){
        this.$router.push({
          name:'issue',
          params:{
            versionId:'all'
          }
        })
      },
      $resize () {
        this.winHeight = window.innerHeight - 70
      }
    },
    mounted(){
      window.addEventListener('resize', this.$resize, true)
    },
    beforeDestroy(){
      window.removeEventListener("resize", this.$resize);
    }
  }
  
</script>
<style lang="scss" scoped>
  .issue-page{
    .version-nav{
      position: absolute;
      padding: 20px 0 0 15px;
      width: 240px;
      top: 0;
      left: 0;
      height: 100%;
      box-shadow: rgba(0, 0, 0, 0.05) 1px 0px 10px 0px;
      overflow: auto;
      .title{
        font-size: 18px;
        color: #1b73ff;
        border-bottom: 1px solid #eee;
        padding: 0 0 10px 30px;
      }
      .v-all{
        padding:5px 20px 5px 40px;
        border-bottom:1px solid #eee;
        cursor:pointer;
        position: relative;
        &:hover{
          background-color: #f5f7fa;
        }
        &.selected{
          background-color: #f0f7ff;
        }
        .opts{
          position: absolute;
          right:20px;
          top:5px;
          cursor: pointer;
          vertical-align: middle;
          z-index: 2;
          i{
            font-size:24px;
            color:#1b73ff;
          }
        }
      }
      .v-item{
        padding:5px 20px 5px 40px;
        margin:0;
        cursor:pointer;
        font-size:14px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow:ellipsis;
        &:hover{
          background-color: #f5f7fa;
        }
        &.selected{
          background-color: #f0f7ff;
        }
        .circle{
          display: inline-block;
          width:5px;
          height:5px;
          border-radius:5px;
          background: #3f9eff;
        }
      }
    }
    .list{
      margin-left: 240px;
      padding: 0 20px;
      overflow: auto;
      &.noNav{
        margin-left: 0;
      }
    }
    .issue-crumb{
      margin-top:18px;
    }
  }
</style>
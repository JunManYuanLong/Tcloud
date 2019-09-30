<template>
  <div>
    <div class="requirement-page">
      <div class="nav" v-show="rqNavVisible">
        <h2>需求分类
          <span class="opts" title="添加版本" @click="createVersionDialogVisible = true"><i class="el-icon-circle-plus"></i></span>
        </h2>
        <div class="tree-map">
            <!-- <el-tree v-if="showTree" ref="requirementTree" :data="requirementClass" :props="treeProps" node-key="id" default-expand-all :default-expanded-keys="['a1']"   @current-change="getSelectedData"  highlight-current></el-tree> -->
            <!-- <el-tree v-if="showTree" ref="requirementTree" :data="requirementClass" :props="treeProps" node-key="id" :default-expanded-keys="['a1']"   @current-change="getSelectedData"  highlight-current lazy :load="loadNode"></el-tree> -->
            <ul>
              <li  class="fix-v" v-for="vd in requirementClass" :key="vd.id" :class="{selected:vd.id == requirementClassId}" @click="getSelectedData(vd)"><i class="el-icon-caret-right"></i>{{vd.title}}</li>
              <li class="change-v" v-for="v in versionLists" :key="v.id"  :class="{selected:v.id == requirementClassId}"  @click="getSelectedData(v)"><i class="el-icon-document"></i>{{v.title}}</li>
            </ul>
        </div>
      </div>
      <div class="list" :class="{noNav:!rqNavVisible}"  :style="{'height':winHeight+'px'}">
        <el-breadcrumb v-if="requirementClassId" separator="/" class="rq-crumb">
          <el-breadcrumb-item class="title_name toggle">
            <icon-font iconClass="dakaisanshu" @click.native="toggleSide"></icon-font>
          </el-breadcrumb-item>
          <el-breadcrumb-item class="title_name">{{sReqirement?sReqirement : '所有的'}}
          </el-breadcrumb-item>
          <el-breadcrumb-item>{{crumbText}}</el-breadcrumb-item>
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
<script>
import requirementApi from '@/api/requirement'
import versionApi from '@/api/version'
import moment from 'moment'
  export default{
    data() {
      return {
        loading:true,
        createVersionDialogVisible:false,
        tableCurPage:1,
        requirementList:[],
        // requirementClass:[{
        //   id:'a1',
        //   label:'所有的',
        //   children:[{
        //     id:'a2',
        //     label:'未分类',
        //     leaf:true
        //   },{
        //     id:'a3',
        //     label:'版本分类',
        //     children:[{}]
        //   }]
        // }],
        requirementClass:[{
          id:'a1',
          title:'所有的'
        },{
          id:'a2',
          title:'未分类'
        },{
          id:'a3',
          title:'版本分类'
        }],
        showTree:false,
        treeProps:{
          children: 'children',
          label: 'label',
          isLeaf:'leaf'
        },
        versionList:[],
        sReqirement:'',
        rqNavVisible: true,
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
      projectId(){
        return this.$route.params.projectId
      },
      showManage(){
        return this.$store.state.admin.showManage
      },
      filterResult(){
        let data = this.requirementList
        return data
      },
      requirementClassId() {
        return this.$route.params.requirementClassId? this.$route.params.requirementClassId :''
      },
      crumbText(){
        let text = '列表'
        if(this.$route.name == 'requirementAdd'){
          text = '新增需求'
        }
        if(this.$route.name == 'requirementEdit'){
          text = '修改需求'
        }
        if(this.$route.name == 'requirementReview'){
          text = '需求评审'
        }
        if(this.$route.name == 'requirementCase'){
          text = '需求绑定的case'
        }
        return text
      },
      versionLists(){
        return this.$store.state.project.versionList
      },
    },
    methods:{
      toAddFun(){
        this.$router.push({
          name:'requirementAdd'
        })
      },
      toggleSide(){
        this.rqNavVisible = !this.rqNavVisible
      },
      getSelectedData(data){
        if(data.id != 'a1'&&data.id != 'a2'&&data.id != 'a3'){
          this.sReqirement = '版本v'+data.title
        }else{
          this.sReqirement = data.title
        }

        this.$router.push({
          name:'requirementList',
          params:{
            requirementClassId:data.id
          }
        })
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
              this.$message.error(`版本创建失败${error.message}`)
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
.requirement-page{
  .fix-v{
    i{
      transform: rotate(90deg);
      color: #1b73ff;
      font-size: 16px;
    }
    &:nth-of-type(2){
      color:#666;
      font-size: 14px;
      i{
        visibility: hidden;
      }
    }
    &:nth-of-type(3){
      padding-left:25px;
    }
  }
 .change-v{
   color:#666;
   font-size: 14px;
   i{
    color: #14cdec;
   }
 }
  .tree-map{
    ul{
      padding:15px 10px 0 20px;
      i{
        margin-right:2px;
      }
      li{
        padding:4px 10px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: pointer;
        &.selected{
          background-color: #f0f7ff;
        }
        &.change-v{
          padding-left:40px;
        }
      }
    }
  }
  .nav{
    position:absolute;
    padding:20px 0 0;
    width:240px;
    top:0;
    left:0;
    height:100%;
    box-shadow: rgba(0, 0, 0, 0.05) 1px 0px 10px 0px;
    overflow:auto;
    h2{
      font-size:20px;
      color: #1b73ff;
      border-bottom: 1px solid #eee;
      padding: 0 0 10px 20px;
      span{
        cursor:pointer;
        float:right;
        margin-right:20px;
        font-size:24px;
      }
    }
  }
  .list{
    margin-left:240px;
    padding:0 20px;
    overflow:auto;
    &.noNav{
      margin-left:0;
    }
    .rq-crumb{
      padding:20px 0;
      font-size:14px;
      .title_name span{
        color:#000;
        font-weight:800;
      }
      .toggle{
        cursor:pointer;
      }
    }
  }
  .el-tree{
    padding-left:20px;
  }
}
</style>

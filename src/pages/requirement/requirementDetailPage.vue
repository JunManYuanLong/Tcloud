<template>
  <div class="rq-detail-wrap">
  <el-form :model="editData" :rules="rules" ref="addForm" label-width="130px" class="addForm">
    <el-form-item label="标题：" prop="title">
      <el-input v-model="editData.title" type="textarea"></el-input>
    </el-form-item>
    <el-form-item label="版本：" prop="version" v-show="showVersion">
      <el-select v-model="editData.version" placeholder="请选择" clearable>
        <el-option
          v-for="item in versionList"
          :key="item.id"
          :label="item.title"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="处理人：" prop="handler">
      <el-select v-model="editData.handler" placeholder="请选择" clearable filterable>
        <el-option
          v-for="item in userList"
          :key="item.userid"
          :label="item.nickname"
          :value="item.userid">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="优先级：" prop="priority">
      <el-select v-model="editData.priority" placeholder="请选择" clearable>
        <el-option
          v-for="(val,key) in rqSet.priority"
          :key="key"
          :label="val"
          :value="parseInt(key)">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="类型：" prop="requirement_type">
      <el-select v-model="editData.requirement_type" placeholder="请选择" clearable>
        <el-option
          v-for="(val,key) in rqSet.type"
          :key="key"
          :label="val"
          :value="parseInt(key)">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="状态：" prop="board_status">
      <el-select v-model="editData.board_status" placeholder="请选择" clearable>
        <el-option
          v-for="(val,key) in rqSet.status"
          :key="key"
          :label="val"
          :value="parseInt(key)">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="需求价值：" prop="worth">
      <el-select v-model="editData.worth" placeholder="请选择">
        <el-option
          label="高价值"
          :value="1">
        </el-option>
        <el-option
          label="非高价值"
          :value="2">
        </el-option>
      </el-select>
    </el-form-item>
    <!-- 为高价值时的一些操作 -->
    <template v-if="editData.worth == 1">
      <el-form-item label="高价值的预期值：">
        <editor v-model="editData.report_expect"></editor>
      </el-form-item>
      <el-form-item label="获取置信结果：">
         <!-- <el-input v-model="editData.report_time" type="number"></el-input> -->
         <el-input v-model="editData.report_time" type="number" :min="0" style="display: inline-block;width:100px;"></el-input>
        <span>天</span>
      </el-form-item>
      <el-form-item label="高价值的实际值：">
          <editor v-model="editData.report_real"></editor>
      </el-form-item>
      <el-form-item label="需求价值确认：">
         <el-radio-group v-model="editData.worth_sure">
            <el-radio :label="1">超出预期</el-radio>
            <el-radio :label="2">符合预期</el-radio>
            <el-radio :label="3">低于预期</el-radio>
          </el-radio-group>
      </el-form-item>
      
    </template>
    <el-form-item label="jira号：" prop="jira_id">
      <el-input v-model="editData.jira_id"></el-input>
    </el-form-item>
    <el-form-item label="预期完成时间：" prop="expect_time">
      <el-date-picker
        v-model="editData.expect_time"
        type="date"
        placeholder="选择日期时间">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="关联用例：" prop="case_ids">
        <span v-if="editData.case_ids.length>0">选中了{{editData.case_ids.length}}条用例</span>
            <el-button size="small" @click="createCaseDialogVisible = true" icon="el-icon-circle-plus-outline">
              {{editData.case_ids && editData.case_ids.length > 0 ? '继续选择' : '请选择'}}
            </el-button>
      </el-form-item>
    <el-form-item label="需求描述：" prop="description">
      <editor v-model="editData.description"></editor>
    </el-form-item>
    <el-form-item label="图片附件：">
      <imageUpload v-if="ossData.hasOwnProperty('host')" :ossData="ossData" v-model="uploadFile.images"></imageUpload>
    </el-form-item>
    <el-form-item label="视频附件：">
      <videoUpload v-if="ossData.hasOwnProperty('host')" :ossData="ossData" v-model="uploadFile.videos"></videoUpload>
    </el-form-item>
    <el-form-item label="普通文件附件：">
      <fileUpload v-if="ossData.hasOwnProperty('host')" :ossData="ossData" v-model="uploadFile.files"></fileUpload>
    </el-form-item>
    <el-form-item class="case-end-opt">
      <!-- <el-button @click="cancelFun">取消</el-button> -->
      <el-button type="primary" @click="sureFun">确定</el-button>
      <el-button @click="deleteRequire" type="danger">删除</el-button>
    </el-form-item>
  </el-form>
   <el-collapse class="issue-detail-wrap" v-model="collapsedActive">
                <el-collapse-item name="1">
                  <template slot="title">关联issue信息 <span class="tips">(点击可展开详情)</span>
                </template>
                   <p  v-if="!hasIusse" class="tips">暂无相关issue</p>
                  <div class="issue-wrap" v-if="hasIusse">
                    <dl class="parent">
                      <dt>{{editData.title}}</dt>
                      <dd v-for="issue in editData.issue" :key="issue.id"><i class="el-icon-info"></i><em>ID:{{issue.issueid}}</em><el-tooltip class="item" effect="dark" :content="issue.title" placement="top-start"><a :href="issueDetailUrlPre+issue.issueid" target="_blank" :class="{throughLine:issue.handle_status == 4}">{{issue.title}}</a></el-tooltip><span>状态：{{issueSet.status[issue.handle_status]}}</span></dd>
                    </dl>
                    <dl class="child" v-for="item in editData.parent_list" :key="item.id" v-if="item.issue&&item.issue.length>0"> 
                      <dt>{{item.title}}</dt>
                      <dd v-for="issue in item.issue" :key="issue.id"><i class="el-icon-info"></i><em>ID:{{issue.issueid}}</em><el-tooltip class="item" effect="dark" :content="issue.title" placement="top-start"><a :href="issueDetailUrlPre+issue.issueid"  target="_blank"  :class="{throughLine:issue.handle_status == 4}">{{issue.title}}</a></el-tooltip><span>状态：{{issueSet.status[issue.handle_status]}}</span></dd>
                    </dl>
                  </div>
                </el-collapse-item>
              </el-collapse>
  <ul class="timeline" ref="timeline">
      <li v-for="item in logData">
        <h3><span>{{item.modifier_name}}</span><span class="logContent" v-html="item.operation"></span></h3>
        <p><em>{{item.modified_time}}</em></p>
      </li>
    </ul>
    <case-dialog v-if="createCaseDialogVisible" ref="addCaseDialog" :isShow="createCaseDialogVisible" :taskCaseList="editData.case_ids" type="create" @close="isShowCaseDialog(false)" @caseSelect="caseSelected"></case-dialog>
</div>
</template>
<script>
  import userApi from '@/api/user.js'
  import versionApi from '@/api/version'
  import editor from '@/components/editor'
  import imageUpload from '@/pages/requirement/imageUpload'
  import videoUpload from '@/pages/requirement/videoUpload'
  import fileUpload from '@/pages/requirement/fileUpload'
  import caseDialog from '@/components/caseDialog'
  import ossApi from '@/api/oss.js'
  import requirementApi from '@/api/requirement.js'
  import setApi from '@/api/settingType.js'
  export default {
    data() {
      return {
        showVersion: false,
        editData: {
          "title": "",
          "handler": "",
          "version": "",
          "priority": "",
          "attach": "",
          "board_status": "",
          "worth":2,
          "report_time":"",
          "report_expect":"",
          "report_real":"",
          "worth_sure":"",
          "jira_id":'',
          "description": "",
          "requirement_type": "",
          "case_ids":[],
          "expect_time":''
        },
        createCaseDialogVisible:false,
        rules: {
          title: [
            {required: true, message: '请填写需求标题', trigger: 'change'}
          ]
        },
        stepValid: true,
        uploadFile: {
          images: [],
          files: [],
          videos: []
        },
        logData: [],
        collapsedActive:[]
      }
    },
    components: {
      editor,
      imageUpload,
      videoUpload,
      fileUpload,
      caseDialog
    },
    watch:{
      'editData.worth':function(val){
        if(val == 2){
          this.editData.report_time = ""
          this.editData.report_expect = ""
          this.editData.report_real = ""
          this.editData.worth_sure = ""
        }
      }
    },
    computed: {
      projectId() {
        return this.$route.params.projectId
      },
      userId() {
        return this.$store.state.login.userid
      },
      requireClass() {
        return this.$route.params.requirementClassId
      },
      requirementId() {
        return this.$route.params.requirementId
      },
      userList(){
        return this.$store.state.project.userList
      },
      ossData(){
        return this.$store.state.project.ossData
      },
      versionList(){
        return this.$store.state.project.versionList
      },
      issueDetailUrlPre(){
        let origin  = window.location.origin 
        let url = `${origin}/#/project/${this.projectId}/issue/all/issueDetail/`
        return url
      },
      hasIusse(){
        let hasI = false
        if(this.editData.issue&&this.editData.issue.length>0){
          hasI = true
        }
        if(this.editData.parent_list&&this.editData.parent_list.length>0){
          this.editData.parent_list.forEach(item=>{
            if(item.issue&&item.issue.length>0){
              hasI = true
            }
          })
        }
        return hasI
      },
      rqSet() {
        return this.$store.state.project.settings.requirement_config;
      },
      issueSet() {
        return this.$store.state.project.settings.issue_config;
      },
    },
    methods: {
      sureFun() {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            let params = this.editData
            params.project_id = parseInt(this.projectId)
            params.creator = this.userId
            if(this.editData.report_time!==''){
              params.report_time = this.editData.report_time.toString()
            }
            params.attach = JSON.stringify(this.uploadFile)
            params = dealObjectValue(params)
            requirementApi.editRequirement(params, this.requirementId).then(res => {
              this.$message.success('需求修改成功！')
              // this.$router.push({
              //   name: 'requirementList',
              //   params: {
              //     requirementClassId: this.requireClass
              //   }
              // })
            }, error => {
              this.$message.error(`添加失败: ${error.message}`)
            })
          } else {
            this.$message.error('请填写相关字段！')
            return false
          }
        })
      },
      deleteRequire() {
        this.$confirm(`此操作将删除该需求:${this.requirementId}, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          requirementApi.deleteRequire(this.requirementId).then(res => {
            if (res.data.code == 0) {
              this.$message({
                message: '需求删除成功！',
                type: 'success'
              })
            }
            this.$router.push({
                name: 'requirementList',
                params: {
                  requirementClassId: this.requireClass
                }
              })
          }, error => {
            this.$message.error('删除失败: '+ error.message)
            // this.close()
          })
        })
      },
      getRequirementDetail(){
        requirementApi.getDetailById(this.requirementId).then(res=>{
          let data = res.data.data[0]
          this.editData = data
          this.editData.version = data.version_id
          let upload = data.attach != '' ? JSON.parse(data.attach) : {
              images: [],
              files: [],
              videos: []
            }
            this.uploadFile = upload
            if (data.creator_name) {
              this.editData.creator = data.creator_id
            } else {
              this.editData.creator = ''
            }
        },error=>{
          console.log('详情加载失败！')
        })
      },
      getRequireLog() {
        console.log(this.requireData)
        requirementApi.getRequirementLog(this.requirementId).then(res => {
          this.logData = res.data.data
        }, error => {
          this.$message.error('获取需求记录失败:' + error.message)
        })
      },
      isShowCaseDialog(val){
        this.createCaseDialogVisible = val
      },
      caseSelected(val){
        this.editData.case_ids = val
        this.isShowCaseDialog(false)
      },
    },
    created() {
      // 判断是否显示版本下拉框
      let version = this.$route.params.requirementClassId
      if (version == 'a1' || version == 'a2' || version == 'a3') {
        this.showVersion = true
      } else {
        this.showVersion = false
      }
      this.getRequirementDetail()//获取需求详情
      this.getRequireLog()//获取需求log
    }
  }

  function dealObjectValue(obj) {
    var param = {};
    if (obj === null || obj === undefined || obj === "") return param;
    for (var key in obj) {
      if (typeof obj[key] === "Object") {
        param[key] = dealObjectValue(obj[key]);
      } else if (obj[key] !== null && obj[key] !== undefined && obj[key] !== "") {
        param[key] = obj[key];
      }
    }
    return param;
  }
</script>
<style lang="scss">
  .el-card__header {
    text-align: left;
  }

  .addForm {
    .el-form-item__content {
      text-align: left;
    }
  }

  .case-header {
    display: flex;
    align-items: center;
    padding-bottom: 10px;
    border-bottom: 1px solid #ebeef5;
    margin-bottom: 20px;

    img {
      height: 20px;
      margin-right: 10px;
    }

    .page-title {
      margin-left: 10px;
      color: #409eff;
    }
  }

  .addForm {
    .case-add-input {
      width: 400px !important;
    }
  }

  .case-end-opt {
    margin-top: 30px;
  }
.issue-detail-wrap{
    .el-collapse-item__content,.el-collapse-item__header{
      font-size:14px;
    }
  }
</style>
<style lang="scss" scoped>
  .addForm {
    .el-textarea, .el-select, .el-input {
      width: 300px;
    }
  }
  .split-line{
    margin:10px 0;
    border-bottom:1px solid #eee;
  }
  .timeline {
    margin: 20px 0 0 165px;
    padding-left: 25px;
    position: relative;
    color: #5e6d82;
    max-width: 490px;
    .logContent {
      word-break: break-all;

      img {
        max-width: 98%;
      }
    }

    & > li:first-child h3:before {
      left: -33px;
      top: 4px;
      width: 17px;
      height: 17px;
      background-color: #20a0ff;
      border: 0;
    }

    h3:before {
      content: "";
      display: block;
      position: absolute;
      left: -31px;
      top: 6px;
      width: 13px;
      height: 13px;
      border-radius: 50%;
      border: 2px solid #20a0ff;
      box-sizing: border-box;
      background-color: #fff;
    }

    &:before {
      display: block;
      content: "";
      width: 1px;
      height: 100%;
      position: absolute;
      left: 0;
      top: 5px;
      border-left: 1px solid #eaeefa;
    }

    li li:before {
      content: "";
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background-color: #5e6d82;
      margin-right: 5px;
      display: inline-block;
      vertical-align: middle;
    }

    h3 {
      font-family: 微软雅黑;
      font-size: 14px;
      max-width: 490px;
      display: flex;
      word-break: break-all;

      span {
        color: rgb(7, 95, 184);
        min-width: 65px;
      }

      img {
        max-width: 100px !important;
      }
    }

    & > li {
      list-style: none;
      position: relative;
      line-height: 1.8;
      margin-bottom: 40px;
    }


    li li {
      font-size: 14px;
      list-style: none;
      padding-left: 0;
      word-break: break-all;
    }

    a {
      opacity: 1;
      float: none;
      margin-left: 0;
      color: inherit;
    }


    p {
      margin: 0;
    }

    em {
      position: absolute;
      left: -175px;
      font-style: normal;
      top: 0px;
      font-size: 12px;
      color: #99a9bf;
    }
  }
  .issue-detail-wrap{
  padding:0 20px;
  .el-collapse-item__content{
    font-size:14px;
  }
  .tips{
    padding:0 5px;
    color:#999;
  }
  dt{
    color:#333;
    font-weight:bold;
  }
  dd{
    display: flex;
    align-items:center;
    i{
      color:#ccc;
    }
    a{
      white-space: nowrap;
      width:500px;
      overflow: hidden;
      text-overflow:ellipsis;
      outline: none;
      &.throughLine{
        text-decoration:line-through;
      }
    }
    em{
      padding:0 5px;
    }
  }
  // .issue-wrap{
  //   position: relative;
  //   .line{
  //     left:5px;
  //     top:20px;
  //     position: absolute;
  //     display:block;
  //     height:80%;
  //     border-left:1px solid #ccc;
  //   }
  // }
  .parent{
    dd{
      margin-left:16px;
      position:relative;
      &::before{
        left:-10px;
        top:11px;
        position: absolute;
        content:"";
        display:block;
        width:8px;
        border-bottom:1px solid #ccc;
      }
      &::after{
        left:-10px;
        top:-5px;
        position: absolute;
        content:"";
        display:block;
        height:24px;
        border-left:1px solid #ccc;
      }
    }
  }
  .child{
    margin-left:16px;
    position: relative;
    &::before{
      left:-10px;
      top:-5px;
      position: absolute;
      content:"";
      display:block;
      height:100%;
      border-left:1px solid #ccc;
    }
    &:last-child{
      &::before{
        height:17px;
      }
    }
    dt{
      position:relative;
      &::before{
        left:-10px;
        top:11px;
        position: absolute;
        content:"";
        display:block;
        width:8px;
        border-bottom:1px solid #ccc;
      }
      
    }
    dd{
      margin-left:16px;
      position:relative;
      &::before{
        left:-10px;
        top:11px;
        position: absolute;
        content:"";
        display:block;
        width:8px;
        border-bottom:1px solid #ccc;
      }
      &::after{
        left:-10px;
        top:-3px;
        position: absolute;
        content:"";
        display:block;
        height:24px;
        border-left:1px solid #ccc;
      }
      &:last-child{
        &::after{
          height:15px;
        }
      }
    a{
      width:485px;
    }
    }
  }
}
</style>

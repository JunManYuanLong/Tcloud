<template>
  <div class="rq-add-wrap">
  <el-form :model="addData" :rules="rules" ref="addForm" label-width="130px" class="addForm">
    <el-form-item label="标题：" prop="title">
      <el-input v-model="addData.title" type="textarea"></el-input>
    </el-form-item>
    <el-form-item label="版本：" prop="version" v-show="showVersion">
      <el-select v-model="addData.version" placeholder="请选择" clearable>
        <el-option
          v-for="item in versionList"
          :key="item.id"
          :label="item.title"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="处理人：" prop="handler">
      <el-select v-model="addData.handler" placeholder="请选择" clearable filterable>
        <el-option
          v-for="item in userList"
          :key="item.userid"
          :label="item.nickname"
          :value="item.userid">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="优先级：" prop="priority">
      <el-select v-model="addData.priority" placeholder="请选择"  clearable>
        <el-option
        v-for="(val,key) in rqSet.priority"
        :key="key"
        :label="val"
        :value="parseInt(key)">
      </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="类型：" prop="requirement_type">
      <el-select v-model="addData.requirement_type" placeholder="请选择"  clearable>
        <el-option
        v-for="(val,key) in rqSet.type"
        :key="key"
        :label="val"
        :value="parseInt(key)">
      </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="状态：" prop="board_status">
      <el-select v-model="addData.board_status" placeholder="请选择"  clearable>
        <el-option
        v-for="(val,key) in rqSet.status"
        :key="key"
        :label="val"
        :value="parseInt(key)">
      </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="需求价值：" prop="worth">
      <el-select v-model="addData.worth" placeholder="请选择">
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
    <template v-if="addData.worth == 1">
      <el-form-item label="高价值的预期值：">
        <editor v-model="addData.report_expect"></editor>
      </el-form-item>
      <el-form-item label="获取置信结果：">
         <!-- <el-input v-model="addData.report_time" type="number"></el-input> -->
         <el-input v-model="addData.report_time" type="number" :min="0" style="display: inline-block;width:100px;"></el-input>
        <span>天</span>
      </el-form-item>
      <el-form-item label="高价值的实际值：">
          <editor v-model="addData.report_real"></editor>
      </el-form-item>
      <el-form-item label="需求价值确认：">
         <el-radio-group v-model="addData.worth_sure">
            <el-radio :label="1">超出预期</el-radio>
            <el-radio :label="2">符合预期</el-radio>
            <el-radio :label="3">低于预期</el-radio>
          </el-radio-group>
      </el-form-item>
      
    </template>
    <el-form-item label="jira号：" prop="jira_id">
      <el-input v-model="addData.jira_id"></el-input>
    </el-form-item>
    <el-form-item label="预期完成时间：" prop="expect_time">
      <el-date-picker
        v-model="addData.expect_time"
        type="date"
        placeholder="选择日期时间" value-format="yyyy-MM-dd">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="关联用例：" prop="case_ids">
      <span v-if="addData.case_ids.length>0">选中了{{addData.case_ids.length}}条用例</span>
          <el-button size="small" @click="createCaseDialogVisible = true" icon="el-icon-circle-plus-outline">
            {{addData.case_ids && addData.case_ids.length > 0 ? '继续选择' : '请选择'}}
          </el-button>
    </el-form-item>
    <el-form-item label="标签：" prop="tag">
      <el-select v-model="addData.tag" placeholder="请选择" multiple  clearable>
        <el-option
        v-for="item in tagList"
        :key="item.id"
        :label="item.tag"
        :value="item.id">
      </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="需求描述：" prop="description">
      <editor v-model="addData.description"></editor>
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
      <el-button @click="cancelFun">取消</el-button>
      <el-button type="primary" @click="sureFun">确定</el-button>
    </el-form-item>
  </el-form>
  <case-dialog v-if="createCaseDialogVisible" ref="addCaseDialog" :isShow="createCaseDialogVisible" :taskCaseList="addData.case_ids" type="create" @close="isShowCaseDialog(false)" @caseSelect="caseSelected"></case-dialog>
  </div>
</template>
<script>
  import userApi from '@/api/user.js'
  import tagApi from '@/api/tag.js'
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
        addData: {
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
          "expect_time":"",
          "tag":[]
        },
        tagList:[],
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
        }
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
      'addData.worth':function(val){
        if(val == 2){
          this.addData.report_time = ""
          this.addData.report_expect = ""
          this.addData.report_real = ""
          this.addData.worth_sure = ""
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
      rqSet() {
        return this.$store.state.project.settings.requirement_config;
      },
    },
    methods: {
      cancelFun() {
        this.$router.push({
          name: 'requirementList',
          params: {
            requirementClassId: this.requireClass
          }
        })
      },
      sureFun() {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            let params = this.addData
            params.project_id = parseInt(this.projectId)
            params.creator = this.userId
            if(this.addData.report_time!==''){
              params.report_time = this.addData.report_time.toString()
            }
            params.tag = this.addData.tag.toString()
            params.attach = JSON.stringify(this.uploadFile)
            params = dealObjectValue(params)
            let version = this.$route.params.requirementClassId
            console.log(version)
            if (version !== 'a2' && version !== 'a1' && version !== 'a3') {
              params.version = version / 1
            }
            requirementApi.addRequirement(params).then(res => {
              this.$message.success('需求添加成功！')
              this.$router.push({
                name: 'requirementList',
                params: {
                  requirementClassId: this.requireClass
                }
              })
            }, error => {
              this.$message.error(`添加失败: ${error.message}`)
            })
          } else {
            this.$message.error('请填写相关字段！')
            return false
          }
        })
      },
      isShowCaseDialog(val){
        this.createCaseDialogVisible = val
      },
      caseSelected(val){
        this.addData.case_ids = val
        this.isShowCaseDialog(false)
      },
      getTagList() {
        let params = {
          project_id: this.projectId
        }
        tagApi.getTag(params).then(res => {
          this.tagList = res.data.data
        },error=>{
          this.$message.error(error.message)
        })
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
      this.getTagList()
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

</style>
<style lang="scss" scoped>
  .addForm {
    .el-textarea, .el-select, .el-input {
      width: 300px;
    }
  }
</style>

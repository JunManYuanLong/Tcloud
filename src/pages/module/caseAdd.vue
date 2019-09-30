<template>
  <div class="common-module-right case-add-page">
        <div class="case-header"><img src="../../assets/img/moduleTag.png" alt=""><span>{{moduleId=='all'?'所有模块':moduleInfo.name}}</span> <span class="page-title">（{{crumbText}}用例）</span></div>
      
        <el-form :model="addData" :rules="rules" ref="addForm" label-width="130px" class="addForm">
           <el-form-item label="标题：" prop="title">
              <el-input class="case-add-input" v-model.trim="addData.title"></el-input>
            </el-form-item>
            <el-form-item label="前置条件：" prop="precondition">
              <el-input class="case-add-input" v-model="addData.precondition" :rows="4" type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="用例类型：" prop="ctype">
              <el-checkbox-group v-model="addData.ctype">
                <el-checkbox v-for="(val,key) in caseSet.ctype" :label="key" :key="key">{{val}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="优先级：" prop="priority">
              <el-select v-model="addData.priority" placeholder="请选择"  clearable>
                <el-option
                  v-for="(val,key) in caseSet.priority"
                  :key="key"
                  :label="val"
                  :value="parseInt(key)">
                </el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="是否可自动化：" prop="is_auto">
              <el-switch
                v-model="caseAuto"
                active-text="是"
                inactive-text="否">
              </el-switch>
            </el-form-item> -->
             <el-form-item label="步骤描述：" prop="step_result">
              <step :stepData="toEditedCaseStepResult" @stepChange="stepChangeFun"></step>
            </el-form-item>
            <el-form-item class="case-end-opt">
              <el-button @click="cancelFun">取消</el-button>
              <el-button type="primary" @click="sureFun">确定</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import step from './step.vue'
import featureApi from '@/api/feature.js'
import moduleApi from '@/api/module.js'
import caseApi from '@/api/case.js'
import setApi from '@/api/settingType.js'
  export default{
    data() {
      return {
        addData: {
         ctype:[],
         title: '',
         priority:'',
         precondition: ''
        },
        editCaseStepResult:{
          step_result: []
        },
        toEditedCaseStepResult:'',
        caseAuto: false,
        moduleInfo: [],
        featureList: [],
        rules: {
          ctype: [
            { required: true, message: '请选择用例类型', trigger: 'change' }
          ],
          title: [
            { required: true, message: '请填写用例标题', trigger: 'blur' }
          ]
        },
        stepValid: true
      }
    },
    components:{
      step
    },
    computed:{
      moduleId() {
        return this.$route.params.moduleId
      },
      caseId() {
        return this.$route.params && this.$route.params.caseId? this.$route.params.caseId : ''
      },
      crumbText() {
        let text = "新增"
        if(this.caseId){
          text = "编辑"
        }
        return text
      },
      page(){
        return this.$route.query && this.$route.query.page ?this.$route.query.page : ''
      },
      size(){
        return this.$route.query && this.$route.query.size ?this.$route.query.size : ''
      },
      caseSet(){
        return this.$store.state.project.settings.case_config;
      }
    },
    methods: {
      cancelFun () {
        if(this.page&&this.size){
          this.$router.push({
            name:'caseList',
            params:{
              moduleId: this.moduleId
            },
            query:{
              page:this.page,
              size:this.size
            }
          })
        }else{
          this.$router.push({
            name:'caseList',
            params:{
              moduleId: this.moduleId
            }
          })
        }
        
      },
      isNullStepResult(){
        let result = true //初始步骤为空
        if(this.editCaseStepResult.step_result.length == 0){
          result = true
          console.log('r0',result)
        }else{
          this.editCaseStepResult.step_result.forEach(item =>{
            if(item.step == ''){
              result = true
              return false
            }else{
              result = false
            }
          })
        }
        return result
      },
      sureFun () {
        if(this.stepValid){
          this.$message.error('请填写完整用例步骤！')
          return false
        }
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            let userid = this.$store.state.login.userid
            let params = Object.assign({},this.addData)
            params.module_id = parseInt(this.moduleId)
            params.ctype = params.ctype.toString()
            params.creator = userid
            // params.is_auto = this.caseAuto? 1:0;
            params.step_result = JSON.stringify(this.editCaseStepResult)
            params = dealObjectValue(params)
            if(this.caseId){
              caseApi.editCase(this.caseId, params).then(res => {
                this.$message({
                   message: '用例修改成功！',
                   type: 'success'
                })
                if(this.page){
                  this.$router.push({
                    name:'caseList',
                    params:{
                      moduleId: this.moduleId
                    },
                    query:{
                      page:this.page,
                      size:this.size
                    }
                  })
                }else{
                  this.$router.push({
                    name:'caseList',
                    params:{
                      moduleId: this.moduleId
                    }
                  })
                }
                
              },error=>{
                this.$message.error('用例修改失败:' + error.message)
              })
            }else{
              caseApi.addCase(params).then(res => {
                this.$message({
                   message: '用例添加成功！',
                   type: 'success'
                })
                if(this.page){
                  this.$router.push({
                    name:'caseList',
                    params:{
                      moduleId: this.moduleId
                    },
                    query:{
                      page:this.page,
                      size:this.size
                    }
                  })
                }else{
                  this.$router.push({
                    name:'caseList',
                    params:{
                      moduleId: this.moduleId
                    }
                  })
                }
              },error=>{
                this.$message.error('用例添加失败:' + error.message)
              })
            }
          } else {
            this.$message.error('请填写相关字段！')
            return false;
          }
        })
      },
      getEditData() {
        caseApi.getSingleCase({id: this.caseId}).then(res => {
          this.addData = res.data.data[0]
          this.addData.ctype =this.addData.ctype&&this.addData.ctype.indexOf(',')!=-1 ? this.addData.ctype.split(',') : [this.addData.ctype];
          // [this.addData.ctype];
          console.log('editdata', this.addData)
          this.toEditedCaseStepResult = this.addData.step_result
          // this.caseAuto = Boolean(this.addData.is_auto)
        })
      },
      getModuleData() {
        if(this.moduleId == 'all'){
          return false
        }
        moduleApi.getSingleModule({id: this.moduleId}).then(res => {
          this.moduleInfo = res.data.data[0]
        })
      },
      stepChangeFun(val){
        // console.log('stepresult', val)
        this.editCaseStepResult.step_result = val;
        this.stepValid = this.isNullStepResult()
      }
    },
    created() {
      if(this.caseId){
        this.getEditData()
      }
      this.getModuleData()
    }
  }
  function dealObjectValue(obj){
    var param = {};
    if ( obj === null || obj === undefined || obj === "" ) return param;
    for ( var key in obj ){
        if ( typeof obj[key] === "Object" ){
            param[key] = dealObjectValue(obj[key]);
        }else if(  obj[key] !== null && obj[key] !== undefined && obj[key] !== ""  ){
            param[key] = obj[key];
        }
    }
    return param;
}
</script>
<style lang="scss">
.case-add-page{
  .el-card__header{
  text-align:left;
}
.addForm{
  .el-form-item__content{
    text-align:left;
  }
}
.case-header{
  display:flex;
  align-items:center;
  padding-bottom:10px;
  border-bottom:1px solid #ebeef5;
  margin-bottom:20px;
  img{
    height:20px;
    margin-right:10px;
  }
  .page-title{
    margin-left:10px;
    color:#409eff;
  }
}
.addForm{
  .case-add-input{
    width:400px!important;
  }
  .el-select{
    width:400px;
  }
}
.case-end-opt{
  margin-top:30px;
}
}

</style>

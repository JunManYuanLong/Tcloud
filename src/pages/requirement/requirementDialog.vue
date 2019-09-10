<template>
  <!-- <div class="module-cases"> -->
  <el-dialog
    title="创建评审记录"
    :visible.sync="dialogVisible"
    width="780px"
    :before-close="handleClose" :show-close="false" :close-on-click-modal="false">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="评审人员">
        <el-select class="reviewer" v-model="reviewerList" placeholder="请选择"  clearable  filterable multiple>
          <el-option
            v-for="item in userList"
            :key="item.userid"
            :label="item.nickname"
            :value="item.userid">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="评审需求">
        <div class="module-case-content">
          <ul class="modules">
            <li v-for="parent in parentRequirementList" :key="parent.id" @click="handleActive(parent)">
              <el-tooltip class="item" effect="dark" :content="parent.title" placement="top-start">
                <span>{{parent.title}}</span>
              </el-tooltip>
              <el-checkbox v-model="parent.checked" @change="handleChange" class="checkBtn" :key="parent.id" :disabled="parent.review_status == 2"></el-checkbox>
            </li>

            <!--<li v-for="(module,index) in moduleList" @click="selectModule(index)"-->
            <!--:class="{selected:curModuleActive == index}"><img src="../../assets/img/module.png" alt="">-->
            <!--<el-tooltip class="item" effect="dark" :content="module.name" placement="top-start">-->
            <!--<span>{{module.name}}</span>-->
            <!--</el-tooltip>-->
            <!--<el-checkbox :indeterminate="module.isIndeterminate" v-model="module.isSelectAll"-->
            <!--@change="handleCheckAllChange" class="checkBtn" :key="index"></el-checkbox>-->
            <!--</li>-->
          </ul>
          <div class="cases">
            <li v-for="child in activeChildRqrmntList" :key="child.id">
              <el-tooltip class="item" effect="dark" :content="child.title" placement="top-start">
                <span>{{child.title}}</span>
              </el-tooltip>
              <el-checkbox v-model="child.checked" @change="handleChange" class="checkBtn" :key="child.id"></el-checkbox>
            </li>
          </div>
        </div>
        <span>已选择<span style="color: red;">{{checkedNum}}</span>条需求</span>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button @click="handleSure" type="primary">确定</el-button>
    </span>
  </el-dialog>
  <!-- </div> -->
</template>
<script>
  import userApi from '@/api/user.js'
  import rqrmntApi from '@/api/requirement.js'
  import caseApi from '@/api/case.js'
  import taskApi from '@/api/task.js'
  import editor from '@/components/editor'

  export default{
    name: 'rqrmntDialog',
    props: ['isShow', 'type', 'taskCaseList'],
    data() {
      return {
        form: {},
        parentRequirementList: [],
        activeParentId: 0,
        reviewerList: [],
        dialogVisible: this.isShow,
        taskCases: [],
        moduleList: [],
        moduleIndeterminate: false,
        checkAllModule: false,
        // checkCurAllModuleCase:[],
        checkEachModuleCase: [],
        caseLists: [],
        curModuleActive: 0,//默认选中第一个module
      }
    },
    computed: {
      projectId (){
        return parseInt(this.$route.params.projectId)
      },
      userId(){
        return this.$store.state.login.userid
      },
      userList(){
        return this.$store.state.project.userList
      },
      requirementClassId () {
        return this.$route.params.requirementClassId
      },
      checkedRequirement () {
        let v = '';
        this.parentRequirementList.forEach(item => {
          if (item.checked === true) {
            v += `${item.id},`
          }
          item.parent_list.forEach(item2 => {
            if (item2.checked === true) {
              v += `${item2.id},`
            }
          })
        });
        const reg = /,$/gi;
        v = v.replace(reg, "");
        return v
      },
      checkedNum () {
        let n = 0;
        this.parentRequirementList.forEach(item => {
          if (item.checked === true) {
            n += 1
          }
          item.parent_list.forEach(item2 => {
            if (item2.checked === true) {
              n += 1
            }
          })
        });
        return n
      },
      activeChildRqrmntList () {
        if (this.activeParentId !== 0) {
          return this.parentRequirementList.find(item => item.id === this.activeParentId).parent_list
        } else {
          return []
        }
      },
    },
    watch: {
      'isShow' (to, from) {
        this.dialogVisible = to
        if (to === true) {
          this.getParentRequirementList()
        }
      },
      'taskCaseList': {
        handler: function (val) {
          if (val.length > 0 && this.type === 'edit') {
//            this.getTaskCase(val)
          }
        },
        deep: true
      }
    },
    created(){
      // this.getParentRequirementList()
    },
    methods: {
      handleActive (parent) {
        console.log('parent:', parent)
        this.activeParentId = parent.id
      },
      handleClose () {
        this.activeParentId = 0
        this.parentRequirementList.forEach(item => {
          item.checked = false;
          item.parent_list.forEach(item2 => {
            item2.checked = false;
          })
        });
        this.reviewerList = []
        this.$emit('close')
      },
      handleSure() {
        if (this.checkedNum === 0) {
          this.$message.warning('请至少选择一条需求方可进行评审！')
          return
        }
        const reg = /^[0-9]*$/;
        let version_id = reg.test(this.requirementClassId) ? parseInt(this.requirementClassId) : 0
        console.log("this.reviewerList:"+this.reviewerList)
        rqrmntApi.createRequirementReviewRecord({
          project_id: this.projectId,
          review_status: 1,  //  1-未评审，2-已评审
          requirement_list: this.checkedRequirement,
          reviewer: this.reviewerList.join(","),
          version_id: version_id
        }).then(res => {
          this.$message.success('添加记录成功，可以开始评审！')
          this.handleClose()
          this.getParentRequirementList()
          this.$emit('sure')
        }).catch(err => {
          this.$message.error(err.message)
        });
      },
      getTaskCase(){
        this.caseLists.forEach((caseList, caseIndex) => {
          this.checkEachModuleCase[caseIndex] = []
          caseList.forEach(item => {
            if (this.taskCaseList.indexOf(item.id) != -1) {
              this.checkEachModuleCase[caseIndex].push(item.id)
            }
          })
        })
        this.checkEachModuleCase.forEach((checked, checkedIndex) => {
          if (checked.length > 0 && checked.length == this.caseLists[checkedIndex].length) {
            this.moduleList[checkedIndex].isSelectAll = true
            this.moduleList[checkedIndex].isIndeterminate = false
          } else if (checked.length > 0 && this.caseLists[checkedIndex].length != 0) {
            this.moduleList[checkedIndex].isSelectAll = true
            this.moduleList[checkedIndex].isIndeterminate = true
          } else {
            this.moduleList[checkedIndex].isSelectAll = false
            this.moduleList[checkedIndex].isIndeterminate = false
          }
        })
      },
      getModuleCaseList(index, id){
        caseApi.getCaseByModule(id).then(res => {
          if (res && res.data) {
            this.caseLists[index] = res.data.data
          } else {
            this.caseLists[index] = []
          }
        }, error => {
          this.$message.error('读取需求失败: ' + error.message)
        })
      },
      getParentRequirementList() {
        console.log('获取所有的需求')
        let data = {
          projectid: this.projectId,
          review_status:1,//未评审
        };
        if (this.requirementClassId === 'a1') {  // 所有的需求
          console.log('get all type')
        } else if (this.requirementClassId === 'a2') {  // 未分类的需求
          data.notype=1
        } else if (this.requirementClassId === 'a3') {  // 已分类的需求
          data.notype=0
        } else {   // 具体版本号的需求
          data.versionid = parseInt(this.requirementClassId)
        }
        rqrmntApi.getRequirementList(data).then(res => {
          this.parentRequirementList = res.data.data.map(item => {
            this.$set(item, 'checked', false);
            item.parent_list.forEach(item2 => {
              this.$set(item2, 'checked', false);
            });
            return item
          })
        });
      },
      selectRqrmnt (parentRequirement) {
        console.log(parentRequirement.checked)
        parentRequirement.checked = !parentRequirement.checked
      },
      handleChange(val) {
        console.log('aaa', val)
      },
      handleCheckedCaseChange(value) {
        console.log('casevalue', value)
        if (this.checkEachModuleCase[this.curModuleActive].length != 0 && this.checkEachModuleCase[this.curModuleActive].length != this.caseLists[this.curModuleActive].length) {
          this.moduleList[this.curModuleActive].isIndeterminate = true
        }
        if (this.checkEachModuleCase[this.curModuleActive].length != 0 && this.checkEachModuleCase[this.curModuleActive].length == this.caseLists[this.curModuleActive].length) {
          this.moduleList[this.curModuleActive].isIndeterminate = false
          this.moduleList[this.curModuleActive].isSelectAll = true
        }
        if (this.checkEachModuleCase[this.curModuleActive].length == 0) {
          this.moduleList[this.curModuleActive].isSelectAll = false
          this.moduleList[this.curModuleActive].isIndeterminate = false
        }
        // let checkedCount = value.length;
        // this.checkAll = checkedCount === this.cities.length;
        // this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
      },
      selectModule(index){
        this.curModuleActive = index
      }
    }
  }
</script>
<style lang="scss" scoped>
  .module-case-content {
    border: 1px solid #eee;
    display: flex;
    min-height: 260px;
    max-height: 400px;
  }

  .modules {
    padding: 10px 0;
    flex: 1;
    border-right: 1px solid #eee;
    overflow: auto;
    li {
      padding: 5px 15px 5px 10px;
      display: flex;
      align-items: center;
      cursor: pointer;
      position: relative;
      .item{
        display: inline-block;
        width:100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow:ellipsis;
      }
      .checkBtn {
        padding: 5px;
        position: absolute;
        right: 5px;
        top: 50%;
        transform: translateY(-50%);
      }
      &:hover {
        background-color: rgba(16, 113, 211, 0.08);
      }
      &.selected {
        background-color: #d6ebff;
      }
      img {
        width: 20px;
        margin-right: 5px;
      }
      img + span {
        overflow: hidden;
        text-overflow: ellipsis;
        width: 120px;
        white-space: nowrap;
      }
    }
  }

  .cases {
    padding: 10px 10px 10px 25px;
    overflow: auto;
    flex: 1;
    li {
      padding: 5px 15px 5px 10px;
      display: flex;
      align-items: center;
      cursor: pointer;
      position: relative;
      .checkBtn {
        padding: 5px;
        position: absolute;
        right: 5px;
        top: 50%;
        transform: translateY(-50%);
      }
      &:hover {
        background-color: rgba(16, 113, 211, 0.08);
      }
      &.selected {
        background-color: #d6ebff;
      }
      img {
        width: 20px;
        margin-right: 5px;
      }
      img + span {
        overflow: hidden;
        text-overflow: ellipsis;
        width: 120px;
        white-space: nowrap;
      }
    }
  }
  .reviewer {
    width: 100%;
  }
</style>

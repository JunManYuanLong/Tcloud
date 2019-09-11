<template>
  <!-- <div class="module-cases"> -->
    <el-dialog
        title="选择用例"
        :visible.sync="dialogVisible"
        width="780px"
        :before-close="handleClose" :show-close="false" :close-on-click-modal="false">
        <div class="module-case-wrap" v-loading="loading">
          <!-- <p class="tips">注：模块的搜索只会对当前页搜索</p> -->
          <div class="search-bar">
            <!-- <el-input class="module" v-model="search.module_title" clearable  placeholder="输入模块标题关键字"></el-input> -->
            <el-input class="module" v-model="search.module_title" clearable  placeholder="输入模块标题关键字"  @change="getFilterModules" @keyup.native="getFilterModules"></el-input>
            <el-input v-model="search.case_title" clearable  placeholder="输入用例标题关键字"></el-input>
          </div>
          <div class="module-case-content">
            <ul class="modules">
              <!-- <li><el-checkbox :indeterminate="moduleIndeterminate" v-model="checkAllModule" @change="handleModuleAllChange">全选</el-checkbox></li> -->
              <li v-for="(module,index) in this.moduleLists[this.page.page_index]"><div class="module-item-wrap"   :class="{selected:moduleActive == module.id}">
                <span class="expend-btn" :class="{open:module.isOpen}" @click="handlerOpen(module)"></span>
                  <div @click="selectModule(index,module)">
                    <el-tooltip class="item" effect="dark" :content="module.name" placement="top-start">
                    <div @click="selectModule(index,module)">{{module.name}}</div>
                    </el-tooltip><el-checkbox :indeterminate="module.isIndeterminate" v-model="module.isSelectAll" @change="handleCheckAllChange" class="checkBtn" :key="index"></el-checkbox></div>
                </div>
                <ul class="sub-module" v-show="module.isOpen">
                  <li v-for="(subItem,subIndex) in module.modules" :key="subItem.id">
                    <div class="module-item-wrap"  @click="selectModule(index,subItem)" :class="{selected:moduleActive == subItem.id}">
                    <el-tooltip class="item" effect="dark" :content="subItem.name" placement="top-start">
                    <span>{{subItem.name}}</span>
                    </el-tooltip><el-checkbox :indeterminate="subItem.isIndeterminate" v-model="subItem.isSelectAll" @change="handleCheckAllChange" class="checkBtn" :key="subIndex"></el-checkbox>
                    </div>
                  </li>
                </ul>
              </li>
            </ul>
            <div class="cases" v-if="this.moduleLists[this.page.page_index]&&this.moduleLists[this.page.page_index].length>0" v-loading="caseLoading">
              <el-checkbox-group
                v-model="selectedModule.caseCheck" class="case" @change="handleCheckedCaseChange">
                <el-checkbox  v-for="caseItem in filterCases" :key="caseItem.id" :label="caseItem.id"><el-tooltip class="item" effect="dark" :content="caseItem.title" placement="top-start"><span>{{caseItem.cnumber}}: {{caseItem.title}}</span></el-tooltip></el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <el-pagination class="module_pages"
            small
            layout="prev, pager, next"
            @current-change="handleCurrentChange"
            :current-page.sync="page.page_index"
            :page-size="page.page_size"
            :total="page.total">
          </el-pagination>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button @click="handleSure">确定</el-button>
        </span>
      </el-dialog>
  <!-- </div> -->
</template>
<script>
import moduleApi from '@/api/module.js'
import caseApi from '@/api/case.js'
import projectApi from '@/api/project.js'
import taskApi from '@/api/task.js'
  export default{
    name: 'caseDialog',
    props: ['isShow','type','taskCaseList'],
    data() {
      return {
        dialogVisible: this.isShow,
        taskCases:[],
        moduleList:[],
        moduleLists:{},//存储每一页的module
        moduleIndeterminate:false,
        checkAllModule:false,
        curModuleIndex:0,//默认选中第一个module的索引
        curSubModuleIndex:'',
        moduleActive:'',//高亮状态标识
        loading:true,
        caseLoading:false,
        search:{
          module_title:'',
          case_title:''
        },
        moduleChange:false,
        page:{
          page_size:10,
          page_index:1,
          total:1
        },
        selectedModule:{},
        selectedModuleCaseT:[],
        taskCaseListTemp:this.taskCaseList?this.taskCaseList:[]
      }
    },
    computed:{
      projectId(){
        return this.$route.params.projectId
      },
      filterModules(){
        if(!this.loading){
          let modules = this.moduleLists[this.page.page_index]?this.moduleLists[this.page.page_index]:[]
          if(this.search.module_title){
           modules = modules.filter(item=>{
              if(item.name.includes(this.search.module_title)){
                return item
              }else if(item.modules&&item.modules.length>0){
                item = item.modules.filter(subItem=>{
                  if(subItem.name.includes(this.search.module_title)){
                    return subItem
                  }
                })
                if(item.length>0){
                  return item
                }
              }
            })
          }
          return modules
        }
        else{
          return []
        }
      },
      filterCases(){
        let cases = this.selectedModule.caseLists
        if(this.search.case_title){
          cases = cases.filter(item=>{
            if(item.title.includes(this.search.case_title)){
              return item
            }
          })
        }
        return cases
      }
    },
    watch: {
      'isShow': function (cval) {
        this.dialogVisible = cval
      },
      'selectedModule.caseCheck':{
        handler:function(val){
          let sVal = new Set(val)
          //获取差集
          let minus = this.selectedModuleCaseT.filter(x => !sVal.has(x))
          let minusT = new Set(minus)
          this.taskCaseListTemp = this.taskCaseListTemp.filter(x => !minusT.has(x))
        },
        deep:true
      }
    },
    methods:{
      selectedCases(){
        let cases = []
        Object.keys(this.moduleLists).forEach(item=>{
          this.moduleLists[item].forEach(subitem=>{
            cases= cases.concat(subitem.caseCheck)
            if(subitem.hasOwnProperty('modules')){
              subitem.modules.forEach(thitem=>{
                cases= cases.concat(thitem.caseCheck)
              })
            }
          })
        })
        return cases
      },
      handleClose () {
        this.$emit('close')
      },
      handleSure() {
        let selectedCases = this.selectedCases()
        let cases = Array.from(new Set([...this.taskCaseListTemp, ...selectedCases]))
        this.$emit('caseSelect', cases)
      },
      //反选操作
      getTaskCase(caseList){
        //把选择的caseid 分配回对应的结构里
        let selectedCases = []
        if(caseList&&caseList.length>0){
          caseApi.getCaseListByIds({case_ids:caseList}).then(res=>{
            let selectedCases = res.data.data
            this.moduleLists[this.page.page_index].forEach(item=>{
              if(!item.handleChange){//没有人为操作，才做反选选择
                selectedCases.forEach(cs=>{
                    if(cs.moduleid == item.id){
                      item.caseCheck.push(cs.id)
                      item.isIndeterminate = true
                    }
                  })
                  if(item.caseCheck&&item.caseLists&&item.caseCheck.length>0&&item.caseCheck.length==item.caseLists.length){
                    item.isSelectAll = true
                    item.isIndeterminate = false
                  }
              }
              
              if(item.hasOwnProperty('modules')){
                item.modules.forEach(subitem=>{
                  if(!item.handleChange){//没有人为操作，才做反选选择
                      selectedCases.forEach(cs=>{
                          if(cs.moduleid == subitem.id){
                            subitem.caseCheck.push(cs.id)
                            subitem.isIndeterminate = true
                          }

                      })
                      if(subitem.caseCheck&&subitem.caseLists&&subitem.caseCheck.length>0&&subitem.caseCheck.length==subitem.caseLists.length){
                        subitem.isSelectAll = true
                        subitem.isIndeterminate = false
                      }
                  }
                })
              }
            })
          },error=>{

          })
        }
        
      },
      handlerOpen(module){
        if(module.hasOwnProperty('modules')){//有子模块才给伸缩
          module.isOpen = !module.isOpen
        }
        // 
      },
      getCaseList(){
        //如果当前选中的case已经存在就不在重新请求
        if(this.selectedModule.caseLists&&this.selectedModule.caseLists.length>0){
          return false
        }
        this.caseLoading = true
        caseApi.getCaseByModule(this.moduleActive).then(res=>{
           let clist = res.data.data
           if(clist.length>0&&clist[0].moduleid==this.moduleActive&&this.selectedModule.caseLists&&this.selectedModule.caseLists.length == 0){
            this.selectedModule.caseLists = clist
            if(this.selectedModule.caseLists&&this.selectedModule.caseCheck&&this.selectedModule.caseCheck.length>0&&this.selectedModule.caseLists.length==this.selectedModule.caseCheck.length){
              this.selectedModule.isIndeterminate = false
              this.selectedModule.isSelectAll = true
            }
           }
           this.caseLoading = false
        },error=>{
          this.caseLoading = false
        })
      },
      getCaseCheck(){
        let caseCheck = []
        if(this.curSubModuleIndex!==''){
          caseCheck = this.moduleList[this.curModuleIndex].modules[this.curSubModuleIndex].caseCheck
        }else{
          caseCheck = this.moduleList[this.curModuleIndex].caseCheck
        }
        return caseCheck
      },
      getModules(){
        //弹框显示状态下，不重复请求
        // 
        if(!this.moduleChange&&this.moduleLists[this.page.page_index]&&this.moduleLists[this.page.page_index].length>0){
             this.moduleActive = this.moduleLists[this.page.page_index][0].id
             this.selectedModule = this.moduleLists[this.page.page_index][0]
             this.getCaseList()
          return false
        }
        this.loading = true
        let params = {
          modulename:this.search.module_title,
          page_index:this.page.page_index,
          page_size:this.page.page_size
        }
        moduleApi.getModuleByProject(this.projectId,params).then(res=>{
          let mData = res.data.data
          this.page.total = res.data.module_total
          this.moduleLists[this.page.page_index] = mData.map((item,index) =>{
            item.isSelectAll = false
            item.isIndeterminate = false
            item.handleChange = false
            item.isOpen = true
            item.caseCheck = []
            item.caseLists = []
            if(item.hasOwnProperty('modules')){
              item.modules.map((subItem,subIndex)=>{
                subItem.isSelectAll = false
                subItem.isIndeterminate = false
                subItem.handleChange = false
                subItem.caseCheck = []
                subItem.caseLists = []
                return subItem
              })
            }
            return item
          })
          //默认展示第一个节点
            if(this.moduleLists[this.page.page_index].length>0){
             this.moduleActive = this.moduleLists[this.page.page_index][0].id
             this.selectedModule = this.moduleLists[this.page.page_index][0]
             this.selectedModuleCaseT = this.selectedModule.caseCheck
             this.getCaseList()
            }
            this.loading = false
            this.getTaskCase(this.taskCaseListTemp)
          // this.moduleDataForFilter = res.data.data
        })
      },
      getFilterModules(){
        let selectedCases = this.selectedCases()
        this.taskCaseListTemp =  Array.from(new Set([...this.taskCaseListTemp, ...selectedCases]))
        this.moduleChange = true
        this.page.page_index = 1
        this.getModules()
      },
      handleCurrentChange(val){
        this.search.case_title = ""
        this.page.page_index = val
        this.getModules()
      },
      handleCheckAllChange(val) {
        this.selectedModule.handleChange = true //标志操作
        if(val &&this.selectedModule.caseLists&& this.selectedModule.caseLists.length>0){
          this.selectedModule.caseCheck = []
          this.selectedModule.caseLists.forEach(item=>{
            this.selectedModule.caseCheck.push(item.id)
          })
          this.selectedModule.isSelectAll = true
          this.selectedModule.isIndeterminate = false
        }else{
          this.selectedModule.caseCheck = []
          this.selectedModule.isSelectAll = false
          this.selectedModule.isIndeterminate = false
        }
      },
      handleCheckedCaseChange(value) {
        if(this.selectedModule.caseCheck.length == 0){
          this.selectedModule.isSelectAll = false
          this.selectedModule.isIndeterminate = false
        }else if(this.selectedModule.caseCheck.length == this.selectedModule.caseLists.length){
          this.selectedModule.isSelectAll = true
          this.selectedModule.isIndeterminate = false
        }else{
          this.selectedModule.isSelectAll = false
          this.selectedModule.isIndeterminate = true
        }
      },
      selectModule(index,module){
        this.moduleActive = module.id
        this.curModuleIndex = index
        this.selectedModule = module
        this.selectedModuleCaseT = this.selectedModule.caseCheck
        this.getCaseList()
      },
    },
    created(){
      // this.getMoudleCase()
      this.getModules()
    }
  }
</script>
<style lang="scss" scoped>
.search-bar{
  display: flex;
  .module{
    width: 250px;
    margin-right:15px;
  }
}
.module-case-content{
  border:1px solid #eee;
  display:flex;
  min-height:260px;
  max-height:400px;
}
.modules{
  padding:10px 10px 10px 0;
  width:200px;
  border-right:1px solid #eee;
  overflow:auto;
  li{
    position:relative;
    .module-item-wrap{
       padding:5px 15px 5px 10px;
      display:flex;
      align-items:center;
      cursor:pointer;
      position:relative;
      &:hover{
        background-color: rgba(16, 113, 211, 0.08);
      }
      &.selected{
        background-color: #d6ebff;
      }
      .item{
        width:120px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .checkBtn{
      padding:5px;
      position:absolute;
      right:0;
      top:50%;
      transform:translateY(-50%);
    }
    
    img{
      width:20px;
      margin-right:5px;
    }
    img + span{
      overflow:hidden;
      text-overflow: ellipsis;
      width: 120px;
      white-space: nowrap;
    }
  }
  .expend-btn{
        display: -webkit-inline-box;
        position: relative;
        width: 12px;
        height: 12px;
        cursor: pointer;
        flex: 0 0 12px;
        border-width: 1px;
        border-style: solid;
        border-color: rgb(201, 207, 215);
        border-image: initial;
        border-radius: 2px;
        transition: border-color 0.3s ease 0s;
        margin-right:8px;
        &:hover{
          border-color: rgb(16, 113, 211);
          &::before,&::after{
            background-color: rgb(16, 113, 211);
          }
        }
        &::before,&::after{
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          display: block;
          width: 6px;
          height: 2px;
          background-color: rgb(201, 207, 215);
          transform: translate(-50%, -50%);
        }
        &::before{
          transition: background-color 0.3s ease 0s;
        }
        &::after{
          transform: translate(-50%, -50%) rotate(-270deg);
          transition: background-color 0.3s ease 0s, transform 0.3s ease 0s;
        }
        &.open::after{
          transform: translate(-50%, -50%);
          transition: background-color 0.3s ease 0s, transform 0.3s ease 0s;
        }
      }
       .sub-module{
          position:relative;
          .module-item-wrap{
            padding-left:31px;
          }
          &::before{
            content: "";
            position: absolute;
            display: block;
            top: -13px;
            left: 16px;
            width: 1px;
            height: 101%;
            background-color:#e0e0e0;
            transform: translateX(-50%);
            pointer-events: none;
            transition: background-color 0.3s ease 0s;
          }
        }
}
.cases{
  padding:10px 10px 10px 25px;
  overflow:auto;
  flex:1;
  .el-checkbox-group{
    .el-checkbox{
      display: flex;
      margin: 5px 0;
      align-items: center;
      .el-checkbox__label{
        >span{
          display:inline-block;
          max-width: 500px;
          overflow: hidden;
          text-overflow:ellipsis;
        }
      }
    }
  }
  .el-checkbox+.el-checkbox{
    margin-left:0;
  }
}
</style>

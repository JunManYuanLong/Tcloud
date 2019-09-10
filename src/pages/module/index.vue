<template>
    <div>
      <div class="modules-wrap">
        <h2>用例库</h2>
        <el-input
          placeholder="搜索module"
          v-model="searchModule" class="m-search" clearable>
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <div class="m-title" :class="{allActive:moduleId == 'all'}" @click="toAllCases">
          <div class="des"><img src="../../assets/img/modules.png" alt=""><span>全部用例（{{caseTotal}}）</span></div>
          <div class="opts" title="添加模块" @click="addModuleFun"><i class="el-icon-circle-plus"></i></div>
        </div>
        <ul class="module-tree">
          <li v-for="(item,index) in moduleDatas" :key="item.id">
            <div class="ct-wrap" :class="{active:activeModuleId == item.id}">
              <span class="expend-btn" @click="handlerOpen(index, item)" :class="{open:item.isOpen}"></span>
              <div class="des" @click="selectModule(item)">
              <el-tooltip class="item" effect="dark" :content="item.name" placement="top-start">
                  <span>{{item.name}}</span>
                </el-tooltip><i class="total-number">{{item.total}}</i></div>
              <div class="opts">
                <div class="edit-btn" title="编辑" @click="editModuleFun(item)"><i class="el-icon-edit"></i></div>
                <div class="delete-btn" title="删除" @click="deleteModuleFun(item)"><i class="el-icon-delete"></i></div>
                <div class="plus-btn" title="添加子模块" @click="addChildModuleFun(item)"><i class="el-icon-plus"></i></div>
              </div>
            </div>
            <ul class="child-wrap" v-show="item.isOpen">
              <li v-for="subItem in item.modules" :key="subItem.id">
                <div class="ct-wrap" :class="{active:activeModuleId == subItem.id}">
                  <div class="des" @click="selectModule(subItem)">
                  <el-tooltip class="item" effect="dark" :content="subItem.name" placement="top-start">
                      <span>{{subItem.name}}</span>
                    </el-tooltip><i class="total-number">{{subItem.total}}</i></div>
                  <div class="opts">
                    <div class="edit-btn" title="编辑" @click="editModuleFun(subItem)"><i class="el-icon-edit"></i></div>
                    <div class="delete-btn" title="删除" @click="deleteModuleFun(subItem)"><i class="el-icon-delete"></i></div>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <router-view></router-view>
      <div v-show="!moduleId" class="no-select-module"><p>您还没有选择要编辑的用例模块，请选择哦！</p></div>
      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="400px">
        <span>您确定要删除（ {{deleteName}} ）{{deleteType}}？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="sureDelFun">确 定</el-button>
        </span>
      </el-dialog>
      <editDialog :isShow ="editDialogVisible" :moduleId="editModuleId" :moduleParentId='moduleParentId' @refreshData="refreshDataFun" @close="showDialog(false)"></editDialog>
    </div>
</template>
<script>
import editDialog from './editDialog.vue'
import moduleApi from '@/api/module.js'
import caseApi from '@/api/case.js'
  export default{
    data() {
      return {
        loading : true,
        searchModule: '',
        tData: {
          data: [],
          total: 1
        },
        filterValue:'',
        deleteName: '',
        deleteType: '',
        dialogVisible: false,
        activeModuleId: '',
        selectModuleInfo: {},
        moduleDatas: [],
        caseTotal:0,
        editModuleId: '',
        moduleParentId:'',
        editCaseId: '',
        editDialogVisible: false,
        caseTypes:['功能回归','冒烟','UI自动化','接口自动化','新功能']
      }
    },
    components:{
      editDialog
    },
    computed:{
      projectId(){
        return this.$route.params.projectId
      },
      moduleId () {
        return this.$route.params && this.$route.params.moduleId ? this.$route.params.moduleId : ''
      },
      moduleChange(){
        return this.$store.state.module.change
      }
    },
    watch:{
      moduleId(val){
        if(!val||val == 'all'){
          this.activeModuleId = ''
        }
      },
      $route(){
        this.getModules()
      },
      moduleChange(val){
        this.getModules()
      },
      searchModule(val){
        this.getModules()
      }
    },
    methods:{
      getCaseType(types){
        let ctype = []
        let text = ''
        if(types.indexOf(',')){
          ctype = types.split(',')
        }else{
          ctype = [types]
        }
        ctype.forEach(item => {
          text += this.caseTypes[item-1] + '，'
        })
        return text;
      },
      getModules(){
        let params = {
          modulename:this.searchModule
        }
        moduleApi.getModuleByProject(this.projectId,params).then(res=>{
          let data = res.data.data
          this.moduleDatas = data.map(item=>{
             item.isOpen = true
             return item
          })
          console.log('moduleData',this.moduleDatas)
          this.caseTotal = res.data.total
          // this.moduleDataForFilter = res.data.data
        })
      },
      handlerOpen(index, item){
        if (item.modules && item.modules.length > 0) {
          let open = !this.moduleDatas[index].isOpen
          this.$set(this.moduleDatas[index],'isOpen',open)
        }
      },
      getSingleModule(id){
        if(id == 'all'){
          return false
        }
        moduleApi.getSingleModule({id: id}).then(res=>{
          let item = res.data.data[0]
          this.selectModule(item)
        })
      },
      emitDataChange() {
        this.loading = false
        if(this.activeModuleId){
          caseApi.getCaseByModule(this.activeModuleId).then(res => {
              this.tData.data = res.data.data
          }, error => {
            this.tData.data = []
          })
        }
      },
      addModuleFun() {
        this.editModuleId = ''
        this.moduleParentId = ''
        this.showDialog(true)
      },
      toAddFun(){
        this.$router.push({
          name:'caseAdd',
          params: {
            moduleId: this.activeModuleId
          }
        })
      },
      editFun(row) {
        this.$router.push({
          name:'caseEdit',
          params: {
            moduleId: this.activeModuleId,
            caseId: row.id
          }
        })
      },
      deleteFun(row) {
        this.deleteName = row.cnumber
        this.deleteType = '用例'
        this.editCaseId = row.id
        this.dialogVisible = true
      },
      editModuleFun(item) {
        console.log('mid', item.id)
        this.editModuleId = item.id
        this.showDialog(true)
      },
      deleteModuleFun(item){
        this.deleteName = item.name
        this.deleteType = '模块'
        this.editModuleId = item.id
        this.dialogVisible = true
      },
      addChildModuleFun(item){
        this.editModuleId = ''
        this.moduleParentId = item.id
        this.showDialog(true)
      },
      sureDelFun(){
        if(this.deleteType === '模块'){
            moduleApi.deleteModule({id: this.editModuleId}).then(res => {
            this.dialogVisible = false
            this.$message({
               message: '模块删除成功！',
               type: 'success'
            })
            this.$router.push({
              name:'module'
            })
            this.refreshDataFun()
          }).catch(err => {
            this.$message.error(err.message)
          })
        }else{
          caseApi.deleteCase({id: this.editCaseId}).then(res => {
              this.dialogVisible = false
              this.$message({
                 message: 'case删除成功！',
                 type: 'success'
              })
              this.getSingleModule(this.activeModuleId)
            }).catch(err => {
              this.$message.error(err.message)
            })
          }
      },
      selectModule(item) {
        this.activeModuleId = item.id
        this.selectModuleInfo = item;
        this.$router.push({name: 'caseList', params: {moduleId: item.id.toString()}})
        // this.$refs.dataTable.refreshMethod();
      },
      toAllCases(){
        this.$router.push({name: 'caseList', params: {moduleId: 'all'}})
      },
      refreshDataFun(){
        this.editDialogVisible  = false;
        this.editModuleId =''
        this.getModules();
      },
      showDialog (val){
        if(!val){
          this.editModuleId =''
        }
        this.editDialogVisible = val
      }
    },
    created(){
      this.getModules()
      if(this.moduleId){
          this.getSingleModule(this.moduleId)
        }
    }
  }
</script>
<style lang="scss">
.modules-wrap{
  .el-input__inner{
      border:none;
    }
    .el-input__prefix{
        left:23px;
    }
  }
</style>
<style lang="scss" scoped>
.q-crumb{
  padding:0 0 10px 0;
  display:flex;
  align-items:center;
  border-bottom:1px solid #ddd;
  margin-bottom:20px;
  .el-icon-tickets{
    display:block;
    margin-right:5px;
    color:#33c0fb;
    font-size:18px;
  }
  .el-breadcrumb{
    font-size:16px;
  }
}
.q-opt{
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:20px;
  .q-search{
    width:200px;
  }
}
.permission-unit{
  display:inline-block;
  padding:0 10px;
  margin:0 5px;
  background-color:#b9dbff;
  border-radius:3px;
  color:#fff;
}
/*modulecss*/
.modules-wrap{
  padding:20px 0;
  position:absolute;
  left:0;
  top:0;
  height:100%;
  display: flex;
  flex-direction: column;
  width: 360px;
  background-color: rgb(255, 255, 255);
  box-shadow: rgba(0, 0, 0, 0.05) 1px 0px 10px 0px;
  z-index: 100;
  flex: 0 0 360px;
  h2{
    padding:0 20px;
  }
  .m-search{
    padding:0 20px;
    margin:10px 0;
    .el-input__inner{
      border:none;
    }
  }
  .m-title{
    min-height:28px;
    padding:0 20px;
    margin-bottom:10px;
    border-top:1px solid #eee;
    border-bottom:1px solid #eee;
    display:flex;
    align-items:center;
    justify-content:space-between;
    cursor:pointer;
    &.allActive{
      background-color:#d6ebff;
    }
    img{
      width:30px;
    }
    .des{
      display: flex;
    align-items: center;
      span{
        color: #926dec;
        margin-left:10px;
      }
      
    }
    .opts{
      i{
        font-size:28px;
        color: #409EFF;
      }
    }
  }
}
.module-tree{
  overflow:auto;
  li{
    cursor:pointer;
    .ct-wrap{
      padding:0 20px 0 30px;
      display:flex;
      align-items:center;
      justify-content:space-between;
      &.active{
        background-color: rgb(214, 235, 255);
        .des span{
          color: rgb(16, 113, 211);
        }
      }
      &:hover{
        background-color: rgba(16, 113, 211, 0.08);
      }
    }
    .des{
      padding:10px 0;
      display:flex;
      flex:3;
      height:40px;
      align-items:center;
      position:relative;
      margin-left:10px;
      img{
        width:24px;
        margin-right:5px;
      }
      span{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 160px;
      }
      .total-number{
          position:absolute;
          right:8px;
          min-width: 24px;
          font-size: 12px;
          color: rgb(255, 255, 255);
          flex: 0 1 auto;
          padding: 0px 8px;
          background: rgb(212, 216, 222);
          border-radius: 8px;
      }
    }
    .opts{
      display:flex;
      align-items:center;
      justify-content:flex-start;
      width:68px;
      div{
        width:33%;
      }
      .edit-btn{
        color: #11d847;
      }
      .delete-btn{
        color: #f56c6c;
      }
      .plus-btn{
        color:#409EFF;
        font-size:16px;
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
  }
  .child-wrap{
    position:relative;
    &::before{
      content: "";
      position: absolute;
      display: block;
      top: -14px;
      left: 36px;
      width: 1px;
      height: 101%;
      background-color:#e0e0e0;
      transform: translateX(-50%);
      pointer-events: none;
      transition: background-color 0.3s ease 0s;
    }
    li{
      .ct-wrap{
        padding-left:40px;
      }
    }
  }
}
.case-list{
  margin-left:360px;
  .case-header{
    display:flex;
    align-items:center;
    margin-bottom:10px;
    img{
      height:20px;
      margin-right:10px;
    }
    .s-module{
      display:flex;
      height:30px;
      align-items:center;
      width:375px;
    }
  }
}
.no-select-module{
  margin-left:360px;
  p{
    width:300px;
    margin:80px;
    text-align:center;
    font-size:20px;
    color:#e6a23c;
    border:1px solid #f5c781;
    padding:10px;
    border-radius:10px;
    position:relative;
    &:after{
      position:absolute;
      top:20px;
      left:-89px;
      content:"";
      display:block;
      width:90px;
      height:91px;
      background:url('../../assets/img/arrow.png') no-repeat;
      background-size:100%;
    }
  }
}
.case-link{
  color:#409EFF;
}
</style>
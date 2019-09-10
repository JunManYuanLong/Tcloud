<template>
  <!-- <div class="module-cases"> -->
    <el-dialog
        title="选择需求"
        :visible.sync="dialogVisible"
        width="900px"
        :before-close="handleClose" :show-close="false" :close-on-click-modal="false" class="rq-dialog">
        <div class="requirement-wrap">
          <p class="selected-rq">已经选择了<span>{{checkedNum}}</span>个需求</p>
          <div class="parent-search">
            <el-input v-model="requirement.parentTitle" clearable placeholder="请输入父需求的关键字搜索！"></el-input>
          </div>
          <div class="child-search">
            <el-input v-model="requirement.childTitle" clearable placeholder="请输入子需求的关键字搜索！"></el-input>
          </div>
          <div class="col-wrap">
            <div class="tree-map">
              <!-- <el-tree v-if="showTree" ref="requirementTree" :data="requirementClass" :props="treeProps" node-key="id" default-expand-all :default-expanded-keys=""   @current-change="getSelectedData"  highlight-current></el-tree> -->
              <h2>需求版本</h2>
              <ul class="versionList">
                <li v-for="version in requirementClass" :key="version.id" :class="{selected:activeVersionId == version.id}" @click="selectVersionFun(version)">{{version.title}}</li>
              </ul>
            </div>
            <ul class="parent-rq">
              <li v-for="parent in sqparentRequirementList" :key="parent.id" @click="handleActive(parent)" :class="{selected:activeParentId == parent.id}">
                <el-tooltip class="item" effect="dark" :content="parent.title" placement="top-start">
                  <span><em>{{parent.jira_id}} </em>{{parent.title}}</span>
                </el-tooltip>
                <el-checkbox v-model="parent.checked" @change="handleChange" class="checkBtn" :key="parent.id" :disabled="parent.review_status == 1"></el-checkbox>
              </li>
            </ul>
            <ul class="child-rq">
              <li v-for="child in activeChildRqrmntList" :key="child.id">
                <el-tooltip class="item" effect="dark" :content="child.title" placement="top-start">
                  <span><em>{{child.jira_id}} </em>{{child.title}}</span>
                </el-tooltip>
                <el-checkbox v-model="child.checked" @change="handleChange" class="checkBtn" :key="child.id"></el-checkbox>
              </li>
            </ul>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleSure">确定</el-button>
        </span>
      </el-dialog>
  <!-- </div> -->
</template>
<script>
import requirementApi from '@/api/requirement'
import versionApi from '@/api/version'
  export default{
    name: 'requirmentSelect',
    props: ['isShow'],
    data() {
      return {
        dialogVisible: this.isShow,
        showTree:false,
        parentRequirementList: [],
        activeParentId: 0,
        activeVersionId: '',
        isIndeterminate:false,
        checkAll:false,
        requirementClass:[],
        treeProps:{
          children: 'children',
          label: 'label',
          isLeaf:'leaf'
        },
        requirement:{
          parentTitle:'',
          childTitle:''
        }
      }
    },
    computed:{
      projectId(){
        return this.$route.params.projectId
      },
      checkedRequirementIds () {
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
      checkedRequirement () {
        let v = [];
        this.parentRequirementList.forEach(item => {
          if (item.checked === true) {
            v.push(item)
          }
          item.parent_list.forEach(item2 => {
            if (item2.checked === true) {
              v.push(item2)
            }
          })
        });
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
          let child =  this.parentRequirementList.find(item => item.id === this.activeParentId).parent_list
          if(this.requirement.childTitle){
           child = child.filter(item=>item.title.includes(this.requirement.childTitle)||item.jira_id.toString().includes(this.requirement.childTitle))
          }
          return child
        } else {
          return []
        }
      },
      sqparentRequirementList(){
        let data = this.parentRequirementList
        if(this.requirement.parentTitle){
          data = this.parentRequirementList.filter(item => item.title.includes(this.requirement.parentTitle)||item.jira_id.toString().includes(this.requirement.parentTitle))
        }
        return data
      }
    },
    watch: {
      'isShow': function (cval) {
        this.dialogVisible = cval
        if(cval){
          // this.getVersions();
        }
      },
      
    },
    methods:{
      getVersions(){
        versionApi.getVersionByProject({projectid:this.projectId}).then(res=>{
            let  result = res.data.data
            this.requirementClass = result
            this.activeVersionId = result[0].id
            this.getParentRequirementList(this.activeVersionId)
          })
      },
      handleClose () {
        ///关闭前操作
        this.$emit('close')
      },
      handleChange(val) {
        console.log('aaa', val)
      },
      selectVersionFun(item){
        this.activeVersionId = item.id
        this.getParentRequirementList(this.activeVersionId)
      },
      getSelectedData(data,node){//操作树节点
        this.getParentRequirementList(data.id)
      },
      handleActive (parent) {
        console.log('parent:', parent)
        this.activeParentId = parent.id
      },
      handleSure() {
        this.$emit('rqData',this.checkedRequirementIds,this.checkedRequirement)
        this.$emit('close')
      },
      getParentRequirementList(id) {
        let data = {
          projectid: this.projectId,
          review_status:2,//已评审
          versionid:id 
        };
        // if (id === 'a1') {  // 所有的需求
        //   console.log('get all type')
        // } else if (id === 'a2') {  // 未分类的需求
        //   data.notype=1
        // } else if (id === 'a3') {  // 已分类的需求
        //   data.notype=0
        // } else {   // 具体版本号的需求
        //   data.versionid = parseInt(id)
        // }
        requirementApi.getRequirementList(data).then(res => {
          this.parentRequirementList = res.data.data.map(item => {
            this.$set(item, 'checked', false);
            item.parent_list.forEach(item2 => {
              this.$set(item2, 'checked', false);
            });
            return item
          })
          this.activeParentId = 0 //重置已选择的父需求
        });
      },
      
    },
    created(){
      this.getVersions();
    }
  }
</script>
<style lang="scss">
.rq-dialog{
  .el-dialog__body{
    padding-top:10px;
  }
}
.requirement-wrap{
  .checkbox{
    .el-checkbox__label{
        display:none;
      }
    }
}

</style>
<style lang="scss" scoped>
.requirement-wrap{
  max-height:500px;
  overflow:auto;
  position: relative;
  .parent-search{
    position: absolute;
    left:219px;
    top:0;
    .el-input{
      width:300px;
    }
  }
  .child-search{
    position:absolute;
    left:539px;
    top:0;
    .el-input{
      width:300px;
    }
  }
  .selected-rq{
    display: inline-block;
    padding-bottom: 10px;
  }
  .tree-wrap{
    h2{
      font-weight:700;
      margin-bottom:0;
    }
  }
  .versionList{
    margin-left:15px;
    cursor:pointer;
    li{
      padding:5px;
      &.selected{
        background-color:#f0f7ff;
      }
    }
  }
  .col-wrap{
    display:flex;
  }
  .selected-rq{
    span{
      pading:0 5px;
      color:#409EFF;
    }
  }
  .tree-map{
    padding:10px;
    width:200px;
    height:450px;
    overflow:auto;
    border:1px solid #ccc;
  }
  .parent-rq,.child-rq{
    padding:10px;
    width:300px;
    height:450px;
    overflow:auto;
    border:1px solid #ccc;
    margin-left:20px;
    li{
      display:flex;
      align-item:center;
      cursor:pointer;
      em{
        color:#0f91f1;
      }
      &.selected{
        background-color:#f0f7ff;
      }
      .item{
        display:inline-block;
        width:240px;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
      }
    }
  }
}
</style>

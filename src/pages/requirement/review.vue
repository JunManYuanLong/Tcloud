<template>
  <div class="requirement-review">
    <div class="history">
      <h4>评审记录</h4>
      <a-timeline>
        <a-timeline-item v-for="item in reviewListPro" :key="item.id" :color="colorMap[item.review_status]">
          <div class="review-content" :class="{ active: isActive(item.id)}" @click="selectRecord(item.id)">
            <span style="color:rgba(0, 0, 0, 0.45); font-size: 12px">{{item.creation_time}}</span>
            <!--{{item.content}}-->
            <!--<br>-->
            <span class="review_status" :style="item.review_status === 1 ? {color: '#f50'} : {color: '#87d068'}">{{item.review_status === 1 ? '未评审' : item.review_status === 2 ? '已评审' : '未知'}}</span>
            <div><span class="review_status" style="color:rgba(0, 0, 0, 0.45); font-size: 13px">发起人:</span>
            <span class="review_status" style="color:rgba(0, 0, 0.59, 0.59); font-size: 14px">{{item.creator_name}}</span></div>
          </div>
        </a-timeline-item>
      </a-timeline>
      <infinite-loading v-if="pageTotal" @infinite="infiniteHandler"  ref="infiniteLoading">
      </infinite-loading>
    </div>
    <div class="content">
      <el-button type="primary" @click="visible = true">创建评审</el-button>
      <el-button v-if="selectedRecord !== 0" @click="getRqrmntListByReviewId">刷新</el-button>
      <el-button style="float: right;margin-right: 40px;" type="primary" v-if="canReview" @click="handleReview">提交评审</el-button>
      <a-table :loading="loading" class="table" v-if="selectedRecord !== 0" :columns="columns" :dataSource="requirementData" :rowKey="record => record.id" childrenColumnName="parent_list">
        <template slot="index" slot-scope="text, record, index">
          {{text}}
        </template>
        <template slot="name" slot-scope="text, record, index" style="max-width: 100px" class="review-name">
          <span class="toDetail" @click="toDetailFun(record)">{{text}}</span>
        </template>
        <template slot="requirement_type" slot-scope="text, record, index">
          <span>{{getType(text)}}</span>
        </template>
        <template slot="priority" slot-scope="text, record, index">
          <span>{{getPriority(text)}}</span>
        </template>
        <template slot="operation" slot-scope="text, record">
          <antd-checkable-tag :disabled="!canReview" :type="record.review_status === 1 ? 'pass': 'initial'" @change="handleTagChange(record, 1)" text="成功"></antd-checkable-tag>
          <antd-checkable-tag :disabled="!canReview" :type="record.review_status === 2 ? 'fail': 'initial'" @change="handleTagChange(record, 2)" text="失败"></antd-checkable-tag>
          <!--<a-checkable-tag checked color="#87d068">通过</a-checkable-tag>-->
          <!--<a-tag color="#87d068">通过</a-tag>-->
          <!--<a-tag color="#f50">未通过</a-tag>-->
          <!--<a-tag color="">未通过</a-tag>-->
        </template>
      </a-table>
      <!--<el-form>-->
        <!--<el-form-item  prop="description" class="blockItem">-->
          <!--<editor v-model="description"></editor>-->
        <!--</el-form-item></el-form>-->
      <div v-if="selectedRecord !== 0">

      <div >评审结果：</div>
        <el-input
          :autosize="{ minRows: 10}"
          type="textarea"
          v-model="comment"
          :disabled="textarea_disabled"
          show-word-limit
        >
        </el-input>
      <div style="margin-top: 8px;word-wrap:break-word;width:auto">评审人员：{{reviewer || '无'}}</div>
      </div>
    </div>
    <reviewDetail v-model="requirementDrawer" :requireData="requirementDetail" :drawerStyle="drawerStyle"></reviewDetail>
    <requirementDialog :isShow="visible" @close="visible = false" @sure="handleSure"></requirementDialog>
  </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'
  const columns = [
    {
      title: 'ID',
      dataIndex: 'requirement_id',
      width: '120px',
      scopedSlots: {customRender: 'index'},
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      scopedSlots: {customRender: 'name'},
    }, {
      title: '类型',
      dataIndex: 'requirement_type',
      key: 'requirement_type',
      width: '120px',
      scopedSlots: {customRender: 'requirement_type'},
    }, {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: '120px',
      scopedSlots: {customRender: 'priority'},
    }, {
      title: '创建人',
      dataIndex: 'creator_name',
      key: 'creator_name',
      width: '120px',
    }, {
      title: '操作',
      dataIndex: 'operation',
      width: '200px',
      scopedSlots: {customRender: 'operation'},
    }
  ];

  import AntdCheckableTag from '@/components/AntdCheckableTag.vue'
  import rqrmntApi from '@/api/requirement.js'
  import requirementDialog from './requirementDialog.vue'
  import reviewDetail from './reviewDetail.vue'

  export default {
    name: 'RequirementReview',
    components: {
      requirementDialog,
      reviewDetail,
      AntdCheckableTag,
      InfiniteLoading
    },
    data () {
      return {
        loading: false,
        colorMap: {
          1: 'blue',
          2: 'green'
        },
        reviewStatusMap: {
          pass: '#87d068',
          fail: '#f50',
          normal: ''
        },
        visible: false,
        comment: '',
        reviewer: '',
        textarea_disabled: false,
        reviewList: [],
        selectedRecord: 0,
        requirementData: [],
        columns,
        requirementDrawer: false,  // 需求详情抽屉开关
        requirementDetail: {},  // 需求详情抽屉内容
        drawerStyle:{
          width:'910px'
        },  // 需求详情抽屉样式
        page:{
          page_index:1,
          page_size:20
        },
        pageTotal:1,
      }
    },
    computed: {
      canReview () {
        if (this.selectedRecord === 0) {
          return false
        }
        return this.reviewList.find(item => item.id === this.selectedRecord).review_status === 1  // 1-未评审，2-已评审
      },
      projectId (){
        return parseInt(this.$route.params.projectId)
      },
      reviewListPro () {
        return this.reviewList.map((item, index) => {
          item.content = `第${item.id}次需求评审`
          return item
        })
      },
      requirementClassId() {
        return this.$route.params.requirementClassId ? this.$route.params.requirementClassId : ''
      },
      passRqrmntIdList () {
        let r = [];
        this.requirementData.forEach(parent => {
          if (parent.review_status === 1) {
            r.push(parent.id)
          }
          if (parent.parent_list && Array.isArray(parent.parent_list)) {
            parent.parent_list.forEach(child => {
              if (child.review_status === 1) {
                r.push(child.id)
              }
            })
          }
        });
        return r
      },
      failRqrmntIdList () {
        let r = [];
        this.requirementData.forEach(parent => {
          if (parent.review_status === 2) {
            r.push(parent.id)
          }
          if (parent.parent_list && Array.isArray(parent.parent_list)) {
            parent.parent_list.forEach(child => {
              if (child.review_status === 2) {
                r.push(child.id)
              }
            })
          }
        });
        return r
      },
      noOptRqrmntIdList () {
        let r = [];
        this.requirementData.forEach(parent => {
          if (parent.review_status === 0) {
            r.push(parent.id)
          }
          if (parent.parent_list && Array.isArray(parent.parent_list)) {
            parent.parent_list.forEach(child => {
              if (child.review_status === 0) {
                r.push(child.id)
              }
            })
          }
        });
        return r
      },
    },
    watch: {
      'selectedRecord' (to, from) {
        console.log('selectedRecord change')
        if (to !== 0) {
          this.getRqrmntListByReviewId()
        }
      }
    },
    created () {
      this.getRqrmntList()
    },
    methods: {
      isActive (id) {
        return id === this.selectedRecord
      },
      reviewFun(){
        this.$confirm('提交评审后不可更改，确认是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          rqrmntApi.reviewRqrmnt({
            result: {
              pass: this.passRqrmntIdList,
              fail: this.failRqrmntIdList
            },
            comment: this.comment
          }, this.selectedRecord).then(res => {
            this.selectedRecord = 0
            this.getRqrmntList()
            console.log(res)
            this.$message.success('提交成功')
          }).catch(err => {
            this.$message.error(err.message)
          })
        }).catch(err => {
          this.$message.success(err.message)
        })
      },
      handleReview () {
        if(this.noOptRqrmntIdList.length>0){
          this.$confirm('你还有未操作的需求，是否要继续进入评审?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(()=>{
            this.reviewFun()
          })
        }else{
          this.reviewFun()
        }
      },
      handleTagChange (record, target) {
        if (record.review_status === target) {
          record.review_status = 0
        } else {
          record.review_status = target
        }
      },
      getRqrmntListByReviewId () {
        this.loading = true;
        rqrmntApi.getRqrmntListByReviewId(this.selectedRecord).then(res => {
          this.loading = false;
          let data = res.data.data[0].requirement_detail;
          this.comment = res.data.data[0].comment;
          this.reviewer = res.data.data[0].reviewer;
//          if(res.data.data[0].review_status == 1){
//              this.textarea_disabled = false
//          }
//          else{
//              this.textarea_disabled = true
//          }
          this.textarea_disabled = res.data.data[0].review_status !== 1;
          console.log('data', data)
          this.requirementData = data.map(item => {
            if (item.parent_list && item.parent_list.length === 0) {
              delete item.parent_list
            }
            return item
          });
        }).catch(err => {
          this.loading = false;
          console.log(err)
        })
      },
      getRqrmntList () {
        this.page.page_index = 1
        rqrmntApi.getRequirementReviewList({
          projectid: this.projectId,
          page_index:this.page.page_index,
          page_size:this.page.page_size
        }).then(res => {
          this.reviewList = res.data.data
          this.pageTotal = Math.ceil(res.data.count/this.page.page_size)
          this.$nextTick(() => {
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
          });
        })
      },
      getText(v){
        console.log(v)
        return v
      },
      getPriority(value){
        let text = ''
        switch(value){
          case 0:
            text="紧急";
            break;
          case 1:
            text="高";
            break;
          case 2:
            text="中";
            break;
          case 3:
            text="低";
            break;
        }
        return text;
      },
      getType(value){
        let text="";
        switch(value){
          case 0:
            text="功能需求";
            break;
          case 1:
            text="优化需求";
            break;
          case 2:
            text="自动化需求";
            break;
          case 3:
            text="性能需求";
            break;
          case 4:
            text="兼容性需求";
            break;
          case 5:
            text="其他";
            break;
        }
        return text;
      },
      detailchange(val){
        console.log('backdetaildata',val)
        let backdetail = {
          "id":val.id,
          "attach": val.attach,
          "description": val.description,
          "board_status": val.board_status,
          "handler_id": val.handler,
          "project_id": val.project_id,
          "title": val.title,
          "requirement_type": val.requirement_type,
          "priority": val.priority,
          "version_id": val.version,
          "creator_id":val.creator_id,
          "creator_name":val.creator_name,

        }
        if(val.handler){
          this.userList.map(item=>{
            if(item.userid == val.handler){
              backdetail.handler_name=item.nickname
            }
          })
        }else{
          backdetail.handler_name = ""
        }
        if(val.version){
          this.versionList.map(item=>{
            if(item.id == val.version){
              backdetail.version_name= item.title
            }
          })
        }else{
          backdetail.version_name = ""
        }

        console.log('editbackdetail',backdetail)
        if((this.requirementClassId == 'a2'&& val.version) || (this.requirementClassId.toString().indexOf('a')==-1&&this.requirementClassId!= val.version)){
          this.refreshFun()
        }else{
          this.requirementList.map((item,index) =>{
            if(item.id == backdetail.id){
              item = Object.assign(item,backdetail)
              console.log('editdetail',item,'---',index,'ixxx',item.id)

            }
          })
        }

        // this.refreshFun()
        // this.getRdata()
        // this.$refs.pdataTable.clearSort()
      },
      toDetailFun(record){
        this.requirementDrawer = true
        console.log('toEditpage',record)
        this.requirementDetail= record
      },
      onDelete (id) {
        console.log(id)
      },
      handleSure (val) {
        this.getRqrmntList()
      },
      selectRecord (id) {
        console.log(id)
        this.selectedRecord = id
      },
      infiniteHandler($state) {
        // console.log('this.page',this.page.page_index,'--',this.pageTotal)
        if(this.page.page_index < this.pageTotal){
          this.page.page_index ++
        }else{
          $state.complete();
          return false
        }
        rqrmntApi.getRequirementReviewList({
          projectid: this.projectId,
          page_index:this.page.page_index,
          page_size:this.page.page_size
        }).then(res => {
          let temp = res.data.data
          this.reviewList =  this.reviewList.concat(temp);
          $state.loaded();
        })
      },
    }
  }
</script>
<style lang="scss">
  .ant-table-body {
    &>td:nth-child(2) {
      background-color: red;
    }
  }
</style>

<style lang="scss" scoped>
  .requirement-review {
    display: flex;
    flex-direction: row;
    height: 100%;
    .history {
      display: inline-block;
      padding: 10px 0 0 10px;
      width: 250px;
      min-width: 250px;
      top: 0;
      left: 0;
      height: 100%;
      overflow: auto;
      box-shadow: rgba(0, 0, 0, 0.05) 1px 0px 10px 0px;
      h4 {
        font-size: 16px;
        margin-bottom: 15px;
        color: #1b73ff;
        border-bottom: 1px solid #eee;
        padding: 5px 0 5px 10px;
      }
      .active {
        background-color: #f0f7ff
      }
      .review-content {
        cursor: pointer;
        height: 40px;
        box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 0px;
        .review_status {
          font-size: 14px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          color: rgba(0, 0, 0, 0.85);
          font-weight: 500;
        }
      }
    }
    .content {
      flex-grow: 3;
      padding: 10px 0 0 60px;
      .table {
        margin-top: 10px;
      }
    }
  }
  .toDetail{
    cursor:pointer;
    color:#409eff;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
    display: inline-block;
    width: 180px;
  }

</style>

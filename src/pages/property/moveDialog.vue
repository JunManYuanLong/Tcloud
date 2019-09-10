<template>
  <div class="q-detail">
    <el-dialog
        title="设备流转"
        :visible.sync="dialogVisible"
        width="648px"
        :before-close="handleClose" :close-on-click-modal="false">
        <div class="push-preview-content">
        
        <el-form  :model="moveData" :rules="rules" ref="addForm" label-width="130px" class="addForm">
            <el-form-item label="选择流转用户：" prop="borrow_id">
              <el-select v-model="moveData.borrow_id"  placeholder="请选择" clearable filterable>
              <el-option
                v-for="item in borrowUserList"
                :key="item.id"
                :label="item.nickname"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="time-wrap">
          <a-timeline class="log-timeline">
            <a-timeline-item v-for="(log,index) in moveLogs" :key="index">{{log.operation}}<p class="time">{{log.modified_time}}</p></a-timeline-item>
          </a-timeline>
        </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button @click="handleMove">确定</el-button>
        </span>
      </el-dialog>
  </div>
</template>
<script>
import propertyApi from '@/api/property.js'
  export default{
    name: 'detail',
    props: ['phoneId','isShow'],
    data() {
      return {
        dialogVisible: this.isShow,
        moveData: {
          borrow_id:''
        },
        borrowUserList:[],
        moveLogs:[],
        rules: {
          borrow_id: [
            { required: true, message: '请填写选择流转用户', trigger: 'change' }
          ]
        }
      }
    },
    computed:{
    },
     watch: {
        'isShow': function (cval) {
          this.dialogVisible = cval
          this.$nextTick(()=>{
            this.$refs.addForm.resetFields()
          })
          if(cval){
            this.getBorrowUser()
            this.getMoveDetail()
          }
        }
      },
    methods:{
      handleClose () {
        this.$refs.addForm.resetFields()
        this.$emit('close')
      },
      getBorrowUser(){
        propertyApi.phoneBorrowUsers(this.phoneId).then(res=>{
          this.borrowUserList = res.data.data
        })
      },
      getMoveDetail(){
        propertyApi.phoneBorrowRecord(this.phoneId).then(res=>{
          this.moveLogs = res.data.data
        })
      },
      handleMove(){
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            propertyApi.phoneMove(this.moveData,this.phoneId).then(res=>{
              this.$message.success('流转成功！')
              this.handleClose()
              this.$emit('refreshData')
            })
          }
        })
      }
    },
    created(){
      if(this.phoneId){
        this.getBorrowUser()
        this.getMoveDetail()
      }
    }
  }
  
</script>
<style lang="scss">
.q-detail{
  text-align:left;
  .log-timeline{
    .time{
      color:#999;
      font-size:12px;
      margin-top:8px;
    }
  }
  .time-wrap{
    max-height:260px;
    overflow: auto;
    padding:10px 0;
  }
}
</style>
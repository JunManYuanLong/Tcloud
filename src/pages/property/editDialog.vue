<template>
  <div class="q-detail">
    <el-dialog
        title="编辑资产"
        :visible.sync="dialogVisible"
        width="648px"
        :before-close="handleClose" :close-on-click-modal="false">
        <div class="push-preview-content">
        <el-form v-if="type == 'phone'" :model="mobileData" :rules="mobileRules" ref="addForm" label-width="150px" class="addForm">
            <el-form-item label="手机名称：" prop="name">
              <el-input v-model="mobileData.name"></el-input>
            </el-form-item>
            <el-form-item label="资产编号：" prop="asset_id">
              <el-input v-model="mobileData.asset_id"></el-input>
            </el-form-item>
            <el-form-item label="制造商：" prop="vendor">
              <el-input v-model="mobileData.vendor"></el-input>
            </el-form-item>
            <el-form-item label="设备号：" prop="device_number">
              <el-input v-model="mobileData.device_number"></el-input>
            </el-form-item>
            <el-form-item label="系统版本：" prop="os">
              <el-input v-model="mobileData.os"></el-input>
            </el-form-item>
            <el-form-item label="CPU：" prop="cpu">
              <el-input v-model="mobileData.cpu"></el-input>
            </el-form-item>
            <el-form-item label="核数：" prop="core">
              <el-input v-model="mobileData.core"  type="number" :min="0"></el-input>
            </el-form-item>
            <el-form-item label="内存大小（G）：" prop="ram">
              <el-input v-model="mobileData.ram"></el-input>
            </el-form-item>
            <el-form-item label="硬盘大小（G）：" prop="rom">
              <el-input v-model="mobileData.rom"></el-input>
            </el-form-item>
            <el-form-item label="分辨率：" prop="resolution" class="resolution">
              <el-input v-model="mobileData.resolution_x"></el-input><span>x</span>
              <el-input v-model="mobileData.resolution_y"></el-input>
            </el-form-item>
            <!-- todo 添加借用人，设备来源，设备归属 -->
            <!-- <el-form-item label="持有人：" prop="borrower_id">
              <el-select v-model="mobileData.borrower_id" filterable placeholder="请选择" clearable @change="borrowerChange">
                <el-option
                  v-for="item in userList"
                  :key="item.id"
                  :label="item.nickname"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="设备来源：" prop="device_source">
              <el-input v-model="mobileData.device_source"></el-input>
            </el-form-item>
            <el-form-item label="设备归属部门：" prop="device_belong">
              <el-input v-model="mobileData.device_belong"></el-input>
            </el-form-item>
            <el-form-item label="设备持有人：" prop="borrow_id">
              <el-input v-model="mobileData.borrow_nickname" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="设备归属人：" prop="creator_id">
              <el-select
                  v-model="mobileData.creator_id"
                  filterable
                  clearable
                  remote
                  placeholder="请输入用户名关键字"
                  :remote-method="getUsers"
                  :loading="userLoading" style="width:100%;">
                  <el-option
                    v-for="item in users"
                    :key="item.userid"
                    :label="item.nickname"
                    :value="item.userid">
                  </el-option>
                </el-select>
            </el-form-item>
            <!-- todo end -->
            <el-form-item label="采购时间：" prop="buy_date">
              <el-date-picker
                v-model="mobileData.buy_date"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="所在地：" prop="region">
              <el-input v-model="mobileData.region"></el-input>
            </el-form-item>
        </el-form>
        <el-form v-if="type == 'virtual'" :model="virtualData" :rules="virtualRules" ref="addForm" label-width="130px" class="addForm">
            <el-form-item label="资产ID：" prop="asset_id">
              <el-input v-model="virtualData.asset_id"></el-input>
            </el-form-item>
            <el-form-item label="密码：" prop="passwd">
              <el-input v-model="virtualData.passwd"></el-input>
            </el-form-item>
            <el-form-item label="资产所属人：" prop="administrator">
              <el-input v-model="virtualData.administrator"></el-input>
            </el-form-item>
            <el-form-item label="注册人：" prop="bind_tel">
              <el-input v-model="virtualData.bind_tel"></el-input>
            </el-form-item>
            <el-form-item label="身份证号：" prop="idcard">
              <el-input v-model="virtualData.idcard"></el-input>
            </el-form-item>
            <el-form-item label="运营商：" prop="operator">
              <el-input v-model="virtualData.operator"></el-input>
            </el-form-item>
        </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button @click="hangleEdit">确定</el-button>
        </span>
      </el-dialog>
  </div>
</template>
<script>
import propertyApi from '@/api/property.js'
import userApi from '@/api/user.js'
  export default{
    name: 'detail',
    props: ['type','virtualType','propertyId','isShow'],
    data() {
      return {
        dialogVisible: this.isShow,
        userList: [], // 新增借用人
        users:[],
        userLoading:false,
        padData: {
         "name" : "", 
          "asset_id" : "", 
          "vendor" : "", 
          "device_number" : "", 
          "os" : "", 
          "cpu" : "", 
          "core" : "", 
          "ram" : "", 
          "rom" : "",
          "resolution" : "", 
          "buy_date" : "", 
          "region" : ""
        },
        deskData: {
          "name" : "", 
          "asset_id" : "", 
          "vendor" : "",  
          "os" : "", 
          "cpu" : "", 
          "core" : "", 
          "memory" : "", 
          "disk_size" : "",
          "buy_date" : "", 
          "region" : ""
        },
        monitorData: {
          "name": "",
          "asset_id": "",
          "region": "",
          "vendor": "",
          "buy_date": "",
          "resolution": ""
        },
        mobileData: {
          "name" : "", 
          "asset_id" : "", 
          "vendor" : "", 
          "device_number" : "", 
          "os" : "", 
          "cpu" : "", 
          "core" : "", 
          "ram" : "", 
          "rom" : "",
          "resolution_x" : "", 
          "resolution_y" : "", 
          "resolution" : "", 
          "buy_date" : "", 
          "region" : "",
          "borrower_id" : "",
          "device_source": "",
          "device_belong": "",
          "creator_id":"",
          "borrow_id":""
        },
        virtualData:{
          "asset_id":"",
          "passwd":"",
          "administrator":"",
          "bind_tel":"",
          "idcard":"",
          "idcard":"",
          "operator":""
        },
         mobileRules:{
          name: [
            { required: true, message: '请填写设备名称', trigger: 'blur' }
          ],
          asset_id: [
            { required: true, message: '请填写设备编号', trigger: 'blur' }
          ],
          vendor: [
            { required: true, message: '请填写设备厂商', trigger: 'blur' }
          ],
          device_number: [
            { required: true, message: '请填写设备号', trigger: 'blur' }
          ],
          os: [
            { required: true, message: '请填写设备系统', trigger: 'blur' }
          ],
          cpu: [
            { required: true, message: '请填写设备cpu', trigger: 'blur' }
          ],
          core: [
            { required: true, message: '请填写设备核心数', trigger: 'blur' }
          ],
          ram: [
            { required: true, message: '请填写设备内存', trigger: 'blur' }
          ],
          rom: [
            { required: true, message: '请填写设备硬盘', trigger: 'blur' }
          ],
          resolution: [
            { required: true, message: '请填写设备分辨率', trigger: 'blur' }
          ],
          buy_date: [
            { required: true, message: '请填写设备购买时间', trigger: 'blur' }
          ],
          region: [
            { required: true, message: '请填写设备所在地', trigger: 'blur' }
          ],
          device_source: [
            { required: true, message: '请填写设备来源', trigger: 'blur' }
          ],
          device_belong: [
            { required: true, message: '请填写设备所属部门', trigger: 'blur' }
          ],
          creator_id: [
            { required: true, message: '请选设备所属人', trigger: 'blur' }
          ],
        },
        monitorRules:{
          name: [
            { required: true, message: '请填写显示器名称', trigger: 'blur' }
          ]
        },
        virtualRules:{
          asset_id:[
            { required: true, message: '请填写资产id', trigger: 'blur' }
          ]
        }
      }
    },
    computed:{
      userId(){
        return this.$store.state.login.userid
      },
    },
     watch: {
        'isShow': function (cval) {
          this.dialogVisible = cval
          this.getEditData(this.propertyId)
        },
      },
    methods:{
      // 获取所有人员列表
      getUserList () {
        userApi.getAllUser().then(res => {
          if (res.data.code == 0) {
            this.userList = res.data.data
          }
        }).catch(err => {
          this.$message.error(err.message)
        })
      },
      // 借款人切换
      borrowerChange (val) {
        console.log(val)
      },
      handleClose () {
        this.$refs.addForm.resetFields()
        this.$emit('close')
      },
      hangleEdit() {
          if(this.mobileData.resolution_x&&this.mobileData.resolution_y){
            this.mobileData.resolution = `${this.mobileData.resolution_x}x${this.mobileData.resolution_y}`
          }else{
            this.mobileData.resolution = ''
          }
          this.$refs.addForm.validate((valid) => {
          if (valid) {
            let params = {}
            if(this.type == 'pad'){
             params = Object.assign({},this.padData)
            }
            if(this.type == 'pc'){
             params = Object.assign({},this.deskData)
            }
            if(this.type == 'displayer'){
             params = Object.assign({},this.monitorData)
            }
            if(this.type == 'phone'){
             params = Object.assign({},this.mobileData)
            }
            if(this.type == 'virtual'){
             params = Object.assign({},this.virtualData)
             if(this.virtualType){
                params.asset_type = this.virtualType
              }
            }
              if(params.core){
              params.core = parseInt(params.core)
            }
            if(params.rom )  {
              params.rom = parseInt(params.rom)
            }
            if(params.ram){
              params.ram = parseInt(params.ram)
            }  
            if(params.memory){
              params.memory = parseInt(params.memory)
            }  
            if(params.disk_size){
              params.disk_size = parseInt(params.disk_size)
            } 
            // params.borrow_id = this.userId 
            params = dealObjectValue(params)
              propertyApi.editProperty(this.type,this.propertyId,params).then( res => {
                this.$message({
                   message: '资产修改成功！',
                   type: 'success'
                })
                this.$emit('refreshData')
                this.$refs.addForm.resetFields()
              }).catch(err => {
                this.$message.error(err.message)
              })


          } else {
            this.$message.error('请填写相关字段！')
            return false;
          }
        })
      },
      getEditData() {
        this.$nextTick(()=>{
          this.$refs.addForm.resetFields()
        })
        if(this.virtualType &&this.type == 'virtual'){
          propertyApi.getVirtualProperty({id: this.propertyId}).then(res=>{
            this.virtualData = res.data.data[0]
          })
        }else{
          propertyApi.getSingleProperty(this.type,{id: this.propertyId}).then(res => {
          if(this.type == 'pad'){
            this.padData = res.data.data[0]
          }
          if(this.type == 'pc'){
            this.deskData = res.data.data[0]
          }
          if(this.type == 'displayer'){
            this.monitorData = res.data.data[0]
          }
          if(this.type == 'phone'){
            let data= res.data.data[0]
            this.mobileData = data
            if(data.resolution&&data.resolution.includes('x')){
              console.log('resolution',data.resolution)
              this.mobileData.resolution_x = data.resolution.split('x')[0]
              this.mobileData.resolution_y = data.resolution.split('x')[1]
            }
            userApi.getUserBySearch({nickname:this.mobileData.creator_nickname}).then(res=>{
              this.users = res.data.data
            })
          }

        })
        }
      },
      getUsers(query){
        if(query){
          this.userLoading = true
        }
        userApi.getUserBySearch({nickname:query}).then(res=>{
          this.users = res.data.data
          this.userLoading = false
        },error=>{
          this.userLoading = false
          console.log('获取手机设备持有人失败！')
        })
      }
    },
    created(){
      if(this.propertyId){
        this.getEditData()

      }
      this.getUserList()
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
.detail-content{
 display:flex;
 label{
  display:block;
  width:120px;
 }
 ul{
  flex:1;
  display:flex;
  flex-wrap:wrap;
  li{
    margin:2px 5px;
  }
 }
}
.q-detail{
  text-align:left;
  .resolution{
    .el-input{
      width:100px;
    }
  }
}
</style>
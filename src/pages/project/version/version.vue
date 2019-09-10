<template>
  <div>
    <div class="page-main">
      <div v-if="versionPanelVisible" class="modules-wrap">
        <div class="versionTitle">
          <h2>迭代版本</h2>
          <div class="opts" title="添加版本" @click="createVersionDialogVisible = true"><i class="el-icon-circle-plus"></i>
          </div>
        </div>
        <div class="Root">
          <div class="root">
            <div class="input-wrapper">
              <input type="text"
                      v-model="searchVersion"
                      class="input-without-border"
                      placeholder="搜索迭代版本">
              <i class="el-icon-search input-icon"></i>
            </div>
          </div>
        </div>
        <div class="m-title" :class="{allActive:versionId == 'all'}" @click="toAllTask">
        <!-- <div class="m-title"> -->
          <img src="../../../assets/img/normal-icon.svg">
          所有迭代版本
        </div>
        <ul class="version-list">
          <li v-for="version in searchedVersionList" :key="version.id" :class="version.id === activeVersionId ? 'active' : ''">
            <div class="des" @click="routeToVersionDashboard(version)">
              <div class="version-title">{{version.title}}</div>
              <div class="version-detail">
              <span
                :style="{color: version.publish_status === 0 ? '#E6A23C' : version.publish_status === 1 ? '#67C23A' : '#909399'}">
                {{version.publish_status === 0 ? '未发布' : version.publish_status === 1 ? '已发布' : '未知'}}
              </span>
                <span class="line"></span>
                <span>{{getStartedTime(version.start_time)}}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <router-view></router-view>
    </div>
    <el-dialog
      title="新增版本"
      :visible.sync="createVersionDialogVisible"
      @close="closeCreateVersionDialog"
      width="480px" :close-on-click-modal="false">
      <el-form label-width="80px" :model="createVersionForm" :rules="rules" ref="createVersionForm" >
        <el-form-item label="版本名称" prop="title">
          <el-input v-model.trim="createVersionForm.title" style="width: 350px"></el-input>
        </el-form-item>
        <el-form-item label="版本描述" prop="description">
          <el-input
            style="width: 350px"
            type="textarea"
            :rows="2"
            placeholder="请输入版本描述"
            v-model.trim="createVersionForm.description">
          </el-input>
        </el-form-item>
        <el-form-item label="起止时间" prop="duration_time">
          <el-date-picker
            v-model="createVersionForm.duration_time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createVersionDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="createVersion">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import moduleApi from '@/api/module.js'
  import caseApi from '@/api/case.js'
  import versionApi from '@/api/version.js'
  import moment from 'moment'
  import Cookies from 'js-cookie'
  import jwtDecode from 'jwt-decode'
  export default{
    name: "version",
    data() {
      return {
        searchVersion: '',
        versionList: [],
        createVersionDialogVisible: false,
        createVersionForm: {
          title: '',
          duration_time: '',
          description: ''
        },
        rules: {
          title: [
            { required: true, message: '请输入标题', trigger: 'blur' }
          ],
          description: [
            { required: true, message: '请输入描述', trigger: 'blur' }
          ],
          duration_time: [
            { required: true, message: '请选择起止时间', trigger: 'blur' }
          ]
        },
        loading: true,
        filterValue: ''
      }
    },
    watch: {
      '$route' () {
        this.getVersionByProject()
      },
      versionChange(val){
        if(val){
          this.getVersionByProject()
        }
      }
    },
    computed: {
      versionPanelVisible () {
        return this.$store.state.version.visible
      },
      versionChange () {
        return this.$store.state.version.versionChange
      },
      projectId(){
        return this.$route.params.projectId
      },
      moduleId () {
        return this.$route.params && this.$route.params.moduleId ? this.$route.params.moduleId : ''
      },
      activeVersionId () {
        return parseInt(this.$route.params.versionId)
      },
      userid () {
        return this.$store.state.login.userid
      },
      searchedVersionList () {
        return this.versionList.filter(item => {
          if (item.title && this.searchVersion) {
            return item.title.includes(this.searchVersion)
          } else {
            return true
          }
        })
      },
      versionId () {
        if(this.$route.params.versionId == 'all'){
          return 'all'
        }else{
          return parseInt(this.$route.params.versionId)
        }
      },
      showManage(){
        return this.$store.state.admin.showManage
      }
    },
    created(){
      let _this = this
      this.getVersionByProject()
    },
    methods: {
      getVersionByProject () {
        versionApi.getVersionByProject({projectid: this.projectId}).then(res => {
          this.versionList = res.data.data
          let lastVersion = this.versionList[0]?this.versionList[0].id:'all'
          if(this.showManage){ // 显示人员管理
              this.$store.commit('ASIDE_HAS_ADMIN', lastVersion)
          } else { // 不显示人员管理
              this.$store.commit('ASIDE_NO_ADMIN', lastVersion)
          }
          this.$store.commit('SET_VERSION',this.versionList)
          this.$store.commit('CHANGE_VERSION',false)
        }).catch(err => {
          this.$message.error(`获取项目的迭代版本失败:${err.message}`)
        })
      },
      createVersion() {
        this.$refs.createVersionForm.validate(valid => {
          if (valid) {
            let start_time = moment(this.createVersionForm.duration_time[0]).format("YYYY-MM-DD")
            let end_time = moment(this.createVersionForm.duration_time[1]).format("YYYY-MM-DD")
            versionApi.createVersion({
              title: this.createVersionForm.title,
              project_id: parseInt(this.projectId),
              start_time: start_time,
              end_time: end_time,
              creator: this.userid,
              description: this.createVersionForm.description
            }).then(res => {
              this.getVersionByProject()
              this.createVersionDialogVisible = false
            }).catch(err => {
              this.$message.error(err.message)
            })
          }
        })
      },
      closeCreateVersionDialog () {
        this.createVersionForm.title = ''
        this.createVersionForm.description = ''
        this.createVersionForm.duration_time = ''
      },
      getStartedTime (dayString) {
        let day = moment().diff(moment(dayString), 'days', true)
        return day >= 0 ? `已开始${moment().diff(moment(dayString), 'days') + 1}天` : '未开始'
      },
      routeToVersionDashboard (item) {
//        this.versionList.forEach(version => {
//          this.$set(version, 'active', false)
//        })
//        this.$set(item, 'active', true)
        this.$router.push({name: 'versionDetail', params: {versionId: item.id.toString()}})
      },
      toAllTask(){
        this.$router.push({name: 'versionDetail', params: {versionId:'all'}})
      }
    }
  }
</script>
<style lang="scss" scoped>
  .q-crumb {
    padding: 0 0 10px 0;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ddd;
    margin-bottom: 20px;
    .el-icon-tickets {
      display: block;
      margin-right: 5px;
      color: #33c0fb;
      font-size: 18px;
    }
    .el-breadcrumb {
      font-size: 16px;
    }
  }

  .q-opt {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    .q-search {
      width: 200px;
    }
  }

  .permission-unit {
    display: inline-block;
    padding: 0 10px;
    margin: 0 5px;
    background-color: #b9dbff;
    border-radius: 3px;
    color: #fff;
  }

  .m-search > .el-input__inner {
    /*padding:0 20px;*/
    margin: 10px 0;
    border: none;
  }
  .modules-wrap {
    padding: 20px 0;
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 240px;
    background-color: rgb(255, 255, 255);
    box-shadow: rgba(0, 0, 0, 0.05) 1px 0px 10px 0px;
    z-index: 100;
    overflow:auto;
    .versionTitle {
      display: flex;
      justify-content: space-between;
      height:52px;
    }
    h2 {
      padding: 0 20px 20px 20px;
      display: inline-block;
    }
    .opts {
      padding: 0 20px;
      i {
        font-size: 28px;
        color: #409EFF;
      }
    }
    .Root {
      -webkit-box-flex: 0;
      flex-grow: 0;
      display: flex;
      width: 100%;
      position: relative;
      padding: 0 20px;
      .root {
        position: relative;
        display: inline-flex;
        width: 100%;
        .input-wrapper {
          position: relative;
          flex: 1 1 0%;
        }
        input::-webkit-input-placeholder {
          color: #aab2bd;
          font-size: 12px;
          text-align: left;
        }
        .input-without-border {
          caret-color: rgb(16, 113, 211);
          box-sizing: border-box;
          width: 100%;
          height: 36px;
          line-height: 36px;
          font-size: 14px;
          color: rgb(54, 55, 56);
          position: relative;
          text-overflow: ellipsis;
          white-space: nowrap;
          box-shadow: none !important;
          outline: none;
          padding: 0px 12px 0px 24px;
          border-radius: 2px;
          transition: all 0.1s cubic-bezier(0.645, 0.045, 0.355, 1) 0s;
          overflow: hidden;
          border-width: initial !important;
          border-style: none !important;
          border-color: initial !important;
          border-image: initial !important;
        }
      }
      .input-icon {
        color: #aab2bd;
        position: absolute;
        left: 0px;
        top: 50%;
        margin-top: -8px;
        width: 16px;
        height: 16px;
        display: block;
        background-size: 16px;
        z-index: 10;
        transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1) 0s;
        background-repeat: no-repeat;
        background-position: center center;
      }
    }

    .m-search {
      /*padding:0 20px;*/
      margin: 10px 0;
      .el-input__inner {
        border: none;
      }
    }
    .m-title {
      font-weight: bold;
      padding: 8px 20px;
      border-top: 1px solid #eee;
      border-bottom: 1px solid #eee;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      font-size: 13px;
      &.allActive{
        background-color:#d6ebff;
        color:#1071d3;
      }
      img {
        width: 30px;
        padding: 0 5px;
      }
      .des {
        display: flex;
        align-items: center;
        span {
          color: #926dec;
          margin-left: 10px;
        }
      }
      .opts {
        i {
          font-size: 28px;
          color: #409EFF;
        }
      }
    }
    .version-opt {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin: 0 20px;
    }
  }

  .version-list {
    li {
      /*padding: 0 20px 0 30px;*/
      display: flex;
      align-items: center;
      justify-content: space-between;
      &:hover {
        background-color: rgba(16, 113, 211, 0.08);
      }
      &.active {
        background-color: rgb(214, 235, 255);
        .des div {
          color: rgb(16, 113, 211);
        }
      }
      .des {
        display: block;
        width: 100%;
        color: rgb(54, 55, 56);
        box-sizing: border-box;
        cursor: pointer;
        margin-bottom: 2px;
        position: relative;
        border-radius: 3px;
        padding: 12px 30px;
        transition: background 0.2s cubic-bezier(0.645, 0.045, 0.355, 1) 0s;
        img {
          width: 24px;
          margin-right: 5px;
        }
        .version-title {
          font-size: 16px;
          line-height: 16px;
          margin-bottom: 8px;
          font-weight: bold;
        }
        .version-detail {
          font-size: 12px;
          color: rgb(145, 153, 163);
          line-height: 16px;
          display: flex;
          -webkit-box-align: center;
          align-items: center;
          .line {
            width: 1px;
            height: 10px;
            display: inline-block;
            margin: 0px 9px;
            background: rgba(0, 0, 0, 0.07);
          }
        }
      }
      .opts {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 45px;
        .edit-btn {
          flex: 1;
          color: #11d847;
        }
        .delete-btn {
          flex: 1;
          color: #f56c6c;
        }
      }
    }
  }

  .case-list {
    margin-left: 360px;
    .case-header {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      img {
        height: 20px;
        margin-right: 10px;
      }
      .s-module {
        display: flex;
        height: 30px;
        align-items: center;
        width: 375px;
      }
    }
  }

  .no-select-module {
    margin-left: 360px;
    p {
      width: 300px;
      margin: 80px;
      text-align: center;
      font-size: 20px;
      color: #e6a23c;
      border: 1px solid #f5c781;
      padding: 10px;
      border-radius: 10px;
      position: relative;
      &:after {
        position: absolute;
        top: 20px;
        left: -89px;
        content: "";
        display: block;
        width: 90px;
        height: 91px;
        background: url('../../../assets/img/arrow.png') no-repeat;
        background-size: 100%;
      }
    }
  }

  .case-link {
    color: #409EFF;
  }
</style>

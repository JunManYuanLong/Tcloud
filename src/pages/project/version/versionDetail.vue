<template>
  <div class="versionDetail" :style="{height:winHeight+'px','margin-left': versionPanelVisible ? '240px' : '0px'}">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item class="title_name">
        <icon-font iconClass="dakaisanshu" @click.native="toggleSide"></icon-font>
      </el-breadcrumb-item>
      <el-breadcrumb-item class="title_name">
        <span>{{curProject.name}}</span>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        <span v-if="versionId == 'all'">所有版本</span>
        <span v-else>
        {{version.title}}
        </span>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <!--<div class="projectTitle">-->
      <!--项目：{{project.name}}-->
    <!--</div>-->
    <!--<div class="versionTitle">-->
      <!--版本：{{version.title}}-->
    <!--</div>-->
    <template v-if="versionId !== 'all'">
    <div class="versionDesc">时间：{{version.start_time}} 至 {{version.end_time}}</div>
    <div class="versionDesc">描述：{{version.description}}</div>
    <div class="versionOpt">
      <div v-if="!version.publish_status" :class="version.publish_status ? 'VersionPublished' : 'VersionPublish'"
           @click="publishVersion">
        <div class="icon"></div>
        立即发布
      </div>
      <div v-else :class="version.publish_status ? 'VersionPublished' : 'VersionPublish'">
        <div class="icon"></div>
        已发布
      </div>
      <el-button class="edit" type="primary" icon="el-icon-edit" @click="editVersionDialogVisible = true"></el-button>
      <el-button class="delete" type="primary" icon="el-icon-delete" @click="deleteVersion"></el-button>
    </div>
    </template>
    <el-tabs v-model="activeTab" type="card" :class="{allTask:versionId == 'all'}">
      <el-tab-pane label="任务" name="1" class="task-wrap">
        <keep-alive>
          <task-list v-if="activeTab == 1"></task-list>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="缺陷" name="2">
        <keep-alive>
          <issue  v-if="activeTab == 2"></issue>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="需求" name="3">
        <keep-alive>
          <requirement  v-if="activeTab == 3"></requirement>
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      title="编辑版本"
      :visible.sync="editVersionDialogVisible"
      @open="openEditVersionDialog"
      @close="closeEditVersionDialog"
      width="480px" :close-on-click-modal="false">
      <el-form label-width="80px" :model="editVersionForm" ref="editVersionForm" :rules="rules">
        <el-form-item label="版本名称" prop="title">
          <el-input v-model.trim="editVersionForm.title" style="width: 350px"></el-input>
        </el-form-item>
        <el-form-item label="版本描述" prop="description">
          <el-input
            style="width: 350px"
            type="textarea"
            :rows="2"
            placeholder="请输入版本描述"
            v-model.trim="editVersionForm.description">
          </el-input>
        </el-form-item>
        <el-form-item label="起止时间" prop="duration_time">
          <el-date-picker
            v-model="editVersionForm.duration_time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="editVersionDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editVersion">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
  import issue from '@/pages/issue/index.vue'
  import requirement from '@/pages/project/version/requirement/list.vue'
  import TaskList from '@/pages/project/version/task/taskList.vue'
  import versionApi from '@/api/version.js'
  import moment from 'moment'
  export default{
    name: 'versionDetail',
    data(){
      return {
        activeTab: '1',
        taskList: [],
        project: {},
        editVersionDialogVisible: false,
        editVersionForm: {
          title: '',
          description: '',
          duration_time: ''
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
        winHeight: window.innerHeight - 70
      }
    },
    components: {
      issue,
      TaskList,
      requirement
    },
    computed: {
      versionPanelVisible () {
        return this.$store.state.version.visible
      },
      projectId () {
        return parseInt(this.$route.params.projectId)
      },
      showManage(){
        return this.$store.state.admin.showManage
      },
      curProject(){
        return this.$store.state.project.currentProject
      },
      versionList(){
        return this.$store.state.project.versionList
      },
      versionId () {
        if(this.$route.params.versionId == 'all'){
          return 'all'
        }else{
          return parseInt(this.$route.params.versionId)
        }
      },
      version(){
        let v = {}
        let v1 = []
        if(this.versionList&&this.versionList.length>0){
          v1 =  this.versionList.filter(item=>{
            if(item.id == this.versionId){
              return item
            }
          })
          v = v1[0]
        }
        return v
      }
    },
    created () {
    },
    beforeDestroy () {
      this.$store.commit('CHANGE_VISIBLE', true)
    },
    methods: {
      toggleSide () {
        this.$store.commit('TOGGLE_VISIBLE')
      },
      publishVersion () {
        this.$confirm(`是否确认发布版本:${this.version.title}`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          versionApi.publishVersion(this.versionId).then(res => {
            this.$message.success('发布成功!')
//            this.$router.push({name: 'versionDetail', params: {versionId: this.versionId, projectId: this.projectId}})
            this.getVersionDetail()
            this.$store.commit('CHANGE_VERSION',true)
          }).catch(err => {
            this.$message.error('发布失败: ' + err.message)
            console.log(err)
          })
        }).catch(err => {
          console.log(err)
        })
      },
      deleteVersion () {
        this.$confirm(`是否确认删除版本:${this.version.title}?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          versionApi.deleteVersion(this.versionId).then(res => {
            this.$message.success('删除成功!')
            this.$router.push({name: 'version'})
          }).catch(err => {
            this.$message.error('删除失败:' + err.message)
            console.log(err)
          })
        }).catch(err => {
          console.log(err)
        })
      },
      openEditVersionDialog () {
        if(this.versionId == 'all'){
          return false
        }
        versionApi.getVersionDetail(this.versionId).then(res => {
          this.editVersionForm.title = res.data.data[0].title
          this.editVersionForm.description = res.data.data[0].description
          let start_time = new Date(res.data.data[0].start_time)
          let end_time = new Date(res.data.data[0].end_time)
          this.editVersionForm.duration_time = [start_time, end_time]
        }).catch(err => {
          this.$message.error(err.message)
          console.log(err)
        })
      },
      closeEditVersionDialog () {
        this.editVersionForm.title = ''
        this.editVersionForm.description = ''
        this.editVersionForm.duration_time = ''
      },
      editVersion() {
        this.$refs.editVersionForm.validate(valid => {
          if (valid) {
            let start_time = moment(this.editVersionForm.duration_time[0]).format("YYYY-MM-DD")
            let end_time = moment(this.editVersionForm.duration_time[1]).format("YYYY-MM-DD")
            let params = {
              project_id: this.projectId,
              title: this.editVersionForm.title,
              start_time: start_time,
              end_time: end_time,
              description: this.editVersionForm.description
            }
            versionApi.editVersion(this.versionId, params).then(res => {
              this.getVersionDetail()
              this.$store.commit('CHANGE_VERSION',true)
              this.editVersionDialogVisible = false
              this.$message.success('版本信息修改成功！')
            }).catch(err => {
              this.$message.error(`修改失败: ${err.message}`)
            })
          }
        })
      },
      getVersionDetail () {
        if(this.versionId == 'all'){
          return false
        }else{
          versionApi.getVersionDetail(this.versionId).then(res => {
            let version = res.data.data[0]
            let lastVersion = version[0]?version[0].id:'all'
            if(this.showManage){ // 显示人员管理
                this.$store.commit('ASIDE_HAS_ADMIN', lastVersion)
            } else { // 不显示人员管理
                this.$store.commit('ASIDE_NO_ADMIN', lastVersion)
            }
            this.$store.commit('SET_VERSION',version)
          }).catch(err => {
            console.log(err)
          })
        }
        
      },
      $resize () {
        this.winHeight = window.innerHeight - 70
      }
    },
    mounted(){
      window.addEventListener('resize', this.$resize, true)
    },
    beforeDestroy(){
      window.removeEventListener("resize", this.$resize);
    }
  }
</script>
<style lang="scss" scoped>
  .title_name {
    span {
      font-weight: 800;
      color: black;
    }
  }
  .versionDetail {
    /*margin-left: 240px;*/
    padding: 20px 20px 0 20px;
    overflow:auto;
    position:relative;
    .add-task {
      margin-bottom: 5px;
    }
  }

  .versionTitle {
    font-size: 20px;
    height: 24px;
    line-height: 24px;
    color: rgb(28, 29, 31);
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-top: 5px;
  }

  .versionDesc {
    margin-top: 20px;
    font-size: 13px;
    height: 20px;
    line-height: 20px;
    margin-bottom: 14px;
    color: rgb(145, 153, 163);
    width: 100%;
    margin-right: 200px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .versionOpt {
    float: right;
    position: absolute;
    width: 200px;
    height: 60px;
    right: 20px;
    top: 0;
    box-shadow: rgba(0, 0, 0, 0.05) 0 4px 12px -2px, rgba(16, 113, 211, 0.15) 0px 6px 32px -3px;
    border-bottom-left-radius: 3px;
    display: flex;
    z-index: 20;
    .VersionPublish:hover {
      /*cursor: not-allowed;*/
      background-color: #D08711;
      cursor: pointer;
    }
    .VersionPublished:hover {
      cursor: not-allowed;
    }
    .delete {
      margin-left: 0;
      background-color: #F56C6C;
      border: none;
    }
    .delete:hover {
      background-color: #BA222C;
      border: none;
    }
    .more:hover {
      background-color: rgb(7, 95, 184);
    }
    .more {
      height: 60px;
    }
  }

  .moreItem {
    width: 157px;
    height: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 13px;
    span {
      /*margin: auto 10px;*/
      i {
        margin-top: 22px;
        height: 36px;
      }
    }
  }

  .VersionPublish {
    background: #E6A23C;
    color: rgb(255, 255, 255);
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    font-size: 16px;
    border-bottom-left-radius: 3px;
    flex: 1 1 auto;
    transition: background 0.2s cubic-bezier(0.645, 0.045, 0.355, 1) 0s;
    .icon {
      width: 16px;
      height: 16px;
      margin-right: 10px;
      background: url(../../../assets/img/start-test.svg) center center / cover no-repeat;
    }
  }

  .VersionPublished {
    background: #909399;
    color: rgb(255, 255, 255);
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    font-size: 16px;
    border-bottom-left-radius: 3px;
    flex: 1 1 auto;
    transition: background 0.2s cubic-bezier(0.645, 0.045, 0.355, 1) 0s;
    .icon {
      width: 16px;
      height: 16px;
      margin-right: 10px;
      background: url(../../../assets/img/start-test.svg) center center / cover no-repeat;
    }
  }

  .el-dropdown-menu__item:focus, .el-dropdown-menu__item:not(.is-disabled):hover {
    color: #F56C6C;
  }
  .allTask{
    margin-top:20px;
  }
</style>

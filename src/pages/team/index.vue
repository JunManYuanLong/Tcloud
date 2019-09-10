<template>
  <div>
    <div class="level-setright">
      <el-button type="text" icon="el-icon-setting" size="large" @click="toAdminUserRolePage">角色管理</el-button>
      <el-button type="text" icon="el-icon-setting" size="large" @click="toAdminUserPage">成员管理</el-button>
    </div>
    <div class="container">
      <section class="panel">
        <div class="title">
          <img src="@/assets/img/icon.svg" class="icon">
          团队活跃度概览
        </div>
        <div class="sheet">
          <div class="activity">
            <div class="team-member">
            <span class="identifier" v-for="member in calendarDetails" :key="member.userid">
              <el-tooltip class="avatar" effect="dark" :content="member.nickname" placement="top-start">
                <span class="avatar-wrapper">
                    <img v-if="member.picture" :src="member.picture" size="32" class="avatar-wrapper">
                </span>
              </el-tooltip>
              <div>{{member.nickname}}</div>
              <!--<img src="@/assets/img/avatar-default.png" size="32" role="SA" class="avatar-icon">-->
            </span>
              <div class="css-14tm0ta-ContributorPlaceholder e8qcdhp5"></div>
              <div class="css-14tm0ta-ContributorPlaceholder e8qcdhp5"></div>
            </div>
            <div class="calendar">
              <div class="calendar-dates">
              <span v-for="(date, index) in calendars" :key="index" class="calendar-date">
                <span class="calendar-month" v-if="date.day == '1' || index === 0">
                  <span class="month-text">
                    {{date.month}}
                  </span>
                </span>
                <strong>{{date.day}}</strong>
              </span>
              </div>
              <span class="timeline" v-for="(member, index) in calendarDetails" :key="index">
              <span class="rail-test">
                <el-tooltip
                  v-for="(item, index) in member.create_cases_info"
                  :key="index"
                  effect="dark" :content="`编写了${item.count}条用例`" placement="top-start">
                  <span class="effective-activity"
                        :style="{'width': `${40 * item.width}px`, 'margin-left': `${40 * item.index}px`}">
                    {{item.count}}
                  </span>
                </el-tooltip>
              </span>
              <span class="rail-testcase">
                <el-tooltip
                  v-for="(item, index) in member.exc_cases_info"
                  :key="index"
                  effect="dark" :content="`执行了${item.count}条用例`" placement="top-start">
                <span class="effective-activity"
                      :style="{'width': `${40 * item.width}px`, 'margin-left': `${40 * item.index}px`}">
                {{item.count}}
                </span>
                </el-tooltip>
              </span>
              <span class="rail-submit-issue">
                <el-tooltip
                  v-for="(item, index) in member.submit_issues_info"
                  :key="index"
                  effect="dark" :content="`提交了${item.count}条缺陷`" placement="top-start">
                <span class="effective-activity"
                      :style="{'width': `${40 * item.width}px`, 'margin-left': `${40 * item.index}px`}">
                {{item.count}}
                </span>
                </el-tooltip>
              </span>
            </span>
            </div>
          </div>
        </div>
      </section>
      <!-- <div class="team-title">
        <div class="level-left"><span>团队成员</span>
        </div>
        <div class="level-right">
          <el-button type="text" icon="el-icon-refresh" size="large" @click="getAllUserList">刷新列表</el-button>
        </div>
      </div> -->
      <!-- <div class="team-list">
        <el-card v-for="user in allUsers" :key="user.userid">
          <div class="team-member">
            <span class="avatar-wrapper">
                <img>
            </span>
            <div class="user-content">
              <div class="nickname">
                {{user.nickname}}
              </div>
              <div class="username">
                {{user.username}}
              </div>
            </div>
          </div>
        </el-card>
      </div> -->
    </div>
  </div>
</template>
<script>
  import dashboardApi from '@/api/dashboard.js'
  import caseApi from '@/api/case.js'
  import taskApi from '@/api/task.js'
  import userApi from '@/api/user.js'
  import moment from 'moment'
  moment.locale('ch', {
    months: [
      "一月", "二月", "三月", "四月", "五月", "六月", "七月",
      "八月", "九月", "十月", "十一月", "十二月"
    ]
  })
  export default{
    data() {
      return {
        loading: true,
        data: [],
        filterValue: '',
        dialogVisible: false,
        userInfo: {},
        userId: '',
        timeDelta: 30,
        members: [],
        allUsers: []
      }
    },
    computed: {
      'calendars' () {
        let calendars = []
        for (let num = this.timeDelta; num >= 0; num--) {
          calendars.push({
            month: moment().subtract(num, 'days').format("MMMM"),
            day: moment().subtract(num, 'days').format("D"),
            date: moment().subtract(num, 'days').format("YYYY-MM-DD")
          })
        }
        return calendars
      },
      'calendarDetails' () {
        return this.data.map(item => {
          let item_result = item
          let create_cases_info = []
          item.create_cases.forEach(info => {
            let index = this.calendars.findIndex(i => i.date === info.date)
            if (index === -1) {
              return false
            }
            if (create_cases_info.length > 0) {
              let latest = create_cases_info[create_cases_info.length - 1]
              if (moment(info.date).diff(moment(latest.date), 'days') === 1) {
                latest.width = latest.width + 1
                latest.count = latest.count + info.count
                latest.date = info.date
              } else {
                create_cases_info.push({
                  index: index,
                  width: 1,
                  count: info.count,
                  date: info.date
                })
              }
            } else {
              create_cases_info.push({
                index: index,
                width: 1,
                count: info.count,
                date: info.date
              })
            }
          })
          item_result = Object.assign(item_result, {create_cases_info: create_cases_info})
          let exc_cases_info = []
          item.exc_cases.forEach(info => {
            let index = this.calendars.findIndex(i => i.date === info.date)
            if (index === -1) {
              return false
            }
            if (exc_cases_info.length > 0) {
              let latest = exc_cases_info[exc_cases_info.length - 1]
              if (moment(info.date).diff(moment(latest.date), 'days') === 1) {
                latest.width = latest.width + 1
                latest.count = latest.count + info.count
                latest.date = info.date
              } else {
                exc_cases_info.push({
                  index: index,
                  width: 1,
                  count: info.count,
                  date: info.date
                })
              }
            } else {
              exc_cases_info.push({
                index: index,
                width: 1,
                count: info.count,
                date: info.date
              })
            }
          })
          item_result = Object.assign(item_result, {exc_cases_info: exc_cases_info})
          let submit_issues_info = []
          item.submit_issues.forEach(info => {
            let index = this.calendars.findIndex(i => i.date === info.date)
            if (index === -1) {
              return false
            }
            if (submit_issues_info.length > 0) {
              let latest = submit_issues_info[submit_issues_info.length - 1]
              if (moment(info.date).diff(moment(latest.date), 'days') === 1) {
                latest.width = latest.width + 1
                latest.count = latest.count + info.count
                latest.date = info.date
              } else {
                submit_issues_info.push({
                  index: index,
                  width: 1,
                  count: info.count,
                  date: info.date
                })
              }
            } else {
              submit_issues_info.push({
                index: index,
                width: 1,
                count: info.count,
                date: info.date
              })
            }
          })
          item_result = Object.assign(item_result, {submit_issues_info: submit_issues_info})
          return item_result
        })
      }
    },
    watch: {
//      'calendarDetails' (to, from) {
//        console.log('calendarDetails', to)
//      },
      'calendars' (to, from) {
        console.log('calendars changed')
        if (to.length > 0) {
          this.getDashboard()
        }
      }
    },
    created () {
      // this.getAllUserList()
      // this.getTestUserList()
      this.getDashboard()
    },
    methods: {
      getDashboard () {
        dashboardApi.getDashboard({
          begin_date: this.calendars[0].date,
          end_date: this.calendars[this.calendars.length - 1].date
        }).then(res => {
          this.data = res.data.data
        }).catch(err => {
          console.log(err)
        })
      },
      getTestUserList() {
        userApi.getTestUserList().then(res => {
          this.members = res.data.data.sort((a, b) => a.userid - b.userid)
        }).catch(err => {
          this.$message.error(err.message)
        })
      },
      getAllUserList() {
        userApi.getUserList().then(res => {
          this.allUsers = res.data.data
        }).catch(err => {
          this.$message.error(err.message)
        })
      },
      toUserAddPage() {
        this.$router.push({
          name: 'userAdd'
        })
      },
      toAdminUserPage () {
        this.$router.push({name: 'adminUser'})
      },
      toAdminUserRolePage () {
        this.$router.push({name: 'adminRole'})
      },

      editFun(row) {
        this.$router.push({
          name: 'userEdit',
          params: {
            id: row.userid
          }
        })
      },
      deleteFun(row) {
        this.dialogVisible = true
        this.userId = row.userid
        this.userInfo = row
      },
      delUser() {
        userApi.deleteUser({id: this.userId}).then(res => {
          this.dialogVisible = false
          this.$message({
            message: '用户删除成功！',
            type: 'success'
          })
          this.$refs.dataTable.refreshMethod()

        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .level-setright {
    max-width: 1400px;
    margin: 20px auto;
  }
  .container {
    max-width: 1400px;
    margin: 20px auto;
    overflow: auto;
  }

  .panel {
    background-color: rgb(255, 255, 255);
    box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 4px 0px;
    border-radius: 3px;
    overflow: auto;
  }

  .title {
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    height: 48px;
    font-size: 15px;
    font-weight: bold;
    padding: 0px 16px;
  }

  .icon {
    margin-right: 12px;
    width: 16px;
    height: 16px;
    background-size: contain;
    flex: 0 0 16px;
    background-position: center center;
    background-repeat: no-repeat;
  }

  .sheet {
    width: 100%;
    border-radius: 0px 0px 3px 3px;
    overflow: hidden;
    .activity {
      max-height: 3000px;
      overflow: auto;
      display: flex;
      position: relative;
      width: 100%;
      background-color: rgb(255, 255, 255);
      .team-member {
        position: absolute;
        box-sizing: border-box;
        padding-top: 44px;
        width: 60px;
        background-color: rgb(255, 255, 255);
        box-shadow: rgba(0, 0, 0, 0.03) 1px 0px 0px 0px, rgba(0, 0, 0, 0.05) 1px 0px 4px 0px;
        z-index: 5;
        flex: 0 0 60px;
        .identifier {
          display: flex;
          flex-direction: column;
          height: 84px;
          -webkit-box-pack: center;
          justify-content: center;
          -webkit-box-align: center;
          align-items: center;
          border-bottom: 1px solid #F2F2F2;
          /*margin: 2px 0px;*/
          div {
            font-size: 12px;
          }
          .avatar-wrapper {
            display: flex;
            -webkit-box-pack: center;
            justify-content: center;
            -webkit-box-align: center;
            align-items: center;
            position: relative;
            width: 32px;
            height: 32px;
            color: rgb(255, 255, 255);
            font-size: 16px;
            box-shadow: rgba(0, 0, 0, 0.04) 0px 1px 3px -1px, rgba(0, 0, 0, 0.1) 0px 3px 12px -2px;
            background: url('../../assets/img/avatar.jpg') center center / cover no-repeat;
            flex: 0 0 32px;
            border-radius: 50%;
            .avatar-icon {
              display: block;
              position: absolute;
              bottom: -2px;
              right: -2px;
              width: 14px;
              height: 14px;
              box-shadow: rgba(0, 0, 0, 0.04) 0px 1px 2px 0px, rgba(0, 0, 0, 0.1) 0px 2px 10px -1px;
              border-radius: 100%;
            }
          }
        }
      }
      .calendar {
        width: 100%;
        background-color: rgb(255, 255, 255);
        flex: 1 0 auto;
        .calendar-dates {
          width: 100%;
          display: flex;
          position: relative;
          height: 44px;
          background-color: rgb(255, 255, 255);
          box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 4px 0px;
          z-index: 9;
          padding: 16px 8px 0px 64px;
          .calendar-date {
            width: 4.16%;
            display: block;
            position: relative;
            /*width: 40px;*/
            height: 28px;
            line-height: 28px;
            text-align: center;
            font-size: 12px;
            font-weight: 600;
            color: rgb(145, 153, 163);
            flex: 0 0 40px;
            .calendar-month {
              display: flex;
              -webkit-box-pack: center;
              justify-content: center;
              -webkit-box-align: center;
              align-items: center;
              position: absolute;
              left: 0px;
              bottom: 100%;
              width: 100%;
              height: 16px;
              line-height: 16px;
              color: rgb(201, 207, 215);
              .month-text {
                display: block;
                transform: scale(0.833333);
                flex: 0 0 auto;
              }
            }
          }
        }
        .timeline {
          border-bottom: 1px solid #F2F2F2;
          display: block;
          /*width: 2000px;*/
          height: 84px;
          -webkit-box-pack: center;
          justify-content: center;
          -webkit-box-align: center;
          align-items: center;
          padding: 0px 8px 0px 64px;
          .rail-test {
            display: flex;
            flex-wrap: nowrap;
            position: relative;
            height: 28px;
            /*margin: 4px 0px;*/
            .effective-activity {
              position: absolute;
              width: 40px;
              display: flex;
              justify-content: center;
              align-items: center;
              top: 0px;
              box-sizing: border-box;
              height: 20px;
              line-height: 20px;
              color: rgb(255, 255, 255);
              user-select: none;
              background-color: rgb(33, 202, 100);
              border-radius: 3px;
              font-size: 12px;
              margin-top: 4px;
            }
          }
          .rail-testcase {
            display: flex;
            flex-wrap: nowrap;
            position: relative;
            height: 20px;
            margin: 2px 0px;
            .effective-activity {
              position: absolute;
              width: 40px;
              display: flex;
              justify-content: center;
              align-items: center;
              top: 0px;
              box-sizing: border-box;
              height: 20px;
              line-height: 20px;
              color: rgb(255, 255, 255);
              user-select: none;
              background-color: rgb(16, 113, 211);
              border-radius: 3px;
              font-size: 12px;
            }
          }
          .rail-submit-issue {
            display: flex;
            flex-wrap: nowrap;
            position: relative;
            height: 20px;
            margin: 2px 0px;
            .effective-activity {
              position: absolute;
              width: 40px;
              display: flex;
              justify-content: center;
              align-items: center;
              top: 0px;
              box-sizing: border-box;
              height: 20px;
              line-height: 20px;
              color: rgb(255, 255, 255);
              user-select: none;
              background-color: rgb(250, 128, 75);
              border-radius: 3px;
              font-size: 12px;
            }
          }
          .rail {
            display: block;
            position: relative;
            height: 20px;
            .effective-activity {
              display: block;
              top: 0px;
              box-sizing: border-box;
              height: 20px;
              line-height: 20px;
              color: rgb(255, 255, 255);
              user-select: none;
              background-color: rgb(16, 113, 211);
              border-radius: 3px;
              font-size: 12px;
            }
          }
        }
      }
    }
  }

  .team-title {
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
    margin-top: 38px;
    .level-left {
      display: flex;
      font-size: 16px;
      line-height: 24px;
      -webkit-box-align: center;
      align-items: center;
      span {
        font-weight: bold;
        padding-right: 16px;
      }
    }
    .level-right {
      display: flex;
      font-size: 13px;
      line-height: 24px;
      -webkit-box-align: center;
      align-items: center;
    }
  }
    .level-setright {
      .el-button{
        padding: 0px 0px;
      }
      font-size: 13px;
      margin-right: 16px;
      text-align : right;
    }

  .team-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    .el-card {
      width: 288px;
      height: 100px;
      margin: 0px 16px 16px 0px;
    }
    .team-member {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;
      .avatar-wrapper {
        margin-right: 16px;
        display: flex;
        -webkit-box-pack: center;
        justify-content: center;
        -webkit-box-align: center;
        align-items: center;
        position: relative;
        width: 48px;
        height: 48px;
        flex: 0 0 48px;
        color: rgb(255, 255, 255);
        font-size: 16px;
        box-shadow: rgba(0, 0, 0, 0.04) 0px 1px 3px -1px, rgba(0, 0, 0, 0.1) 0px 3px 12px -2px;
        background: url('../../assets/img/avatar-default.png') center center / cover no-repeat;
        border-radius: 50%;
        .avatar-icon {
          display: block;
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 14px;
          height: 14px;
          box-shadow: rgba(0, 0, 0, 0.04) 0px 1px 2px 0px, rgba(0, 0, 0, 0.1) 0px 2px 10px -1px;
          border-radius: 100%;
        }
      }
      .user-content {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        .nickname {
          color: rgb(54, 55, 56);
          font-size: 16px;
          line-height: 24px;
          height: 24px;
          display: flex;
          -webkit-box-align: center;
          align-items: center;
          max-width: 120px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
        .username {
          margin-top: 4px;
          color: rgb(148, 150, 155);
          font-size: 12px;
          line-height: 18px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }
    }
  }

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

</style>

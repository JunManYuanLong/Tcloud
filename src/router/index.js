import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

// 登陆页
import login from '@/pages/login'

// 总主页
import index from '@/pages/index'
// 总主页 -> 测试中心
import Center from '@/pages/index/Center.vue'
// 总主页 -> 测试中心 -> 项目(proj)，我的(mine)，团队(team)，资产(property)
import Proj from '@/pages/index/Proj.vue'
import mine from '@/pages/mine'
import team from '@/pages/team'
import property from '@/pages/property'
// 总主页 -> 云真机
import stf from '@/pages/stf/index.vue'
// 总主页 -> 云真机 -> 设备列表(devlist)，使用设备(usedevices)，使用详情(usedetail)
import DeviceList from '@/pages/stf/DeviceList.vue'
import useDevices from '@/pages/stf/usedevices.vue'
import useDetail from '@/pages/stf/usedetail.vue'
// 总主页 -> 持续集成
import ci from '@/pages/ci/index.vue'
import CiList from '@/pages/ci/CiList.vue'
import ciedit from '@/pages/ci/ciedit.vue'
// 总主页 -> 自动化测试 (动态路由引入)
// 总主页 -> 小工具
import tool from '@/pages/tool/index.vue'
// 总主页 -> 反馈
import feedback from '@/pages/admin/feedback'
// 总主页 -> 站内信 (动态路由引入)
// 总主页 -> 修改密码
import selfPassword from '@/pages/login/selfPassword'
// 总主页 -> 个人信息
import selfInfo from '@/pages/login/selfInfo'
// 总主页 -> 成员角色管理
import admin from '@/pages/admin/index.vue'
import adminUser from '@/pages/admin/user/index.vue'
import adminRole from '@/pages/admin/user/role.vue'
import adminUserAdd from '@/pages/admin/user/add.vue'

// 项目主页
import ProMain from '@/pages/proMain'
// 项目主页 -> dashboard
import dashboard from '@/pages/dashboard'
// 项目主页 -> 看板
import panel from '@/pages/panel'
// 项目主页 -> 迭代管理
import version from '@/pages/project/version/version.vue'
import versionDetail from '@/pages/project/version/versionDetail.vue'
import taskCase from '@/pages/project/version/task/taskCase.vue'
import taskcaseDetail from '@/pages/project/version/task/caseDetailPage.vue'
// 项目主页 -> 用例管理
import module from '@/pages/module'
import caseAdd from '@/pages/module/caseAdd'
import caseList from '@/pages/module/caseList'
// 项目主页 -> 需求管理 (部分动态路由引入)
import requirement from '@/pages/requirement/index.vue'
import requirementList from '@/pages/requirement/list.vue'
import requirementReview from '@/pages/requirement/review.vue'
// 项目主页 -> 流程管理(部分动态路由引入)
import flow from '@/pages/flow'
import flowList from '@/pages/flow/list.vue'
import flowStatistics from '@/pages/flow/flowStatistics.vue'
// 项目主页 -> 接口自动化
import Header from '@/pages/projectView/header.vue'
import caseManage from '@/pages/projectView/apiMessage/apiMsg.vue'
import manage from '@/pages/projectView/manage.vue'
import modelManage from '@/pages/projectView/module/module.vue'
import projectManage from '@/pages/projectView/project/project.vue'
import reportManage from '@/pages/projectView/report/report.vue'
import reportShow from '@/pages/projectView/report/reportShow.vue'
import reportHeader from '@/pages/projectView/report/reportHeader.vue'
import sceneManage from '@/pages/projectView/caseManage/case.vue'
import testTool from '@/pages/projectView/testTool/testTool.vue'
import taskManage from '@/pages/projectView/taskManage/task.vue'
import user from '@/pages/projectView/userManage/user.vue'
import sceneConfig from '@/pages/projectView/config/config.vue'
// 项目主页 -> 埋点管理 (动态路由引入)
// 项目主页 -> 项目管理 (动态路由引入)

Vue.use(Router)


let curRoutes = [
  // 登陆页
  {
    path: '/login',
    name: 'login',
    component: login
  },
  // 403
  {
    path: '/403',
    name: 'Permission',
    component: () => import('@/pages/403/403.vue')
  },
  // 总主页
  {
    path: '/',
    name: 'index',
    component: index,
    redirect: '/center',
    children: [
      // 测试中心(center) -> 项目(proj)，我的(mine)，团队(team)，资产(property)
      {
        path: 'center',
        name: 'Center',
        component: Center,
        redirect: '/center/proj',
        children: [{
            path: 'proj',
            name: 'Proj',
            component: Proj
          },
          {
            path: 'mine',
            name: 'mine',
            component: mine,
            meta: {
              active: 'mine',
              openeds: 'mineManage'
            }
          },
          {
            path: 'team',
            name: 'team',
            component: team
          },
          {
            path: 'property',
            name: 'property',
            component: property,
            meta: {
              active: 'property',
              openeds: 'propertyManage'
            }
          }
        ]
      },
      // 云真机(stf)
      {
        path: 'stf',
        name: 'stf',
        component: stf,
        redirect: '/stf/devlist',
        meta: {
          active: 'stf',
          openeds: 'stfManage'
        },
        children: [{
            path: 'devlist',
            name: 'DeviceList',
            component: DeviceList
          },
          {
            path: '/useDevices/:serial',
            name: 'useDevices',
            component: useDevices
          },
          {
            path: '/useDetail',
            name: 'useDetail',
            component: useDetail
          },
        ]
      },
      // 持续集成(ci)
      {
        path: 'ci',
        name: 'ci',
        component: ci,
        redirect: '/ci/cilist',
        children: [{
            path: 'cilist',
            name: 'CiList',
            component: CiList
          },
          {
            path: '/ci/:jobId/job',
            name: 'ciedit',
            component: ciedit,
          },
        ]
      },
      // 自动化测试(auto) -> 随机测试(random)，测试报告(report)
      {
        path: '/auto',
        name: 'auto',
        component: () => import('@/pages/autotest/index.vue'),
        redirect: '/auto/random',
        meta: {},
        children: [{
            path: 'random',
            name: 'RandomTest',
            component: () => import('@/pages/autotest/RandomTest.vue'),
            meta: {
              active: 'random',
              breadText: '随机测试'
            }
          },
          {
            path: 'report',
            name: 'TestReport',
            component: () => import('@/pages/autotest/TestReport.vue'),
            meta: {
              active: 'report',
              breadText: '测试报告'
            }
          }
        ]
      },
      // 小工具(tool)
      {
        path: '/tool',
        name: 'tool',
        component: tool,
      },
      // 反馈(feedback)
      {
        path: '/feedback',
        name: 'feedback',
        component: feedback
      },
      // 站内信(mail) -> 所有消息(all)，未读消息(unread)，已读消息(hasread)
      {
        path: '/mail',
        name: 'mail',
        redirect: '/mail/all',
        component: () => import('@/pages/mail/Index.vue'),
        children: [{
            path: 'all',
            name: 'MailAll',
            component: () => import('@/pages/mail/MailAll.vue'),
            meta: {
              defaultActive: 'all'
            }
          },
          {
            path: 'unread',
            name: 'MailUnread',
            component: () => import('@/pages/mail/MailUnread.vue'),
            meta: {
              defaultActive: 'unread'
            }
          },
          {
            path: 'hasread',
            name: 'MailHasRead',
            component: () => import('@/pages/mail/MailHasRead.vue'),
            meta: {
              defaultActive: 'hasread'
            }
          }
        ]
      },
      // 修改密码(password)
      {
        path: '/password',
        name: 'selfPassword',
        component: selfPassword
      },
      // 个人信息(selfInfo)
      {
        path: '/selfInfo',
        name: 'selfInfo',
        component: selfInfo
      },
      // 成员，角色管理(admin)
      {
        path: '/admin',
        component: admin,
        children: [{
            path: 'user',
            name: 'adminUser',
            component: adminUser
          },
          {
            path: 'user/role',
            name: 'adminRole',
            component: adminRole
          },
          {
            path: 'user/add',
            name: 'adminUserAdd',
            component: adminUserAdd
          },
          {
            path: 'user/edit/:id',
            name: 'adminUserEdit',
            component: adminUserAdd
          },
        ]
      }
    ]
  },
  // 项目主页
  {
    path: '/project',
    name: 'ProMain',
    component: ProMain,
    redirect: '/project/:projectId/dashboard',
    children: [
      // dashboard
      {
        path: '/project/:projectId/dashboard',
        component: dashboard,
        name: 'dashboard',
        meta: {
          active: 'dashboard'
        },
      },
      // panel
      {
        path: '/project/:projectId/panel',
        component: panel,
        name: 'panel',
        meta: {
          active: 'panel'
        }
      },
      // version
      {
        path: '/project/:projectId/version',
        name: 'version',
        component: version,
        meta: {
          active: 'version'
        },
        children: [{
            path: ':versionId',
            name: 'versionDetail',
            component: versionDetail,
            meta: {
              active: 'version'
            }
          },
          {
            path: ':versionId/task/:taskId',
            name: 'taskCase',
            component: taskCase,
            meta: {
              active: 'version'
            }
          },
          {
            path: ':versionId/taskResult/:taskId',
            name: 'taskResult',
            component: () => import('@/pages/project/version/task/taskResult.vue'),
            meta: {
              active: 'version'
            }
          },
          {
            path: ':versionId/taskcaseDetail/:taskcaseId',
            name: 'taskcaseDetail',
            component: taskcaseDetail,
            meta: {
              active: 'version'
            }
          },
        ]
      },
      // modules
      {
        path: '/project/:projectId/modules',
        name: 'module',
        component: module,
        meta: {
          active: 'module'
        },
        children: [{
            path: ':moduleId/case',
            name: 'caseList',
            component: caseList,
            meta: {
              active: 'module',
            }
          },
          {
            path: ':moduleId/case/create',
            name: 'caseAdd',
            component: caseAdd,
            meta: {
              active: 'module',
            }
          },
          {
            path: ':moduleId/case/update/:caseId',
            name: 'caseEdit',
            component: caseAdd,
            meta: {
              active: 'module',
            }
          },
        ]
      },
      // issue
      {
        path: '/project/:projectId/issue',
        name: 'issuepage',
        component: () => import('@/pages/issue/issuePage.vue'),
        meta: {
          active: 'issue',
        },
        children: [{
            path: ':versionId',
            name: 'issue',
            component: () => import('@/pages/issue/index.vue'),
            meta: {
              active: 'issue',
            }
          },
          {
            path: ':versionId/issueDetail/:issueId',
            name: 'issueDetailPage',
            component: () => import('@/pages/issue/issueDetailPage'),
            meta: {
              active: 'issue'
            }
          }
        ]
      },
      // requirement
      {
        path: '/project/:projectId/requirement',
        name: 'requirement',
        component: requirement,
        meta: {
          active: 'requirement',
        },
        children: [{
            path: ':requirementClassId',
            name: 'requirementList',
            component: requirementList,
            meta: {
              active: 'requirement',
            }
          },
          {
            path: ':requirementClassId/Add',
            name: 'requirementAdd',
            component: () => import('@/pages/requirement/add.vue'),
            meta: {
              active: 'requirement',
            }
          },
          {
            path: ':requirementClassId/Edit/:requirementId',
            name: 'requirementEdit',
            component:  () => import('@/pages/requirement/add.vue'),
            meta: {
              active: 'requirement',
            }
          },
          {
            path: ':requirementClassId/requirementDetail/:requirementId',
            name: 'requirementDetail',
            component: () => import('@/pages/requirement/requirementDetailPage.vue'),
            meta: {
              active: 'requirement',
            }
          },
          {
            path: ':requirementClassId/requirementCase/:requirementId',
            name: 'requirementCase',
            component: () => import('@/pages/requirement/rqCase.vue'),
            meta: {
              active: 'requirement',
            }
          },
          {
            path: ':requirementClassId/review',
            name: 'requirementReview',
            component: requirementReview,
            meta: {
              active: 'requirement',
            }
          }
        ]
      },
      // flow
      {
        path: '/project/:projectId/flow',
        name: 'flow',
        component: flow,
        meta: {
          active: 'flow'
        },
        children: [{
            path: 'add',
            name: 'flowAdd',
            component: ()=>import('@/pages/flow/add.vue'),
            meta: {
              active: 'flow'
            }
          },
          {
            path: 'list',
            name: 'flowList',
            component: flowList,
            meta: {
              active: 'flow'
            }
          },
          {
            path: 'detail/:flowId',
            name: 'flowDetail',
            component: () => import('@/pages/flow/detail.vue'),
            meta: {
              active: 'flow'
            }
          },
          {
            path: 'flowStatistics',
            name: 'flowStatistics',
            component: flowStatistics,
            meta: {
              active: 'flow'
            }
          },
          {
            path: 'flowSource',
            name: 'flowSource',
            component: () => import('@/pages/flow/personDistribution.vue'),
            meta: {
              active: 'flow'
            }
          }
        ]
      },
      // 接口自动化
      {
        path: '/project/:projectId/manage',
        component: manage,
        name: 'manage',
        meta: {
          active: 'manage',
          openeds: 'apiDebug'
        },
        children: [{
            path: '',
            components: {
              Header: Header,
              Manage: projectManage,
            },
            meta: {
              active: 'manage',
              title: '首页入口'
            }
          },
          {
            path: 'projectManage',
            name: 'projectManage',
            meta: {
              active: 'manage',
              requireAuth: true,
            },
            components: {
              Header: Header,
              Manage: projectManage,
            }
          },
          {
            path: 'modelManage',
            name: 'modelManage',
            meta: {
              active: 'manage',
              requireAuth: true,
            },
            components: {
              Header: Header,
              Manage: modelManage,
            }
          },
          {
            path: 'sceneConfig',
            name: 'sceneConfig',
            meta: {
              active: 'manage',
              requireAuth: true,
            },
            components: {
              Header: Header,
              Manage: sceneConfig,
            }
          },
          {
            path: 'caseManage',
            name: 'caseManage',
            meta: {
              active: 'manage',
              requireAuth: true,
            },
            components: {
              Header: Header,
              Manage: caseManage,
            }
          },
          {
            path: 'reportManage',
            name: 'reportManage',
            meta: {
              active: 'manage',
              requireAuth: true,
            },
            components: {
              Header: Header,
              Manage: reportManage,
            },
          },
          {
            path: 'reportShow',
            name: 'reportShow',
            meta: {
              active: 'manage',
              requireAuth: true,
            },
            components: {
              Header: reportHeader,
              Manage: reportShow,
            }
          },
          {
            path: 'buildInFunc',
            name: 'buildInFunc',
            meta: {
              active: 'manage',
              requireAuth: true,
            },
            components: {
              Header: Header,
              Manage: ()=>import('@/pages/projectView/buildInFunc/buildInFunc.vue'),
            }
          },
          {
            path: 'sceneManage',
            name: 'sceneManage',
            meta: {
              active: 'manage',
              requireAuth: true,
            },
            components: {
              Header: Header,
              Manage: sceneManage,
            }
          },
          {
            path: 'testTool',
            name: 'testTool',
            meta: {
              active: 'manage',
              requireAuth: true,
            },
            components: {
              Header: Header,
              Manage: testTool,
            }
          },
          {
            path: 'userManage',
            name: 'userManage',
            meta: {
              active: 'manage',
              requireAuth: true,
            },
            components: {
              Header: Header,
              Manage: user,
            }
          },
          {
            path: 'taskManage',
            name: 'taskManage',
            meta: {
              active: 'manage',
              requireAuth: true,
            },
            components: {
              Header: Header,
              Manage: taskManage,
            }
          },
        ],
      },
      // 埋点管理
      {
        path: '/project/:projectId/track',
        component: () => import('@/pages/track/index.vue'),
        name: 'trackIndex',
        redirect: '/project/:projectId/track/sdk',
        meta: {
          active: 'track'
        },
        children: [{
            path: 'sdk',
            name: 'sdk',
            component: () => import('@/pages/track/Sdk.vue'),
            meta: {
              active: 'track'
            }
          },
          {
            path: 'report',
            name: 'trackReport',
            component: () => import('@/pages/track/Report.vue'),
            meta: {
              active: 'track'
            }
          },
          {
            path: 'track',
            name: 'track',
            component: () => import('@/pages/track/Track.vue'),
            meta: {
              active: 'track'
            }
          }
        ]
      },
      // 项目管理
      {
        path: '/project/:projectId/tag',
        component: () => import('@/pages/tagManager/TagManager.vue'),
        name: 'TagManager',
        redirect: '/project/:projectId/tag/staff',
        meta: {
          active: 'tag'
        },
        children: [{
            path: 'staff',
            name: 'Staff',
            component: () => import('@/pages/tagManager/Staff.vue'),
            meta: {
              active: 'tag'
            }
          },
          {
            path: 'panelset',
            name: 'panelset',
            component: () => import('@/pages/tagManager/panelSet.vue'),
            meta: {
              active: 'tag'
            }
          },
          {
            path: 'flowset',
            name: 'flowset',
            component: () => import('@/pages/tagManager/flowSet.vue'),
            meta: {
              active: 'tag'
            }
          }
        ]
      }
    ]
  }
]

Vue.use(Router)
let router = new Router({
  routes: curRoutes
})
router.beforeEach(
  store.commit('FLASH_TOKEN'),
  store.commit('ENDURING_PROJECT_INFOS') //项目信息
)

export default router

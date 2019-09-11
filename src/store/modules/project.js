const SET_PROJECT_LIST = 'SET_PROJECT_LIST'
const SET_CURRENT_PROJECT = 'SET_CURRENT_PROJECT'
const PROJECT_ID = 'PROJECT_ID'
const SET_USERLIST = 'SET_USERLIST'
const SET_VERSION = 'SET_VERSION'
const SET_OSS_DATA = 'SET_OSS_DATA'
const ENDURING_PROJECT_INFOS = 'ENDURING_PROJECT_INFOS'
const CLEAR_PROJECT_INFOS = 'CLEAR_PROJECT_INFOS'
const USER_PROJECTS = 'USER_PROJECTS'
const SET_PROJECT_SETTINGS = 'SET_PROJECT_SETTINGS'

export default {
  state: {
    projectList:[],
    currentProject:'',
    projectId:'',
    userList:[],
    versionList:[],
    ossData:'',
    projects:'[]',
    settings:''
  },
  mutations: {
    [SET_PROJECT_LIST] (state,project) {
      state.projectList = project
      localStorage.setItem('projectlist',JSON.stringify(project))
    },
    [SET_CURRENT_PROJECT] (state,curProject) {
      state.currentProject = curProject
      localStorage.setItem('curProject',JSON.stringify(curProject))
    },
    [PROJECT_ID] (state,projectId) {
      state.projectId = projectId
      localStorage.setItem('projectId',projectId)
    },
    [SET_PROJECT_SETTINGS] (state,settings) {
      state.settings = settings  
      localStorage.setItem('proSettings',JSON.stringify(settings))
    },
    [SET_USERLIST] (state,userList) {
      state.userList = userList
      localStorage.setItem('userList',JSON.stringify(userList))
    },
    [SET_VERSION] (state,version) {
      state.versionList = version
      localStorage.setItem('versionList',JSON.stringify(version))
    },
    [SET_OSS_DATA] (state,oss) {
      state.ossData = oss
      localStorage.setItem('ossData',JSON.stringify(oss))
    },
    [USER_PROJECTS] (state,projects) {
      state.projects = projects.toString()
      localStorage.setItem('projects',projects.toString())
    },
    [ENDURING_PROJECT_INFOS] (state) {
      state.projectList = localStorage.getItem('projectlist')?JSON.parse(localStorage.getItem('projectlist')):[]
      state.currentProject = localStorage.getItem('curProject')&&localStorage.getItem('curProject')!='undefined'?JSON.parse(localStorage.getItem('curProject')):''
      state.userList = localStorage.getItem('userList')?JSON.parse(localStorage.getItem('userList')): []
      state.versionList = localStorage.getItem('versionList')?JSON.parse(localStorage.getItem('versionList')):[]
      state.ossData = localStorage.getItem('ossData')?JSON.parse(localStorage.getItem('ossData')): ''
      state.projectId = localStorage.getItem('projectId')?localStorage.getItem('projectId'): ''
      state.projects = localStorage.getItem('projects')?localStorage.getItem('projects'): '[]'
      state.settings = localStorage.getItem('proSettings')?JSON.parse(localStorage.getItem('proSettings')): ''
    },
    [CLEAR_PROJECT_INFOS] (state){
      //清除存储
      localStorage.removeItem('projectlist');
      localStorage.removeItem('curProject');
      localStorage.removeItem('projectId');
      localStorage.removeItem('userList');
      localStorage.removeItem('versionList');
      localStorage.removeItem('ossData');
      localStorage.removeItem('flowSource');
      // localStorage.removeItem('proSettings');
    }
  },
  actions: {}
}

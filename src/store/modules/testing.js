import Vue from 'vue'
import cookie from 'vue-cookie'
Vue.use(cookie)
function generalContent(message, filed) {
  switch (message.status) {
    case 0:
      return message.content
    case 1:
      message.content['waring-color'] = '#368c0b'
      return message.content
    case 2:
      message.content['waring-color'] = '#ff0000'
      return message.content
    default:
      return message.content
  }
}

export default {
  state: {
    message: [],
    stateMsg: [],
    isConnect: false,
    sessionId: '',
    lightFiled: [],
    defaultFiled: ['@_type', '@_page_action'],
    command: {
      connect: 'connect',
      close: 'close',
      heart: 'heart',
      filter: 'filter'
    },
    platformInfo: {
      ip: '',
      project_id: '',
      token: ''
    }
  },
  getters: {
    message: state => {
      return state.message.filter(item => !item.toHide)
    },
    stateMsg: state => {
      return state.stateMsg
    },
    lightFiled: state => {
      return state.lightFiled.join(',')
    },
    tableFiled: state => {
      if (state.lightFiled.length <= 0) {
        return state.defaultFiled
      }
      let result = [...state.lightFiled, ...state.defaultFiled]
      return result.filter(item => item.length > 0)
    },
    isConnect: state => {
      return state.isConnect
    },
    getRequestParams: (state, getters, rootState) => {
      let project = rootState.project.project
      let userId = rootState.login.userInfo.id
      if (typeof project === 'string') {
        project = JSON.parse(project)
      }
      let field = project.id + '-' + userId
      let p = Vue.cookie.get(field)
      console.log('Vue.cookie.get:', field)
      console.log('Vue.cookie.get:', p)
      return (p && JSON.parse(p)) || undefined
    },
    command: state => {
      return state.command
    },
    platformInfo (state) {
      return state.platformInfo
    }
  },
  mutations: {
    addMessage(state, msg) {
      if (msg.indexOf('ok') >= 0 && state.sessionId === '') {
        state.sessionId = msg.split(':')[1]
        console.log('state.sessionId----------', state.sessionId)
      } else if (msg.indexOf('status') >= 0) {
        let message = JSON.parse(msg)
        let resultFiled = [...state.lightFiled, ...state.defaultFiled]
        let result = generalContent(message, resultFiled)
        result['msgIndex'] = state.message.length
        state.message.push(result)
      } else {
        state.stateMsg.push(msg)
      }
    },
    addStateMessage(state, msg) {
      state.stateMsg.push(msg)
    },
    clearMessage(state) {
      state.sessionId = ''
      state.message = []
    },
    setConnectStatus(state, bo) {
      state.isConnect = bo
      if (state.isConnect) {
        state.stateMsg.push('连接已成功......')
      } else {
        state.sessionId = ''
        state.stateMsg.push('连接已断开......')
      }
    },
    setLightFiled(state, info) {
      state.lightFiled = info.split(',')
    },
    hideMsg(state) {
      state.message.forEach(item => {
        item.toHide = true
      })
      let temp = state.message
      state.message = []
      state.message = temp
    },
    setRequestParams(state, re) {
      console.log('re.filed:', re.filed)
      console.log('re.data:', re.data)
      Vue.cookie.set(re.filed, re.data)
      console.log('Vue.cookie.get----', Vue.cookie.get(re.filed))
    },
    clearRequestParams(state) {
      Vue.cookie.delete('')
    },
    setPlatformInfo (state, data) {
      Object.assign(state.platformInfo, data) 
    }
  },
  namespaced: true,
  actions: {
    message({ commit, state }, msg) {
      commit('addMessage', msg)
    },
    stateMessage({ commit, state }, msg) {
      commit('addStateMessage', msg)
    },
    clear({ commit, state }) {
      commit('clearMessage')
    },
    isConnect({ commit, state }, bo) {
      commit('setConnectStatus', bo)
    },
    setHightLightFiled({ commit, state }, info) {
      console.log('setHightLightFiled', info)
      commit('setLightFiled', info)
    },
    hideMsg({ commit, state }) {
      commit('hideMsg')
    },
    setRequestParams({ commit, state }, info) {
      commit('setRequestParams', info)
    },
    clearRequestParams({ commit, state, rootState }) {
      try {
        let project = rootState.project.project
        let userId = rootState.login.userInfo.id
        if (typeof project === 'string') {
          project = JSON.parse(project)
        }
        let field = project.id + '-' + userId
        commit('clearRequestParams', field)
      } catch (err) {
        console.log(err)
      }
    }
  }
}

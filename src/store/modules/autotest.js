export default {
  state: {
    selectApk: {}, // 选中的apk
    selectPhoneList: [], // 选中的手机列表
    runTime: 240,
    isInstallApp: true,
    jumpLogin: false,
    testType: 1
  },
  getters: {
    getIsInstallApp(state) {
      return state.isInstallApp ? 1 : 0
    },
    getJumpLogin(state) {
      return state.jumpLogin ? 1 : 0
    }
  },
  mutations: {
    setSelectApk(state, data) {
      state.selectApk = data
    },
    setSelectPhoneList(state, data) {
      state.selectPhoneList = data
    },
    setRunTime(state, data) {
      state.runTime = data
    },
    setIsInstallApp(state, data) {
      state.isInstallApp = data
    },
    setJumpLogin(state, data) {
      state.jumpLogin = data
    },
    setTestType(state, data) {
      state.testType = data
    }
  },
  actions: {
    test({commit, state}, data) {
        
    }
  },
  namespaced: true
}

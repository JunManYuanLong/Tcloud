const TOGGLE_VISIBLE = 'TOGGLE_VISIBLE'
const CHANGE_VISIBLE = 'CHANGE_VISIBLE'
const CHANGE_VERSION =  'CHANGE_VERSION'

export default {
  state: {
    visible: true,
    versionChange: false
  },
  mutations: {
    [TOGGLE_VISIBLE] (state) {
      state.visible = !state.visible
    },
    [CHANGE_VISIBLE] (state, visible) {
      state.visible = visible
    },
    [CHANGE_VERSION] (state,status){
      state.versionChange = status
    }
  },
  actions: {}
}

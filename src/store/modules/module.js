const MODULE_CHANGE = 'MODULE_CHANGE'

export default {
  state: {
    change: false
  },
  mutations: {
    [MODULE_CHANGE] (state) {
      state.change = !state.change
    }
  },
  actions: {}
}

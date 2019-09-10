import mailApi from "@/api/mail.js";
export default {
  state: {
    unReadList: [],
    unReadNum: 0,
    unReadPageSize: 10,
    unReadPageIndex: 1
  },
  getters: {
    getUnreadList(state) {
      return state.unReadList
    },
    getUnReadNum(state) {
      return state.unReadNum
    },
    getUnReadPageIndex(state) {
      return state.unReadPageIndex
    },
    hasDot(state) {
      return state.unReadNum > 0
    }
  },
  mutations: {
    setUnReadList(state, data) {
      state.unReadList = data
    },
    setUnReadNum(state, data) {
      state.unReadNum = data
    },
    setUnReadPageSize(state, data) {
      state.unReadPageSize = data
    },
    setUnReadPageIndex(state, data) {
      state.unReadPageIndex = data
    },
  },
  actions: {
    UnReadList({
      commit,
      state
    }, data) {
      let params = {
        user: data.userId,
        page_size: state.unReadPageSize,
        page_index: state.unReadPageIndex
      };
      mailApi
        .getMailByStatus(params)
        .then(res => {
          commit('setUnReadNum', res.data.total)
          commit('setUnReadList', res.data.data)
        })
        .catch(err => {
          // 清除定时器
          clearInterval(data.timer)
          // this.$message.error(err.message);
        });
    }
  },
  namespaced: true
}

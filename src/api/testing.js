import socket from './socket'
import store from '../store'

export const getTestingConnect = data => {
  socket.openConnect()
}
export const sendTestingData = (data, c) => {
  // let user = store.getters['login/user'] 
  console.log(store.state.login.userid)
  let hightLine = store.getters['testing/lightFiled']
  if (data) {
    socket.sentMessage({
      command: c,
      request: data
    })
    if (data.project_id) {
      let cooke = Object.assign({}, data, { field: hightLine })
      store.dispatch('testing/setRequestParams', {
        // filed: data.project_id + '-' + user.id,
        filed: data.project_id + '-' + store.state.login.userid,
        data: JSON.stringify(cooke)
      })
    }
  }
}

export const closeTestingConnect = data => {
  socket.closeConnect()
}

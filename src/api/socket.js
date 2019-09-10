import store from '../store'
import { Message } from 'element-ui'
console.log(store.state.testing.platformInfo)
// let SOCKET_URL = process.env.SOCKET_URL  
// let SOCKET_URL = 'ws://47.93.216.50:8003'
let websocket = null
function open() {
  let platformInfo = JSON.parse(JSON.stringify(store.state.testing.platformInfo))
  console.log(platformInfo) 
  let url = platformInfo.ip + '/v1/replay'
  if (websocket) {
    websocket = null
  }
  let token = platformInfo.token
  websocket = new WebSocket(url + '?t=' + token)
  switch (websocket.readyState) {
    case WebSocket.CONNECTING:
      store.dispatch('testing/stateMessage', '正在建立连接......')
      break
    case WebSocket.OPEN:
      break
    case WebSocket.CLOSING:
      store.dispatch('testing/stateMessage', '正在关闭连接......')
      break
    case WebSocket.CLOSED:
      break
    default:
      break
  }
  websocket.onopen = evt => {
    onOpen(evt)
  }
  websocket.onclose = evt => {
    onClose(evt)
  }
  websocket.onmessage = function(evt) {
    onMessage(evt)
  }
  websocket.onerror = function(evt) {
    onError(evt)
  }
}

function onOpen(evt) {
  console.log('socket opening')
  store.dispatch('testing/isConnect', true)
}

function onClose(evt) {
  console.log('socket close')
  store.dispatch('testing/isConnect', false)
}

function onMessage(evt) {
  console.log('socket on message:', evt.data)
  console.log('socket on message:', typeof evt.data)
  store.dispatch('testing/message', evt.data)
}

function onError(evt) {
  console.log('socket error:', evt)
  store.dispatch('testing/stateMessage', evt.data)
  websocket.close()
}

function doSend(message) {
  let msg = JSON.stringify(message).replace(/\\"/g, '')
  console.log('发送请求', msg)
  websocket.send(msg)
}
export default {
  closeConnect() {
    websocket.close()
  },
  openConnect() {
    if ('WebSocket' in window) {
      store.dispatch('testing/clear')
      open()
    } else {
      Message({
        message: '当前浏览器不支持 WebSocket!',
        type: 'error'
      })
    }
  },
  sentMessage(msg) {
    doSend(msg)
  }
}

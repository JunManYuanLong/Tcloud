import instance from '@/api/index.js'
const urlPrefix = '/v1/'

export default {
  /* 
    获取最近十条或者所有消息
  */
  getMail(params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}message/`,
      params
    })
  },
  /* 
    获取已读或未读的消息
  */
  getMailByStatus(params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}message/status`,
      params
    })
  },
  /* 
    标记为已读
  */
  changeStatus(params) {
    return instance({
      method: 'put',
      url: `${urlPrefix}message/`,
      params
    })
  },
  /* 
    删除一条消息
  */
  deleteItem(params) {
    return instance({
      method: 'delete',
      url: `${urlPrefix}message/`,
      params
    })
  }
}

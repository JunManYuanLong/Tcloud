import instance from '@/api/index.js'
const urlPrefix = '/v1/'
export default {
  createFeedback (params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}feedback/`,
      data: params
    })
  },
  getFeedback (params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}feedback/`,
      params: params
    })
  },
  delFeedback (params) {
    return instance({
      method: 'delete',
      url: `${urlPrefix}feedback/`,
      params: params
    })
  }
}

import instance from '@/api/index.js'
const urlPrefix = '/v1/'

export default {
  getTag(params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}tag/`,
      params: params
    })
  },
  addTag(params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}tag/`,
      data: params
    })
  },
  delTag(id) {
    return instance({
      method: 'delete',
      url: `${urlPrefix}tag/${id}`
    })
  }
}

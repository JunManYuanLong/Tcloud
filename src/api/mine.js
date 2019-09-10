import instance from '@/api/index.js'
const urlPrefix = '/v1/'
export default {
  getCreated (params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}board/create`,
      params: params
    })
  },
  getFinish (params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}board/finish`,
      params: params
    })
  },
  getUnfinish (params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}board/unfinish`,
      params: params
    })
  },
  
}

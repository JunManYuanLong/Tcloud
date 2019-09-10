import instance from '@/api/index.js'
const urlPrefix = '/v1/'
export default {

  getIpInfo(params){
    return instance({
      method: 'get',
      url: `${urlPrefix}tool/ip`,
      params: params
    })
  },

}

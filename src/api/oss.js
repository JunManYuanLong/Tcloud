import instance from '@/api/index.js'
const urlPrefix = '/v1/'
export default {
  getOssAuth(params){
    return instance({
      method: 'get',
      url: `${urlPrefix}public/ossauth`,
      params: params
    })
  }
}
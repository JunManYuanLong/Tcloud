import instance from '@/api/index.js'
const urlPrefix = '/v1/'
export default {
  getPanelSet (projectId,params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}boardconfig/${projectId}`,
      params: params
    })
  },
  setPanelShow (projectId,params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}boardconfig/${projectId}`,
      data: params
    })
  },
}

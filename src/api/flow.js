import instance from '@/api/index.js'
const urlPrefix = '/v1/'
export default {
  addFlow (params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}flow/`,
      data: params
    })
  },
  getFlowList (params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}flow/`,
      params: params
    })
  },
  updateFlow(id,params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}flow/${id}`,
      data:params
    })
  },
  deleteFlow(id) {
    return instance({
      method: 'delete',
      url: `${urlPrefix}flow/${id}`
    })
  },
  doFlow(id,params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}flow/next/${id}`,
      data:params
    })
  },
  getFlowSteps (params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}flow/assemble`,
      params: params
    })
  },
  getStepData(params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}flow/base`,
      params: params
    })
  },
  getFlowDetail(id) {
    return instance({
      method: 'get',
      url: `${urlPrefix}flow/${id}`
    })
  },
  stopFlow(id,params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}flow/stop/${id}`,
      data:params
    })
  },
  getFlowStatistics(params){
    return instance({
      method: 'post',
      url: `${urlPrefix}flow/dashboard`,
      data: params
    })
  },
  getAutoTestReport(params){
    return instance({
      method: 'post',
      url: `${urlPrefix}cidata/report`,
      data: params
    })
  },
  exportFlow(params){
    return instance({
      method: 'get',
      url: `${urlPrefix}flow/row/export`,
      params:params
    })
  },
  runAutoTestReport(params){
    return instance({
      method: 'post',
      url: `${urlPrefix}cidata/run`,
      data: params
    })
  },
  getFlowResource(params){
    return instance({
      method: 'get',
      url: `${urlPrefix}flow/resource`,
      params:params
    })
  },
  setPersonSource(params){
    return instance({
      method: 'post',
      url: `${urlPrefix}flow/source`,
      data: params
    })
  },
  getPersonSource(params){
    return instance({
      method: 'post',
      url: `${urlPrefix}flow/getsource`,
      data: params
    })
  },
  exportPersonSource(params){
    return instance({
      method: 'get',
      url: `${urlPrefix}flow/resource/export`,
      params:params
    })
  },
  getFlowConfig(params){
    return instance({
      method: 'get',
      url: `${urlPrefix}public/config`,
      params:params
    })
  },
  updateFlowConfig(config_id, params){
    return instance({
      method: 'post',
      url: `${urlPrefix}public/config/${config_id}`,
      data:params
    })
  }
}

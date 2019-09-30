import instance from '@/api/index.js'
const urlPrefix = '/v1/'
export default {
  getRequirementType (params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}requirement/type/`,
      params: params
    })
  },
  getRequirementStatus (params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}requirement/status/`,
      params: params
    })
  },
  getIssueType (params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}issue/type/`,
      params: params
    })
  },
  getIssueStatus (params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}issue/status/`,
      params: params
    })
  },
  getIssueSet(params){
    return instance({
      method: 'get',
      url: `${urlPrefix}public/issue/`,
      params: params
    })
  },
  getRequirementSet(params){
    return instance({
      method: 'get',
      url: `${urlPrefix}public/requirement/`,
      params: params
    })
  },
  getFlowSet(params){
    return instance({
      method: 'get',
      url: `${urlPrefix}public/flow/`,
      params: params
    })
  },
  getTaskSet(params){
    return instance({
      method: 'get',
      url: `${urlPrefix}public/task/`,
      params: params
    })
  },
  getCaseSet(params){
    return instance({
      method: 'get',
      url: `${urlPrefix}public/case/`,
      params: params
    })
  }
}

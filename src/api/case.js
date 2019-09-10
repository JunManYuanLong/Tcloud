import instance from '@/api/index.js'
const urlPrefix = '/v1/'
export default {
  addCase (params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}case/`,
      data: params
    })
  },
  getCaseList (params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}case/`,
      params: params
    })
  },
  getCaseListByIds(params){
    return instance({
      method: 'post',
      url: `${urlPrefix}case/list`,
      data: params
    })
  },
  getCaseByModule(id, params){
    return instance({
      method: 'get',
      url: `${urlPrefix}case/querybymodule/${id}`,
      params:params
    })
  },
  getSingleCase(params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}case/${params.id}`
    })
  },
  editCase (id, params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}case/${id}`,
      data: params
    })
  },
  deleteCase (params) {
    return instance({
      method: 'delete',
      url: `${urlPrefix}case/${params.id}`
    })
  },
  caseDashboard (params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}case/dashboard`,
      data: params
    })
  },
  exportCase(params){
    return instance({
      method: 'get',
      url: `${urlPrefix}case/export`,
      params:params
    })
  },
  importCase(params){
    return instance({
      method: 'post',
      url: `${urlPrefix}case/import`,
      data: params
    })
  }
}

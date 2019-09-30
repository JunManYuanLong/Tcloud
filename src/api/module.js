import instance from '@/api/index.js'
const urlPrefix = '/v1/'
export default {
  addModule (params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}module/`,
      data: params
    })
  },
  getModuleList (params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}module/`,
      params: params
    })
  },
  getModuleByProject (projectId,params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}module/querybyproject/${projectId}`,
      params: params
    })
  },
  getSingleModule(params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}module/${params.id}`
    })
  },
  editModule (id,params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}module/${id}`,
      data: params
    })
  },
  deleteModule (params) {
    return instance({
      method: 'delete',
      url: `${urlPrefix}module/${params.id}`
    })
  },
}

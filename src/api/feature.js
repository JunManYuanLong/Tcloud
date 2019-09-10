import instance from '@/api/index.js'
const urlPrefix = '/v1/'
export default {
  addFeature (params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}feature/`,
      data: params
    })
  },
  getFeatureList (params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}feature/`,
      params: params
    })
  },
  getSingleFeature(params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}feature/${params.id}`
    })
  },
  editFeature (id,params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}feature/${id}`,
      data: params
    })
  },
  deleteFeature (params) {
    return instance({
      method: 'delete',
      url: `${urlPrefix}feature/${params.id}`
    })
  },
}
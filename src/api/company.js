import instance from '@/api/index.js'
const urlPrefix = '/v1/'
export default {
  getCompanyList (params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}company/`,
      params: params
    })
  },
  getSingleCompany(params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}company/${params.id}`
    })
  },
  addCompany (params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}company/`,
      data: params
    })
  },
  editCompany (id,params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}company/${id}`,
      data: params
    })
  },
  deleteCompany (params) {
    return instance({
      method: 'delete',
      url: `${urlPrefix}company/${params.id}`
    })
  }
}
import instance from '@/api/index.js'
const urlPrefix = '/v1/'
export default {
  getVersionByProject (params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}version/`,
      params: params
    })
  },
  createVersion (params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}version/`,
      data: params
    })
  },
  editVersion (versionId, params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}version/${versionId}`,
      data: params
    })
  },
  getVersionDetail (versionId) {
    return instance({
      method: 'get',
      url: `${urlPrefix}version/${versionId}`
    })
  },
  deleteVersion (versionId) {
    return instance({
      method: 'delete',
      url: `${urlPrefix}version/${versionId}`
    })
  },
  publishVersion (versionId) {
    return instance({
      method: 'post',
      url: `${urlPrefix}version/publish/${versionId}`
    })
  }
}

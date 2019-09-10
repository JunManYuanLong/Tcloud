import instance from '@/api/index.js'
const urlPrefix = '/v1/'
export default {
  devicesReport (params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}tcdevices/report`,
      data: params
    })
  },
  getTcDevices (params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}tcdevices/getdevices`,
      params: params
    })
  },
  getTcToken (params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}tcdevices/gettoken`,
      params: params
    })
  },
  disconnectDevices (params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}tcdevices/disconnect`,
      data: params
    })
  },
  getUseDetail (params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}tcdevices/usedetail`,
      params: params
    })
  },

  getUserUseDetail (params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}tcdevices/usedetail/user`,
      params: params
    })
  },
  getDevicesDashboard (params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}tcdevices/dashboard`,
      params: params
    })
  },

}

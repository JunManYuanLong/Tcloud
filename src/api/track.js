import instance from '@/api/index.js'
const urlPrefix = '/v1/'
export default {
  /* 
      获取sdk列表
  */
  getSdkList(params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}track/sdk`,
      params
    })
  },
  /* 
    获取事件列表
  */
  getTrackList(params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}track/event`,
      params
    })
  },
  /* 
    新增事件
  */
  addTrack(params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}track/add/event`,
      data: params
    })
  },
  /* 
    删除事件
  */
  deleteTrack(params, eventId) {
    return instance({
      method: 'delete',
      url: `${urlPrefix}track/${eventId}`,
      data: params
    })
  },
  /* 
    编辑事件
  */
  updateTrack(params, eventId) {
    return instance({
      method: 'post',
      url: `${urlPrefix}track/${eventId}`,
      data: params
    })
  },
  /*    
   添加属性
  */
  addPropItem(params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}track/add/param`,
      data: params
    })
  },
  /* 
    删除属性
  */
  deletePropItem(params) {
    return instance({
      method: 'delete',
      url: `${urlPrefix}track/delete/param`,
      data: params
    })
  },
  /* 
    获取设备号类型列表
  */
  getDevice(params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}track/device`,
      params
    })
  },
  /* 
    获取埋点平台的token,projectID,url
  */
  getPlatformInfo (params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}track/info`,
      params
    })
  }
}

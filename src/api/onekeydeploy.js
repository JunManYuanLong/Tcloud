import instance from '@/api/index.js'
const urlPrefix = '/v1/'
export default {
  getServer(params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}deploy/getserver`,
      params: params
    })
  },
  oneKeyDeploy(data) {
    return instance({
      method: 'post',
      url: `${urlPrefix}deploy/`,
      data: data
    })
  },
  getOneKeyDeployStatus(data) {
    return instance({
      method: 'post',
      url: `${urlPrefix}deploy/status`,
      data: data
    })
  },
  /* 
    获取最近一次部署状态
  */
  currentStatus(params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}deploy/new_data`,
      params: params
    })
  },
  /* 
    查看每一项日志详情
  */
  getLogDetail(params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}deploy/check_log`,
      params: params
    })
  },
  /* 
    查询部署历史记录
  */
  getHistoryList(params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}deploy/history_data`,
      params: params
    })
  },
  /* 
    通过serverid 查询分支列表
  */
  getBranchById (params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}deploy/branch`,
      params: params
    })
  }
}

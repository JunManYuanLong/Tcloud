import instance from '@/api/index.js'
const urlPrefix = '/v1/'

export default {
  /* 
    上传apk，将url传给后台
  */
  uploadPackage(params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}monkey/package`,
      data: params
    })
  },
  /* 
    获取上传的apk包列表，不传参数是所有
  */
  getUploadPackage(params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}monkey/package`,
      params
    })
  },
  /* 
    删除apk安装包
  */
  delPackage(package_id) {
    return instance({
      method: 'delete',
      url: `${urlPrefix}monkey/package/${package_id}`
    })
  },
  /* 
    提交测试接口
  */
  submiTest(params, type) {
    if (type) {
      return instance({
        method: 'post',
        url: `${urlPrefix}monkey/start?test_type=${type}`,
        data: params
      })
    }
    return instance({
      method: 'post',
      url: `${urlPrefix}monkey/start`,
      data: params
    })
  },
  /* 
    获取测试总列表
  */
  getTestList(params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}monkey/all`,
      params
    })
  },
  /* 
    获取错误日志列表
  */
  getErrorList(params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}monkey/errorlog`,
      params
    })
  },
  /* 
    获取日志记录列表
  */
  getLogData(params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}monkey/report`,
      params
    })
  },
  /* 
    中断monkey
  */
  shutDownMonkey(params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}monkey/cancel`,
      data: params
    })
  },
  /* 
    查询下拉列表
  */
  getSerchList(params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}datashow/fields`,
      params   
    })
  },  
  /*
    根据测试id获取场景列表
  */
  getSceneList (params) { 
    return instance({
      method: 'get',
      url: `${urlPrefix}performance/name`,
      params
    })
  },
  /* 
    新增下拉列表属性
  */
  addSerchList(params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}datashow/fields`,
      data: params
    })
  },
  /* 
    查询响应时间_内核录屏列表
  */
  getKernelList(params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}datashow/response/kernel`,
      params
    })
  },
  /* 
    查询首页响应准确率列表
  */
  getFirstlList(params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}datashow/correction/first`,
      params
    })
  },
  /* 
    查询响应时间_Log列表
  */
  getLogList(params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}datashow/response/log`,
      params
    })
  },
  /* 
    新增响应时间_内核录屏列表
  */
  addKernelList(params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}datashow/response/kernel`,
      data: params
    })
  },
  /* 
    新增首页响应准确率列表
  */
  addFirstList(params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}datashow/correction/first`,
      data: params
    })
  },
  /* 
    新增响应时间_Log列表
  */
  addLogList(params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}datashow/response/log`,
      data: params
    })
  },
  /* 
    修改响应时间_内核录屏列表
  */
  editKernelList(params, id) {
    return instance({
      method: 'post',
      url: `${urlPrefix}datashow/response/kernel/${id}`,
      data: params
    })
  },
  /* 
    修改首页响应准确率列表
  */
  editFirstList(params, id) {
    return instance({
      method: 'post',
      url: `${urlPrefix}datashow/correction/first/${id}`,
      data: params
    })
  },
  /* 
    修改响应时间_Log列表
  */
  editLogList(params, id) {
    return instance({
      method: 'post',
      url: `${urlPrefix}datashow/response/log/${id}`,
      data: params
    })
  },
  /* 
    删除响应时间_内核录屏列表
  */
  delKernelList(id) {
    return instance({
      method: 'delete',
      url: `${urlPrefix}datashow/response/kernel/${id}`
    })
  },
  /* 
    删除首页响应准确率列表
  */
  delFirstList(id) {
    return instance({
      method: 'delete',
      url: `${urlPrefix}datashow/correction/first/${id}`
    })
  },
  /* 
    删除响应时间_Log列表
  */
  delLogList(id) {
    return instance({
      method: 'delete',
      url: `${urlPrefix}datashow/response/log/${id}`
    })
  },
  /*
    根据场景和测试id获取获取信息
  */
  getTestDataByScene (params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}monkey/test`,
      params
    })
  }
}

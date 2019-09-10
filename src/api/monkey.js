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
  submiTest(params) {
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
  shutDownMonkey (params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}monkey/cancel`,
      data: params
    })
  }
}

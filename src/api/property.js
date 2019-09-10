import instance from '@/api/index.js'
const urlPrefix = '/v1/'
export default {
  addProperty (type,params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}asset/${type}/`,
      data: params
    })
  },
  getPropertyList (type,params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}asset/${type}/`,//type为要请求的资源类型路径，如phone，virtual等
      params: params
    })
  },
  getPhoneHolder(params){
    return instance({
      method: 'get',
      url: `${urlPrefix}asset/phone/holder`
    })
  },
  getSingleProperty(type,params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}asset/${type}/${params.id}`
    })
  },
  getVirtualProperty(params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}asset/virtual/${params.id}`
    })
  },
  editProperty(type,id,params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}asset/${type}/${id}`,
      data: params
    })
  },
  deleteProperty(type,params) {
    return instance({
      method: 'delete',
      url: `${urlPrefix}asset/${type}/${params.id}`
    })
  },
  phoneMove(params,phoneId){
    return instance({
      method: 'post',
      url: `${urlPrefix}asset/phone/move/${phoneId}`,
      data: params
    })
  },
  phoneBorrow(phoneId){
    return instance({
      method: 'post',
      url: `${urlPrefix}asset/phone/borrow/${phoneId}`
    })
  },
  phoneBack(phoneId){
    return instance({
      method: 'post',
      url: `${urlPrefix}asset/phone/return/${phoneId}`
    })
  },
  phoneBorrowUsers(phoneId){
    return instance({
      method: 'get',
      url: `${urlPrefix}asset/phone/borrow/users/${phoneId}`
    })
  },
  phoneBorrowRecord(phoneId){
    return instance({
      method: 'get',
      url: `${urlPrefix}asset/phone/record/detail/${phoneId}`
    })
  },
  phoneBorrowConfirm(phoneId){
    return instance({
      method: 'get',
      url: `${urlPrefix}asset/phone/borrow/confirm/${phoneId}`
    })
  },
  
}
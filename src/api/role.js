import instance from '@/api/index.js'

const urlPrefix = '/v1/'

export default {

  getRoleList () {
    /*
     获取所有角色
     */
    return instance({
      method: 'get',
      url: `${urlPrefix}role/`
    })
  },
  getAbilityList () {
    return instance({
      method: 'get',
      url: `${urlPrefix}ability/`
    })
  },
  roleBindAbility (params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}role/bindability`,
      data: params
    })
  },
  /* 
    获取除admin以外的角色
  */
  getRoleListNoAdmin (params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}role/projectrole`,
      params
    })
  }
}

import instance from '@/api/index.js'
const urlPrefix = '/v1/'
export default {
  doLogin (params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}user/login`,
      data: params
    })
  },
  qywxLogin (code) {
    return instance({
      method: 'post',
      url: `${urlPrefix}wxlogin/`,
      data: {
        user_code: code
      }
    })
  },
  getUserList (params) {
    /*
     获取所有用户
     */
    return instance({
      method: 'get',
      url: `${urlPrefix}user/`,
      params: params
    })
  },
  getTestUserList () {
    /*
     获取所有角色为测试的用户
     */
    return instance({
      method: 'get',
      url: `${urlPrefix}user/`,
      params: {
        role: 3
      }
    })
  },
  getUserByProject(projectId, params){
    /*
     获取项目下所有用户
     */
    return instance({
      method: 'get',
      url: `${urlPrefix}user/byproject/${projectId}`,
      params: params
    })
  },
  getSingleUser(params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}user/${params.id}`
    })
  },
  getSingleRoleUser(params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}user/project_role_list/${params.id}`
    })
  },
  addUser (params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}user/add`,
      data: params
    })
  },
  editUser (id, params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}user/${id}`,
      data: params
    })
  },
  resetPassword (params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}user/resetpassword`,
      data: params
    })
  },
  deleteUser (params) {
    return instance({
      method: 'delete',
      url: `${urlPrefix}user/${params.id}`
    })
  },
  userBindRole (userId, roleIds, projectId) {
    return instance({
      method: 'post',
      url: `${urlPrefix}user/userbindroles`,
      data: {
        userid: userId,
        roleids: roleIds,
        project_id: projectId
      }
    })
  },
  addRole (params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}role/`,
      data: params
    })
  },
  editRole (id, params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}role/${id}`,
      data: params
    })
  },
  deleteRole (id) {
    return instance({
      method: 'delete',
      url: `${urlPrefix}role/${id}`,
    })
  },
  getIsSetPwd(userid) {
    return instance({
      method: 'get',
      url: `${urlPrefix}user/isresetpassword/${userid}`
    })
  },
  updateUserName(params){
    return instance({
      method: 'post',
      url: `${urlPrefix}user/name`,
      data: params
    })
  },
  /* 
    获取不属于当前项目的人员列表
  */
  getNoUser (params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}user/unless/user_list`,
      params
    })
  },
  /* 
    在项目中添加人员 
  */
  addProjectUser (params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}user/adduser`,
      data: params
    })
  },
  /* 
    从项目中移除人员 
  */
  removeProjectUser (params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}user/detachuser`,
      data: params
    })
  },
  /* 
    获取所有项目  
  */
  getUserListWhole (params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}user/project_role_list`,
      params: params
    })
  },
  /* 
    获取所有人员
  */
  getAllUser () {
    return instance({
      method: 'get',
      url: `${urlPrefix}user/all`
    })
  },
  /* 
    总人员管理，绑定角色
  */
  userBindRoleAll (params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}user/userbindall`,
      data: params
    })
  },
  /* 
    获取owner用户所在的项目列表
  */
  getProjectIds (params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}user/project/owner_list`,
      params: params
    })
  },
  /*  
    判断在项目中是否显示人员管理
  */
  isShowStuffAdmin (params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}user/manage/isappear`,
      params: params
    })
  },
  /* 
    用户绑定项目
  */
  userBindProject (params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}user/bindproject`,
      data: params
    })
  },
  getUserRoleAndProject (params){
    return instance({
      method: 'get',
      url: `${urlPrefix}user/gain/roles_projects`,
      params: params
    })
  },
  updateNickName(params){
    return instance({
      method: 'post',
      url: `${urlPrefix}user/nickname`,
      data: params
    })
  },
  //模糊搜索用户
  getUserBySearch (params){
    return instance({
      method: 'get',
      url: `${urlPrefix}user/search`,
      params: params
    })
  }
}

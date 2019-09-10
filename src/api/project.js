import instance from '@/api/index.js'
const urlPrefix = '/v1/'
export default {
  addProject (params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}project/`,
      data: params
    })
  },
  getProjectList (params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}project/`,
      params: params
    })
  },
  getSingleProject(params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}project/${params.id}`
    })
  },
  editProject (id,params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}project/${id}`,
      data: params
    })
  },
  deleteProject (params) {
    return instance({
      method: 'delete',
      url: `${urlPrefix}project/${params.id}`
    })
  },
  projectBindUser (projectId, userIds) {
    return instance({
      method: 'post',
      url: `${urlPrefix}project/bindusers`,
      data: {
        project_id: projectId,
        user_ids: userIds
      }
    })
  },
  getDashboardData(projectId,params){
    return instance({
      method: 'get',
      url: `${urlPrefix}project/index/${projectId}`,
      params:params
    })
  },
  getPorjectModuleCase(projectId){
    return instance({
      method: 'get',
      url: `${urlPrefix}module/queryprojectcase/${projectId}`
    })
  },
  /* 
    如果是owner，通过userId获取项目列表
  */
  getProjectListByUserId (params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}user/currentuser/project_list`,
      params: params
    })
  },
  getProjectSettings(params){
    return instance({
      method: 'get',
      url: `${urlPrefix}public/projectconfig/`,
      params: params
    })
  }
}

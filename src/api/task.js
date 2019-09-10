import instance from '@/api/index.js'
const urlPrefix = '/v1/'
export default {
  addTask (params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}task/`,
      data: params
    })
  },
  getTaskList (params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}task/`,
      params: params
    })
  },
  getTaskListByVersion (versionId, projectId) {
    return instance({
      method: 'get',
      url: `${urlPrefix}task/`,
      params: {
        versionid: versionId,
        projectid: projectId
      }
    })
  },
  getTaskListByProject(projectId){
    return instance({
      method: 'get',
      url: `${urlPrefix}task/`,
      params: {
        projectid: projectId
      }
    })
  },
  getTaskBoard (params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}task/board`,
      data: params
    })
  },
  getTaskCaseByProject (params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}task/projectcase/${params.id}`
    })
  },
  getTaskByUser (userId,params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}task/usertask/${userId}`
    })
  },
  getSingleTask(params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}task/${params.id}`
    })
  },
  editTask (id,params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}task/${id}`,
      data: params
    })
  },
  editTaskResult(id,params){
    return instance({
      method: 'post',
      url: `${urlPrefix}task/testreport/${id}`,
      data: params
    })
  },
  deleteTask (params) {
    return instance({
      method: 'delete',
      url: `${urlPrefix}task/${params.id}`
    })
  },
  //taskcase
  getTCaseByProject(projectId) {
    return instance({
      method: 'get',
      url: `${urlPrefix}task/case/${projectId}`
    })
  },
  getTaskCase(taskId) {
    return instance({
      method: 'get',
      url: `${urlPrefix}taskcase/${taskId}`
    })
  },
  editTaskCase(caseId,params){
    return instance({
      method: 'post',
      url: `${urlPrefix}task/case/${caseId}`,
      data: params
    })
  },
  deleteTaskCase (params) {
    return instance({
      method: 'delete',
      url: `${urlPrefix}task/case/${params.id}`
    })
  },
  taskDashboard (params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}task/dashboard`,
      data: params
    })
  },
  finishTask (taskId) {
    return instance({
      method: 'post',
      url: `${urlPrefix}task/status/${taskId}`,
      data: {
        status: 2
      }
    })
  },
  refuseTask (taskId) {
    return instance({
      method: 'post',
      url: `${urlPrefix}task/status/${taskId}`,
      data: {
        status: 3
      }
    })
  },
  getTag(projectId, tag_type) {
    return instance({
      method: 'get',
      url: `${urlPrefix}tag/`,
      params: {
				project_id: projectId,
        tag_type: tag_type
			}
    })
  },
  addTag(params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}tag/create`,
			data: params
    })
  },
  updateTaskPriority(taskId,params){
    return instance({
      method: 'post',
      url: `${urlPrefix}task/priority/${taskId}`,
      data: params
    })
  }
  
}

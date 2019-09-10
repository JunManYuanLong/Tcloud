import instance from '@/api/index.js'
const urlPrefix = '/v1/'
export default {
  getTaskCaseListByTaskId (projectId, versionId, taskId) {
    return instance({
      method: 'get',
      url: `${urlPrefix}taskcase/`,
      params: {
        projectid: projectId,
        versionid: versionId,
        taskid: taskId
      }
    })
  },
  getTaskcaseById(id){
    return instance({
      method: 'get',
      url: `${urlPrefix}taskcase/${id}`
    })
  },
  searchTaskcaseList(params){
    return instance({
      method: 'get',
      url: `${urlPrefix}taskcase/`,
      params: params
    })
  },
  taskcaseSuccess(taskId) {
    return instance({
      method: 'post',
      url: `${urlPrefix}taskcase/status/${taskId}`,
      data: {
        status: 3
      }
    })
  },
  taskcaseFailure(taskId) {
    return instance({
      method: 'post',
      url: `${urlPrefix}taskcase/status/${taskId}`,
      data: {
        status: 4
      }
    })
  },
  taskcaseSkip(taskId) {
    return instance({
      method: 'post',
      url: `${urlPrefix}taskcase/status/${taskId}`,
      data: {
        status: 2
      }
    })
  },
  taskcaseStatusUpdate(data,taskId){
    return instance({
      method: 'post',
      url: `${urlPrefix}taskcase/status/${taskId}`,
      data:data
    })
  },
  taskcaseAssign(data){
    return instance({
      method: 'post',
      url: `${urlPrefix}taskcase/assign`,
      data: data
    })
  },
  taskcaseComment(data,taskId){
    return instance({
      method: 'post',
      url: `${urlPrefix}taskcase/comment/${taskId}`,
      data: data
    })
  },
  taskcasePriority(data){
    return instance({
      method: 'post',
      url: `${urlPrefix}taskcase/priority`,
      data: data
    })
  },
  exportTaskcase(params){
    return instance({
      method: 'post',
      url: `${urlPrefix}taskcase/export`,
      data: params
    })
  }
}

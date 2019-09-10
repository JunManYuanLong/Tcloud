import instance from '@/api/index.js'
const urlPrefix = '/v1/'
export default {
  addIssue (params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}issue/`,
      data: params
    })
  },
  getIssueList (params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}issue/`,
      params: params
    })
  },
  getIssueListExport (params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}issue/export`,
      params: params
    })
  },
  getIssueBoard(params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}issue/board`,
      data: params
    })
  },
  getSingleIssue(params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}issue/${params.id}`
    })
  },
  editIssue (id,params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}issue/${id}`,
      data: params
    })
  },
  deleteIssue (params) {
    return instance({
      method: 'delete',
      url: `${urlPrefix}issue/${params.id}`
    })
  },
  updateIssueStatus(id,params){
    return instance({
      method: 'post',
      url: `${urlPrefix}issue/handlestatus/${id}`,
      data: params
    })
  },
  updateIssuePriority(id,params){
    return instance({
      method: 'post',
      url: `${urlPrefix}issue/priority/${id}`,
      data: params
    })
  },
  updateIssueLevel(id,params){
    return instance({
      method: 'post',
      url: `${urlPrefix}issue/level/${id}`,
      data: params
    })
  },
  updateIssueHandler(id,params){
    return instance({
      method: 'post',
      url: `${urlPrefix}issue/handler/${id}`,
      data: params
    })
  },
  getOssAuth(params){
    return instance({
      method: 'get',
      url: `${urlPrefix}public/ossauth`,
      params: params
    })
  },
  getIssueLog(issueId,params){
    return instance({
      method: 'get',
      url: `${urlPrefix}issue/record/detail/${issueId}`,
      params: params
    })
  },
  addComment(issueId,params){
    return instance({
      method: 'post',
      url: `${urlPrefix}issue/comment/${issueId}`,
      data: params
    })
  },
}
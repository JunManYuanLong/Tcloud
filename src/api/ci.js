import instance from '@/api/index.js'
const urlPrefix = '/v1/'
export default {
  ciList (params) {
    return instance({
      method: 'get',
      url: `${urlPrefix}cidata/`,
      params: params
    })
  },
  getCiById(id){
    return instance({
      method: 'get',
      url: `${urlPrefix}cidata/description/${id}`,
    })
  },
	jobList(ciid,params) {
	  return instance({
	    method: 'get',
	    url: `${urlPrefix}cidata/job/${ciid}`,
	    params: params
	  })
	},
	updateCIList(params) {
	  return instance({
	    method: 'get',
	    url: `${urlPrefix}cidata/updatedata`,
	    params: params
	  })
	},

}

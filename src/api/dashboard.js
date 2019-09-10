import instance from '@/api/index.js'

const urlPrefix = '/v1/dashboard'

export default {
  getDashboard (data) {
    return instance({
      method: 'post',
      url: `${urlPrefix}/tester/work`,
      data: data
    })
  }
}

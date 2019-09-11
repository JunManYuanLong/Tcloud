import axios from 'axios'
import Cookies from 'js-cookie'
import store from '../store'
import moment from 'moment'
import axiosCancel from 'axios-cancel'
axiosCancel(axios, {
  debug: false // default
})
let instance = axios.create({
  baseURL: process.env.BASE_URL
})
instance.cancel = axios.cancel
/* const refresh = () => {
  const COOKIE_SUFFIX = process.env.COOKIE_SUFFIX
  const JWT_TOKEN = `JWT_TOKEN${COOKIE_SUFFIX}`
  let token = Cookies.get(JWT_TOKEN)
  let instance = axios.create({
    baseURL: process.env.BASE_URL,
    headers: {'Content-Type': 'application/json', 'Authorization': token}
  })
  return instance({
    method: 'get',
    url: `/v1/user/renewtoken`
  }).then(res => {
    store.commit('SET_TOKEN', res.data.data.token)
  }).catch(err => {
    console.log(err)
  })
} */

instance.interceptors.request.use(
  config => {
    console.log(config)
    /* let exp = store.state.login.exp || 0
    if (exp > 0) {
      if (0 < moment.unix(exp).diff(moment().utc(), 'days',true) && moment.unix(exp).diff(moment().utc(), 'days',true) < 1 ) {
        refresh()
      }
    } */
    const COOKIE_SUFFIX = process.env.COOKIE_SUFFIX
    const JWT_TOKEN = `JWT_TOKEN${COOKIE_SUFFIX}`
    if (Cookies.get(JWT_TOKEN)) {
      config.headers.Authorization = Cookies.get(JWT_TOKEN)
      config.headers.projectid = store.state.project.projectId || ''
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  response => {
    if(response.data.code === 410 || response.data.code === 412){
      window.location.hash = '#/login'
      return Promise.reject(response.data)
    }else if (response.data.code === 108) {
      window.location.hash = '#/403'
      return Promise.reject(response.data)
    }else if(response.data.code !== 0 ){
      return Promise.reject(response.data)
      // return response
    }else{
      return response
    }
  },
  error => {
    return Promise.reject(error)
  }
)

export default instance

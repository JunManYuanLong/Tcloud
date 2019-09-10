import jwtDecode from 'jwt-decode'
import Cookies from 'js-cookie'
import moment from 'moment'

const SET_TOKEN = 'SET_TOKEN'
const CLEAR_TOKEN = 'CLEAR_TOKEN'
const FLASH_TOKEN = 'FLASH_TOKEN'
const SET_ROLE = 'SET_ROLE'
const SET_PICTURE = 'SET_PICTURE'

const COOKIE_EXPIRED = process.env.COOKIE_EXPIRED
const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN
const COOKIE_SUFFIX = process.env.COOKIE_SUFFIX


const JWT_TOKEN = `JWT_TOKEN${COOKIE_SUFFIX}`

export default {
  state: {
    userid: 0,
    username: '',
    nickname: '',
    picture:'',
    exp: 0,
    role: [],
    JWT_TOKEN: ''
  },
  getters: {
    isLogin: state => {
      return state.JWT_TOKEN !== ''
    },
    isAdmin: state => {
      console.log('userstate',state.role)
      let admin = false
      state.role.forEach(item => {
        if(item.id == 1){
          admin = true
        }
      })
      console.log('admin',admin)
      return admin
    },
    userName:state => {
      return state.username
    },
    userRole:state=>{
      return state.role
    }
  },
  mutations: {
    [SET_TOKEN] (state, token) {
      let decoded = jwtDecode(token)
      let exp = decoded.exp || 0
      let EXPIRED = moment.unix(exp).diff(moment().utc(), 'days')
      Cookies.set(JWT_TOKEN, token, {
        expires: EXPIRED,
        domain: process.env.NODE_ENV === 'development' ? 'localhost' : COOKIE_DOMAIN
      })
      localStorage.setItem('jwtToken',token)
      state.userid = decoded.userid || 0
      state.username = decoded.username || ''
      state.nickname = decoded.nickname || ''
      state.picture = decoded.picture || ''
      state.exp = decoded.exp || 0
      state.role = decoded.role || []
      state.JWT_TOKEN = token
    },
    [CLEAR_TOKEN] (state) {
      state.userid = 0
      state.username = ''
      state.nickname = ''
      state.picture = ''
      state.exp = 0
      state.role = []
      state.JWT_TOKEN = ''
      localStorage.removeItem('jwtToken')
      Cookies.remove(JWT_TOKEN, process.env.NODE_ENV === 'development' ? {} : {domain: COOKIE_DOMAIN})
      //清除存储
      localStorage.removeItem('projectlist');
      localStorage.removeItem('curProject');
      localStorage.removeItem('projectId');
      localStorage.removeItem('userList');
      localStorage.removeItem('versionList');
      localStorage.removeItem('ossData');
    },
    [FLASH_TOKEN] (state) {
      let token = Cookies.get(JWT_TOKEN)
      console.log('JWT_TOKEN', JWT_TOKEN, process.env.COOKIE_SUFFIX, token)
      if (token && token !== state.JWT_TOKEN) {
        let decoded = jwtDecode(token)
        state.userid = decoded.userid || 0
        state.username = decoded.username || ''
        state.nickname = decoded.nickname || ''
        state.picture = decoded.picture || ''
        state.exp = decoded.exp || 0
        state.JWT_TOKEN = token || ''
      }
    },
    [SET_ROLE](state,role){
      state.role = role
    },
    [SET_PICTURE](state,picture){
      state.picture = picture
    }
  },
  actions: {
  }
}

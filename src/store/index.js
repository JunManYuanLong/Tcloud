import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import login from './modules/login'
import version from './modules/version'
import module from './modules/module'
import project from './modules/project'
import admin from './modules/admin'
import testing from './modules/testing'
import autotest from './modules/autotest'
import mail from './modules/mail'
Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'
export default new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    login,
    version,
    module,
    project,
    admin,
    testing,
    autotest,
    mail
  },
  plugins: debug ? [createLogger()] : []
})

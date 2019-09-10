// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import VeLine from 'v-charts/lib/line.common'
import VeBar from 'v-charts/lib/bar.common'
 

import { Timeline, Table, Tag,Steps,Progress,Spin } from 'ant-design-vue'
import IconFont from '@/components/IconFont.vue'
import '@/assets/iconfont/iconfont'

Vue.component('icon-font', IconFont)
Vue.use(Steps)
Vue.use(Timeline)
Vue.use(Table)
Vue.use(Tag)
Vue.use(Progress)

Vue.config.productionTip = false
// Vue.http.options.emulateJSON = true
// // //css
import './assets/css/font.css'
import './assets/css/common.scss'
import './assets/iconcss/iconfont.css'


// =======antd========
import 'ant-design-vue/lib/style/mixins/index.less';
import 'ant-design-vue/lib/style/core/iconfont.less';
import 'ant-design-vue/lib/style/core/motion.less';
import 'ant-design-vue/lib/steps/style/index.less'
import 'ant-design-vue/lib/timeline/style/index.less'
import 'ant-design-vue/lib/table/style/index.less'
import 'ant-design-vue/lib/tag/style/index.less'
import 'ant-design-vue/lib/pagination/style/index.less'
import 'ant-design-vue/lib/progress/style/index.less'
import 'ant-design-vue/lib/spin/style/index.less'

import 'element-ui/lib/theme-chalk/index.css'
import './assets/icon/iconfont.css'
import axios from './utils/axiosConfig'
// import VueClipboard from 'vue-clipboard2'
import pie from 'v-charts/lib/pie.common'
import contentmenu from 'v-contextmenu'
import 'v-contextmenu/dist/index.css'
import histogram from 'v-charts/lib/histogram.common'
import ring from 'v-charts/lib/ring.common'
// import './assets/styles/entirety.css'
import base from './utils/base'
import api from './utils/api'


// app.all('*',function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
//   res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
//
//   if (req.method == 'OPTIONS') {
//     res.send(200); /让options请求快速返回/
//   }
//   else {
//     next();
//   }
// });

Vue.config.productionTip = false;

Vue.prototype.$api = api;
Vue.prototype.$axios = axios;
Vue.component(pie.name, pie);
Vue.component(histogram.name, histogram);
Vue.component(ring.name, ring);
// Vue.component('codemirror', VueCodeMirror.codemirror);
// Vue.component('codemirror', codemirror);

// Vue.use(VueCodeMirror)
Vue.use(contentmenu);
// Vue.use(VueResource);
// Vue.use(VueClipboard);
// ================
Vue.use(base);
Vue.use(ElementUI, {size: 'mini'})
Vue.component(VeLine.name, VeLine)
Vue.component(VeBar.name, VeBar)

// Vue.use(VuePhoenix)
//回到顶部

router.beforeEach((to, from, next) => {
// 用户信息检测
  if (store.getters.isLogin || to.fullPath === '/login') {
    document.body.scrollTop = 0;
    next()
  } else {
    next('/login')
  }
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
})

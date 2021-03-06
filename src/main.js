// import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import axios from 'axios'
// import echarts from "echarts/lib/echarts"
// // 引入地图
// import 'echarts/lib/chart/map';
// // 引入折线图和饼状图
// import 'echarts/lib/chart/line';
// import 'echarts/lib/chart/bar';
// import "echarts/map/js/world.js";
import socket from 'socket.io-client'
import Lockr from 'lockr'
import Cookies from 'js-cookie'
import _ from 'lodash'
import moment from 'moment'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/display.css';
import routes from './routes'
import VueRouter from 'vue-router'
import store from './vuex/store'
import filter from './assets/js/filter'
import _g from './assets/js/global'
import NProgress from 'nprogress'

// import colorPicker from 'vue-color-picker'
import 'font-awesome/css/font-awesome.css'
import 'nprogress/nprogress.css'
import './assets/css/global.css'
import './assets/css/base.css'

axios.defaults.baseURL = HOST
axios.defaults.timeout = 1000 * 15
axios.defaults.headers.authKey = Lockr.get('authKey')
axios.defaults.headers.sessionId = Lockr.get('sessionId')
// console.log(axios.defaults.headers)
// axios.defaults.headers['Access-Control-Allow-Origin'] = '*'
// axios.defaults.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE'
// axios.defaults.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, authKey, sessionId'
axios.defaults.headers['Content-Type'] = 'application/json'
// axios.defaults.headers['Content-Type'] = 'application/json'
const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes
})
// var socketio = socket('http://' + document.domain + ':2120')

router.beforeEach((to, from, next) => {
  const hideLeft = to.meta.hideLeft
  store.dispatch('showLeftMenu', hideLeft)
  store.dispatch('showLoading', true)
  NProgress.start()
  next()
})

router.afterEach(transition => {
  NProgress.done()
})

// Vue.use(ElementUI)
Vue.use(ElementUI, { locale })
Vue.use(VueRouter)
// Vue.use(colorPicker)
window.Vue = Vue
window.router = router
window.store = store
window.HOST = HOST
window.axios = axios
window.socket = socket
// window.socketio = socketio
window._ = _
window.moment = moment
window.Lockr = Lockr
window.Cookies = Cookies
window._g = _g
window.pageSize = 15

const bus = new Vue()
window.bus = bus

new Vue({
  el: '#app',
  template: '<App/>',
  filters: filter,
  router,
  store,
  components: { App }
  // render: h => h(Login)
}).$mount('#app')

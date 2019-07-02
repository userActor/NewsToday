import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './styles/index.less'
import '../node_modules/nprogress/nprogress.css'
import axios from 'axios'
import store from './store'
import JSONBig from 'json-bigint'

Vue.config.productionTip = false
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0'
axios.defaults.transformResponse = [function (data) {
  return JSONBig.parse(data)
}]
// 请求发送拦截，把数据发送给后台之前做些什么......
axios.interceptors.request.use((request) => {
  // console.log(request)
  const userInfo = JSON.parse(window.localStorage.getItem('user_info'))
  if (userInfo) {
    // 统一设置用户鉴权信息token
    request.headers.Authorization = `Bearer ${userInfo.token}`
  }
  return request
}, (error) => {
  // Do something with request error
  return Promise.reject(error)
})
// 请求返回拦截，把数据返回到页面之前做些什么...
axios.interceptors.response.use((response) => {
  // console.log(response.data.data)
  // 统一设置响应数据
  return response.data.data
}, (error) => {
  console.dir(error)
  // 如果返回状态吗是401证明是非法用户，所以在响应阶段进行拦截
  if (error.response.status === 401) {
    window.localStorage.removeItem('user_info')
    router.push({
      name: 'login'
    })
  }
  return Promise.reject(error)
})
Vue.prototype.$http = axios
Vue.use(ElementUI)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

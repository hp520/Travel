// 项目入口
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUi from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'//由于后期优化在index导入cdnelement的css
import axios from 'axios'
import moment from 'moment'
import VueQillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQillEditor)
Vue.use(ElementUi)

// 关闭控制台生成提升信息
Vue.config.productionTip = false

// 优化一：将axios优化，写道vue的原型上面
Vue.prototype.$axios = axios
// 优化二：设置默认值
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// 优化三，配置默认   有bug 左侧边栏会消失  因为退出以后取不到token，token被删除了，token是变化的。默认值应该是一个不会变的。所以使用请求拦截器
// axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')

// 添加请求拦截器  优化三   axios文档
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么 拦截 给请求头加上Authorization，因为原先设置的在退出的时候token会被干掉
  // 导致侧边栏不会显示
  // console.log(config)
  if (config.url !== 'login') {
    config.headers.Authorization = localStorage.getItem('token')
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 响应拦截器    response就相当于res，就是在响应的时候拦截一次
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  // console.log('响应的数据', response)
  return response.data
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})

//  定义一个全局过滤器，处理事件

Vue.filter('time', function (value) {
  return moment(value * 1000).format('YYYY-MM-DD HH:mm:ss')
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

// 这个页面就是用来写路由的
import Vue from 'vue'
import VueRouter from 'vue-router'

// import Login from '../views/Login.vue'
// import Home from '../views/Home.vue'
// import Users from '../views/Users.vue'
// import Roles from '../views/Rolse.vue'
// import Rights from '../views/Rights.vue'
// import Goods from '../views/Goods.vue'
// import Categories from '../views/Categories.vue'
// import GoodsAdd from '../views/Goods-add.vue'

//  异步组件(按需加载)===>访问路由的时候才加载这个组件
// const Login = function () {
//   return import('../views/Login.vue')
// }
// 简写
const Login = () => import('../views/Login.vue')
const Home = () => import('../views/Home.vue')
const Users = () => import('../views/Users.vue')
const Roles = () => import('../views/Rolse.vue')
const Rights = () => import('../views/Rights.vue')
const Goods = () => import('../views/Goods.vue')
const Categories = () => import('../views/Categories.vue')
const GoodsAdd = () => import('../views/Goods-add.vue')

/* import axios from 'axios'
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
}) */

/* // 响应拦截器    response就相当于res，就是在响应的时候拦截一次
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  // console.log('响应的数据', response)
  return response.data
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
}) */

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      children: [
        {
          path: '/users',
          component: Users
        },
        {
          path: '/roles',
          component: Roles
        },
        {
          path: '/rights',
          component: Rights
        },
        {
          path: '/goods',
          component: Goods
        },
        {
          path: '/categories',
          component: Categories
        },
        {
          path: '/goods-add',
          component: GoodsAdd
        }
      ]
    }
  ]
})

// 注册前置的导航守卫
router.beforeEach((to, from, next) => {
  // console.log(to)// 去哪
  // console.log(from)// 从哪来
  // console.log(next)
  // 在浏览器的localStorage中取出token
  const token = localStorage.getItem('token')
  // 如果to的path是去/login或者有门票token就放行next()
  // 没有就去首页
  if (to.path === '/login' || token) {
    next()
  } else {
    next('/login')
  }
})

// 解决左侧导航连续点击两次的报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

// 导出router
export default router

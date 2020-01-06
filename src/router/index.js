import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'
import ElementUI from 'element-ui'
// import Home from '/views/home'
Vue.use(ElementUI)
Vue.use(VueRouter)
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn'
Vue.prototype.$http = axios
const routes = [
  // import xxx from xxx 模块化导入//完整导入
  // import (xxx)函数调用//按需导入
  // @符号表示绝对路径名地址
  // index.vue是默认索引文件
  { path: '/login', name: 'login', component: () => import('@/views/login') },
  { path: '/home', name: 'home', component: () => import('@/views/home') }
]
const router = new VueRouter({
  routes
})
// 配置全局前置路由守卫
router.beforeEach((to, from, next) => {
  let userinfo = window.sessionStorage.getItem('userinfo')
  if (!userinfo && to.path !== '/login') {
    return next('/login')
  }
  next()
})

export default router

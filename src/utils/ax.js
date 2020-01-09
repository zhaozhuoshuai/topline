import Vue from 'vue'
// 导入axios模块
import axios from 'axios'
import router from '@/router'
// 配置公共根地址(线上地址)
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/'
// 配置为Vue的(原型)继承成员
Vue.prototype.$http = axios
// 配置请求拦截器
axios.interceptors.request.use(function (config) {
  // 发送请求的相关逻辑
  // 借助config配置token
  let userinfo = window.sessionStorage.getItem('userinfo')
  // 判断token存在的话,在做配置
  if (userinfo) {
    // 转化内存里的JSON格式数据
    let token = JSON.parse(userinfo).token
    // 注意:token前面有'Bearer '(记得后面加空格) 的信息前缀
    // config对象.headers请求头.Authorization请求参数名称
    config.headers.Authorization = 'Bearer ' + token
  }
  return config
}, function (error) {
  return Promise.reject(error)
})
axios.interceptors.response.use(function (response) {
  // 正常响应处理
  return response
}, function (error) {
  // 非正常响应处理
  if (error.response.status === 401) {
    router.push('/login')
    return new Promise(function () {})
  }
  return Promise.reject(error)
})

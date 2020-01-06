import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 引入全局初始化模块
import '@/assets/css/global.css'
// 导入elementUI模块
import ElementUI from 'element-ui'
Vue.use(ElementUI)
Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

// 入口模块

import Vue from 'vue'
import App from './App.vue'

// 先找文件,没有就找目录
// 如果找到目录,优先加载目录中的 index
import router from './router/index'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

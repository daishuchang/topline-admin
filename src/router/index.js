// 路由模块

import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      name: 'home',
      path: '/',
      component: () => import('@/views/home')
    },

    {
      name: 'login',
      path: '/login',
      component: () => ('@/views/login')
    }
  ]
})

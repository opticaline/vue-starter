import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'

Vue.config.productionTip = false
Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  linkExactActiveClass: 'is-active',
  routes: routes
})

new Vue({ router }).$mount('#app')
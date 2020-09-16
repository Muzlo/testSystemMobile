import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
Vue.config.productionTip = false

import instance from './public/js/http';
import qs from 'qs';
import fastclick from 'fastclick';
import 'amfe-flexible';

fastclick.attach(document.body)
Vue.prototype.$axios = instance
Vue.prototype._qs = qs

import 'vue2-toast/lib/toast.css';
import Toast from 'vue2-toast';
Vue.use(Toast);

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

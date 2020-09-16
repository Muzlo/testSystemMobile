import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../views/login.vue'
import test from '../views/test.vue'
import result from '../views/result.vue'
import chooseTest from '../views/chooseTest.vue'
import answer from '../views/answer.vue'
Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'login',
    component: login,
    meta: {title:'用户登录'},
  },
  {
    path: '/chooseTest',
    name: 'chooseTest',
    component: chooseTest,
    meta: {title:'选择试卷'},
  },
  {
    path: '/test',
    name: 'test',
    component: test,
    meta: {title:'答题中'},
  },
  {
    path: '/result',
    name: 'result',
    component: result,
    meta: {title:'答题结果'},
  },
  {
    path: '/answer',
    name: 'answer',
    component: answer,
    meta: {title:'答案'},
  },
]

const router = new VueRouter({
  // mode: 'history',
  //base: process.env.BASE_URL,
  routes
})

export default router

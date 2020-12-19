import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/auth/Login'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: 'login',
    name: 'homepage'
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/home',
    name: 'home',
    component: Home
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

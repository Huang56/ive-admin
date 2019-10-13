import Vue from 'vue'
import Router from 'vue-router'

const Login = r => require(['../views/login'], r)

Vue.use(Router)
// 主路由
let routes = [
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: {
            requiresAuth: true,
            keepAlive: false
        },
    },
    {
        path: '*',
        redirect: '/login',
    }

]


let router = new Router({
    routes: routes,
  })

export default router
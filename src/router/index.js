import Vue from 'vue'
import Router from 'vue-router'

import routeConfig from './routeConfig' 
import Store from '@/store/index' // vuex

const Login = r => require(['../views/login'], r)
const Home = r => require(['../views/Home/Home'], r)
const Invalid = r => require(['../views/invalid'], r)
const HomePage = r => require(['../views/HomePage/homePage'], r)
const Page404 = r => require(['../views/HomePage/404'], r)
const Page500 = r => require(['../views/HomePage/500'], r)

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
        path: '/home',
        name: 'home',
        component: Home,
        children: [
            {
                path: '/',
                name: 'homePage',
                component: HomePage,
                meta: {
                    requiresAuth: true,
                    keepAlive: false
                },
            },
            {
                path: '404',
                name: 'Page404',
                component: Page404,
            },
            {
                path: '500',
                name: 'Page500',
                component: Page500,
            },
            {
                path: 'invalid',
                name: 'invalidpage',
                component: Invalid,
                meta: {
                    title: '登录失效'
                }
            },
            {
                path: '*',
                redirect: '404'
            }
        ]
    },
    {
        path: '*',
        redirect: '/login',
    }

]

// 子路由
let route = []
routeConfig.forEach(item => {
    if(item.children){
        route = route.concat(item.children)
    } else {
        route.push(item)
    }
})

routes[1].children.splice(1, 0, ...route); //放入主路由children

let router = new Router({
    routes: routes,
})

export default router
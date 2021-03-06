import {router as outStorageRouter} from '@/components/OutStorageManage/route'
import {router as taskManageRouter} from '@/components/TaskManage/route'
import {router as basicInfoRouter} from '@/components/basicInfo/route'

let routes = [
    {
        path: 'firstPage',
        name: 'firstPage',
        component: (r) => require(['@/components/FirstPage.vue'], r),
        meta: {
            title: '我的首页',
            keepAlive: true
        },
        icon: 'icon-basic-data',
    },
    //任务管理
    {
        path: 'taskManage',
        name: 'taskManage',
        meta: {
            title: '任务管理',
            keepAlive: true
        },
        icon: 'icon-custom',
        children: taskManageRouter
    },
    //出库管理
    {
        path: 'outStorageManage',
        name: 'outStorageManage',
        meta: {
            title: '出库管理',
            keepAlive: true
        },
        icon: 'icon-outbound',
        children: outStorageRouter
    },
    //出库管理
    {
        path: 'outStorageManage',
        name: 'outStorageManage',
        meta: {
            title: '出库管理',
            keepAlive: true
        },
        icon: 'icon-outbound',
        children: outStorageRouter
    },
    // 基础信息
    {
        path: 'basicInfo',
        name: 'basicInfo',
        meta: {
            title: '基础信息',
            keepAlive: true
        },
        icon: 'icon-basic-data',
        children: basicInfoRouter
    },
]


export default routes

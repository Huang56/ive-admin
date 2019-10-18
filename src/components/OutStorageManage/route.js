const router = [
  {
    path: 'orderPool',
    name: 'orderPool',
    component: (r) => require(['@/componments/outStorageManage/orderPool/index'], r),
    meta: {
      title: '订单池',
      keepAlive: true
    }
  },
  {
    path: 'orderAssign',
    name: 'orderAssign',
    component: (r) => require(['@/componments/outStorageManage/orderAssign/orderAssign'], r),
    meta: {
      title: '订单分配',
      keepAlive: true
    },
  },
  {
    path: 'orderAssignDetail',
    name: 'orderAssignDetail',
    component: (r) => require(['@/componments/outStorageManage/orderAssign/orderAssignDetail'], r),
    meta: {
      title: '订单分配',
      keepAlive: true,
      index: false
    },
  },
]

export { router }

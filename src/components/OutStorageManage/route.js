const router = [
  {
    path: 'orderPool',
    name: 'orderPool',
    component: (r) => require(['@/components/OutStorageManage/OrderPool/Index'], r),
    meta: {
      title: '订单池',
      keepAlive: true
    }
  },
  {
    path: 'orderAssign',
    name: 'orderAssign',
    component: (r) => require(['@/components/OutStorageManage/OrderAssign/OrderAssign'], r),
    meta: {
      title: '订单分配',
      keepAlive: true
    },
  },
  {
    path: 'orderAssignDetail',
    name: 'orderAssignDetail',
    component: (r) => require(['@/components/OutStorageManage/OrderAssign/OrderAssignDetail'], r),
    meta: {
      title: '订单分配',
      keepAlive: true,
      index: false
    },
  },
]

export { router }

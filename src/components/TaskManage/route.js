const router = [
  {
    path: 'taskConfig',
    name: 'taskConfig',
    component: (r) => require(['@/componments/taskManage/taskConfig/taskConfig'], r),
    meta: {
      title: '任务配置',
      keepAlive: true
    },

  },
  {
    path: 'taskList',
    name: 'taskList',
    component: (r) => require(['@/componments/taskManage/taskList/taskList'], r),
    meta: {
      title: '任务汇总',
      keepAlive: true
    },

  }

]

export { router }
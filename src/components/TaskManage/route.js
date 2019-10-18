const router = [
  {
    path: 'taskConfig',
    name: 'taskConfig',
    component: (r) => require(['@/components/TaskManage/TaskConfig/TaskConfig'], r),
    meta: {
      title: '任务配置',
      keepAlive: true
    },

  },
  {
    path: 'taskList',
    name: 'taskList',
    component: (r) => require(['@/components/TaskManage/TaskList/TaskList'], r),
    meta: {
      title: '任务汇总',
      keepAlive: true
    },

  }

]

export { router }
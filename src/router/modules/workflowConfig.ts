export default [
    {
      path: '/workflow-list',
      name: 'workflow-list',
      component: () => import('@/views/workflowConfiguration/workflowList.vue'),
    },
    {
      path: '/workflow-configuration',
      name: 'workflow-configuration',
      component: () => import('@/views/workflowConfiguration/workflowConfiguration.vue'),
    },
    {
      path: '/workflow-detail/:id',
      name: 'workflow-detail',
      component: () => import('@/views/workflowConfiguration/workflowConfiguration.vue'),
    }
]

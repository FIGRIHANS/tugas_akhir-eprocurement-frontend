export default [
  {
    path: '/workflow-list',
    name: 'workflow-list',
    component: () => import('@/views/workflowConfiguration/workflowList.vue'),
  },
  {
    path: '/workflow-configuration/:id',
    name: 'workflow-configuration',
    component: () => import('@/views/workflowConfiguration/workflowConfiguration.vue'),
  },
]

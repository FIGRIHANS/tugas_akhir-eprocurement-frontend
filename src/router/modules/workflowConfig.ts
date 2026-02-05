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
  {
    path: '/list-organization',
    name: 'list-organization',
    component: () =>
      import('@/views/workflowConfiguration/list-organization/ListOrganizationView.vue'),
  },
  {
    path: '/list-organization/structure/:id',
    name: 'organization-structure',
    component: () =>
      import('@/views/workflowConfiguration/list-organization/OrganizationStructureView.vue'),
  },
  {
    path: '/requisitioner-master',
    name: 'requisitioner-master',
    component: () =>
      import('@/views/workflowConfiguration/requisitioner-master/RequisitionerMasterListView.vue'),
  },
]

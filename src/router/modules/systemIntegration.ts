export default [
  {
    path: '/erp-integration',
    name: 'erp-integration',
    component: () => import('@/views/sytemIntegration/erpList.vue'),
  },
  {
    path: '/add-erp',
    name: 'add-erp',
    component: () => import('@/views/sytemIntegration/erpAddWrapper.vue'),
  },
  {
    path: '/erp-integration-detail/:id',
    name: 'erp-integration-detail',
    component: () => import('@/views/sytemIntegration/erpDetail.vue'),
  },
  {
    path: '/add-integration/:id',
    name: 'add-integration',
    component: () => import('@/views/sytemIntegration/integration/integrationAdd.vue'),
  },
  {
    path: '/detail-integration/:id/:definitionId',
    name: 'detail-integration',
    component: () => import('@/views/sytemIntegration/integration/integrationDetail.vue'),
  },
  {
    path: '/edit-integration/:id/:definitionId',
    name: 'edit-integration',
    component: () => import('@/views/sytemIntegration/integration/integrationEdit.vue'),
  },
]

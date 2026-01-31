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
    path: '/add-integration',
    name: 'add-integration',
    component: () => import('@/views/sytemIntegration/integration/integrationAdd.vue'),
  },
  {
    path: '/detail-integration/:id',
    name: 'detail-integration',
    component: () => import('@/views/sytemIntegration/integration/integrationDetail.vue'),
  },
  {
    path: '/edit-integration/:id',
    name: 'edit-integration',
    component: () => import('@/views/sytemIntegration/integration/integrationEdit.vue'),
  },
]

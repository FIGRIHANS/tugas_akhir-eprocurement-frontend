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
]

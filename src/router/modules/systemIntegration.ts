export default [
    {
      path: '/erp-integratione',
      name: 'erp-integration',
      component: () => import('@/views/sytemIntegration/erpList.vue'),
    },
    {
       path: '/add-erp',
       name: 'add-erp',
       component: () => import('@/views/sytemIntegration/erpAddWrapper.vue'),
    },
]
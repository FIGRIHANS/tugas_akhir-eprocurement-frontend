export default [
  {
    path: '/invoice-configuration',
    name: 'invoice-configuration',
    component: () => import('@/views/sytemConfiguration/invoiceConfigurationList.vue'),
  },
  {
    path: '/add-invoice-configuration',
    name: 'add-invoice-configuration',
    component: () => import('@/views/sytemConfiguration/invoiceConfigurationAdd.vue'),
  },
  {
    path: '/invoice-configuration-detail/:id',
    name: 'invoice-configuration-detail',
    component: () => import('@/views/sytemConfiguration/invoiceConfigurationDetail.vue'),
  },
  {
    path: '/log-activity',
    name: 'log-activity',
    component: () => import('@/views/sytemConfiguration/logActivityList.vue'),
  },
  {
    path: '/add-integration/:id',
    name: 'add-integration-invoice',
    component: () => import('@/views/sytemConfiguration/integration/integrationAdd.vue'),
  },
  {
    path: '/detail-integration/:id/:definitionId',
    name: 'detail-integration-invoice',
    component: () => import('@/views/sytemConfiguration/integration/integrationDetail.vue'),
  },
  {
    path: '/edit-integration/:id/:definitionId',
    name: 'edit-integration-invoice',
    component: () => import('@/views/sytemConfiguration/integration/integrationEdit.vue'),
  },
]

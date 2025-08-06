export default [
  {
    path: '/tender/central',
    name: 'tenderCentral',
    component: () => import('@/views/prCentralMonitoring/prCentralMonitoring.vue')
  },
  // {
  //   path: '/tender/report',
  //   name: 'tenderReport',
  //   // component: () => import('@/views/invoiceVerification/InvoiceVerification.vue')
  // },
  {
    path: '/tender/create',
    name: 'tenderCreate',
    component: () => import('@/views/tenderCreate/TenderCreate.vue')
  }
]

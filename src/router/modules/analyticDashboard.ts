export default [
  {
    path: '/scorecard-performance',
    name: 'scorecard-performance',
    component: () => import('@/views/scorecardPerformance/ScorecardPerformance.vue'),
  },
  // {
  //   path: '/planning-analytic',
  //   name: 'planning-analytic',
  //   component: () => import('@/views/EmptyState.vue'),
  // },
  {
    path: '/invoice-analytic',
    name: 'invoiceAnalytic',
    component: () => import('@/views/invoiceAnalytic/InvoiceAnalytic.vue'),
  },
  {
    path: '/tax-analytic',
    name: 'taxAnalytic',
    component: () => import('@/views/taxAnalytic/taxAnalytic.vue'),
  },
  // {
  //   path: '/tender-analytic',
  //   name: 'tender-analytic',
  //   component: () => import('@/views/tenderAnalytic/TenderAnalytic.vue'),
  // },
  // {
  //   path: '/vendor-performance',
  //   name: 'vendor-performance',
  //   component: () => import('@/views/EmptyState.vue'),
  // },
  // {
  //   path: '/transportation-analytic',
  //   name: 'transportation-analytic',
  //   component: () => import('@/views/transportationAnalytic/TransportationAnalytic.vue'),
  // },
  // {
  //   path: '/contract-analytic',
  //   name: 'contractAnalytic',
  //   component: () => import('@/views/contractAnalytic/ContractAnalytic.vue'),
  // },
]

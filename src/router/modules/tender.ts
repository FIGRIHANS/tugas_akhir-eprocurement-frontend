export default [
  {
    path: '/tender/central',
    name: 'tenderCentral',
    component: () => import('@/views/prCentralMonitoring/prCentralMonitoring.vue'),
  },
  {
    path: '/tender/create',
    name: 'tenderCreate',
    component: () => import('@/views/tenderCreate/TenderCreate.vue'),
  },
  {
    path: '/tender/report',
    name: 'tenderReportList',
    component: () => import('@/views/tenderReportList/TenderReportList.vue'),
  },
  {
    path: '/tender/submission',
    name: 'tenderSubmission',
    component: () => import('@/views/tenderSubmission/TenderSubmission.vue'),
  },
  {
    path: '/tender/report/negotiation',
    name: 'tenderReportNegotiation',
    component: () => import('@/views/tenderReportNegotiation/TenderReportNegotiation.vue'),
  },
  {
    path: '/tender/negotiation',
    name: 'tenderNegotiation',
    component: () => import('@/views/tenderNegotiation/TenderNegotiation.vue'),
  },
  {
    path: '/tender/awarding',
    name: 'tenderAwarding',
    component: () => import('@/views/vendorAwarding/vendorAwarding.vue'),
  },
  {
    path: '/tender/evaluation',
    name: 'tenderEvaluation',
    component: () => import('@/views/tenderEvaluation/TenderEvaluation.vue'),
  },
]

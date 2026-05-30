export default [
  {
    path: '/vat-in-reconciliation',
    name: 'vatInReconciliation',
    component: () => import('@/views/taxReconciliation/VatInReconciliation.vue'),
  },
  {
    path: '/vat-in-reconciliation/pj-submit',
    name: 'vatPjSubmitFromInvoice',
    component: () => import('@/views/taxReconciliation/VatPjSubmitFromInvoice.vue'),
  },
  {
    path: '/vat-in-reconciliation/:id',
    name: 'vatInReconciliationDetail',
    component: () => import('@/views/taxReconciliation/VatInReconciliationDetail.vue'),
  },
  {
    path: '/vat-out-reconciliation',
    name: 'vatOutReconciliation',
    component: () => import('@/views/taxReconciliation/VatOutReconciliation.vue'),
  },
  {
    path: '/vat-out-reconciliation/create',
    name: 'vatOutReconciliationCreate',
    component: () => import('@/views/taxReconciliation/VatOutCreate.vue'),
  },
  {
    path: '/vat-out-reconciliation/detail/:id',
    name: 'vatOutReconciliationDetail',
    component: () => import('@/views/taxReconciliation/VatOutDetail.vue'),
    props: true,
  },
  {
    path: '/wht-reconciliation',
    name: 'whtReconciliation',
    component: () => import('@/views/taxReconciliation/WhtReconciliation.vue'),
  },
  {
    path: '/wht-unifikasi',
    name: 'whtUnifikasi',
    component: () => import('@/views/taxReconciliation/WhtReconciliation.vue'),
  },
  {
    path: '/wht-unifikasi/create',
    name: 'whtUnifikasiCreate',
    component: () => import('@/views/taxReconciliation/BpuCreate.vue'),
  },
  {
    path: '/wht-unifikasi/detail/:id',
    name: 'whtUnifikasiDetail',
    component: () => import('@/views/taxReconciliation/BpuDetail.vue'),
    props: true,
  },
  {
    path: '/wht-pasal-21',
    name: 'whtPasal21',
    component: () => import('@/views/taxReconciliation/WhtReconciliation.vue'),
  },
  {
    path: '/wht-pasal-21/create',
    name: 'whtPasal21Create',
    component: () => import('@/views/taxReconciliation/Pph21Create.vue'),
  },
  {
    path: '/wht-pasal-21/detail/:id',
    name: 'whtPasal21Detail',
    component: () => import('@/views/taxReconciliation/Pph21Detail.vue'),
    props: true,
  },
]

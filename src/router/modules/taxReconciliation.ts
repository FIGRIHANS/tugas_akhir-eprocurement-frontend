export default [
  {
    path: '/vat-reconciliation',
    name: 'vatReconciliation',
    component: () => import('@/views/taxReconciliation/VatReconciliation.vue'),
  },
  {
    path: '/vat-reconciliation/:id',
    name: 'vatReconciliationDetail',
    component: () => import('@/views/taxReconciliation/VatReconciliationDetail.vue'),
  },
  {
    path: '/wht-unifikasi',
    name: 'whtUnifikasi',
    component: () => import('@/views/taxReconciliation/WhtUnifikasi.vue'),
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
    component: () => import('@/views/taxReconciliation/WhtPasal21.vue'),
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

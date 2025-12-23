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
    path: '/wht-reconciliation',
    name: 'whtReconciliation',
    component: () => import('@/views/taxReconciliation/WhtReconciliation.vue'),
  },
]

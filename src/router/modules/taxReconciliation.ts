export default [
  {
    path: '/vat-reconciliation',
    name: 'vatReconciliation',
    component: () => import('@/views/taxReconciliation/VatReconciliation.vue'),
  },
  {
    path: '/wht-reconciliation',
    name: 'whtReconciliation',
    component: () => import('@/views/taxReconciliation/WhtReconciliation.vue'),
  },
]

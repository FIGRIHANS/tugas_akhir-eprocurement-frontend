export default [
  {
    path: '/receiving-confirmation',
    name: 'receivingConfirmation',
    component: () => import('@/views/receivingConfirmation/ReceivingConfirmation.vue'),
  },
  {
    path: '/receiving-confirmation-list',
    name: 'receivingConfirmationList',
    component: () => import('@/views/receivingConfirmation/ReceivingConfirmationList.vue'),
  },
  {
    path: '/receiving-confirmation/:id',
    name: 'receivingConfirmationDetail',
    component: () => import('@/views/receivingConfirmation/ReceivingConfirmationDetail.vue'),
  },
]

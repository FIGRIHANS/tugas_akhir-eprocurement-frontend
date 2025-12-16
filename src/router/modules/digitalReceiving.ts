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
    path: '/receiving-confirmation/create',
    name: 'receivingConfirmationCreate',
    component: () => import('@/views/receivingConfirmation/ReceivingConfirmationCreate.vue'),
  },
]

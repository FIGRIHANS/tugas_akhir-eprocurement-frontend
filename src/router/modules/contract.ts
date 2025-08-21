export default [
  // {
  //   path: '/contract',
  //   name: 'contractList',
  //   // component: () => import('@/views/prCentralMonitoring/prCentralMonitoring.vue'),
  // },
  {
    path: '/contract/create',
    name: 'contractCreate',
    component: () => import('@/views/contractCreate/ContractCreate.vue'),
  }
]

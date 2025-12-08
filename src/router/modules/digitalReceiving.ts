export default [
  {
    path: '/dispatch-list',
    name: 'dispatchList',
    component: () => import('@/views/dispatchList/DispatchList.vue'),
  },
  {
    path: '/dispatch-list/:id',
    name: 'dispatchListDetail',
    component: () => import('@/views/dispatchList/DispatchListDetail.vue'),
  },
]

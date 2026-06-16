export default [
  {
    path: '/mock-sap-list',
    name: 'mockSapList',
    component: () => import('@/views/mockSap/MockSapList.vue'),
    meta: {
      pageTitle: 'Purchase Orders List',
    },
  },
  {
    path: '/mock-sap/detail/:poNumber',
    name: 'mockSapDetail',
    component: () => import('@/views/mockSap/MockSapDetail.vue'),
    meta: {
      pageTitle: 'Purchase Order Detail',
    },
  },
]


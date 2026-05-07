export default [
  {
    path: '/goods-receipt-list',
    name: 'goodsReceiptList',
    component: () => import('@/views/goodsReceipt/GoodsReceiptList.vue'),
    meta: { pageTitle: 'Goods Receipts' },
  },
  {
    path: '/goods-receipt/detail/:grId',
    name: 'goodsReceiptListDetail',
    component: () => import('@/views/goodsReceipt/GoodsReceiptDetail.vue'),
    meta: { pageTitle: 'Goods Receipt Detail' },
  },
]

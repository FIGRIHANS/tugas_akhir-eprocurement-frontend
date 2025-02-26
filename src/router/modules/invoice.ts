export default [
  {
    path: '/invoice',
    name: 'invoice',
    redirect: { name: 'invoice-list' },
    component: () => import('@/views/invoice/InvoiceWrapper.vue'),
    children: [
      {
        path: 'list',
        name: 'invoice-list',
        component: () => import('@/components/views/invoice/InvoiceList.vue'),
      },
    ],
  },
]

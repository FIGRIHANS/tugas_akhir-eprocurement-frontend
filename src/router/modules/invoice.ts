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
        component: () => import('@/views/invoice/InvoiceWrapper/InvoiceList.vue'),
      },
    ],
  },
  {
    path: '/invoice/add',
    name: 'invoiceAdd',
    redirect: { name: 'invoice-add' },
    component: () => import('@/views/invoice/InvoiceAddWrapper.vue'),
    children: [
      {
        path: 'list',
        name: 'invoice-add',
        component: () => import('@/views/invoice/InvoiceAddWrapper/InvoiceData.vue'),
      },
    ],
  },
]

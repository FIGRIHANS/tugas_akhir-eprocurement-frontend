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
    component: () => import('@/views/invoice/InvoiceAddWrapper.vue'),
  },
  {
    path: '/invoice/verification',
    name: 'invoiceVerification',
    component: () => import('@/views/invoiceVerification/InvoiceVerification.vue'),
  },
  {
    path: '/invoice/verification/noPo',
    name: 'invoiceVerificationNoPo',
    component: () => import('@/views/invoiceVerification/InvoiceVerification.vue'),
  },
  {
    path: '/invoice/approval',
    name: 'invoiceApproval',
    component: () => import('@/views/invoiceApproval/InvoiceApproval.vue'),
  },
  {
    path: '/invoice/detail',
    name: 'invoiceDetail',
    component: () => import('@/views/InvoiceDetail/InvoiceDetail.vue'),
  },
  {
    path: '/invoice/detail/edit',
    name: 'invoiceDetailEdit',
    component: () => import('@/views/invoiceDetailEdit/InvoiceDetailEdit.vue'),
  },
  {
    path: '/invoice/vendor/list/submission',
    name: 'vendor-list-submission',
    component: () => import('@/views/vendorListSubmission/vendorListSubmission.vue'),
  },
]

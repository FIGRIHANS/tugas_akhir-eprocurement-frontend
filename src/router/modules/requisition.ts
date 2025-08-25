export default [
  {
    path: '/requisition',
    name: 'requisition',
    redirect: { name: 'invoice-list' },
    component: () => import('@/views/requisition/InvoiceWrapper.vue'),
    children: [
      {
        path: 'list',
        name: 'requissionList',
        component: () => import('@/views/requisition/InvoiceWrapper/InvoiceList.vue'),
      },
    ],
  },
  {
    path: '/requisition/add',
    name: 'requisitionAdd',
    component: () => import('@/views/requisition/InvoiceAddWrapper.vue'),
  },
  {
    path: '/requisition/edit',
    name: 'requisitionEdit',
    component: () => import('@/views/requisition/InvoiceAddWrapper.vue'),
  },
  //   {
  //     path: '/invoice/verification',
  //     name: 'invoiceVerification',
  //     component: () => import('@/views/invoiceVerification/InvoiceVerification.vue'),
  //   },
  //   {
  //     path: '/invoice/verification/noPo',
  //     name: 'invoiceVerificationNoPo',
  //     component: () => import('@/views/invoiceVerification/InvoiceVerification.vue'),
  //   },
  //   {
  //     path: '/invoice/approval',
  //     name: 'invoiceApproval',
  //     component: () => import('@/views/invoiceApproval/InvoiceApproval.vue'),
  //   },
  //   {
  //     path: '/invoice/detail',
  //     name: 'invoiceDetail',
  //     component: () => import('@/views/InvoiceDetail/InvoiceDetail.vue'),
  //   },
  //   {
  //     path: '/invoice/detail/noPo',
  //     name: 'invoiceDetailNonPo',
  //     component: () => import('@/views/InvoiceDetail/InvoiceDetail.vue'),
  //   },
  //   {
  //     path: '/invoice/detail/edit',
  //     name: 'invoiceDetailEdit',
  //     component: () => import('@/views/invoiceDetailEdit/InvoiceDetailEdit.vue'),
  //   },
  //   {
  //     path: '/invoice/vendor/list/submission',
  //     name: 'vendor-list-submission',
  //     component: () => import('@/views/vendorListSubmission/vendorListSubmission.vue'),
  //   },
]

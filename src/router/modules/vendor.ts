export default [
  {
    path: '/vendor/master',
    name: 'vendor-master',
    component: () => import('@/views/vendor/master/VendorMaster.vue'),
  },
  {
    path: '/vendor/master/:id',
    name: 'vendor-master-detail',
    component: () => import('@/views/vendor/master/VendorMasterDetail.vue'),
  },
  {
    path: '/vendor/verification',
    name: 'vendor-verification',
    component: () => import('@/views/vendor/verification/VendorVerification.vue'),
  },
  {
    path: '/vendor/verification/:id',
    name: 'vendor-verification-detail',
    component: () => import('@/views/vendor/verification/VendorVerificationDetail.vue'),
  },
  {
    path: '/vendor/approval',
    name: 'vendor-approval',
    component: () => import('@/views/vendor/approval/VendorApproval.vue'),
  },
  {
    path: '/vendor/approval/:id',
    name: 'vendor-approval-detail',
    component: () => import('@/views/vendor/approval/VendorApprovalDetail.vue'),
  },
  {
    path: '/vendor/blacklist',
    name: 'vendor-blacklist',
    component: () => import('@/views/vendor/blacklist/VendorBlacklistWrapper.vue'),
    redirect: { name: 'vendor-pending-blacklist' },
    children: [
      {
        path: 'pending',
        name: 'vendor-pending-blacklist',
        component: () => import('@/views/vendor/blacklist/VendorPendingBlacklist.vue'),
      },
      {
        path: 'list',
        name: 'vendor-blacklist-list',
        component: () => import('@/views/vendor/blacklist/VendorBlacklist.vue'),
      },
    ],
  },
  {
    path: '/vendor/information/:id',
    name: 'vendor-company-information',
    component: () => import('@/views/vendor/companyInformation/VendorCompanyInformation.vue'),
  },
  {
    path: '/vendor/awarding',
    name: 'vendor-awarding',
    component: () => import('@/views/vendorAwarding/vendorAwarding.vue'),
  },
]

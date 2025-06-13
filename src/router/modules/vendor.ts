export default [
  {
    path: '/vendor/master',
    name: 'vendor-master',
    component: () => import('@/views/vendor/vendorMaster/VendorMaster.vue'),
  },
  {
    path: '/vendor/master/:id',
    name: 'vendor-master-detail',
    component: () => import('@/views/vendor/vendorMaster/VendorMasterDetail.vue'),
  },
  {
    path: '/vendor/verification',
    name: 'vendor-verification',
    component: () => import('@/views/vendor/vendorVerification/VendorVerification.vue'),
  },
  {
    path: '/vendor/verification/:id',
    name: 'vendor-verification-detail',
    component: () => import('@/views/vendor/vendorDetail/VendorDetail.vue'),
  },
  {
    path: '/vendor/approval',
    name: 'vendor-approval',
    component: () => import('@/views/vendor/vendorVerification/VendorVerification.vue'),
  },
  {
    path: '/vendor/approval/:id',
    name: 'vendor-approval-detail',
    component: () => import('@/views/vendor/vendorDetail/VendorDetail.vue'),
  },
  {
    path: '/vendor/blacklist',
    name: 'vendor-blacklist',
    component: () => import('@/views/vendor/vendorBlacklist/VendorBlacklistWrapper.vue'),
    redirect: { name: 'vendor-pending-blacklist' },
    children: [
      {
        path: 'pending',
        name: 'vendor-pending-blacklist',
        component: () => import('@/views/vendor/vendorBlacklist/VendorPendingBlacklist.vue'),
      },
      {
        path: 'list',
        name: 'vendor-blacklist-list',
        component: () => import('@/views/vendor/vendorBlacklist/VendorBlacklist.vue'),
      },
    ],
  },
]

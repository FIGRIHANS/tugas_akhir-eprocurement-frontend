export default [
  {
    path: '/vendor-master',
    name: 'vendor-master',
    component: () => import('@/views/vendor/VendorMaster.vue'),
  },
  {
    path: '/vendor-blacklist',
    name: 'vendor-blacklist',
    component: () => import('@/views/vendor/VendorBlacklist.vue'),
  },
]

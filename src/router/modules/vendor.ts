export default [
  {
    path: '/vendor-master',
    name: 'vendor-master',
    component: () => import('@/views/vendor/vendorMaster/VendorMaster.vue'),
    redirect:{name:'information'},
    children:[
      {
        path:'information',
        name:'information',
        component: ()=> import('@/views/vendor/vendorMaster/VendorInformation.vue')
      },
      {
        path:'list',
        name:'vendor-list',
        component: ()=> import('@/views/vendor/vendorMaster/VendorList.vue')
      },
      {
        path:'dashboard',
        name:'dashboard',
        component: ()=> import('@/views/vendor/vendorMaster/VendorDashboard.vue')
      },
    ]
  },
  {
    path: '/vendor-blacklist',
    name: 'vendor-blacklist',
    component: () => import('@/views/vendor/VendorBlacklist.vue'),

  },
]

export default [
  {
    path: '/vendor-master',
    name: 'vendor-master',
    component: () => import('@/views/vendor/VendorMaster.vue'),
    redirect:{name:'information'},
    children:[
      {
        path:'information',
        name:'information',
        component: ()=> import('@/views/vendor/components/VendorInformation.vue')
      },
      {
        path:'list',
        name:'vendor-list',
        component: ()=> import('@/views/vendor/components/VendorList.vue')
      },
      {
        path:'dashboard',
        name:'dashboard',
        component: ()=> import('@/views/vendor/components/VendorDashboard.vue')
      },
    ]
  },
  {
    path: '/vendor-blacklist',
    name: 'vendor-blacklist',
    component: () => import('@/views/vendor/VendorBlacklist.vue'),

  },
]

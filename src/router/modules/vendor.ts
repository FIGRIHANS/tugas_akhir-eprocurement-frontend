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
    path:'/vendor-master/:id/verification',
    name:'verification',
    component: ()=> import('@/views/vendor/vendorMaster/vendorDetail/VendorDetail.vue'),
    redirect:{name:'summary-information'},
    children:[
      {
        path:'summary-information',
        name:'summary-information',
        component: ()=> import('@/views/vendor/vendorMaster/vendorDetail/VendorSummary.vue')
      },
      {
        path:'data-administrasi',
        name:'data-administrasi',
        component: ()=> import('@/views/vendor/vendorMaster/vendorDetail/VendorAdministrasi.vue')
      },
      {
        path:'data-izin-usaha',
        name:'data-izin-usaha',
        component: ()=> import('@/views/vendor/vendorMaster/vendorDetail/VendorIzinUsaha.vue')
      },
      {
        path:'data-informasi-pembayaran',
        name:'data-informasi-pembayaran',
        component: ()=> import('@/views/vendor/vendorMaster/vendorDetail/VendorInformasiPembayaran.vue')
      },
      {
        path:'data-akta-pendirian',
        name:'data-akta-pendirian',
        component: ()=> import('@/views/vendor/vendorMaster/vendorDetail/VendorAktaPendirian.vue')
      },
      {
        path:'data-perlengkapan',
        name:'data-perlengkapan',
        component: ()=> import('@/views/vendor/vendorMaster/vendorDetail/VendorPerlengkapan.vue')
      },
      {
        path:'data-pengalaman',
        name:'data-pengalaman',
        component: ()=> import('@/views/vendor/vendorMaster/vendorDetail/VendorPengalaman.vue')
      },
      {
        path:'data-tenaga-ahli',
        name:'data-tenaga-ahli',
        component: ()=> import('@/views/vendor/vendorMaster/vendorDetail/VendorTenagaAhli.vue')
      },
      {
        path:'dokumen-lainnya',
        name:'dokumen-lainnya',
        component: ()=> import('@/views/vendor/vendorMaster/vendorDetail/VendorDokumenLainnya.vue')
      },
    ]
  },
  {
    path: '/vendor-blacklist',
    name: 'vendor-blacklist',
    component: () => import('@/views/vendor/VendorBlacklist.vue'),

  },
  {
    path:'/vendor-approval',
    name:'vendor-approval',
    component: ()=> import('@/views/vendor/vendorApproval/VendorApproval.vue'),
  }
]

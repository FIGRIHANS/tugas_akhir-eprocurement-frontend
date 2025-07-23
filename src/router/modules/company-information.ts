export default [
  {
    path: "/payment-information",
    name: "payment-information-list",
    component: () => import("@/views/companyInformation/payment-information/PaymentInfoListView.vue")
  },
  {
    path: "/bussines-license-data",
    name: "bussiness-license-data-list",
    component: () => import("@/views/companyInformation/bussiness-license-data/BussinesLicenseDataListView.vue")
  },
  {
    path: "/company-deed-data",
    name: "company-deed-data-list",
    component: () => import("@/views/companyInformation/company-deed-data/CompanyDeedDataView.vue")
  }
];

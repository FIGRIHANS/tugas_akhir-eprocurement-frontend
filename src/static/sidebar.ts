export interface ISidebarMenu {
  id: string
  title: string
  icon: string
  to?: string
  child: IChildSidebarMenu[]
}

export interface IChildSidebarMenu {
  id: string
  title: string
  to?: string
}

export default [
  // {
  //   id: 'dashboard',
  //   title: 'Beranda',
  //   icon: 'element-11',
  //   to: 'dashboard',
  //   child: [],
  // },
  {
    id: 'company-information',
    title: 'Company Information',
    icon: 'user',
    to: 'company information',
    child: [],
  },
  {
    id: 'analytic-dashboard',
    title: 'Analytic Dashboard',
    icon: 'rocket',
    child: [
      {
        id: 'scorecard-performance',
        title: 'Scorecard Performance',
        to: 'scorecard-performance',
      },
      {
        id: 'invoiceAnalytic',
        title: 'Invoice Analytic',
        to: 'invoiceAnalytic',
      },
    ],
  },
  // {
  //   id: 'requisition',
  //   title: 'Requisition',
  //   icon: 'rocket',
  //   child: [
  //     {
  //       id: 'requission-list',
  //       title: 'Requisition List',
  //       to: 'requissionList',
  //     },
  //     {
  //       id: 'requission-add',
  //       title: 'Create Requisition',
  //       to: 'requisitionAdd',
  //     },
  //   ],
  // },
  {
    id: 'vendor-management',
    title: 'Vendor Management',
    icon: 'users',
    child: [
      {
        id: 'vendor-master',
        title: 'Vendor Master',
        to: 'vendor-master',
      },
      {
        id: 'vendor-verification',
        title: 'Vendor Verification',
        to: 'vendor-verification',
      },
      {
        id: 'vendor-approval',
        title: 'Vendor Approval',
        to: 'vendor-approval',
      },
      {
        id: 'vendor-blacklist',
        title: 'Vendor Blacklist',
        to: 'vendor-blacklist',
      },
    ],
  },

  // {
  //   id: 'e-procurement-report',
  //   title: 'Laporan e-Procurement',
  //   icon: 'printer',
  //   child: [
  //     {
  //       id: 'e-procurement-report-1',
  //       title: 'E Procuremen Report 1',
  //     },
  //   ],
  // },
  // {
  //   id: 'requisition-master',
  //   title: 'Master Requisition',
  //   icon: 'data',
  //   child: [
  //     {
  //       id: 'requisition-master-1',
  //       title: 'Requisition Master 1',
  //     },
  //   ],
  // },
  // {
  //   id: 'monitoring',
  //   title: 'Monitoring',
  //   icon: 'chart-line-star',
  //   child: [
  //     {
  //       id: 'monitoring-1',
  //       title: 'Monitoring 1',
  //     },
  //   ],
  // },
  // {
  //   id: 'approval',
  //   title: 'Approval',
  //   icon: 'shield-tick',
  //   child: [
  //     {
  //       id: 'vendor-approval',
  //       title: 'Approval Verifikasi Vendor',
  //       to: 'vendor-approval',
  //     },
  //   ],
  // },
  // {
  //   id: 'e-catalog',
  //   title: 'Lihat e-Catalog',
  //   icon: 'menu',
  //   child: [],
  // },
  // {
  //   id: 'procurement-master',
  //   title: 'Master Procurement',
  //   icon: 'data',
  //   child: [
  //     {
  //       id: 'procurement-master-1',
  //       title: 'Procutement Master 1',
  //     },
  //   ],
  // },
  {
    id: 'e-invoice',
    title: 'Invoice',
    icon: 'bill',
    child: [
      {
        id: 'invoice-list',
        title: 'Invoice PO',
        to: 'invoice',
      },
      {
        id: 'invoice-list-non-po',
        title: 'Invoice Non PO',
        to: 'invoice-list-non-po',
      },
      {
        id: 'invoice-verification',
        title: 'Invoice Verification',
        to: 'invoiceVerification',
      },
      {
        id: 'invoice-verification-no-po',
        title: 'Invoice Verification Non PO',
        to: 'invoiceVerificationNoPo',
      },
      {
        id: 'invoice-approval',
        title: 'Invoice Approval',
        to: 'invoiceApproval',
      },
      {
        id: 'invoice-approval-no-po',
        title: 'Invoice Approval Non PO',
        to: 'invoiceApprovalNonPo',
      },
      {
        id: 'ftp-invoice-integration',
        title: 'FTP Invoice Integration',
        to: 'ftpInvoiceIntegration',
      },
      {
        id: 'email-invoice-integration',
        title: 'Email Invoice Integration',
        to: 'emailInvoiceIntegration',
      },
      {
        id: 'invoice-type',
        title: 'Invoice Type',
        to: 'invoice-type',
      },
      // {
      //   id: 'schedule-payment',
      //   title: 'Schedule Payment',
      // },
    ],
  },
  {
    id: 'digital-receiving-confirmation',
    title: 'Digital Receiving Confirmation',
    icon: 'package',
    child: [
      {
        id: 'dispatch-list',
        title: 'Dispatch List',
        to: 'dispatchList',
      },
    ],
  },
  {
    id: 'tax-reconciliation',
    title: 'Tax Reconciliation',
    icon: 'calculator',
    child: [
      {
        id: 'vat-reconciliation',
        title: 'VAT Reconciliation',
        to: 'vatReconciliation',
      },
      {
        id: 'wht-reconciliation',
        title: 'WHT Reconciliation',
        to: 'whtReconciliation',
      },
    ],
  },
  // {
  //   id: 'userManagement',
  //   title: 'User Management',
  //   icon: 'user',
  //   child: [
  //     {
  //       id: 'List User',
  //       title: 'List User',
  //       to: 'user-management-user-list',
  //     },
  //     {
  //       id: 'Master Profile',
  //       title: 'Master Profile',
  //       to: 'user-management-master-profile',
  //     },
  //     {
  //       id: 'Master Role',
  //       title: 'Master Role',
  //       to: 'user-management-master-role',
  //     },
  //     {
  //       id: 'Master Employee',
  //       title: 'Master Employee',
  //       to: 'user-management-master-employee',
  //     },
  //     {
  //       id: 'Report User Authorization',
  //       title: 'Report User Authorization',
  //       to: 'user-management-report-authorization',
  //     },
  //   ],
  // },
  // {
  //   id: 'Workflow Configuration',
  //   title: 'Workflow Configuration',
  //   icon: 'check',
  //   to: 'workflow-configuration',
  //   child: [],
  // },
]

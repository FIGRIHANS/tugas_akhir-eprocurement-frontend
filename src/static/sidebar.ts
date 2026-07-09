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

const sidebarMenuData: ISidebarMenu[] = [
  {
    id: 'dashboard',
    title: 'Beranda',
    icon: 'element-11',
    to: 'dashboard',
    child: [],
  },
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
      {
        id: 'taxAnalytic',
        title: 'Tax Analytic',
        to: 'taxAnalytic',
      },
      {
        id: 'inboundLogisticAnalytic',
        title: 'Inbound Logistic Analytic',
        to: 'inboundLogisticAnalytic',
      },
    ],
  },
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
      {
        id: 'activity-expenses',
        title: 'Activity Expenses',
        to: 'activity-expenses',
      },
      {
        id: 'vendor-detail',
        title: 'Vendor Detail',
        to: 'vendor-detail',
      },
    ],
  },
  {
    id: 'digital-receiving-confirmation',
    title: 'Digital Receiving Confirmation',
    icon: 'package',
    child: [
      {
        id: 'mock-sap-list',
        title: 'Purchase Order List',
        to: 'mockSapList',
      },
      {
        id: 'delivery-notes',
        title: 'Create Delivery Notes',
        to: 'deliveryNotes',
      },
      {
        id: 'delivery-notes-list',
        title: 'Delivery Notes List',
        to: 'deliveryNotesList',
      },
      {
        id: 'receiving-confirmation',
        title: 'Create Receiving Confirmation',
        to: 'receivingConfirmation',
      },
      {
        id: 'receiving-confirmation-list',
        title: 'Receiving Confirmation List',
        to: 'receivingConfirmationList',
      },
      {
        id: 'goods-receipt-list',
        title: 'Goods Receipts',
        to: 'goodsReceiptList',
      },
    ],
  },
  {
    id: 'e-invoice',
    title: 'Invoice',
    icon: 'bill',
    child: [
      {
        id: 'invoice-list',
        title: 'Invoice PO',
        to: 'invoice-list',
      },
      {
        id: 'invoice-list-non-po',
        title: 'Invoice Non PO',
        to: 'invoice-list-non-po',
      },
      {
        id: 'invoice-verification',
        title: 'FTP Invoice Verification',
        to: 'invoiceVerification',
      },
      {
        id: 'invoice-verification-no-po',
        title: 'Invoice Verification Non PO',
        to: 'invoiceVerificationNoPo',
      },
      {
        id: 'invoice-approval',
        title: 'FTP Invoice Approval',
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
      {
        id: 'cash-advance',
        title: 'Cash Advance',
        to: 'cash-advance',
      },
      {
        id: 'recurring-invoice-reminder',
        title: 'Recurring Invoice Reminder',
        to: 'recurring-invoice-reminder',
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
        title: 'VAT (Pajak Masukan)',
        to: 'vatInReconciliation',
      },
      {
        id: 'vat-out-reconciliation',
        title: 'VAT (Pajak Luaran)',
        to: 'vatOutReconciliation',
      },
      {
        id: 'wht-unifikasi',
        title: 'WHT (Unifikasi)',
        to: 'whtUnifikasi',
      },
      {
        id: 'wht-pasal-21',
        title: 'WHT (Pasal 21)',
        to: 'whtPasal21',
      },
    ],
  },
  {
    id: 'userManagement',
    title: 'User Management',
    icon: 'people',
    child: [
      {
        id: 'list-user',
        title: 'User List',
        to: 'user-management-user-list',
      },
      {
        id: 'master-profile',
        title: 'Master Profile',
        to: 'user-management-master-profile',
      },
      {
        id: 'master-role',
        title: 'Master Role',
        to: 'user-management-master-role',
      },
      {
        id: 'master-employee',
        title: 'Master Employee',
        to: 'user-management-master-employee',
      },
      {
        id: 'master-menu',
        title: 'Master Menu',
        to: 'user-management-master-menu',
      },
      {
        id: 'report-user-authorization',
        title: 'Report User Authorization',
        to: 'user-management-report-authorization',
      },
    ],
  },
  {
    id: 'workflow-configuration',
    title: 'Workflow Configuration',
    icon: 'switch',
    child: [
      {
        id: 'workflow-list',
        title: 'Workflow List',
        to: 'workflow-list',
      },
      {
        id: 'list-organization',
        title: 'List Organization',
        to: 'list-organization',
      },
      {
        id: 'requisitioner-master',
        title: 'Requisitioner Master',
        to: 'requisitioner-master',
      },
    ],
  },
  {
    id: 'system-integration',
    title: 'System Integration',
    icon: 'cloud',
    child: [
      {
        id: 'erp-integration',
        title: 'ERP Integration',
        to: 'erp-integration',
      },
    ],
  },
  {
    id: 'system-configuration',
    title: 'System Configuration',
    icon: 'setting-2',
    child: [
      {
        id: 'invoice-configuration',
        title: 'Invoice Configuration',
        to: 'invoice-configuration',
      },
      {
        id: 'log-activity',
        title: 'Log Activity',
        to: 'log-activity',
      },
    ],
  },
]

export default sidebarMenuData

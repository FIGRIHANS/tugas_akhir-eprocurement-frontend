import sidebarMenu, { type ISidebarMenu } from '@/static/sidebar'
import type { ResponseUser } from '@/stores/views/types/login'
import { isEmpty } from 'lodash'

const ADMIN_MENU_IDS = [
  'e-invoice',
  'vendor-management',
  'dashboard',
  'analytic-dashboard',
  'digital-receiving-confirmation',
  'tax-reconciliation',
  'userManagement',
  'workflow-configuration',
  'system-integration',
  'system-configuration',
] as const

const UNFILTERED_CHILD_MENU_IDS = [
  'workflow-configuration',
  'system-integration',
  'system-configuration',
] as const

const ADMIN_CHILD_IDS = [
  'vendor-master',
  'invoice-list',
  'invoice-list-non-po',
  'invoice-verification',
  'invoice-verification-no-po',
  'invoice-approval',
  'invoice-approval-no-po',
  'ftp-invoice-integration',
  'scorecard-performance',
  'invoiceAnalytic',
  'taxAnalytic',
  'inboundLogisticAnalytic',
  'email-invoice-integration',
  'mock-sap-list',
  'receiving-confirmation',
  'receiving-confirmation-list',
  'delivery-notes',
  'delivery-notes-list',
  'goods-receipt-list',
  'vat-reconciliation',
  'vat-out-reconciliation',
  'wht-unifikasi',
  'wht-pasal-21',
  'invoice-type',
  'list-user',
  'master-profile',
  'master-role',
  'master-employee',
  'master-menu',
  'report-user-authorization',
  'erp-integration',
  'activity-expenses',
  'invoice-configuration',
  'cash-advance',
  'recurring-invoice-reminder',
] as const

const NON_PO_VERIFY_PROFILE_IDS = [3029, 3075, 3036, 3066, 3030, 3089, 3028, 3193, 3194]

function filterMenusByIds(menuIds: readonly string[]): ISidebarMenu[] {
  return sidebarMenu.filter((menu) => menuIds.includes(menu.id))
}

function filterChildIds(menu: ISidebarMenu, allowedChildIds: readonly string[]): ISidebarMenu {
  return {
    ...menu,
    child: menu.child ? menu.child.filter((child) => allowedChildIds.includes(child.id)) : [],
  }
}

function filterAdminMenu(includeCreateRoutes: boolean): ISidebarMenu[] {
  const allowedChildIds = includeCreateRoutes
    ? ADMIN_CHILD_IDS
    : ADMIN_CHILD_IDS.filter(
        (id) => id !== 'receiving-confirmation' && id !== 'delivery-notes',
      )

  return filterMenusByIds(ADMIN_MENU_IDS).map((menu) => {
    if (UNFILTERED_CHILD_MENU_IDS.includes(menu.id as (typeof UNFILTERED_CHILD_MENU_IDS)[number])) {
      return { ...menu }
    }
    return filterChildIds(menu, allowedChildIds)
  })
}

function getProfile3200Menu(): ISidebarMenu[] {
  return filterMenusByIds([
    'analytic-dashboard',
    'digital-receiving-confirmation',
    'e-invoice',
    'tax-reconciliation',
  ]).map((menu) => {
    if (menu.id === 'analytic-dashboard') {
      return filterChildIds(menu, [
        'scorecard-performance',
        'invoiceAnalytic',
        'taxAnalytic',
        'inboundLogisticAnalytic',
      ])
    }
    if (menu.id === 'digital-receiving-confirmation') {
      return filterChildIds(menu, [
        'mock-sap-list',
        'delivery-notes-list',
        'receiving-confirmation-list',
        'goods-receipt-list',
      ])
    }
    if (menu.id === 'e-invoice') {
      return filterChildIds(menu, ['ftp-invoice-integration'])
    }
    if (menu.id === 'tax-reconciliation') {
      return filterChildIds(menu, [
        'vat-reconciliation',
        'vat-out-reconciliation',
        'wht-unifikasi',
        'wht-pasal-21',
      ])
    }
    return menu
  })
}

function getDefaultMenu(): ISidebarMenu[] {
  return sidebarMenu
    .filter((menu) => menu.id !== 'company-information' && menu.id !== 'vendor-tender')
    .map((menu) => ({
      ...menu,
      child: menu.child ? menu.child.filter((child) => child.id !== 'vendor-blacklist') : [],
    }))
}

/**
 * Returns sidebar menu items visible for the given user based on profileId / vendorCode.
 * Shared by LSidebar.vue and route access guards.
 */
export function getFilteredSidebarMenu(userData: ResponseUser | null | undefined): ISidebarMenu[] {
  if (isEmpty(userData)) {
    return getDefaultMenu()
  }

  const profileId = Number(userData.profile?.profileId)
  const vendorCode = userData.profile?.vendorCode

  // Profile 3200 — limited to 4 core modules (takes priority over vendorCode)
  if (profileId === 3200) {
    return getProfile3200Menu()
  }

  if (profileId === 3001) {
    return filterMenusByIds([
      'dashboard',
      'digital-receiving-confirmation',
      'e-invoice',
      'tax-reconciliation',
    ]).map((menu) =>
      filterChildIds(menu, [
        'invoice-list',
        'ftp-invoice-integration',
        'goods-receipt-list',
        'vat-out-reconciliation',
      ]),
    )
  }

  // Finance AP Officer (3002) — FTP verification + tax reconciliation
  if (profileId === 3002) {
    return filterMenusByIds(['e-invoice', 'tax-reconciliation']).map((menu) => {
      if (menu.id === 'e-invoice') {
        return filterChildIds(menu, ['invoice-verification'])
      }
      if (menu.id === 'tax-reconciliation') {
        return filterChildIds(menu, ['vat-reconciliation', 'wht-unifikasi', 'wht-pasal-21'])
      }
      return menu
    })
  }

  // Accounting & Tax (3003) — FTP approval + tax reconciliation
  if (profileId === 3003) {
    return filterMenusByIds(['e-invoice', 'tax-reconciliation']).map((menu) => {
      if (menu.id === 'e-invoice') {
        return filterChildIds(menu, ['invoice-approval'])
      }
      if (menu.id === 'tax-reconciliation') {
        return filterChildIds(menu, ['vat-reconciliation', 'wht-unifikasi', 'wht-pasal-21'])
      }
      return menu
    })
  }

  // Finance AP Supervisor (3004) — FTP approval + tax reconciliation
  if (profileId === 3004) {
    return filterMenusByIds(['e-invoice', 'tax-reconciliation']).map((menu) => {
      if (menu.id === 'e-invoice') {
        return filterChildIds(menu, ['invoice-approval'])
      }
      if (menu.id === 'tax-reconciliation') {
        return filterChildIds(menu, ['vat-reconciliation', 'wht-unifikasi', 'wht-pasal-21'])
      }
      return menu
    })
  }

  // Warehouse Checker (3180) — can create RC
  if (profileId === 3180) {
    return filterMenusByIds(['digital-receiving-confirmation']).map((menu) =>
      filterChildIds(menu, ['receiving-confirmation-list', 'mock-sap-list']),
    )
  }

  // Warehouse Checker Approver (3185) — view + approve only
  if (profileId === 3185) {
    const inboundAnalyticOnly = filterMenusByIds(['analytic-dashboard']).map((menu) =>
      filterChildIds(menu, ['inboundLogisticAnalytic']),
    )
    const digitalReceiving = filterMenusByIds(['digital-receiving-confirmation']).map((menu) =>
      filterChildIds(menu, [
        'receiving-confirmation-list',
        'mock-sap-list',
        'goods-receipt-list',
        'delivery-notes-list',
      ]),
    )
    return [...inboundAnalyticOnly, ...digitalReceiving]
  }

  if (vendorCode) {
    return filterMenusByIds([
      'vendor-management',
      'digital-receiving-confirmation',
      'tax-reconciliation',
    ]).map((menu) => {
      if (menu.id === 'digital-receiving-confirmation') {
        return filterChildIds(menu, ['mock-sap-list', 'delivery-notes-list', 'goods-receipt-list'])
      }
      if (menu.id === 'tax-reconciliation') {
        return filterChildIds(menu, ['vat-out-reconciliation'])
      }
      return filterChildIds(menu, ['vendor-detail'])
    })
  }

  if (profileId === 3192) {
    return sidebarMenu
      .filter((menu) => menu.id !== 'company-information')
      .map((menu) => ({
        ...menu,
        child: menu.child
          ? menu.child.filter(
              (child) => child.id !== 'vendor-approval' && child.id !== 'vendor-verification',
            )
          : [],
      }))
  }

  if (profileId === 3132) {
    return sidebarMenu
      .filter(
        (menu) =>
          menu.id !== 'company-information' &&
          menu.id !== 'e-invoice' &&
          menu.id !== 'userManagement',
      )
      .map((menu) => ({
        ...menu,
        child: menu.child ? menu.child.filter((child) => child.id !== 'vendor-blacklist') : [],
      }))
  }

  if (NON_PO_VERIFY_PROFILE_IDS.includes(profileId)) {
    return filterMenusByIds(['e-invoice', 'vendor-management', 'dashboard']).map((menu) =>
      filterChildIds(menu, [
        'invoice-verification-no-po',
        'vendor-master',
        'vendor-verification',
        'vendor-approval',
      ]),
    )
  }

  if (profileId === 3201 || profileId === 3202) {
    return filterMenusByIds(['e-invoice', 'vendor-management', 'dashboard']).map((menu) =>
      filterChildIds(menu, ['invoice-approval-no-po', 'vendor-master']),
    )
  }

  return getDefaultMenu()
}

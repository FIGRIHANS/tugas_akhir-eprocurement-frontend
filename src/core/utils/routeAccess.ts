import type { MiddlewareContext } from 'vue-middleware'
import type { ResponseUser } from '@/stores/views/types/login'
import type { ISidebarMenu } from '@/static/sidebar'
import { getFilteredSidebarMenu } from '@/core/utils/menuAccess'

const ROUTE_SUFFIXES = ['Detail', 'Create', 'Edit'] as const

/** Routes accessible to any authenticated user regardless of menu permissions. */
const GLOBAL_ALLOWLIST = new Set(['dashboard', 'error'])

/**
 * Additional routes allowed when a base list/menu route is permitted.
 * Covers detail pages, nested forms, and non-standard naming patterns.
 */
const CHILD_ROUTE_OVERRIDES: Record<string, readonly string[]> = {
  invoice: ['invoice-list', 'invoice-list-non-po'],
  'invoice-list': ['invoiceDetail', 'invoiceAdd', 'invoiceDetailEdit', 'invoiceDetailLegacy'],
  'invoice-list-non-po': ['invoiceDetailNonPo'],
  invoiceVerification: ['invoiceDetail', 'invoiceDetailNonPo'],
  invoiceApproval: ['invoiceDetail', 'invoiceDetailNonPo'],
  invoiceVerificationNoPo: ['invoiceDetailNonPo'],
  invoiceApprovalNonPo: ['invoiceDetailNonPo'],
  'user-management-user-list': [
    'user-management-user-detail',
    'user-management-user-form',
    'form-user-detail',
    'form-user-profile',
    'form-user-authorization',
    'form-user-role',
  ],
  'user-management-master-employee': [
    'user-management-master-employee-create',
    'user-management-master-employee-edit',
    'user-management-master-employee-detail',
  ],
  'user-management-master-menu': [
    'user-management-master-menu-add',
    'user-management-master-menu-detail',
  ],
  'user-management-report-authorization': [
    'report-authorization-profile',
    'report-authorization-role-auth',
    'report-authorization-role-menu',
  ],
  'vendor-master': ['vendor-master-detail'],
  'vendor-verification': ['vendor-verification-detail'],
  'vendor-approval': ['vendor-approval-detail'],
  'vendor-blacklist': ['vendor-pending-blacklist', 'vendor-blacklist-list'],
  mockSapList: ['mockSapDetail'],
  goodsReceiptList: ['goodsReceiptListDetail'],
  receivingConfirmationList: ['receivingConfirmationDetail'],
  deliveryNotesList: ['deliveryNotesDetail'],
  vatInReconciliation: ['vatInReconciliationDetail', 'vatPjSubmitFromInvoice'],
  vatOutReconciliation: ['vatOutReconciliationCreate', 'vatOutReconciliationDetail'],
  whtUnifikasi: ['whtUnifikasiCreate', 'whtUnifikasiDetail', 'whtReconciliation'],
  whtPasal21: ['whtPasal21Create', 'whtPasal21Detail'],
  'erp-integration': [
    'add-erp',
    'erp-integration-detail',
    'add-integration',
    'detail-integration',
    'edit-integration',
  ],
  'workflow-list': ['workflow-configuration', 'organization-structure'],
  'list-organization': ['organization-structure'],
  'invoice-configuration': [
    'add-invoice-configuration',
    'invoice-configuration-detail',
    'add-integration-invoice',
    'detail-integration-invoice',
    'edit-integration-invoice',
  ],
}

/** Create/form routes keyed by sidebar child id — only added when that menu item is allowed. */
const CREATE_ROUTES_BY_CHILD_ID: Record<string, readonly string[]> = {
  'receiving-confirmation': ['receivingConfirmation', 'receivingConfirmationCreate'],
  'delivery-notes': ['deliveryNotes', 'deliveryNotesCreate'],
}

function collectAllowedChildIds(menus: ISidebarMenu[]): Set<string> {
  const ids = new Set<string>()
  for (const menu of menus) {
    for (const child of menu.child) {
      ids.add(child.id)
    }
  }
  return ids
}

function getCreateRoutesForMenu(allowedChildIds: Set<string>): string[] {
  const routes: string[] = []
  for (const [childId, createRoutes] of Object.entries(CREATE_ROUTES_BY_CHILD_ID)) {
    if (allowedChildIds.has(childId)) {
      routes.push(...createRoutes)
    }
  }
  return routes
}

function getProfileSpecificRoutes(userData: ResponseUser | null | undefined): string[] {
  if (!userData) return []

  const profileId = Number(userData.profile?.profileId)
  const vendorCode = userData.profile?.vendorCode

  // Warehouse checker can create RC via PO list / notifications without a sidebar create link
  if (profileId === 3180) {
    return ['receivingConfirmationCreate', 'receivingConfirmation']
  }

  // Vendor can create DN (e.g. from PO list) without a sidebar create link
  if (vendorCode && profileId !== 3200) {
    return ['deliveryNotes', 'deliveryNotesCreate']
  }

  return []
}

function collectBaseRouteNames(menus: ISidebarMenu[]): string[] {
  const names: string[] = []

  for (const menu of menus) {
    if (menu.to) {
      names.push(menu.to)
    }
    for (const child of menu.child) {
      if (child.to) {
        names.push(child.to)
      }
    }
  }

  return names
}

function expandRouteNames(baseRoutes: string[]): Set<string> {
  const allowed = new Set<string>()

  for (const base of baseRoutes) {
    allowed.add(base)

    for (const suffix of ROUTE_SUFFIXES) {
      allowed.add(`${base}${suffix}`)
    }

    const overrides = CHILD_ROUTE_OVERRIDES[base]
    if (overrides) {
      for (const route of overrides) {
        allowed.add(route)
        for (const suffix of ROUTE_SUFFIXES) {
          allowed.add(`${route}${suffix}`)
        }
      }
    }
  }

  return allowed
}

export function getAllowedRouteNames(userData: ResponseUser | null | undefined): Set<string> {
  const menus = getFilteredSidebarMenu(userData)
  const baseRoutes = collectBaseRouteNames(menus)
  const allowed = expandRouteNames(baseRoutes)

  const allowedChildIds = collectAllowedChildIds(menus)
  for (const route of getCreateRoutesForMenu(allowedChildIds)) {
    allowed.add(route)
  }
  for (const route of getProfileSpecificRoutes(userData)) {
    allowed.add(route)
  }

  for (const route of GLOBAL_ALLOWLIST) {
    allowed.add(route)
  }

  return allowed
}

export function isRouteAllowed(
  routeName: string | null | undefined,
  userData: ResponseUser | null | undefined,
): boolean {
  if (!routeName) {
    return true
  }

  if (GLOBAL_ALLOWLIST.has(routeName)) {
    return true
  }

  const allowed = getAllowedRouteNames(userData)
  if (allowed.has(routeName)) {
    return true
  }

  // Match suffix patterns (e.g. whtPasal21Detail when whtPasal21 is allowed)
  for (const base of allowed) {
    for (const suffix of ROUTE_SUFFIXES) {
      if (routeName === `${base}${suffix}`) {
        return true
      }
    }
  }

  return false
}

export async function enforceRouteAccess(context: MiddlewareContext): Promise<boolean> {
  const routeName = context.to.name ? String(context.to.name) : null

  if (!routeName || GLOBAL_ALLOWLIST.has(routeName)) {
    return true
  }

  const { useLoginStore } = await import('@/stores/views/login')
  const loginApi = useLoginStore()

  if (!isRouteAllowed(routeName, loginApi.userData)) {
    context.router.replace({ path: '/error/403' })
    return false
  }

  return true
}

/**
 * Manual validation script for route access rules.
 * Run: npx jiti scripts/validate-route-access.ts
 */
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { createJiti } from 'jiti'

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..')
const jiti = createJiti(import.meta.url, {
  alias: {
    '@': join(rootDir, 'src'),
  },
})

const { isRouteAllowed } = jiti('../src/core/utils/routeAccess') as typeof import('../src/core/utils/routeAccess')
import type { ResponseUser } from '../src/stores/views/types/login'

function makeUser(profileId: number, vendorCode = ''): ResponseUser {
  return {
    profile: {
      userName: 'test',
      lastLoginDate: '',
      employeeId: 1,
      employeeName: 'Test',
      employeeEmail: 'test@test.com',
      positionName: '',
      companyCode: '',
      costCenter: '',
      profileId,
      profileName: '',
      sapCode: '',
      vendorCode,
      vendorName: '',
    },
    roleAuths: { role: { roleId: 1, roleName: '' }, auths: [] },
    roleMenus: [],
  }
}

type Case = {
  label: string
  user: ResponseUser
  allowed: string[]
  blocked: string[]
}

const cases: Case[] = [
  {
    label: '3180 Warehouse Checker',
    user: makeUser(3180),
    allowed: [
      'receivingConfirmationList',
      'receivingConfirmationDetail',
      'receivingConfirmationCreate',
      'mockSapList',
      'dashboard',
    ],
    blocked: ['user-management-user-list', 'invoiceApproval', 'invoiceVerification'],
  },
  {
    label: '3002 Finance AP Officer',
    user: makeUser(3002),
    allowed: ['invoiceVerification', 'invoiceDetail', 'invoice-list', 'vendor-master'],
    blocked: ['user-management-user-list', 'receivingConfirmationCreate'],
  },
  {
    label: '3185 Warehouse Approver',
    user: makeUser(3185),
    allowed: [
      'receivingConfirmationList',
      'receivingConfirmationDetail',
      'inboundLogisticAnalytic',
      'goodsReceiptListDetail',
      'deliveryNotesDetail',
    ],
    blocked: ['receivingConfirmationCreate', 'user-management-user-list', 'invoiceVerification'],
  },
  {
    label: 'Vendor user',
    user: makeUser(1000, 'V001'),
    allowed: [
      'deliveryNotesList',
      'deliveryNotesCreate',
      'deliveryNotes',
      'invoice-list',
      'vendor-detail',
      'goodsReceiptListDetail',
    ],
    blocked: ['invoiceVerification', 'user-management-user-list'],
  },
  {
    label: '3200 Admin',
    user: makeUser(3200),
    allowed: [
      'user-management-user-list',
      'invoiceVerification',
      'receivingConfirmationCreate',
      'workflow-list',
      'erp-integration',
    ],
    blocked: [],
  },
]

let failed = 0

for (const testCase of cases) {
  console.log(`\n=== ${testCase.label} ===`)

  for (const route of testCase.allowed) {
    const ok = isRouteAllowed(route, testCase.user)
    if (!ok) {
      console.error(`  FAIL: expected ALLOW ${route}`)
      failed++
    } else {
      console.log(`  OK allow: ${route}`)
    }
  }

  for (const route of testCase.blocked) {
    const ok = isRouteAllowed(route, testCase.user)
    if (ok) {
      console.error(`  FAIL: expected BLOCK ${route}`)
      failed++
    } else {
      console.log(`  OK block: ${route}`)
    }
  }
}

// Notification deep-link routes
console.log('\n=== Notification deep links ===')
const notifCases = [
  {
    label: '3185 GR detail notification',
    user: makeUser(3185),
    route: 'goodsReceiptListDetail',
    expect: true,
  },
  {
    label: '3002 invoice detail notification',
    user: makeUser(3002),
    route: 'invoiceDetail',
    expect: true,
  },
  {
    label: '3180 RC create from delivery note notification',
    user: makeUser(3180),
    route: 'receivingConfirmationCreate',
    expect: true,
  },
  {
    label: '3185 RC create blocked',
    user: makeUser(3185),
    route: 'receivingConfirmationCreate',
    expect: false,
  },
]

for (const nc of notifCases) {
  const ok = isRouteAllowed(nc.route, nc.user)
  if (ok !== nc.expect) {
    console.error(`  FAIL: ${nc.label} — ${nc.route} => ${ok}, expected ${nc.expect}`)
    failed++
  } else {
    console.log(`  OK: ${nc.label}`)
  }
}

if (failed > 0) {
  console.error(`\n${failed} assertion(s) failed`)
  process.exit(1)
}

console.log('\nAll route access validations passed.')

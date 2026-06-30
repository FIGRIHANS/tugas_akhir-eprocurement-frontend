import type { RouteLocationRaw } from 'vue-router'
import type { NotificationType, TaxNotification } from '@/stores/notification/types'
import { INTERNAL_SUBMITTER_PROFILE_ID, SUBMITTOR_PROFILE_ID } from '@/core/utils/invoiceSubmissionRoute'

export interface NotificationDisplayMeta {
  category: string
  categoryClass: string
  severity: 'info' | 'warning' | 'critical'
  iconClass: string
  accentClass: string
}

const INBOUND_TYPES: NotificationType[] = [
  'delivery-note-created',
  'rc-pending-approval',
  'gr-created',
  'gr-paid',
  'partial-received',
  'completed',
  'rejected',
  'invoice-pending-verify',
  'invoice-pending-approval',
  'invoice-rejected',
]

export const getNotificationDisplayMeta = (type: NotificationType): NotificationDisplayMeta => {
  switch (type) {
    case 'delivery-note-created':
      return {
        category: 'Inbound',
        categoryClass: 'bg-blue-50 text-blue-700',
        severity: 'info',
        iconClass: 'ki-filled ki-delivery text-blue-600 text-lg',
        accentClass: 'border-l-blue-500',
      }
    case 'rc-pending-approval':
      return {
        category: 'Approval',
        categoryClass: 'bg-amber-50 text-amber-700',
        severity: 'warning',
        iconClass: 'ki-filled ki-verify text-amber-600 text-lg',
        accentClass: 'border-l-amber-500',
      }
    case 'gr-created':
      return {
        category: 'Goods Receipt',
        categoryClass: 'bg-emerald-50 text-emerald-700',
        severity: 'info',
        iconClass: 'ki-filled ki-document text-emerald-600 text-lg',
        accentClass: 'border-l-emerald-500',
      }
    case 'gr-paid':
      return {
        category: 'Pembayaran',
        categoryClass: 'bg-green-50 text-green-700',
        severity: 'info',
        iconClass: 'ki-filled ki-dollar text-green-600 text-lg',
        accentClass: 'border-l-green-500',
      }
    case 'partial-received':
      return {
        category: 'Penerimaan',
        categoryClass: 'bg-orange-50 text-orange-700',
        severity: 'warning',
        iconClass: 'ki-filled ki-parcel text-orange-600 text-lg',
        accentClass: 'border-l-orange-500',
      }
    case 'completed':
      return {
        category: 'Penerimaan',
        categoryClass: 'bg-emerald-50 text-emerald-700',
        severity: 'info',
        iconClass: 'ki-filled ki-check-circle text-emerald-600 text-lg',
        accentClass: 'border-l-emerald-500',
      }
    case 'rejected':
      return {
        category: 'Penerimaan',
        categoryClass: 'bg-red-50 text-red-700',
        severity: 'critical',
        iconClass: 'ki-filled ki-cross-circle text-red-600 text-lg',
        accentClass: 'border-l-red-500',
      }
    case 'invoice-pending-verify':
      return {
        category: 'Invoice',
        categoryClass: 'bg-sky-50 text-sky-700',
        severity: 'info',
        iconClass: 'ki-filled ki-verify text-sky-600 text-lg',
        accentClass: 'border-l-sky-500',
      }
    case 'invoice-pending-approval':
      return {
        category: 'Invoice',
        categoryClass: 'bg-amber-50 text-amber-700',
        severity: 'warning',
        iconClass: 'ki-filled ki-check-circle text-amber-600 text-lg',
        accentClass: 'border-l-amber-500',
      }
    case 'invoice-rejected':
      return {
        category: 'Invoice',
        categoryClass: 'bg-red-50 text-red-700',
        severity: 'critical',
        iconClass: 'ki-filled ki-cross-circle text-red-600 text-lg',
        accentClass: 'border-l-red-500',
      }
    case 'vat-mismatch':
      return {
        category: 'Finance',
        categoryClass: 'bg-yellow-50 text-yellow-700',
        severity: 'warning',
        iconClass: 'ki-filled ki-information-2 text-yellow-600 text-lg',
        accentClass: 'border-l-yellow-500',
      }
    case 'vat-expiry':
      return {
        category: 'Finance',
        categoryClass: 'bg-red-50 text-red-700',
        severity: 'critical',
        iconClass: 'ki-filled ki-calendar-2 text-red-500 text-lg',
        accentClass: 'border-l-red-500',
      }
    case 'wht-pending':
      return {
        category: 'Finance',
        categoryClass: 'bg-orange-50 text-orange-700',
        severity: 'warning',
        iconClass: 'ki-filled ki-document text-orange-500 text-lg',
        accentClass: 'border-l-orange-500',
      }
    default:
      return {
        category: 'System',
        categoryClass: 'bg-gray-100 text-gray-600',
        severity: 'info',
        iconClass: 'ki-outline ki-notification text-teal-600 text-lg',
        accentClass: 'border-l-teal-500',
      }
  }
}

export const isInboundNotification = (type: NotificationType): boolean =>
  INBOUND_TYPES.includes(type)

export interface ResolveNotificationRouteOptions {
  profileId?: number
}

export const resolveNotificationRoute = (
  notification: TaxNotification,
  options?: ResolveNotificationRouteOptions,
): RouteLocationRaw | null => {
  const entityId = notification.linkEntityId
  const profileId = Number(options?.profileId)

  const isSubmitterRejectEdit =
    notification.type === 'invoice-rejected' &&
    !Number.isNaN(profileId) &&
    (profileId === INTERNAL_SUBMITTER_PROFILE_ID || profileId === SUBMITTOR_PROFILE_ID) &&
    !!entityId

  if (isSubmitterRejectEdit) {
    const isNonPo = notification.linkEntityType === 'invoice-non-po'
    const query: Record<string, string> = {
      type: isNonPo ? 'nonpo' : 'po',
      invoice: entityId,
    }

    if (
      profileId === SUBMITTOR_PROFILE_ID ||
      profileId === INTERNAL_SUBMITTER_PROFILE_ID
    ) {
      query.from = 'ftp'
    }

    return {
      name: 'invoiceAdd',
      query,
    }
  }

  if (notification.linkEntityType === 'goods-receipt' && entityId) {
    return { name: 'goodsReceiptListDetail', params: { grId: entityId } }
  }

  if (notification.linkEntityType === 'receiving-confirmation' && entityId) {
    return { name: 'receivingConfirmationDetail', params: { id: entityId } }
  }

  if (notification.linkEntityType === 'delivery-note' && entityId) {
    return { name: 'deliveryNotesDetail', params: { id: entityId } }
  }

  if (notification.linkEntityType === 'invoice' && entityId) {
    return {
      name: 'invoiceDetail',
      query: { id: entityId, type: '2' },
    }
  }

  if (notification.linkEntityType === 'invoice-non-po' && entityId) {
    return {
      name: 'invoiceDetailNonPo',
      query: { id: entityId, type: '2', invoiceType: 'no_po' },
    }
  }

  switch (notification.type) {
    case 'vat-mismatch':
    case 'vat-expiry':
      return { path: `/vat-in-reconciliation/${notification.relatedId || 0}` }
    default:
      return null
  }
}

export const getNotificationPreviewLines = (message: string, maxLines = 2): string => {
  const lines = message.split('\n').filter(Boolean)
  return lines.slice(0, maxLines).join('\n')
}

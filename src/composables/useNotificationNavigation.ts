import type { RouteLocationRaw } from 'vue-router'
import type { NotificationType, TaxNotification } from '@/stores/notification/types'

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
  'partial-received',
  'completed',
  'rejected',
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
        iconClass: 'ki-filled ki-notification-on text-red-600 text-lg',
        accentClass: 'border-l-red-500',
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

export const resolveNotificationRoute = (
  notification: TaxNotification,
): RouteLocationRaw | null => {
  const entityId = notification.linkEntityId

  if (notification.linkEntityType === 'goods-receipt' && entityId) {
    return { name: 'goodsReceiptListDetail', params: { grId: entityId } }
  }

  if (notification.linkEntityType === 'receiving-confirmation' && entityId) {
    return { name: 'receivingConfirmationDetail', params: { id: entityId } }
  }

  if (notification.linkEntityType === 'delivery-note' && entityId) {
    return { name: 'deliveryNotesDetail', params: { id: entityId } }
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

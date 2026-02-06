// Notification Types for Tax Notification System

export type NotificationSeverity = 'info' | 'warning' | 'critical'
export type NotificationType = 'vat-expiry' | 'wht-pending' | 'fp-status' | 'bupot-created'

export interface TaxNotification {
  id: string
  type: NotificationType
  severity: NotificationSeverity
  title: string
  message: string
  relatedId?: string // e.g., noFakturPajak
  relatedData?: Record<string, unknown>
  createdAt: Date
  read: boolean
  expiryDate?: Date
  daysRemaining?: number
}

export interface NotificationState {
  notifications: TaxNotification[]
  lastChecked: Date | null
}

// Helper to generate unique ID
export const generateNotificationId = (): string => {
  return `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Severity badge classes
export const getSeverityClass = (severity: NotificationSeverity): string => {
  switch (severity) {
    case 'critical':
      return 'bg-red-100 text-red-700 border-red-300'
    case 'warning':
      return 'bg-yellow-100 text-yellow-700 border-yellow-300'
    case 'info':
    default:
      return 'bg-blue-100 text-blue-700 border-blue-300'
  }
}

// Severity icon classes
export const getSeverityIcon = (severity: NotificationSeverity): string => {
  switch (severity) {
    case 'critical':
      return 'ki-filled ki-notification-on text-red-500'
    case 'warning':
      return 'ki-filled ki-notification text-yellow-500'
    case 'info':
    default:
      return 'ki-outline ki-notification text-blue-500'
  }
}

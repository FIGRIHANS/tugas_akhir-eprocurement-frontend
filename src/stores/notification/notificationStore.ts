import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import moment from 'moment'
import type { TaxNotification, NotificationState, NotificationSeverity } from './types'
import { generateNotificationId } from './types'
import { NotificationService } from '@/services/notification.service'

const STORAGE_KEY = 'tax-notifications-v2'

export const useNotificationStore = defineStore('notification', () => {
  // State
  const notifications = ref<TaxNotification[]>([])
  const lastChecked = ref<Date | null>(null)

  // Load from localStorage on init
  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data: NotificationState = JSON.parse(stored)
        notifications.value = data.notifications.map((n) => ({
          ...n,
          createdAt: new Date(n.createdAt),
          expiryDate: n.expiryDate ? new Date(n.expiryDate) : undefined,
        }))
        lastChecked.value = data.lastChecked ? new Date(data.lastChecked) : null
      }
    } catch (error) {
      console.error('Error loading notifications from storage:', error)
    }
  }

  // Save to localStorage
  const saveToStorage = () => {
    try {
      const data: NotificationState = {
        notifications: notifications.value,
        lastChecked: lastChecked.value,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      console.error('Error saving notifications to storage:', error)
    }
  }

  // Computed
  const unreadCount = computed(() => notifications.value.filter((n) => !n.read).length)

  const sortedNotifications = computed(() =>
    [...notifications.value].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    ),
  )

  const criticalNotifications = computed(() =>
    notifications.value.filter((n) => n.severity === 'critical' && !n.read),
  )

  // Actions
  const addNotification = (
    notification: Omit<TaxNotification, 'id' | 'createdAt' | 'read'>,
  ): TaxNotification => {
    // For partial-received, always add (each approval is a unique event)
    if (notification.type !== 'partial-received') {
      // Check if similar notification already exists (avoid duplicates)
      const exists = notifications.value.some(
        (n) =>
          n.type === notification.type &&
          n.relatedId === notification.relatedId &&
          n.daysRemaining === notification.daysRemaining,
      )

      if (exists) {
        return notifications.value.find(
          (n) =>
            n.type === notification.type &&
            n.relatedId === notification.relatedId &&
            n.daysRemaining === notification.daysRemaining,
        )!
      }
    }

    const newNotification: TaxNotification = {
      ...notification,
      id: generateNotificationId(),
      createdAt: new Date(),
      read: false,
    }

    notifications.value.unshift(newNotification)
    saveToStorage()
    return newNotification
  }

  const markAsRead = (id: string) => {
    const notification = notifications.value.find((n) => n.id === id)
    if (notification) {
      notification.read = true
      saveToStorage()
    }
  }

  const markAllAsRead = () => {
    notifications.value.forEach((n) => (n.read = true))
    saveToStorage()
  }

  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex((n) => n.id === id)
    if (index !== -1) {
      notifications.value.splice(index, 1)
      saveToStorage()
    }
  }

  const clearAll = () => {
    notifications.value = []
    saveToStorage()
  }

  // VAT Expiry Check - Main function to check VAT data for expiring credits
  interface VATDataItem {
    vatCreditExpiryDate: string
    noFakturPajak: string
    vendorName: string
    ppn: number
  }

  const checkVatExpiryNotifications = (vatData: VATDataItem[]) => {
    const today = moment()
    let newNotificationsCount = 0

    vatData.forEach((item) => {
      if (!item.vatCreditExpiryDate) return

      const expiry = moment(item.vatCreditExpiryDate)
      const daysLeft = expiry.diff(today, 'days')

      // Skip if already expired or more than 30 days away
      if (daysLeft < 0 || daysLeft > 30) return

      let severity: NotificationSeverity = 'info'
      let title = ''
      let message = ''

      if (daysLeft <= 3) {
        severity = 'critical'
        title = `VAT Credit Expiring in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}!`
        message = `Tax Invoice ${item.noFakturPajak} from ${item.vendorName} will expire. Credit it immediately!`
      } else if (daysLeft <= 7) {
        severity = 'warning'
        title = `VAT Credit Expiring Soon (${daysLeft} days)`
        message = `Tax Invoice ${item.noFakturPajak} from ${item.vendorName} will expire in ${daysLeft} days.`
      } else if (daysLeft <= 30) {
        severity = 'info'
        title = `VAT Credit Reminder (${daysLeft} days left)`
        message = `Tax Invoice ${item.noFakturPajak} needs to be credited before ${expiry.format('DD/MM/YYYY')}.`
      }

      const notification = addNotification({
        type: 'vat-expiry',
        severity,
        title,
        message,
        relatedId: item.noFakturPajak,
        relatedData: {
          vendorName: item.vendorName,
          ppn: item.ppn,
        },
        expiryDate: expiry.toDate(),
        daysRemaining: daysLeft,
      })

      if (notification) newNotificationsCount++
    })

    lastChecked.value = new Date()
    saveToStorage()

    return newNotificationsCount
  }

  // Partial Received Notification
  interface PartialReceivedItem {
    itemName: string
    sku: string
    qtyRejected: number
    rejectReason: string
  }

  interface PartialReceivedParams {
    deliveryNoteNumber: string
    tripID: string
    poNumber: string
    vendorName?: string
    targetVendorId?: number   // Vendor yang harus menerima notifikasi
    targetVendorCode?: string // Vendor yang harus menerima notifikasi
    rejectedItems: PartialReceivedItem[]
  }

  const addPartialReceivedNotification = (params: PartialReceivedParams): TaxNotification => {
    const { deliveryNoteNumber, tripID, poNumber, vendorName, targetVendorId, targetVendorCode, rejectedItems } = params

    const itemLines = rejectedItems
      .map(
        (item) =>
          `• ${item.itemName} (SKU: ${item.sku}): ${item.qtyRejected} unit ditolak — Alasan: ${item.rejectReason}`,
      )
      .join('\n')

    const title = `Partial Received — DN ${deliveryNoteNumber}`
    const message =
      `Delivery Notes ${deliveryNoteNumber} (Trip: ${tripID}, PO: ${poNumber}` +
      `${vendorName ? `, Vendor: ${vendorName}` : ''}) telah diperiksa dan diterima secara PARTIAL. ` +
      `Item yang ditolak:\n${itemLines}`

    return addNotification({
      type: 'partial-received',
      severity: 'warning',
      title,
      message,
      relatedId: deliveryNoteNumber,
      relatedData: { tripID, poNumber, vendorName, rejectedItems },
      targetVendorId,
      targetVendorCode,
    })
  }

  /**
   * Get notifications visible to the current user.
   *
   * Vendor mode  (currentVendorId or currentVendorCode is provided):
   *   - Show partial-received notifications targeted to this vendor (by id or code)
   *   - Show non-targeted, non-partial-received notifications (e.g. VAT expiry — currently N/A for vendors)
   *   - Hide everything else
   *
   * Internal user mode (no vendor context):
   *   - Show ALL partial-received notifications (they triggered them; gives feedback)
   *   - Show non-targeted non-partial-received notifications (e.g. VAT expiry)
   *   - Hide vendor-targeted non-partial-received notifications
   */
  const getVisibleNotifications = (currentVendorId?: number, currentVendorCode?: string) => {
    const isVendorMode = !!(currentVendorId || currentVendorCode)

    return notifications.value.filter((n) => {
      if (!isVendorMode) {
        // Internal user: always see partial-received (for approval feedback) + non-targeted general notifs
        if (n.type === 'partial-received') return true
        return !n.targetVendorId && !n.targetVendorCode
      }

      // Vendor user: only see their own targeted partial-received notifications
      if (!n.targetVendorId && !n.targetVendorCode) {
        // Non-targeted general notifications (e.g. VAT expiry) are for internal users only
        return false
      }
      if (currentVendorId && n.targetVendorId === currentVendorId) return true
      if (currentVendorCode && n.targetVendorCode === currentVendorCode) return true
      return false
    })
  }

  /**
   * Fetch vendor notifications from the backend API and merge into the local store.
   * Backend notifications use IDs prefixed with "api-" to distinguish them from
   * localStorage-only notifications.
   */
  const fetchVendorNotifications = async (vendorId?: number, vendorCode?: string) => {
    if (!vendorId && !vendorCode) return

    const apiNotifs = await NotificationService.getVendorNotifications(vendorId, vendorCode)

    const existingApiIds = new Set(
      notifications.value.filter((n) => n.id.startsWith('api-')).map((n) => n.id),
    )

    for (const n of apiNotifs) {
      const localId = `api-${n.id}`

      if (existingApiIds.has(localId)) {
        // Sync read status from backend
        const existing = notifications.value.find((x) => x.id === localId)
        if (existing) existing.read = n.isRead
        continue
      }

      const notification: TaxNotification = {
        id: localId,
        type: 'partial-received',
        severity: 'warning',
        title: n.title,
        message: n.message,
        relatedId: n.relatedId,
        relatedData: { backendId: n.id },
        createdAt: new Date(n.createdUtcDate),
        read: n.isRead,
        targetVendorId: n.targetVendorId,
        targetVendorCode: n.targetVendorCode,
      }

      notifications.value.push(notification)
    }
  }

  /**
   * Mark a single notification as read — also calls the backend API if it is
   * a persisted vendor notification (id starts with "api-").
   */
  const markApiNotificationRead = async (localId: string, vendorId: number) => {
    const notification = notifications.value.find((n) => n.id === localId)
    if (notification) notification.read = true
    saveToStorage()

    if (localId.startsWith('api-')) {
      const backendId = parseInt(localId.replace('api-', ''), 10)
      await NotificationService.markAsRead(backendId, vendorId)
    }
  }

  // Initialize
  loadFromStorage()

  return {
    // State
    notifications,
    lastChecked,

    // Computed
    unreadCount,
    sortedNotifications,
    criticalNotifications,

    // Actions
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    checkVatExpiryNotifications,
    addPartialReceivedNotification,
    getVisibleNotifications,
    fetchVendorNotifications,
    markApiNotificationRead,
    loadFromStorage,
  }
})

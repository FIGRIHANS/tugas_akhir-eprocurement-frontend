import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import moment from 'moment'
import type { TaxNotification, NotificationState, NotificationSeverity, NotificationLinkEntityType } from './types'
import { generateNotificationId } from './types'
import { NotificationService, parseUtcNotificationDate } from '@/services/notification.service'

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
    statusApVsFp?: string
    id?: number | string | null
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

  const checkVatMismatchNotifications = (vatData: VATDataItem[]) => {
    let newNotificationsCount = 0

    vatData.forEach((item) => {
      const matchStatus = item.statusApVsFp || ''
      if (matchStatus.toUpperCase().includes('MISMATCH')) {
        const title = `VAT Mismatch Detected`
        const message = `Tax Invoice ${item.noFakturPajak} from ${item.vendorName} has a mismatch with the AP Invoice.`

        const notification = addNotification({
          type: 'vat-mismatch',
          severity: 'warning',
          title,
          message,
          relatedId: item.noFakturPajak,
          relatedData: {
            vendorName: item.vendorName,
            ppn: item.ppn,
            fullItem: item, // Need to pass item for sessionStorage
          },
        })

        if (notification) newNotificationsCount++
      }
    })

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

  const mapApiSeverity = (type: string): NotificationSeverity => {
    switch (type) {
      case 'rejected':
        return 'critical'
      case 'partial-received':
      case 'rc-pending-approval':
        return 'warning'
      default:
        return 'info'
    }
  }

  const mapApiNotification = (n: Awaited<ReturnType<typeof NotificationService.getVendorNotifications>>[number]): TaxNotification => ({
    id: `api-${n.id}`,
    type: (n.type || 'partial-received') as TaxNotification['type'],
    severity: mapApiSeverity(n.type),
    title: n.title,
    message: n.message,
    relatedId: n.relatedId,
    relatedData: { backendId: n.id },
    createdAt: parseUtcNotificationDate(n.createdUtcDate),
    read: n.isRead,
    targetVendorId: n.targetVendorId,
    targetVendorCode: n.targetVendorCode,
    targetEmployeeId: n.targetEmployeeId,
    targetProfileId: n.targetProfileId,
    linkEntityType: n.linkEntityType as NotificationLinkEntityType | undefined,
    linkEntityId: n.linkEntityId,
  })

  /**
   * Get notifications visible to the current user.
   */
  const getVisibleNotifications = (
    currentVendorId?: number,
    currentVendorCode?: string,
    currentEmployeeId?: number,
    currentProfileId?: number,
  ) => {
    const isVendorMode = !!(currentVendorId || currentVendorCode)

    return notifications.value.filter((n) => {
      if (isVendorMode) {
        if (currentVendorId && n.targetVendorId === currentVendorId) return true
        if (currentVendorCode && n.targetVendorCode === currentVendorCode) return true
        return false
      }

      if (n.targetEmployeeId && currentEmployeeId && n.targetEmployeeId === currentEmployeeId) {
        return true
      }

      if (n.targetProfileId && currentProfileId && n.targetProfileId === currentProfileId) {
        return true
      }

      if (
        !n.targetVendorId &&
        !n.targetVendorCode &&
        !n.targetEmployeeId &&
        !n.targetProfileId
      ) {
        return true
      }

      return false
    })
  }

  const getSortedVisibleNotifications = (
    currentVendorId?: number,
    currentVendorCode?: string,
    currentEmployeeId?: number,
    currentProfileId?: number,
  ) =>
    [...getVisibleNotifications(
      currentVendorId,
      currentVendorCode,
      currentEmployeeId,
      currentProfileId,
    )].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )

  /**
   * Fetch vendor notifications from the backend API and merge into the local store.
   * Backend notifications use IDs prefixed with "api-" to distinguish them from
   * localStorage-only notifications.
   */
  const fetchVendorNotifications = async (
    vendorId?: number,
    vendorCode?: string,
    employeeId?: number,
    profileId?: number,
  ) => {
    const apiNotifs = await NotificationService.getVendorNotifications(
      vendorId,
      vendorCode,
      employeeId,
      profileId,
    )

    const existingApiIds = new Set(
      notifications.value.filter((n) => n.id.startsWith('api-')).map((n) => n.id),
    )

    for (const n of apiNotifs) {
      const localId = `api-${n.id}`

      if (existingApiIds.has(localId)) {
        const existing = notifications.value.find((x) => x.id === localId)
        if (existing) {
          const mapped = mapApiNotification(n)
          existing.read = mapped.read
          existing.createdAt = mapped.createdAt
          existing.title = mapped.title
          existing.message = mapped.message
          existing.targetEmployeeId = mapped.targetEmployeeId
          existing.targetProfileId = mapped.targetProfileId
          existing.linkEntityType = mapped.linkEntityType
          existing.linkEntityId = mapped.linkEntityId
          existing.severity = mapped.severity
        }
        continue
      }

      notifications.value.unshift(mapApiNotification(n))
    }

    saveToStorage()
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
    checkVatMismatchNotifications,
    addPartialReceivedNotification,
    getVisibleNotifications,
    getSortedVisibleNotifications,
    fetchVendorNotifications,
    markApiNotificationRead,
    loadFromStorage,
  }
})

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import moment from 'moment'
import type { TaxNotification, NotificationState, NotificationSeverity } from './types'
import { generateNotificationId } from './types'

const STORAGE_KEY = 'tax-notifications'

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
        message = `Faktur Pajak ${item.noFakturPajak} dari ${item.vendorName} akan hangus. Segera kreditkan!`
      } else if (daysLeft <= 7) {
        severity = 'warning'
        title = `VAT Credit Expiring Soon (${daysLeft} days)`
        message = `Faktur Pajak ${item.noFakturPajak} dari ${item.vendorName} akan expired dalam ${daysLeft} hari.`
      } else if (daysLeft <= 30) {
        severity = 'info'
        title = `VAT Credit Reminder (${daysLeft} days left)`
        message = `Faktur Pajak ${item.noFakturPajak} perlu dikreditkan sebelum ${expiry.format('DD/MM/YYYY')}.`
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
    loadFromStorage,
  }
})

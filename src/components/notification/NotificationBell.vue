<template>
  <div class="relative" ref="bellRef">
    <!-- Bell Icon Button -->
    <button
      @click="toggleDropdown"
      class="px-2.5 py-1.5 relative flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
    >
      <i
        class="text-[20px]"
        :class="
          unreadCount > 0 ? 'ki-filled ki-notification text-primary' : 'ki-outline ki-notification'
        "
      ></i>

      <!-- Badge Counter -->
      <span
        v-if="unreadCount > 0"
        class="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full px-1"
      >
        {{ unreadCount > 99 ? '99+' : unreadCount }}
      </span>
    </button>

    <!-- Dropdown Panel -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-[380px] bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden"
      >
        <!-- Header -->
        <div
          class="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center"
        >
          <h3 class="font-semibold text-gray-800">Notifications</h3>
          <div class="flex items-center gap-2">
            <span v-if="unreadCount > 0" class="text-xs text-gray-500">
              {{ unreadCount }} unread
            </span>
            <button
              v-if="visibleNotifications.length > 0"
              @click="markAllAsRead"
              class="text-xs text-primary hover:underline"
            >
              Mark all read
            </button>
          </div>
        </div>

        <!-- Notification List -->
        <div class="max-h-[400px] overflow-y-auto">
          <!-- Empty State -->
          <div v-if="visibleNotifications.length === 0" class="py-12 text-center">
            <i class="ki-outline ki-notification-status text-4xl text-gray-300 mb-3"></i>
            <p class="text-gray-500 text-sm">No notifications</p>
          </div>

          <!-- Notification Items -->
          <div v-else>
            <div
              v-for="notification in visibleNotifications.slice(0, 15)"
              :key="notification.id"
              class="px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
              :class="{ 'bg-teal-50/50': !notification.read }"
            >
              <div class="flex gap-3" @click="handleNotificationClick(notification)">
                <!-- Icon -->
                <div
                  class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  :class="getSeverityBgClass(notification.severity)"
                >
                  <i :class="getSeverityIconClass(notification.severity)"></i>
                </div>

                <!-- Content -->
                <div class="flex-1 min-w-0">
                  <p
                    class="text-sm font-medium text-gray-800 truncate"
                    :class="{ 'font-semibold': !notification.read }"
                  >
                    {{ notification.title }}
                  </p>
                  <p
                    class="text-xs text-gray-500 mt-0.5"
                    :class="expandedId === notification.id ? 'whitespace-pre-line' : 'line-clamp-2'"
                  >
                    {{ notification.message }}
                  </p>
                  <!-- Expand/Collapse toggle -->
                  <button
                    v-if="notification.message && notification.message.length > 100"
                    class="text-[10px] text-primary hover:underline mt-1"
                    @click.stop="toggleExpand(notification.id)"
                  >
                    {{ expandedId === notification.id ? 'Sembunyikan' : 'Lihat selengkapnya' }}
                  </button>
                  <p class="text-[10px] text-gray-400 mt-1">
                    {{ formatTime(notification.createdAt) }}
                  </p>
                </div>

                <!-- Unread Indicator -->
                <div v-if="!notification.read" class="flex-shrink-0">
                  <span class="w-2 h-2 rounded-full bg-primary block"></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div
          v-if="visibleNotifications.length > 0"
          class="px-4 py-3 bg-gray-50 border-t border-gray-200 text-center"
        >
          <button
            @click="openClearModal"
            class="text-xs text-gray-500 hover:text-red-500 transition-colors"
          >
            Clear all notifications
          </button>
        </div>
      </div>
    </Transition>

    <!-- Clear All Confirmation Modal -->
    <ModalConfirmation
      :open="showClearModal"
      id="clear-notifications-modal"
      type="warning"
      title="Clear All Notifications"
      text="Are you sure you want to clear all notifications? This action cannot be undone."
      submit-button-text="Clear All"
      cancel-button-text="Cancel"
      :submit="confirmClearAll"
      :cancel="closeClearModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useNotificationStore } from '@/stores/notification/notificationStore'
import type { TaxNotification, NotificationSeverity } from '@/stores/notification/types'
import ModalConfirmation from '@/components/modal/ModalConfirmation.vue'
import { useLoginStore } from '@/stores/views/login'
import { getUserIdFromToken } from '@/composables/token'
import { NotificationService } from '@/services/notification.service'
import moment from 'moment'

const notificationStore = useNotificationStore()
const loginStore = useLoginStore()
const bellRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)
const showClearModal = ref(false)
const expandedId = ref<string | null>(null)

// Get current user ID from JWT (UserId claim = VendorId for vendors, EmployeeId for internal)
const currentUserId = computed(() => getUserIdFromToken())
const currentVendorCode = computed(() => {
  return loginStore.userData?.profile?.vendorCode || undefined
})
const isVendorUser = computed(() => loginStore.isVendor)

// Computed
const notifications = computed(() => notificationStore.notifications)
const sortedNotifications = computed(() => notificationStore.sortedNotifications)

// Filtered notifications based on current user (vendor or internal)
// For vendors: only show notifications targeted to them (by userId = vendorId)
// For internal users: show non-vendor-targeted notifications
const visibleNotifications = computed(() =>
  notificationStore.getVisibleNotifications(
    isVendorUser.value ? currentUserId.value : undefined,
    isVendorUser.value ? currentVendorCode.value : undefined,
  )
)

// Unread count from visible notifications only
const unreadCount = computed(() => visibleNotifications.value.filter((n) => !n.read).length)

// Toggle dropdown
const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (bellRef.value && !bellRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

// Toggle expand notification message
const toggleExpand = (id: string) => {
  expandedId.value = expandedId.value === id ? null : id
}

// Handle notification click — also syncs read status to backend for API notifications
const handleNotificationClick = async (notification: TaxNotification) => {
  if (notification.id.startsWith('api-') && currentUserId.value) {
    await notificationStore.markApiNotificationRead(notification.id, currentUserId.value)
  } else {
    notificationStore.markAsRead(notification.id)
  }
}

// Mark all as read — also calls backend for vendor users
const markAllAsRead = async () => {
  if (isVendorUser.value && currentUserId.value) {
    await NotificationService.markAllAsRead(currentUserId.value)
  }
  notificationStore.markAllAsRead()
}

// Clear all with modal
const openClearModal = () => {
  showClearModal.value = true
}

const closeClearModal = () => {
  showClearModal.value = false
}

const confirmClearAll = () => {
  notificationStore.clearAll()
  showClearModal.value = false
}

// Format time
const formatTime = (date: Date): string => {
  const now = moment()
  const notifTime = moment(date)
  const diffMinutes = now.diff(notifTime, 'minutes')
  const diffHours = now.diff(notifTime, 'hours')
  const diffDays = now.diff(notifTime, 'days')

  if (diffMinutes < 1) return 'Just now'
  if (diffMinutes < 60) return `${diffMinutes}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return notifTime.format('DD/MM/YYYY')
}

// Severity styling
const getSeverityBgClass = (severity: NotificationSeverity): string => {
  switch (severity) {
    case 'critical':
      return 'bg-red-100'
    case 'warning':
      return 'bg-yellow-100'
    case 'info':
    default:
      return 'bg-teal-100'
  }
}

const getSeverityIconClass = (severity: NotificationSeverity): string => {
  switch (severity) {
    case 'critical':
      return 'ki-filled ki-notification-on text-red-600 text-lg'
    case 'warning':
      return 'ki-filled ki-delivery text-yellow-600 text-lg'
    case 'info':
    default:
      return 'ki-outline ki-notification text-teal-600 text-lg'
  }
}

// Fetch vendor notifications from backend when the vendor identity is ready.
// Using watch with immediate:true so it fires both on mount and if login state
// loads asynchronously after component creation.
watch(
  [isVendorUser, currentUserId],
  async ([isVendor, userId]) => {
    if (isVendor && userId) {
      await notificationStore.fetchVendorNotifications(userId, currentVendorCode.value)
    }
  },
  { immediate: true },
)

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

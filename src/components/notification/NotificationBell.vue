<template>
  <div class="relative" ref="bellRef">
    <button
      @click="toggleDropdown"
      class="px-2.5 py-1.5 relative flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
      aria-label="Notifications"
    >
      <i
        class="text-[20px]"
        :class="
          unreadCount > 0 ? 'ki-filled ki-notification text-primary' : 'ki-outline ki-notification'
        "
      ></i>
      <span
        v-if="unreadCount > 0"
        class="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full px-1"
      >
        {{ unreadCount > 99 ? '99+' : unreadCount }}
      </span>
    </button>

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
        class="absolute right-0 mt-2 w-[420px] bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden"
      >
        <div class="px-4 py-3 bg-gradient-to-r from-slate-50 to-white border-b border-gray-200">
          <div class="flex justify-between items-center">
            <div>
              <h3 class="font-semibold text-gray-900">Notifikasi</h3>
              <p class="text-[11px] text-gray-500 mt-0.5">Pembaruan inbound logistics & finance</p>
            </div>
            <div class="flex items-center gap-2">
              <span v-if="unreadCount > 0" class="text-xs font-medium text-primary">
                {{ unreadCount }} baru
              </span>
              <button
                v-if="visibleNotifications.length > 0"
                @click="markAllAsRead"
                class="text-xs text-primary hover:underline"
              >
                Tandai dibaca
              </button>
            </div>
          </div>
        </div>

        <div class="max-h-[440px] overflow-y-auto">
          <div v-if="visibleNotifications.length === 0" class="py-14 text-center px-6">
            <div class="w-14 h-14 mx-auto mb-3 rounded-full bg-gray-50 flex items-center justify-center">
              <i class="ki-outline ki-notification-status text-3xl text-gray-300"></i>
            </div>
            <p class="text-gray-600 text-sm font-medium">Belum ada notifikasi</p>
            <p class="text-gray-400 text-xs mt-1">Semua pembaruan akan muncul di sini</p>
          </div>

          <div v-else>
            <div
              v-for="notification in visibleNotifications.slice(0, 15)"
              :key="notification.id"
              class="group px-4 py-3 border-b border-gray-100 hover:bg-slate-50 cursor-pointer transition-all border-l-[3px]"
              :class="[
                getMeta(notification.type).accentClass,
                !notification.read ? 'bg-slate-50/80' : 'border-l-transparent',
              ]"
              @click="handleNotificationClick(notification)"
            >
              <div class="flex gap-3 items-start">
                <div
                  class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
                  :class="getMeta(notification.type).categoryClass"
                >
                  <i :class="getNotificationIconClass(notification)"></i>
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-2">
                    <div class="min-w-0 flex-1">
                      <div class="flex items-center gap-2 mb-1">
                        <span
                          class="text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded"
                          :class="getMeta(notification.type).categoryClass"
                        >
                          {{ getMeta(notification.type).category }}
                        </span>
                        <span class="text-[10px] text-gray-400">{{ formatTime(notification.createdAt) }}</span>
                      </div>
                      <p
                        class="text-sm text-gray-900 leading-snug"
                        :class="{ 'font-semibold': !notification.read }"
                      >
                        {{ notification.title }}
                      </p>
                    </div>
                    <div class="flex items-center gap-1.5 flex-shrink-0 pt-1">
                      <span
                        v-if="!notification.read"
                        class="w-2 h-2 rounded-full bg-primary"
                      ></span>
                      <i
                        v-if="isNavigable(notification)"
                        class="ki-outline ki-right text-gray-300 group-hover:text-primary text-xs transition-colors"
                      ></i>
                    </div>
                  </div>

                  <p
                    class="text-xs text-gray-600 mt-1.5 leading-relaxed whitespace-pre-line"
                    :class="expandedId === notification.id ? '' : 'line-clamp-2'"
                  >
                    {{ getPreview(notification.message) }}
                  </p>

                  <button
                    v-if="notification.message.split('\n').filter(Boolean).length > 2"
                    class="text-[10px] text-primary hover:underline mt-1"
                    @click.stop="toggleExpand(notification.id)"
                  >
                    {{ expandedId === notification.id ? 'Sembunyikan' : 'Lihat selengkapnya' }}
                  </button>

                  <p
                    v-if="isNavigable(notification)"
                    class="text-[10px] text-primary/80 mt-2 font-medium"
                  >
                    Ketuk untuk melihat detail →
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="visibleNotifications.length > 0"
          class="px-4 py-3 bg-gray-50 border-t border-gray-200 text-center"
        >
          <button
            @click="openClearModal"
            class="text-xs text-gray-500 hover:text-red-500 transition-colors"
          >
            Hapus semua notifikasi lokal
          </button>
        </div>
      </div>
    </Transition>

    <ModalConfirmation
      :open="showClearModal"
      id="clear-notifications-modal"
      type="warning"
      title="Hapus Semua Notifikasi"
      text="Yakin ingin menghapus semua notifikasi lokal? Notifikasi di server tetap tersimpan."
      submit-button-text="Hapus Semua"
      cancel-button-text="Batal"
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
import {
  getNotificationDisplayMeta,
  getNotificationPreviewLines,
  isInboundNotification,
  resolveNotificationRoute,
} from '@/composables/useNotificationNavigation'
import moment from 'moment'
import { useRouter } from 'vue-router'

const notificationStore = useNotificationStore()
const loginStore = useLoginStore()
const router = useRouter()
const bellRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)
const showClearModal = ref(false)
const expandedId = ref<string | null>(null)

const currentUserId = computed(() => getUserIdFromToken())
const currentProfileId = computed(() => loginStore.userData?.profile?.profileId)
const currentVendorCode = computed(() => loginStore.userData?.profile?.vendorCode || undefined)
const isVendorUser = computed(() => loginStore.isVendor)

const visibleNotifications = computed(() =>
  notificationStore.getSortedVisibleNotifications(
    isVendorUser.value ? currentUserId.value : undefined,
    isVendorUser.value ? currentVendorCode.value : undefined,
    isVendorUser.value ? undefined : currentUserId.value,
    isVendorUser.value ? undefined : currentProfileId.value,
  ),
)

const unreadCount = computed(() => visibleNotifications.value.filter((n) => !n.read).length)

const getMeta = (type: TaxNotification['type']) => getNotificationDisplayMeta(type)
const getPreview = (message: string) => getNotificationPreviewLines(message, 3)

const isNavigable = (notification: TaxNotification) => {
  if (notification.type === 'wht-pending') return true
  return !!resolveNotificationRoute(notification, {
    profileId: currentProfileId.value,
  })
}

const toggleDropdown = async () => {
  const willOpen = !isOpen.value
  isOpen.value = willOpen

  if (willOpen) {
    if (isVendorUser.value && currentUserId.value) {
      await notificationStore.fetchVendorNotifications(currentUserId.value, currentVendorCode.value)
    } else if (!isVendorUser.value && currentUserId.value) {
      await notificationStore.fetchVendorNotifications(
        undefined,
        undefined,
        currentUserId.value,
        currentProfileId.value,
      )
    }
  }
}

const handleClickOutside = (event: MouseEvent) => {
  if (bellRef.value && !bellRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

const toggleExpand = (id: string) => {
  expandedId.value = expandedId.value === id ? null : id
}

const handleNotificationClick = async (notification: TaxNotification) => {
  if (notification.id.startsWith('api-') && currentUserId.value) {
    await notificationStore.markApiNotificationRead(notification.id, currentUserId.value)
  } else {
    notificationStore.markAsRead(notification.id)
  }

  // Finance — VAT (teman)
  if (notification.type === 'vat-mismatch' || notification.type === 'vat-expiry') {
    if (notification.relatedData?.fullItem) {
      sessionStorage.setItem('vatIn_detail_item', JSON.stringify(notification.relatedData.fullItem))
    }
    await router.push(`/vat-in-reconciliation/${notification.relatedId || 0}`)
    isOpen.value = false
    return
  }

  // Finance — WHT pending (teman)
  if (notification.type === 'wht-pending') {
    const whtType = notification.relatedData?.whtType
    if (whtType === 'BPU') {
      sessionStorage.setItem('whtUnifikasi_active_tab', 'pending')
      await router.push('/wht-unifikasi')
    } else if (whtType === 'PPH21') {
      sessionStorage.setItem('whtPasal21_active_tab', 'pending')
      await router.push('/wht-pasal-21')
    }
    isOpen.value = false
    return
  }

  // Inbound logistics — DN / RC / GR / Invoice (kita)
  const route = resolveNotificationRoute(notification, {
    profileId: currentProfileId.value,
  })
  if (route) {
    await router.push(route)
    isOpen.value = false
  }
}

const markAllAsRead = async () => {
  if (isVendorUser.value && currentUserId.value) {
    await NotificationService.markAllAsRead(currentUserId.value)
  }
  notificationStore.markAllAsRead()
}

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

const formatTime = (date: Date): string => {
  const now = moment()
  const notifTime = moment(date)
  const diffMinutes = now.diff(notifTime, 'minutes')
  const diffHours = now.diff(notifTime, 'hours')
  const diffDays = now.diff(notifTime, 'days')

  if (diffMinutes < 1) return 'Baru saja'
  if (diffMinutes < 60) return `${diffMinutes} menit lalu`
  if (diffHours < 24) return `${diffHours} jam lalu`
  if (diffDays < 7) return `${diffDays} hari lalu`
  return notifTime.format('DD MMM YYYY, HH:mm')
}

/** Inbound pakai meta icon; finance pakai override teman; sisanya by severity */
const getNotificationIconClass = (notification: TaxNotification): string => {
  if (notification.type === 'wht-pending') {
    return 'ki-filled ki-document text-orange-500 text-lg'
  }
  if (notification.type === 'vat-mismatch') {
    return 'ki-filled ki-information-2 text-yellow-600 text-lg'
  }
  if (notification.type === 'vat-expiry') {
    return 'ki-filled ki-calendar-2 text-red-500 text-lg'
  }
  if (isInboundNotification(notification.type)) {
    return getMeta(notification.type).iconClass
  }
  return getSeverityIconClass(notification.severity)
}

const getSeverityIconClass = (severity: NotificationSeverity): string => {
  switch (severity) {
    case 'critical':
      return 'ki-filled ki-notification-on text-red-600 text-lg'
    case 'warning':
      return 'ki-filled ki-notification text-yellow-600 text-lg'
    case 'info':
    default:
      return 'ki-outline ki-notification text-teal-600 text-lg'
  }
}

// Fetch vendor notifications from backend when the vendor identity is ready.
// Using watch with immediate:true so it fires both on mount and if login state
// loads asynchronously after component creation.
watch(
  [isVendorUser, currentUserId, currentProfileId],
  async ([isVendor, userId, profileId]) => {
    if (isVendor && userId) {
      await notificationStore.fetchVendorNotifications(userId, currentVendorCode.value)
      return
    }

    if (!isVendor && userId) {
      await notificationStore.fetchVendorNotifications(undefined, undefined, userId, profileId)
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

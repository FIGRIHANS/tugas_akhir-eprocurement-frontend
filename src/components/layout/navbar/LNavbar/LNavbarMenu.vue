<template>
  <a href="#" class="px-2.5 py-1.5 flex items-center gap-1.5 text-primary">
    <i class="ki-duotone ki-calendar text-[20px]"> </i>
    {{ today }}
  </a>
  <a href="#" class="px-2.5 py-1.5 flex items-center gap-1.5 text-primary">
    <i class="ki-duotone ki-book-open text-[20px]"> </i>
    Download Manual Book
  </a>
  <a href="#" class="px-2.5 py-1.5"><i class="ki-outline ki-notification text-[20px]"> </i></a>

  <div class="menu menu-default p-0" data-menu="true">
    <div
      class="menu-item"
      data-menu-item-placement="bottom-start"
      data-menu-item-toggle="dropdown"
      data-menu-item-trigger="click"
      data-menu-item-permanent="true"
    >
      <button class="menu-toggle btn btn-light text-gray-600 border-0 flex items-center">
        <span class="text-base font-semibold"> {{ selectedLanguage }} </span>
        <i class="ki-filled ki-down text-[20px]"></i>
      </button>
      <div class="menu-dropdown w-48 py-2">
        <div class="menu-item" @click="changeLocale('id')">
          <a class="menu-link" href="#">
            <span class="menu-icon">
              <i class="ki-outline ki-profile-circle"> </i>
            </span>
            <span class="menu-title"> Indonesia (ID) </span>
          </a>
        </div>
        <div class="menu-item" @click="changeLocale('en')">
          <a class="menu-link" href="#">
            <span class="menu-icon">
              <IconEN />
            </span>
            <span class="menu-title"> English (EN) </span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import moment from 'moment'

import IconEN from '@/components/icons/IconEN.vue'

const { locale } = useI18n({ useScope: 'global' })

/**TODO - Add isLoggedIn condit */

/**
 * SECTION: Timer
 */
const momentRef = ref<string>(moment())
const timeInterval = ref()

const selectedLanguage = computed(() => locale.value.toUpperCase())

const changeLocale = (value: 'id' | 'en') => {
  locale.value = value
}

onMounted(() => {
  timeInterval.value = setInterval(updateTime, 1000)
})

const updateTime = () => {
  momentRef.value = moment().subtract(0, 'seconds')
}

const today = computed(() => {
  const now = moment(momentRef.value).format('MMM D, YYYY | HH:mm:ss')
  const timezone = moment(momentRef.value).format('Z').substring(0, 3)

  return `${now} GMT${timezone}`
})

onUnmounted(() => {
  clearInterval(timeInterval.value)
})
/**!SECTION */
</script>

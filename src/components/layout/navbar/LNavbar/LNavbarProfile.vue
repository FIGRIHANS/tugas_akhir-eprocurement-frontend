<template>
  <div
    v-if="route.name !== 'landing-page'"
    class="dropdown"
    data-dropdown="true"
    data-dropdown-trigger="click"
  >
    <!-- <div class="size-10 rounded-full inline-flex items-center justify-center text-[11px] font-semibold border border-primary-clarity bg-primary text-white">
      Aa
    </div> -->
    <button
      class="dropdown-toggle size-10 rounded-full inline-flex items-center justify-center border border-teal-100 bg-teal-50 text-teal-600 hover:bg-teal-100 hover:text-teal-700 hover:border-teal-200 transition-all duration-300 p-0 shadow-sm focus:outline-none"
    >
      <i class="ki-duotone ki-profile-circle text-2xl"></i>
    </button>
    <div class="dropdown-content w-full max-w-56 p-4">
      <div class="menu menu-default flex flex-col w-full gap-2">
        <div class="flex flex-col px-1.5 py-1 border-b border-gray-100 pb-3">
          <span class="font-bold text-gray-800 text-sm">
            {{
              !isEmpty(userData)
                ? userData.profile.employeeName || userData.profile.vendorName
                : ''
            }}
          </span>
          <span class="text-xs text-gray-500 mt-1 font-medium">
            {{
              !isEmpty(userData)
                ? userData.profile.employeeName
                  ? userData.profile.positionName || userData.profile.profileName || 'Staff'
                  : userData.profile.vendorName
                : ''
            }}
          </span>
        </div>
        <div class="menu-item mt-1">
          <a class="menu-link !px-[8px] !py-[6px] rounded-lg hover:bg-slate-50 flex items-center gap-2" href="#" @click="logout">
            <i class="ki-filled ki-entrance-right text-gray-400 text-lg"></i>
            <span class="menu-title font-medium text-gray-600"> Log Out </span>
          </a>
        </div>
      </div>
    </div>
  </div>

  <template v-else>
    <UiButton
      outline
      variant="primary"
      size="lg"
      @click="
        router.push({
          name: 'registration',
        })
      "
    >
      Register
      <UiIcon variant="duotone" name="menu" />
    </UiButton>
    <button
      class="btn btn-lg btn-primary"
      @click="
        router.push({
          name: 'login',
        })
      "
    >
      Sign In
      <UiIcon variant="duotone" name="entrance-left" />
    </button>
  </template>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useLoginStore } from '@/stores/views/login'
import { isEmpty } from 'lodash'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'

const loginApi = useLoginStore()
const router = useRouter()
const route = useRoute()

const userData = computed(() => loginApi.userData)

const profileInitial = computed(() => {
  if (isEmpty(userData.value)) return 'U'

  const name = userData.value.profile?.employeeName || userData.value.profile?.vendorName || ''

  // Split name into words and get first letter of first and last word
  const words = name.trim().split(/\s+/)
  if (words.length >= 2) {
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase()
  }

  return name.charAt(0).toUpperCase() || 'U'
})

const logout = () => {
  loginApi.clearUserData()
  document.cookie = `session_data=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict`
}
</script>

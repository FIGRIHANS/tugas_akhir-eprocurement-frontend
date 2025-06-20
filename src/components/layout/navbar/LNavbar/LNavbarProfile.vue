<template>
  <div v-if="route.name !== 'landing-page'" class="dropdown" data-dropdown="true" data-dropdown-trigger="click">
    <!-- <div class="size-10 rounded-full inline-flex items-center justify-center text-[11px] font-semibold border border-primary-clarity bg-primary text-white">
      Aa
    </div> -->
    <button
      class="dropdown-toggle btn btn-light size-10 rounded-full inline-flex items-center justify-center text-[11px] font-semibold border border-primary-clarity bg-primary hover:bg-primary hover:text-white text-white"
    >
      Aa
    </button>
    <div class="dropdown-content w-full max-w-56 p-4">
      <div class="menu menu-default flex flex-col w-full">
        <div class="menu-item">
          <p class="mb-[14px]">Hi, {{ userData?.profile.employeeName }}</p>
          <a class="menu-link !px-[5px] !mx-[0px]" href="#" @click="logout">
            <span class="menu-title">
              Log Out
            </span>
          </a>
        </div>
      </div>
    </div>
  </div>

  <template v-else>
    <UiButton outline variant="dark" size="lg" @click="router.push('/registration')">
      Register
      <UiIcon variant="duotone" name="menu" />
    </UiButton>
    <button class="btn btn-lg btn-dark" @click="router.push('/login')">
      Sign In
      <UiIcon variant="duotone" name="entrance-left" />
    </button>
  </template>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useLoginStore } from '@/stores/views/login'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'

const loginApi = useLoginStore()
const router = useRouter()
const route = useRoute()

const userData = computed(() => loginApi.userData)

const logout = () => {
  loginApi.clearUserData()
  document.cookie = `session_data=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; Secure; SameSite=Strict`
}
</script>

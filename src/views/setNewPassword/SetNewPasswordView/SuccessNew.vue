<template>
  <div class="mt-[24px]">
    <div
      class="border bg-green-100 border-green-500 rounded-lg py-[17px] px-[14px] flex gap-[16px]"
    >
      <i class="ki-duotone ki-shield-tick text-[34px] text-green-500"></i>
      <div>
        <p class="font-semibold">{{ $t('login.setNewPassword.success.title') }}</p>
        <p class="text-green-500 font-medium leading-[14px] mt-[4px]">
          {{ $t('login.setNewPassword.success.message') }}
        </p>
      </div>
    </div>
    <button class="btn btn-primary mt-[24px] w-full justify-center" @click="goBack">
      {{ $t('login.setNewPassword.success.loginButton') }}
    </button>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { useLoginStore } from '@/stores/views/login'
import { useForgotPasswordStore } from '@/stores/views/forgot-password'

const loginApi = useLoginStore()
const forgotPasswordStore = useForgotPasswordStore()
const router = useRouter()

const goBack = () => {
  // Reset all states
  loginApi.isSendNewPassword = false
  // loginApi.selectedLogin = 'vendor'
  forgotPasswordStore.resetState()

  if (loginApi.loginRole === 'vendor') {
    loginApi.selectedLogin = 'vendor'
  } else {
    loginApi.selectedLogin = 'admin'
  }

  router.push({
    name: 'login',
  })
}
</script>

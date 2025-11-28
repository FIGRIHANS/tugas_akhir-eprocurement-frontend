<template>
  <div class="mt-[24px]">
    <div
      v-if="!isFailed"
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
    <div
      v-else
      class="border bg-red-100 border-red-500 rounded-lg py-[17px] px-[14px] flex gap-[16px]"
    >
      <i class="ki-duotone ki-shield-cross text-[34px] text-red-500"></i>
      <div>
        <p class="font-semibold">{{ $t('login.setNewPassword.failed.title') }}</p>
        <p class="text-red-500 font-medium leading-[14px] mt-[4px]">
          {{ $t('login.setNewPassword.failed.message') }}
          <!-- <br />
          {{ forgotPasswordStore.sendNewPasswordResponse?.result?.message }} -->
        </p>
      </div>
    </div>
    <button class="btn btn-primary mt-[24px] w-full justify-center" @click="goBack">
      {{ $t('login.setNewPassword.failed.loginButton') }}
    </button>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { useLoginStore } from '@/stores/views/login'
import { useForgotPasswordStore } from '@/stores/views/forgot-password'
import { computed } from 'vue'

const loginApi = useLoginStore()
const forgotPasswordStore = useForgotPasswordStore()
const router = useRouter()
const isFailed = computed(() => forgotPasswordStore.sendNewPasswordResponse?.result?.isError)

const goBack = () => {
  if (isFailed.value) {
    forgotPasswordStore.isPasswordReset = false
    loginApi.isSendNewPassword = false
  } else {
    // Reset all states
    loginApi.isSendNewPassword = false
    // loginApi.selectedLogin = 'vendor'
    forgotPasswordStore.resetState()

    // if (loginApi.loginRole === 'vendor') {
    //   loginApi.selectedLogin = 'vendor'
    // } else {
    //   loginApi.selectedLogin = 'admin'
    // }

    loginApi.selectedLogin = ''

    router.push({
      name: 'login',
    })
  }
}
</script>

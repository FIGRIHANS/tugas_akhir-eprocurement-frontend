<template>
  <div class="mt-[24px]">
    <!-- {{ forgotPasswordStore }} -->
    <div
      v-if="!isFailed"
      class="border bg-green-100 border-green-500 rounded-lg py-[17px] px-[14px] flex gap-[16px]"
    >
      <i class="ki-duotone ki-shield-tick text-[34px] text-green-500"></i>
      <div>
        <p class="font-semibold">{{ $t('login.forgot.success.title') }}</p>
        <p class="text-green-500 font-medium text-sm leading-[16px] mt-[4px]">
          {{ $t('login.forgot.success.message') }}
        </p>
      </div>
    </div>
    <div
      v-else
      class="border bg-red-100 border-red-500 rounded-lg py-[17px] px-[14px] flex gap-[16px]"
    >
      <i class="ki-duotone ki-shield-cross text-[34px] text-red-500"></i>
      <div>
        <p class="font-semibold">{{ $t('login.forgot.failed.title') }}</p>
        <p class="text-red-500 font-medium text-sm leading-[16px] mt-[4px]">
          {{ $t('login.forgot.failed.message') }}
        </p>
      </div>
    </div>
    <button class="btn btn-primary mt-[24px] w-full justify-center" @click="goBack">
      {{ $t('login.forgot.failed.backButton') }}
    </button>
  </div>
</template>

<script lang="ts" setup>
import { useLoginStore } from '@/stores/views/login'
import { useForgotPasswordStore } from '@/stores/views/forgot-password'
import { computed } from 'vue'

const loginStore = useLoginStore()
const forgotPasswordStore = useForgotPasswordStore()

const isFailed = computed(() => forgotPasswordStore.resetPasswordResponse?.result?.isError)

const goBack = () => {
  forgotPasswordStore.resetState()

  loginStore.isSendForgot = false

  if (loginStore.loginRole === 'vendor') {
    loginStore.selectedLogin = 'vendor'
  } else {
    loginStore.selectedLogin = 'admin'
  }
}
</script>

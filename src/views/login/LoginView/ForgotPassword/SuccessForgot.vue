<template>
  <div class="mt-[24px]">
    <div
      class="border bg-green-100 border-green-500 rounded-lg py-[17px] px-[14px] flex gap-[16px]"
    >
      <i class="ki-duotone ki-shield-tick text-[34px] text-green-500"></i>
      <div>
        <p class="font-semibold">{{ $t('login.forgot.success.title') }}</p>
        <p class="text-green-500 font-medium leading-[14px] mt-[4px]">
          {{ $t('login.forgot.success.message') }}
        </p>
      </div>
    </div>
    <button class="btn btn-primary mt-[24px] w-full justify-center" @click="goBack">
      {{ $t('login.forgot.success.backButton') }}
    </button>
  </div>
</template>

<script lang="ts" setup>
import { useLoginStore } from '@/stores/views/login'
import { useForgotPasswordStore } from '@/stores/views/forgot-password'

const loginStore = useLoginStore()
const forgotPasswordStore = useForgotPasswordStore()

const goBack = () => {
  forgotPasswordStore.resetState()

  loginStore.isSendForgot = false
  loginStore.selectedLogin = 'vendor'
}
</script>

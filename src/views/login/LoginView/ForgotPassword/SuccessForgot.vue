<template>
  <div class="mt-[24px]">
    <div class="border bg-green-100 border-green-500 rounded-lg py-[17px] px-[14px] flex gap-[16px]">
      <i class="ki-duotone ki-shield-tick text-[34px] text-green-500"></i>
      <div>
        <p class="font-semibold">Email Sent</p>
        <p class="text-green-500 font-medium leading-[14px] mt-[4px]">
          We have sent a link to create a new password to your email address, please open your email and follow the instructions in your email!
        </p>
      </div>
    </div>
    <button class="btn btn-primary mt-[24px] w-full justify-center" @click="goBack">
      Back
    </button>
  </div>
</template>

<script lang="ts" setup>
import { useLoginStore } from '@/stores/views/login'

const loginApi = useLoginStore()

const goBack = () => {
  loginApi.isSendForgot = false
  loginApi.selectedLogin = 'vendor'
}
</script>

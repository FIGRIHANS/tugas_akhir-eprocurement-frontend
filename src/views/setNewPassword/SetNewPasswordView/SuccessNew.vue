<template>
  <div class="mt-[24px]">
    <div class="border bg-green-100 border-green-500 rounded-lg py-[17px] px-[14px] flex gap-[16px]">
      <i class="ki-duotone ki-shield-tick text-[34px] text-green-500"></i>
      <div>
        <p class="font-semibold">Success!</p>
        <p class="text-green-500 font-medium leading-[14px] mt-[4px]">
          You have just changed your password, please log in again using the new password!
        </p>
      </div>
    </div>
    <button class="btn btn-primary mt-[24px] w-full justify-center" @click="goBack">
      login
    </button>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { useLoginStore } from '@/stores/views/login'

const loginApi = useLoginStore()
const router = useRouter() 

const goBack = () => {
  loginApi.isSendNewPassword = false
  loginApi.selectedLogin = 'vendor'
  router.push({
    name: 'login'
  })
}
</script>

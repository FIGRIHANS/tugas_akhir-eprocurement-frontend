<template>
  <div class="flex p-[20px] h-screen">
    <!-- left -->
    <div class="flex-1 flex flex-col gap-[8px] relative">
      <div class="absolute flex items-center gap-[2px] cursor-pointer" @click="goBack">
        <i class="ki-filled ki-left text-gray-500"></i>
        Back
      </div>
      <div class="flex justify-center items-center flex-1">
        <div class="max-w-[343px] border border-grey-200 rounded-xl p-[40px] h-fit">
          <p class="m-0 text-center text-lg font-medium">
            Enter New Password
          </p>
          <FormNew v-if="!loginApi.isSendNewPassword" />
          <SuccessNew v-else />
        </div>
      </div>
      <div class="flex gap-[6px] justify-center text-gray-600">
        <a href="#">Legal</a>
        <span class="rounded-full bg-gray-600 w-[4px] h-[4px] my-auto mx-[5px]">&nbsp;</span>
        <a href="#">Contact</a>
        <span class="rounded-full bg-gray-600 w-[4px] h-[4px] my-auto mx-[5px]">&nbsp;</span>
        <a href="#">Term</a>
      </div>
    </div>

    <!-- right -->
    <div class="flex-1">
      <div class="rounded-xl bg-primary-light h-full flex flex-col justify-between items-center gap-[8px]">
        <logoLogin class="mt-[30px]" />
        <loginView />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useLoginStore } from '@/stores/views/login'
import loginView from '@/assets/svg/LoginImage.vue'
import logoLogin from '@/assets/svg/LogoLogin.vue'

const FormNew = defineAsyncComponent(() => import('./SetNewPasswordView/FormNew.vue'))
const SuccessNew = defineAsyncComponent(() => import('./SetNewPasswordView/SuccessNew.vue'))

const loginApi = useLoginStore()
const router = useRouter() 

const goBack = () => {
  loginApi.selectedLogin = 'vendor'
  router.push({
    name: 'login'
  })
}
</script>
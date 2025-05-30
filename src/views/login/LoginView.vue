<template>
  <div class="flex p-[20px] h-screen">
    <!-- left -->
    <div class="flex-1 flex flex-col gap-[8px]">
      <div class="flex justify-center items-center flex-1">
        <BranchLogin v-if="!checkSelected()" />
        <LoginPage v-if="checkSelected()" />
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
import { defineAsyncComponent, onMounted } from 'vue'
import { useLoginStore } from '@/stores/views/login'
import loginView from '@/assets/svg/LoginImage.vue'
import logoLogin from '@/assets/svg/LogoLogin.vue'

const BranchLogin = defineAsyncComponent(() => import('./LoginView/BranchLogin.vue'))
const LoginPage = defineAsyncComponent(() => import('./LoginView/loginPage.vue'))

const loginApi = useLoginStore()

const checkSelected = () => {
  return loginApi.selectedLogin
}

onMounted(() => {
  loginApi.selectedLogin = ''
})
</script>
<template>
  <div class="flex flex-col gap-[14px]">
    <div
      class="bg-gray-100 rounded-lg flex items-center gap-[16px] py-[19px] px-[14px] cursor-pointer"
      @click="setLogin('admin')"
    >
      <i class="ki-duotone ki-user text-4xl text-primary"></i>
      <div class="flex-1 w-[306px]">
        <p class="font-semibold text-[15px]">{{ $t('login.branch.adminTitle') }}</p>
        <p class="font-medium text-[13px] text-gray-700">{{ $t('login.branch.adminDesc') }}</p>
      </div>
      <i class="ki-duotone ki-right text-xl"></i>
    </div>
    <div
      class="bg-gray-100 rounded-lg flex items-center gap-[16px] py-[19px] px-[14px] cursor-pointer"
      @click="setLogin('vendor')"
    >
      <i class="ki-duotone ki-shop text-4xl text-primary"></i>
      <div class="flex-1 w-[306px]">
        <p class="font-semibold text-[15px]">{{ $t('login.branch.vendorTitle') }}</p>
        <p class="font-medium text-[13px] text-gray-700">{{ $t('login.branch.vendorDesc') }}</p>
      </div>
      <i class="ki-duotone ki-right text-xl"></i>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useLoginStore } from '@/stores/views/login'

const loginApi = useLoginStore()

const setLogin = (name: string) => {
  loginApi.selectedLogin = name
}
</script>

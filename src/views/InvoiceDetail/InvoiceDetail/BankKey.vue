<template>
  <div v-if="form" class="card">
    <div class="card-header py-[17px] flex items-center justify-between gap-[8px]">
      <h3 class="card-title text-base font-semibold">Payment Information</h3>
      <input v-if="isNeedCheck" v-model="form.bankKeyCheck" class="checkbox" type="checkbox"/>
    </div>
    <div v-if="isNonPo" class="tabs">
      <button class="tab flex-1 justify-center" :class="{ 'active': tabActive === 'payment' }" @click="tabActive = 'payment'">
        Payment Information
      </button>
      <button class="tab flex-1 justify-center" :class="{ 'active': tabActive === 'alternative' }" @click="tabActive = 'alternative'">
        Alternative Payment
      </button>
    </div>
    <div class="card-body">
      <div v-show="tabActive === 'payment'" class="flex flex-col gap-[20px]">
        <div class="flex items-center justify-between gap-[10px]">
          <p class="font-normal text-sm text-gray-600">Bank Key</p>
          <p class="font-normal text-sm">{{ form.bankKey }}</p>
        </div>
        <div class="flex items-center justify-between gap-[10px]">
          <p class="font-normal text-sm text-gray-600">Bank Name</p>
          <p class="font-normal text-sm">{{ form.bankName }}</p>
        </div>
        <div class="flex items-center justify-between gap-[10px]">
          <p class="font-normal text-sm text-gray-600">Beneficiary Name</p>
          <p class="font-normal text-sm">{{ form.beneficiaryName }}</p>
        </div>
        <div class="flex items-center justify-between gap-[10px]">
          <p class="font-normal text-sm text-gray-600">Bank Account Number</p>
          <p class="font-normal text-sm">{{ form.bankAccountNo }}</p>
        </div>
        <div class="flex items-center justify-between gap-[10px]">
          <p class="font-normal text-sm text-gray-600">Bank Country</p>
          <p class="font-normal text-sm">{{ form.bankCountryCode }}</p>
        </div>
      </div>
      <div v-show="tabActive === 'alternative'" class="flex flex-col gap-[20px]">
        <div class="flex items-center justify-between gap-[10px]">
          <p class="font-normal text-sm text-gray-600">Type</p>
          <p class="font-normal text-sm">Alternative Payee</p>
        </div>
        <div class="flex items-center justify-between gap-[10px]">
          <p class="font-normal text-sm text-gray-600">Name</p>
          <p class="font-normal text-sm">Ali Imran</p>
        </div>
        <div class="flex items-center justify-between gap-[10px]">
          <p class="font-normal text-sm text-gray-600">Name 2</p>
          <p class="font-normal text-sm">Amelia Nina</p>
        </div>
        <div class="flex items-center justify-between gap-[10px]">
          <p class="font-normal text-sm text-gray-600">Street</p>
          <p class="font-normal text-sm">Jl. Mangrove 12, Jakarta Selatan</p>
        </div>
        <div class="flex items-center justify-between gap-[10px]">
          <p class="font-normal text-sm text-gray-600">City</p>
          <p class="font-normal text-sm">Jakarta Selatan</p>
        </div>
        <div class="flex items-center justify-between gap-[10px]">
          <p class="font-normal text-sm text-gray-600">Country</p>
          <p class="font-normal text-sm">Indonesia</p>
        </div>
        <div class="flex items-center justify-between gap-[10px]">
          <p class="font-normal text-sm text-gray-600">Bank Account Number</p>
          <p class="font-normal text-sm">32876487</p>
        </div>
        <div class="flex items-center justify-between gap-[10px]">
          <p class="font-normal text-sm text-gray-600">Bank Key</p>
          <p class="font-normal text-sm">192</p>
        </div>
        <div class="flex items-center justify-between gap-[10px]">
          <p class="font-normal text-sm text-gray-600">Bank Country</p>
          <p class="font-normal text-sm">Indonesia</p>
        </div>
        <div class="flex items-center justify-between gap-[10px]">
          <p class="font-normal text-sm text-gray-600">No. NPWP</p>
          <p class="font-normal text-sm">2387928473264</p>
        </div>
        <div class="flex items-center justify-between gap-[10px]">
          <p class="font-normal text-sm text-gray-600">No. KTP</p>
          <p class="font-normal text-sm">5201011212120003</p>
        </div>
        <div class="flex items-center justify-between gap-[10px]">
          <p class="font-normal text-sm text-gray-600">Email</p>
          <p class="font-normal text-sm">alibaba@mail.com</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, inject } from 'vue'
import type { formTypes } from '../types/invoiceDetail'

defineProps<{
  isNeedCheck: boolean
}>()

const form = inject<formTypes>('form')
const tabActive = ref<string>('payment')
const isNonPo = ref<boolean>(false)

</script>

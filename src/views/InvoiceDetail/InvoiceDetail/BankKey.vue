<template>
  <div v-if="form" class="card">
    <div class="card-header py-[17px] flex items-center justify-between gap-[8px]">
      <h3 class="card-title text-base font-semibold">Payment Information</h3>
      <input v-model="form.bankKeyCheck" class="checkbox" type="checkbox"/>
    </div>
    <div class="card-body">
      <div v-if="!form.isNotRegisteredBank" class="flex flex-col gap-[20px]">
        <div class="flex items-center justify-between gap-[10px]">
          <p class="font-normal text-sm text-gray-600">Bank Key</p>
          <p class="font-normal text-sm">{{ form.bankKeyId }}</p>
        </div>
        <div class="flex items-center justify-between gap-[10px]">
          <p class="font-normal text-sm text-gray-600">Bank Name</p>
          <p class="font-normal text-sm">{{ form.bankNameId }}</p>
        </div>
        <div class="flex items-center justify-between gap-[10px]">
          <p class="font-normal text-sm text-gray-600">Beneficiary Name</p>
          <p class="font-normal text-sm">{{ form.beneficiaryName }}</p>
        </div>
        <div class="flex items-center justify-between gap-[10px]">
          <p class="font-normal text-sm text-gray-600">Bank Account Number</p>
          <p class="font-normal text-sm">{{ form.bankAccountNumber }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import type { formTypes } from '../types/invoiceDetail'

const form = inject<formTypes>('form')
</script>

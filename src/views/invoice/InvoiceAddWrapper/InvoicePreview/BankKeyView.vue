<template>
  <div v-if="form" class="flex flex-col gap-[24px]">
    <p class="text-lg font-semibold m-[0px]">Bank Key</p>
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <p class="text-xs font-normal text-gray-700">Bank Key</p>
        <p class="text-sm font-medium">{{ form.bankKeyId || '-' }}</p>
      </div>
      <div class="flex-1">
        <p class="text-xs font-normal text-gray-700">Bank Name</p>
        <p class="text-sm font-medium whitespace-nowrap">{{ form.bankNameId || '-' }}</p>
      </div>
    </div>
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <p class="text-xs font-normal text-gray-700">Beneficiary Name</p>
        <p class="text-sm font-medium">{{ form.beneficiaryName || '-' }}</p>
      </div>
      <div class="flex-1">
        <p class="text-xs font-normal text-gray-700">Bank Account Number</p>
        <p class="text-sm font-medium whitespace-nowrap">{{ form.bankAccountNumber || '-' }}</p>
      </div>
    </div>
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <p class="text-xs font-normal text-gray-700">SWIFT Code</p>
        <p class="text-sm font-medium">{{ form.swiftCode || '-' }}</p>
      </div>
      <div class="flex-1">
        <p class="text-xs font-normal text-gray-700">Bank Address</p>
        <p class="text-sm font-medium whitespace-nowrap">{{ form.bankAddress || '-' }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import type { formTypes } from '../../types/invoiceAddWrapper'

const form = inject<formTypes>('form')
</script>

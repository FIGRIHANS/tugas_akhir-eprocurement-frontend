<template>
  <div v-if="form" class="flex flex-col gap-[20px]">
    <p class="text-base font-semibold">Payment Information</p>
    <div>
      <p class="text-xs font-normal text-gray-700">Bank Key</p>
      <p class="text-sm font-medium">{{ form.bankKeyId || '-' }}</p>
    </div>
    <div>
      <p class="text-xs font-normal text-gray-700">Bank Name</p>
      <p class="text-sm font-medium">{{ form.bankNameId || '-' }}</p>
    </div>
    <div>
      <p class="text-xs font-normal text-gray-700">Beneficiary Name</p>
      <p class="text-sm font-medium">{{ form.beneficiaryName || '-' }}</p>
    </div>
    <div>
      <p class="text-xs font-normal text-gray-700">Bank Account Number</p>
      <p class="text-sm font-medium">{{ form.bankAccountNumber || '-' }}</p>
    </div>
    <div>
      <p class="text-xs font-normal text-gray-700">SWIFT Code</p>
      <p class="text-sm font-medium">{{ form.swiftCode || '-' }}</p>
    </div>
    <div>
      <p class="text-xs font-normal text-gray-700">Bank Address</p>
      <p class="text-sm font-medium">{{ form.bankAddress || '-' }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import type { formTypes } from '../../types/invoiceAddWrapper'

const form = inject<formTypes>('form')
</script>

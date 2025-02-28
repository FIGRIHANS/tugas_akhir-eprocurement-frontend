<template>
  <div v-if="form" class="flex flex-col gap-[20px]">
    <p class="text-base font-semibold">General Data</p>
    <div>
      <p class="text-xs font-normal text-gray-700">Company</p>
      <p class="text-sm font-medium">{{ form.companyId || '-' }}</p>
    </div>
    <div>
      <p class="text-xs font-normal text-gray-700">Vendor</p>
      <p class="text-sm font-medium">{{ form.vendorId || '-' }}</p>
    </div>
    <div>
      <p class="text-xs font-normal text-gray-700">Bill To Company</p>
      <p class="text-sm font-medium">{{ form.billToCompany || '-' }}</p>
    </div>
    <div>
      <p class="text-xs font-normal text-gray-700">Bill To Vendor</p>
      <p class="text-sm font-medium">{{ form.billToVendor || '-' }}</p>
    </div>
    <div>
      <p class="text-xs font-normal text-gray-700">Vendor Tax ID</p>
      <p class="text-sm font-medium">{{ form.vendorTaxId || '-' }}</p>
    </div>
    <div>
      <p class="text-xs font-normal text-gray-700">Address</p>
      <p class="text-sm font-medium">{{ form.address || '-' }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import type { formTypes } from '../../types/invoiceAddWrapper'

const form = inject<formTypes>('form')
</script>

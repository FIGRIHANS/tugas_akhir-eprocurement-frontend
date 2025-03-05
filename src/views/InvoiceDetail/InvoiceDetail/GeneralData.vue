<template>
  <div class="card">
    <div class="card-header py-[17px]">
      <h3 class="card-title text-base font-semibold">General Data</h3>
    </div>
    <div v-if="form" class="card-body flex flex-col gap-[20px]">
      <div class="flex items-center justify-between gap-[10px]">
        <p class="font-normal text-sm text-gray-600">Company</p>
        <p class="font-normal text-sm">{{ form.companyId }}</p>
      </div>
      <div class="flex items-center justify-between gap-[10px]">
        <p class="font-normal text-sm text-gray-600">Vendor</p>
        <p class="font-normal text-sm">{{ form.vendorId }}</p>
      </div>
      <div class="flex items-center justify-between gap-[10px]">
        <p class="font-normal text-sm text-gray-600">Address</p>
        <p class="font-normal text-sm">{{ form.address }}</p>
      </div>
      <div class="flex items-center justify-between gap-[10px]">
        <p class="font-normal text-sm text-gray-600">Vendor Tax ID</p>
        <p class="font-normal text-sm">{{ form.vendorTaxId }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import type { formTypes } from '../types/invoiceDetail'

const form = inject<formTypes>('form')
</script>

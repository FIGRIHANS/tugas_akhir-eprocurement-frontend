<template>
  <div v-if="form" class="card">
    <div class="card-header py-[17px] flex items-center justify-between gap-[8px]">
      <h3 class="card-title text-base font-semibold">General Data</h3>
      <input v-model="form.generalDataCheck" class="checkbox" type="checkbox"/>
    </div>
    <div class="card-body flex flex-col gap-[20px]">
      <div class="flex items-center justify-between gap-[10px]">
        <p class="font-normal text-sm text-gray-600">Vendor Name</p>
        <p class="font-normal text-sm">{{ form.vendorName || '-' }}</p>
      </div>
      <div class="flex items-center justify-between gap-[10px]">
        <p class="font-normal text-sm text-gray-600">Address</p>
        <p class="font-normal text-sm">{{ form.vendorAddress || '-' }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import type { formTypes } from '../types/invoiceDetail'

const form = inject<formTypes>('form')
</script>

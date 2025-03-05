<template>
  <div v-if="form">
    <p class="text-base font-semibold mb-[20px]">General Data</p>
    <div class="flex flex-col gap-[30px]">
      <div>
        <p class="text-xs font-normal text-gray-700">Vendor</p>
        <p class="text-sm font-medium">{{ form.vendorId || '-' }}</p>
      </div>
      <div>
        <p class="text-xs font-normal text-gray-700">Bidang Usaha</p>
        <p class="text-sm font-medium">{{ form.businessField || '-' }}</p>
      </div>
      <div>
        <p class="text-xs font-normal text-gray-700">Sub Bidang Usaha</p>
        <p class="text-sm font-medium">{{ form.subBusinessField || '-' }}</p>
      </div>
      <div>
        <p class="text-xs font-normal text-gray-700">Address</p>
        <p class="text-sm font-medium">{{ form.address || '-' }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import type { formTypes } from '../../types/invoiceAddWrapper'

const form = inject<formTypes>('form')
</script>

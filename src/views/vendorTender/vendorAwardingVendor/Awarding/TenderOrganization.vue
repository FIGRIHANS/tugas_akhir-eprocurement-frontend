<template>
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">
        Tender Organization
      </h3>
    </div>
    <div class="card-body">
      <div class="flex align-items-center justify-between gap-[8px] text-sm mb-[20px]">
        <p class="text-gray-600">Plant</p>
        <p class="font-medium">{{ organization?.plant || '-' }}</p>
      </div>
      <div class="flex align-items-center justify-between gap-[8px] text-sm mb-[20px]">
        <p class="text-gray-600">Company Code</p>
        <p class="font-medium">{{ organization?.companyCode || '-' }}</p>
      </div>
      <div class="flex align-items-center justify-between gap-[8px] text-sm mb-[20px]">
        <p class="text-gray-600">Method</p>
        <p class="font-medium">{{ organization?.method || '-' }}</p>
      </div>
      <div class="flex align-items-center justify-between gap-[8px] text-sm">
        <p class="text-gray-600">PIC Tender</p>
        <p class="font-medium">{{ organization?.picTender || '-' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import {
    inject
  } from 'vue'

  interface OrganizationType {
    plant: string
    companyCode: string
    method: string
    picTender: string
  }

  const organization = inject < OrganizationType > ('organization')
</script>

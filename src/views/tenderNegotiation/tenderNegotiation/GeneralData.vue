<template>
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">
        Tender General Data
      </h3>
    </div>
    <div class="card-body">
      <div class="flex align-items-center justify-between gap-[8px] text-sm mb-[20px]">
        <p class="text-gray-600">Tender Req ID</p>
        <p>1000000</p>
      </div>
      <div class="flex align-items-center justify-between gap-[8px] text-sm mb-[20px]">
        <p class="text-gray-600">Tender Status</p>
        <p>SAP Completed</p>
      </div>
      <div class="flex align-items-center justify-between gap-[8px] text-sm mb-[20px]">
        <p class="text-gray-600">PR Category</p>
        <p>MRP</p>
      </div>
      <div class="flex align-items-center justify-between gap-[8px] text-sm mb-[20px]">
        <p class="text-gray-600">Evaluation Object</p>
        <p>E1</p>
      </div>
      <div class="flex align-items-center justify-between gap-[8px] text-sm mb-[20px]">
        <p class="text-gray-600 form-label h-fit self-center">Tender Start Date</p>
        <p class="whitespace-nowrap">{{ moment().format('DD MMM YYYY') }}</p>
      </div>
      <div class="flex align-items-center justify-between gap-[8px] text-sm mb-[20px]">
        <p class="text-gray-600 form-label h-fit self-center">Tender End Date</p>
        <p class="whitespace-nowrap">{{ moment().format('DD MMM YYYY') }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import moment from 'moment'
</script>

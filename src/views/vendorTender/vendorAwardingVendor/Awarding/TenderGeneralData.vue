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
        <p class="font-medium">{{ generalData?.tenderReqId || '-' }}</p>
      </div>
      <div class="flex align-items-center justify-between gap-[8px] text-sm mb-[20px]">
        <p class="text-gray-600">Tender Status</p>
        <span class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
          {{ generalData?.tenderStatus || '-' }}
        </span>
      </div>
      <div class="flex align-items-center justify-between gap-[8px] text-sm mb-[20px]">
        <p class="text-gray-600">PR Category</p>
        <p class="font-medium">{{ generalData?.prCategory || '-' }}</p>
      </div>
      <div class="flex align-items-center justify-between gap-[8px] text-sm mb-[20px]">
        <p class="text-gray-600">Evaluation Object</p>
        <p class="font-medium">{{ generalData?.evaluationObject || '-' }}</p>
      </div>
      <div class="flex align-items-center justify-between gap-[8px] text-sm mb-[20px]">
        <p class="text-gray-600">Tender Start Date</p>
        <p class="font-medium">{{ formatDate(generalData?.tenderStartDate || '') }}</p>
      </div>
      <div class="flex align-items-center justify-between gap-[8px] text-sm">
        <p class="text-gray-600">Tender End Date</p>
        <p class="font-medium">{{ formatDate(generalData?.tenderEndDate || '') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'

interface GeneralDataType {
  tenderReqId: string
  tenderStatus: string
  prCategory: string
  evaluationObject: string
  tenderStartDate: string
  tenderEndDate: string
}

const generalData = inject<GeneralDataType>('generalData')

const formatDate = (date: string): string => {
  if (!date) return '-'
  try {
    const parsedDate = new Date(date)
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }).replace(/,/g, '')
    }
  } catch (error) {
    console.warn('Date parsing error:', error)
  }
  return date
}
</script>

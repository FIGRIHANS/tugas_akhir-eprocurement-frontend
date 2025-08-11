<template>

  <div class="card">
    <div class="card-header p-[20px]">
      <h3 class="card-title">
        {{ props.title }}
      </h3>
    </div>
    <div class="card-body">
      <div>
        <p class="text-[13px] font-medium text-gray-600">Total</p>
        <p class="font-semibold text-3xl">{{ props.data.length }}</p>
      </div>
      <div class="flex align-items-center gap-[4px] mt-[20px]">
        <div class="h-[15px] rounded-sm bg-orange-500" :style="{ width: `${getEarlyDays || 0}%` }">
        </div>
        <div class="h-[15px] rounded-sm bg-success" :style="{ width: `${getMidDays || 0}%` }"></div>
        <div class="h-[15px] rounded-sm bg-info" :style="{ width: `${getLateDays || 0}%` }"></div>
      </div>
      <div class="mt-[20px] flex flex-col gap-[8px]">
        <div class="flex align-items-center gap-[6px]">
          <div class="w-[8px] h-[8px] bg-success rounded-full my-auto"></div>
          <p class="font-medium text-sm text-gray-700">0-5 Days</p>
        </div>
        <div class="flex align-items-center gap-[6px]">
          <div class="w-[8px] h-[8px] bg-orange-500 rounded-full my-auto"></div>
          <p class="font-medium text-sm text-gray-700">6-10 Days</p>
        </div>
        <div class="flex align-items-center gap-[6px]">
          <div class="w-[8px] h-[8px] bg-info rounded-full my-auto"></div>
          <p class="font-medium text-sm text-gray-700">>10 Days</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import {
    computed
  } from 'vue'
  import type {
    CardGraphTypes
  } from '../types/tenderReportList'

  const props = defineProps < {
    title: string,
    data: CardGraphTypes[]
  } > ()

  const getEarlyDays = computed(() => {
    const result = props.data.filter((item) => item.days >= 0 && item.days <= 5)
    return result.length / props.data.length * 100
  })

  const getMidDays = computed(() => {
    const result = props.data.filter((item) => item.days >= 6 && item.days <= 10)
    return result.length / props.data.length * 100
  })

  const getLateDays = computed(() => {
    const result = props.data.filter((item) => item.days > 10)
    return result.length / props.data.length * 100
  })
</script>

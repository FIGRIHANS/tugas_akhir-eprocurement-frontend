<template>
  <div class="dropdown" data-dropdown="true" data-dropdown-trigger="click">
    <button class="dropdown-toggle btn btn-primary">
      <i class="ki-filled ki-filter"></i>
      Filter
    </button>
    <div class="dropdown-content w-full max-w-[305px] p-[16px]">
      <p class="text-lg font-semibold mb-[8px]">Filter</p>
      <div class="flex flex-col gap-[24px] py-[16px]">
        <div class="relative">
          <label class="absolute text-xs font-normal text-gray-500 -top-[8px] left-[10px] bg-white"
            >Status</label
          >
          <select v-model="status" class="select" name="select">
            <option value="">All</option>
            <option value="Open">Open</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
        <div class="relative">
          <label class="absolute text-xs font-normal text-gray-500 -top-[8px] left-[10px] bg-white"
            >Periode</label
          >
          <select v-model="periode" class="select" name="select">
            <option value="">All</option>
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
            <option value="Quarterly">Quarterly</option>
          </select>
        </div>
        <div class="relative">
          <label
            class="absolute text-xs font-normal text-gray-500 -top-[8px] left-[10px] bg-white z-[1]"
            >Invoice Type</label
          >
          <select v-model="invoiceType" class="select" name="select">
            <option value="">All</option>
            <option value="Recurring Expense">Recurring Expense</option>
            <option value="Contract">Contract</option>
          </select>
        </div>
      </div>
      <div class="flex align-center justify-between gap-[16px]">
        <button class="btn btn-outline btn-primary btn-lg" @click="resetFilter">
          <i class="ki-duotone ki-arrows-circle"></i>
          Reset
        </button>
        <button class="btn btn-primary btn-lg" data-dropdown-dismiss="true" @click="goFilter">
          <i class="ki-filled ki-check-circle"></i>
          Apply
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

export interface filterListTypes {
  status: string
  periode: string
  invoiceType: string
}

const props = defineProps<{
  data: filterListTypes
}>()

const emits = defineEmits(['setData'])

const status = ref<string>('')
const periode = ref<string>('')
const invoiceType = ref<string>('')

const resetFilter = () => {
  status.value = ''
  periode.value = ''
  invoiceType.value = ''
}

const goFilter = () => {
  const data = {
    status: status.value,
    periode: periode.value,
    invoiceType: invoiceType.value,
  }
  emits('setData', data)
}
</script>

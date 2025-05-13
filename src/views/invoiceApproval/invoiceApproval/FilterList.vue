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
          <label class="absolute text-xs font-normal text-gray-500 -top-[8px] left-[10px] bg-white">Company Code</label>
          <select class="select" name="select">
            <option value="1">
              Option 1
            </option>
            <option value="2">
              Option 2
            </option>
            <option value="3">
              Option 3
            </option>
          </select>
        </div>
        <div class="relative">
          <label class="absolute text-xs font-normal text-gray-500 -top-[8px] left-[10px] bg-white">Invoice Type</label>
          <select class="select" name="select">
            <option value="1">
              Option 1
            </option>
            <option value="2">
              Option 2
            </option>
            <option value="3">
              Option 3
            </option>
          </select>
        </div>
        <div class="relative">
          <label class="absolute text-xs font-normal text-gray-500 -top-[8px] left-[10px] bg-white z-[1]">Invoice Date</label>
          <DatePicker v-model="date" />
        </div>
      </div>
      <div class="flex align-center justify-between gap-[16px]">
        <button class="btn btn-outline btn-primary btn-lg">
          <i class="ki-duotone ki-arrows-circle"></i>
          Reset
        </button>
        <button class="btn btn-primary btn-lg">
          <i class="ki-filled ki-check-circle"></i>
          Apply
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
// import type { listItemTypes } from '../types/pendingVerification'
import DatePicker from '@/components/datePicker/DatePicker.vue'

// const props = defineProps<{
//   data: listItemTypes
// }>()

const emits = defineEmits(['setData'])

const companyCode = ref<string>('')
const invoiceType = ref<string>('')
const date = ref<string>('')

// watch(
//   () => props.data,
//   () => {
//     companyCode.value = props.data.companyCode
//     invoiceType.value = props.data.invoiceType
//   },
//   {
//     deep: true,
//     immediate: true
//   }
// )

watch(
  () => [companyCode.value, invoiceType.value, date.value],
  () => {
    const data = {
      status: companyCode.value,
      category: invoiceType.value,
      date: date.value
    }
    emits('setData', data)
  }
)
</script>

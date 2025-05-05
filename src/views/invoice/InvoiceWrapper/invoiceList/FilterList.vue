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
          <label class="absolute text-xs font-normal text-gray-500 -top-[8px] left-[10px] bg-white">Status</label>
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
          <label class="absolute text-xs font-normal text-gray-500 -top-[8px] left-[10px] bg-white">Category</label>
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
import type { filterListTypes } from '../../types/invoiceList'
import DatePicker from '@/components/datePicker/DatePicker.vue'

const props = defineProps<{
  data: filterListTypes
}>()

const emits = defineEmits(['setData'])

const status = ref<string>('')
const category = ref<string>('')
const date = ref<string>('')

watch(
  () => props.data,
  () => {
    status.value = props.data.status
    category.value = props.data.category
    date.value = props.data.date
  },
  {
    deep: true,
    immediate: true
  }
)

watch(
  () => [status.value, category.value, date.value],
  () => {
    const data = {
      status: status.value,
      category: category.value,
      date: date.value
    }
    emits('setData', data)
  }
)
</script>

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
          <label
            class="absolute text-xs font-normal text-gray-500 -top-[8px] left-[10px] bg-white">Tender
            Request ID</label>
          <select v-model="tenderRequestId" class="select" name="select">
            <option value="1">
              Option 1
            </option>
            <option value="2">
              Option 2
            </option>
          </select>
        </div>
        <div class="relative">
          <label
            class="absolute text-xs font-normal text-gray-500 -top-[8px] left-[10px] bg-white">Tender
            Status</label>
          <select v-model="status" class="select" name="select">
            <option value="1">
              Option 1
            </option>
            <option value="2">
              Option 2
            </option>
          </select>
        </div>
        <div class="relative">
          <label
            class="absolute text-xs font-normal text-gray-500 -top-[8px] left-[10px] bg-white">PR
            Category</label>
          <select v-model="category" class="select" name="select">
            <option value="1">
              Option 1
            </option>
            <option value="2">
              Option 2
            </option>
          </select>
        </div>
        <div class="relative">
          <label
            class="absolute text-xs font-normal text-gray-500 -top-[8px] left-[10px] bg-white">Plant</label>
          <select v-model="plant" class="select" name="select">
            <option value="1">
              Option 1
            </option>
            <option value="2">
              Option 2
            </option>
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
  import {
    ref,
    watch
  } from 'vue'
  import type {
    filterListTypes
  } from '../types/tenderReportList'

  const props = defineProps < {
    data: filterListTypes
  } > ()

  const emits = defineEmits(['setData'])

  const tenderRequestId = ref < string > ('')
  const status = ref < string > ('')
  const category = ref < string > ('')
  const plant = ref < string > ('')

  const resetFilter = () => {
    tenderRequestId.value = ''
    status.value = ''
    category.value = ''
    plant.value = ''
  }

  const goFilter = () => {
    const data = {
      tenderRequestId: tenderRequestId.value,
      status: status.value,
      category: category.value,
      plant: plant.value
    }
    emits('setData', data)
  }

  watch(
    () => props.data,
    () => {
      tenderRequestId.value = props.data.tenderRequestId
      status.value = props.data.status
      category.value = props.data.category
      plant.value = props.data.plant
    }, {
      deep: true,
      immediate: true
    }
  )
</script>

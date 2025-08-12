<template>
  <div class="dropdown" data-dropdown="true" data-dropdown-trigger="click">
    <button class="dropdown-toggle btn btn-primary">
      <i class="ki-filled ki-filter"></i>
      Filter
    </button>

    <div class="dropdown-content w-full max-w-[305px] p-[16px]">
      <p class="text-lg font-semibold mb-[8px]">Filter</p>

      <div class="flex flex-col gap-[24px] py-[16px]">
        <!-- Tender Request ID -->
        <div class="relative">
          <label class="absolute text-xs font-normal text-gray-500 -top-[8px] left-[10px] bg-white">
            Tender Request ID
          </label>
          <select v-model="tenderRequestId" class="select w-full" name="tenderRequestId">
            <option :value="''">Semua</option>
            <option v-for="opt in optsTenderRequestId" :key="opt" :value="opt">
              {{ opt }}
            </option>
          </select>
          <i
            v-if="tenderRequestId"
            class="ki-filled ki-cross absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
            @click="tenderRequestId = ''"
          ></i>
        </div>

        <!-- Status -->
        <div class="relative">
          <label class="absolute text-xs font-normal text-gray-500 -top-[8px] left-[10px] bg-white">
            Tender Status
          </label>
          <select v-model="status" class="select w-full" name="status">
            <option :value="''">Semua</option>
            <option v-for="opt in optsStatus" :key="opt" :value="opt">
              {{ opt }}
            </option>
          </select>
          <i
            v-if="status"
            class="ki-filled ki-cross absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
            @click="status = ''"
          ></i>
        </div>

        <!-- Category -->
        <div class="relative">
          <label class="absolute text-xs font-normal text-gray-500 -top-[8px] left-[10px] bg-white">
            PR Category
          </label>
          <select v-model="category" class="select w-full" name="category">
            <option :value="''">Semua</option>
            <option v-for="opt in optsCategory" :key="opt" :value="opt">
              {{ opt }}
            </option>
          </select>
          <i
            v-if="category"
            class="ki-filled ki-cross absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
            @click="category = ''"
          ></i>
        </div>

        <!-- Plant -->
        <div class="relative">
          <label class="absolute text-xs font-normal text-gray-500 -top-[8px] left-[10px] bg-white">
            Plant
          </label>
          <select v-model="plant" class="select w-full" name="plant">
            <option :value="''">Semua</option>
            <option v-for="opt in optsPlant" :key="opt" :value="opt">
              {{ opt }}
            </option>
          </select>
          <i
            v-if="plant"
            class="ki-filled ki-cross absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
            @click="plant = ''"
          ></i>
        </div>
      </div>

      <div class="flex align-center justify-between gap-[16px]">
        <button class="btn btn-outline btn-primary btn-lg" @click="onReset">
          <i class="ki-duotone ki-arrows-circle"></i>
          Reset
        </button>
        <button
          class="btn btn-primary btn-lg"
          data-dropdown-dismiss="true"
          :disabled="!isDirty"
          @click="goFilter"
        >
          <i class="ki-filled ki-check-circle"></i>
          Apply
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import type { filterListTypes } from '../types/tenderReportList'

type FilterOptions = {
  tenderRequestIds?: string[]
  statuses?: string[]
  categories?: string[]
  plants?: string[]
}

const props = defineProps<{
  data: filterListTypes
  options?: FilterOptions // opsional: kirim dari parent untuk dropdown dinamis
}>()

const emits = defineEmits<{
  (e: 'setData', payload: filterListTypes): void
}>()

// local state
const tenderRequestId = ref<string>('') // default ikut props di watcher
const status = ref<string>('')
const category = ref<string>('')
const plant = ref<string>('')

// options (fallback ke [] bila tidak dikirim)
const optsTenderRequestId = computed(() => props.options?.tenderRequestIds ?? [])
const optsStatus = computed(() => props.options?.statuses ?? [])
const optsCategory = computed(() => props.options?.categories ?? [])
const optsPlant = computed(() => props.options?.plants ?? [])

// dirty check (supaya Apply hanya aktif saat ada perubahan)
const isDirty = computed(() => {
  return (
    (tenderRequestId.value || '') !== (props.data.tenderRequestId || '') ||
    (status.value || '') !== (props.data.status || '') ||
    (category.value || '') !== (props.data.category || '') ||
    (plant.value || '') !== (props.data.plant || '')
  )
})

const syncFromProps = () => {
  tenderRequestId.value = props.data.tenderRequestId || ''
  status.value = props.data.status || ''
  category.value = props.data.category || ''
  plant.value = props.data.plant || ''
}

// initial & reactive sync
watch(
  () => props.data,
  () => syncFromProps(),
  { deep: true, immediate: true },
)

const onReset = () => {
  tenderRequestId.value = ''
  status.value = ''
  category.value = ''
  plant.value = ''
  // emit juga supaya parent langsung update (dan menutup dropdown tetap ok)
  emits('setData', {
    tenderRequestId: '',
    status: '',
    category: '',
    plant: '',
  })
}

const goFilter = () => {
  emits('setData', {
    tenderRequestId: tenderRequestId.value,
    status: status.value,
    category: category.value,
    plant: plant.value,
  })
}
</script>

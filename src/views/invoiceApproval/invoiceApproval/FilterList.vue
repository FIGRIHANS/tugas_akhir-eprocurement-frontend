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
            >Company Code</label
          >
          <select v-model="companyCode" class="select" name="select">
            <option v-for="item of companyCodeList" :key="item.code" :value="item.code">
              {{ item.name }}
            </option>
          </select>
        </div>
        <div class="relative" v-if="route.name === 'invoiceApprovalNonPo'">
          <label class="absolute text-xs font-normal text-gray-500 -top-[8px] left-[10px] bg-white"
            >Invoice Non PO Type</label
          >
          <select v-model="invoiceType" class="select" name="select">
            <option v-for="item of invoiceTypenonPoList" :key="item.code" :value="item.code">
              {{ item.name }}
            </option>
          </select>
        </div>
        <div class="relative" v-else>
          <label class="absolute text-xs font-normal text-gray-500 -top-[8px] left-[10px] bg-white"
            >Invoice PO Type</label
          >
          <select v-model="invoiceType" class="select" name="select">
            <option v-for="item of invoiceTypeList" :key="item.code" :value="item.code">
              {{ item.name }}
            </option>
          </select>
        </div>
        <div class="relative">
          <label class="absolute text-xs font-normal text-gray-500 -top-[8px] left-[10px] bg-white"
            >Status</label
          >
          <select v-model="status" class="select" name="select">
            <option value="2">Waiting for Approval</option>
            <option value="4">Approved</option>
            <option value="5">Rejected</option>
            <option value="7">Sent to SAP</option>
          </select>
        </div>
        <div class="relative">
          <label
            class="absolute text-xs font-normal text-gray-500 -top-[8px] left-[10px] bg-white z-[1]"
            >Submitted Document Date</label
          >
          <DatePicker v-model="date" format="yyyy/MM/dd" teleport />
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
import { ref, computed, watch } from 'vue'
import type { filterListTypes } from '../types/pendingApproval'
import { useRoute } from 'vue-router'
import DatePicker from '@/components/datePicker/DatePicker.vue'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'

const props = defineProps<{
  data: filterListTypes
}>()

const emits = defineEmits(['setData'])

const route = useRoute()
const invoiceMasterApi = useInvoiceMasterDataStore()
const status = ref<number | null>(null)
const date = ref<string>('')
const companyCode = ref<string>('')
const invoiceType = ref<string>('')

const companyCodeList = computed(() => invoiceMasterApi.companyCode)
const invoiceTypeList = computed(() => invoiceMasterApi.invoicePoType)
const invoiceTypenonPoList = computed(() => invoiceMasterApi.invoiceNonPoType)

const resetFilter = () => {
  status.value = null
  date.value = ''
  companyCode.value = ''
  invoiceType.value = ''
}
const resetStatus = () => {
  status.value = null
}
const resetDate = () => {
  date.value = ''
}
const resetCompanyCode = () => {
  companyCode.value = ''
}
const resetInvoiceType = () => {
  invoiceType.value = ''
}

const goFilter = () => {
  const data = {
    status: status.value,
    date: date.value,
    companyCode: companyCode.value,
    invoiceType: invoiceType.value,
  }
  emits('setData', data)
}

watch(
  () => props.data,
  () => {
    status.value = props.data.status
    date.value = props.data.date
    companyCode.value = props.data.companyCode
    invoiceType.value = props.data.invoiceType
  },
  {
    deep: true,
    immediate: true,
  },
)
defineExpose({
  resetFilter,
  resetStatus,
  resetDate,
  resetInvoiceType,
  resetCompanyCode,
  goFilter,
})
</script>

<template>
  <div v-if="form" class="flex flex-col gap-[24px]">
    <p class="text-lg font-semibold m-[0px]">{{ form.invoiceNo || '-' }}</p>
    <div class="flex flex-wrap items-center gap-[20px]">
      <div class="w-[calc(50%-10px)]">
        <p class="text-xs font-normal text-gray-700">Invoice Type</p>
        <p class="text-sm font-medium">{{ getInvoiceTypeName() || '-' }}</p>
      </div>
      <div class="w-[calc(50%-10px)]">
        <p class="text-xs font-normal text-gray-700">DP Option</p>
        <p class="text-sm font-medium">{{ getDpName() || '-' }}</p>
      </div>
      <div class="w-[calc(50%-10px)]">
        <p class="text-xs font-normal text-gray-700">Company Code</p>
        <p class="text-sm font-medium">{{ getCompanyName() || '-' }}</p>
      </div>
      <div class="w-[calc(50%-10px)]">
        <p class="text-xs font-normal text-gray-700">Invoice Document No.</p>
        <p class="text-sm font-medium">{{ form.invoiceNoVendor || '-' }}</p>
      </div>
      <div class="w-[calc(50%-10px)]">
        <p class="text-xs font-normal text-gray-700">Invoice Date</p>
        <p class="text-sm font-medium whitespace-nowrap">{{ form.invoiceDate ? moment(form.invoiceDate).format('YYYYMMDD') : '-' }}</p>
      </div>
      <div class="w-[calc(50%-10px)]">
        <p class="text-xs font-normal text-gray-700">Tax Document No.</p>
        <p class="text-sm font-medium">{{ form.taxNoInvoice || '-' }}</p>
      </div>
      <div class="w-[calc(50%-10px)]">
        <p class="text-xs font-normal text-gray-700">Currency</p>
        <p class="text-sm font-medium">{{ form.currency || '-' }}</p>
      </div>
      <div v-if="form.invoiceDp === '9013'" class="w-[calc(50%-10px)]">
        <p class="text-xs font-normal text-gray-700">Remaining DP Amount</p>
        <p class="text-sm font-medium">{{ form.remainingDpAmount || '-' }}</p>
      </div>
      <div v-if="form.invoiceDp === '9013'" class="w-[calc(50%-10px)]">
        <p class="text-xs font-normal text-gray-700">DP Amount Deduction</p>
        <p class="text-sm font-medium">{{ form.dpAmountDeduction || '-' }}</p>
      </div>
      <div class="w-[calc(50%-10px)]">
        <p class="text-xs font-normal text-gray-700">Description</p>
        <p class="text-sm font-medium">{{ form.description || '-' }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, inject } from 'vue'
import { useRoute } from 'vue-router'
import type { formTypes } from '../../types/invoiceAddWrapper'
import moment from 'moment'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'

const invoiceMasterApi = useInvoiceMasterDataStore()
const form = inject<formTypes>('form')
const route = useRoute()
const typeForm = ref<string>('')

const dpTypeList = computed(() => invoiceMasterApi.dpType)
const listInvoiceTypePo = computed(() => invoiceMasterApi.invoicePoType)
const companyCodeList = computed(() => invoiceMasterApi.companyCode)

// const checkPo = () => {
//   return typeForm.value === 'po'
// }

// const checkPoPib = () => {
//   return form?.invoiceType === '2'
// }

const getDpName = () => {
  if(form?.invoiceDp != ''){
    if (route.query.type === 'po-view') return 'Without DP'  
    const getIndex = dpTypeList.value.findIndex((item) => item.code === form?.invoiceDp)
    if (getIndex !== -1) return dpTypeList.value[getIndex].name
  }  
}

const getInvoiceTypeName = () => {
  const getIndex = listInvoiceTypePo.value.findIndex((item) => item.code === form?.invoiceType)
  if (getIndex !== -1) return listInvoiceTypePo.value[getIndex].name
}

const getCompanyName = () => {
  const getIndex = companyCodeList.value.findIndex((item) => item.code === form?.companyCode)
  if (getIndex !== -1) return companyCodeList.value[getIndex].name
}

onMounted(() => {
  typeForm.value = route.query.type?.toString().toLowerCase() || 'po'
})
</script>

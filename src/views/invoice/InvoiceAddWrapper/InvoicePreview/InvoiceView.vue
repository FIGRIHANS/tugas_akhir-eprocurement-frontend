<template>
  <div v-if="form" class="flex flex-col gap-[24px]">
    <p class="text-lg font-semibold m-[0px]">{{ form.invoiceNo || '-' }}</p>
    <div
      class="flex flex-wrap align-items-center gap-[20px]"
      :class="{ 'flex-col align-items-start': checkIsNonPo() }"
    >
      <div :class="{ 'w-[calc(50%-10px)]': !checkIsNonPo() }">
        <p class="text-xs font-normal text-gray-700">Invoice Type</p>
        <p class="text-sm font-medium">{{ getInvoiceTypeName() || '-' }}</p>
      </div>
      <div
        v-if="form.invoiceType === '901' && !checkIsNonPo()"
        :class="{ 'w-[calc(50%-10px)]': !checkIsNonPo() }"
      >
        <p class="text-xs font-normal text-gray-700">DP Option</p>
        <p class="text-sm font-medium">{{ getDpName() || '-' }}</p>
      </div>
      <div :class="{ 'w-[calc(50%-10px)]': !checkIsNonPo() }">
        <p class="text-xs font-normal text-gray-700">Company Code</p>
        <p class="text-sm font-medium">{{ getCompanyName() || '-' }}</p>
      </div>
      <div v-if="checkIsNonPo()" :class="{ 'w-[calc(50%-10px)]': !checkIsNonPo() }">
        <p class="text-xs font-normal text-gray-700">Vendor No.</p>
        <p class="text-sm font-medium">{{ form.vendorId || '-' }}</p>
      </div>
      <div :class="{ 'w-[calc(50%-10px)]': !checkIsNonPo() }">
        <p class="text-xs font-normal text-gray-700">Invoice Document No.</p>
        <p class="text-sm font-medium">{{ form.invoiceNoVendor || '-' }}</p>
      </div>
      <div :class="{ 'w-[calc(50%-10px)]': !checkIsNonPo() }">
        <p class="text-xs font-normal text-gray-700">Invoice Date</p>
        <p class="text-sm font-medium whitespace-nowrap">
          {{ form.invoiceDate ? moment(form.invoiceDate).format('YYYY/MM/DD') : '-' }}
        </p>
      </div>
      <div :class="{ 'w-[calc(50%-10px)]': !checkIsNonPo() }">
        <p class="text-xs font-normal text-gray-700">Currency</p>
        <p class="text-sm font-medium">{{ form.currency || '-' }}</p>
      </div>
      <div v-if="form.invoiceType !== '903'" :class="{ 'w-[calc(50%-10px)]': !checkIsNonPo() }">
        <p class="text-xs font-normal text-gray-700">Tax Document No.</p>
        <p class="text-sm font-medium">{{ form.taxNoInvoice || '-' }}</p>
      </div>
      <div v-if="form.invoiceDp === '9013'" :class="{ 'w-[calc(50%-10px)]': !checkIsNonPo() }">
        <p class="text-xs font-normal text-gray-700">Remaining DP Amount</p>
        <p class="text-sm font-medium">{{ form.currency === 'IDR' ? useFormatIdr(form.remainingDpAmount) : useFormatUsd(form.remainingDpAmount) || '0' }}</p>
      </div>
      <div v-if="form.invoiceDp === '9013'" :class="{ 'w-[calc(50%-10px)]': !checkIsNonPo() }">
        <p class="text-xs font-normal text-gray-700">DP Amount Deduction</p>
        <p class="text-sm font-medium">{{ form.currency === 'IDR' ? useFormatIdr(form.dpAmountDeduction) : useFormatUsd(form.dpAmountDeduction) || '0' }}</p>
      </div>
      <div v-if="checkIsNonPo()" :class="{ 'w-[calc(50%-10px)]': !checkIsNonPo() }">
        <p class="text-xs font-normal text-gray-700">Requestor</p>
        <p class="text-sm font-medium">{{ form.department || '-' }}</p>
      </div>
      <div v-if="form.invoiceType !== '903'" :class="{ 'w-[calc(50%-10px)]': !checkIsNonPo() }">
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
import { useFormatIdr, useFormatUsd } from '@/composables/currency'

const invoiceMasterApi = useInvoiceMasterDataStore()
const form = inject<formTypes>('form')
const route = useRoute()
const typeForm = ref<string>('')

const dpTypeList = computed(() => invoiceMasterApi.dpType)
const listInvoiceTypePo = computed(() => invoiceMasterApi.invoicePoType)
const companyCodeList = computed(() => invoiceMasterApi.companyCode)
const listInvoiceTypeNonPo = computed(() => invoiceMasterApi.invoiceNonPoType)

const checkIsNonPo = () => {
  return route.query.type === 'nonpo' || route.query.type === 'non-po-view'
}

const getDpName = () => {
  if (form?.invoiceDp != '') {
    const getIndex = dpTypeList.value.findIndex((item) => item.code === form?.invoiceDp)
    if (getIndex !== -1) return dpTypeList.value[getIndex].name
  }
}

const getInvoiceTypeName = () => {
  if (checkIsNonPo()) {
    const getIndex = listInvoiceTypeNonPo.value.findIndex((item) => item.code === form.invoiceType)
    if (getIndex !== -1) return listInvoiceTypeNonPo.value[getIndex].name
  } else {
    const getIndex = listInvoiceTypePo.value.findIndex((item) => item.code === form.invoiceType)
    if (getIndex !== -1) return listInvoiceTypePo.value[getIndex].name
  }
}

const getCompanyName = () => {
  const getIndex = companyCodeList.value.findIndex((item) => item.code === form?.companyCode)
  if (getIndex !== -1) return companyCodeList.value[getIndex].name
}

onMounted(() => {
  typeForm.value = route.query.type?.toString().toLowerCase() || 'po'
})
</script>

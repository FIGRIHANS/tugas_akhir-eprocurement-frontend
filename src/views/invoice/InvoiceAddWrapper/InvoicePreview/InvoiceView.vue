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

      <div v-if="checkIsNonPo() && !isPettyCash" :class="{ 'w-[calc(50%-10px)]': !checkIsNonPo() }">
        <p class="text-xs font-normal text-gray-700">Vendor No.</p>
        <p class="text-sm font-medium">{{ form.vendorId || '-' }}</p>
      </div>

      <div :class="{ 'w-[calc(50%-10px)]': !checkIsNonPo() }">
        <p class="text-xs font-normal text-gray-700">Company Code</p>
        <p class="text-sm font-medium">{{ getCompanyDisplay() }}</p>
      </div>

      <div v-if="isPettyCash && form.reference" :class="{ 'w-[calc(50%-10px)]': !checkIsNonPo() }">
        <p class="text-xs font-normal text-gray-700">Reference</p>
        <p class="text-sm font-medium">{{ form.reference }}</p>
      </div>

      <div v-if="isPettyCash" :class="{ 'w-[calc(50%-10px)]': !checkIsNonPo() }">
        <p class="text-xs font-normal text-gray-700">Cash Journal</p>
        <p class="text-sm font-medium">{{ getCashJournalDisplay() }}</p>
      </div>

      <div v-if="isPettyCash" :class="{ 'w-[calc(50%-10px)]': !checkIsNonPo() }">
        <p class="text-xs font-normal text-gray-700">Petty Cash Period</p>
        <p class="text-sm font-medium whitespace-nowrap">
          {{ getPettyCashPeriod() }}
        </p>
      </div>

      <div v-if="(isCAS || isLBA) && form.casNoCode" :class="{ 'w-[calc(50%-10px)]': !checkIsNonPo() }">
        <p class="text-xs font-normal text-gray-700">CAS No.</p>
        <p class="text-sm font-medium">{{ form.casNoCode }}</p>
      </div>

      <div v-if="(isReimbursement || isCreditCard || isLBA) && form.invoiceNo" :class="{ 'w-[calc(50%-10px)]': !checkIsNonPo() }">
        <p class="text-xs font-normal text-gray-700">Submitted Document No.</p>
        <p class="text-sm font-medium">{{ form.invoiceNo }}</p>
      </div>

      <div v-if="isReimbursement" :class="{ 'w-[calc(50%-10px)]': !checkIsNonPo() }">
        <p class="text-xs font-normal text-gray-700">Invoice Vendor No.</p>
        <p class="text-sm font-medium">{{ form.invoiceVendorNo || '-' }}</p>
      </div>

      <div v-if="isReimbursement" :class="{ 'w-[calc(50%-10px)]': !checkIsNonPo() }">
        <p class="text-xs font-normal text-gray-700">Invoice Date</p>
        <p class="text-sm font-medium whitespace-nowrap">
          {{ form.invoiceDate ? moment(form.invoiceDate).format('YYYY/MM/DD') : '-' }}
        </p>
      </div>

      <div v-if="isReimbursement || isCAS || isLBA" :class="{ 'w-[calc(50%-10px)]': !checkIsNonPo() }">
        <p class="text-xs font-normal text-gray-700">Tax Document No.</p>
        <p class="text-sm font-medium">{{ form.taxNoInvoice || '-' }}</p>
      </div>

      <div v-if="isCreditCard" :class="{ 'w-[calc(50%-10px)]': !checkIsNonPo() }">
        <p class="text-xs font-normal text-gray-700">Proposal Amount</p>
        <p class="text-sm font-medium">{{ formatProposalAmount(form.proposalAmountVal) || '-' }}</p>
      </div>

      <div v-if="!isPettyCash" :class="{ 'w-[calc(50%-10px)]': !checkIsNonPo() }">
        <p class="text-xs font-normal text-gray-700">Currency</p>
        <p class="text-sm font-medium">{{ form.currency || '-' }}</p>
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

      <div
        v-if="form.invoiceType === '901' && !checkIsNonPo()"
        :class="{ 'w-[calc(50%-10px)]': !checkIsNonPo() }"
      >
        <p class="text-xs font-normal text-gray-700">DP Option</p>
        <p class="text-sm font-medium">{{ getDpName() || '-' }}</p>
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
const listCashJournal = computed(() => invoiceMasterApi.cashJournalList)
const listInvoiceTypeNonPo = computed(() => invoiceMasterApi.invoiceNonPoType)

const isPettyCash = computed(() => form?.invoiceType === '5')
const isReimbursement = computed(() => form?.invoiceType === '1')
const isCreditCard = computed(() => form?.invoiceType === '2')
const isCAS = computed(() => form?.invoiceType === '3')
const isLBA = computed(() => form?.invoiceType === '4')

const checkIsNonPo = () => {
  return route.query.type === 'nonpo' || route.query.type === 'non-po-view'
}

const getPettyCashPeriod = () => {
  if (form?.pettyCashPeriod && Array.isArray(form.pettyCashPeriod)) {
    const startDate = form.pettyCashPeriod[0] ? moment(form.pettyCashPeriod[0]).format('YYYY/MM/DD') : '-'
    const endDate = form.pettyCashPeriod[1] ? moment(form.pettyCashPeriod[1]).format('YYYY/MM/DD') : '-'
    return `${startDate} - ${endDate}`
  }
  return '-'
}

// const checkPo = () => {
//   return typeForm.value === 'po'
// }

// const checkPoPib = () => {
//   return form?.invoiceType === '2'
// }

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

const getCompanyDisplay = () => {
  if (!form?.companyCode) return '-'
  const companyCodeValue = form.companyCode
  const item = companyCodeList.value.find((item) => item.code === companyCodeValue)
  if (item) {
    const name = item.name || ''
    if (name.trim().startsWith(item.code)) return name
    return `${item.code} - ${name}`
  }
  return companyCodeValue || '-'
}

const getCashJournalDisplay = () => {
  if (!form?.cashJournalCode) return '-'
  const idx = listCashJournal.value.findIndex((item) => item.cashJournalNo === form.cashJournalCode)
  if (idx !== -1) return `${listCashJournal.value[idx].cashJournalNo} - ${listCashJournal.value[idx].cashJournalName}`
  return form.cashJournalCode || '-'
}

// Reference helpers here so TypeScript/compiler knows they're used (template usage isn't detected by static checker)
void getCompanyDisplay
void getCashJournalDisplay

onMounted(() => {
  typeForm.value = route.query.type?.toString().toLowerCase() || 'po'
})

const formatProposalAmount = (val: string | number) => {
  if (val === null || val === undefined || val === '') return ''
  const digits = String(val).replace(/\D+/g, '')
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}
</script>

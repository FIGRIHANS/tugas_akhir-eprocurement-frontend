<template>
  <div v-if="form" class="flex flex-col gap-[24px]">
    <p class="text-lg font-semibold m-[0px]">{{ form.invoiceNo || '-' }}</p>
    <div
      class="flex flex-wrap align-items-center gap-[20px]"
      :class="{ 'flex-col align-items-start': checkIsNonPo() }"
    >
      <!-- Invoice Type - Always shown -->
      <div :class="{ 'w-[calc(50%-10px)]': !checkIsNonPo() }">
        <p class="text-xs font-normal text-gray-700">Invoice Type</p>
        <p class="text-sm font-medium">{{ getInvoiceTypeName() || '-' }}</p>
      </div>

      <!-- Vendor No. - Only for Non-PO but NOT Petty Cash -->
      <div v-if="checkIsNonPo() && !isPettyCash" :class="{ 'w-[calc(50%-10px)]': !checkIsNonPo() }">
        <p class="text-xs font-normal text-gray-700">Vendor No.</p>
        <p class="text-sm font-medium">{{ form.vendorId || '-' }}</p>
      </div>


      <!-- Company Code - Always shown -->
      <div :class="{ 'w-[calc(50%-10px)]': !checkIsNonPo() }">
        <p class="text-xs font-normal text-gray-700">Company Code</p>
        <p class="text-sm font-medium">{{ getCompanyName() || '-' }}</p>
      </div>

      <!-- Reference - Only for Petty Cash (readonly) - Hidden if not filled -->
      <div v-if="isPettyCash && form.reference" :class="{ 'w-[calc(50%-10px)]': !checkIsNonPo() }">
        <p class="text-xs font-normal text-gray-700">Reference</p>
        <p class="text-sm font-medium">{{ form.reference }}</p>
      </div>

      <!-- Cash Journal - Only for Petty Cash -->
      <div v-if="isPettyCash" :class="{ 'w-[calc(50%-10px)]': !checkIsNonPo() }">
        <p class="text-xs font-normal text-gray-700">Cash Journal</p>
        <p class="text-sm font-medium">{{ form.cashJournalName || form.cashJournalCode || '-' }}</p>
      </div>

      <!-- Petty Cash Period - Only for Petty Cash -->
      <div v-if="isPettyCash" :class="{ 'w-[calc(50%-10px)]': !checkIsNonPo() }">
        <p class="text-xs font-normal text-gray-700">Petty Cash Period</p>
        <p class="text-sm font-medium whitespace-nowrap">
          {{ getPettyCashPeriod() }}
        </p>
      </div>

      <!-- CAS No. - Only for CAS and LBA -->
      <div v-if="isCAS || isLBA" :class="{ 'w-[calc(50%-10px)]': !checkIsNonPo() }">
        <p class="text-xs font-normal text-gray-700">CAS No.</p>
        <p class="text-sm font-medium">{{ form.casNoName || form.casNoCode || '-' }}</p>
      </div>

      <!-- Submitted Document No. - Only for Reimbursement, Credit Card, and LBA (hidden if not filled) -->
      <div v-if="(isReimbursement || isCreditCard || isLBA) && form.invoiceNo" :class="{ 'w-[calc(50%-10px)]': !checkIsNonPo() }">
        <p class="text-xs font-normal text-gray-700">Submitted Document No.</p>
        <p class="text-sm font-medium">{{ form.invoiceNo }}</p>
      </div>

      <!-- Proposal Amount - Only for Credit Card -->
      <div v-if="isCreditCard" :class="{ 'w-[calc(50%-10px)]': !checkIsNonPo() }">
        <p class="text-xs font-normal text-gray-700">Proposal Amount</p>
        <p class="text-sm font-medium">{{ form.proposalAmountVal || '-' }}</p>
      </div>

      <!-- Invoice Vendor No. - Only for Reimbursement -->
      <div v-if="isReimbursement" :class="{ 'w-[calc(50%-10px)]': !checkIsNonPo() }">
        <p class="text-xs font-normal text-gray-700">Invoice Vendor No.</p>
        <p class="text-sm font-medium">{{ form.invoiceNoVendor || '-' }}</p>
      </div>

      <!-- Invoice Date - Only for Reimbursement -->
      <div v-if="isReimbursement" :class="{ 'w-[calc(50%-10px)]': !checkIsNonPo() }">
        <p class="text-xs font-normal text-gray-700">Invoice Date</p>
        <p class="text-sm font-medium whitespace-nowrap">
          {{ form.invoiceDate ? moment(form.invoiceDate).format('YYYY/MM/DD') : '-' }}
        </p>
      </div>

      <!-- Tax Document No. - Only for Reimbursement, CAS, and LBA (NOT for Credit Card and Petty Cash) -->
      <div v-if="isReimbursement || isCAS || isLBA" :class="{ 'w-[calc(50%-10px)]': !checkIsNonPo() }">
        <p class="text-xs font-normal text-gray-700">Tax Document No.</p>
        <p class="text-sm font-medium">{{ form.taxNoInvoice || '-' }}</p>
      </div>

      <!-- Currency - Always shown -->
      <div :class="{ 'w-[calc(50%-10px)]': !checkIsNonPo() }">
        <p class="text-xs font-normal text-gray-700">Currency</p>
        <p class="text-sm font-medium">{{ form.currency || '-' }}</p>
      </div>

      <!-- Remaining DP Amount - Only for DP type 9013 -->
      <div v-if="form.invoiceDp === '9013'" :class="{ 'w-[calc(50%-10px)]': !checkIsNonPo() }">
        <p class="text-xs font-normal text-gray-700">Remaining DP Amount</p>
        <p class="text-sm font-medium">{{ form.remainingDpAmount || '0' }}</p>
      </div>

      <!-- DP Amount Deduction - Only for DP type 9013 -->
      <div v-if="form.invoiceDp === '9013'" :class="{ 'w-[calc(50%-10px)]': !checkIsNonPo() }">
        <p class="text-xs font-normal text-gray-700">DP Amount Deduction</p>
        <p class="text-sm font-medium">{{ form.dpAmountDeduction || '0' }}</p>
      </div>

      <!-- Requestor - Only for Non-PO -->
      <div v-if="checkIsNonPo()" :class="{ 'w-[calc(50%-10px)]': !checkIsNonPo() }">
        <p class="text-xs font-normal text-gray-700">Requestor</p>
        <p class="text-sm font-medium">{{ form.department || '-' }}</p>
      </div>

      <!-- Description - Always shown except for type 903 -->
      <div v-if="form.invoiceType !== '903'" :class="{ 'w-[calc(50%-10px)]': !checkIsNonPo() }">
        <p class="text-xs font-normal text-gray-700">Description</p>
        <p class="text-sm font-medium">{{ form.description || '-' }}</p>
      </div>

      <!-- DP Option - Only for PO type 901 -->
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

const invoiceMasterApi = useInvoiceMasterDataStore()
const form = inject<formTypes>('form')
const route = useRoute()
const typeForm = ref<string>('')

const dpTypeList = computed(() => invoiceMasterApi.dpType)
const listInvoiceTypePo = computed(() => invoiceMasterApi.invoicePoType)
const companyCodeList = computed(() => invoiceMasterApi.companyCode)
const listInvoiceTypeNonPo = computed(() => invoiceMasterApi.invoiceNonPoType)

// Check invoice types
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
    if (route.query.type === 'po-view') return 'Without DP'
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

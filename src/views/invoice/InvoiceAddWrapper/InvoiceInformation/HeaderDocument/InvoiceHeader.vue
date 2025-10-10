<template>
  <div>
    <p class="mb-[16px] font-semibold text-base">Invoice Header</p>
    <div v-if="form">
      <!-- Invoice Type -->
      <div v-if="checkPo() || checkIsNonPo()" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Invoice Type
          <span v-if="(form.status === 0 || form.status === -1 || form.status === 5) && !loginApi.isVendor"
            class="text-red-500 ml-[4px]">*</span>
        </label>
        <template v-if="checkIsNonPo()">
          <select v-model="form.invoiceType" class="select" :class="{ 'border-danger': form.invoiceTypeError }" >
            <option v-for="item of invoiceTypeNonPo" :key="item.id" :value="item.id">
              {{ item.name }}
            </option>
          </select>
        </template>
        <template v-else>
          <input v-if="(form.status !== 0 && form.status !== -1) || loginApi.isVendor" v-model="form.invoiceTypeName" class="input" placeholder="" disabled />
          <select v-else v-model="form.invoiceType" class="select" :class="{ 'border-danger': form.invoiceTypeError }" @change="removeDpValue()" >
            <option v-for="item of listInvoiceTypePo" :key="item.code" :value="item.code">
              {{ item.name }}
            </option>
          </select>
        </template>
      </div>
      <div v-if="checkIsNonPo()" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Vendor No.
          <span class="text-red-500 ml-[4px]">*</span>
        </label>
        <input v-model="form.vendorId" class="input" placeholder="" disabled />
      </div>

      <!-- Company Code -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Company Code
          <span class="text-red-500 ml-[4px]">*</span>
        </label>
        <input v-if="form.status !== 0 && form.status !== -1 && form.status !== 5" v-model="form.companyCode"
          class="input" placeholder="" disabled />
        <select v-else v-model="form.companyCode" class="select" :class="{ 'border-danger': form.companyCodeError }">
          <option v-for="item of companyCodeList" :key="item.code" :value="item.code">
            {{ item.name }}
          </option>
        </select>
      </div>

      <!-- Reference - Show only for Petty Cash (readonly) -->
      <div v-if="isPettyCash" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Reference
        </label>
        <input v-model="form.reference" class="input" placeholder="Auto Generated Number" disabled />
      </div>

      <!-- Cash Journal - only for Petty Cash (active) -->
      <div v-if="isPettyCash" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Cash Journal
        </label>
        <input v-model="form.cashJournal" class="input" placeholder="" />
      </div>

      <!-- Petty Cash Period - range picker limited to selected month (only for Petty Cash) -->
      <div v-if="isPettyCash" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Petty Cash Period
        </label>
        <DateRangePicker v-model="form.pettyCashPeriod" format="yyyy/MM/dd" class="w-full -ml-[15px]" teleport :min-days="7" />
      </div>

      <!-- CAS No - Show only for CAS type (readonly) or editable for LBA -->
      <div v-if="isCAS || isLBA" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          CAS No.
          <span v-if="isCAS" class="text-red-500 ml-[4px]">*</span>
        </label>
        <input v-model="form.casNo" class="input" :placeholder="isCAS ? 'Auto Generated Number' : ''" :disabled="isCAS" />
      </div>

      <!-- Submitted Document No. (readonly) for Reimbursement, Credit Card, LBA -->
      <div v-if="isReimbursement || isCreditCard || isLBA" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Submitted Document No.
        </label>
        <input v-model="form.invoiceNo" class="input" placeholder="Auto Generated Number" disabled />
      </div>

      <!-- Proposal Amount - Show for Credit Card only -->
      <div v-if="isCreditCard" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Proposal Amount
          <span class="text-red-500 ml-[4px]">*</span>
        </label>
        <input v-model="form.proposalAmountVal" class="input" placeholder=""
          :disabled="form.status !== 0 && form.status !== -1 && form.status !== 5" />
      </div>

      <!-- Invoice Document No. * (only for Reimbursement) -->
      <div v-if="isReimbursement" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Invoice Vendor No.
          <span class="text-red-500 ml-[4px]">*</span>
        </label>
        <input v-model="form.invoiceNoVendor" class="input" placeholder=""
          :disabled="form.status !== 0 && form.status !== -1 && form.status !== 5"
          :class="{ 'border-danger': form.invoiceNoVendorError }" />
      </div>

      <!-- Invoice Date (only for Reimbursement) -->
      <div v-if="isReimbursement" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Invoice Date
          <span class="text-red-500 ml-[4px]">*</span>
        </label>
        <DatePicker v-model="form.invoiceDate" format="yyyy/MM/dd" :error="form.invoiceDateError"
          :disabled="form.status !== 0 && form.status !== -1 && form.status !== 5" class="w-full -ml-[15px]" teleport />
      </div>

      <!-- Tax Document No - Show for Reimbursement, CAS, and LBA -->
      <div v-if="isReimbursement || isCAS || isLBA" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Tax Document No.
          <span class="text-red-500 ml-[4px]">*</span>
        </label>
        <input v-model="form.taxNoInvoice" class="input" placeholder=""
          :disabled="form.status !== 0 && form.status !== -1 && form.status !== 5"
          :class="{ 'border-danger': form.taxNoInvoiceError }" />
      </div>
      <!-- Currency -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Currency
        </label>
        <input v-if="form.status !== 0 && form.status !== -1 && form.status !== 5" v-model="form.currency" class="input"
          placeholder="" disabled />
        <select v-else v-model="form.currency" class="select" :class="{ 'border-danger': form.currencyError }">
          <option v-for="item of currencyList" :key="item.code" :value="item.code">
            {{ item.code }}
          </option>
        </select>
      </div>
      <!-- Remaining DP Amount -->
      <div v-if="form.invoiceDp === '9013'" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Remaining DP Amount
        </label>
        <input v-model="remainingDpAmountVal" class="input" placeholder="" disabled />
      </div>
      <!-- DP Amount Deduction -->
      <div v-if="form.invoiceDp === '9013'" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          DP Amount Deduction
          <span class="text-red-500 ml-[4px]">*</span>
        </label>
        <input v-model="form.dpAmountDeduction" class="input" placeholder="" type="number"
          :disabled="form.status !== 0 && form.status !== -1 && form.status !== 5"
          :class="{ 'border-danger': form.dpAmountDeductionError }" />
      </div>
      <!-- Department -->
      <div v-if="checkIsNonPo()" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Requestor
          <span class="text-red-500 ml-[4px]">*</span>
        </label>
        <v-select
          v-model="form.department"
          class="customSelect w-full -ml-[15px]"
          label="workflowDescription"
          placeholder="Select"
          :reduce="(option: any) => option.workflowCode"
          :options="listMatrixApproval"
          :class="{ 'error-select': form.departmentError }"
          appendToBody
        ></v-select>
      </div>
      <!-- Description -->
      <div v-if="form.invoiceType != '903'" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Description
          <span class="text-red-500 ml-[4px]">*</span>
        </label>
        <textarea v-model="form.description" class="textarea" placeholder=""
          :disabled="form.status !== 0 && form.status !== -1 && form.status !== 5"
          :class="{ 'border-danger': form.descriptionError }"></textarea>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch, inject } from 'vue'
import { useRoute } from 'vue-router'
import type { formTypes } from '../../../types/invoiceAddWrapper'
import DatePicker from '@/components/datePicker/DatePicker.vue'
import DateRangePicker from '@/components/datePicker/DateRangePicker.vue'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'
import { useLoginStore } from '@/stores/views/login'
import { useFormatIdr, useFormatUsd } from '@/composables/currency'

const invoiceMasterApi = useInvoiceMasterDataStore()
const loginApi = useLoginStore()
const form = inject<formTypes>('form')
const route = useRoute()
const typeForm = ref<string>('')

const invoiceTypeNonPo = ref([
  {
    id: '1',
    name: 'Non PO/Reimbursement'
  },
  {
    id: '2',
    name: 'Credit Card'
  },
  {
    id: '3',
    name: 'CAS'
  },
  {
    id: '4',
    name: 'LBA'
  },
  {
    id: '5',
    name: 'Petty Cash'
  }
])

const currencyList = computed(() => {
  return invoiceMasterApi.currency
  // if (form?.invoicePoGr.length === 0 || !form?.invoicePoGr) {
  //   return []
  // } else {
  //   const result = []
  //   for (const item of form.invoicePoGr) {
  //     const check = invoiceMasterApi.currency.findIndex((subItem) => subItem.code === item.currency)
  //     if (check !== -1) result.push(item.currency)
  //   }
  //   return result
  // }
})
const companyCodeList = computed(() => invoiceMasterApi.companyCode)
const listInvoiceTypePo = computed(() => invoiceMasterApi.invoicePoType)
const listInvoiceTypeNonPo = computed(() => invoiceMasterApi.invoiceNonPoType)
const listMatrixApproval = computed(() => invoiceMasterApi.matrixApprovalList)

// Date range picker no longer needs these variables for month constraints

// Note: We removed month options and date constraints to allow cross-month selection in the date range picker


// Helper computed properties for invoice type checks
const isReimbursement = computed(() => form?.invoiceType === '1')
const isCreditCard = computed(() => form?.invoiceType === '2')
const isCAS = computed(() => form?.invoiceType === '3')
const isLBA = computed(() => form?.invoiceType === '4')
const isPettyCash = computed(() => form?.invoiceType === '5')

const remainingDpAmountVal = computed(() => {
  if (form.currency === 'IDR') {
    return useFormatIdr(form.remainingDpAmount)
  } else {
    return useFormatUsd(form.remainingDpAmount)
  }
})

const checkPo = () => {
  return typeForm.value === 'po'
}

const checkIsNonPo = () => {
  return route.query.type === 'nonpo'
}

const removeDpValue = () => {
  if (form && form?.invoiceType !== '901') {
    form.invoiceDp = ''
  }
}

watch(
  () => form,
  () => {
    if (form?.invoiceType) {
      if (checkIsNonPo()) {
        const getIndex = listInvoiceTypeNonPo.value.findIndex((item) => item.code === form.invoiceType)
        if (getIndex !== -1) form.invoiceTypeName = listInvoiceTypeNonPo.value[getIndex].name
      } else {
        const getIndex = listInvoiceTypePo.value.findIndex((item) => item.code === form.invoiceType)
        if (getIndex !== -1) form.invoiceTypeName = listInvoiceTypePo.value[getIndex].name
      }
    }

    if (form?.companyCode) {
      const getIndex = companyCodeList.value.findIndex((item) => item.code === form.companyCode)
      if (getIndex !== -1) form.companyName = companyCodeList.value[getIndex].name.split(' - ')[1]
    }
  },
  {
    deep: true
  }
)

watch(
  () => [form?.companyCode, form.invoiceType],
  () => {
    if (form.companyCode) invoiceMasterApi.getActivity(form.companyCode || '')
    if (form.companyCode && form.invoiceType) invoiceMasterApi.getMatrixApproval(form.invoiceType || '', form.companyCode || '')
  },
  {
    immediate: true
  }
)

onMounted(() => {
  typeForm.value = route.query.type?.toString().toLowerCase() || 'po'
  invoiceMasterApi.getCurrency()
  invoiceMasterApi.getCompanyCode()
  invoiceMasterApi.getDpTypes()
})
</script>

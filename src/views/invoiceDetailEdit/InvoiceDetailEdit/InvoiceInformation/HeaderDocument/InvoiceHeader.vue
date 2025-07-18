<template>
  <div>
    <p class="mb-[16px] font-semibold text-base">Invoice Header</p>
    <div v-if="form">
      <!-- Invoice Type -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Invoice Type
        </label>
        <input :value="getInvoiceTypeName()" class="input" placeholder="" disabled />
      </div>
      <!-- DP Option -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          DP Option
        </label>
        <input :value="getDpName()" class="input" placeholder="" disabled />
      </div>
      <!-- Invoice Date -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Invoice Date
          <span class="text-red-500 ml-[4px]">*</span>
        </label>
        <DatePicker v-model="form.invoiceDate" :error="form.invoiceDateError" class="w-full -ml-[15px]" />
      </div>
      <!-- Posting Date -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Posting Date
          <span class="text-red-500 ml-[4px]">*</span>
        </label>
        <DatePicker v-model="form.postingDate" :error="form.postingDateError" class="w-full -ml-[15px]" />
      </div>
      <!-- Invoice No. -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Invoice No.
        </label>
        <input v-model="form.invoiceNo" class="input" placeholder="" disabled />
      </div>
      <!-- Company Code -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Company Code
        </label>
        <input :value="form.companyName" class="input" placeholder="" disabled />
      </div>
      <!-- Invoicing Party -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Invoicing Party
        </label>
        <input v-model="form.invoicingParty" class="input" placeholder="" :class="{ 'border-danger': form.invoicingPartyError }" />
      </div>
      <!-- Estimated Payment Date * -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Estimated Payment Date
          <span class="text-red-500 ml-[4px]">*</span>
        </label>
        <DatePicker v-model="form.estimatedPaymentDate" :error="form.estimatedPaymentDateError" class="w-full -ml-[15px]" />
      </div>
      <!-- No Tax Invoice -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          No Tax Invoice
        </label>
        <input v-model="form.taxNo" class="input" placeholder="" :class="{ 'border-danger': form.taxNoError }" />
      </div>
      <!-- No Invoice Vendor -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          No Invoice Vendor
          <span class="text-red-500 ml-[4px]">*</span>
        </label>
        <input v-model="form.documentNo" class="input" placeholder="" :class="{ 'border-danger': form.documentNoError }" />
      </div>
      <!-- Payment Method -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Payment Method
          <span class="text-red-500 ml-[4px]">*</span>
        </label>
        <select v-model="form.paymentMethodCode" class="select" placeholder="" :class="{ 'border-danger': form.paymentMethodError }">
          <option v-for="item of paymentMethodList" :key="item.code" :value="item.code">
            {{ item.name }}
          </option>
        </select>
      </div>
      <!-- Assignment -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Assignment
        </label>
        <input v-model="form.assigment" class="input" placeholder="" :class="{ 'border-danger': form.assignmentError }" />
      </div>
      <!-- Transfer News -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Transfer News
          <span class="text-red-500 ml-[4px]">*</span>
        </label>
        <input v-model="form.transferNews" class="input" placeholder="" :class="{ 'border-danger': form.transferNewsError }" />
      </div>
      <!-- Currency -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Currency
        </label>
        <input :value="form.currCode" class="input" placeholder="" disabled />
        <!-- <select v-model="form.currCode" class="select" :class="{ 'border-danger': form.currCodeError }">
          <option v-for="item of currencyList" :key="item.code" :value="item.code">
            {{ item.code }}
          </option>
        </select> -->
      </div>
      <!-- NPWP Reporting -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          NPWP Reporting
        </label>
        <input v-model="form.npwpReporting" class="input" placeholder="" :class="{ 'border-danger': form.npwpReportingError }" :disabled="userData?.profile.profileId === 3002" />
      </div>
      <!-- Remaining DP Amount -->
      <div v-if="form.invoiceDPCode === 9013" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Remaining DP Amount
        </label>
        <input v-model="form.remainingDpAmount" class="input" placeholder="" disabled/>
      </div>
      <!-- DP Amount Deduction -->
      <div v-if="form.invoiceDPCode === 9013" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          DP Amount Deduction
          <span class="text-red-500 ml-[4px]">*</span>
        </label>
        <input
          v-model="form.dpAmountDeduction"
          class="input"
          placeholder=""
        />
      </div>
      <!-- Description -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Description
          <span class="text-red-500 ml-[4px]">*</span>
        </label>
        <textarea
          v-model="form.notes"
          class="textarea"
          placeholder=""
          :class="{ 'border-danger': form.notesError }"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, inject, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import type { formTypes } from '../../../types/invoiceDetailEdit'
import DatePicker from '@/components/datePicker/DatePicker.vue'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'
import { useLoginStore } from '@/stores/views/login'

const invoiceMasterApi = useInvoiceMasterDataStore()
const invoiceLoginApi = useLoginStore()
const form = inject<Ref<formTypes>>('form')
const route = useRoute()
const typeForm = ref<string>('')

const dpTypeList = computed(() => invoiceMasterApi.dpType)
const listInvoiceTypePo = computed(() => invoiceMasterApi.invoicePoType)
// const currencyList = computed(() => invoiceMasterApi.currency)
const paymentMethodList = computed(() => invoiceMasterApi.paymentMethodList)
const userData = computed(() => invoiceLoginApi.userData)

const getDpName = () => {
  if (route.query.type === 'po-view') return 'Without DP'
  const getIndex = dpTypeList.value.findIndex((item) => item.code === form?.value.invoiceDPCode.toString())
  if (getIndex !== -1) return dpTypeList.value[getIndex].name
}

const getInvoiceTypeName = () => {
  const getIndex = listInvoiceTypePo.value.findIndex((item) => item.code === form?.value.invoiceTypeCode.toString())
  if (getIndex !== -1) return listInvoiceTypePo.value[getIndex].name
}

// const checkPo = () => {
//   return typeForm.value === 'po'
// }

watch(
  () => form,
  () => {
    if (form?.value.paymentMethodCode) {
      const getIndex = paymentMethodList.value.findIndex((item) => item.code === form.value.paymentMethodCode)
      if (getIndex !== -1) form.value.paymentMethodName = paymentMethodList.value[getIndex].name
    }
  },
  {
    deep: true
  }
)

onMounted(() => {
  typeForm.value = route.query.type?.toString().toLowerCase() || 'po'
})
</script>

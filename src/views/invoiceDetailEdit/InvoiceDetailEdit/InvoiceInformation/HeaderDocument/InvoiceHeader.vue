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
      <div v-if="checkPo()" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          DP Option
        </label>
        <input :value="getDpName()" class="input" placeholder="" disabled />
      </div>
      <!-- Invoice Date -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Invoice Date
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
        <input v-model="form.invoiceNumber" class="input" placeholder="" disabled />
      </div>
      <!-- Company Code -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Company Code
        </label>
        <select v-model="form.companyCode" class="select" :class="{ 'border-danger': form.companyCodeError }">
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
        <input v-model="form.taxNumberInvoice" class="input" placeholder="" :class="{ 'border-danger': form.taxNumberInvoiceError }" />
      </div>
      <!-- No Invoice Vendor -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          No Invoice Vendor
        </label>
        <input v-model="form.invoiceNumberVendor" class="input" placeholder="" :class="{ 'border-danger': form.invoiceNumberVendorError }" />
      </div>
      <!-- Payment Method -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Payment Method
          <span class="text-red-500 ml-[4px]">*</span>
        </label>
        <input v-model="form.paymentMethod" class="input" placeholder="" :class="{ 'border-danger': form.paymentMethodError }" />
      </div>
      <!-- Assignment -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Assignment
          <span class="text-red-500 ml-[4px]">*</span>
        </label>
        <input v-model="form.assignment" class="input" placeholder="" :class="{ 'border-danger': form.assignmentError }" />
      </div>
      <!-- Transfer News -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Transfer News
        </label>
        <input v-model="form.transferNews" class="input" placeholder="" :class="{ 'border-danger': form.transferNewsError }" />
      </div>
      <!-- Currency -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Currency
        </label>
        <select v-model="form.currency" class="select" :class="{ 'border-danger': form.currencyError }">
          <option v-for="item of currencyList" :key="item.code" :value="item.code">
            {{ item.code }}
          </option>
        </select>
      </div>
      <!-- NPWP Reporting -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          NPWP Reporting
        </label>
        <input v-model="form.npwpReporting" class="input" placeholder="" :class="{ 'border-danger': form.npwpReportingError }" />
      </div>
      <!-- Description -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Description
        </label>
        <textarea
          v-model="form.description"
          class="textarea"
          placeholder=""
          :disabled="form.status !== 0"
          :class="{ 'border-danger': form.descriptionError }"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, inject } from 'vue'
import { useRoute } from 'vue-router'
import type { formTypes } from '../../../types/invoiceDetailEdit'
import DatePicker from '@/components/datePicker/DatePicker.vue'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'

const invoiceMasterApi = useInvoiceMasterDataStore()
const form = inject<formTypes>('form')
const route = useRoute()
const typeForm = ref<string>('')

const dpTypeList = computed(() => invoiceMasterApi.dpType)
const listInvoiceTypePo = computed(() => invoiceMasterApi.invoicePoType)
const currencyList = computed(() => invoiceMasterApi.currency)

const getDpName = () => {
  if (route.query.type === 'po-view') return 'Without DP'
  const getIndex = dpTypeList.value.findIndex((item) => item.code === form?.invoiceDp)
  if (getIndex !== -1) return dpTypeList.value[getIndex].name
}

const getInvoiceTypeName = () => {
  const getIndex = listInvoiceTypePo.value.findIndex((item) => item.code === form?.invoiceType)
  if (getIndex !== -1) return listInvoiceTypePo.value[getIndex].name
}

const checkPo = () => {
  return typeForm.value === 'po'
}

onMounted(() => {
  typeForm.value = route.query.type?.toString().toLowerCase() || 'po'
})
</script>

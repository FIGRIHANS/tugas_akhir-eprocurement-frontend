<template>
  <div>
    <p class="mb-[16px] font-semibold text-base">Invoice Header</p>
    <div v-if="form">
      <div v-if="checkPo()" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <div class="flex-1"></div>
        <div v-if="form.invoiceType !== 'pib'" class="flex items-center gap-[8px] flex-1">
          <label class="form-label flex items-center gap-2.5">
            <input v-model="form.invoiceDp" class="checkbox" name="checkInvoiceDp" type="checkbox" disabled/>
            Invoice DP
          </label>
          <label class="form-label flex items-center gap-2.5">
            <input v-model="form.withDp" class="checkbox" name="checkWithDp" type="checkbox" disabled/>
            With Dp
          </label>
        </div>
      </div>
      <!-- Invoice Date -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Invoice Date
        </label>
        <DatePicker v-model="form.invoiceDate" :error="form.invoiceDateError" class="flex" />
      </div>
      <!-- Posting Date -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Posting Date
          <span class="text-red-500 ml-[4px]">*</span>
        </label>
        <DatePicker v-model="form.postingDate" :error="form.postingDateError" class="flex" />
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
      <!-- Estimated Payment Date * -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Estimated Payment Date
          <span class="text-red-500 ml-[4px]">*</span>
        </label>
        <DatePicker v-model="form.estimatedPaymentDate" :error="form.estimatedPaymentDateError" class="flex" />
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
      <!-- NPWP Reporting -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          NPWP Reporting
        </label>
        <DatePicker v-model="form.npwpReporting" :error="form.npwpReportingError" class="flex" />
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
import { ref, onMounted, inject } from 'vue'
import { useRoute } from 'vue-router'
import type { formTypes } from '../../../types/invoiceDetailEdit'
import DatePicker from '@/components/datePicker/DatePicker.vue'

const form = inject<formTypes>('form')
const route = useRoute()
const typeForm = ref<string>('')

const checkPo = () => {
  return typeForm.value === 'po'
}

onMounted(() => {
  typeForm.value = route.query.type?.toString().toLowerCase() || 'po'
})
</script>

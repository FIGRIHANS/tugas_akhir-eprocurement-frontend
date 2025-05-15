<template>
  <div>
    <p class="mb-[16px] font-semibold text-base">Invoice Header</p>
    <div v-if="form">
      <div v-if="checkPo()" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <div class="flex-1"></div>
        <div v-if="form.invoiceType !== 'pib'" class="flex items-center gap-[8px] flex-1">
          <label class="form-label flex items-center gap-2.5">
            <input v-model="form.invoiceDp" class="checkbox" name="checkInvoiceDp" type="checkbox" :disabled="form.withDp || form.status !== 0"/>
            Invoice DP
          </label>
          <label class="form-label flex items-center gap-2.5">
            <input v-model="form.withDp" class="checkbox" name="checkWithDp" type="checkbox" :disabled="form.invoiceDp || form.status !== 0"/>
            With Dp
          </label>
        </div>
      </div>
      <!-- Company Code -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Company Code
        </label>
        <input v-if="form.status !== 0" v-model="form.companyCode" class="input" placeholder="" disabled />
        <select v-else v-model="form.companyCode" class="select" :class="{ 'border-danger': form.companyCodeError }">
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
      <!-- No Invoice -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          No Invoice
        </label>
        <input v-model="form.invoiceNo" class="input" placeholder="" disabled/>
      </div>
      <!-- No Invoice Vendor -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          No Invoice Vendor
        </label>
        <input v-model="form.invoiceNoVendor" class="input" placeholder=""  :disabled="form.status !== 0" :class="{ 'border-danger': form.invoiceNoVendorError }"/>
      </div>
      <!-- Invoice Date -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Invoice Date
        </label>
        <DatePicker v-model="form.invoiceDate" :error="form.invoiceDateError" :disabled="form.status !== 0" class="flex" />
      </div>
      <!-- No Tax Invoice -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          No Tax Invoice
        </label>
        <input v-model="form.taxNoInvoice" class="input" placeholder="" :disabled="form.status !== 0" :class="{ 'border-danger': form.taxNoInvoiceError }"/>
      </div>
      <!-- Currency -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Currency
        </label>
        <input v-if="form.status !== 0" v-model="form.currency" class="input" placeholder="" disabled />
        <select v-else v-model="form.currency" class="select" :class="{ 'border-danger': form.currencyError }">
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
      <!-- Remaining DP Amount -->
      <div v-if="form.withDp" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Remaining DP Amount
        </label>
        <input v-model="form.remainingDpAmount" class="input" placeholder="" disabled/>
      </div>
      <!-- DP Amount Deduction -->
      <div v-if="form.withDp" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          DP Amount Deduction
        </label>
        <input v-model="form.dpAmountDeduction" class="input" placeholder="" :disabled="form.status !== 0" :class="{ 'border-danger': form.dpAmountDeductionError }"/>
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
import type { formTypes } from '../../../types/invoiceAddWrapper'
import DatePicker from '@/components/datePicker/DatePicker.vue'

const form = inject<formTypes>('form')
const route = useRoute()
const typeForm = ref<string>('')

const checkPo = () => {
  return typeForm.value === 'po'
}

// const checkNonPo = () => {
//   return typeForm.value === 'nonpo'
// }

onMounted(() => {
  typeForm.value = route.query.type?.toString().toLowerCase() || 'po'
})
</script>

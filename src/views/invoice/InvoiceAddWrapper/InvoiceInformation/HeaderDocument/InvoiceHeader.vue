<template>
  <div>
    <p class="mb-[16px] font-semibold text-base">Invoice Header</p>
    <div v-if="form">
      <!-- Invoice No -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label max-w-32">
          Invoice No
        </label>
        <input v-model="form.invoiceNo" class="input" placeholder="" disabled/>
      </div>
      <!-- No Supplier Invoice -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label max-w-32">
          No Supplier Invoice
        </label>
        <input v-model="form.supplierInvoiceNumber" class="input" placeholder="" :class="{ 'border-danger': form.supplierInvoiceNumberError }"/>
      </div>
      <!-- Tanggal Invoice -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label max-w-32">
          Tanggal Invoice
        </label>
        <DatePicker v-model="form.invoiceDate" :error="form.invoiceDateError" />
      </div>
      <!-- No Faktur Pajak -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label max-w-32">
          No Faktur Pajak
        </label>
        <input v-model="form.taxNumber" class="input" placeholder="" :class="{ 'border-danger': form.taxNumberError }"/>
      </div>
      <!-- Tanggal Faktur -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label max-w-32">
          Tanggal Faktur
        </label>
        <DatePicker v-model="form.taxDate" :error="form.taxDateError" />
      </div>
      <!-- Tax Code -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label max-w-32">
          Tax Code
        </label>
        <select v-model="form.taxCode" class="select" :class="{ 'border-danger': form.taxCodeError }">
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
      <!-- WHT Code -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label max-w-32">
          WHT Code
        </label>
        <select v-model="form.taxCode" class="select" :class="{ 'border-danger': form.taxCodeError }">
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
      <!-- Payment Term -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label max-w-32">
          Payment Term
        </label>
        <select v-model="form.taxCode" class="select" :class="{ 'border-danger': form.taxCodeError }">
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
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <div class="w-[128px]"></div>
        <div class="flex items-center gap-[8px] flex-1">
          <label class="form-label flex items-center gap-2.5">
            <input v-model="form.invoiceDp" class="checkbox" name="checkInvoiceDp" type="checkbox" :disabled="form.withDp"/>
            Invoice DP
          </label>
          <label class="form-label flex items-center gap-2.5">
            <input v-model="form.withDp" class="checkbox" name="checkWithDp" type="checkbox" :disabled="form.invoiceDp"/>
            With Dp
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import DatePicker from '@/components/datePicker/DatePicker.vue'
import type { formTypes } from '../../../types/invoiceAddWrapper'

const form = inject<formTypes>('form')
</script>

<template>
  <div>
    <p class="mb-[16px] font-semibold text-base">Invoice Header</p>
    <div v-if="form" class="flex gap-[24px]">
      <diV class="flex-1">
        <!-- Invoice No -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
          <label class="form-label max-w-32">
            Invoice No
          </label>
          <input v-model="form.invoiceNo" class="input" placeholder="" :class="{ 'border-danger': form.invoiceNoError }"/>
        </div>
        <!-- No Faktur Pajak -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
          <label class="form-label max-w-32">
            No Faktur Pajak
          </label>
          <input v-model="form.taxInvoiceNumber" class="input" placeholder="" :class="{ 'border-danger': form.taxInvoiceNumberError }"/>
        </div>
        <!-- Tanggal Faktur -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
          <label class="form-label max-w-32">
            Tanggal Faktur
          </label>
          <DatePicker v-model="form.taxDate" :error="form.taxDateError" />
        </div>
        <!-- Tax Calculation -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
          <label class="form-label max-w-32">
            Tax Calculation
          </label>
          <select v-model="form.taxCalculationId" class="select" :class="{ 'border-danger': form.taxCalculationIdError }">
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
        <!-- Tax Code -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
          <label class="form-label max-w-32">
            Tax Code
          </label>
          <input v-model="form.taxCode" class="input" placeholder="" :class="{ 'border-danger': form.taxCodeError }"/>
        </div>
        <!-- WHT Code -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
          <label class="form-label max-w-32">
            WHT Code
          </label>
          <input v-model="form.whtCode" class="input" placeholder="" :class="{ 'border-danger': form.whtCodeError }"/>
        </div>
        <!-- Payment Term -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
          <label class="form-label max-w-32">
            Payment Term
          </label>
          <input v-model="form.paymentTerm" class="input" placeholder="" :class="{ 'border-danger': form.paymentTermError }"/>
        </div>
      </diV>
      <diV class="flex-1">
        <!-- Invoice No -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
          <label class="form-label max-w-32">
            Invoice No
          </label>
          <input class="input" placeholder=""/>
        </div>
        <!-- No Faktur Pajak -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
          <label class="form-label max-w-32">
            No Faktur Pajak
          </label>
          <input class="input" placeholder=""/>
        </div>
        <!-- Tanggal Faktur -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
          <label class="form-label max-w-32">
            Tanggal Faktur
          </label>
          <DatePicker v-model="date" />
        </div>
        <!-- Tax Calculation -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
          <label class="form-label max-w-32">
            Tax Calculation
          </label>
          <select class="select">
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
        <!-- Tax Code -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
          <label class="form-label max-w-32">
            Tax Code
          </label>
          <input class="input" placeholder=""/>
        </div>
        <!-- WHT Code -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
          <label class="form-label max-w-32">
            WHT Code
          </label>
          <input class="input" placeholder=""/>
        </div>
        <!-- Payment Term -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
          <label class="form-label max-w-32">
            Payment Term
          </label>
          <input class="input" placeholder=""/>
        </div>
      </diV>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, inject } from 'vue'
import DatePicker from '@/components/datePicker/DatePicker.vue'
import type { formTypes } from '../../../types/invoiceAddWrapper'

const form = inject<formTypes>('form')
const date = ref<string>('')
</script>

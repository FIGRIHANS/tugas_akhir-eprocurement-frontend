<template>
  <div v-if="form" class="flex flex-col gap-[20px]">
    <div v-if="checkPo() && !checkPoPib()" class="flex items-center gap-[8px]">
      <label class="form-label flex items-center gap-2.5">
        <input v-model="form.invoiceDp" class="checkbox" name="checkInvoiceDp" type="checkbox" disabled/>
        <span class="text-gray-500">Invoice DP</span>
      </label>
      <label class="form-label flex items-center gap-2.5">
        <input v-model="form.withDp" class="checkbox" name="checkWithDp" type="checkbox" disabled/>
        <span class="text-gray-500">With Dp</span>
      </label>
    </div>
    <div class="flex items-center justify-between gap-[10px]">
      <p class="font-normal text-sm text-gray-600">Invoice Date</p>
      <p class="font-normal text-sm">{{ form.invoiceDate || '-' }}</p>
    </div>
    <div class="flex items-center justify-between gap-[10px]">
      <p class="font-normal text-sm text-gray-600">Posting Date</p>
      <p class="font-normal text-sm">{{ form.postingDate || '-' }}</p>
    </div>
    <div class="flex items-center justify-between gap-[10px]">
      <p class="font-normal text-sm text-gray-600">Invoice No</p>
      <p class="font-normal text-sm">{{ form.invoiceNo || '-' }}</p>
    </div>
    <div class="flex items-center justify-between gap-[10px]">
      <p class="font-normal text-sm text-gray-600">Company Code</p>
      <p class="font-normal text-sm">{{ form.companyCode || '-' }}</p>
    </div>
    <div class="flex items-center justify-between gap-[10px]">
      <p class="font-normal text-sm text-gray-600">Invoicing Party</p>
      <p class="font-normal text-sm">{{ form.invoicingParty || '-' }}</p>
    </div>
    <div class="flex items-center justify-between gap-[10px]">
      <p class="font-normal text-sm text-gray-600">Estimated Payment Date</p>
      <p class="font-normal text-sm">{{ form.estimatedPaymentDate || '-' }}</p>
    </div>
    <div class="flex items-center justify-between gap-[10px]">
      <p class="font-normal text-sm text-gray-600">No Tax Invoice</p>
      <p class="font-normal text-sm">{{ form.taxNumberInvoice || '-' }}</p>
    </div>
    <div class="flex items-center justify-between gap-[10px]">
      <p class="font-normal text-sm text-gray-600">No Invoice Vendor</p>
      <p class="font-normal text-sm">{{ form.invoiceNumberVendor || '-' }}</p>
    </div>
    <div class="flex items-center justify-between gap-[10px]">
      <p class="font-normal text-sm text-gray-600">Payment Method</p>
      <p class="font-normal text-sm">{{ form.paymentMethod || '-' }}</p>
    </div>
    <div class="flex items-center justify-between gap-[10px]">
      <p class="font-normal text-sm text-gray-600">Assignment</p>
      <p class="font-normal text-sm">{{ form.assignment || '-' }}</p>
    </div>
    <div class="flex items-center justify-between gap-[10px]">
      <p class="font-normal text-sm text-gray-600">Transfer News</p>
      <p class="font-normal text-sm">{{ form.transferNews || '-' }}</p>
    </div>
    <div class="flex items-center justify-between gap-[10px]">
      <p class="font-normal text-sm text-gray-600">Currency</p>
      <p class="font-normal text-sm">{{ form.currency || '-' }}</p>
    </div>
    <div class="flex items-center justify-between gap-[10px]">
      <p class="font-normal text-sm text-gray-600">NPWP Reporting</p>
      <p class="font-normal text-sm">{{ form.npwpReporting || '-' }}</p>
    </div>
    <div class="flex items-center justify-between gap-[10px]">
      <p class="font-normal text-sm text-gray-600">Description</p>
      <p class="font-normal text-sm">{{ form.description || '-' }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import type { formTypes } from '../../types/invoiceDetail'

const form = inject<formTypes>('form')

const checkPo = () => {
  return form?.invoiceType === 'po'
}

const checkPoPib = () => {
  return form?.invoiceType === 'pib'
}
</script>

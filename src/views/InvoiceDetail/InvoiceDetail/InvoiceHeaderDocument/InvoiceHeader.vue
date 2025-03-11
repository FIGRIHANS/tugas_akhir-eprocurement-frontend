<template>
  <div v-if="form" class="flex flex-col gap-[20px]">
    <div class="flex items-center justify-between gap-[10px]">
      <p class="font-normal text-sm text-gray-600">Invoice No</p>
      <p class="font-normal text-sm">{{ form.invoiceNo || '-' }}</p>
    </div>
    <div class="flex items-center justify-between gap-[10px]">
      <p class="font-normal text-sm text-gray-600">No Invoice Supplier</p>
      <p class="font-normal text-sm">{{ form.supplierInvoiceNumber || '-' }}</p>
    </div>
    <div class="flex items-center justify-between gap-[10px]">
      <p class="font-normal text-sm text-gray-600">Tanggal Invoice</p>
      <p class="font-normal text-sm">{{ form.invoiceDate }}</p>
    </div>
    <div class="flex items-center justify-between gap-[10px]">
      <p class="font-normal text-sm text-gray-600">No Faktur Pajak</p>
      <p class="font-normal text-sm">{{ form.taxNumber }}</p>
    </div>
    <div class="flex items-center justify-between gap-[10px]">
      <p class="font-normal text-sm text-gray-600">Tanggal Faktur</p>
      <p class="font-normal text-sm">{{ form.taxDate }}</p>
    </div>
    <div class="flex items-center justify-between gap-[10px]">
      <p class="font-normal text-sm text-gray-600">Tax Code</p>
      <p class="font-normal text-sm">{{ form.taxCode }}</p>
    </div>
    <div class="flex items-center justify-between gap-[10px]">
      <p class="font-normal text-sm text-gray-600">WHT Code</p>
      <p class="font-normal text-sm">{{ form.whtCode }}</p>
    </div>
    <div class="flex items-center justify-between gap-[10px]">
      <p class="font-normal text-sm text-gray-600">Payment Term</p>
      <p class="font-normal text-sm">{{ form.paymentTerm }}</p>
    </div>
    <div class="flex items-center gap-[8px]">
      <label class="form-label flex items-center gap-2.5">
        <input v-model="form.invoiceDp" class="checkbox" name="checkInvoiceDp" type="checkbox" disabled/>
        <span class="text-gray-500">Invoice DP</span>
      </label>
      <label class="form-label flex items-center gap-2.5">
        <input v-model="form.withDp" class="checkbox" name="checkWithDp" type="checkbox" disabled/>
        <span class="text-gray-500">With Dp</span>
      </label>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import type { formTypes } from '../../types/invoiceDetail'

const form = inject<formTypes>('form')
</script>

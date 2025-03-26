<template>
  <div v-if="form" class="flex flex-col gap-[24px]">
    <p class="text-lg font-semibold m-[0px]">{{ form.invoiceNo || '-' }}</p>
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <p class="text-xs font-normal text-gray-700">No Invoice Supplier</p>
        <p class="text-sm font-medium">{{ form.supplierInvoiceNumber || '-' }}</p>
      </div>
      <div class="flex-1">
        <p class="text-xs font-normal text-gray-700">Tanggal Invoice</p>
        <p class="text-sm font-medium whitespace-nowrap">{{ form.invoiceDate ? moment(form.invoiceDate).format('DD/MM/YYYY') : '-' }}</p>
      </div>
    </div>
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <p class="text-xs font-normal text-gray-700">No Faktur Pajak</p>
        <p class="text-sm font-medium">{{ form.taxNumber || '-' }}</p>
      </div>
      <div class="flex-1">
        <p class="text-xs font-normal text-gray-700">Tanggal Faktur Pajak</p>
        <p class="text-sm font-medium whitespace-nowrap">{{ form.taxDate ? moment(form.taxDate).format('DD/MM/YYYY') : '-' }}</p>
      </div>
    </div>
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <p class="text-xs font-normal text-gray-700">Tax Code</p>
        <p class="text-sm font-medium">{{ form.taxCode || '-' }}</p>
      </div>
      <div class="flex-1">
        <p class="text-xs font-normal text-gray-700">WHT Code</p>
        <p class="text-sm font-medium whitespace-nowrap">{{ form.whtCode || '-' }}</p>
      </div>
    </div>
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <p class="text-xs font-normal text-gray-700">Estimated Schedule Payment</p>
        <p class="text-sm font-medium">{{ form.paymentDate || '-' }}</p>
      </div>
      <div class="flex-1 flex items-center gap-[8px]">
        <label class="form-label flex items-center gap-2.5 w-fit">
          <input v-model="form.invoiceDp" class="checkbox" name="checkInvoiceDp" type="checkbox" disabled/>
          <span class="text-gray-500">Invoice DP</span>
        </label>
        <label class="form-label flex items-center gap-2.5 w-fit">
          <input v-model="form.withDp" class="checkbox" name="checkWithDp" type="checkbox" disabled/>
          <span class="text-gray-500">With Dp</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import type { formTypes } from '../../types/invoiceAddWrapper'
import moment from 'moment'

const form = inject<formTypes>('form')
</script>

<template>
  <div v-if="form" class="flex flex-col gap-[24px] w-[80%]">
    <p class="text-lg font-semibold m-[0px]">{{ form.invoiceNo || '-' }}</p>
    <div class="flex items-center justify-between">
      <div>
        <p class="text-xs font-normal text-gray-700">No Faktur Pajak</p>
        <p class="text-sm font-medium">{{ form.taxInvoiceNumber || '-' }}</p>
      </div>
      <div class="w-[89px]">
        <p class="text-xs font-normal text-gray-700">Tanggal Faktur</p>
        <p class="text-sm font-medium whitespace-nowrap">{{ form.taxDate ? moment(form.taxDate).format('MMM DD, YYYY') : '-' }}</p>
      </div>
    </div>
    <div class="flex items-center justify-between">
      <div>
        <p class="text-xs font-normal text-gray-700">Tax Calculation</p>
        <p class="text-sm font-medium">{{ form.taxCalculationId || '-' }}</p>
      </div>
      <div class="w-[89px]">
        <p class="text-xs font-normal text-gray-700">Tax Code</p>
        <p class="text-sm font-medium whitespace-nowrap">{{ form.taxCode || '-' }}</p>
      </div>
    </div>
    <div class="flex items-center justify-between">
      <div>
        <p class="text-xs font-normal text-gray-700">WHT Code</p>
        <p class="text-sm font-medium">{{ form.whtCode || '-' }}</p>
      </div>
      <div class="w-[89px]">
        <p class="text-xs font-normal text-gray-700">Payment Term</p>
        <p class="text-sm font-medium whitespace-nowrap">{{ form.paymentTerm || '-' }}</p>
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

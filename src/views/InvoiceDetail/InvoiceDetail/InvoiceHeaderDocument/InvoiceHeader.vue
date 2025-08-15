<template>
  <div v-if="form">
    <!-- Po Header -->
    <div v-if="currentRouteName === 'invoiceDetail'" class="flex flex-col gap-[20px]">
      <div class="flex items-center justify-between gap-[10px]">
        <p class="font-normal text-sm text-gray-600">Invoice Type</p>
        <p class="font-normal text-sm">{{ form.invoiceTypeName || '-' }}</p>
      </div>
      <div v-if="checkPo() && !checkPoPib()" class="flex items-center justify-between gap-[10px]">
        <p class="font-normal text-sm text-gray-600">DP Option</p>
        <p class="font-normal text-sm">{{ form.invoiceDPName || '-' }}</p>
      </div>
      <div class="flex items-center justify-between gap-[10px]">
        <p class="font-normal text-sm text-gray-600">Invoice Date</p>
        <p class="font-normal text-sm">
          {{ form.invoiceDate ? moment(form.invoiceDate).format('YYYYMMDD') : '-' }}
        </p>
      </div>
      <div class="flex items-center justify-between gap-[10px]">
        <p class="font-normal text-sm text-gray-600">Posting Date</p>
        <p class="font-normal text-sm">
          {{ form.postingDate ? moment(form.postingDate).format('YYYYMMDD') : '-' }}
        </p>
      </div>
      <div class="flex items-center justify-between gap-[10px]">
        <p class="font-normal text-sm text-gray-600">Submitted Document No.</p>
        <p class="font-normal text-sm">{{ form.invoiceNo || '-' }}</p>
      </div>
      <div class="flex items-center justify-between gap-[10px]">
        <p class="font-normal text-sm text-gray-600">Company Code</p>
        <p class="font-normal text-sm">
          {{ `${form.companyCode} - ${form.companyName}` || '-' }}
        </p>
      </div>
      <div class="flex items-center justify-between gap-[10px]">
        <p class="font-normal text-sm text-gray-600">Invoicing Party</p>
        <p class="font-normal text-sm">{{ form.invoicingParty || '-' }}</p>
      </div>
      <div class="flex items-center justify-between gap-[10px]">
        <p class="font-normal text-sm text-gray-600">Estimated Payment Date</p>
        <p class="font-normal text-sm">
          {{
            form.estimatedPaymentDate ? moment(form.estimatedPaymentDate).format('YYYYMMDD') : '-'
          }}
        </p>
      </div>
      <div class="flex items-center justify-between gap-[10px]">
        <p class="font-normal text-sm text-gray-600">Tax Document No.</p>
        <p class="font-normal text-sm">{{ form.taxNo || '-' }}</p>
      </div>
      <div class="flex items-center justify-between gap-[10px]">
        <p class="font-normal text-sm text-gray-600">Invoice Vendor No.</p>
        <p class="font-normal text-sm">{{ form.documentNo || '-' }}</p>
      </div>
      <div class="flex items-center justify-between gap-[10px]">
        <p class="font-normal text-sm text-gray-600">Payment Method</p>
        <p class="font-normal text-sm">{{ form.paymentMethodName || '-' }}</p>
      </div>
      <div class="flex items-center justify-between gap-[10px]">
        <p class="font-normal text-sm text-gray-600">Assignment</p>
        <p class="font-normal text-sm">{{ form.assigment || '-' }}</p>
      </div>
      <div class="flex items-center justify-between gap-[10px]">
        <p class="font-normal text-sm text-gray-600">Transfer News</p>
        <p class="font-normal text-sm">{{ form.transferNews || '-' }}</p>
      </div>
      <div class="flex items-center justify-between gap-[10px]">
        <p class="font-normal text-sm text-gray-600">Currency</p>
        <p class="font-normal text-sm">{{ form.currCode || '-' }}</p>
      </div>
      <div class="flex items-center justify-between gap-[10px]">
        <p class="font-normal text-sm text-gray-600">NPWP Reporting</p>
        <p class="font-normal text-sm">{{ form.npwpReporting || '-' }}</p>
      </div>
      <div v-if="form.invoiceDPCode === 9013" class="flex items-center justify-between gap-[10px]">
        <p class="font-normal text-sm text-gray-600">Remaining DP Amount</p>
        <p class="font-normal text-sm">{{ form.remainingDpAmount || '-' }}</p>
      </div>
      <div v-if="form.invoiceDPCode === 9013" class="flex items-center justify-between gap-[10px]">
        <p class="font-normal text-sm text-gray-600">DP Amount Deduction</p>
        <p class="font-normal text-sm">{{ form.dpAmountDeduction || '-' }}</p>
      </div>
      <div class="flex items-center justify-between gap-[10px]">
        <p class="font-normal text-sm text-gray-600">Description</p>
        <p class="font-normal text-sm">{{ form.notes || '-' }}</p>
      </div>
    </div>
    <!-- Non Po Header -->
    <div v-else class="flex flex-col gap-[20px]">
      <div class="flex items-center justify-between gap-[10px]">
        <p class="font-normal text-sm text-gray-600">Invoice No</p>
        <p class="font-normal text-sm">{{ form.invoiceTypeName || '-' }}</p>
      </div>
      <div v-if="checkPo() && !checkPoPib()" class="flex items-center justify-between gap-[10px]">
        <p class="font-normal text-sm text-gray-600">Vendor No</p>
        <p class="font-normal text-sm">{{ form.invoiceDPName || '-' }}</p>
      </div>
      <div class="flex items-center justify-between gap-[10px]">
        <p class="font-normal text-sm text-gray-600">Invoice Date</p>
        <p class="font-normal text-sm">
          {{ form.invoiceDate ? moment(form.invoiceDate).format('YYYYMMDD') : '-' }}
        </p>
      </div>
      <div class="flex items-center justify-between gap-[10px]">
        <p class="font-normal text-sm text-gray-600">Posting Date</p>
        <p class="font-normal text-sm">
          {{ form.postingDate ? moment(form.postingDate).format('YYYYMMDD') : '-' }}
        </p>
      </div>
      <!-- <div class="flex items-center justify-between gap-[10px]">
        <p class="font-normal text-sm text-gray-600">Submitted Document No.</p>
        <p class="font-normal text-sm">{{ form.invoiceNo || '-' }}</p>
      </div> -->
      <div class="flex items-center justify-between gap-[10px]">
        <p class="font-normal text-sm text-gray-600">Company Code</p>
        <p class="font-normal text-sm">
          {{ `${form.companyCode} - ${form.companyName}` || '-' }}
        </p>
      </div>
      <!-- <div class="flex items-center justify-between gap-[10px]">
        <p class="font-normal text-sm text-gray-600">Invoicing Party</p>
        <p class="font-normal text-sm">{{ form.invoicingParty || '-' }}</p>
      </div> -->
      <div class="flex items-center justify-between gap-[10px]">
        <p class="font-normal text-sm text-gray-600">Estimated Payment Date</p>
        <p class="font-normal text-sm">
          {{
            form.estimatedPaymentDate ? moment(form.estimatedPaymentDate).format('YYYYMMDD') : '-'
          }}
        </p>
      </div>
      <div class="flex items-center justify-between gap-[10px]">
        <p class="font-normal text-sm text-gray-600">No Tax Invoice</p>
        <p class="font-normal text-sm">{{ form.taxNo || '-' }}</p>
      </div>
      <!-- <div class="flex items-center justify-between gap-[10px]">
        <p class="font-normal text-sm text-gray-600">Invoice Vendor No.</p>
        <p class="font-normal text-sm">{{ form.documentNo || '-' }}</p>
      </div> -->
      <div class="flex items-center justify-between gap-[10px]">
        <p class="font-normal text-sm text-gray-600">Payment Method</p>
        <p class="font-normal text-sm">{{ form.paymentMethodName || '-' }}</p>
      </div>
      <div class="flex items-center justify-between gap-[10px]">
        <p class="font-normal text-sm text-gray-600">Assignment</p>
        <p class="font-normal text-sm">{{ form.assigment || '-' }}</p>
      </div>
      <div class="flex items-center justify-between gap-[10px]">
        <p class="font-normal text-sm text-gray-600">Transfer News</p>
        <p class="font-normal text-sm">{{ form.transferNews || '-' }}</p>
      </div>
      <div class="flex items-center justify-between gap-[10px]">
        <p class="font-normal text-sm text-gray-600">Currency</p>
        <p class="font-normal text-sm">{{ form.currCode || '-' }}</p>
      </div>
      <div class="flex items-center justify-between gap-[10px]">
        <p class="font-normal text-sm text-gray-600">NPWP Reporting</p>
        <p class="font-normal text-sm">{{ form.npwpReporting || '-' }}</p>
      </div>
      <div class="flex items-center justify-between gap-[10px]">
        <p class="font-normal text-sm text-gray-600">PIC Finance</p>
        <p class="font-normal text-sm">{{ form.remainingDpAmount || '-' }}</p>
      </div>
      <!-- <div v-if="form.invoiceDPCode === 9013" class="flex items-center justify-between gap-[10px]">
        <p class="font-normal text-sm text-gray-600">DP Amount Deduction</p>
        <p class="font-normal text-sm">{{ form.dpAmountDeduction || '-' }}</p>
      </div> -->
      <div class="flex items-center justify-between gap-[10px]">
        <p class="font-normal text-sm text-gray-600">Description</p>
        <p class="font-normal text-sm">{{ form.notes || '-' }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { inject, computed } from 'vue'
import type { formTypes } from '../../types/invoiceDetail'
import moment from 'moment'
import { useRoute } from 'vue-router'

const route = useRoute()

const currentRouteName = computed(() => {
  return route.name
})

const form = inject<formTypes>('form')

const checkPo = () => {
  return form?.invoiceTypeCode === 901
}

const checkPoPib = () => {
  return form?.invoiceTypeCode === 2
}
</script>

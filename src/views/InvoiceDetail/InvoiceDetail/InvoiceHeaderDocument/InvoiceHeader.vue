<template>
  <div v-if="form" class="flex flex-col gap-[20px]">
    <div class="flex items-center justify-between gap-[10px]">
      <p class="font-normal text-sm text-gray-600">Invoice Type</p>
      <p class="font-normal text-sm">{{ form.invoiceTypeName || '-' }}</p>
    </div>
    <div v-if="checkPo() && !checkPoPib()" class="flex items-center justify-between gap-[10px]">
      <p class="font-normal text-sm text-gray-600">DP Option</p>
      <p class="font-normal text-sm">{{ form.invoiceDPName || '-' }}</p>
    </div>
    <div v-if="checkIsNonPo() && !checkNonPoPettyCash()" class="flex items-center justify-between gap-[10px]">
      <p class="font-normal text-sm text-gray-600">Vendor No.</p>
      <p class="font-normal text-sm">{{ form.vendorId }}</p>
    </div>
    <div v-if="!checkNonPoCas()" class="flex items-center justify-between gap-[10px]">
      <p class="font-normal text-sm text-gray-600">Invoice Date</p>
      <p class="font-normal text-sm">
        {{ form.invoiceDate ? moment(form.invoiceDate).format('YYYY/MM/DD') : '-' }}
      </p>
    </div>
    <div v-if="!checkNonPoPettyCash()" class="flex items-center justify-between gap-[10px]">
      <p class="font-normal text-sm text-gray-600">Posting Date</p>
      <p class="font-normal text-sm">
        {{ form.postingDate ? moment(form.postingDate).format('YYYY/MM/DD') : '-' }}
      </p>
    </div>
    <div v-if="checkNonPoPettyCash()" class="flex items-center justify-between gap-[10px]">
      <p class="font-normal text-sm text-gray-600">Cash Journal</p>
      <p class="font-normal text-sm">{{ '-' }}</p>
    </div>
    <div class="flex items-center justify-between gap-[10px]">
      <p class="font-normal text-sm text-gray-600">{{ checkNonPoCas() ? 'CAS No.' : 'Submitted Document No.' }}</p>
      <p class="font-normal text-sm">{{ form.invoiceNo || '-' }}</p>
    </div>
    <div v-if="checkNonPoLba()" class="flex items-center justify-between gap-[10px]">
      <p class="font-normal text-sm text-gray-600">CAS No.</p>
      <p class="font-normal text-sm">{{ '-' }}</p>
    </div>
    <div class="flex items-center justify-between gap-[10px]">
      <p class="font-normal text-sm text-gray-600">Company Code</p>
      <p class="font-normal text-sm">
        {{ `${form.companyCode} - ${form.companyName}` || '-' }}
      </p>
    </div>
    <div v-if="!checkIsNonPo()" class="flex items-center justify-between gap-[10px]">
      <p class="font-normal text-sm text-gray-600">Invoicing Party</p>
      <p class="font-normal text-sm">{{ form.invoicingParty || '-' }}</p>
    </div>
    <div v-if="checkIsNonPo() && !checkNonPoCas() && !checkNonPoLba() && !checkNonPoPettyCash()" class="flex items-center justify-between gap-[10px]">
      <p class="font-normal text-sm text-gray-600">Proposal Amount</p>
      <p class="font-normal text-sm">{{ form.proposalAmount || '-' }}</p>
    </div>
    <div v-if="checkNonPoPettyCash()" class="flex items-center justify-between gap-[10px]">
      <p class="font-normal text-sm text-gray-600">Petty Cash Period</p>
      <p class="font-normal text-sm">
        -
        <!-- {{
          form.estimatedPaymentDate ? moment(form.estimatedPaymentDate).format('YYYY/MM/DD') : '-'
        }} -->
      </p>
    </div>
    <div v-if="!checkNonPoLba()" class="flex items-center justify-between gap-[10px]">
      <p class="font-normal text-sm text-gray-600">Estimated Payment Date</p>
      <p class="font-normal text-sm">
        {{
          form.estimatedPaymentDate ? moment(form.estimatedPaymentDate).format('YYYY/MM/DD') : '-'
        }}
      </p>
    </div>
    <div v-if="!checkNonPoPettyCash()" class="flex items-center justify-between gap-[10px]">
      <p class="font-normal text-sm text-gray-600">Tax Document No.</p>
      <p class="font-normal text-sm">{{ form.taxNo || '-' }}</p>
    </div>
    <div v-if="checkNonPoLba()" class="flex items-center justify-between gap-[10px]">
      <p class="font-normal text-sm text-gray-600">Date of Receipt of Remaining CAS</p>
      <p class="font-normal text-sm">
        -
        <!-- {{
          form.estimatedPaymentDate ? moment(form.estimatedPaymentDate).format('YYYY/MM/DD') : '-'
        }} -->
      </p>
    </div>
    <div v-if="!checkIsNonPo()" class="flex items-center justify-between gap-[10px]">
      <p class="font-normal text-sm text-gray-600">Invoice Vendor No.</p>
      <p class="font-normal text-sm">{{ form.documentNo || '-' }}</p>
    </div>
    <div v-if="!checkNonPoLba() && !checkNonPoPettyCash()" class="flex items-center justify-between gap-[10px]">
      <p class="font-normal text-sm text-gray-600">Payment Method</p>
      <p class="font-normal text-sm">{{ form.paymentMethodName || '-' }}</p>
    </div>
    <div v-if="checkNonPoCc()" class="flex items-center justify-between gap-[10px]">
      <p class="font-normal text-sm text-gray-600">Credit Card Billing ID</p>
      <p class="font-normal text-sm">{{ '-' }}</p>
    </div>
    <div v-if="!checkNonPoLba() && !checkNonPoPettyCash()" class="flex items-center justify-between gap-[10px]">
      <p class="font-normal text-sm text-gray-600">Assignment</p>
      <p class="font-normal text-sm">{{ form.assigment || '-' }}</p>
    </div>
    <div v-if="!checkNonPoLba() && !checkNonPoPettyCash()" class="flex items-center justify-between gap-[10px]">
      <p class="font-normal text-sm text-gray-600">Transfer News</p>
      <p class="font-normal text-sm">{{ form.transferNews || '-' }}</p>
    </div>
    <div v-if="checkPoCc()" class="flex items-center justify-between gap-[10px]">
      <p class="font-normal text-sm text-gray-600">Credit Card Billing ID</p>
      <p class="font-normal text-sm">{{ form.creditCardBillingId || '-' }}</p>
    </div>
    <div class="flex items-center justify-between gap-[10px]">
      <p class="font-normal text-sm text-gray-600">Currency</p>
      <p class="font-normal text-sm">{{ form.currCode || '-' }}</p>
    </div>
    <div v-if="!checkNonPoPettyCash()" class="flex items-center justify-between gap-[10px]">
      <p class="font-normal text-sm text-gray-600">NPWP Reporting</p>
      <p class="font-normal text-sm">{{ form.npwpReporting || '-' }}</p>
    </div>
    <div v-if="form.invoiceDPCode === 9013" class="flex items-center justify-between gap-[10px]">
      <p class="font-normal text-sm text-gray-600">Remaining DP Amount</p>
      <p class="font-normal text-sm">{{ form.currCode === 'IDR' ? useFormatIdr(form.remainingDpAmount) : useFormatUsd(form.remainingDpAmount) || '-' }}</p>
    </div>
    <div v-if="form.invoiceDPCode === 9013" class="flex items-center justify-between gap-[10px]">
      <p class="font-normal text-sm text-gray-600">DP Amount Deduction</p>
      <p class="font-normal text-sm">{{ form.currCode === 'IDR' ? useFormatIdr(form.dpAmountDeduction) : useFormatUsd(form.dpAmountDeduction) || '-' }}</p>
    </div>
    <div v-if="checkIsNonPo() && !checkNonPoCas() && !checkNonPoLba()" class="flex items-center justify-between gap-[10px]">
      <p class="font-normal text-sm text-gray-600">PIC Finance</p>
      <p class="font-normal text-sm">{{ '-' }}</p>
    </div>
    <div v-if="checkIsNonPo()" class="flex items-center justify-between gap-[10px]">
      <p class="font-normal text-sm text-gray-600">Requestor</p>
      <p class="font-normal text-sm">{{ form.department || '-' }}</p>
    </div>
    <div class="flex items-center justify-between gap-[10px]">
      <p class="font-normal text-sm text-gray-600">Description</p>
      <p class="font-normal text-sm">{{ form.notes || '-' }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { inject, type Ref } from 'vue'
import type { formTypes } from '../../types/invoiceDetail'
import moment from 'moment'
import { useRoute } from 'vue-router'
import { useFormatIdr, useFormatUsd } from '@/composables/currency'

const route = useRoute()

const form = inject<Ref<formTypes>>('form')

const checkIsNonPo = () => {
  return route.query.invoiceType === 'no_po'
}

const checkPo = () => {
  return form.value.invoiceTypeCode === 901
}

const checkPoPib = () => {
  return form.value.invoiceTypeCode === 902
}

const checkPoCc = () => {
  return form.value.invoiceTypeCode === 903
}

const checkNonPoCas = () => {
  return form.value.invoiceTypeCode === 3
}

const checkNonPoLba = () => {
  return form.value.invoiceTypeCode === 4
}

const checkNonPoCc = () => {
  return form.value.invoiceTypeCode === 2
}

const checkNonPoPettyCash = () => {
  return form.value.invoiceTypeCode === 5
}
</script>

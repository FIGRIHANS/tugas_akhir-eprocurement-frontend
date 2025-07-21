<template>
  <div v-if="form" class="flex flex-col gap-[24px]">
    <p class="text-lg font-semibold m-[0px]">Invoice PO & GR Item</p>
    <div class="invoice__table">
      <table class="table table-xs table-border">
        <thead>
          <tr>
            <th
              v-for="(item, index) in columns"
              :key="index"
              :class="{
                'invoice__field-base--line': item.toLowerCase() === 'line'
              }"
              class="invoice__field-base"
            >
              {{ item }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in form.invoicePoGr" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ item.poNo }}</td>
            <td v-if="!checkInvoiceDp()">{{ item.poItem }}</td>
            <td v-if="!checkInvoiceDp() && !checkPoPib()">{{ item.grDocumentNo }}</td>
            <td v-if="!checkInvoiceDp() && !checkPoPib()">{{ item.grDocumentItem }}</td>
            <td v-if="!checkInvoiceDp() && !checkPoPib()">{{ moment(item.grDocumentDate).format('DD MMMM YYYY') }}</td>
            <td v-if="!checkInvoiceDp()">{{ form.currency === item.currencyLC ? useFormatIdr(item.itemAmountLC) : useFormatUsd(item.itemAmountTC) }}</td>
            <td v-if="!checkInvoiceDp()">{{ useFormatIdr(item.quantity) }}</td>
            <td v-if="!checkInvoiceDp()">{{ item.uom }}</td>
            <td v-if="!checkInvoiceDp()">{{ item.itemText }}</td>
            <td v-if="!checkInvoiceDp() && !checkPoPib()">{{ item.conditionType }}</td>
            <td>{{ item.conditionTypeDesc || '-' }}</td>
            <td>{{ item.qcStatus || '-' }}</td>
            <td>{{ item.taxCode || '-' }}</td>
            <td>{{ item.whtType || '-' }}</td>
            <td>{{ item.whtCode || '-' }}</td>
            <td>{{ useFormatIdr(item.whtBaseAmount?.toString() || '') || 0 }}</td>
            <td>{{ useFormatIdr(item.whtAmount?.toString() || '') || 0 }}</td>
            <td>{{ item.department }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, inject, watch, onMounted } from 'vue'
import type { formTypes } from '../../types/invoiceAddWrapper'
import { defaultColumn, invoiceDpColumn, PoPibColumn } from '@/static/invoicePoGr'
import { useFormatIdr, useFormatUsd } from '@/composables/currency'
import moment from 'moment'

const form = inject<formTypes>('form')
const columns = ref<string[]>([])

const checkInvoiceDp = () => {
  return form?.invoiceDp === 'IDP'
}

const checkPoPib = () => {
  return form?.invoiceType === 'pib'
}

const setColumn = () => {
  if (form?.invoiceType === 'pib') columns.value = ['Line', ...PoPibColumn]
  else if (form?.invoiceDp === 'IDP') columns.value = ['Line', ...invoiceDpColumn]
  else columns.value = ['Line', ...defaultColumn]
}

watch(
  () => [form?.invoiceDp, form?.invoiceType],
  () => {
    setColumn()
  },
  {
    immediate: true
  }
)

onMounted(() => {
  setColumn()
})
</script>

<template>
  <div v-if="form" class="flex flex-col gap-[24px]">
    <p class="text-lg font-semibold m-[0px]">Invoice PO & GR Item</p>
    <div class="invoice__table">
      <table class="table table-xs table-border">
        <thead>
          <tr>
            <th v-for="(item, index) in columns" :key="index" :class="{
              'invoice__field-base--line': item.toLowerCase() === 'line'
            }" class="invoice__field-base">
              {{ item }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in form.invoicePoGr" :key="index" class="invoice__field-items">
            <td>{{ index + 1 }}</td>
            <td>{{ item.poNo }}</td>
            <td v-if="!checkInvoiceDp()">{{ item.poItem }}</td>
            <td v-if="!checkInvoiceDp() && !checkPoPib()">{{ item.grDocumentNo || '-' }}</td>
            <td v-if="!checkInvoiceDp() && !checkPoPib()">{{ item.grDocumentItem || '-' }}</td>
            <td v-if="!checkInvoiceDp() && !checkPoPib()">{{ moment(item.grDocumentDate).format('YYYY/MM/DD') }}</td>
            <td v-if="!checkInvoiceDp()">{{ form.currency === 'IDR' ? useFormatIdr(item.itemAmountLC) : useFormatUsd(item.itemAmountTC) }}</td>
            <td v-if="!checkInvoiceDp()">{{ useFormatIdr(item.quantity) }}</td>
            <td v-if="!checkInvoiceDp()">{{ item.uom || '-' }}</td>
            <td v-if="!checkInvoiceDp()">{{ item.itemText || '-' }}</td>
            <td v-if="!checkInvoiceDp() && !checkPoPib()">{{ item.conditionType || '-' }}</td>
            <td v-if="!checkPoPib()">{{ item.conditionTypeDesc || '-' }}</td>
            <td v-if="!checkPoPib()">{{ item.qcStatus || '-' }}</td>
            <td v-if="!checkPoPib()">{{ item.taxCode || '-' }}</td>
            <td v-if="!checkPoPib()">{{ form.currency === 'IDR' ? useFormatIdr(item.vatAmount || 0) : useFormatUsd(item.vatAmount || 0) }}</td>           
            <td v-if="!checkPoPib()">{{ item.whtType || '-' }}</td>
            <td v-if="!checkPoPib()">{{ item.whtCode || '-' }}</td>
            <td v-if="!checkPoPib()">{{ form.currency === 'IDR' ? useFormatIdr(item.whtBaseAmount?.toString() || '') : useFormatUsd(item.whtBaseAmount?.toString() || '') }}</td>
            <td v-if="!checkPoPib()">{{ form.currency === 'IDR' ? useFormatIdr(item.whtAmount?.toString() || '') : useFormatUsd(item.whtAmount?.toString() || '') }}</td>
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
  return form?.invoiceDp === '9012'
}

const checkPoPib = () => {
  return form?.invoiceType === '902'
}

const setColumn = () => {
  if (form?.invoiceType === '902') columns.value = ['Line', ...PoPibColumn]
  else if (checkInvoiceDp()) columns.value = ['Line', ...invoiceDpColumn]
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

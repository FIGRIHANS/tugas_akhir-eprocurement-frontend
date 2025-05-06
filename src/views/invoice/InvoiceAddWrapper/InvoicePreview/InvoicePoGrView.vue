<template>
  <div v-if="form" class="flex flex-col gap-[24px]">
    <p class="text-lg font-semibold m-[0px]">Invoice PO & GR Item</p>
    <div class="invoice__table">
      <table class="table table-xs table-border">
        <thead>
          <tr>
            <th v-for="(item, index) in columns" :key="index" class="table-head">
              {{ item }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in form.invoicePoGr" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ item.poNumber }}</td>
            <td v-if="!checkInvoiceDp()">{{ item.poItem }}</td>
            <td v-if="!checkInvoiceDp() && !checkPoPib()">{{ item.GrDocumentNo }}</td>
            <td v-if="!checkInvoiceDp() && !checkPoPib()">{{ item.GrDocumentItem }}</td>
            <td v-if="!checkInvoiceDp() && !checkPoPib()">{{ item.GrDocumentDate }}</td>
            <td v-if="!checkInvoiceDp()">{{ item.taxCode }}</td>
            <td v-if="!checkInvoiceDp()">{{ item.itemAmount }}</td>
            <td v-if="!checkInvoiceDp()">{{ item.quantity }}</td>
            <td v-if="!checkInvoiceDp()">{{ item.unit }}</td>
            <td v-if="!checkInvoiceDp()">{{ item.itemText }}</td>
            <td v-if="!checkInvoiceDp() && !checkPoPib()">{{ item.conditionType }}</td>
            <td v-if="checkInvoiceDp()">{{ item.amountInvoice }}</td>
            <td v-if="checkInvoiceDp()">{{ item.vatAmount }}</td>
            <td>{{ item.whtType }}</td>
            <td>{{ item.whtCode }}</td>
            <td>{{ item.whtBaseAmount }}</td>
            <td>{{ item.category }}</td>
            <td v-if="!checkInvoiceDp() && !checkPoPib()">{{ item.totalNetAmount }}</td>
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

const form = inject<formTypes>('form')
const columns = ref<string[]>([])

const checkInvoiceDp = () => {
  return form?.invoiceDp
}

const checkPoPib = () => {
  return form?.invoiceType === 'pib'
}

const setColumn = () => {
  if (form?.invoiceType === 'pib') columns.value = ['Line', ...PoPibColumn]
  else if (form?.invoiceDp) columns.value = ['Line', ...invoiceDpColumn]
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

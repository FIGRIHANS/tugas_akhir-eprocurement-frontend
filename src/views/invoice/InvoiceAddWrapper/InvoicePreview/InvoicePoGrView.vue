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
            <td>{{ item.grNumber || '-' }}</td>
            <td>{{ item.poNumber || '-' }}</td>
            <td>{{ item.poSapNumber || '-' }}</td>
            <td>{{ item.item || '-' }}</td>
            <td>{{ item.quantity || '-' }}</td>
            <td>{{ item.uom || '-' }}</td>
            <td>{{ item.costPerUnit || '-' }}</td>
            <td>{{ item.totalCost || '-' }}</td>
            <td v-if="form.invoiceDp">{{ item.installmentCost || '-' }}</td>
            <td>{{ item.deliveryDate || '-' }}</td>
            <td>{{ item.billable || '-' }}</td>
            <td>{{ item.dpPercent || '-' }}</td>
            <td>{{ item.dpValue || '-' }}</td>
            <td>{{ item.whtType || '-' }}</td>
            <td>{{ item.whtCode || '-' }}</td>
            <td>{{ item.dpp || '-' }}</td>
            <td>{{ item.whtValue || '-' }}</td>
            <td>{{ item.vat || '-' }}</td>
            <td>{{ item.otherDpp || '-' }}</td>
            <td>{{ item.amount || '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, inject, onMounted } from 'vue'
import type { formTypes } from '../../types/invoiceAddWrapper'
import { defaultColumn, invoiceDpColumn } from '@/static/invoicePoGr'

const form = inject<formTypes>('form')

const columns = ref<string[]>([])

onMounted(() => {
  if (form?.invoiceDp) {
    columns.value = invoiceDpColumn
  } else {
    columns.value = defaultColumn
  }
})
</script>

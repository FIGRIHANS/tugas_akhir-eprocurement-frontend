<template>
  <div v-if="form" class="flex flex-col gap-[24px]">
    <p class="text-lg font-semibold m-[0px]">Additional Cost</p>
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
          <tr v-for="(item, index) in form.additionalCost" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ item.type || '-' }}</td>
            <td>{{ item.gl || '-' }}</td>
            <td>{{ item.costCenter || '-' }}</td>
            <td>{{ item.quantity || '-' }}</td>
            <td>{{ item.uom || '-' }}</td>
            <td>{{ item.costPerUnit || '-' }}</td>
            <td>{{ item.totalCost || '-' }}</td>
            <td>{{ item.pphType || '-' }}</td>
            <td>{{ item.pphCode || '-' }}</td>
            <td>{{ item.dpp || '-' }}</td>
            <td>{{ item.pphValue || '-' }}</td>
            <td>{{ item.vat || '-' }}</td>
            <td>{{ item.otherDpp || '-' }}</td>
            <td>{{ item.amount || '-' }}</td>
            <td>{{ item.remark || '-'}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, inject } from 'vue'
import type { formTypes } from '../../types/invoiceAddWrapper'

const form = inject<formTypes>('form')

const columns = ref([
  'Line',
  'Jenis',
  'GL',
  'Cost Center',
  'QTY',
  'UoM',
  'Cost Per Unit',
  'Total Cost',
  'Tipe PPH',
  'Kode PPH',
  'DPP',
  'Nilai PPH',
  'VAT',
  'DPP Lain - Lain',
  'Amount',
  'Remark'
])
</script>

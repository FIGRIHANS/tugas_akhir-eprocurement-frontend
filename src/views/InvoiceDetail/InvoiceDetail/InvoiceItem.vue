<template>
  <div v-if="form" class="flex flex-col gap-[24px]">
    <div class="flex items-center justify-between gap-[8px]">
      <p class="text-lg font-semibold m-[0px]">Invoice Item</p>
      <input v-if="form.status === 2" v-model="form.invoiceItemCheck" class="checkbox" type="checkbox"/>
    </div>
    <div class="item__table">
      <table class="table table-xs table-border">
        <thead>
          <tr>
            <th 
              v-for="(item, index) in columns"
              :key="index"
              class="item__column"
              :class="{
                'item__column--medium': setMediumColumn(item),
                'item__column--large': setLargeColumn(item)
              }"
            >
              {{ item }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in form.invoiceItem" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ item.activity || '-' }}</td>
            <td>{{ item.glAccount || '-' }}</td>
            <td>{{ item.item || '-' }}</td>
            <td>{{ item.quantity || '-' }}</td>
            <td>{{ item.uom || '-' }}</td>
            <td>{{ item.costCenter || '-' }}</td>
            <td>{{ item.costPerUnit || '-' }}</td>
            <td>{{ item.totalCost || '-' }}</td>
            <td>{{ item.whtType || '-' }}</td>
            <td>{{ item.whtCode || '-' }}</td>
            <td>{{ item.dpp || '-' }}</td>
            <td>{{ item.whtValue || '-' }}</td>
            <td>{{ item.vat || '-' }}</td>
            <td>{{ item.otherDpp || '-' }}</td>
            <td>{{ item.amount || '-' }}</td>
            <td>{{ item.invoiceDueDate || '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, inject } from 'vue'
import type { formTypes } from '../types/invoiceDetail'

const form = inject<formTypes>('form')

const columns = ref<string[]>([
  'Line',
  'Activity',
  'G/L Account',
  'Item',
  'QTY',
  'UoM',
  'Cost Center',
  'Cost Per Unit',
  'Total Cost',
  'WHT Type',
  'WHT Code',
  'DPP',
  'WHT Value',
  'VAT',
  'DPP Lain-Lain',
  'Amount',
  'Invoice Due Date'
])

const setMediumColumn = (name: string) => {
  const list = [
    'G/L Account',
    'Item',
    'Cost Center',
    'Cost Per Unit',
    'WHT Type',
    'WHT Code',
    'WHT Value'
  ]

  const check = list.findIndex((item) => item.toLowerCase() === name.toLowerCase())
  if (check !== -1) return true
  return false
}

const setLargeColumn = (name: string) => {
  const list = [
    'DPP Lain-Lain',
    'Invoice Due Date'
  ]

  const check = list.findIndex((item) => item.toLowerCase() === name.toLowerCase())
  if (check !== -1) return true
  return false
}
</script>

<style lang="scss" scoped>
@use '../styles/invoice-item.scss';
</style>

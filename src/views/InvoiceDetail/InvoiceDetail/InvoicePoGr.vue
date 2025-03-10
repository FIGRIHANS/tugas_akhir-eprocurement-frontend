<template>
  <div v-if="form" class="flex flex-col gap-[24px]">
    <diV class="flex items-center justify-between gap-[8px]">
      <p class="text-lg font-semibold m-[0px]">Invoice PO & GR Item</p>
      <input v-if="form.status === 2" v-model="form.invoicePoGrCheck" class="checkbox" type="checkbox"/>
    </diV>
    <div class="po__table">
      <table class="table table-xs table-border">
        <thead>
          <tr>
            <th 
              v-for="(item, index) in columns"
              :key="index"
              class="po__column"
              :class="{
                'po__column--po-sap-number': item.toLowerCase() === 'PO Number SAP'.toLowerCase(),
                'po__column--medium': setMediumColumn(item)
              }"
            >
              {{ item }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in form.invoicePoGr" :key="index" class="po__items">
            <td>{{ item.line }}</td>
            <td>{{ item.grNumber }}</td>
            <td>{{ item.poNumber }}</td>
            <td>{{ item.poSapNumber }}</td>
            <td>{{ item.itemName }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ item.uom }}</td>
            <td>{{ item.costPerUnit }}</td>
            <td>{{ item.totalCost }}</td>
            <td>{{ item.deliveryDate }}</td>
            <td>{{ item.billable }}</td>
            <td>{{ item.dp }}</td>
            <td>{{ item.dpValue }}</td>
            <td>{{ item.whtType }}</td>
            <td>{{ item.whtCode }}</td>
            <td>{{ item.dpp }}</td>
            <td>{{ item.whtValue }}</td>
            <td>{{ item.vat }}</td>
            <td>{{ item.otherDpp }}</td>
            <td>{{ item.amount }}</td>
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

const columns = ref([
  'Line',
  'No GR',
  'No PO',
  'PO Number SAP',
  'Item',
  'QTY',
  'UoM',
  'Cost Per Unit',
  'Total Cost',
  'Delivery Date',
  'Billable',
  'DP%',
  'DP Value',
  'WHT Type',
  'WHT Code',
  'DPP',
  'WHT Value',
  'VAT',
  'DPP Lain - Lain',
  'Amount'
])

const setMediumColumn = (name: string) => {
  const list = [
    'Item',
    'Cost Per Unit',
    'Delivery Date',
    'WHT Type',
    'WHT Code',
    'WHT Value',
    'DPP Lain - Lain'
  ]

  const check = list.findIndex((item) => item.toLowerCase() === name.toLowerCase())
  if (check !== -1) return true
  return false
}
</script>

<style lang="scss" scoped>
@use '../styles/invoice-po-gr.scss';
</style>

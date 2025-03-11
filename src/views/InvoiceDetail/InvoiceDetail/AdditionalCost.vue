<template>
  <div v-if="form" class="flex flex-col gap-[24px]">
    <diV class="flex items-center justify-between gap-[8px]">
      <p class="text-lg font-semibold m-[0px]">Additional Cost</p>
      <input v-if="form.status === 2" v-model="form.additionalCostCheck" class="checkbox" type="checkbox"/>
    </diV>
    <div class="cost__table">
      <table class="table table-xs table-border">
        <thead>
          <tr>
            <th
              v-for="(item, index) in columns"
              :key="index"
              class="cost__column"
              :class="{
                'cost__column--desc': item.toLowerCase() === 'Remark'.toLowerCase(),
                'cost__column--type': item.toLowerCase() === 'Jenis'.toLowerCase(),
                'cost__column--medium': setMediumColumn(item)
              }"
            >
              {{ item }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in form.additionalCost" :key="index" class="cost__items">
            <td>{{ item.line }}</td>
            <td>{{ item.type || '-' }}</td>
            <td>{{ item.glCode || '-' }}</td>
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
            <td>{{ item.remark || '-' }}</td>
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

const setMediumColumn = (name: string) => {
  const list = [
    'Jenis',
    'Cost Center',
    'Cost Per Unit',
    'Tipe PPH',
    'Kode PPH',
    'Nilai PPH',
    'DPP Lain - Lain',
    'Remark'
  ]

  const check = list.findIndex((item) => item.toLowerCase() === name.toLowerCase())
  if (check !== -1) return true
  return false
}
</script>

<style lang="scss" scoped>
@use '../styles/additional-cost.scss';
</style>

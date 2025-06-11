<template>
  <div v-if="form" class="flex flex-col gap-[24px]">
    <div class="flex items-center gap-[24px]">
      <p class="text-lg font-semibold m-[0px]">Additional Cost</p>
      <input v-model="form.additionalCostCheck" class="checkbox" type="checkbox"/>
    </div>
    <div class="cost__table">
      <table class="table table-xs table-border">
        <thead>
          <tr>
            <th
              v-for="(item, index) in columns"
              :key="index"
              class="cost__column"
              :class="{
                'cost__column--line': item.toLowerCase() === 'Line'.toLowerCase()
              }"
            >
              {{ item }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in form.additionalCosts" :key="index" class="cost__items">
            <td>{{ item.line }}</td>
            <td>{{ item.activityExpense || '-' }}</td>
            <td>{{ item.itemAmount || '-' }}</td>
            <td>{{ item.debitCredit || '-' }}</td>
            <td>{{ item.taxCode || '-' }}</td>
            <td>{{ item.costCenter || '-' }}</td>
            <td>{{ item.profitCenter || '-' }}</td>
            <td>{{ item.assignment || '-' }}</td>
            <td>{{ item.whtType || '-' }}</td>
            <td>{{ item.whtCode || '-' }}</td>
            <td>{{ item.whtBaseAmount || '-' }}</td>
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
  'Activity / Expense',
  'Item Amount',
  'Debit/Credit',
  'Tax Code',
  'Cost Center',
  'Profit Center',
  'Assignment',
  'WHT Type',
  'WHT Code',
  'WHT Base Amount'
])
</script>

<style lang="scss" scoped>
@use '../styles/additional-cost.scss';
</style>

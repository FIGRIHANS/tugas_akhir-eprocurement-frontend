<template>
  <div v-if="form" class="flex flex-col gap-[24px]">
    <div class="flex items-center gap-[24px]">
      <p class="text-lg font-semibold m-[0px]">Cost / Expenses</p>
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
                'cost__column--line': item.toLowerCase() === 'Line'.toLowerCase(),
              }"
            >
              {{ item }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in form.costExpense" :key="index" class="cost__items">
            <td>{{ index + 1 }}</td>
            <td>{{ item.activityExpenses + '-' + item.activityName || '-' }}</td>
            <!-- <td>{{ item.activityName || '-' }}</td> -->
            <td>{{ item.itemAmount || '-' }}</td>
            <td>{{ item.itemText || '-' }}</td>
            <!-- <td>
              {{
                item.vatAmount
                  ? form.currCode === 'IDR'
                    ? useFormatIdr(item.vatAmount)
                    : useFormatUsd(item.vatAmount)
                  : '-'
              }}
            </td> -->
            <td>{{ item.debitCredit || '-' }}</td>
            <td>{{ item.taxCode || '-' }}</td>
            <td>{{ item.vatAmount || '-' }}</td>
            <td>{{ item.costCenter || '-' }}</td>
            <td>{{ item.profitCenter || '-' }}</td>
            <td>{{ item.assignment || '-' }}</td>
            <td>{{ item.whtType || '-' }}</td>
            <td>{{ item.whtCode || '-' }}</td>
            <td>{{ item.whtBaseAmount || '-' }}</td>
            <td>{{ item.whtAmount || '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, inject } from 'vue'
import type { formTypes } from '../types/invoiceDetail'
// import { useFormatIdr, useFormatUsd } from '@/composables/currency'

const form = inject<formTypes>('form')

const columns = ref([
  'Line',
  'Activity / Expense',
  // 'Activity Name',
  'Item Amount',
  'Item Text',
  'Tax Code',
  'VAT Amount',
  'Debit/Credit',
  'Cost Center',
  'Profit Center',
  'Assignment',
  'WHT Type',
  'WHT Code',
  'WHT Base Amount',
  'WHT Amount',
])
</script>

<style lang="scss" scoped>
@use '../styles/additional-cost.scss';
</style>

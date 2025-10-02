<template>
  <div v-if="form" class="flex flex-col gap-[24px]">
    <p class="text-lg font-semibold m-[0px]">Costs / Expenses</p>
    <div class="invoice__table">
      <table class="table table-xs table-border">
        <thead>
          <tr>
            <th v-for="(item, index) in columns" :key="index" class="invoice__column">
              {{ item }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in form.invoiceItem" :key="index" class="invoice__items">
            <td>{{ index + 1 }}</td>
            <td>{{ getActivityName(item.activityId) || '-' }}</td>
            <td>{{ form.currCode === 'IDR' ? useFormatIdr(item.itemAmount) : useFormatUsd(item.itemAmount) || '-' }}</td>
            <td>{{ item.itemText || '-' }}</td>
            <td>{{ getDebitCreditName(item.debitCredit) || '-' }}</td>
            <td>{{ item.taxCode || '-' }}</td>
            <td>{{ form.currCode === 'IDR' ? useFormatIdr(item.vatAmount) : useFormatUsd(item.vatAmount) || '-' }}</td>
            <td>{{ item.costCenter || '-' }}</td>
            <td>{{ item.profitCenter || '-' }}</td>
            <td>{{ item.assignment || '-' }}</td>
            <td>{{ item.whtType || '-' }}</td>
            <td>{{ item.whtCode || '-' }}</td>
            <td>{{ form.currCode === 'IDR' ? useFormatIdr(item.whtBaseAmount) : useFormatUsd(item.whtBaseAmount) || '-' }}</td>
            <td>{{ form.currCode === 'IDR' ? useFormatIdr(item.whtAmount) : useFormatUsd(item.whtAmount) || '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, inject } from 'vue'
import { useFormatIdr, useFormatUsd } from '@/composables/currency'
import type { formTypes } from '../types/invoiceDetail'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'

const invoiceMasterApi = useInvoiceMasterDataStore()
const form = inject<formTypes>('form')

const listActivity = computed(() => invoiceMasterApi.activityList)

const columns = ref<string[]>([
  'Line',
  'Activity / Expense',
  'Item Amount',
  'Item Text',
  'Debit/Credit',
  'Tax Code',
  'VAT Amount',
  'Cost Center',
  'Profit Center',
  'Assignment',
  'WHT Type',
  'WHT Code',
  'WHT Base Amount',
  'WHT Amount'
])

const getActivityName = (id: number) => {
  const getIndex = listActivity.value.findIndex((item) => item.id === id)
  if (getIndex !== -1) return `${listActivity.value[getIndex].code} - ${listActivity.value[getIndex].name}`
}

const getDebitCreditName = (code: string) => {
  if (code === 'K') return 'Credit'
  else if (code === 'D') return 'Debit'
  else return '-'
}
</script>

<style lang="scss" scoped>
@use '../styles/invoice-item.scss';
</style>

<template>
  <div v-if="form" class="flex flex-col gap-[24px]">
    <p class="text-lg font-semibold m-[0px]">Costs / Expenses</p>
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
          <tr v-for="(item, index) in form.invoiceItem" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ getActivityName(item.activity) || '-' }}</td>
            <td>{{ item.itemAmount || '-' }}</td>
            <td>{{ item.itemText || '-' }}</td>
            <td>{{ getDebitCreditName(item.debitCredit) || '-' }}</td>
            <td>{{ item.taxCode || '-' }}</td>
            <td>{{ form.currency === 'IDR' ? useFormatIdr(item.vatAmount) : useFormatUsd(item.vatAmount) || '-' }}</td>
            <td>{{ item.costCenter || '-' }}</td>
            <td>{{ item.profitCenter || '-' }}</td>
            <td>{{ item.assignment || '-' }}</td>
            <td>{{ item.whtType || '-' }}</td>
            <td>{{ item.whtCode || '-' }}</td>
            <td>{{ form.currency === 'IDR' ? useFormatIdr(item.whtBaseAmount) : useFormatUsd(item.whtBaseAmount) || '-' }}</td>
            <td>{{ form.currency === 'IDR' ? useFormatIdr(item.whtAmount) : useFormatUsd(item.whtAmount) || '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, inject } from 'vue'
import { useFormatIdr, useFormatUsd } from '@/composables/currency'
import type { formTypes } from '../../types/invoiceAddWrapper'
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

const getActivityName = (code: string) => {
  const getIndex = listActivity.value.findIndex((item) => item.code === code)
  if (getIndex !== -1) return listActivity.value[getIndex].name
}

const getDebitCreditName = (code: string) => {
  if (code === 'K') return 'Credit'
  else if (code === 'D') return 'Debit'
  else return '-'
}
</script>

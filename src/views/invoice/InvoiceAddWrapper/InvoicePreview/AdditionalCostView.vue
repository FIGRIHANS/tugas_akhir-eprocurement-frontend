<template>
  <div v-if="form" class="flex flex-col gap-[24px]">
    <p class="text-lg font-semibold m-[0px]">Additional Cost</p>
    <div class="invoice__table">
      <table class="table table-xs table-border">
        <thead>
          <tr>
            <th
              v-for="(item, index) in columns"
              :key="index"
              :class="{
                'invoice__field-base--line': item.toLowerCase() === 'line',
                'invoice__field-base--activity': item.toLowerCase() === 'activity / expense',
                'invoice__field-base--item-amount': item.toLowerCase() === 'item amount'
              }"
              class="invoice__field-base"
            >
              {{ item }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in form.additionalCost" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ getActivityName(item.activity) || '-' }}</td>
            <td>{{ item.itemAmount || '-' }}</td>
            <td>{{ getDebitCreditName(item.debitCredit) || '-' }}</td>
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
import { ref, computed, inject } from 'vue'
import type { formTypes } from '../../types/invoiceAddWrapper'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'

const invoiceMasterApi = useInvoiceMasterDataStore()
const form = inject<formTypes>('form')

const listActivity = computed(() => invoiceMasterApi.activityList)

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
  'WHT Base Amount',
  'Amount'
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

<template>
  <div v-if="form" class="flex flex-col gap-[24px]">
    <div class="flex items-center gap-[24px]">
      <p class="text-lg font-semibold m-[0px]">Additional Cost</p>
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
            <td>{{ index + 1 }}</td>
            <td>{{ getActivityName(item.activityId) || '-' }}</td>
            <td>{{ item.itemAmount || '-' }}</td>
            <td>{{ item.debitCredit || '-' }}</td>
            <td>{{ item.taxCode || '-' }}</td>
            <td>{{ item.vatAmount ? form.currCode === 'IDR' ? useFormatIdr(item.vatAmount) : useFormatUsd(item.vatAmount) : '-' }}</td>
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
import { ref,computed, inject } from 'vue'
import type { formTypes } from '../types/invoiceDetail'
import { useFormatIdr, useFormatUsd } from '@/composables/currency'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'

const invoiceMasterApi = useInvoiceMasterDataStore()
const form = inject<formTypes>('form')

const columns = ref([
  'Line',
  'Activity / Expense',
  'Item Amount',
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

const listActivity = computed(() => invoiceMasterApi.activityList)

const getActivityName = (id: number) => {
  const getIndex = listActivity.value.findIndex((item) => item.id === id)
  if (getIndex !== -1) return `${listActivity.value[getIndex].code} - ${listActivity.value[getIndex].name}`
}
</script>

<style lang="scss" scoped>
@use '../styles/additional-cost.scss';
</style>

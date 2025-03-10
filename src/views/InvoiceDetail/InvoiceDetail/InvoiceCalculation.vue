<template>
  <div v-if="form" class="card">
    <div class="card-header py-[17px] flex items-center justify-between gap-[8px]">
      <h3 class="card-title text-base font-semibold">Invoice Calculation</h3>
      <input v-if="form.status === 2" v-model="form.invoiceCalculationCheck" class="checkbox" type="checkbox"/>
    </div>
    <div class="card-body flex flex-col p-0">
      <div
        v-for="(item, index) in listCalculation"
        :key="index"
        class="flex"
        :class="index === listCalculation.length - 1 ? 'calculation__last-field' : ''"
      >
        <p class="flex-1 py-[15px] px-[20px] text-xs">{{ item.name }}</p>
        <p class="flex-1 py-[15px] px-[20px] text-xs">{{ item.amount }}</p>
        <p class="flex-1 py-[15px] px-[20px] text-xs">{{ item.currency }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, inject } from 'vue'
import type { listTypes } from '../types/invoiceCalculation'
import type { formTypes } from '../types/invoiceDetail'

const form = inject<formTypes>('form')

const listCalculation = ref<listTypes[]>([
  {
    name: 'Subtotal',
    amount: '0',
    currency: 'USD'
  },
  {
    name: 'VAT Amount',
    amount: '0',
    currency: 'USD'
  },
  {
    name: 'WHT AMount',
    amount: '0',
    currency: 'USD'
  },
  {
    name: 'Additional Cost',
    amount: '0',
    currency: 'USD'
  },
  {
    name: 'Total Gross Amount',
    amount: '0',
    currency: 'USD'
  },
  {
    name: 'Total Net Amount',
    amount: '0',
    currency: 'USD'
  },
  {
    name: 'Amount Due',
    amount: '0',
    currency: 'USD'
  }
])
</script>

<style lang="scss" scoped>
@use '../styles/invoice-calculation.scss';
</style>

<template>
  <div>
    <p class="text-lg font-semibold m-[0px]">Invoice Calculation</p>
    <div class="flex flex-col mt-[16px]">
      <div
        v-for="(item, index) in listCalculation"
        :key="index"
        class="border-b border-gray-200 py-[24px] px-[20px] text-xs flex"
        :class="index === listCalculation.length - 1 ? 'calculation__last-field' : ''"
      >
        <div class="flex-1">{{ item.name }}</div>
        <div class="flex-1 flex items-center justify-center">
          <span class="flex-1">{{ item.amount }}</span>
          <span>{{ item.currency }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { listType } from '../../types/invoiceCalculation'

const listCalculation = ref<listType[]>([
  {
    name: 'Subtotal',
    amount: '0',
    currency: ''
  },
  {
    name: 'VAT Amount',
    amount: '0',
    currency: ''
  },
  {
    name: 'WHT AMount',
    amount: '0',
    currency: ''
  },
  {
    name: 'Additional Cost',
    amount: '0',
    currency: ''
  },
  {
    name: 'Total Gross Amount',
    amount: '0',
    currency: ''
  },
  {
    name: 'Total Net Amount',
    amount: '0',
    currency: ''
  },
  {
    name: 'Amount Due',
    amount: '0',
    currency: 'USD'
  }
])
</script>

<template>
  <div v-if="form" class="card h-full">
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
import { ref, onMounted, inject } from 'vue'
import type { listTypes } from '../types/invoiceCalculation'
import type { formTypes } from '../types/invoiceDetail'

const form = inject<formTypes>('form')

const listName = ref<string[]>([
  'Subtotal',
  'VAT Amount',
  'WHT AMount',
  'Additional Cost',
  'Total Gross Amount',
  'Total Net Amount',
  'Amount Due'
])

const listCalculation = ref<listTypes[]>([])

onMounted(() => {
  for (const item of listName.value) {
    if ((form?.invoiceType === 'nonpo' && item !== 'Additional Cost') || form?.invoiceType === 'po') {
      const data = {
        name: item,
        amount: '0',
        currency: 'USD'
      }
      listCalculation.value.push(data)
    }
  }
})
</script>

<style lang="scss" scoped>
@use '../styles/invoice-calculation.scss';
</style>

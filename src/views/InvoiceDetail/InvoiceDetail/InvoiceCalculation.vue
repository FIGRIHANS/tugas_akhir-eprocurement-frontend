<template>
  <div v-if="form" class="card">
    <div class="card-header py-[17px] flex items-center justify-between gap-[8px]">
      <h3 class="card-title text-base font-semibold">Invoice Calculation</h3>
    </div>
    <div class="card-body flex flex-col p-0">
      <div v-for="(item, index) in listCalculation" :key="index" class="flex"
        :class="index === listCalculation.length - 1 ? 'calculation__last-field' : ''">
        <p class="flex-1 py-[25px] px-[20px] text-xs">{{ item.name }}</p>
        <p class="flex-1 py-[25px] px-[20px] text-xs">{{ item.amount }}</p>
        <p class="flex-1 py-[25px] px-[20px] text-xs">{{ item.currency }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, inject } from 'vue'
import { useRoute } from 'vue-router'
import type { listTypes } from '../types/invoiceCalculation'
import type { formTypes } from '../types/invoiceDetail'
import { useFormatIdr, useFormatUsd } from '@/composables/currency'
import { defaultField, dpField, nonPoField } from '@/static/invoiceCalculation'

const props = defineProps<{
  formInvoice: formTypes
}>()

const route = useRoute()
const form = inject<formTypes>('form')
const listName = ref<string[]>([])
const listCalculation = ref<listTypes[]>([])

const checkIsNonPo = () => {
  return route.query.type === 'nonpo'
}

const setValue = (key: string) => {
  let result = 0
  switch (key.toLowerCase()) {
    case 'subtotal':
      result = props.formInvoice.subtotal
      break
    case 'vat amount':
      result = props.formInvoice.vatAmount
      break
    case 'additional cost':
      result = props.formInvoice.additionalCost
      break
    case 'total gross amount':
      result = props.formInvoice.totalGrossAmount
      break
    case 'wht amount':
      result = props.formInvoice.whtAmount
      break
    case 'total net amount':
      result = props.formInvoice.totalNetAmount
      break
  }
  return result
}

const setCalculation = () => {
  listCalculation.value = []
  for (const item of listName.value) {
    const data = {
      name: item,
      amount: props.formInvoice.currCode === 'IDR' ? useFormatIdr(setValue(item) || 0) : useFormatUsd(setValue(item) || 0),
      currency: props.formInvoice.currCode || ''
    }
    listCalculation.value.push(data)
  }
}

watch(
  () => props.formInvoice,
  () => {
    setCalculation()
  },
  {
    deep: true,
    immediate: true
  }
)

watch(
  () => form,
  () => {
    if (form?.invoiceDPCode !== 9011) {
      listName.value = [...dpField]
    } else if (checkIsNonPo()) {
      listName.value = [...nonPoField]
    } else {
      listName.value = [...defaultField]
    }
    setCalculation()
  },
  {
    deep: true,
    immediate: true
  }
)
</script>

<style lang="scss" scoped>
@use '../styles/invoice-calculation.scss';
</style>

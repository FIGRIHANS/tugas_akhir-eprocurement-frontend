<template>
  <div v-if="form" class="card">
    <div class="card-header py-[17px] flex items-center justify-between gap-[8px]">
      <h3 class="card-title text-base font-semibold">Invoice Calculation</h3>
    </div>
    <div class="card-body flex flex-col p-0">
      <div
        v-for="(item, index) in listCalculation"
        :key="index"
        class="flex"
        :class="index === listCalculation.length - 1 ? 'calculation__last-field' : ''"
      >
        <p class="flex-1 py-[25px] px-[20px] text-xs">{{ item.name }}</p>
        <p class="flex-1 py-[25px] px-[20px] text-xs">{{ item.amount }}</p>
        <p class="flex-1 py-[25px] px-[20px] text-xs">{{ item.currency }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, inject, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import type { listTypes } from '../types/invoiceCalculation'
import type { formTypes } from '../types/invoiceDetail'
import { useFormatIdr, useFormatUsd } from '@/composables/currency'
import { defaultField, dpField, nonPoField } from '@/static/invoiceCalculation'

const props = defineProps<{
  formInvoice: formTypes
}>()

const route = useRoute()
const form = inject<Ref<formTypes>>('form')
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
    case 'dpp':
      result = countDpp()
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

const countDpp = () => {
  let total = 0
  if (!checkIsNonPo()) {
    for (const item of props.formInvoice.invoicePoGr) {
      if (item.taxCode !== null) {
        total = total + Number(item.itemAmount)
      }
    }

    for (const item of props.formInvoice.costExpense) {
      if (item.taxCode !== null) {
        total = total + Number(item.itemAmount)
      }
    }
    
    for (const item of props.formInvoice.additionalCosts) {
      if (item.taxCode !== null) {
        if (item.debitCredit === 'D') {
          total = total + Number(item.itemAmount)
        } else {
          total = total + Number(item.itemAmount)
        }
      }
    }
  } else {

    for (const item of props.formInvoice.invoiceItem) {
      if (item.taxCode !== null) {
        if (item.debitCredit === 'D') {
          total = total + item.itemAmount
        } else {
          total = total - item.itemAmount
        }
      }
    }
  }

  return total * 11 / 12
}

const setCalculation = () => {
  listCalculation.value = []
  for (const item of listName.value) {
    const data = {
      name: item,
      amount:
        props.formInvoice.currCode === 'IDR'
          ? useFormatIdr(setValue(item) || 0)
          : useFormatUsd(setValue(item) || 0),
      currency: props.formInvoice.currCode || '',
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
    immediate: true,
  },
)

watch(
  () => form,
  () => {
    if (
      form.value.invoiceDPCode !== 9011 &&
      form.value.invoiceDPCode !== 9013 &&
      form.value.invoiceTypeCode !== 902 &&
      form.value.invoiceTypeCode !== 903
    ) {
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
    immediate: true,
  },
)
</script>

<style lang="scss" scoped>
@use '../styles/invoice-calculation.scss';
</style>

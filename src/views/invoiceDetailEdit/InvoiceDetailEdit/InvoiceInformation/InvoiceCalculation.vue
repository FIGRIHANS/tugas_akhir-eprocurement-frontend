<template>
  <div class="card flex-1 h-fit">
    <div class="card-header flex justify-between items-center gap-[10px] py-[16px] px-[20px]">
      <span class="font-semibold text-base whitespace-nowrap">Invoice Calculation</span>
      <button class="btn btn-primary">
        Recalculate
        <i class="ki-duotone ki-arrows-circle"></i>
      </button>
    </div>
    <div class="card-body p-[0px]">
      <div class="flex">
        <div class="flex flex-col flex-1">
          <div v-for="(item, index) in listCalculation" :key="index"
            class="border-b border-gray-200 py-[31px] px-[20px] text-xs flex"
            :class="index === listCalculation.length - 1 ? 'calculation__last-field' : ''">
            <div class="flex-1">{{ item.name }}</div>
            <div class="flex-1">{{ form?.currCode === 'IDR' ? useFormatIdr(item.amount) : useFormatUsd(item.amount) }}</div>
            <div>{{ form?.currCode }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch, inject, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import type { listType } from '../../types/invoiceCalculation'
import type { formTypes } from '../../types/invoiceDetailEdit'
import { defaultField, dpField } from '@/static/invoiceCalculation'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'
import { useFormatIdr, useFormatUsd } from '@/composables/currency'

const invoiceMasterApi = useInvoiceMasterDataStore()
const route = useRoute()
const form = inject<Ref<formTypes>>('form')
const typeForm = ref<string>('')
const listName = ref<string[]>([])
const listCalculation = ref<listType[]>([])


const listTaxCalculation = computed(() => invoiceMasterApi.taxList)
const whtCodeList = computed(() => invoiceMasterApi.whtCodeList)

const setCount = (name: string) => {
  const list = {
    'subtotal': countSubtotal(),
    'vat amount': countVatAmount(),
    'wht amount': countWhtAmount(),
    'additional cost': countAdditionalCost(),
    'total gross amount': countTotalGrossAmount(),
    'total net amount': countTotalNetAmount()
  } as { [key: string]: number }

  return list[name.toLowerCase()]
}

const setToForm = (name: string, value: number) => {
  if (form) {
    switch (name.toLowerCase()) {
      case 'subtotal':
        form.value.subtotal = value
        break
      case 'vat amount':
        form.value.vatAmount = value
        break
      case 'wht amount':
        form.value.whtAmount = value
        break
      case 'additional cost':
        form.value.additionalCost = value
        break
      case 'total gross amount':
        form.value.totalGrossAmount = value
        break
      case 'total net amount':
        form.value.totalNetAmount = value
        break
    }
  }
}

const setCalculation = () => {
  listCalculation.value = []
  for (const item of listName.value) {
    const amount = setCount(item)
    const data = {
      name: item,
      amount: amount ? amount.toString() : '',
      currency: form?.value.currCode || ''
    }
    listCalculation.value.push(data)
    setToForm(item, amount)
  }
}

const getPercentTax = (code: string) => {
  if (code === 'V0') return 0
  const getIndex = listTaxCalculation.value.findIndex((item) => item.code === code)
  if (getIndex !== -1) {
    const splitName = listTaxCalculation.value[getIndex].name.split(' - ')
    return parseFloat(splitName[1].replace(',', '.').replace('%', '')) / 100
  }
}

const getPercentWht = (code: string) => {
  const getIndex = whtCodeList.value.findIndex((item) => item.whtCode === code)
  if (getIndex !== -1) {
    return whtCodeList.value[getIndex].tarif / 100
  }
}

const countSubtotal = () => {
  if (!form) return
  let total = 0
  for (const item of form.value.invoicePoGr) {
    total = total + item.itemAmount
  }
  return total
}

const countVatAmount = () => {
  if (!form) return
  let totalPo = 0
  let totalAddDebit = 0
  let totalAddCredit = 0
  for (const item of form.value.invoicePoGr) {
    const percentTax = getPercentTax(item.taxCode) || 0
    totalPo = totalPo + (percentTax * item.itemAmount)
  }
  for (const item of form.value.additionalCosts) {
    const percentTax = getPercentTax(item.taxCode) || 0
    if (item.debitCredit === 'D') {
      totalAddDebit = totalAddDebit + (percentTax * Number(item.itemAmount))
    } else {
      totalAddCredit = totalAddCredit + (percentTax * Number(item.itemAmount))
    }
  }
  return totalPo + totalAddDebit - totalAddCredit
}

const countAdditionalCost = () => {
  if (!form) return
  let total = 0
  for (const item of form.value.additionalCosts) {
    if (item.debitCredit === 'D') {
      total = total + Number(item.itemAmount)
    } else {
      total = total - Number(item.itemAmount)
    }
  }
  return total
}

const countTotalGrossAmount = () => {
  const subTotal = countSubtotal() || 0
  const vatAmount = countVatAmount() || 0
  const additionalCost = countAdditionalCost() || 0
  return subTotal + vatAmount + additionalCost
}

const countWhtAmount = () => {
  if (!form) return
  let totalPo = 0
  let totalAddDebit = 0
  let totalAddCredit = 0
  for (const item of form.value.invoicePoGr) {
    const percentTax = getPercentWht(item.whtCode) || 0
    totalPo = totalPo + (percentTax * item.whtBaseAmount)
  }
  for (const item of form.value.additionalCosts) {
    const percentTax = getPercentWht(item.whtCode) || 0
    if (item.debitCredit === 'D') {
      totalAddDebit = totalAddDebit + (percentTax * Number(item.whtBaseAmount))
    } else {
      totalAddCredit = totalAddCredit + (percentTax * Number(item.whtBaseAmount))
    }
  }
  return totalPo + totalAddDebit - totalAddCredit
}

const countTotalNetAmount = () => {
  const subTotal = countSubtotal() || 0
  const additionalCost = countAdditionalCost() || 0
  const vatAmount = countVatAmount() || 0
  const whtAmount = countWhtAmount() || 0
  return subTotal + additionalCost + vatAmount - whtAmount
}

watch(
  () => [form?.value.invoiceDPCode],
  () => {
    if (form?.value.invoiceDPCode !== 9011) {
      listName.value = [...dpField]
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

watch(
  () => [form?.value.invoicePoGr, form?.value.additionalCosts],
  () => {
    setCalculation()
  },
  {
    deep: true,
    immediate: true
  }
)

onMounted(() => {
  typeForm.value = route.query.type?.toString().toLowerCase() || 'po'
  setCalculation()
})
</script>

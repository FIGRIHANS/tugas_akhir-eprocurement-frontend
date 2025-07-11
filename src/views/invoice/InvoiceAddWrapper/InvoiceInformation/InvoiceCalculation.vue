<template>
  <div class="card flex-1 h-fit">
    <div class="card-header flex justify-between items-center gap-[10px] py-[16px] px-[20px]">
      <span class="font-semibold text-base whitespace-nowrap">Invoice Calculation</span>
      <button class="btn btn-primary" @click="setCalculation">
        Recalculate
        <i class="ki-duotone ki-arrows-circle"></i>
      </button>
    </div>
    <div class="card-body p-[0px]">
      <div class="flex">
        <div class="flex flex-col flex-1">
          <div
            v-for="(item, index) in listCalculation"
            :key="index"
            class="border-b border-gray-200 py-[22px] px-[20px] text-xs flex"
            :class="index === listCalculation.length - 1 ? 'calculation__last-field' : ''"
          >
            <div class="flex-1">{{ item.name }}</div>
            <div class="flex-1">{{ useFormatIdr(item.amount) }}</div>
            <div>{{ item.currency }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch, inject } from 'vue'
import { useRoute } from 'vue-router'
import type { listType } from '../../types/invoiceCalculation'
import type { formTypes } from '../../types/invoiceAddWrapper'
import { defaultField, dpField } from '@/static/invoiceCalculation'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'
import { useFormatIdr } from '@/composables/currency'

const invoiceMasterApi = useInvoiceMasterDataStore()
const route = useRoute()
const form = inject<formTypes>('form')
const typeForm = ref<string>('')
const listName = ref<string[]>([])
const listCalculation = ref<listType[]>([])

const listTaxCalculation = computed(() => invoiceMasterApi.taxList)

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
        form.subtotal = value
        break
      case 'vat amount':
        form.vatAmount = value
        break
      case 'wht amount':
        form.whtAmount = value
        break
      case 'additional cost':
        form.additionalCostCalc = value
        break
      case 'total gross amount':
        form.totalGrossAmount = value
        break
      case 'total net amount':
        form.totalNetAmount = value
        break
    }
  }
}

const setCalculation = () => {
  listCalculation.value = []
  for (const item of listName.value) {
    if ((typeForm.value === 'nonpo' && item !== 'Additional Cost') || typeForm.value === 'po') {
      const amount = setCount(item)
      const data = {
        name: item,
        amount: amount.toString(),
        currency: form?.currency || ''
      }
      listCalculation.value.push(data)
      setToForm(item, amount)
    }
  }
}

const getPercentTax = (code: string) => {
  if (code === 'V0') return 0
  const getIndex = listTaxCalculation.value.findIndex((item) => item.code === code)
  if (getIndex !== -1) {
    const splitName = listTaxCalculation.value[getIndex].name.split(' - ')
    return parseFloat(splitName[1].replace(',', '.').replace('%','')) / 100
  }
}

const countSubtotal = () => {
  if (!form) return
  let total = 0
  for (const item of form.invoicePoGr) {
    total = total + item.itemAmount
  }
  return total
}

const countVatAmount = () => {
  if (!form) return
  let totalPo = 0
  let totalAddDebit = 0
  let totalAddCredit = 0
  for (const item of form.invoicePoGr) {
    const percentTax = getPercentTax(item.taxCode) || 0
    totalPo = totalPo + (percentTax * item.itemAmount * item.quantity)
  }
  for (const item of form.additionalCost) {
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
  for (const item of form.additionalCost) {
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
  for (const item of form.invoicePoGr) {
    const percentTax = 0
    totalPo = totalPo + (percentTax * item.itemAmount * item.quantity)
  }
  for (const item of form.additionalCost) {
    const percentTax = 0
    if (item.debitCredit === 'D') {
      totalAddDebit = totalAddDebit + (percentTax * Number(item.itemAmount))
    } else {
      totalAddCredit = totalAddCredit + (percentTax * Number(item.itemAmount))
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
  () => [form?.invoiceDp],
  () => {
    if (form?.invoiceDp !== '9011') {
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
  () => [form?.invoicePoGr, form?.additionalCost],
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

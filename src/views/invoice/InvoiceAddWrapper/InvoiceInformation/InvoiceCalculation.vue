<template>
  <div class="flex-1 h-fit">
    <div class="card flex-1 h-fit">
      <div class="card-header flex justify-between items-center gap-[10px] py-[16px] px-[20px]">
        <span class="font-semibold text-base whitespace-nowrap" v-if="isLba">Realization Invoice Calculation</span>
        <span class="font-semibold text-base whitespace-nowrap" v-else>Invoice Calculation</span>
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
              <div class="flex-1">{{ form?.currency === 'IDR' ? useFormatIdr(item.amount) : useFormatUsd(item.amount) }}</div>
              <div>{{ item.currency }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card mt-5 p-5" v-if="form.invoiceType === '4' && checkIsNonPo()">
      <div
        class="p-4 rounded-lg border"
        :class="varianceResult.border"
      >
        <p class="font-medium">
          {{ varianceResult.text }}
        </p>

        <p v-if="varianceResult.amount !== 0" class="text-sm mt-1">
          Due Date: H+ 30
        </p>

        <p v-if="varianceResult.posting" class="text-xs text-gray-500 mt-1">
          Posting SAP: {{ varianceResult.posting }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch, inject } from 'vue'
import { useRoute } from 'vue-router'
import type { listType } from '../../types/invoiceCalculation'
import type { formTypes } from '../../types/invoiceAddWrapper'
import { defaultField, dpField, lbaField, nonPoField, pettyCashField } from '@/static/invoiceCalculation'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'
import { useFormatIdr, useFormatUsd } from '@/composables/currency'

const invoiceMasterApi = useInvoiceMasterDataStore()
const route = useRoute()
const form = inject<formTypes>('form')
const typeForm = ref<string>('')
const listName = ref<string[]>([])
const listCalculation = ref<listType[]>([])
const isLba = ref(false)

const listTaxCalculation = computed(() => invoiceMasterApi.taxList)

const checkIsNonPo = () => {
  return route.query.type === 'nonpo'
}

const isPettyCash = computed(() => form?.invoiceType === '5')

const setCount = (name: string) => {
  const list: Record<string, number> = {
    'subtotal': countSubtotal(),
    'dpp': countDppLainnya(),
    'vat amount': countVatAmount(),
    'wht amount': countWhtAmount(),
    'additional cost': countAdditionalCost(),
    'total gross amount': countTotalGrossAmount(),
    'total net amount': countTotalNetAmount()
  }

  return list[name.toLowerCase()] ?? 0
}


const varianceResult = computed(() => {
  const variance = countVariance()

  if (variance > 0) {
    return {
      border: 'border-yellow-400',
      text: `Employee reimbursement amount of ${form.currency} ${variance.toLocaleString('id-ID')}`,
      amount: variance,
      posting: 'FB60',
    }
  }

  if (variance < 0) {
    return {
      border: 'border-green-400',
      text: `Company transfer amount of ${form.currency} ${Math.abs(variance).toLocaleString('id-ID')}`,
      amount: Math.abs(variance),
      posting: 'F-02',
    }
  }

  return {
    border: 'border-gray-300',
    text: 'The realization matches the cash advance (No SAP posting required)',
    amount: 0,
    posting: null,
  }
})

// const dueDate = computed(() => {
//   if (!form.realizationPostingDate) return '-'

//   const date = new Date(form.realizationPostingDate)
//   date.setDate(date.getDate() + 30)

//   return date.toLocaleDateString('id-ID', {
//     day: '2-digit',
//     month: 'long',
//     year: 'numeric',
//   })
// })

const setCountLba = (name: string) => {
  const list: Record<string, number> = {
    'variance subtotal': countSubtotal(),
    'vat amount': countVatAmount(),
    'wht amount': countWhtAmount(),
    'additional cost': countAdditionalCost(),
    'variance gross amount': countTotalGrossAmount(),
    'variance total net amount': countTotalNetAmount(),
    // 'variance' : countVariance()
  }

  return list[name.toLowerCase()] ?? 0
}

const setToForm = (name: string, value: number) => {
  if (form) {
    switch (name.toLowerCase()) {
      case 'subtotal':
        form.subtotal = value
        break
      case 'dpp':
        form.dppLainnya = value
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

const setToFormLba = (name: string, value: number) => {
  if (form) {
    switch (name.toLowerCase()) {
      case 'variance subtotal':
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
      case 'variance gross amount':
        form.totalGrossAmount = value
        break
      // case 'variance':
      //   form.variance = value
      //   break
      case 'variance total net amount':
        form.totalNetAmount = value
        break
      
    }
  }
}

const countDppLainnya = () => {

if (!form) return
let total = 0

if (!checkIsNonPo()) {
  for (const item of form.invoicePoGr) {
    // ⬇️ skip item yang taxCode = null
    if (item.taxCode === null) continue

    const itemAmount =
      form.currency === 'IDR'
        ? item.itemAmountLC
        : item.itemAmountTC

    total = total + Number(itemAmount)
  }
} else {
  for (const item of form.invoiceItem) {
    if (item.taxCode !== null) {
      if (item.debitCredit === 'D') {
        total = total + item.itemAmount
      } else {
        total = total - item.itemAmount
      }
    }
  }
}

  // const subtotal = countSubtotal() || 0
  return total * 11 / 12
}

const setCalculation = () => {
  listCalculation.value = []

  if(form.invoiceType === '4'){
    for (const item of listName.value) {
      if (typeForm.value === 'nonpo' && item === 'Additional Cost') break
      const amount = setCountLba(item) || 0
  
      const data = {
        name: item,
        amount: amount.toString(),
        currency: form?.currency || ''
      }
      listCalculation.value.push(data)
      setToFormLba(item, amount)
    }
  }else {
    for (const item of listName.value) {
      if (typeForm.value === 'nonpo' && item === 'Additional Cost') break
      const amount = setCount(item) || 0
  
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
  if (!checkIsNonPo()) {
    for (const item of form.invoicePoGr) {
      const itemAmount = form.currency === 'IDR' ? item.itemAmountLC : item.itemAmountTC
      total = total + Number(itemAmount)
    }
  } else {
    for (const item of form.invoiceItem) {
      if (item.debitCredit === 'D') {
        total = total + item.itemAmount
      } else {
        total = total - item.itemAmount
      }
    }
  }
  return total
}

const countVatAmount = () => {
  if (!form) return
  let totalPo = 0
  let totalAddDebit = 0
  let totalAddCredit = 0
  if (!checkIsNonPo()) {
    for (const item of form.invoicePoGr) {
      const percentTax = getPercentTax(item.taxCode) || 0
      const itemAmount = form.currency === 'IDR' ? item.itemAmountLC : item.itemAmountTC
      totalPo = totalPo + (percentTax * itemAmount)
    }
    for (const item of form.additionalCost) {
      const percentTax = getPercentTax(item.taxCode) || 0
      if (item.debitCredit === 'D') {
        totalAddDebit = totalAddDebit + (percentTax * Number(item.itemAmount))
      } else {
        totalAddCredit = totalAddCredit + (percentTax * Number(item.itemAmount))
      }
    }
  } else {
    for (const item of form.invoiceItem) {
      const percentTax = getPercentTax(item.taxCode) || 0
      if (item.debitCredit === 'D') {
        totalAddDebit = totalAddDebit + (percentTax * Number(item.itemAmount))
      } else {
        totalAddCredit = totalAddCredit + (percentTax * Number(item.itemAmount))
      }
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

const countVariance = () => {
  let totalRealization = 0
  let totalAmount = 0
  for (const item of form.invoiceItem) {
    totalRealization = totalRealization + Number(item.realizationAmount)
    totalAmount = totalAmount + Number(item.itemAmount)
  }
  return totalAmount - totalRealization

}

const countWhtAmount = () => {
  if (!form) return
  let totalPo = 0
  let totalAddDebit = 0
  let totalAddCredit = 0
  if (!checkIsNonPo()) {
    for (const item of form.invoicePoGr) {
      const percentTax = 0
      const itemAmount = form.currency === 'IDR' ? item.itemAmountLC : item.itemAmountTC
      totalPo = totalPo + (percentTax * itemAmount)
    }
    for (const item of form.additionalCost) {
      const percentTax = 0
      if (item.debitCredit === 'D') {
        totalAddDebit = totalAddDebit + (percentTax * Number(item.itemAmount))
      } else {
        totalAddCredit = totalAddCredit + (percentTax * Number(item.itemAmount))
      }
    }
  } else {
    for (const item of form.invoiceItem) {
      const percentTax = 0
      if (item.debitCredit === 'D') {
        totalAddDebit = totalAddDebit + (percentTax * Number(item.itemAmount))
      } else {
        totalAddCredit = totalAddCredit + (percentTax * Number(item.itemAmount))
      }
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
  () => form,
  () => {
    if (form?.invoiceDp !== '9011' && form?.invoiceDp !== '9013') {
      listName.value = [...dpField]
    } else if (isPettyCash.value) {
      // For Petty Cash, use pettyCashField (without WHT Amount)
      listName.value = [...pettyCashField]
    } else if (form.invoiceType === '4'){
      isLba.value = true
      listName.value = [...lbaField]
    } else if (checkIsNonPo()) {
      listName.value = [...nonPoField]
    } 
    else {
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
  () => [form?.invoicePoGr, form?.additionalCost, form?.currency, form?.invoiceItem],
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
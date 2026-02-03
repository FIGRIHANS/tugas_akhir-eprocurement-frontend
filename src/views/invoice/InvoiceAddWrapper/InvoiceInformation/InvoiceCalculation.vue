<template>
  <div class="flex-1 h-fit">
    <div class="card flex-1 h-fit">
      <div class="card-header flex justify-between items-center gap-[10px] py-[16px] px-[20px]">
        <span class="font-semibold text-base whitespace-nowrap" v-if="isLba"
          >Realization Invoice Calculation</span
        >
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
              <div class="flex-1">
                {{
                  form?.currency === 'IDR' ? useFormatIdr(item.amount) : useFormatUsd(item.amount)
                }}
              </div>
              <div>{{ item.currency }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="card mt-5 p-5"
      v-if="form.invoiceType === '4' && checkIsNonPo() && varianceResult.text"
    >
      <div
        class="p-4 rounded-xl border transition-all duration-300"
        :class="varianceResult.containerClass"
      >
        <div>
          <p class="font-bold text-gray-800 text-base">
            {{ varianceResult.text }}
          </p>

          <p v-if="varianceResult.amount !== 0" class="text-sm text-gray-600 mt-1">
            Due Date: <span class="font-medium text-gray-800">H+ 30</span>
          </p>

          <p
            v-if="varianceResult.posting"
            class="text-sm font-semibold text-gray-700 mt-3 flex items-center gap-2"
          >
            Posting SAP:
            <span
              class="px-2.5 py-1 rounded-md text-xs font-bold shadow-sm"
              :class="varianceResult.badgeClass"
            >
              {{ varianceResult.posting }}
            </span>
          </p>
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
import {
  defaultField,
  dpField,
  lbaField,
  nonPoField,
  pettyCashField,
} from '@/static/invoiceCalculation'
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
    subtotal: countSubtotal(),
    dpp: countDppLainnya(),
    'vat amount': countVatAmount(),
    'wht amount': countWhtAmount(),
    'additional cost': countAdditionalCost(),
    'total gross amount': countTotalGrossAmount(),
    'total net amount': countTotalNetAmount(),
  }

  return list[name.toLowerCase()] ?? 0
}

const varianceResult = computed(() => {
  const variance = countVariance()

  if (variance < 0) {
    return {
      containerClass: 'bg-yellow-50 border-yellow-400',
      text: `Company Must Pay to Employee ${form.currency} ${Math.abs(variance).toLocaleString('id-ID')}`,
      amount: Math.abs(variance),
      posting: 'F-53/Outgoing Payment',
      badgeClass: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    }
  }

  if (variance > 0) {
    return {
      containerClass: 'bg-green-50 border-green-400',
      text: `Employee Pay to Company ${form.currency} ${variance.toLocaleString('id-ID')}`,
      amount: variance,
      posting: 'F-28/Incoming Payment',
      badgeClass: 'bg-green-100 text-green-800 border border-green-200',
    }
  }

  if (variance === 0 && countVariance() !== null) {
    // Check if user has engaged with inputs to distinguish from initial state
    const hasAnyRealizationInput = form.invoiceItem.some((item) => item.hasRealizationInput)

    if (hasAnyRealizationInput) {
      return {
        containerClass: 'bg-blue-50 border-blue-400',
        text: 'The realization matches the cash advance (No SAP posting required)',
        amount: 0,
        posting: '',
        badgeClass: 'bg-blue-100 text-blue-800 border border-blue-200',
      }
    }
  }

  return {
    containerClass: '',
    text: '',
    amount: 0,
    posting: null,
    badgeClass: '',
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
  const varianceSubtotal = countVariance()
  const vatAmount = countVatVariance() || 0
  const whtAmount = countWhtAmount() || 0
  const additionalCost = countAdditionalCost() || 0

  const varianceGrossAmount = varianceSubtotal + vatAmount
  const varianceTotalNetAmount = varianceGrossAmount - whtAmount

  const list: Record<string, number> = {
    'variance subtotal': varianceSubtotal,
    'vat amount variance': vatAmount,
    'wht amount': whtAmount,
    'additional cost': additionalCost,
    'variance gross amount': varianceGrossAmount,
    'variance total net amount': varianceTotalNetAmount,
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
      case 'vat amount variance':
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

      const itemAmount = form.currency === 'IDR' ? item.itemAmountLC : item.itemAmountTC

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
  return (total * 11) / 12
}

const setCalculation = () => {
  listCalculation.value = []

  if (form.invoiceType === '4') {
    for (const item of listName.value) {
      if (typeForm.value === 'nonpo' && item === 'Additional Cost') break
      const amount = setCountLba(item) || 0

      const data = {
        name: item,
        amount: amount.toString(),
        currency: form?.currency || '',
      }
      listCalculation.value.push(data)
      setToFormLba(item, amount)
    }
  } else {
    for (const item of listName.value) {
      if (typeForm.value === 'nonpo' && item === 'Additional Cost') break
      const amount = setCount(item) || 0

      const data = {
        name: item,
        amount: amount.toString(),
        currency: form?.currency || '',
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
    return parseFloat(splitName[1].replace(',', '.').replace('%', '')) / 100
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
      totalPo = totalPo + percentTax * itemAmount
    }
    for (const item of form.additionalCost) {
      const percentTax = getPercentTax(item.taxCode) || 0
      if (item.debitCredit === 'D') {
        totalAddDebit = totalAddDebit + percentTax * Number(item.itemAmount)
      } else {
        totalAddCredit = totalAddCredit + percentTax * Number(item.itemAmount)
      }
    }
  } else {
    for (const item of form.invoiceItem) {
      const percentTax = getPercentTax(item.taxCode) || 0
      if (item.debitCredit === 'D') {
        totalAddDebit = totalAddDebit + percentTax * Number(item.itemAmount)
      } else {
        totalAddCredit = totalAddCredit + percentTax * Number(item.itemAmount)
      }
    }
  }
  return totalPo + totalAddDebit - totalAddCredit
}

const countVatVariance = () => {
  if (!form) return 0
  let totalAddDebit = 0
  let totalAddCredit = 0

  // Check if ANY item has realization input (similar to countVariance logic)
  const hasAnyRealizationInput = form.invoiceItem.some((item) => item.hasRealizationInput)
  if (!hasAnyRealizationInput) return 0

  for (const item of form.invoiceItem) {
    const percentTax = getPercentTax(item.taxCode) || 0
    const variance = item.variance || 0

    if (item.debitCredit === 'D') {
      totalAddDebit = totalAddDebit + percentTax * variance
    } else {
      totalAddCredit = totalAddCredit + percentTax * variance
    }
  }
  return totalAddDebit - totalAddCredit
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
  // Check if ANY item has realization input
  const hasAnyRealizationInput = form.invoiceItem.some((item) => item.hasRealizationInput)

  if (!hasAnyRealizationInput) {
    return 0 // Don't show calculation if no realization input yet
  }

  let totalVariance = 0

  // Sum ALL items (variance)
  for (const item of form.invoiceItem) {
    totalVariance += Number(item.variance || 0)
  }

  return totalVariance
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
      totalPo = totalPo + percentTax * itemAmount
    }
    for (const item of form.additionalCost) {
      const percentTax = 0
      if (item.debitCredit === 'D') {
        totalAddDebit = totalAddDebit + percentTax * Number(item.itemAmount)
      } else {
        totalAddCredit = totalAddCredit + percentTax * Number(item.itemAmount)
      }
    }
  } else {
    for (const item of form.invoiceItem) {
      const percentTax = 0 // Verify logic: usually WHT code has rate, but here it's 0 placeholder?
      // Logic for WHT: Usually item.whtAmount is calculated in row. Sum it up?
      // If based on Variance:
      // But whtAmount is usually pre-calculated in item.
      // If user wants WHT Amount based on Variance, we might need to re-calculate whtAmount dynamically?
      // Given existing code sets percentTax = 0 for Non-Po WHT calculation here (which looks weird/placeholder),
      // I will leave WHT logic mostly alone unless I see explicit WHT rate logic.
      // However, check existing `countWhtAmount` implementation in step 1097?
      // It returns `totalPo + totalAddDebit - totalAddCredit`.
      // But percentTax is hardcoded to 0 inside the loops!
      // This suggests `countWhtAmount` currently returns 0.

      // If user expects WHT amount, maybe it sums `item.whtAmount`?
      // Step 1074: `whtAmount: String(item.whtAmount || 0)` in mapping.

      // Let's assume current countWhtAmount (returning 0) is placeholder and user hasn't complained about WHT value specifically, just listing it.
      // But if user expects it to work, I should probably sum `item.whtAmount`?

      // Wait, `countVatAmount` calculates tax.
      // `countWhtAmount` hardcodes percentTax=0.

      // I will Focus on countVariance replacement first.
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
    } else if (form.invoiceType === '4') {
      isLba.value = true
      listName.value = [...lbaField]
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

watch(
  () => [form?.invoicePoGr, form?.additionalCost, form?.currency, form?.invoiceItem],
  () => {
    setCalculation()
  },
  {
    deep: true,
    immediate: true,
  },
)

onMounted(() => {
  typeForm.value = route.query.type?.toString().toLowerCase() || 'po'
  setCalculation()
})
</script>

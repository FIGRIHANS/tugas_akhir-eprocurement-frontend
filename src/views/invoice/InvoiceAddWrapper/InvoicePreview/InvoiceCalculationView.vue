<template>
  <div>
    <p class="text-lg font-semibold m-[0px]" v-if="form.invoiceType !== '4'">Invoice Calculation</p>
    <p class="text-lg font-semibold m-[0px]" v-else>Realization Invoice Calculation</p>
    <div class="flex flex-col mt-[16px]">
      <div
        v-for="(item, index) in listCalculation"
        :key="index"
        class="border-b border-gray-200 py-[29px] px-[16px] text-xs flex"
        :class="index === listCalculation.length - 1 ? 'calculation__last-field' : ''"
      >
        <div class="flex-1">{{ item.name }}</div>
        <div class="flex-1 flex items-center justify-center">
          <div class="flex-1">
            {{ form?.currency === 'IDR' ? useFormatIdr(item.amount) : useFormatUsd(item.amount) }}
          </div>
          <div>{{ item.currency }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch, inject } from 'vue'
import { useRoute } from 'vue-router'
import type { listType } from '../../types/invoiceCalculation'
import type { formTypes } from '../..//types/invoiceAddWrapper'
import { defaultField, dpField, lbaField, pettyCashField } from '@/static/invoiceCalculation'
import { useFormatIdr, useFormatUsd } from '@/composables/currency'

const route = useRoute()
const form = inject<formTypes>('form')
const typeForm = ref<string>('')
const listName = ref<string[]>([])
const listCalculation = ref<listType[]>([])

const isPettyCash = computed(() => form?.invoiceType === '5')

const setCount = (name: string) => {
  const list = {
    subtotal: form?.subtotal,
    'vat amount': form?.vatAmount,
    'dpp': countDpp(),
    'wht amount': form?.whtAmount,
    'additional cost': form?.additionalCostCalc,
    'total gross amount': form?.totalGrossAmount,
    'total net amount': form?.totalNetAmount,
  } as { [key: string]: number }

  return list[name.toLowerCase()]
}

const setCountLba = (name: string) => {
  const list = {
    'variance subtotal': countVariance(),
    'vat amount': form?.vatAmount,
    'wht amount': form?.whtAmount,
    'additional cost': form?.additionalCostCalc,
    'variance gross amount': form?.totalGrossAmount,
    'variance total net amount': form?.totalNetAmount,
  } as { [key: string]: number }

  return list[name.toLowerCase()]
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

const checkIsNonPo = () => {
  return (
    route.query.type === 'nonpo' ||
    typeForm.value === 'non-po-view' ||
    route.query.type === 'cas' ||
    typeForm.value === 'cas'
  )
}


const countDpp = () => {
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

  return total * 11 / 12
}


const setCalculation = () => {
  listCalculation.value = []

  const isNonPoLike = typeForm.value === 'nonpo' || typeForm.value === 'cas'
  const isPoLike = typeForm.value === 'po' || typeForm.value === 'po-view'
  const isNonPoView = typeForm.value === 'non-po-view'

  if (form.invoiceType !== '4') {
    for (const item of listName.value) {
      if (
        (isNonPoLike && item !== 'Additional Cost') ||
        isPoLike ||
        isNonPoView
      ) {
        const amount = setCount(item)
        const data = {
          name: item,
          amount: amount ? amount.toString() : '0',
          currency: form?.currency || '',
        }
        listCalculation.value.push(data)
      }
    }
  }else{
    for (const item of listName.value) {
      if (
        (isNonPoLike && item !== 'Additional Cost') ||
        isPoLike ||
        isNonPoView
      ) {
        const amount = setCountLba(item)
        const data = {
          name: item,
          amount: amount ? amount.toString() : '0',
          currency: form?.currency || '',
        }
        listCalculation.value.push(data)
      }
    }
  }

}

const checkIsPoPibCc = () => {
  return (form.invoiceType === '902' || form.invoiceType === '903') && form.status > 0
}

watch(
  () => [form?.invoiceDp, form?.invoiceType],
  () => {
    if (isPettyCash.value) {
      listName.value = [...pettyCashField]
    }  else if (form?.invoiceType === '4') {
      listName.value = [...lbaField]
    }
    else if (form?.invoiceDp !== '9011' && form?.invoiceDp !== '9013' && !checkIsPoPibCc()) {
      listName.value = [...dpField]
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
  () => form,
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

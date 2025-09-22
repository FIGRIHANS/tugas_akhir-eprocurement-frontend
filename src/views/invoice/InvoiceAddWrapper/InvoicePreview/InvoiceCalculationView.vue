<template>
  <div>
    <p class="text-lg font-semibold m-[0px]">Invoice Calculation</p>
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
import { ref, onMounted, watch, inject } from 'vue'
import { useRoute } from 'vue-router'
import type { listType } from '../../types/invoiceCalculation'
import type { formTypes } from '../..//types/invoiceAddWrapper'
import { defaultField, dpField } from '@/static/invoiceCalculation'
import { useFormatIdr, useFormatUsd } from '@/composables/currency'

const route = useRoute()
const form = inject<formTypes>('form')
const typeForm = ref<string>('')
const listName = ref<string[]>([])
const listCalculation = ref<listType[]>([])

const setCount = (name: string) => {
  const list = {
    subtotal: form?.subtotal,
    'vat amount': form?.vatAmount,
    'wht amount': form?.whtAmount,
    'additional cost': form?.additionalCostCalc,
    'total gross amount': form?.totalGrossAmount,
    'total net amount': form?.totalNetAmount,
  } as { [key: string]: number }

  return list[name.toLowerCase()]
}

const setCalculation = () => {
  listCalculation.value = []
  for (const item of listName.value) {
    if (
      (typeForm.value === 'nonpo' && item !== 'Additional Cost') ||
      typeForm.value === 'po' ||
      typeForm.value === 'po-view' ||
      typeForm.value === 'non-po-view'
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

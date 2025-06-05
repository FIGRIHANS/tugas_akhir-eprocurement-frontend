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
          <div
            v-for="(item, index) in listCalculation"
            :key="index"
            class="border-b border-gray-200 py-[31px] px-[20px] text-xs flex"
            :class="index === listCalculation.length - 1 ? 'calculation__last-field' : ''"
          >
            <div class="flex-1">{{ item.name }}</div>
            <div class="flex-1">{{ useFormatIdr(item.amount) }}</div>
            <div>{{ form?.currency }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, inject } from 'vue'
import { useRoute } from 'vue-router'
import type { listType } from '../../types/invoiceCalculation'
import type { formTypes } from '../../types/invoiceDetailEdit'
import { defaultField, dpField } from '@/static/invoiceCalculation'
import { useFormatIdr } from '@/composables/currency'

const route = useRoute()
const form = inject<formTypes>('form')
const typeForm = ref<string>('')
const listName = ref<string[]>([])
const listCalculation = ref<listType[]>([])

const setCalculation = () => {
  listCalculation.value = []
  for (const item of listName.value) {
    if ((typeForm.value === 'nonpo' && item !== 'Additional Cost') || typeForm.value === 'po') {
      // const amount = setCount(item)
      const data = {
        name: item,
        amount: '0',
        currency: form?.currency || ''
      }
      listCalculation.value.push(data)
      // setToForm(item, amount)
    }
  }
}

watch(
  () => [form?.invoiceDp],
  () => {
    if (form?.invoiceDp !== '1') {
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

onMounted(() => {
  typeForm.value = route.query.type?.toString().toLowerCase() || 'po'
  setCalculation()  
})
</script>

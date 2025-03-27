<template>
  <div>
    <p class="text-lg font-semibold m-[0px]">Invoice Calculation</p>
    <div class="flex flex-col mt-[16px]">
      <div
        v-for="(item, index) in listCalculation"
        :key="index"
        class="border-b border-gray-200 py-[12px] px-[16px] text-xs flex"
        :class="index === listCalculation.length - 1 ? 'calculation__last-field' : ''"
      >
        <div class="flex-1">{{ item.name }}</div>
        <div class="flex-1 flex items-center justify-center">
          <span class="flex-1">{{ item.amount }}</span>
          <span>{{ item.currency }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { listType } from '../../types/invoiceCalculation'

const route = useRoute()
const typeForm = ref<string>('')

const listName = ref<string[]>([
  'Subtotal',
  'VAT Amount',
  'WHT AMount',
  'Additional Cost',
  'Total Gross Amount',
  'Total Net Amount',
  'Amount Due'
])

const listCalculation = ref<listType[]>([])

onMounted(() => {
  typeForm.value = route.query.type?.toString().toLowerCase() || 'po'

  for (const item of listName.value) {
    if ((typeForm.value === 'nonpo' && item !== 'Additional Cost') || typeForm.value === 'po') {
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

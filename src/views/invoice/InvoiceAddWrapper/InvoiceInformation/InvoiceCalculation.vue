<template>
  <div class="card flex-1 h-fit">
    <div class="card-header flex justify-between items-center gap-[10px] py-[16px] px-[20px]">
      <span class="font-semibold text-base whitespace-nowrap">Invoice Calculation</span>
      <div class="flex items-center gap-[10px]">
        <button class="btn btn-outline btn-primary" data-modal-toggle="#calculation_log_modal">
          Log
          <i class="ki-duotone ki-burger-menu"></i>
        </button>
        <button class="btn btn-primary">
          Refresh
          <i class="ki-duotone ki-arrows-circle"></i>
        </button>
      </div>
    </div>
    <div class="card-body p-[0px]">
      <div class="flex">
        <div class="flex flex-col flex-1">
          <div
            v-for="(item, index) in listCalculation"
            :key="index"
            class="border-b border-gray-200 py-[30px] px-[20px] text-xs flex"
            :class="index === listCalculation.length - 1 ? 'calculation__last-field' : ''"
          >
            <div class="flex-1">{{ item.name }}</div>
            <div class="flex-1">{{ item.amount }}</div>
            <div>{{ item.currency }}</div>
          </div>
        </div>
      </div>
    </div>
    <ModalLog />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import type { listType } from '../../types/invoiceCalculation'

const ModalLog = defineAsyncComponent(() => import('./InvoiceCalculation/ModalLog.vue'))

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

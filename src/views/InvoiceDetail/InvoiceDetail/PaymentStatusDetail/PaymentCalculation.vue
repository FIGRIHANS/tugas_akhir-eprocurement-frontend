<template>
  <div class="card flex-1 h-fit">
    <div class="card-header flex justify-between items-center gap-[10px] py-[16px] px-[20px]">
      <span class="font-semibold text-base whitespace-nowrap">Payment Status</span>
    </div>
    <div class="card-body p-[0px]">
      <div class="flex">
        <div class="flex flex-col flex-1">
          <div
            v-for="(item, index) in listPaymentStatus"
            :key="index"
            class="border-b border-gray-200 py-[22px] px-[20px] flex"
            :class="index === listPaymentStatus.length - 1 ? 'calculation__last-field' : ''"
          >
            <div class="flex-1 text-sm font-medium">{{ item.name }}</div>
            <div class="flex-1 text-sm font-medium">
              {{ form?.currCode === 'IDR' ? useFormatIdr(item.amount) : useFormatUsd(item.amount) }}
            </div>
            <div class="text-sm font-medium">{{ item.currency }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, inject, onMounted, watch } from 'vue'
import type { Ref } from 'vue'
import type { formTypes } from '../../types/invoiceDetail'
import { useFormatIdr, useFormatUsd } from '@/composables/currency'

const form = inject<Ref<formTypes>>('form')

interface PaymentStatusItem {
  name: string
  amount: string
  currency: string
}

const listPaymentStatus = ref<PaymentStatusItem[]>([])

const setPaymentStatus = () => {
  if (form?.value) {
    listPaymentStatus.value = [
      {
        name: 'Total Invoice',
        amount: form.value.totalGrossAmount?.toString() || '0',
        currency: form.value.currCode || 'IDR',
      },
      {
        name: 'Payment Received',
        amount: '0', // TODO: Get from API
        currency: form.value.currCode || 'IDR',
      },
      {
        name: 'Outstanding Payment',
        amount: form.value.totalNetAmount?.toString() || '0',
        currency: form.value.currCode || 'IDR',
      },
    ]
  }
}

watch(
  () => form?.value,
  () => {
    setPaymentStatus()
  },
  { deep: true, immediate: true },
)

onMounted(() => {
  setPaymentStatus()
})
</script>

<style lang="scss" scoped>
.calculation__last-field {
  background-color: #f9fafb;
  font-weight: 600;
}
</style>

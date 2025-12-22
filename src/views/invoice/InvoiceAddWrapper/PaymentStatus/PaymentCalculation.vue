<template>
  <div class="card flex-1 payment-status-card">
    <div class="card-header py-[16px] px-[20px]">
      <span class="font-semibold text-base whitespace-nowrap">Payment Status</span>
    </div>
    <div class="card-body payment-table">
      <div
        v-for="(item, index) in listPaymentStatus"
        :key="index"
        class="status-row py-[22px] px-[20px] text-xs flex"
        :class="
          index === listPaymentStatus.length - 1
            ? 'calculation__last-field last-row'
            : 'border-b border-gray-200'
        "
      >
        <div class="flex-1">{{ item.name }}</div>
        <div class="flex-1">
          {{ form?.currency === 'IDR' ? useFormatIdr(item.amount) : useFormatUsd(item.amount) }}
        </div>
        <div>{{ item.currency }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, inject, onMounted, watch } from 'vue'
import type { formTypes } from '../../types/invoiceAddWrapper'
import { useFormatIdr, useFormatUsd } from '@/composables/currency'

const form = inject<formTypes>('form')

interface PaymentStatusItem {
  name: string
  amount: string
  currency: string
}

const listPaymentStatus = ref<PaymentStatusItem[]>([])

const setPaymentStatus = () => {
  if (!form) return

  const totalInvoice = form.totalNetAmount || 0
  // For now, assume all invoices with status 10 are fully paid
  const paymentReceived = form.status === 10 ? totalInvoice : 0
  const outstandingPayment = totalInvoice - paymentReceived

  listPaymentStatus.value = [
    {
      name: 'Total Invoice',
      amount: totalInvoice.toString(),
      currency: form.currency || 'IDR',
    },
    {
      name: 'Payment Received',
      amount: paymentReceived.toString(),
      currency: form.currency || 'IDR',
    },
    {
      name: 'Outstanding Payment',
      amount: outstandingPayment.toString(),
      currency: form.currency || 'IDR',
    },
  ]
}

// Watch for form changes and recalculate
watch(
  () => form,
  () => {
    setPaymentStatus()
  },
  { deep: true, immediate: true }
)

onMounted(() => {
  setPaymentStatus()
})
</script>

<style lang="scss" scoped>
.payment-status-card {
  display: flex;
  flex-direction: column;
  height: fit-content !important;
  max-height: fit-content !important;
  min-height: auto !important;
  overflow: hidden;
  margin-bottom: 0 !important;
}

.calculation__last-field {
  background-color: #dbeafe;
  font-weight: 600;
  color: #2563eb;
  border-bottom-left-radius: 0.5rem !important;
  border-bottom-right-radius: 0.5rem !important;
  margin-bottom: 0 !important;
}

.status-row:last-child {
  border-bottom: 0;
}

.last-row {
  margin: 0 !important;
  padding-bottom: 22px !important;
  border-bottom-left-radius: 0.5rem !important;
  border-bottom-right-radius: 0.5rem !important;
}

.payment-table {
  padding: 0 !important;
  margin: 0 !important;
  min-height: 0 !important;
  height: fit-content !important;
  max-height: fit-content !important;
  flex-shrink: 0 !important;
  display: flex !important;
  flex-direction: column !important;
}

.payment-status-card .card-body {
  padding: 0 !important;
  margin: 0 !important;
  height: fit-content !important;
  min-height: 0 !important;
  max-height: fit-content !important;
  flex: none !important;
}

.payment-status-card .card-body:after {
  display: none !important;
}

.payment-status-card:after {
  display: none !important;
}
</style>

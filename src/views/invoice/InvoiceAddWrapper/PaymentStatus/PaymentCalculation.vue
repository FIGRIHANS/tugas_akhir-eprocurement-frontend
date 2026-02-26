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
          {{ item.currency === 'IDR' ? useFormatIdr(item.amount) : useFormatUsd(item.amount) }}
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
import { useInvoiceVerificationStore } from '@/stores/views/invoice/verification'

const form = inject<formTypes>('form')
const verificationApi = useInvoiceVerificationStore()

interface PaymentStatusItem {
  name: string
  amount: string
  currency: string
}

interface PaymentStatusHeader {
  id: number
  invoiceUId: string
  companyCode: string
  sapInvoiceNo: string
  invoicePostingDate: string
  termOfPayment: string
  estimatedPaymentDate: string
  paymentMethod: string
  clearingDocumentNo: string
  paymentStatus: string
  statusCode: number
  statusName: string
  totalAmountInvoice: number
  paymentReceivedAmount: number
  outstandingAmount: number
  currency: string
}

const listPaymentStatus = ref<PaymentStatusItem[]>([])
const paymentStatusHeader = ref<PaymentStatusHeader | null>(null)

const fetchPaymentStatus = async () => {
  try {
    if (!form || !form.invoiceUId) return

    const response = await verificationApi.getPaymentStatus(form.invoiceUId)

    if (response?.result?.content?.header) {
      paymentStatusHeader.value = response.result.content.header as PaymentStatusHeader
      setPaymentStatus()
    }
  } catch (error) {
    console.error('Error fetching payment status data:', error)
    // Fallback to form data if API fails
    setPaymentStatus()
  }
}

const setPaymentStatus = () => {
  if (!form) return

  // Use API data if available, otherwise fallback to form data
  const totalInvoice = paymentStatusHeader.value?.totalAmountInvoice || form.totalNetAmount || 0
  const paymentReceived = paymentStatusHeader.value?.paymentReceivedAmount || 0
  const outstandingPayment =
    paymentStatusHeader.value?.outstandingAmount || totalInvoice - paymentReceived
  const currency = paymentStatusHeader.value?.currency || form.currency

  listPaymentStatus.value = [
    {
      name: 'Total Invoice',
      amount: totalInvoice.toString(),
      currency: currency,
    },
    {
      name: 'Payment Received',
      amount: paymentReceived.toString(),
      currency: currency,
    },
    {
      name: 'Outstanding Payment',
      amount: outstandingPayment.toString(),
      currency: currency,
    },
  ]
}

// Watch for form changes and refetch payment status
watch(
  () => form?.invoiceUId,
  (newInvoiceUId) => {
    if (newInvoiceUId) {
      fetchPaymentStatus()
    }
  },
  { immediate: true },
)

// Watch for payment status header changes
watch(
  () => paymentStatusHeader.value,
  () => {
    setPaymentStatus()
  },
  { deep: true },
)

onMounted(async () => {
  await fetchPaymentStatus()
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
  background-color: #ccfbf1;
  font-weight: 600;
  color: #0f766e;
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

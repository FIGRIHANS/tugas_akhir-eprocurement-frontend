<template>
  <div v-if="form">
    <div class="flex gap-[24px]">
      <PaymentInformation ref="paymentInfoRef" class="flex-1" />
      <div class="flex-1 flex flex-col">
        <PaymentCalculation />
      </div>
    </div>
    <PaymentDetails class="mt-[24px]" />
  </div>
</template>

<script lang="ts" setup>
import { inject, provide, ref, defineAsyncComponent, type Ref } from 'vue'
import type { formTypes } from '../types/invoiceDetail'

const PaymentInformation = defineAsyncComponent(
  () => import('./PaymentStatusDetail/PaymentInformation.vue'),
)
const PaymentCalculation = defineAsyncComponent(
  () => import('./PaymentStatusDetail/PaymentCalculation.vue'),
)
const PaymentDetails = defineAsyncComponent(
  () => import('./PaymentStatusDetail/PaymentDetails.vue'),
)

// `form` diprovide sebagai Ref<formTypes> dari InvoiceDetail.vue
const form = inject<Ref<formTypes>>('form')

interface SapDataResponse {
  id: number
  companyCode: string
  documentNumber: number
  sapInvoiceNo: string
  fiscalYear: string
  vendorName: string
  invoiceAmount: number
  paidAmount: number
  openAmount: number
  paymentStatus: string
  statusOutgoing: string
  clearingDate: string | null
  clearingDocumentNo: string | null
  payment: {
    id: number
    paymentId: number
    bankKey: string
    bankName: string
    beneficiaryName: string
    bankAccountNo: string
    bankCountryCode: string
  }
}

interface PaymentInformationComponent {
  fetchSapStatus: () => Promise<SapDataResponse | null>
}

const paymentInfoRef = ref<PaymentInformationComponent | null>(null)

// Provide PaymentInformation ref to PaymentDetails for SAP sync
provide('paymentInformationRef', paymentInfoRef)

interface PaymentDetail {
  no: number
  paymentDate: string
  amount: string
  status: string
  bankAccount: string
  remarks: string
  attachmentDocument?: string
}

// Provide paymentDetails array to PaymentCalculation for Payment Received calculation
const paymentDetailsData = ref<PaymentDetail[]>([])
provide('paymentDetailsData', paymentDetailsData)
</script>

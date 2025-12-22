<template>
  <div class="card flex-1">
    <div class="card-body py-[8px] px-[16px] max-h-[380px] overflow-y-auto scroll mr-[16px]">
      <p class="text-base font-semibold mb-[16px]">Payment Information</p>

      <div>
        <div
          v-for="(item, index) in paymentInfo"
          :key="index"
          class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]"
        >
          <label class="form-label">{{ item.label }}</label>
          <input
            v-if="item.editable"
            v-model="item.value"
            class="input"
            :type="item.type || 'text'"
            :placeholder="item.placeholder || ''"
            @input="handleInput($event, index)"
          />
          <input v-else :value="item.value" class="input" disabled />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, inject, provide, onMounted, watch } from 'vue'
import type { Ref } from 'vue'
import type { formTypes } from '../../types/invoiceDetail'
import { formatDate } from '@/composables/date-format'
import { useInvoiceVerificationStore } from '@/stores/views/invoice/verification'

interface PaymentInfoItem {
  label: string
  value: string
  editable?: boolean
  type?: string
  placeholder?: string
}

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

const form = inject<Ref<formTypes>>('form')
const verificationApi = useInvoiceVerificationStore()

const paymentInfo = ref<PaymentInfoItem[]>([])
const sapStatusData = ref<SapDataResponse | null>(null)

// Inject submittedDocumentNo from parent (InvoiceDetail.vue)
const submittedDocNo = inject<Ref<string>>('submittedDocumentNo', ref(''))

// Inject paymentSummary from parent (InvoiceDetail.vue)
const paymentSummary = inject<
  Ref<{
    totalInvoice: number
    paymentReceived: number
    outstanding: number
    currency: string
    statusCode: number
    statusName: string
    clearingDocumentNo: string
  }>
>(
  'paymentSummary',
  ref({
    totalInvoice: 0,
    paymentReceived: 0,
    outstanding: 0,
    currency: 'IDR',
    statusCode: 8,
    statusName: 'Planned',
    clearingDocumentNo: '-',
  }),
)

// Provide SAP status data to parent for API payload
provide('sapStatusData', sapStatusData)

const setPaymentInfo = () => {
  if (form?.value) {
    paymentInfo.value = [
      {
        label: 'Submitted Document No.',
        value: submittedDocNo.value,
        editable: true, // Always editable
        type: 'text',
        placeholder: 'e.g., 4000000001',
      },
      {
        label: 'Company Code',
        value:
          form.value.companyCode && form.value.companyName
            ? `${form.value.companyCode} - ${form.value.companyName}`
            : form.value.companyCode || '-',
        editable: false,
      },
      {
        label: 'Invoice Posting Date',
        value: form.value.postingDate ? formatDate(form.value.postingDate) : '-',
        editable: false,
      },
      {
        label: 'Term of Payment',
        value: form.value.paymentMethodName || '-',
        editable: false,
      },
      {
        label: 'Estimate Payment Date',
        value: form.value.estimatedPaymentDate ? formatDate(form.value.estimatedPaymentDate) : '-',
        editable: false,
      },
      {
        label: 'Payment Method',
        value: form.value.paymentMethodName || '-',
        editable: false,
      },
      {
        label: 'Clearing Document No.',
        value:
          sapStatusData.value?.clearingDocumentNo ||
          form.value.clearingDocumentNo ||
          (paymentSummary.value.clearingDocumentNo !== '-'
            ? paymentSummary.value.clearingDocumentNo
            : '-'),
        editable: false,
      },
      {
        label: 'Payment Status',
        value: sapStatusData.value?.paymentStatus || paymentSummary.value.statusName || '-',
        editable: false,
      },
    ]
  }
}

const fetchSapStatus = async (): Promise<SapDataResponse | null> => {
  if (!form?.value?.companyCode || !form?.value?.postingDate || !submittedDocNo.value) {
    console.log('SAP Sync: Missing required fields')
    return null
  }

  try {
    const fiscalYear = new Date(form.value.postingDate).getFullYear().toString()
    const documentNumber = submittedDocNo.value.replace(/\D/g, '')

    console.log('SAP Sync: Fetching...', {
      fiscalYear,
      companyCode: form.value.companyCode,
      documentNumber,
    })

    const response = await verificationApi.getSapStatus({
      fiscalYear: fiscalYear,
      companyCode: form.value.companyCode,
      documentNumber: documentNumber,
    })

    if (
      response?.result?.content &&
      Array.isArray(response.result.content) &&
      response.result.content.length > 0
    ) {
      sapStatusData.value = response.result.content[0] as SapDataResponse
      console.log('SAP Sync: Success', sapStatusData.value)

      // Sync SAP result back to parent form and summary
      if (sapStatusData.value.clearingDocumentNo) {
        if (form?.value) form.value.clearingDocumentNo = sapStatusData.value.clearingDocumentNo
        if (paymentSummary?.value)
          paymentSummary.value.clearingDocumentNo = sapStatusData.value.clearingDocumentNo
      }
      if (sapStatusData.value.paymentStatus && paymentSummary?.value) {
        paymentSummary.value.statusName = sapStatusData.value.paymentStatus
      }

      setPaymentInfo()
      return sapStatusData.value
    } else {
      console.log('SAP Sync: No data found')
      sapStatusData.value = null
      setPaymentInfo()
      return null
    }
  } catch (error: unknown) {
    console.error('SAP Sync: Error', error)
    sapStatusData.value = null
    setPaymentInfo()
    return null
  }
}

// Expose fetchSapStatus and getSubmittedDocumentNo to parent
defineExpose({
  fetchSapStatus,
  getSubmittedDocumentNo: () => submittedDocNo.value,
})

// Sync submittedDocNo with paymentInfo
watch(
  () => paymentInfo.value.find((item) => item.label === 'Submitted Document No.')?.value,
  (newVal) => {
    if (newVal !== undefined && newVal !== submittedDocNo.value) {
      submittedDocNo.value = newVal
    }
  },
)

watch(
  () => form?.value,
  () => {
    setPaymentInfo()
  },
  { deep: true, immediate: true },
)

// Watch submittedDocNo changes from parent and update paymentInfo
watch(
  () => submittedDocNo.value,
  (newVal) => {
    const submittedDocItem = paymentInfo.value.find(
      (item) => item.label === 'Submitted Document No.',
    )
    if (submittedDocItem && submittedDocItem.value !== newVal) {
      submittedDocItem.value = newVal
    }
  },
)

watch(
  () => paymentSummary.value,
  () => {
    setPaymentInfo()
  },
  { deep: true },
)

// Watch Clearing Document No. from parent/SAP sync result
watch(
  () => [
    sapStatusData.value?.clearingDocumentNo,
    form?.value?.clearingDocumentNo,
    paymentSummary.value.clearingDocumentNo,
  ],
  () => {
    const clearingDocItem = paymentInfo.value.find((item) => item.label === 'Clearing Document No.')
    const newValue =
      sapStatusData.value?.clearingDocumentNo ||
      form?.value?.clearingDocumentNo ||
      (paymentSummary.value.clearingDocumentNo !== '-'
        ? paymentSummary.value.clearingDocumentNo
        : '-')
    console.log('Watch Clearing Doc - Sources:', {
      sap: sapStatusData.value?.clearingDocumentNo,
      form: form?.value?.clearingDocumentNo,
      summary: paymentSummary.value.clearingDocumentNo,
      final: newValue,
    })
    if (clearingDocItem && clearingDocItem.value !== newValue) {
      clearingDocItem.value = newValue
      console.log('Clearing Doc updated in UI:', newValue)
    }
  },
  { deep: true },
)

// Watch Payment Status from parent/SAP sync result
watch(
  () => [sapStatusData.value?.paymentStatus, paymentSummary.value.statusName],
  () => {
    const paymentStatusItem = paymentInfo.value.find((item) => item.label === 'Payment Status')
    const newValue = sapStatusData.value?.paymentStatus || paymentSummary.value.statusName || '-'
    if (paymentStatusItem && paymentStatusItem.value !== newValue) {
      paymentStatusItem.value = newValue
    }
  },
  { deep: true },
)

const handleInput = (event: Event, index: number) => {
  const target = event.target as HTMLInputElement
  paymentInfo.value[index].value = target.value
}

onMounted(() => {
  setPaymentInfo()
})
</script>

<style lang="scss" scoped>
.scroll {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f7fafc;
}

.scroll::-webkit-scrollbar {
  width: 6px;
}

.scroll::-webkit-scrollbar-track {
  background: #f7fafc;
}

.scroll::-webkit-scrollbar-thumb {
  background-color: #cbd5e0;
  border-radius: 3px;
}
</style>

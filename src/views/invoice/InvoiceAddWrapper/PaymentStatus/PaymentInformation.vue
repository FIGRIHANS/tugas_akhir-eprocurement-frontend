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
          <!-- All fields are disabled for profileId 3200 since it's read-only -->
          <input :value="item.value" class="input" disabled />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, inject, watch } from 'vue'
import moment from 'moment'
import type { formTypes } from '../../types/invoiceAddWrapper'
import { useInvoiceVerificationStore } from '@/stores/views/invoice/verification'

const form = inject<formTypes>('form')
const verificationApi = useInvoiceVerificationStore()
// const userData = inject<{ profile?: { profileId?: number; costCenter?: string } }>('userData') // Add userData injection for profile info

interface PaymentInfoItem {
  label: string
  value: string
}

interface SapPaymentData {
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
  clearingDate: number
  clearingDocumentNo: string
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

const paymentInfo = ref<PaymentInfoItem[]>([])
const sapPaymentData = ref<SapPaymentData | null>(null)
const paymentStatusHeader = ref<PaymentStatusHeader | null>(null)

const formatDate = (date: string | Date | null | number) => {
  if (!date) return '-'

  if (typeof date === 'number') {
    const dateStr = date.toString()
    const year = dateStr.substring(0, 4)
    const month = dateStr.substring(4, 6)
    const day = dateStr.substring(6, 8)
    return `${day}/${month}/${year}`
  }

  return moment(date).format('DD/MM/YYYY')
}

const fetchSapPaymentData = async () => {
  try {
    // Mock API response data (replace with real API call)
    const mockApiResponse = {
      "title": "Success",
      "statusCode": 200,
      "result": {
        "message": "",
        "isError": false,
        "content": [
          {
            "id": 5,
            "companyCode": "GNGR",
            "documentNumber": 4000000005,
            "sapInvoiceNo": "1900020005",
            "fiscalYear": "2025",
            "vendorName": "ACARYA DATA ESA",
            "invoiceAmount": 999000,
            "paidAmount": 999000,
            "openAmount": 0,
            "paymentStatus": "Paid",
            "statusOutgoing": "Paid",
            "clearingDate": 20240711,
            "clearingDocumentNo": "1500021112"
          }
        ]
      }
    }

    if (mockApiResponse.result.content && mockApiResponse.result.content.length > 0) {
      sapPaymentData.value = mockApiResponse.result.content[0]
    }
  } catch (error) {
    console.error('Error fetching SAP payment data:', error)
  }
}

const fetchPaymentStatus = async () => {
  try {
    if (!form || !form.invoiceUId) return

    const response = await verificationApi.getPaymentStatus(form.invoiceUId)

    if (response?.result?.content?.header) {
      paymentStatusHeader.value = response.result.content.header as PaymentStatusHeader
    }
  } catch (error) {
    console.error('Error fetching payment status data:', error)
  }
}

const setPaymentInfo = () => {
  if (!form) return

  paymentInfo.value = [
    {
      label: 'Submitted Document No.',
      value: sapPaymentData.value?.documentNumber?.toString() || '-',
    },
    {
      label: 'Company Code',
      value: form.companyCode && form.companyName
        ? `${form.companyCode} - ${form.companyName}`
        : form.companyCode || '-',
    },
    {
      label: 'Invoice Posting Date',
      value: form.invoiceDate ? formatDate(form.invoiceDate) : '-',
    },
    {
      label: 'Term of Payment',
      value: paymentStatusHeader.value?.termOfPayment || '30 Days',
    },
    {
      label: 'Estimate Payment Date',
      value: form.invoiceDate ? formatDate(form.invoiceDate) : '-',
    },
    {
      label: 'Payment Method',
      value: paymentStatusHeader.value?.paymentMethod || 'Bank Transfer',
    },
    {
      label: 'Clearing Document No.',
      value: paymentStatusHeader.value?.clearingDocumentNo || sapPaymentData.value?.clearingDocumentNo || '-',
    },
    {
      label: 'Payment Status',
      value:
        paymentStatusHeader.value?.paymentStatus ||
        paymentStatusHeader.value?.statusName ||
        sapPaymentData.value?.paymentStatus ||
        '-',
    },
  ]
}

// Watch for form changes and update payment info
watch(
  () => form,
  () => {
    setPaymentInfo()
  },
  { deep: true, immediate: true }
)

// Watch for SAP payment data changes
watch(
  () => sapPaymentData.value,
  () => {
    setPaymentInfo()
  },
  { deep: true }
)

onMounted(async () => {
  await Promise.all([fetchSapPaymentData(), fetchPaymentStatus()])
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

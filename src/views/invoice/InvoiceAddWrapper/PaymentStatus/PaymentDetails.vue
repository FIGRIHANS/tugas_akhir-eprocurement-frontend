<template>
  <div class="flex flex-col gap-[16px]">
    <p class="text-base font-semibold">Payment Details</p>
    <div class="overflow-x-auto invoice__table">
      <table class="table table-xs table-border">
        <thead>
          <tr>
            <th v-for="(item, index) in columns" :key="index" class="invoice__field-base">
              {{ item }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="paymentDetails.length === 0">
            <td :colspan="columns.length" class="text-center text-[13px]">No Data Available</td>
          </tr>
          <template v-else>
            <tr v-for="(item, index) in paymentDetails" :key="index" class="invoice__field-items">
              <td>{{ item.no }}</td>
              <td>{{ item.paymentDate }}</td>
              <td>
                {{
                  form?.currency === 'IDR' ? useFormatIdr(item.amount) : useFormatUsd(item.amount)
                }}
              </td>
              <td>
                <span
                  class="badge"
                  :class="{
                    'badge-success': item.status === 'Paid',
                    'badge-warning': item.status === 'Plan',
                  }"
                >
                  {{ item.status }}
                </span>
              </td>
              <td>{{ item.bankAccount }}</td>
              <td>{{ item.remarks || '-' }}</td>
              <td class="text-center">
                <!-- Download button for attachment document -->
                <UiButton
                  v-if="item.attachmentDocument"
                  icon
                  size="sm"
                  @click="downloadDocument(item.attachmentDocument)"
                  title="Download File"
                >
                  <i class="ki-outline ki-arrow-down text-white"></i>
                </UiButton>
                <span v-else>-</span>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, inject, onMounted, watch } from 'vue'
import type { formTypes } from '../../types/invoiceAddWrapper'
import { useFormatIdr, useFormatUsd } from '@/composables/currency'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import { useInvoiceVerificationStore } from '@/stores/views/invoice/verification'
import moment from 'moment'

const form = inject<formTypes>('form')
const verificationApi = useInvoiceVerificationStore()

const columns = [
  'No',
  'Payment Date',
  'Amount',
  'Status',
  'Bank Account',
  'Remarks',
  'Attachment Document',
]

interface PaymentDetail {
  no: number
  paymentDate: string
  amount: string
  status: string
  bankAccount: string
  remarks: string
  attachmentDocument?: string
}

interface PaymentDetailFromApi {
  invoicePaymentDetailId: number
  invoiceUId: string
  paymentDate: string
  amount: number
  paymentStatus: string
  bankAccount: string
  remarks: string
  documentUrl: string
  documentName: string
  documentSize: number
}

const paymentDetails = ref<PaymentDetail[]>([])

const formatDate = (date: string | null) => {
  if (!date) return '-'
  return moment(date).format('DD/MM/YYYY')
}

const fetchPaymentDetails = async () => {
  try {
    if (!form || !form.invoiceUId) {
      console.log('No invoiceUId found, skipping payment details fetch')
      return
    }

    console.log('Fetching payment details for invoiceUId:', form.invoiceUId)

    const response = await verificationApi.getPaymentStatus(form.invoiceUId)

    console.log('Payment status API response:', response)

    if (response?.result?.content?.detail && Array.isArray(response.result.content.detail)) {
      const detailData = response.result.content.detail as PaymentDetailFromApi[]

      console.log('Payment details from API:', detailData)

      paymentDetails.value = detailData.map((item, index) => ({
        no: index + 1,
        paymentDate: formatDate(item.paymentDate),
        amount: item.amount?.toString() || '0',
        status: item.paymentStatus || '-',
        bankAccount: item.bankAccount || '-',
        remarks: item.remarks || '-',
        attachmentDocument: item.documentUrl || undefined,
      }))

      console.log('Mapped payment details:', paymentDetails.value)
    } else {
      console.log('No payment details in API response')
      paymentDetails.value = []
    }
  } catch (error) {
    console.error('Error fetching payment details:', error)
    paymentDetails.value = []
  }
}

const downloadDocument = (documentUrl: string) => {
  console.log('Downloading document:', documentUrl)

  if (documentUrl && documentUrl.startsWith('http')) {
    window.open(documentUrl, '_blank')
  } else {
    const link = document.createElement('a')
    const sampleContent = `Sample document content`
    const blob = new Blob([sampleContent], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)

    link.href = url
    link.download = documentUrl || 'document.txt'
    link.style.display = 'none'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    window.URL.revokeObjectURL(url)
  }
}

// Watch for form.invoiceUId changes and fetch payment details
watch(
  () => form?.invoiceUId,
  async (newInvoiceUId) => {
    if (newInvoiceUId) {
      await fetchPaymentDetails()
    }
  },
  { immediate: true },
)

onMounted(async () => {
  await fetchPaymentDetails()
})
</script>

<style lang="scss" scoped>
@use '../../styles/additional-cost.scss';

.invoice__table {
  border-radius: 0.5rem;
  overflow: hidden;

  .table {
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 0;
    background: #ffffff;
    border: 1px solid #e1e5e9;
    border-radius: 0.5rem;
  }

  .invoice__field-base {
    background-color: #dbeafe; /* bg-blue-100 */
    border-bottom: 1px solid #3b82f6; /* border-b-blue-500 */
    border-top: 1px solid #e1e5e9;
    border-left: 1px solid #e1e5e9;
    border-right: 1px solid #e1e5e9;
    padding: 12px 16px;
    font-weight: 600;
    font-size: 12px;
    text-align: left;
    color: #3b82f6; /* text-blue-500 */
    vertical-align: middle;

    &:first-child {
      border-top-left-radius: 0.5rem;
    }

    &:last-child {
      border-top-right-radius: 0.5rem;
    }
  }

  .invoice__field-items {
    background-color: #ffffff;

    &:hover {
      background-color: rgba(37, 99, 235, 0.05);
    }

    &:last-child {
      td:first-child {
        border-bottom-left-radius: 0.5rem;
      }

      td:last-child {
        border-bottom-right-radius: 0.5rem;
      }
    }

    td {
      border: 1px solid #e1e5e9;
      padding: 12px 16px;
      font-size: 13px;
      vertical-align: middle;
      color: #181c32;
    }
  }
}

.badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}

.badge-success {
  background-color: #50cd89;
  color: #ffffff;
}

.badge-warning {
  background-color: #fff3cd;
  color: #856404;
}
</style>

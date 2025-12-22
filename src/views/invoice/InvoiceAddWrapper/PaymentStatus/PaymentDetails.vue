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

const form = inject<formTypes>('form')

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

const paymentDetails = ref<PaymentDetail[]>([])
const sapPaymentData = ref<SapPaymentData | null>(null)

// Fetch SAP payment data from API
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

const formatClearingDate = (clearingDate: number) => {
  if (!clearingDate) return '-'
  const dateStr = clearingDate.toString()
  const year = dateStr.substring(0, 4)
  const month = dateStr.substring(4, 6)
  const day = dateStr.substring(6, 8)
  return `${day}/${month}/${year}`
}

const setPaymentDetails = () => {
  if (!form) {
    paymentDetails.value = []
    return
  }

  if (form.status === 10 && sapPaymentData.value) {
    paymentDetails.value = [
      {
        no: 1,
        paymentDate: formatClearingDate(sapPaymentData.value.clearingDate),
        amount: sapPaymentData.value.paidAmount?.toString() || '0',
        status: sapPaymentData.value.paymentStatus || 'Paid',
        bankAccount: 'BRI01 - 56464564',
        remarks: `SAP Invoice: ${sapPaymentData.value.sapInvoiceNo || 'N/A'}`,
        attachmentDocument: 'SAP_Payment_Receipt.pdf',
      },
    ]
  } else {
    paymentDetails.value = []
  }
}

const downloadDocument = (documentName: string) => {
  console.log('Downloading document:', documentName)

  // Create a temporary link element for download
  const link = document.createElement('a')

  // For demo purposes, we'll simulate download with a blob
  // In real implementation, you would fetch the actual file from server
  const sampleContent = `Sample document content for: ${documentName}`
  const blob = new Blob([sampleContent], { type: 'text/plain' })
  const url = window.URL.createObjectURL(blob)

  link.href = url
  link.download = documentName
  link.style.display = 'none'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  // Clean up the URL object
  window.URL.revokeObjectURL(url)

  // Show success message
  alert(`Document "${documentName}" downloaded successfully!`)
}

watch(
  () => form,
  () => {
    setPaymentDetails()
  },
  { deep: true, immediate: true }
)

// Watch for SAP payment data changes
watch(
  () => sapPaymentData.value,
  () => {
    setPaymentDetails()
  },
  { deep: true }
)

onMounted(async () => {
  await fetchSapPaymentData()
  setPaymentDetails()
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

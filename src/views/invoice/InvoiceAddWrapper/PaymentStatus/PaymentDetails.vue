<template>
  <div class="flex flex-col gap-[16px]">
    <p class="text-base font-semibold">Payment Details</p>
    <div class="overflow-x-auto cost__table">
      <table class="table table-xs table-border">
        <thead>
          <tr>
            <th v-for="(item, index) in columns" :key="index" class="cost__field-base">
              {{ item }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="paymentDetails.length === 0">
            <td :colspan="columns.length" class="text-center text-[13px]">No Data Available</td>
          </tr>
          <template v-else>
            <tr v-for="(item, index) in paymentDetails" :key="index" class="cost__field-items">
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
                <!-- Single button that handles both upload and download -->
                <UiButton
                  icon
                  size="sm"
                  @click="handleAttachmentAction(index, item.attachmentDocument)"
                  :title="item.attachmentDocument ? 'Download File' : 'Upload File'"
                >
                  <i
                    :class="item.attachmentDocument ? 'ki-duotone ki-cloud-download' : 'ki-duotone ki-cloud-add'"
                  >
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </i>
                </UiButton>

                <!-- Hidden file input -->
                <input
                  type="file"
                  :id="`file-input-${index}`"
                  @change="handleFileUpload($event, index)"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  class="hidden"
                />
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
  return `${day}.${month}.${year}`
}

const handleAttachmentAction = (index: number, attachmentDocument?: string) => {
  if (attachmentDocument) {
    downloadDocument(attachmentDocument)
  } else {
    triggerFileUpload(index)
  }
}

// Trigger file upload dialog
const triggerFileUpload = (index: number) => {
  const fileInput = document.getElementById(`file-input-${index}`) as HTMLInputElement
  if (fileInput) {
    fileInput.click()
  }
}

// Handle file upload
const handleFileUpload = (event: Event, index: number) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      alert('File size must be less than 10MB')
      return
    }

    // Update the payment detail with the uploaded file name
    if (paymentDetails.value[index]) {
      paymentDetails.value[index].attachmentDocument = file.name
    }

    console.log('File uploaded successfully:', {
      name: file.name,
      size: file.size,
      type: file.type,
      rowIndex: index
    })

    alert(`File "${file.name}" uploaded successfully!`)

    target.value = ''

  }
}

// Update payment status function (moved to parent InvoiceAddWrapper)
// const updatePaymentStatus = () => {
//   console.log('Update payment status clicked')
//
// }

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
        attachmentDocument: undefined,
      },
    ]
  } else {
    paymentDetails.value = []
  }
}

const downloadDocument = (documentName: string) => {
  console.log('Downloading document:', documentName)

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

.badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}

.badge-success {
  background-color: #d4edda;
  color: #155724;
}

.badge-warning {
  background-color: #fff3cd;
  color: #856404;
}

// White header for payment details table to match profileId 3002
.cost__field-base {
  background-color: white !important;
}

.table thead th {
  background-color: white !important;
}
</style>

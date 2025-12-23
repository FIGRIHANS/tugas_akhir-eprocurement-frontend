<template>
  <div class="flex flex-col gap-[24px]">
    <p class="text-lg font-semibold m-[0px]">Payment Details</p>
    <div class="flex justify-start mb-4">
      <button class="btn btn-primary" @click="handleSapSync">
        SAP Synchronize <i class="ki-duotone ki-arrows-circle"></i>
      </button>
    </div>
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
              <!-- Actions column (left of No) -->
              <td class="text-center">
                <div class="flex items-center justify-center gap-[6px]">
                  <button
                    class="btn btn-icon btn-primary"
                    @click="editingIndex === index ? saveEdit(index) : startEdit(index)"
                    :title="editingIndex === index ? 'Save' : 'Edit'"
                  >
                    <i v-if="editingIndex !== index" class="ki-duotone ki-notepad-edit"></i>
                    <i v-else class="ki-duotone ki-check-circle"></i>
                  </button>
                  <button
                    class="btn btn-icon btn-outline btn-danger"
                    @click="editingIndex === index ? cancelEdit() : deleteRow(index)"
                    :title="editingIndex === index ? 'Cancel' : 'Delete'"
                  >
                    <i class="ki-duotone ki-cross-circle"></i>
                  </button>
                </div>
              </td>

              <td>{{ item.no }}</td>
              <td>{{ item.paymentDate }}</td>
              <td>
                {{
                  form?.currCode === 'IDR' ? useFormatIdr(item.amount) : useFormatUsd(item.amount)
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
              <!-- Remarks editable when in edit mode -->
              <td>
                <template v-if="editingIndex === index">
                  <input v-model="item.remarks" class="input w-full" placeholder="Remarks" />
                </template>
                <template v-else>
                  {{ item.remarks || '-' }}
                </template>
              </td>
              <td class="text-center">
                <template v-if="editingIndex === index">
                  <input
                    type="file"
                    class="hidden"
                    :id="`attach-input-${index}`"
                    @change="onFileChange(index, $event)"
                  />
                  <button
                    class="btn btn-icon btn-sm btn-primary"
                    @click="triggerUpload(index)"
                    title="Upload File"
                  >
                    <i class="ki-duotone ki-cloud-add">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                  </button>
                </template>
                <template v-else>
                  <button
                    class="btn btn-icon btn-sm btn-outline btn-outline-primary"
                    v-if="item.attachmentDocument"
                    @click="downloadDocument(item.attachmentDocument)"
                    title="Download File"
                  >
                    <i class="ki-duotone ki-cloud-download">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                  </button>
                  <span v-else>-</span>
                </template>
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
import type { Ref } from 'vue'
import type { formTypes } from '../../types/invoiceDetail'
import { useFormatIdr, useFormatUsd } from '@/composables/currency'

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
  clearingDate: string | number | null
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

interface PaymentInformationRef {
  fetchSapStatus: () => Promise<SapDataResponse[] | null>
}

const form = inject<Ref<formTypes>>('form')

const columns = [
  'Actions',
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
  invoicePaymentDetailId?: number
}

const paymentDetails = ref<PaymentDetail[]>([])
const editingIndex = ref<number | null>(null)
const backupRow = ref<PaymentDetail | null>(null)

const paymentDetailsData = inject<Ref<PaymentDetail[]>>('paymentDetailsData')

watch(
  paymentDetails,
  (newVal) => {
    if (paymentDetailsData) {
      paymentDetailsData.value = newVal
    }
  },
  { deep: true },
)

watch(
  () => paymentDetailsData?.value,
  (newVal) => {
    if (newVal && JSON.stringify(newVal) !== JSON.stringify(paymentDetails.value)) {
      paymentDetails.value = newVal
    }
  },
  { deep: true },
)

const setPaymentDetails = () => {
  paymentDetails.value = []
}

const startEdit = (index: number) => {
  editingIndex.value = index
  backupRow.value = { ...paymentDetails.value[index] }
}

const cancelEdit = () => {
  if (editingIndex.value !== null && backupRow.value) {
    paymentDetails.value[editingIndex.value] = { ...backupRow.value }
  }
  editingIndex.value = null
  backupRow.value = null
}

const triggerUpload = (index: number) => {
  const input = document.getElementById(`attach-input-${index}`) as HTMLInputElement | null
  input?.click()
}

const onFileChange = (index: number, e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) paymentDetails.value[index].attachmentDocument = file.name
}

const saveEdit = (index: number) => {
  console.log('Saved row:', paymentDetails.value[index])
  editingIndex.value = null
  backupRow.value = null
}

const paymentInformationRef = inject<Ref<PaymentInformationRef>>('paymentInformationRef')

const hasSapSynced = inject<Ref<boolean>>('hasSapSynced', ref(false))

// Inject savedPaymentDetailsFromSession to load data from API
const savedPaymentDetailsFromSession = inject<Ref<PaymentDetail[]>>(
  'savedPaymentDetailsFromSession',
  ref([]),
)

// Watch and load saved payment details into table (show all rows)
watch(
  () => savedPaymentDetailsFromSession.value,
  (newData) => {
    if (newData && newData.length > 0) {
      // Show ALL rows from the API results
      paymentDetails.value = newData
    }
  },
  { immediate: true },
)

const handleSapSync = async () => {
  if (paymentInformationRef?.value?.fetchSapStatus) {
    try {
      const sapDataArray = await paymentInformationRef.value.fetchSapStatus()

      if (sapDataArray && sapDataArray.length > 0) {
        updatePaymentDetailsFromSap(sapDataArray)

        hasSapSynced.value = true
      } else {
      }
    } catch (error) {
      console.error('Error during SAP sync:', error)
    }
  }
}

const deleteRow = (index: number) => {
  if (confirm('Are you sure you want to delete this payment detail?')) {
    paymentDetails.value.splice(index, 1)
    paymentDetails.value.forEach((item, idx) => {
      item.no = idx + 1
    })
  }
}
const updatePaymentDetailsFromSap = (sapDataArray: SapDataResponse[]) => {
  const existingRemarks = paymentDetails.value.map((item) => item.remarks || '')

  const newPaymentDetails: PaymentDetail[] = sapDataArray.map((sapData, index) => ({
    no: index + 1,
    paymentDate: sapData.clearingDate ? formatSapDate(sapData.clearingDate) : getCurrentDate(),
    amount: (sapData.paidAmount || sapData.openAmount || sapData.invoiceAmount || 0).toString(),
    status: mapSapStatus(sapData.paymentStatus || sapData.statusOutgoing),
    bankAccount: formatBankAccount(sapData.payment?.bankKey, sapData.payment?.bankAccountNo),
    remarks: existingRemarks[index] || `SAP Invoice: ${sapData.sapInvoiceNo || 'N/A'} | Vendor: ${sapData.vendorName || 'N/A'}`,
    attachmentDocument: undefined,
  }))

  paymentDetails.value = newPaymentDetails
  console.log('Updated payment details from SAP:', newPaymentDetails)
}

const formatSapDate = (dateString: string | number) => {
  if (!dateString) return getCurrentDate()

  try {
    let date: Date

    if (typeof dateString === 'number' || /^\d{8}$/.test(dateString.toString())) {
      const dateStr = dateString.toString()
      const year = dateStr.substring(0, 4)
      const month = dateStr.substring(4, 6)
      const day = dateStr.substring(6, 8)
      date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    } else {
      date = new Date(dateString.toString())
    }

    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()

    return `${day}/${month}/${year}`
  } catch {
    return getCurrentDate()
  }
}

const getCurrentDate = () => {
  const today = new Date()
  const day = today.getDate().toString().padStart(2, '0')
  const month = (today.getMonth() + 1).toString().padStart(2, '0')
  const year = today.getFullYear()

  return `${day}/${month}/${year}`
}

const mapSapStatus = (sapStatus: string) => {
  switch (sapStatus?.toUpperCase()) {
    case 'PAID':
      return 'Paid'
    case 'PLANNED':
      return 'Plan'
    default:
      return 'Plan'
  }
}

const formatBankAccount = (bankKey: string | null, bankAccountNo: string | null) => {
  if (bankKey && bankAccountNo) {
    return `${bankKey} - ${bankAccountNo}`
  } else if (bankKey) {
    return bankKey
  } else if (bankAccountNo) {
    return bankAccountNo
  }
  return 'BRI01 - 56464564'
}

const downloadDocument = (documentName: string) => {
  console.log('Downloading document:', documentName)
}

onMounted(() => {
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

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 1px solid;
  box-shadow: none;
  font-size: 12px;
  transition: all 0.15s ease-in-out;

  &.btn-primary {
    background-color: #009ef7;
    border-color: #009ef7;
    color: #ffffff;

    &:hover {
      background-color: #0095e8;
      border-color: #0095e8;
      color: #ffffff;
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(0, 158, 247, 0.3);
    }

    &:active {
      transform: translateY(0);
      box-shadow: none;
    }
  }

  &.btn-danger {
    background-color: #f1416c;
    border-color: #f1416c;
    color: #ffffff;

    &:hover {
      background-color: #e01e5a;
      border-color: #e01e5a;
      color: #ffffff;
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(241, 65, 108, 0.3);
    }

    &:active {
      transform: translateY(0);
      box-shadow: none;
    }
  }
}
</style>

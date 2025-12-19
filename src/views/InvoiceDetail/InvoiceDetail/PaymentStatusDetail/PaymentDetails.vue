<template>
  <div class="flex flex-col gap-[24px]">
    <p class="text-lg font-semibold m-[0px]">Payment Details</p>
    <div class="flex justify-start mb-4">
      <button class="btn btn-outline btn-primary" @click="handleSapSync">
        <i class="ki-duotone ki-plus-circle"></i>
        SAP Synchronize
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
                <div class="flex gap-2 justify-center items-center">
                  <button
                    class="btn btn-sm btn-icon btn-primary action-btn"
                    @click="editingIndex === index ? saveEdit(index) : startEdit(index)"
                    :title="editingIndex === index ? 'Save' : 'Edit'"
                  >
                    <i class="ki-duotone ki-pencil fs-4"></i>
                  </button>
                  <button
                    class="btn btn-sm btn-icon btn-danger action-btn"
                    @click="editingIndex === index ? cancelEdit() : deleteRow(index)"
                    :title="editingIndex === index ? 'Cancel' : 'Delete'"
                  >
                    <i class="ki-duotone ki-cross fs-4"></i>
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
                  <UiButton icon size="sm" @click="triggerUpload(index)" aria-label="Upload">
                    <UiIcon name="cloud-upload" variant="duotone" />
                  </UiButton>
                </template>
                <template v-else>
                  <UiButton
                    icon
                    outline
                    size="sm"
                    v-if="item.attachmentDocument"
                    @click="downloadDocument(item.attachmentDocument)"
                  >
                    <UiIcon name="cloud-download" variant="duotone" />
                  </UiButton>
                  <span v-else>-</span>
                </template>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <!-- Footer actions moved to parent for alignment with Back button -->
  </div>
</template>

<script lang="ts" setup>
import { ref, inject, onMounted } from 'vue'
import type { Ref } from 'vue'
import type { formTypes } from '../../types/invoiceDetail'
import { useFormatIdr, useFormatUsd } from '@/composables/currency'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'

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
}

const paymentDetails = ref<PaymentDetail[]>([])
const editingIndex = ref<number | null>(null)
const backupRow = ref<PaymentDetail | null>(null)

const setPaymentDetails = () => {
  // Mock data for payment details
  paymentDetails.value = [
    {
      no: 1,
      paymentDate: '31.01.2025',
      amount: '300',
      status: 'Paid',
      bankAccount: 'BRI -XXX',
      remarks: '',
      attachmentDocument: 'payment_receipt_001.pdf',
    },
    {
      no: 2,
      paymentDate: '31.01.2025',
      amount: '3000',
      status: 'Plan',
      bankAccount: 'BRI -XXX',
      remarks: '',
      attachmentDocument: 'payment_receipt_002.pdf',
    },
  ]
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
  // Save the edited data (you can add validation here if needed)
  editingIndex.value = null
  backupRow.value = null
  console.log('Saved row:', paymentDetails.value[index])
}

const handleSapSync = () => {
  // Add new row to Payment Details table
  const newItem: PaymentDetail = {
    no: paymentDetails.value.length + 1,
    paymentDate: new Date().toLocaleDateString('id-ID'),
    amount: '0',
    status: 'Plan',
    bankAccount: 'BRI -XXX',
    remarks: '',
    attachmentDocument: ''
  }
  paymentDetails.value.push(newItem)
  console.log('SAP Synchronize - New payment detail added:', newItem)
}

const deleteRow = (index: number) => {
  if (confirm('Are you sure you want to delete this payment detail?')) {
    paymentDetails.value.splice(index, 1)
    // Reorder the numbers
    paymentDetails.value.forEach((item, idx) => {
      item.no = idx + 1
    })
  }
}

// Update Payment Status action is handled by parent footer for layout alignment

const downloadDocument = (documentName: string) => {
  // TODO: Replace with actual download logic from your API
  // For now, this is a placeholder that would trigger download
  console.log('Downloading document:', documentName)

  // Example implementation:
  // const link = document.createElement('a')
  // link.href = `/api/documents/${documentName}` // Replace with your actual API endpoint
  // link.download = documentName
  // link.click()
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
    background-color: #f1f3f6;
    border: 1px solid #e1e5e9;
    padding: 12px 16px;
    font-weight: 500;
    font-size: 12px;
    text-align: left;
    color: #7e8299;
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
      background-color: rgba(241, 243, 246, 0.3);
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
  background-color: #d4edda;
  color: #155724;
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

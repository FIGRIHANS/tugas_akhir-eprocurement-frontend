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
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, inject, onMounted } from 'vue'
import type { formTypes } from '../../types/invoiceAddWrapper'
import { useFormatIdr, useFormatUsd } from '@/composables/currency'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'

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

const paymentDetails = ref<PaymentDetail[]>([])

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
</style>

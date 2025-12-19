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
            type="number"
            :placeholder="item.placeholder || ''"
            @input="handleNumericInput($event, index)"
            @keypress="validateNumberInput"
          />
          <input
            v-else
            :value="item.value"
            class="input"
            disabled
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, inject, onMounted, watch } from 'vue'
import type { Ref } from 'vue'
import type { formTypes } from '../../types/invoiceDetail'
import { formatDate } from '@/composables/date-format'

interface PaymentInfoItem {
  label: string
  value: string
  editable?: boolean
  placeholder?: string
}

const form = inject<Ref<formTypes>>('form')

const paymentInfo = ref<PaymentInfoItem[]>([])

const setPaymentInfo = () => {
  if (form?.value) {
    paymentInfo.value = [
      {
        label: 'SAP Invoice No.',
        value: form.value.sapInvoiceNo || '',
        editable: true,
        placeholder: '',
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
        value: form.value.clearingDocumentNo || '',
        editable: true,
        placeholder: '',
      },
      {
        label: 'Payment Status',
        value: form.value.statusName || '-',
        editable: false,
      },
    ]
  }
}

watch(
  () => form?.value,
  () => {
    setPaymentInfo()
  },
  { deep: true, immediate: true },
)

const handleNumericInput = (event: Event, index: number) => {
  const target = event.target as HTMLInputElement
  const value = target.value

  // Remove any non-numeric characters except dots for decimals
  const numericValue = value.replace(/[^0-9.]/g, '')

  // Ensure only one decimal point
  const parts = numericValue.split('.')
  let cleanValue = parts[0]
  if (parts.length > 1) {
    cleanValue += '.' + parts.slice(1).join('')
  }

  // Update the value
  paymentInfo.value[index].value = cleanValue
  target.value = cleanValue
}

const validateNumberInput = (event: KeyboardEvent) => {
  const charCode = event.which ? event.which : event.keyCode
  // Allow numbers (48-57), decimal point (46), and backspace (8)
  if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
    event.preventDefault()
  }
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

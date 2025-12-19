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
          <input :value="item.value" class="input" disabled />
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
}

const form = inject<Ref<formTypes>>('form')

const paymentInfo = ref<PaymentInfoItem[]>([])

const setPaymentInfo = () => {
  if (form?.value) {
    paymentInfo.value = [
      {
        label: 'Invoice Posting Date',
        value: form.value.postingDate ? formatDate(form.value.postingDate) : '-',
      },
      {
        label: 'Term of Payment',
        value: form.value.paymentMethodName || '-',
      },
      {
        label: 'Estimate Payment Date',
        value: form.value.estimatedPaymentDate ? formatDate(form.value.estimatedPaymentDate) : '-',
      },
      {
        label: 'Payment Method',
        value: form.value.paymentMethodName || '-',
      },
      {
        label: 'Payment Status',
        value: form.value.statusName || '-',
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

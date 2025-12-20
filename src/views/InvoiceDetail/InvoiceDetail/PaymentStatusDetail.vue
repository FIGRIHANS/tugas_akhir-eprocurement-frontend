<template>
  <div v-if="form">
    <div class="flex gap-[24px]">
      <PaymentInformation class="flex-1" />
      <div class="flex-1 flex flex-col">
        <PaymentCalculation />
      </div>
    </div>
    <PaymentDetails class="mt-[24px]" />
  </div>
</template>

<script lang="ts" setup>
import { inject, defineAsyncComponent, type Ref } from 'vue'
import type { formTypes } from '../types/invoiceDetail'

const PaymentInformation = defineAsyncComponent(
  () => import('./PaymentStatusDetail/PaymentInformation.vue'),
)
const PaymentCalculation = defineAsyncComponent(
  () => import('./PaymentStatusDetail/PaymentCalculation.vue'),
)
const PaymentDetails = defineAsyncComponent(
  () => import('./PaymentStatusDetail/PaymentDetails.vue'),
)

// `form` diprovide sebagai Ref<formTypes> dari InvoiceDetail.vue
const form = inject<Ref<formTypes>>('form')
</script>

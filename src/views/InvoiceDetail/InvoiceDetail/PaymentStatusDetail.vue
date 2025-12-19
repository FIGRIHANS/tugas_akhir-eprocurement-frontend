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
import { inject, defineAsyncComponent } from 'vue'
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

const form = inject<formTypes>('form')

const handleSapSync = () => {
  // TODO: Implement SAP Sync logic
  console.log('SAP Synchronize clicked')
}
</script>

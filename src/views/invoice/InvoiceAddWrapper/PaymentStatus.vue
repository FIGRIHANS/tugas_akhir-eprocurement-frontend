<template>
  <div v-if="form">
    <div class="flex gap-[24px]">
      <PaymentInformation />
      <PaymentCalculation />
    </div>
    <PaymentDetails class="mt-[24px]" />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, inject, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import type { formTypes } from '../types/invoiceAddWrapper'

const PaymentInformation = defineAsyncComponent(() => import('./PaymentStatus/PaymentInformation.vue'))
const PaymentCalculation = defineAsyncComponent(
  () => import('./PaymentStatus/PaymentCalculation.vue'),
)
const PaymentDetails = defineAsyncComponent(() => import('./PaymentStatus/PaymentDetails.vue'))

const form = inject<formTypes>('form')
const route = useRoute()
const typeForm = ref<string>('')

onMounted(() => {
  typeForm.value = route.query.type?.toString().toLowerCase() || 'po'
})
</script>

<style lang="scss" scoped>
@use '../styles/invoice-information.scss';
</style>

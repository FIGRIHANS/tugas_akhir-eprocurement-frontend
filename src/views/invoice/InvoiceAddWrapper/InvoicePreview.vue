<template>
  <div class="flex gap-[24px]">
    <div class="flex flex-col gap-[24px] py-[16px] grow">
      <InvoiceView />
      <hr class="border-gray-300" />
      <InvoicePoGrView />
      <hr class="border-gray-300" />
      <AdditionalCostView />
      <hr class="border-gray-300" />
      <InvoiceCalculationView />
    </div>
    <div class="flex flex-col gap-[20px] p-[30px] bg-gray-100 rounded-xl h-full flex-1">
      <GeneralDataView />
      <hr class="border-gray-300" />
      <BankKeyView />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineAsyncComponent } from 'vue'

const InvoiceView = defineAsyncComponent(() => import('./InvoicePreview/InvoiceView.vue'))
const InvoicePoGrView = defineAsyncComponent(() => import('./InvoicePreview/InvoicePoGrView.vue'))
const AdditionalCostView = defineAsyncComponent(() => import('./InvoicePreview/AdditionalCostView.vue'))
const InvoiceCalculationView = defineAsyncComponent(() => import('./InvoicePreview/InvoiceCalculationView.vue'))
const GeneralDataView = defineAsyncComponent(() => import('./InvoicePreview/GeneralDataView.vue'))
const BankKeyView = defineAsyncComponent(() => import('./InvoicePreview/BankKeyView.vue'))
</script>

<style lang="scss" scoped>
@use '../styles/invoice-preview.scss';
</style>

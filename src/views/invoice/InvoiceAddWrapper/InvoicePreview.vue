<template>
  <div class="flex flex-col gap-[24px]">
    <div class="flex flex-1 gap-[24px]">
      <div class="flex flex-col gap-[24px] grow">
        <InvoiceView />
        <hr class="border-gray-300" />
        <BankKeyView />
      </div>
      <div class="flex flex-col gap-[20px] p-[30px] bg-gray-100 rounded-xl h-full flex-1">
        <GeneralDataView />
      </div>
    </div>
    <hr class="border-gray-300" />
    <InvoiceCalculationView />
    <hr class="border-gray-300" />
    <InvoicePoGrView />
    <hr class="border-gray-300" />
    <AdditionalCostView />
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

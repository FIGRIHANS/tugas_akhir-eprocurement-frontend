<template>
  <div>
    <div class="flex gap-[24px]">
      <HeaderDocument />
      <InvoiceCalculation />
    </div>
    <InvoicePoGr class="mt-[24px]" />
    <AdditionalCost class="mt-[24px]" />
  </div>
</template>

<script lang="ts" setup>
import { defineAsyncComponent } from 'vue'

const HeaderDocument = defineAsyncComponent(() => import('./InvoiceInformation/HeaderDocument.vue'))
const InvoiceCalculation = defineAsyncComponent(() => import('./InvoiceInformation/InvoiceCalculation.vue'))
const InvoicePoGr = defineAsyncComponent(() => import('./InvoiceInformation/InvoicePoGr.vue'))
const AdditionalCost = defineAsyncComponent(() => import('./InvoiceInformation/AdditionalCost.vue'))
</script>

<style lang="scss" scoped>
@use '../styles/invoice-information.scss';
</style>

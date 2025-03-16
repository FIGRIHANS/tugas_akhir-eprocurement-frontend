<template>
  <div v-if="form">
    <div class="flex gap-[24px]">
      <HeaderDocument />
      <InvoiceCalculation />
    </div>
    <InvoicePoGr class="mt-[24px]" />
    <AdditionalCost v-if="!form.invoiceDp && !form.withDp" class="mt-[24px]" />
  </div>
</template>

<script lang="ts" setup>
import { inject, defineAsyncComponent } from 'vue'
import type { formTypes } from '../types/invoiceAddWrapper'

const HeaderDocument = defineAsyncComponent(() => import('./InvoiceInformation/HeaderDocument.vue'))
const InvoiceCalculation = defineAsyncComponent(() => import('./InvoiceInformation/InvoiceCalculation.vue'))
const InvoicePoGr = defineAsyncComponent(() => import('./InvoiceInformation/InvoicePoGr.vue'))
const AdditionalCost = defineAsyncComponent(() => import('./InvoiceInformation/AdditionalCost.vue'))

const form = inject<formTypes>('form')
</script>

<style lang="scss" scoped>
@use '../styles/invoice-information.scss';
</style>

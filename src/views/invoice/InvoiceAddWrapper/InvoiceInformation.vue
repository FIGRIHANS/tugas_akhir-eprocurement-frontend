<template>
  <div v-if="form">
    <div class="flex gap-[24px]">
      <HeaderDocument />
      <InvoiceCalculation />
    </div>
    <InvoicePoGr v-if="checkPo()" class="mt-[24px]" />
    <InvoiceItem v-if="checkNonPo()" class="mt-[24px]" />
    <AdditionalCost v-if="form.invoiceDp === '9011' && !checkNonPo()" class="mt-[24px]" />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, inject, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import type { formTypes } from '../types/invoiceAddWrapper'

const HeaderDocument = defineAsyncComponent(() => import('./InvoiceInformation/HeaderDocument.vue'))
const InvoiceCalculation = defineAsyncComponent(() => import('./InvoiceInformation/InvoiceCalculation.vue'))
const InvoicePoGr = defineAsyncComponent(() => import('./InvoiceInformation/InvoicePoGr.vue'))
const InvoiceItem = defineAsyncComponent(() => import('./InvoiceInformation/InvoiceItem.vue'))
const AdditionalCost = defineAsyncComponent(() => import('./InvoiceInformation/AdditionalCost.vue'))

const form = inject<formTypes>('form')
const route = useRoute()
const typeForm = ref<string>('')

const checkPo = () => {
  return typeForm.value === 'po'
}

const checkNonPo = () => {
  return typeForm.value === 'nonpo'
}

onMounted(() => {
  typeForm.value = route.query.type?.toString().toLowerCase() || 'po'
})
</script>

<style lang="scss" scoped>
@use '../styles/invoice-information.scss';
</style>

<template>
  <div v-if="form" class="flex flex-col gap-[24px]">
    <div class="flex flex-1 gap-[24px]">
      <div class="flex flex-col gap-[24px] w-[60%]">
        <InvoiceView />
        <hr class="border-gray-300" />
        <InvoiceCalculationView />
      </div>
      <div class="flex flex-col gap-[20px] p-[24px] bg-gray-100 rounded-xl h-full flex-1">
        <GeneralDataView />
        <hr class="border-gray-300" />
        <BankKeyView />
      </div>
    </div>
    <hr class="border-gray-300" />
    <InvoicePoGrView v-if="checkPo()" />
    <InvoiceItemView v-if="checkNonPo()" />
    <hr class="border-gray-300" />
    <AdditionalCostView v-if="!form.invoiceDp && !form.withDp && !checkNonPo()" />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, inject, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import type { formTypes } from '../types/invoiceAddWrapper'

const InvoiceView = defineAsyncComponent(() => import('./InvoicePreview/InvoiceView.vue'))
const InvoicePoGrView = defineAsyncComponent(() => import('./InvoicePreview/InvoicePoGrView.vue'))
const InvoiceItemView = defineAsyncComponent(() => import('./InvoicePreview/InvoiceItemView.vue'))
const AdditionalCostView = defineAsyncComponent(() => import('./InvoicePreview/AdditionalCostView.vue'))
const InvoiceCalculationView = defineAsyncComponent(() => import('./InvoicePreview/InvoiceCalculationView.vue'))
const GeneralDataView = defineAsyncComponent(() => import('./InvoicePreview/GeneralDataView.vue'))
const BankKeyView = defineAsyncComponent(() => import('./InvoicePreview/BankKeyView.vue'))

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
@use '../styles/invoice-preview.scss';
</style>

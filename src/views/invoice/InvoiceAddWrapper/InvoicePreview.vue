<template>
  <div v-if="form" class="flex flex-col gap-[24px]">
    <div class="flex flex-1 gap-[24px]">
      <div class="flex flex-col gap-[24px] w-[60%]">
        <InvoiceView />
        <hr class="border-gray-300" />
        <InvoiceCalculationView />
      </div>
      <div class="flex flex-col gap-[20px] p-[24px] bg-gray-100 rounded-xl flex-1">
        <GeneralDataView />
        <hr class="border-gray-300" />
        <BankKeyView />
        <hr v-if="checkIsNonPo()" class="border-gray-300" />
        <OneTimePayment v-if="checkIsNonPo()" />
      </div>
    </div>
    <hr class="border-gray-300" />
    <InvoicePoGrView v-if="checkPo()" />
    <InvoiceItemView v-if="checkIsNonPo()" />
    <hr class="border-gray-300" />
    <AdditionalCostView v-if="(checkIsWithoutDp() || checkPoWithDp()) && !checkIsNonPo()" />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, inject, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import type { formTypes } from '../types/invoiceAddWrapper'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'

const InvoiceView = defineAsyncComponent(() => import('./InvoicePreview/InvoiceView.vue'))
const InvoicePoGrView = defineAsyncComponent(() => import('./InvoicePreview/InvoicePoGrView.vue'))
const InvoiceItemView = defineAsyncComponent(() => import('./InvoicePreview/InvoiceItemView.vue'))
const AdditionalCostView = defineAsyncComponent(
  () => import('./InvoicePreview/AdditionalCostView.vue'),
)
const InvoiceCalculationView = defineAsyncComponent(
  () => import('./InvoicePreview/InvoiceCalculationView.vue'),
)
const GeneralDataView = defineAsyncComponent(() => import('./InvoicePreview/GeneralDataView.vue'))
const BankKeyView = defineAsyncComponent(() => import('./InvoicePreview/BankKeyView.vue'))
const OneTimePayment = defineAsyncComponent(() => import('./InvoicePreview/OneTimePayment.vue'))

const invoiceMasterApi = useInvoiceMasterDataStore()
const form = inject<formTypes>('form')
const route = useRoute()
const typeForm = ref<string>('')

const checkPo = () => {
  return typeForm.value === 'po' || typeForm.value === 'po-view'
}

const checkIsNonPo = () => {
  return typeForm.value === 'nonpo'
}

const checkIsWithoutDp = () => {
  return form.invoiceDp === '9011'
}

const checkPoWithDp = () => {
  return form.invoiceDp === '9013'
}

const checkIsPoPib = () => {
  return form.invoiceType === '902'
}

watch(
  () => form,
  () => {
    if (form) {
      if (form.companyCode) invoiceMasterApi.getActivity(form.companyCode)
    }
  },
  {
    deep: true,
    immediate: true
  },
)

onMounted(() => {
  typeForm.value = route.query.type?.toString().toLowerCase() || 'po'

  if (route.query.type === 'po-view') {
    invoiceMasterApi.getDpTypes()
    invoiceMasterApi.getCompanyCode()
  }

  if (route.query.type === 'non-po-view') {
    invoiceMasterApi.getDpTypes()
    invoiceMasterApi.getCompanyCode()
    typeForm.value = 'nonpo'
  }
})
</script>

<style lang="scss" scoped>
@use '../styles/invoice-preview.scss';
</style>

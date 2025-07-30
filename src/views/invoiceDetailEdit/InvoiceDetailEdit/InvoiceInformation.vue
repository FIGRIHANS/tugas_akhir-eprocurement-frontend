<template>
  <div v-if="form">
    <div class="flex gap-[24px] max-h-[553px]">
      <HeaderDocument />
      <InvoiceCalculation />
    </div>
    <!-- <InvoicePoGr v-if="checkPo()" class="mt-[24px]" /> -->
    <InvoicePoGr  class="mt-[24px]" />
    <AdditionalCost v-if="!checkNonPo()" class="mt-[24px]" />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, inject, defineAsyncComponent, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import type { formTypes } from '../types/invoiceDetailEdit'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'

const HeaderDocument = defineAsyncComponent(() => import('./InvoiceInformation/HeaderDocument.vue'))
const InvoiceCalculation = defineAsyncComponent(() => import('./InvoiceInformation/InvoiceCalculation.vue'))
const InvoicePoGr = defineAsyncComponent(() => import('./InvoiceInformation/InvoicePoGr.vue'))
const AdditionalCost = defineAsyncComponent(() => import('./InvoiceInformation/AdditionalCost.vue'))

const invoiceMasterApi = useInvoiceMasterDataStore()
const form = inject<Ref<formTypes>>('form')
const route = useRoute()
const typeForm = ref<string>('')

// const checkPo = () => {
//   return form?.value.invoiceTypeCode === 901
// }

const checkNonPo = () => {
  return typeForm.value === 'nonpo'
}

onMounted(() => {
  typeForm.value = route.query.type?.toString().toLowerCase() || 'po'
  invoiceMasterApi.getPaymentMethod()
  invoiceMasterApi.getProfitCenter()
  invoiceMasterApi.getWhtType()
  invoiceMasterApi.getCostCenter(form?.value.companyCode || '')
  invoiceMasterApi.getActivity(form?.value.companyCode || '')
})
</script>

<style lang="scss" scoped>
@use '../styles/invoice-information.scss';
</style>

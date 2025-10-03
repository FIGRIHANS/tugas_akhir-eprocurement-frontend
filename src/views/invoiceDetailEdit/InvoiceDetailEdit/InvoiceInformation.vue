<template>
  <div v-if="form">
    <div class="flex gap-[24px] max-h-[553px]">
      <HeaderDocument />
      <InvoiceCalculation />
    </div>
    <InvoicePoGr v-if="!checkIsNonPo()" class="mt-[24px]" />
    <AdditionalCost v-if="!checkIsNonPo() && (checkIsWithoutDp() || checkIsPoPib())" class="mt-[24px]" />
    <InvoiceItem v-if="checkIsNonPo()" class="mt-[24px]" />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, inject, defineAsyncComponent, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import type { formTypes } from '../types/invoiceDetailEdit'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'

const HeaderDocument = defineAsyncComponent(() => import('./InvoiceInformation/HeaderDocument.vue'))
const InvoiceCalculation = defineAsyncComponent(
  () => import('./InvoiceInformation/InvoiceCalculation.vue'),
)
const InvoicePoGr = defineAsyncComponent(() => import('./InvoiceInformation/InvoicePoGr.vue'))
const AdditionalCost = defineAsyncComponent(() => import('./InvoiceInformation/AdditionalCost.vue'))
const InvoiceItem = defineAsyncComponent(() => import('./InvoiceInformation/InvoiceItem.vue'))

const invoiceMasterApi = useInvoiceMasterDataStore()
const form = inject<Ref<formTypes>>('form')
const route = useRoute()
const typeForm = ref<string>('')

const checkIsWithoutDp = () => {
  return form.value.invoiceDPCode === 9011
}

const checkIsPoPib = () => {
  return form.value.invoiceTypeCode === 902
}

const checkIsNonPo = () => {
  return route.query.invoiceType === 'no_po'
}

onMounted(() => {
  typeForm.value = route.query.type?.toString().toLowerCase() || 'po'
  invoiceMasterApi.getPaymentMethod()
  invoiceMasterApi.getProfitCenter()
  invoiceMasterApi.getWhtType()
  invoiceMasterApi.getCostCenter(form?.value.companyCode || '')
  invoiceMasterApi.getMatrixApproval(form.value.invoiceTypeCode.toString() || '', form.value.companyCode || '')
  if (form.value.companyCode) invoiceMasterApi.getActivity(form.value.companyCode || '')
})
</script>

<style lang="scss" scoped>
@use '../styles/invoice-information.scss';
</style>

<template>
  <div>
    <Breadcrumb title="Invoice Verification" :routes="routes" />
    <hr class="-mx-[24px] mb-[24px]" />
    <TabInvoice :active-tab="tabNow" @change-tab="setTab" />
    <PendingVerification />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, defineAsyncComponent } from 'vue'
import type { routeTypes } from '@/core/type/components/breadcrumb'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import TabInvoice from './InvoiceVerification/TabInvoice.vue'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'

const PendingVerification = defineAsyncComponent(() => import('./InvoiceVerification/PendingVerification.vue'))

const invoiceMasterApi = useInvoiceMasterDataStore()
const tabNow = ref<string>('list')

const routes = ref<routeTypes[]>([
  {
    name: 'Invoice Verification',
    to: '/invoice/verification'
  }
])

const setTab = (value: string) => {
  tabNow.value = value
}

onMounted(() => {
  invoiceMasterApi.getInvoicePoType()
  invoiceMasterApi.getCompanyCode()
})
</script>

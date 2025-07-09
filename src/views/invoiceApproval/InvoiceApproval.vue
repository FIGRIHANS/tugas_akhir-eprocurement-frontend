<template>
  <div>
    <Breadcrumb title="Invoice Approval" :routes="routes" />
    <hr class="-mx-[24px] mb-[24px]" />
    <TabInvoice />
    <PendingApproval />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, defineAsyncComponent } from 'vue'
import { type routeTypes } from '@/core/type/components/breadcrumb'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import TabInvoice from './invoiceApproval/TabInvoice.vue'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'

const PendingApproval = defineAsyncComponent(() => import('./invoiceApproval/PendingApproval.vue'))

const invoiceMasterApi = useInvoiceMasterDataStore()
const routes = ref<routeTypes[]>([
  {
    name: 'Invoice Approval',
    to: '/invoice/approval'
  }
])

onMounted(() => {
  invoiceMasterApi.getInvoicePoType()
  invoiceMasterApi.getCompanyCode()
})
</script>

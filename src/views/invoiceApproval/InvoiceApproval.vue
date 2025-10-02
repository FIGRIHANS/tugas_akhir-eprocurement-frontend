<template>
  <div>
    <Breadcrumb title="Invoice Approval" :routes="routes" />
    <hr class="-mx-[24px] mb-[24px]" />
    <TabInvoice :active-tab="tabNow" @change-tab="setTab" />
    <PendingApproval v-if="currentRouteName === 'invoiceApproval'" />
    <PendingApprovalNonPo v-else />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, defineAsyncComponent, computed } from 'vue'
import { type routeTypes } from '@/core/type/components/breadcrumb'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import TabInvoice from './invoiceApproval/TabInvoice.vue'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'
import { useRoute } from 'vue-router'

const route = useRoute()

const currentRouteName = computed(() => {
  return route.name
})

const PendingApproval = defineAsyncComponent(() => import('./invoiceApproval/PendingApproval.vue'))
const PendingApprovalNonPo = defineAsyncComponent(
  () => import('./invoiceApproval/PendingApprovalNonPo.vue'),
)

const invoiceMasterApi = useInvoiceMasterDataStore()

const tabNow = ref<string>('list')

const routes = ref<routeTypes[]>([
  {
    name: 'Invoice Approval',
    to: '/invoice/approval',
  },
])

const setTab = (value: string) => {
  tabNow.value = value
}

onMounted(() => {
  if (currentRouteName.value === 'invoiceApproval') {
    invoiceMasterApi.getInvoicePoType()
  } else {
    invoiceMasterApi.getInvoiceNonPoType()
  }
  invoiceMasterApi.getCompanyCode()
})
</script>

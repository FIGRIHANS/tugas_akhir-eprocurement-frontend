<template>
  <div>
    <Breadcrumb title="Invoice Approval" :routes="routes" />
    <StepperStatus active-name="Approval" />
    <hr class="-mx-[24px] mb-[24px]" />
    <TabInvoice />
    <PendingApproval />
  </div>
</template>

<script lang="ts" setup>
import { ref, defineAsyncComponent } from 'vue'
import { type routeTypes } from '@/core/type/components/breadcrumb'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import StepperStatus from '../../components/stepperStatus/StepperStatus.vue'
import TabInvoice from './invoiceApproval/TabInvoice.vue'

const PendingApproval = defineAsyncComponent(() => import('./invoiceApproval/PendingApproval.vue'))

const routes = ref<routeTypes[]>([
  {
    name: 'Invoice Approval',
    to: '/invoice/approval'
  }
])
</script>

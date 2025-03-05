<template>
  <div>
    <Breadcrumb title="Invoice Approval" :routes="routes" />
    <StepperStatus active-name="Approval" />
    <hr class="-mx-[24px] mb-[24px]" />
    <TabInvoice :active-tab="tabNow" @change-tab="setTab" />
    <Transition mode="out-in">
      <component :is="contentComponent" />
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, defineAsyncComponent, type Component } from 'vue'
import { type routeTypes } from '@/core/type/components/breadcrumb'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import StepperStatus from '../../components/stepperStatus/StepperStatus.vue'
import TabInvoice from './invoiceApproval/TabInvoice.vue'

const PendingApproval = defineAsyncComponent(() => import('./invoiceApproval/PendingApproval.vue'))
const ApprovalHistory = defineAsyncComponent(() => import('./invoiceApproval/ApprovalHistory.vue'))

const tabNow = ref<string>('pending')

const routes = ref<routeTypes[]>([
  {
    name: 'Invoice Approval',
    to: '/invoice/approval'
  }
])

const contentComponent = computed(() => {
  const components = {
    pending: PendingApproval,
    approval: ApprovalHistory
  } as { [key: string]: Component }

  return components[tabNow.value]
})

const setTab = (value: string) => {
  tabNow.value = value
}
</script>

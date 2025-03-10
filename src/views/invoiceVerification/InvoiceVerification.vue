<template>
  <div>
    <Breadcrumb title="Invoice Verification" :routes="routes" />
    <StepperStatus active-name="Verification" />
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
import TabInvoice from './InvoiceVerification/TabInvoice.vue'

const PendingVerification = defineAsyncComponent(() => import('./InvoiceVerification/PendingVerification.vue'))
const VerificationHistory = defineAsyncComponent(() => import('./InvoiceVerification/VerificationHistory.vue'))

const tabNow = ref<string>('pending')

const routes = ref<routeTypes[]>([
  {
    name: 'Invoice Verification',
    to: '/invoice/verification'
  }
])

const contentComponent = computed(() => {
  const components = {
    pending: PendingVerification,
    verification: VerificationHistory
  } as { [key: string]: Component }

  return components[tabNow.value]
})

const setTab = (value: string) => {
  tabNow.value = value
}
</script>

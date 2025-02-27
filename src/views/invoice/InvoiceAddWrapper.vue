<template>
  <div>
    <Breadcrumb title="Add Invoice" :routes="routes" />
    <StepperStatus />
    <TabInvoice :active-tab="tabNow" @change-tab="setTab" />
    <div class="p-[24px]">
      <Transition mode="out-in">
        <component :is="contentComponent" />
      </Transition>
      <div class="flex justify-between items-center gap-[8px] mt-[24px]">
        <button class="btn btn-outline btn-primary">
          Save as Draft
          <i class="ki-duotone ki-bookmark"></i>
        </button>
        <button class="btn btn-primary">
          Lanjut
          <i class="ki-duotone ki-black-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, type Component } from 'vue'
import { type routeTypes } from '@/core/type/components/breadcrumb'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import StepperStatus from './InvoiceAddWrapper/StepperStatus.vue'
import InvoiceData from './InvoiceAddWrapper/InvoiceData.vue'
import InvoiceInformation from './InvoiceAddWrapper/InvoiceInformation.vue'
import TabInvoice from './InvoiceAddWrapper/TabInvoice.vue'

const tabNow = ref<string>('data')

const routes = ref<routeTypes[]>([
  {
    name: 'E-invoice',
    to: '/invoice'
  },
  {
    name: 'Add E-invoice',
    to: '/invoice/add'
  }
])

const contentComponent = computed(() => {
  const components = {
    data: InvoiceData,
    information: InvoiceInformation
  } as { [key: string]: Component }

  return components[tabNow.value]
})

const setTab = (value: string) => {
  tabNow.value = value
}
</script>

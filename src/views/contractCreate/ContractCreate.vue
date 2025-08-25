<template>
  <div>
    <Breadcrumb title="Create Contract Request" :routes="routes" />

    <div class="border rounded-md p-[24px] flex justify-center">
      <!-- Stepper aktif sesuai query ?status= -->
      <StepperStatusContract activeName="Create Contract Request" />
    </div>

    <TabContract :activeTab="activeTab" class="mt-[24px]" />

    <Transition mode="out-in">
      <component :is="contentComponent" />
    </Transition>

    <div class="flex align-items-center justify-between gap-[8px] mt-[24px]">
      <button
        class="btn btn-outline btn-primary"
        :disabled="activeTab === 'header'"
        @click="goBack"
      >
        <i class="ki-filled ki-arrow-left"></i>
        Back
      </button>
      <button class="btn btn-primary" @click="goNext">
        {{ activeTab === 'document' ? 'Publish Contract Request' : 'Next' }}
        <i v-if="activeTab !== 'document'" class="ki-filled ki-black-right"></i>
        <i v-else class="ki-duotone ki-paper-plane"></i>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, provide, defineAsyncComponent, type Component } from 'vue'
import { KTModal } from '@/metronic/core'
import StepperStatusContract from '@/components/stepperStatusContract/StepperStatusContract.vue'
import TabContract from '@/components/contract/TabContract.vue'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import type { routeTypes } from '@/core/type/components/breadcrumb'
import type { FormTypes } from './types/contractCreate'

const HeaderInformation = defineAsyncComponent(
  () => import('./ContractCreate/HeaderInformation.vue'),
)
const MaterialServices = defineAsyncComponent(() => import('./ContractCreate/MaterialServices.vue'))
const DocumentInformation = defineAsyncComponent(
  () => import('./ContractCreate/DocumentInformation.vue'),
)

/* ===== Tabs ===== */
const activeTab = ref<string>('header')
const tabList = ['header', 'material', 'document']

/* ===== Breadcrumb ===== */
const routes = ref<routeTypes[]>([{ name: 'Create Contract Request', to: '/contract/create' }])

/* ===== Form (provide ke child) ===== */
const form = reactive<FormTypes>({
  title: '',
  contractOverview: '',
  language: '',
  bindingType: null,
  supplier: '',
  totalAmount: '',
  commodity: '',
  department: '',
  agrementType: '',
  agreementDate: '',
  costType: '',
  relationType: '',
  riskAllocation: '',
  effectiveDate: '',
  expirationDate: '',
  noticePeriod: '',
  contractReference: '',
  tenderIdReference: '',
})
provide('form', form)

/* ===== Dynamic content per tab ===== */
const contentComponent = computed<Component>(() => {
  const map: Record<string, Component> = {
    header: HeaderInformation,
    material: MaterialServices,
    document: DocumentInformation,
  }
  return map[activeTab.value]
})

/* ===== Nav actions ===== */
const goNext = () => {
  if (activeTab.value === 'timeline') {
    const idModal = document.querySelector('#success_create_tender_modal')
    const modal = KTModal.getInstance(idModal as HTMLElement)
    modal.show()
  } else {
    const idx = tabList.indexOf(activeTab.value as (typeof tabList)[number])
    if (idx !== -1 && idx < tabList.length - 1) activeTab.value = tabList[idx + 1]
  }
}
const goBack = () => {
  const idx = tabList.indexOf(activeTab.value as (typeof tabList)[number])
  if (idx > 0) activeTab.value = tabList[idx - 1]
}
</script>

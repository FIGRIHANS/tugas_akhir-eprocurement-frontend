<template>
  <div>
    <Breadcrumb title="Create Tender Request" :routes="routes" />
    <div class="border rounded-md p-[24px] flex justify-center">
      <StepperStatusTender activeName="Create Tender Request" />
    </div>
    <TabTender activeTab="activeTab" class="mt-[24px]" />
    <Transition mode="out-in">
      <component :is="contentComponent" />
    </Transition>
    <div class="flex align-items-center justify-between gap-[8px] mt-[24px]">
      <button class="btn btn-outline btn-primary" :disabled="activeTab === 'purchase'">
        <i class="ki-filled ki-arrow-left"></i>
        Back
      </button>
      <button class="btn btn-primary">
        Next
        <i class="ki-filled ki-black-right"></i>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, provide, defineAsyncComponent, type Component } from 'vue'
import StepperStatusTender from '@/components/stepperStatusTender/StepperStatusTender.vue'
import TabTender from '@/components/tender/TabTender.vue'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import type { routeTypes } from '@/core/type/components/breadcrumb'
import type { FormTypes } from './types/tenderCreate'

const PurchaseRequisitionList = defineAsyncComponent(() => import('./TenderCreate/PurchaseRequisitionList.vue'))

const routes = ref<routeTypes[]>([
  {
    name: 'Create Tender Request',
    to: '/tender/create'
  }
])

const activeTab = ref<string>('purchase')
const form = reactive<FormTypes>({
  tenderId: '',
  tenderStatus: '',
  pic: '',
  purchaseRequisitionScenario: '',
  evaluationObject: '',
  tenderPeriod: '',
  remarks: ''
})

const contentComponent = computed(() => {
  const components = {
    purchase: PurchaseRequisitionList
  } as { [key: string]: Component }

  return components[activeTab.value]
})

provide('form', form)
</script>
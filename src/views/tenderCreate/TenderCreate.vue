<template>
  <div>
    <Breadcrumb title="Create Tender Request" :routes="routes" />
    <div class="border rounded-md p-[24px] flex justify-center">
      <StepperStatusTender role="admin" activeName="Create Tender Request" />
    </div>
    <TabTender :activeTab="activeTab" class="mt-[24px]" />
    <Transition mode="out-in">
      <component
        :is="contentComponent"
        :activeTab="activeTabAdmin"
        :activeTabTimeline="activeTabBilling"
        @setTab="setTab"
        @setTabTimeline="setTabTimeline"
      />
    </Transition>
    <div class="flex align-items-center justify-between gap-[8px] mt-[24px]">
      <button
        class="btn btn-outline btn-primary"
        :disabled="activeTab === 'purchase'"
        @click="goBack"
      >
        <i class="ki-filled ki-arrow-left"></i>
        Back
      </button>
      <button class="btn btn-primary" @click="goNext">
        {{
          activeTab === 'vendor'
            ? 'Invite and Next'
            : activeTab === 'timeline'
              ? 'Publish Tender Request'
              : 'Next'
        }}
        <i v-if="activeTab !== 'timeline'" class="ki-filled ki-black-right"></i>
        <i v-else class="ki-duotone ki-paper-plane"></i>
      </button>
    </div>
    <SuccessCreate />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, provide, defineAsyncComponent, type Component } from 'vue'
import StepperStatusTender from '@/components/stepperStatusTender/StepperStatusTender.vue'
import TabTender from '@/components/tender/TabTender.vue'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import { KTModal } from '@/metronic/core'
import type { routeTypes } from '@/core/type/components/breadcrumb'
import type { FormTypes } from './types/tenderCreate'

const PurchaseRequisitionList = defineAsyncComponent(
  () => import('./TenderCreate/PurchaseRequisitionList.vue'),
)
const VendorList = defineAsyncComponent(() => import('./TenderCreate/VendorList.vue'))
const AdministrativeDocument = defineAsyncComponent(
  () => import('./TenderCreate/AdministrativeDocument.vue'),
)
const TenderBilling = defineAsyncComponent(() => import('./TenderCreate/TenderBilling.vue'))
const SuccessCreate = defineAsyncComponent(() => import('./TenderCreate/SuccessCreate.vue'))

const routes = ref<routeTypes[]>([
  {
    name: 'Create Tender Request',
    to: '/tender/create',
  },
])

const activeTab = ref<string>('purchase')
const activeTabAdmin = ref<string>('automatic')
const activeTabBilling = ref<string>('automatic')
const tabList = reactive<string[]>(['purchase', 'vendor', 'admin', 'timeline'])
const form = reactive<FormTypes>({
  tenderId: '#',
  tenderStatus: 'Created',
  pic: '',
  purchaseRequisitionScenario: '',
  evaluationObject: '',
  tenderPeriod: '',
  remarks: '',
  requisitionList: [],
  vendorList: [
    {
      id: '1',
      status: 'Open',
      vendorCode: '1060',
      rank: '1',
      vendorName: 'PT Walldorf Grosshandel Tbk',
      totalScore: '78',
      productQuality: '80',
      leadTimeSupply: '90',
      afterSalesWarranty: '70',
      orderAbsorption: '80',
      totalPo: '1000',
      yearlySpanding: '100,000',
      currency: 'USD',
      existingContract: '30',
      isSelected: false,
    },
  ],
  tenderStartDate: '',
  tenderEndDate: '',
  tenderMethod: '',
  automaticCriteria: [],
  manualCriteria: [],
  automaticTimeline: [],
  manualTimeline: [],
  agreePersonInCharge: false,
})

const contentComponent = computed(() => {
  const components = {
    purchase: PurchaseRequisitionList,
    vendor: VendorList,
    admin: AdministrativeDocument,
    timeline: TenderBilling,
  } as { [key: string]: Component }
  return components[activeTab.value]
})

const goNext = () => {
  const getIndex = tabList.findIndex((item) => item === activeTab.value)
  if (getIndex !== -1) {
    if (getIndex !== tabList.length - 1) {
      activeTab.value = tabList[getIndex + 1]
    } else {
      const idModal = document.querySelector('#success_create_tender_modal')
      const modal = KTModal.getInstance(idModal as HTMLElement)
      modal.show()
    }
  }
}

const goBack = () => {
  const getIndex = tabList.findIndex((item) => item === activeTab.value)
  if (getIndex !== -1) {
    activeTab.value = tabList[getIndex - 1]
  }
}

const setTab = (tab: string) => {
  activeTabAdmin.value = tab
}

const setTabTimeline = (tab: string) => {
  activeTabBilling.value = tab
}

provide('form', form)
</script>

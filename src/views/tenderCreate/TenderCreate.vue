<template>
  <div>
    <Breadcrumb title="Create Tender Request" :routes="routes" />
    <div class="border rounded-md p-[24px] flex justify-center">
      <StepperStatusTender activeName="Create Tender Request" />
    </div>
    <TabTender :activeTab="activeTab" class="mt-[24px]" />
    <Transition mode="out-in">
      <component :is="contentComponent" />
    </Transition>
    <div class="flex align-items-center justify-between gap-[8px] mt-[24px]">
      <button class="btn btn-outline btn-primary" :disabled="activeTab === 'purchase'" @click="goBack">
        <i class="ki-filled ki-arrow-left"></i>
        Back
      </button>
      <button class="btn btn-primary" @click="goNext">
        {{ activeTab === 'vendor' ? 'Invite and Next' : 'Next' }}
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
const VendorList = defineAsyncComponent(() => import('./TenderCreate/VendorList.vue'))
const AdministrativeDocument = defineAsyncComponent(() => import('./TenderCreate/AdministrativeDocument.vue'))

const routes = ref<routeTypes[]>([
  {
    name: 'Create Tender Request',
    to: '/tender/create'
  }
])

const activeTab = ref<string>('purchase')
const tabList = reactive<string[]>([
  'purchase',
  'vendor',
  'admin',
  'timeline'
])
const form = reactive<FormTypes>({
  tenderId: '',
  tenderStatus: '',
  pic: '',
  purchaseRequisitionScenario: '',
  evaluationObject: '',
  tenderPeriod: '',
  remarks: '',
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
      isSelected: false
    },
    // {
    //   id: '2',
    //   status: 'Open',
    //   vendorCode: '1060',
    //   rank: '3',
    //   vendorName: 'PT Walldorf Grosshandel Tbk',
    //   totalScore: '78',
    //   productQuality: '80',
    //   leadTimeSupply: '90',
    //   afterSalesWarranty: '70',
    //   orderAbsorption: '80',
    //   totalPo: '1000',
    //   isSelected: false
    // },
    // {
    //   id: '3',
    //   status: 'Open',
    //   vendorCode: '1060',
    //   rank: '4',
    //   vendorName: 'PT Walldorf Grosshandel Tbk',
    //   totalScore: '78',
    //   productQuality: '80',
    //   leadTimeSupply: '90',
    //   afterSalesWarranty: '70',
    //   orderAbsorption: '80',
    //   totalPo: '1000',
    //   isSelected: false
    // }
  ],
  tenderStartDate: '',
  tenderEndDate: '',
  tenderMethod: ''
})

const contentComponent = computed(() => {
  const components = {
    purchase: PurchaseRequisitionList,
    vendor: VendorList,
    admin: AdministrativeDocument
  } as { [key: string]: Component }

  return components[activeTab.value]
})

const goNext = () => {
  const getIndex = tabList.findIndex((item) => item === activeTab.value)
  if (getIndex !== -1) {
    if (getIndex !== tabList.length - 1) {
      activeTab.value = tabList[getIndex + 1]
    }
  }
}

const goBack = () => {
  const getIndex = tabList.findIndex((item) => item === activeTab.value)
  if (getIndex !== -1) {
    activeTab.value = tabList[getIndex - 1]
  }
}

provide('form', form)
</script>
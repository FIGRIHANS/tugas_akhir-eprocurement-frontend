<template>
  <div>
    <Breadcrumb title="Create Tender Request" :routes="routes" />

    <div class="border rounded-md p-[24px] flex justify-center">
      <!-- Stepper aktif sesuai query ?status= -->
      <StepperStatusTender :activeName="activeStepName" />
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
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, provide, defineAsyncComponent, type Component, watch } from 'vue'
import { useRoute } from 'vue-router'
import StepperStatusTender from '@/components/stepperStatusTender/StepperStatusTender.vue'
import TabTender from '@/components/tender/TabTender.vue'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import type { routeTypes } from '@/core/type/components/breadcrumb'
import type { FormTypes } from './types/tenderCreate'

/* ===== Lazy components ===== */
const PurchaseRequisitionList = defineAsyncComponent(
  () => import('./TenderCreate/PurchaseRequisitionList.vue'),
)
const VendorList = defineAsyncComponent(() => import('./TenderCreate/VendorList.vue'))
const AdministrativeDocument = defineAsyncComponent(
  () => import('./TenderCreate/AdministrativeDocument.vue'),
)
const TenderBilling = defineAsyncComponent(() => import('./TenderCreate/TenderBilling.vue'))

/* ===== Routing ===== */
const route = useRoute()

/* ===== Breadcrumb ===== */
const routes = ref<routeTypes[]>([{ name: 'Create Tender Request', to: '/tender/create' }])

/* ===== Tabs ===== */
const activeTab = ref<string>('purchase')
const activeTabAdmin = ref<string>('automatic')
const activeTabBilling = ref<string>('automatic')
const tabList = ['purchase', 'vendor', 'admin', 'timeline'] as const

/* ===== Form (provide ke child) ===== */
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
      isSelected: false,
      yearlySpanding: '',
      currency: '',
      existingContract: '',
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
  requisitionList: [],
})
provide('form', form)

/* ===== Dynamic content per tab ===== */
const contentComponent = computed<Component>(() => {
  const map: Record<string, Component> = {
    purchase: PurchaseRequisitionList,
    vendor: VendorList,
    admin: AdministrativeDocument,
    timeline: TenderBilling,
  }
  return map[activeTab.value]
})

/* ===== Nav actions ===== */
const goNext = () => {
  const idx = tabList.indexOf(activeTab.value as (typeof tabList)[number])
  if (idx !== -1 && idx < tabList.length - 1) activeTab.value = tabList[idx + 1]
}
const goBack = () => {
  const idx = tabList.indexOf(activeTab.value as (typeof tabList)[number])
  if (idx > 0) activeTab.value = tabList[idx - 1]
}
const setTab = (tab: string) => {
  activeTabAdmin.value = tab
}
const setTabTimeline = (tab: string) => {
  activeTabBilling.value = tab
}

/* ===============================
 * Stepper aktif dari ?status=
 * =============================== */
const norm = (v: unknown) =>
  String(v ?? '')
    .toLowerCase()
    .trim()

// decode status dari query: handle '+' sebagai spasi lalu decodeURIComponent
const parseStatusFromQuery = (q: unknown) => {
  let raw = String(q ?? '')
  raw = raw.replace(/\+/g, ' ')
  try {
    raw = decodeURIComponent(raw)
  } catch {
    /* ignore */
  }
  return raw
}

// Map nilai query → label stepper (harus cocok dengan StepperStatusTender)
const STATUS_TO_STEPPER: Record<string, string> = {
  // Create
  created: 'Create Tender Request',
  create: 'Create Tender Request',
  open: 'Create Tender Request',

  // Published
  published: 'Published',
  publish: 'Published',

  // Negotiation & Submission
  'vendor submission': 'Negotiation & Submission',
  submission: 'Negotiation & Submission',
  'vendor negotiation': 'Negotiation & Submission',
  negotiation: 'Negotiation & Submission',

  // Vendor Awarding
  'vendor awarding': 'Vendor Awarding',
  awarding: 'Vendor Awarding',
  award: 'Vendor Awarding',

  // SAP Completed
  'sap completed': 'SAP Completed',
  sap: 'SAP Completed',
  completed: 'SAP Completed',

  // Closed
  closed: 'Closed',
  close: 'Closed',
}

const activeStepName = computed(() => {
  const q = norm(parseStatusFromQuery(route.query.status))
  return STATUS_TO_STEPPER[q] ?? 'Create Tender Request'
})

/* (Opsional) Sinkronkan tab utama berdasar status */
const STATUS_TO_TAB: Record<string, string> = {
  created: 'purchase',
  create: 'purchase',
  open: 'purchase',
  'vendor submission': 'vendor',
  submission: 'vendor',
  'vendor negotiation': 'vendor',
  negotiation: 'vendor',
  published: 'timeline',
  publish: 'timeline',
  'vendor awarding': 'timeline',
  awarding: 'timeline',
  award: 'timeline',
  'sap completed': 'timeline',
  sap: 'timeline',
  completed: 'timeline',
  closed: 'timeline',
  close: 'timeline',
}

watch(
  () => route.query.status,
  (v) => {
    const key = norm(parseStatusFromQuery(v))
    if (STATUS_TO_TAB[key]) activeTab.value = STATUS_TO_TAB[key]
  },
  { immediate: true },
)

/* (Opsional) Isi form.tenderId dari ?id= */
watch(
  () => route.query.id,
  (v) => {
    form.tenderId = String(v ?? '')
  },
  { immediate: true },
)
</script>

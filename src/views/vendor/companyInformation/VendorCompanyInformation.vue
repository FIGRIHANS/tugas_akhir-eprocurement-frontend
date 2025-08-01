<script setup lang="ts">
import BreadcrumbView from '@/components/BreadcrumbView.vue'
import type { ITabClosable } from '@/components/ui/atoms/tab-closable/types/tabClosable'
import UiTabClosable from '@/components/ui/atoms/tab-closable/UiTabClosable.vue'
import type { routeTypes } from '@/core/type/components/breadcrumb'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AdministrativeData from './AdministrativeData.vue'
import PaymentInfoListView from './PaymentInfoListView.vue'
import CompanyDeedData from './CompanyDeedData.vue'
import BussinesLicenseData from './BussinesLicenseData.vue'
import ExperienceData from './experienceData/ExperienceData.vue'

const route = useRoute()
const currentTab = ref<string>('administrative-data')
const bcRoutes = ref<routeTypes[]>([
  {
    name: 'Company Information',
    to: `/vendor/information/${route.params.id}`,
  },
  {
    name: 'Administrative Data',
    to: route.path,
  },
])

const tabsItem: ITabClosable[] = [
  {
    id: 'administrative-data',
    label: 'Administrative Data',
    isClosable: true,
  },
  {
    id: 'business-license-data',
    label: 'Business License Data',
    isClosable: true,
  },
  {
    id: 'payment-information-data',
    label: 'Payment Information Data',
    isClosable: true,
  },
  {
    id: 'deed-of-establishment-data',
    label: 'Deed of Establishment Data',
    isClosable: true,
  },
  {
    id: 'equipment-data',
    label: 'Equipment Data',
    isClosable: true,
  },
  {
    id: 'experience-data',
    label: 'Experience Data',
    isClosable: true,
  },
  {
    id: 'expert-personel-data',
    label: 'Expert Personnel Data',
    isClosable: true,
  },
  {
    id: 'other-documents-data',
    label: 'Other Documents',
    isClosable: true,
  },
  {
    id: 'company-deed-data',
    label: 'Company Deed Data',
    isClosable: true,
  },
]

watch(
  () => currentTab.value,
  (newTab) => {
    bcRoutes.value[1].name =
      tabsItem.find((tab) => tab.id === newTab)?.label || 'Administrative Data'
  },
)
</script>

<template>
  <BreadcrumbView title="Company Information" :routes="bcRoutes" />
  <UiTabClosable :tabs="tabsItem" v-model="currentTab" />
  <AdministrativeData v-if="currentTab === 'administrative-data'" />
  <BussinesLicenseData v-if="currentTab === 'business-license-data'" />
  <PaymentInfoListView v-if="currentTab === 'payment-information-data'" />
  <CompanyDeedData v-if="currentTab === 'company-deed-data'" />
  <ExperienceData v-if="currentTab === 'experience-data'" />
</template>

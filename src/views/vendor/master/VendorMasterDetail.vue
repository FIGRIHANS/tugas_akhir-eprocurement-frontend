<script setup lang="ts">
import BreadcrumbView from '@/components/BreadcrumbView.vue'
import type { ITabClosable } from '@/components/ui/atoms/tab-closable/types/tabClosable'
import UiTabClosable from '@/components/ui/atoms/tab-closable/UiTabClosable.vue'
import type { routeTypes } from '@/core/type/components/breadcrumb'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import SummaryInformation from '../detail/SummaryInformation.vue'
import AdministrativeData from '../detail/AdministrativeData.vue'
import BusinessLicense from '../detail/BusinessLicense.vue'
import PaymentInformation from '../detail/PaymentInformation.vue'

const route = useRoute()

const bcRoutes: routeTypes[] = [
  {
    name: 'Vendor Master',
    to: '/vendor/master',
  },
  {
    name: 'Detail Vendor',
    to: route.path,
  },
]

const tabsItem: ITabClosable[] = [
  {
    id: 'summary-information',
    label: 'Summary Information',
  },
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
]
const currentTab = ref<string>('summary-information')
</script>

<template>
  <BreadcrumbView title="Vendor Master" :routes="bcRoutes" />
  <UiTabClosable :tabs="tabsItem" v-model="currentTab" />

  <SummaryInformation v-if="currentTab === 'summary-information'" />
  <AdministrativeData v-if="currentTab === 'administrative-data'" />
  <BusinessLicense v-if="currentTab === 'business-license-data'" />
  <PaymentInformation v-if="currentTab === 'payment-information-data'" />
</template>

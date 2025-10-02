<script setup lang="ts">
import BreadcrumbView from '@/components/BreadcrumbView.vue'
import type { ITabClosable } from '@/components/ui/atoms/tab-closable/types/tabClosable'
import UiTabClosable from '@/components/ui/atoms/tab-closable/UiTabClosable.vue'
import type { routeTypes } from '@/core/type/components/breadcrumb'
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import SummaryInformation from '../detail/SummaryInformation.vue'
import AdministrativeData from '../detail/AdministrativeData.vue'
import BusinessLicense from '../detail/BusinessLicense.vue'
import PaymentInformation from '../detail/PaymentInformation.vue'

const route = useRoute()
const { t } = useI18n()

const bcRoutes = computed<routeTypes[]>(() => [
  {
    name: t('vendorMaster.breadcrumb.vendorMaster'),
    to: '/vendor/master',
  },
  {
    name: t('vendorMaster.breadcrumb.detailVendor'),
    to: route.path,
  },
])

const tabsItem = computed<ITabClosable[]>(() => [
  {
    id: 'summary-information',
    label: t('vendorMaster.tabs.summaryInformation'),
  },
  {
    id: 'administrative-data',
    label: t('vendorMaster.tabs.administrativeData'),
    isClosable: true,
  },
  {
    id: 'business-license-data',
    label: t('vendorMaster.tabs.businessLicenseData'),
    isClosable: true,
  },
  {
    id: 'payment-information-data',
    label: t('vendorMaster.tabs.paymentInformationData'),
    isClosable: true,
  },
])
const currentTab = ref<string>('summary-information')
</script>

<template>
  <BreadcrumbView :title="$t('vendorMaster.title')" :routes="bcRoutes" />
  <UiTabClosable :tabs="tabsItem" v-model="currentTab" />

  <SummaryInformation v-if="currentTab === 'summary-information'" />
  <AdministrativeData v-if="currentTab === 'administrative-data'" />
  <BusinessLicense v-if="currentTab === 'business-license-data'" />
  <PaymentInformation v-if="currentTab === 'payment-information-data'" />
</template>

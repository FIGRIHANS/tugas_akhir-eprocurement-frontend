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
import { useI18n } from 'vue-i18n'
import { useLoginStore } from '@/stores/views/login'
const { t } = useI18n()
const userStore = useLoginStore()

const route = useRoute()

const bcRoutes: routeTypes[] = [
  {
    name: t('vendorVerification.breadcrums.title'),
    to: '/vendor/verification',
  },
  {
    name: t('vendorVerification.breadcrums.verificationproccess'),
    to: route.path,
  },
]

const tabsItem: ITabClosable[] = [
  {
    id: 'summary-information',
    label: t('vendorVerification.tabitems.summary'),
  },
  {
    id: 'administrative-data',
    label: t('vendorVerification.tabitems.administrative'),
    isClosable: true,
  },
  {
    id: 'business-license-data',
    label: t('vendorVerification.tabitems.businessLicenses'),
    isClosable: true,
  },
  {
    id: 'payment-information-data',
    label: t('vendorVerification.tabitems.paymentinfo'),
    isClosable: true,
  },
]
const currentTab = ref<string>('summary-information')

const vendorId = ref('')

if (route.params.id) {
  vendorId.value = route.params.id as string
} else {
  vendorId.value = userStore.userData?.profile?.profileId.toString()
}


</script>

<template>
  <BreadcrumbView :title="$t('vendorVerification.breadcrums.title')" :routes="bcRoutes" />
  <UiTabClosable :tabs="tabsItem" v-model="currentTab" />

  <SummaryInformation v-if="currentTab === 'summary-information'" :vendorId="vendorId" />
  <AdministrativeData v-if="currentTab === 'administrative-data'" :vendorId="vendorId" />
  <BusinessLicense v-if="currentTab === 'business-license-data'" :vendorId="vendorId" />
  <PaymentInformation v-if="currentTab === 'payment-information-data'" :vendorId="vendorId" />
</template>

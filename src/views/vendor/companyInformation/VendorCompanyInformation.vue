<script setup lang="ts">
import BreadcrumbView from '@/components/BreadcrumbView.vue'
import ModalConfirmation from '@/components/modal/ModalConfirmation.vue'
import type { ITabClosable } from '@/components/ui/atoms/tab-closable/types/tabClosable'
import UiTabClosable from '@/components/ui/atoms/tab-closable/UiTabClosable.vue'
import type { routeTypes } from '@/core/type/components/breadcrumb'
import { ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import AdministrativeData from './AdministrativeData.vue'
import PaymentInfoListView from './PaymentInfoListView.vue'
import CompanyDeedData from './CompanyDeedData.vue'
import BussinesLicenseData from './BussinesLicenseData.vue'
import EquipmentData from './EquipmentData.vue'
import ExpertPersonnelData from './expertPersonnelData/ExpertPersonnelData.vue'
import ExperienceData from './experienceData/ExperienceData.vue'
import OtherDocumentData from './otherDocument/OtherDocumentData.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import { useVendorAdministrationStore } from '@/stores/vendor/vendor'
import { useChangeDataEmailStore } from '@/stores/vendor/email-change-data'

const adminStore = useVendorAdministrationStore()
const changeDataEmailStore = useChangeDataEmailStore()
const { t } = useI18n()

const route = useRoute()
const currentTab = ref<string>('administrative-data')
const emailSuccessModal = ref(false)
const emailErrorModal = ref(false)
const emailSending = ref(false)
const bcRoutes = computed<routeTypes[]>(() => [
  {
    name: t('companyInformation.breadcrumb.companyInformation'),
    to: `/vendor/information/${route.params.id}`,
  },
  {
    name: t('companyInformation.breadcrumb.administrativeData'),
    to: route.path,
  },
])

const tabsItem = computed<ITabClosable[]>(() => [
  {
    id: 'administrative-data',
    label: t('companyInformation.tabs.administrativeData'),
    isClosable: true,
  },
  {
    id: 'business-license-data',
    label: t('companyInformation.tabs.businessLicenseData'),
    isClosable: true,
  },
  {
    id: 'payment-information-data',
    label: t('companyInformation.tabs.paymentInformationData'),
    isClosable: true,
  },
  {
    id: 'company-deed-data',
    label: t('companyInformation.tabs.companyDeedData'),
    isClosable: true,
  },
  {
    id: 'equipment-data',
    label: t('companyInformation.tabs.equipmentData'),
    isClosable: true,
  },
  {
    id: 'experience-data',
    label: t('companyInformation.tabs.experienceData'),
    isClosable: true,
  },
  {
    id: 'expert-personel-data',
    label: t('companyInformation.tabs.expertPersonnelData'),
    isClosable: true,
  },
  {
    id: 'other-documents-data',
    label: t('companyInformation.tabs.otherDocuments'),
    isClosable: true,
  },
])

const sendEmail = async () => {
  try {
    emailSending.value = true
    await changeDataEmailStore.sendEmail({
      recepientName: adminStore?.data?.vendorName || '',
      recepients: {
        emailTo: adminStore?.data?.vendorEmail || '',
        emailCc: '',
        emailBcc: '',
      },
    })
    emailSuccessModal.value = true
  } catch (error) {
    console.error('Failed to send email:', error)
    emailErrorModal.value = true
  } finally {
    emailSending.value = false
  }
}

watch(
  () => currentTab.value,
  (newTab) => {
    bcRoutes.value[1].name =
      tabsItem.value.find((tab) => tab.id === newTab)?.label ||
      t('companyInformation.breadcrumb.administrativeData')
  },
)
</script>

<template>
  <BreadcrumbView :title="$t('companyInformation.title')" :routes="bcRoutes" />

  <div class="p-4 mb-5 bg-amber-100/70 rounded-md w-full text-sm flex items-center justify-between">
    <div class="flex items-center gap-2">
      <img src="/icons/information.svg" alt="" />
      <div>
        <h3 class="text-sm font-semibold text-slate-700">
          {{ $t('companyInformation.notification.title') }}
        </h3>
        <p class="text-sm text-slate-500">
          {{ $t('companyInformation.notification.message') }}
        </p>
      </div>
    </div>
    <div>
      <UiButton
        class="bg-amber-400 hover:bg-amber-500 hover:shadow-none transition-all duration-150 text-white"
        @click="sendEmail"
        :disabled="emailSending"
        >{{
          emailSending
            ? $t('companyInformation.notification.sending')
            : $t('companyInformation.notification.sendButton')
        }}</UiButton
      >
    </div>
  </div>

  <UiTabClosable :tabs="tabsItem" v-model="currentTab" />

  <AdministrativeData v-if="currentTab === 'administrative-data'" />
  <BussinesLicenseData v-if="currentTab === 'business-license-data'" />
  <PaymentInfoListView v-if="currentTab === 'payment-information-data'" />
  <CompanyDeedData v-if="currentTab === 'company-deed-data'" />
  <EquipmentData v-if="currentTab === 'equipment-data'" />
  <ExpertPersonnelData v-if="currentTab === 'expert-personel-data'" />
  <ExperienceData v-if="currentTab === 'experience-data'" />
  <OtherDocumentData v-if="currentTab === 'other-documents-data'" />

  <!-- Email Success Modal -->
  <ModalConfirmation
    :open="emailSuccessModal"
    id="email-success"
    type="success"
    :title="$t('companyInformation.modal.emailSuccess.title')"
    :text="$t('companyInformation.modal.emailSuccess.message')"
    no-cancel
    static
    :submit-button-text="$t('companyInformation.modal.emailSuccess.close')"
    :submit="() => (emailSuccessModal = false)"
  />

  <!-- Email error modal -->
  <ModalConfirmation
    :open="emailErrorModal"
    id="email-error"
    type="danger"
    :title="$t('companyInformation.modal.emailError.title')"
    :text="$t('companyInformation.modal.emailError.message')"
    no-cancel
    static
    :submit-button-text="$t('companyInformation.modal.emailError.close')"
    :submit="() => (emailErrorModal = false)"
  />
</template>

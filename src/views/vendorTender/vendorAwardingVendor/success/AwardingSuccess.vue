<template>
  <div class="vendor-awarding-success">
    <BreadcrumbView
      title="Vendor Awarding"
      :routes="routes"
    />

    <!-- Stepper Status -->
    <div class="border rounded-xl d-flex align-items-center justify-content-center p-4 mb-4">
      <AwardingStepper :currentStep="4" />
    </div>

    <!-- Success Notification -->
    <div class="success-notification mb-4">
      <div class="notification-container">
        <div class="icon-section">
          <i class="ki-duotone ki-ranking text-success fs-2x">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
        </div>
        <div class="content-section">
          <div class="success-text">
            Congratulations, you have successfully won the tender.
          </div>
          <div class="notification-link">
            Open notification email <a href="#" class="text-primary">here</a>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Cards -->
    <div class="main-content-cards">
      <TenderGeneralData />
      <TenderOrganization />
      <DocumentTender />
    </div>

    <!-- Navigation Buttons -->
    <div class="d-flex justify-content-between mt-4">
      <button
        type="button"
        class="btn btn-light"
        @click="goBack"
      >
        <i class="ki-outline ki-left me-2"></i>
        Back to Report
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, provide, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import BreadcrumbView from '@/components/BreadcrumbView.vue'
import TenderGeneralData from '../Awarding/TenderGeneralData.vue'
import TenderOrganization from '../Awarding/TenderOrganization.vue'
import DocumentTender from '../Awarding/DocumentTender.vue'
import AwardingStepper from '../Awarding/AwardingStepper.vue'

defineOptions({
  name: 'VendorAwardingSuccess'
})

const router = useRouter()
const route = useRoute()

const routes = ref([
  { name: 'Tender Report', to: '/tender/report' },
  { name: 'Awarding', to: '/tender/report/awarding' }
])

const generalData = ref({
  tenderReqId: '1000000',
  tenderStatus: 'SAP Completed',
  prCategory: 'MRP',
  evaluationObject: 'E1',
  tenderStartDate: '2024-10-12',
  tenderEndDate: '2024-11-12'
})

const organization = ref({
  plant: 'CHP2',
  companyCode: '1000',
  method: '1',
  picTender: 'Joko'
})

const documents = ref({
  technicalProposal: 'filename.pdf',
  commercialProposal: 'filename.pdf',
  otherDocument: 'filename.pdf'
})

provide('generalData', generalData.value)
provide('organization', organization.value)
provide('documents', documents.value)

const goBack = () => {
  router.push('/tender/report')
}

onMounted(() => {
  const tenderId = route.params.id
  if (tenderId) {
    console.log('Loading tender awarding success:', tenderId)
  }
})
</script>

<style lang="scss" scoped>
@use '../styles/success.scss';
</style>

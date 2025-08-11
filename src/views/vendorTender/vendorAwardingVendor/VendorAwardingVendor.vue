<template>
  <div class="tender-awarding">
    <BreadcrumbView
      title="Vendor Awarding"
      :routes="routes"
    />

    <section name="Stepper" class="border rounded-md p-[24px] flex justify-center mb-[24px]">
      <div>
        <AwardingStepper :currentStep="3" />
      </div>
    </section>

    <div class="border rounded-xl flex align-items-center gap-[24px] p-[24px] mb-[24px]">
      <TenderGeneralData class="flex-1" />
      <TenderOrganization class="flex-1" />
      <DocumentTender class="flex-1" />
    </div>

    <div class="flex justify-between mt-[24px]">
      <button
        type="button"
        class="btn btn-light"
        @click="goBack"
      >
        <i class="ki-outline ki-left me-2"></i>
        Back
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, provide } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import BreadcrumbView from '@/components/BreadcrumbView.vue'

import TenderGeneralData from './Awarding/TenderGeneralData.vue'
import TenderOrganization from './Awarding/TenderOrganization.vue'
import DocumentTender from './Awarding/DocumentTender.vue'
import AwardingStepper from './Awarding/AwardingStepper.vue'

defineOptions({
  name: 'TenderAwarding'
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
  router.back()
}

onMounted(() => {
  const tenderId = route.params.id
  if (tenderId) {
    console.log('Loading tender awarding:', tenderId)
  }
})
</script>

<style lang="scss" scoped>
@use './styles/awarding.scss';
</style>

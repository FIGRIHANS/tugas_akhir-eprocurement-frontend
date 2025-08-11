<template>
  <div class="vendor-awarding-failure">
    <BreadcrumbView title="Vendor Awarding" :routes="routes" />

    <div class="border rounded-xl d-flex align-items-center justify-content-center p-4 mb-4">
      <AwardingStepper :currentStep="3" />
    </div>

    <div class="failure-notification mb-4">
      <div class="notification-container">
        <div class="icon-section">
          <div class="icon-circle">
            <span
              style="display: flex; align-items: center; justify-content: center; width: 48px; height: 48px;">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="16" fill="#ef4444" />
                <text x="16" y="24" text-anchor="middle" font-size="22" font-weight="bold"
                  fill="#fff">!</text>
              </svg>
            </span>
          </div>
        </div>
        <div class="content-section">
          <div class="failure-text">
            We regret to inform you that your submission was not successful in this tender process.
          </div>
        </div>
      </div>
    </div>

    <div class="border rounded-xl flex align-items-center gap-[24px] p-[24px] mb-[24px]">
      <TenderGeneralData class="flex-1" />
      <TenderOrganization class="flex-1" />
      <DocumentTender class="flex-1" />
    </div>

    <div class="d-flex justify-content-between">
      <button type="button" class="btn btn-light" @click="goBack">
        <i class="ki-outline ki-left me-2"></i>
        Back to Report
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import {
    ref,
    provide,
    onMounted
  } from 'vue'
  import {
    useRouter,
    useRoute
  } from 'vue-router'
  import BreadcrumbView from '@/components/BreadcrumbView.vue'

  import TenderGeneralData from '../Awarding/TenderGeneralData.vue'
  import TenderOrganization from '../Awarding/TenderOrganization.vue'
  import DocumentTender from '../Awarding/DocumentTender.vue'
  import AwardingStepper from '../Awarding/AwardingStepper.vue'

  defineOptions({
    name: 'VendorAwardingFailure'
  })

  const router = useRouter()

  const route = useRoute()

  const routes = ref([{
      name: 'Tender Report',
      to: '/tender/report'
    },
    {
      name: 'Awarding',
      to: '/tender/report/awarding'
    }
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
      console.log('Loading tender awarding failure:', tenderId)
    }
  })
</script>

<style lang="scss" scoped>
@use '../styles/failure.scss';
</style>

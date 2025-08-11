<template>
  <div>
    <Breadcrumb title="Negotiation" :routes="routes" />

    <section name="Stepper" class="border rounded-md p-[24px] flex justify-center mb-[24px]">
      <NegotiationStepper />
    </section>

    <div class="border rounded-lg p-[24px] mt-[24px] font-medium">PT Walldorf Grosshandel Tbk</div>

    <div class="flex align-items-center gap-[24px] mt-[24px]">
      <GeneralData class="flex-1" />
      <TenderOrganization class="flex-1" />
      <DocumentAttachment class="flex-1" />
    </div>

    <div class="mt-[24px]">
      <TableNegotiation />
    </div>

    <div class="flex align-items-center justify-between gap-[8px] mt-[24px]">
      <button class="btn btn-outline btn-primary" @click="backPage">
        <i class="ki-filled ki-arrow-left"></i>
        Back
      </button>
      <button class="btn btn-primary" @click="submitNego">
        Confirm and Send
        <i class="ki-filled ki-arrow-right"></i>
      </button>
    </div>

    <SuccessNegotiation :show="showSuccessModal" @afterClose="$router.back()" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import GeneralData from './tenderNegotiation/GeneralData.vue'
import TenderOrganization from './tenderNegotiation/TenderOrganization.vue'
import DocumentAttachment from './tenderNegotiation/DocumentAttachment.vue'
import TableNegotiation from './tenderNegotiation/TableNegotiation.vue'
import SuccessNegotiation from './tenderNegotiation/SuccessNegotiation.vue'

import NegotiationStepper from '@/views/vendorTender/vendorTenderSubmissionNegotiation/tenderSubmissionNegotiation/NegotiationStepper.vue'

import Breadcrumb from '@/components/BreadcrumbView.vue'
import type { routeTypes } from '@/core/type/components/breadcrumb'

const router = useRouter()

const routes = ref<routeTypes[]>([
  {
    name: 'Negotiation',
    to: '/tender/submission/negotiation',
  },
])

const showSuccessModal = ref(false)

const backPage = () => {
  router.push('/tender/submission/negotiation')
}

const submitNego = () => {
  showSuccessModal.value = true
}
</script>

<style lang="scss" scoped>
@use './styles/tenderNegotiation.scss';
</style>

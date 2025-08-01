<template>
  <div v-if="form">
    <div class="border rounded-xl flex align-items-center gap-[24px] p-[24px]">
      <GeneralData class="flex-1" />
      <TenderOrganization class="flex-1" />
      <DocumentAttachment class="flex-1" />
    </div>
    <div class="border rounded-xl p-[24px]">
      <p class="font-semibold">Vendor Evaluation Criteria</p>
      <div class="border rounded-lg p-[4px] mt-[24px] w-fit">
        <div class="flex gap-4" data-tabs="true">
          <a class="btn btn-primary btn-clear" :class="{ 'active': activeTab === 'automatic' }" href="#" @click="onSetTab(true)">
            Automatic Criteria
          </a>
          <a class="btn btn-primary btn-clear" :class="{ 'active': activeTab === 'manual' }" href="#" @click="onSetTab(false)">
            Manual Criteria
          </a>
        </div>
      </div>
      <VendorEvaluationCriteria v-show="activeTab === 'automatic'" v-model="form.automaticCriteria" />
      <VendorEvaluationCriteria v-show="activeTab === 'manual'" v-model="form.manualCriteria" :isManual="true" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import type { FormTypes } from '../types/tenderCreate'
import GeneralData from './AdministrativeDocument/GeneralData.vue'
import TenderOrganization from './AdministrativeDocument/TenderOrganization.vue'
import DocumentAttachment from './AdministrativeDocument/DocumentAttachment.vue'
import VendorEvaluationCriteria from './AdministrativeDocument/VendorEvaluationCriteria.vue'

const form = inject<FormTypes>('form')

defineProps<{
  activeTab: string
}>()

const emits = defineEmits(['setTab'])

const onSetTab = (isAutomatic: boolean) => {
  emits('setTab', isAutomatic ? 'automatic' : 'manual')
}
</script>

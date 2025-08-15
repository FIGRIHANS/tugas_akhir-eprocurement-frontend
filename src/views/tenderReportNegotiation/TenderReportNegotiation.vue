<template>
  <div>
    <Breadcrumb title="Negotiation" :routes="routes" />
    <div class="border rounded-lg p-[24px]">
      <UiTab :items="tabItems" v-model="currentTab" />
      <AwardingDraft v-if="currentTab === 'awardingDraft'" />
      <NegotiationSummary v-if="currentTab === 'negotiationSummary'" />
      <ParticipatingVendor class="mt-[24px]" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import ParticipatingVendor from './tenderReportNegotiation/ParticipatingVendor.vue'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import type { routeTypes } from '@/core/type/components/breadcrumb'
import AwardingDraft from './tenderReportNegotiation/AwardingDraft.vue'
import UiTab from '@/components/ui/atoms/tab/UiTab.vue'
import type { ITabItem } from '@/components/ui/atoms/tab/types/tab'
import NegotiationSummary from './tenderReportNegotiation/NegotiationSummary.vue'

const routes = ref<routeTypes[]>([
  {
    name: 'Tender Report List',
    to: '/tender/report',
  },
  {
    name: 'Negotiation',
    to: '/tender/report/negotiation',
  },
])

const tabItems: ITabItem[] = [
  {
    label: 'Awarding Draft',
    value: 'awardingDraft',
  },
  {
    label: 'Negotiation Summary',
    value: 'negotiationSummary',
  },
]

const currentTab = ref<string>('awardingDraft')
</script>

<style lang="scss" scoped>
@use './styles/tenderReportNegotiation.scss';
</style>

<template>
  <div>
    <Breadcrumb title="Negotiation" :routes="routes" />
    <div class="border rounded-lg p-[24px]">
      <UiTab :items="tabItems" v-model="currentTab" />
      <AwardingDraft
        :data="dummyData"
        @updateCount="updateQty"
        v-if="currentTab === 'awardingDraft'"
      />
      <NegotiationSummary :data="dummyData" v-if="currentTab === 'negotiationSummary'" />
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

const dummyData = [
  {
    materialCode: 'CH-1062',
    materialDesc: 'Macro Fertilizer Urea',
    quantity: 30,
    uom: 'TON',
    bottomPriceLBMA: 100861.5,
    unitPriceLBMA: 3362.0,
    simulationAmount: 93000.0,
    variance: '-8%',
    currency: 'USD',
    awardDraft: '1 winner',
    simulationStatus: 'Error',
    simulationMessage: 'Kumulasi Nego Qty melebihi Tender Qty, silakan disesuaikan kembali',
    bids: [
      {
        rank: 1,
        vendor: 'PT Walldorf Tbk',
        negoQty: 30,
        uom: 'TON',
        bottomPrice: 100861.5,
        unitPrice: 3100.0,
        negotiationAmount: 93000.0,
        var: '-8%',
        currency: 'USD',
        awardStatus: '🏅',
      },
      {
        rank: 2,
        vendor: 'PT Somper GmbH Tbk',
        negoQty: 0,
        uom: 'TON',
        bottomPrice: null,
        unitPrice: 3200.0,
        negotiationAmount: null,
        var: '0%',
        currency: 'USD',
        awardStatus: '',
      },
      {
        rank: 3,
        vendor: 'PT Kreuzschmid Kgaa Tbk',
        negoQty: 0,
        uom: 'TON',
        bottomPrice: null,
        unitPrice: 3250.0,
        negotiationAmount: null,
        var: '0%',
        currency: 'USD',
        awardStatus: '',
      },
    ],
  },
  {
    materialCode: 'CH-1064',
    materialDesc: 'Macro Fertilizer NPK',
    quantity: 33,
    uom: 'TON',
    bottomPriceLBMA: 110947.65,
    unitPriceLBMA: 3362.05,
    simulationAmount: 103300.0,
    variance: '-7%',
    currency: 'USD',
    awardDraft: '2 winner',
    simulationStatus: 'Completed',
    simulationMessage: 'Kumulasi Nego Qty melebihi Tender Qty, silakan disesuaikan kembali',
    bids: [
      {
        rank: 1,
        vendor: 'PT Walldorf Tbk',
        negoQty: 23,
        uom: 'TON',
        bottomPrice: 77327.15,
        unitPrice: 3100.0,
        negotiationAmount: 71300.0,
        var: '-8%',
        currency: 'USD',
        awardStatus: '🏅',
      },
      {
        rank: 2,
        vendor: 'PT Somper GmbH Tbk',
        negoQty: 10,
        uom: 'TON',
        bottomPrice: 33620.5,
        unitPrice: 3200.0,
        negotiationAmount: 32000.0,
        var: '-5%',
        currency: 'USD',
        awardStatus: '🏅',
      },
      {
        rank: 3,
        vendor: 'PT Kreuzschmid Kgaa Tbk',
        negoQty: 0,
        uom: 'TON',
        bottomPrice: null,
        unitPrice: 3250.0,
        negotiationAmount: null,
        var: '0%',
        currency: 'USD',
        awardStatus: '',
      },
    ],
  },
  {
    materialCode: 'CH-1066',
    materialDesc: 'Macro Fertilizer CaCO3',
    quantity: 25,
    uom: 'TON',
    bottomPriceLBMA: 84051.25,
    unitPriceLBMA: 3362.0,
    simulationAmount: 79250.0,
    variance: '-6%',
    currency: 'USD',
    awardDraft: '3 winner',
    simulationStatus: 'Completed',
    simulationMessage: 'Kumulasi Nego Qty melebihi Tender Qty, silakan disesuaikan kembali',
    bids: [
      {
        rank: 1,
        vendor: 'PT Walldorf Tbk',
        negoQty: 10,
        uom: 'TON',
        bottomPrice: 33620.5,
        unitPrice: 3100.0,
        negotiationAmount: 31000.0,
        var: '-8%',
        currency: 'USD',
        awardStatus: '🏅',
      },
      {
        rank: 2,
        vendor: 'PT Somper GmbH Tbk',
        negoQty: 10,
        uom: 'TON',
        bottomPrice: 33620.5,
        unitPrice: 3200.0,
        negotiationAmount: 32000.0,
        var: '-5%',
        currency: 'USD',
        awardStatus: '🏅',
      },
      {
        rank: 3,
        vendor: 'PT Kreuzschmid Kgaa Tbk',
        negoQty: 5,
        uom: 'TON',
        bottomPrice: 16810.25,
        unitPrice: 3250.0,
        negotiationAmount: 16250.0,
        var: '3%',
        currency: 'USD',
        awardStatus: '🏅',
      },
    ],
  },
]

const currentTab = ref<string>('awardingDraft')

const updateQty = (data: string) => {
  console.log(data)
}
</script>

<style lang="scss" scoped>
@use './styles/tenderReportNegotiation.scss';
</style>

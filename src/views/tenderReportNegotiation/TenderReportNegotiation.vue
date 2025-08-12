<template>
  <div>
    <Breadcrumb title="Negotiation" :routes="routes" />
    <div class="border rounded-lg p-[24px]">
      <div class="rounded-lg bg-gray-100 flex w-[406px]">
        <div class="flex-col flex-1">
          <p v-for="item of tenderData" :key="item" class="text-sm px-[20px] py-[20px]">{{ item }}</p>
        </div>
        <div class="flex-col flex-1">
          <p class="text-sm font-semibold px-[20px] py-[20px]">23423523</p>
          <p class="text-sm font-semibold px-[20px] py-[20px]">{{ moment('2024-11-24').format('DD MMM YYYY') }}</p>
          <p class="text-sm font-semibold px-[20px] py-[20px]">{{ moment('2024-11-24').format('DD MMM YYYY') }}</p>
          <p class="text-sm font-semibold px-[20px] py-[20px]">Albert Flores</p>
        </div>
      </div>
      <ParticipatingVendor class="mt-[24px]" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import ParticipatingVendor from './tenderReportNegotiation/ParticipatingVendor.vue'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import type { routeTypes } from '@/core/type/components/breadcrumb'
import moment from 'moment'

const routes = ref<routeTypes[]>([
  {
    name: 'Tender Report List',
    to: '/tender/report'
  },
  {
    name: 'Negotiation',
    to: '/tender/report/negotiation'
  }
])

const tenderData = ref<string[]>([
  'Tender ID',
  'Tender Start Date',
  'Tender End Date',
  'PIC'
])
</script>

<style lang="scss" scoped>
@use './styles/tenderReportNegotiation.scss';
</style>

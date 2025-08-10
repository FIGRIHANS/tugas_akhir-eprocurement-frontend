<template>
  <div>
    <p>Passing Score: 80%</p>
    <div class="eva__table mt-[24px]">
      <table class="table text-gray-700 font-medium text-sm">
        <thead>
          <tr>
            <th
              v-for="(item, index) in columns"
              :key="index"
              class="eva__field-base !border-b-blue-500"
              :class="{
                'eva__field-base--vendor-name': item === 'Vendor Name',
                'eva__field-base--remarks': item === 'Remarks'
              }"
            >
              {{ item }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="data of props.data" :key="data.id">
            <td>
              <div class="dropdown" data-dropdown="true" data-dropdown-trigger="click">
                <button class="dropdown-toggle btn btn-outline btn-icon btn-primary">
                  <i class="ki-duotone ki-dots-vertical"></i>
                </button>
                <div class="dropdown-content w-fit max-w-56 py-2">
                  <div class="menu menu-default flex flex-col w-fit">
                    <div class="menu-item">
                      <div class="menu-link" href="#">
                        <span class="menu-icon">
                          <i class="ki-duotone ki-file-up"></i>
                        </span>
                        <span class="menu-title">
                          Winner
                        </span>
                      </div>
                    </div>
                    <div class="menu-item">
                      <div class="menu-link" href="#">
                        <span class="menu-icon">
                          <i class="ki-duotone ki-eye"></i>
                        </span>
                        <span class="menu-title">
                          Negotiation History
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </td>
            <td>{{ data.vendorCode }}</td>
            <td>
              <span class="badge badge-outline badge-pill" :class="getBadgeColor(data.rank)">
                {{ data.rank }}
              </span>
            </td>
            <td>{{ data.vendorName }}</td>
            <td>{{ data.totalScore + '%' }}</td>
            <td>{{ data.technicalEvaluation + '%' }}</td>
            <td>{{ data.commercialEvaluation + '%' }}</td>
            <td>{{ useFormatIdr(data.totalGrossAmount) }}</td>
            <td>{{ data.vendorDisc }}</td>
            <td>{{ data.discAmout }}</td>
            <td>{{ useFormatIdr(data.totalNettAmount) }}</td>
            <td>{{ data.remarks }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useFormatIdr } from '@/composables/currency'
import type { VendorListTypes } from '../types/tenderEvaluation'

const props = defineProps<{
  data: VendorListTypes[]
}>()

const columns = ref<string[]>([
  'Action',
  'Vendor Code',
  'Rank',
  'Vendor Name',
  'Total Score',
  'Technical Evaluation',
  'Commercial Evaluation',
  'Total Gross Amount',
  'Vendor Disc',
  'Disc Amount',
  'Total Nett Amount',
  'Remarks'
])

const getBadgeColor = (rank: number) => {
 switch (rank) {
  case 1:
    return 'badge-success'
  case 2:
    return 'badge-primary'
  case 3:
    return 'badge-warning'
  case 4:
    return 'badge-danger'
 }
}
</script>

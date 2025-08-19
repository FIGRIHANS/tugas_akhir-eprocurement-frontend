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
              class="eva__field-base !border-b-blue-500 !bg-blue-100 !text-blue-500"
              :class="{
                'eva__field-base--vendor-name': item === 'Vendor Name',
                'eva__field-base--remarks': item === 'Remarks',
              }"
            >
              {{ item }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(data, index) of dummyData" :key="data.id">
            <td>
              <div class="dropdown" data-dropdown="true" data-dropdown-trigger="click">
                <button class="dropdown-toggle btn btn-outline btn-icon btn-primary">
                  <i class="ki-duotone ki-dots-vertical"></i>
                </button>
                <div class="dropdown-content w-fit max-w-56 py-2">
                  <div class="menu menu-default flex flex-col w-fit">
                    <div class="menu-item">
                      <div class="menu-link" @click="setWinner(index)">
                        <span class="menu-icon">
                          <i class="ki-duotone ki-file-up"></i>
                        </span>
                        <span class="menu-title"> Winner </span>
                      </div>
                    </div>
                    <div class="menu-item">
                      <div class="menu-link" @click="goToDetail(data.id)">
                        <span class="menu-icon">
                          <i class="ki-duotone ki-eye"></i>
                        </span>
                        <span class="menu-title"> Negotiation History </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </td>
            <td>
              <div
                v-if="data.isWin"
                class="bg-yellow-100 text-yellow-600 flex flex-row justify-center align-center p-[6px] w-[50px]"
              >
                <i class="ki-duotone ki-award text-2xl"></i>
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
import { useRouter } from 'vue-router'

const router = useRouter()
// const props = defineProps<{
//   data: VendorListTypes[]
// }>()

const dummyData = ref<VendorListTypes[]>([
  {
    id: 1,
    isWin: false,
    vendorCode: '1060',
    rank: 1,
    vendorName: 'PT Walldorf Grosshandel Tbk',
    totalScore: 0,
    technicalEvaluation: 0,
    commercialEvaluation: 0,
    totalGrossAmount: 171000,
    vendorDisc: '30%',
    discAmout: 51300,
    totalNettAmount: 119700,
    remarks: 'Tahun kedua akan increase 10% tapi memasukkan parameter inflasi',
  },
  {
    id: 2,
    isWin: false,
    vendorCode: '2983',
    rank: 2,
    vendorName: 'PT Sommer GmbHTbk',
    totalScore: 0,
    technicalEvaluation: 0,
    commercialEvaluation: 0,
    totalGrossAmount: 171000,
    vendorDisc: '25%',
    discAmout: 42750,
    totalNettAmount: 128250,
    remarks: 'Tahun kedua ada kemungkinan increase 5%',
  },
  {
    id: 3,
    isWin: false,
    vendorCode: '8765',
    rank: 3,
    vendorName: 'PT Kreutzschmid KgaA Tbk',
    totalScore: 0,
    technicalEvaluation: 0,
    commercialEvaluation: 0,
    totalGrossAmount: 171000,
    vendorDisc: '20%',
    discAmout: 34200,
    totalNettAmount: 136800,
    remarks: 'Dapat melakukan fixed rate 3 Years',
  },
])

const columns = ref<string[]>([
  'Action',
  'Winner',
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
  'Remarks',
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

const setWinner = (index: number) => {
  dummyData.value[index].isWin = true
}

const goToDetail = (id: number) => {
  router.push({
    name: 'tenderNegotiation',
    query: {
      id: id,
    },
  })
}
</script>

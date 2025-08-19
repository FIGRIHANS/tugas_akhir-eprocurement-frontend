<template>
  <div>
    <div class="border rounded-lg p-5">
      <p class="mx-[30px] my-[20px]">Participating Vendors</p>
      <div class="nego__table">
        <table class="table text-gray-700 font-medium text-sm">
          <thead>
            <tr>
              <th
                v-for="(item, index) in columns"
                :key="index"
                class="nego__field-base !border-b-blue-50 !bg-blue-100 !text-blue-500"
                :class="{
                  'nego__field-base--vendor-name': item === 'Vendor Name',
                }"
              >
                {{ item }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="data of dummyData" :key="data.id">
              <td>
                <button
                  class="btn btn-icon btn-primary btn-outline"
                  @click="goToNegotiation(data.id)"
                >
                  <i class="ki-duotone ki-eye"></i>
                </button>
              </td>
              <td>
                <span class="badge badge-outline badge-pill badge-success">
                  {{ data.status }}
                </span>
              </td>
              <td>{{ data.vendorCode }}</td>
              <td>
                <span class="badge badge-outline badge-pill" :class="getBadgeColor(data.rank)">
                  {{ data.rank }}
                </span>
              </td>
              <td>{{ data.vendorName }}</td>
              <td>
                <span class="badge badge-outline badge-pill badge-warning">
                  {{ data.totalScore }}
                </span>
              </td>
              <td>
                <span class="badge badge-outline badge-pill badge-primary">
                  {{ data.productQuality }}
                </span>
              </td>
              <td>
                <span class="badge badge-outline badge-pill badge-success">
                  {{ data.leadTimeQuality }}
                </span>
              </td>
              <td>
                <span class="badge badge-outline badge-pill badge-primary">
                  {{ data.afterSalesWarranty }}
                </span>
              </td>
              <td>
                <span class="badge badge-outline badge-pill badge-primary">
                  {{ data.orderAbsorption }}
                </span>
              </td>
              <td>{{ data.totalPo }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- <div class="flex align-items-center justify-between gap-[8px] mt-[24px]">
      <span class="text-sm">Show {{ dummyData.length }} data from {{ dummyData.length }}</span>
      <LPagination :totalItems="dummyData.length" :currentPage="pageNo" :pageSize="pageSize" />
    </div> -->
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import LPagination from '@/components/pagination/LPagination.vue'
import { useTenderEvoStore } from '@/stores/tender-evo/tenderNegotiation'

const router = useRouter()
const pageNo = ref<number>(1)
const pageSize = ref<number>(10)

const tenderStore = useTenderEvoStore()

const dummyData = tenderStore.dummyVendor

const columns = ref<string[]>([
  'Action',
  'Status',
  'Vendor Code',
  'Rank',
  'Vendor Name',
  'Total Score',
  'Product Quality',
  'Lead Time Supply',
  'After Sales Warranty',
  'Order Absorption',
  'Total PO',
])

const getBadgeColor = (rank: string) => {
  switch (rank) {
    case '1':
      return 'badge-success'
    case '2':
      return 'badge-primary'
    case '3':
      return 'badge-warning'
    case '4':
      return 'badge-danger'
  }
}

const goToNegotiation = (id: number) => {
  router.push({
    name: 'tenderNegotiation',
    query: {
      id: id,
    },
  })
}
</script>

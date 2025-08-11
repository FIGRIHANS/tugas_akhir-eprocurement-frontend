<template>
  <div>
    <Breadcrumb title="Tender Report List" :routes="routes" />

    <div class="flex align-items-center gap-[16px]">
      <CardGraph title="Created" :data="dummyCardData" class="flex-1" />
      <CardGraph title="Published" :data="dummyCardData" class="flex-1" />
      <CardGraph title="Negotiation & Submission" :data="dummyCardData" class="flex-1" />
      <CardGraph title="Close" :data="dummyCardData" class="flex-1" />
    </div>

    <div class="border rounded-md p-[24px] mt-[24px]">
      <div class="flex align-items-center gap-[16px]">
        <div class="flex-1">
          <div class="input max-w-[250px]">
            <i class="ki-filled ki-magnifier"></i>
            <input v-model="search" placeholder="Cari data" type="text" />
          </div>
        </div>

        <FilterList :data="filterForm" :options="filterOptions" @setData="setFilter" />

        <button class="btn btn-outline btn-primary">
          <i class="ki-duotone ki-printer"></i>
          Export Data
        </button>
      </div>

      <div v-if="checkFilterForm" class="mt-[24px] flex align-items-center gap-[16px]">
        <span>Filter</span>

        <span v-if="filterForm.tenderRequestId" class="badge badge-outline">
          Tender Request ID
          <span class="text-gray-800 ml-[4px]">{{ filterForm.tenderRequestId }}</span>
          <i
            class="ki-filled ki-cross text-gray-800 ml-[10px] cursor-pointer"
            @click="
              () => {
                filterForm.tenderRequestId = ''
                pageNo = 1
              }
            "
          ></i>
        </span>

        <span v-if="filterForm.status" class="badge badge-outline">
          Tender Status
          <span class="text-gray-800 ml-[4px]">{{ filterForm.status }}</span>
          <i
            class="ki-filled ki-cross text-gray-800 ml-[10px] cursor-pointer"
            @click="
              () => {
                filterForm.status = ''
                pageNo = 1
              }
            "
          ></i>
        </span>

        <span v-if="filterForm.category" class="badge badge-outline">
          PR Category
          <span class="text-gray-800 ml-[4px]">{{ filterForm.category }}</span>
          <i
            class="ki-filled ki-cross text-gray-800 ml-[10px] cursor-pointer"
            @click="
              () => {
                filterForm.category = ''
                pageNo = 1
              }
            "
          ></i>
        </span>

        <span v-if="filterForm.plant" class="badge badge-outline">
          Plant
          <span class="text-gray-800 ml-[4px]">{{ filterForm.plant }}</span>
          <i
            class="ki-filled ki-cross text-gray-800 ml-[10px] cursor-pointer"
            @click="
              () => {
                filterForm.plant = ''
                pageNo = 1
              }
            "
          ></i>
        </span>

        <span
          class="text-gray-600 cursor-pointer"
          @click="
            () => {
              resetFilter()
              pageNo = 1
            }
          "
        >
          Reset Filter
        </span>
      </div>

      <div class="report__table mt-[24px]">
        <table class="table text-gray-700 font-medium text-sm">
          <thead>
            <tr>
              <th
                v-for="(item, index) in columns"
                :key="index"
                class="report__field-base !border-b-blue-500"
                :class="{
                  'report__field-base--long': item === 'Tender Status' || item === 'PIC Tender',
                }"
              >
                {{ item }}
              </th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="data of paginatedReports" :key="data.id + '-' + data.status">
              <td>
                <div class="dropdown" data-dropdown="true" data-dropdown-trigger="click">
                  <button class="dropdown-toggle btn btn-outline btn-icon btn-primary">
                    <i class="ki-duotone ki-dots-vertical"></i>
                  </button>
                  <div class="dropdown-content w-fit max-w-56 py-2">
                    <div class="menu menu-default flex flex-col w-fit">
                      <div class="menu-item">
                        <div class="menu-link" href="#">
                          <span class="menu-icon"><i class="ki-duotone ki-file-up"></i></span>
                          <span class="menu-title"> Publish </span>
                        </div>
                      </div>
                      <div class="menu-item">
                        <div class="menu-link" @click="goToDetail(data)">
                          <span class="menu-icon"><i class="ki-duotone ki-eye"></i></span>
                          <span class="menu-title"> Detail </span>
                        </div>
                      </div>
                      <div class="menu-item">
                        <div class="menu-link" href="#" @click="goToNegotiation">
                          <span class="menu-icon"><i class="ki-duotone ki-update-file"></i></span>
                          <span class="menu-title"> Negotiation </span>
                        </div>
                      </div>
                      <div class="menu-item">
                        <div class="menu-link" href="#">
                          <span class="menu-icon"><i class="ki-duotone ki-award"></i></span>
                          <span class="menu-title"> Award </span>
                        </div>
                      </div>
                      <div class="menu-item">
                        <div class="menu-link" href="#">
                          <span class="menu-icon"><i class="ki-duotone ki-time"></i></span>
                          <span class="menu-title"> History </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </td>

              <td>{{ data.id }}</td>
              <td>
                <span class="badge badge-outline badge-pill" :class="getColorBadge(data.status)">
                  {{ data.status }}
                </span>
              </td>
              <td>{{ data.category }}</td>
              <td>{{ data.evaluationObject }}</td>
              <td>{{ moment(data.startDate).format('DD MMM YYYY') }}</td>
              <td>{{ moment(data.endDate).format('DD MMM YYYY') }}</td>
              <td>{{ data.plant }}</td>
              <td>{{ data.companyCode }}</td>
              <td>{{ data.method }}</td>
              <td>{{ data.pic }}</td>
            </tr>

            <tr v-if="!paginatedReports.length">
              <td :colspan="columns.length" class="text-center py-6 text-gray-500">
                Tidak ada data yang cocok.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-[24px] flex align-items-center justify-between">
        <p class="text-sm">
          Tampilkan {{ paginatedReports.length }} dari total data {{ totalItems }}
        </p>

        <LPagination
          :totalItems="totalItems"
          :pageSize="pageSize"
          :currentPage="pageNo"
          @update:currentPage="pageNo = $event"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import moment from 'moment'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import CardGraph from './tenderReportList/CardGraph.vue'
import LPagination from '@/components/pagination/LPagination.vue'
import FilterList from './tenderReportList/FilterList.vue'
import { useTenderStore } from '@/stores/views/tender/tender'
import type { routeTypes } from '@/core/type/components/breadcrumb'
import type { CardGraphTypes, ReportListTypes, filterListTypes } from './types/tenderReportList'

const tenderApi = useTenderStore()
const router = useRouter()

/** SEARCH & PAGINATION */
const search = ref<string>('')
const pageNo = ref<number>(1)
const pageSize = ref<number>(10)

/** FILTER FORM */
const filterForm = ref<filterListTypes>({
  tenderRequestId: '',
  status: '',
  category: '',
  plant: '',
})

/** BREADCRUMB */
const routes = ref<routeTypes[]>([{ name: 'Tender Report List', to: '/tender/report' }])

/** CARD DUMMY */
const dummyCardData = ref<CardGraphTypes[]>([
  { id: 1, days: 2 },
  { id: 2, days: 5 },
  { id: 3, days: 3 },
  { id: 4, days: 9 },
  { id: 5, days: 7 },
  { id: 6, days: 10 },
  { id: 7, days: 12 },
  { id: 8, days: 15 },
  { id: 9, days: 6 },
  { id: 10, days: 5 },
])

/** TABLE HEADER */
const columns = ref<string[]>([
  'Detail',
  'Tender Request ID',
  'Tender Status',
  'PR Category',
  'Evaluation Object',
  'Tender Start Date',
  'Tender End Date',
  'Plant',
  'Compay Code',
  'Method',
  'PIC Tender',
])

/** DUMMY DATA */
const dummyReport = ref<ReportListTypes[]>([
  {
    id: '10000001',
    status: 'Created',
    category: 'MRP',
    evaluationObject: 'E1',
    startDate: '2025-10-25',
    endDate: '2025-11-14',
    plant: 'CHP2',
    companyCode: '1000',
    method: '1',
    pic: 'Ralph Edwards',
  },
  {
    id: '10000002',
    status: 'Published',
    category: 'MRP',
    evaluationObject: 'E1',
    startDate: '2025-10-25',
    endDate: '2025-11-14',
    plant: 'CHP2',
    companyCode: '1000',
    method: '1',
    pic: 'Guy Hawkins',
  },
  {
    id: '10000003',
    status: 'Vendor Submission',
    category: 'MRP',
    evaluationObject: 'E1',
    startDate: '2025-10-25',
    endDate: '2025-11-14',
    plant: 'CHP2',
    companyCode: '1000',
    method: '1',
    pic: 'Guy Hawkins',
  },
  {
    id: '10000004',
    status: 'Vendor Negotiation',
    category: 'MRP',
    evaluationObject: 'E1',
    startDate: '2025-10-25',
    endDate: '2025-11-14',
    plant: 'CHP2',
    companyCode: '1000',
    method: '1',
    pic: 'Guy Hawkins',
  },
  {
    id: '10000005',
    status: 'Closed',
    category: 'MRP',
    evaluationObject: 'E1',
    startDate: '2025-10-25',
    endDate: '2025-11-14',
    plant: 'CHP2',
    companyCode: '1000',
    method: '1',
    pic: 'Guy Hawkins',
  },
  {
    id: '10000006',
    status: 'SAP Completed',
    category: 'MRP',
    evaluationObject: 'E1',
    startDate: '2025-10-25',
    endDate: '2025-11-14',
    plant: 'CHP2',
    companyCode: '1000',
    method: '1',
    pic: 'Guy Hawkins',
  },
  {
    id: '10000007',
    status: 'Vendor Awarding',
    category: 'MRP',
    evaluationObject: 'E1',
    startDate: '2025-10-25',
    endDate: '2025-11-14',
    plant: 'CHP2',
    companyCode: '1000',
    method: '1',
    pic: 'Savannah Nguyen',
  },
  {
    id: '10000007',
    status: 'Vendor Awarding',
    category: 'MRP',
    evaluationObject: 'E1',
    startDate: '2025-10-25',
    endDate: '2025-11-14',
    plant: 'CHP2',
    companyCode: '1000',
    method: '1',
    pic: 'Savannah Nguyen',
  },
  {
    id: '10000008',
    status: 'Vendor Negotiation',
    category: 'MRP',
    evaluationObject: 'E1',
    startDate: '2025-10-25',
    endDate: '2025-11-14',
    plant: 'CHP2',
    companyCode: '1000',
    method: '1',
    pic: 'Savannah Nguyen',
  },
])

const filterOptions = computed(() => {
  const uniq = (arr: string[]) => Array.from(new Set(arr)).sort((a, b) => a.localeCompare(b))
  return {
    tenderRequestIds: uniq(dummyReport.value.map((r) => r.id)),
    statuses: uniq(dummyReport.value.map((r) => r.status)),
    categories: uniq(dummyReport.value.map((r) => r.category)),
    plants: uniq(dummyReport.value.map((r) => r.plant)),
  }
})

// action to detail
const goToDetail = (data: { id: string; status: string }) => {
  router.push({
    name: 'tenderCreate',
    query: {
      id: data.id,
      status: data.status,
    },
  })
}

/** TAMPILKAN CHIP FILTER HANYA JIKA ADA NILAI */
const checkFilterForm = computed(() => {
  return Boolean(
    filterForm.value.tenderRequestId ||
      filterForm.value.status ||
      filterForm.value.category ||
      filterForm.value.plant,
  )
})

/** RESET FILTER */
const resetFilter = () => {
  filterForm.value.tenderRequestId = ''
  filterForm.value.status = ''
  filterForm.value.category = ''
  filterForm.value.plant = ''
}

/** WARNA BADGE STATUS */
const getColorBadge = (status: string) => {
  switch (status) {
    case 'Published':
      return 'badge-primary'
    case 'Vendor Submission':
      return 'badge-info'
    case 'Vendor Negotiation':
      return 'badge-warning'
    case 'Closed':
      return 'badge-danger'
    case 'SAP Completed':
      return 'badge-success'
    case 'Vendor Awarding':
      return 'bg-orange-100 border-orange-200 text-orange-300'
    default:
      return ''
  }
}

/** SET DATA DARI KOMPONEN FILTER */
const setFilter = (data: filterListTypes) => {
  filterForm.value.tenderRequestId = data.tenderRequestId
  filterForm.value.status = data.status
  filterForm.value.category = data.category
  filterForm.value.plant = data.plant
}

/** NORMALISASI STRING */
const norm = (v: unknown) =>
  String(v ?? '')
    .toLowerCase()
    .trim()

/** FILTER + SEARCH (global) */
const filteredReports = computed(() => {
  const s = norm(search.value)

  return dummyReport.value.filter((row) => {
    // Filter exact by chip (bisa diganti contains kalau mau)
    if (filterForm.value.tenderRequestId && norm(row.id) !== norm(filterForm.value.tenderRequestId))
      return false
    if (filterForm.value.status && norm(row.status) !== norm(filterForm.value.status)) return false
    if (filterForm.value.category && norm(row.category) !== norm(filterForm.value.category))
      return false
    if (filterForm.value.plant && norm(row.plant) !== norm(filterForm.value.plant)) return false

    // Global search ke beberapa kolom
    if (!s) return true
    const haystack = [
      row.id,
      row.status,
      row.category,
      row.evaluationObject,
      moment(row.startDate).format('DD MMM YYYY'),
      moment(row.endDate).format('DD MMM YYYY'),
      row.plant,
      row.companyCode,
      row.method,
      row.pic,
    ]
      .map(norm)
      .join(' ')
    return haystack.includes(s)
  })
})

/** PAGINATION */
const totalItems = computed(() => filteredReports.value.length)
const paginatedReports = computed(() => {
  const start = (pageNo.value - 1) * pageSize.value
  return filteredReports.value.slice(start, start + pageSize.value)
})

/** RESET PAGE SAAT SEARCH/FILTER BERUBAH */
watch(
  [search, filterForm],
  () => {
    pageNo.value = 1
  },
  { deep: true },
)

/** NAVIGASI */
const goToNegotiation = () => {
  tenderApi.negoId = '123'
  router.push({ name: 'tenderReportNegotiation', query: { id: tenderApi.negoId } })
}
</script>

<style lang="scss" scoped>
@use './styles/tenderReportList.scss';
</style>

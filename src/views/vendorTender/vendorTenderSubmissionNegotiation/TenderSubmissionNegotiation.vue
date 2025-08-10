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
        <FilterList :data="filterForm" @setData="setFilter" />
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
          <i class="ki-filled ki-cross text-gray-800 ml-[10px] cursor-pointer"
            @click="filterForm.tenderRequestId = ''"></i>
        </span>

        <span v-if="filterForm.status" class="badge badge-outline">
          Tender Status
          <span class="text-gray-800 ml-[4px]">{{ filterForm.status }}</span>
          <i class="ki-filled ki-cross text-gray-800 ml-[10px] cursor-pointer"
            @click="filterForm.status = ''"></i>
        </span>

        <span v-if="filterForm.category" class="badge badge-outline">
          PR Category
          <span class="text-gray-800 ml-[4px]">{{ filterForm.category }}</span>
          <i class="ki-filled ki-cross text-gray-800 ml-[10px] cursor-pointer"
            @click="filterForm.category = ''"></i>
        </span>

        <span v-if="filterForm.plant" class="badge badge-outline">
          Plant
          <span class="text-gray-800 ml-[4px]">{{ filterForm.plant }}</span>
          <i class="ki-filled ki-cross text-gray-800 ml-[10px] cursor-pointer"
            @click="filterForm.plant = ''"></i>
        </span>

        <span class="text-gray-600 cursor-pointer" @click="resetFilter">Reset Filter</span>
      </div>

      <div class="report__table mt-[24px]">
        <table class="table text-gray-700 font-medium text-sm">
          <thead>
            <tr>
              <th v-for="(item, index) in columns" :key="index" class="report__field-base" :class="{
                  'report__field-base--long': item === 'Tender Status' || item === 'PIC Tender'
                }">
                {{ item }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="data of dummyReport" :key="data.id">
              <td>
                <div class="dropdown" data-dropdown="true" data-dropdown-trigger="click">
                  <button class="dropdown-toggle btn btn-outline btn-icon btn-primary">
                    <i class="ki-duotone ki-dots-vertical"></i>
                  </button>
                  <div class="dropdown-content w-fit max-w-56 py-2">
                    <div class="menu menu-default flex flex-col w-fit">
                      <div class="menu-item">
                        <a class="menu-link" href="#">
                          <span class="menu-icon">
                            <i class="ki-duotone ki-file-up"></i>
                          </span>
                          <span class="menu-title">
                            Publish
                          </span>
                        </a>
                      </div>
                      <div class="menu-item">
                        <a class="menu-link" href="#">
                          <span class="menu-icon">
                            <i class="ki-duotone ki-eye"></i>
                          </span>
                          <span class="menu-title">
                            Detail
                          </span>
                        </a>
                      </div>
                      <div class="menu-item">
                        <a class="menu-link cursor-pointer" @click="goToNegotiation(data.id)">
                          <span class="menu-icon">
                            <i class="ki-duotone ki-update-file"></i>
                          </span>
                          <span class="menu-title">
                            Negotiation
                          </span>
                        </a>
                      </div>
                      <div class="menu-item">
                        <a class="menu-link" @click="goToAwarding()" style="cursor: pointer;">
                          <span class="menu-icon">
                            <i class="ki-duotone ki-award"></i>
                          </span>
                          <span class="menu-title">
                            Award
                          </span>
                        </a>
                      </div>
                      <div class="menu-item">
                        <a class="menu-link" href="#">
                          <span class="menu-icon">
                            <i class="ki-duotone ki-time"></i>
                          </span>
                          <span class="menu-title">
                            History
                          </span>
                        </a>
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
              <td>{{ moment(data.startDate).locale('id').format('DD MMM YYYY') }}</td>
              <td>{{ moment(data.endDate).locale('id').format('DD MMM YYYY') }}</td>
              <td>{{ data.plant }}</td>
              <td>{{ data.companyCode }}</td>
              <td>{{ data.method }}</td>
              <td>{{ data.pic }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="mt-[24px] flex align-items-center justify-between">
        <p class="text-sm">Tampilkan {{ dummyReport.length }} dari total data
          {{ dummyReport.length }}</p>
        <LPagination :totalItems="dummyReport.length" :pageSize="pageSize" :currentPage="pageNo" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import {
    ref,
    computed
  } from 'vue'
  import {
    useRouter
  } from 'vue-router'

  import moment from 'moment'

  import Breadcrumb from '@/components/BreadcrumbView.vue'
  import LPagination from '@/components/pagination/LPagination.vue'

  import CardGraph from './tenderSubmissionNegotiation/CardGraph.vue'
  import FilterList from './tenderSubmissionNegotiation/FilterList.vue'

  import type {
    routeTypes
  } from '@/core/type/components/breadcrumb'

  import type {
    CardGraphTypes,
    ReportListTypes,
    filterListTypes
  } from './types/tenderReportList'

  const router = useRouter()

  const search = ref < string > ('')

  const pageNo = ref < number > (1)

  const pageSize = ref < number > (10)

  const filterForm = ref < filterListTypes > ({
    tenderRequestId: '123412',
    status: '',
    category: '',
    plant: ''
  })

  const routes = ref < routeTypes[] > ([{
    name: 'Tender Report List',
    to: '/tender/create'
  }])

  const dummyCardData = ref < CardGraphTypes[] > ([{
      id: 1,
      days: 2
    },
    {
      id: 2,
      days: 5
    },
    {
      id: 3,
      days: 3
    },
    {
      id: 4,
      days: 9
    },
    {
      id: 5,
      days: 7
    },
    {
      id: 6,
      days: 10
    },
    {
      id: 7,
      days: 12
    },
    {
      id: 8,
      days: 15
    },
    {
      id: 9,
      days: 6
    },
    {
      id: 10,
      days: 5
    }
  ])

  const columns = ref < string[] > ([
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
    'PIC Tender'
  ])

  const dummyReport = ref < ReportListTypes[] > ([{
      id: '10000000',
      status: 'Created',
      category: 'MRP',
      evaluationObject: 'E1',
      startDate: '2025-10-25',
      endDate: '2025-11-14',
      plant: 'CHP2',
      companyCode: '1000',
      method: '1',
      pic: 'Ralph Edwards'
    },
    {
      id: '10000000',
      status: 'Published',
      category: 'MRP',
      evaluationObject: 'E1',
      startDate: '2025-10-25',
      endDate: '2025-11-14',
      plant: 'CHP2',
      companyCode: '1000',
      method: '1',
      pic: 'Guy Hawkins'
    },
    {
      id: '10000000',
      status: 'Vendor Submission',
      category: 'MRP',
      evaluationObject: 'E1',
      startDate: '2025-10-25',
      endDate: '2025-11-14',
      plant: 'CHP2',
      companyCode: '1000',
      method: '1',
      pic: 'Guy Hawkins'
    },
    {
      id: '10000000',
      status: 'Vendor Negotiation',
      category: 'MRP',
      evaluationObject: 'E1',
      startDate: '2025-10-25',
      endDate: '2025-11-14',
      plant: 'CHP2',
      companyCode: '1000',
      method: '1',
      pic: 'Guy Hawkins'
    },
    {
      id: '10000000',
      status: 'Closed',
      category: 'MRP',
      evaluationObject: 'E1',
      startDate: '2025-10-25',
      endDate: '2025-11-14',
      plant: 'CHP2',
      companyCode: '1000',
      method: '1',
      pic: 'Guy Hawkins'
    },
    {
      id: '10000000',
      status: 'SAP Completed',
      category: 'MRP',
      evaluationObject: 'E1',
      startDate: '2025-10-25',
      endDate: '2025-11-14',
      plant: 'CHP2',
      companyCode: '1000',
      method: '1',
      pic: 'Guy Hawkins'
    },
    {
      id: '10000000',
      status: 'Vendor Awarding',
      category: 'MRP',
      evaluationObject: 'E1',
      startDate: '2025-10-25',
      endDate: '2025-11-14',
      plant: 'CHP2',
      companyCode: '1000',
      method: '1',
      pic: 'Savannah Nguyen'
    }
  ])

  const checkFilterForm = computed(() => {
    if (
      filterForm.value.tenderRequestId ||
      filterForm.value.status ||
      filterForm.value.category ||
      filterForm.value.plant
    ) return true
    else return false
  })

  const resetFilter = () => {
    filterForm.value.tenderRequestId = ''
    filterForm.value.status = ''
    filterForm.value.category = ''
    filterForm.value.plant = ''
  }

  const getColorBadge = (status: string) => {
    switch (status) {
      case 'Published':
        return 'badge-primary'
      case 'Tender Request Numbermission':
        return 'badge-info'
      case 'Vendor Negotiation':
        return 'badge-warning'
      case 'Closed':
        return 'badge-danger'
      case 'SAP Completed':
        return 'badge-success'
      case 'Vendor Awarding':
        return 'bg-orange-100 border-orange-200 text-orange-300'
    }
  }

  const setFilter = (data: filterListTypes) => {
    filterForm.value.tenderRequestId = data.tenderRequestId
    filterForm.value.status = data.status
    filterForm.value.category = data.category
    filterForm.value.plant = data.plant
  }

  const goToNegotiation = (id: string) => {
    router.push({
      name: 'TenderNegotiation',
      params: {
        id
      }
    })
  }

  const goToAwarding = () => {
    router.push(`/tender/report/awarding/success`)
  }
</script>

<style lang="scss" scoped>
  @use './styles/tenderReportList.scss';
</style>

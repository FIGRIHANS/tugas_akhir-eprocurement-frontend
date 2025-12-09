<template>
  <div>
    <Breadcrumb title="Dispatch List" :routes="routes" />
    <hr class="-mx-[24px] mb-[24px]" />

    <div class="border border-gray-200 rounded-xl p-[24px]">
      <!-- Header Section -->
      <div class="flex justify-between align-items-center gap-[8px] mb-[24px]">
        <h1>Dispatch List</h1>
        <div class="flex align-items-center gap-3">
          <UiInputSearch v-model="search" placeholder="Search" @keypress="goSearch" />

          <!-- Filter Button -->
          <button class="btn btn-light" @click="toggleFilter()">
            <i class="ki-duotone ki-filter"></i>
            Filter
          </button>

          <button class="btn btn-primary" @click="exportData()">
            <i class="ki-duotone ki-exit-down"></i>
            Export Data
          </button>
        </div>
      </div>

      <!-- Filter Section -->
      <div v-if="showFilter" class="border border-gray-200 rounded-lg p-4 mb-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="form-label">Status</label>
            <select v-model="filterForm.status" class="form-select">
              <option value="">All Status</option>
              <option value="Quantity Confirmed">Quantity Confirmed</option>
            </select>
          </div>
          <div>
            <label class="form-label">Discrepancy Status</label>
            <select v-model="filterForm.discrepancyStatus" class="form-select">
              <option value="">All Discrepancy</option>
              <option value="Plus">Plus</option>
              <option value="Mix">Mix</option>
            </select>
          </div>
          <div>
            <label class="form-label">Delivery Date</label>
            <input type="date" v-model="filterForm.deliveryDate" class="form-control" />
          </div>
        </div>
        <div class="flex gap-2 mt-4">
          <button class="btn btn-primary btn-sm" @click="applyFilter()">Apply Filter</button>
          <button class="btn btn-light btn-sm" @click="resetFilter()">Reset</button>
        </div>
      </div>

      <!-- Active Filters Display -->
      <div class="flex overflow-x-auto gap-3 mb-5 items-center" v-if="filteredPayload.length > 0">
        <div class="font-medium text-lg text-gray-800">Filter</div>
        <div v-for="items in filteredPayload" :key="items.key">
          <div class="btn btn-light btn-sm" v-if="items.value !== ''">
            <span class="text-gray-500"> {{ items.key }} </span>
            <span class="font-semibold">{{ items.value }}</span>
            <i class="ki-filled ki-cross" @click="deleteFilter(items.key)"></i>
          </div>
        </div>
        <button class="btn btn-light btn-sm" @click="resetFilter()">Reset All</button>
      </div>

      <!-- Table Section -->
      <div class="overflow-x-auto list__table mt-[24px]">
        <div class="flex justify-between items-center mb-4">
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-700">Show</span>
            <select
              v-model="pageSize"
              class="form-select form-select-sm w-auto"
              @change="setPage(1)"
            >
              <option :value="5">5</option>
              <option :value="10">10</option>
              <option :value="25">25</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
            </select>
            <span class="text-sm text-gray-700">entries</span>
          </div>
        </div>

        <table class="table align-middle text-gray-700 font-medium text-sm">
          <thead>
            <tr>
              <th
                v-for="(item, index) in columns"
                :key="index"
                :class="{
                  'cursor-pointer': item !== 'Action',
                  '!text-blue-500': item === sortColumnName && sortBy !== '',
                }"
                @click="item !== 'Action' ? sortColumn(item) : null"
              >
                {{ item }}
                <i v-if="item !== 'Action'" class="ki-filled ki-arrow-up-down"></i>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredDataList?.length === 0">
              <td colspan="10" class="text-center">No data found.</td>
            </tr>
            <tr v-for="(item, index) in list" :key="index">
              <td>{{ item.loadSheet }}</td>
              <td>{{ item.faktur }}</td>
              <td class="text-center">
                <span class="badge badge-outline" :class="getStatusBadgeClass(item.status)">
                  {{ item.status }}
                </span>
              </td>
              <td>{{ formatDate(item.deliveryDate) }}</td>
              <td class="text-center">
                <span
                  class="badge badge-outline"
                  :class="getDiscrepancyBadgeClass(item.discrepancyStatus)"
                >
                  {{ item.discrepancyStatus }}
                </span>
              </td>
              <td>{{ item.transporter }}</td>
              <td>{{ item.distributor }}</td>
              <td>{{ item.regionFrom }}</td>
              <td>{{ item.regionTo }}</td>
              <td>
                <button
                  class="btn btn-outline btn-icon btn-primary w-[32px] h-[32px]"
                  @click="goDetail(item)"
                >
                  <i class="ki-filled ki-eye !text-lg"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="flex items-center justify-between mt-[24px]">
        <p class="m-0 text-sm">
          Showing
          {{
            pageSize * currentPage > filteredDataList.length
              ? filteredDataList.length
              : pageSize * currentPage
          }}
          of {{ filteredDataList.length }} entries
        </p>
        <LPagination
          :totalItems="filteredDataList.length"
          :pageSize="pageSize"
          :currentPage="currentPage"
          @pageChange="setPage"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { type routeTypes } from '@/core/type/components/breadcrumb'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import LPagination from '@/components/pagination/LPagination.vue'
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import momentLib from 'moment'
import { cloneDeep } from 'lodash'

// Expose moment to template
const moment = momentLib
const router = useRouter()

interface ReceivingData {
  loadSheet: string
  faktur: string
  status: string
  deliveryDate: string
  discrepancyStatus: string
  transporter: string
  distributor: string
  regionFrom: string
  regionTo: string
}

interface FilterForm {
  status: string
  discrepancyStatus: string
  deliveryDate: string
}

const routes = ref<routeTypes[]>([
  {
    name: 'Digital Receiving Confirmation',
    to: '/digital-receiving-confirmation',
  },
])

const search = ref<string>('')
const currentPage = ref<number>(1)
const pageSize = ref<number>(5)
const list = ref<ReceivingData[]>([])
const sortBy = ref<string>('')
const sortColumnName = ref<string>('')
const showFilter = ref<boolean>(false)
const filteredPayload = ref<{ key: string; value: string }[]>([])

const filterForm = ref<FilterForm>({
  status: '',
  discrepancyStatus: '',
  deliveryDate: '',
})

const columns = ref<string[]>([
  'Load Sheet',
  'Faktur',
  'Status',
  'Delivery Date',
  'Discrepancy Status',
  'Transporter',
  'Distributor',
  'Region From',
  'Region To',
  'Action',
])

// 10 Dummy data for demonstration
const dataList = ref<ReceivingData[]>([
  {
    loadSheet: 'LS-2024-001',
    faktur: 'FKT-001',
    status: 'Quantity Confirmed',
    deliveryDate: '2024-12-01',
    discrepancyStatus: 'Plus',
    transporter: 'PT Trans Jaya',
    distributor: 'PT Distributor A',
    regionFrom: 'Jakarta',
    regionTo: 'Bandung',
  },
  {
    loadSheet: 'LS-2024-002',
    faktur: 'FKT-002',
    status: 'Quantity Confirmed',
    deliveryDate: '2024-12-05',
    discrepancyStatus: 'Mix',
    transporter: 'PT Trans Sejahtera',
    distributor: 'PT Distributor B',
    regionFrom: 'Surabaya',
    regionTo: 'Malang',
  },
  {
    loadSheet: 'LS-2024-003',
    faktur: 'FKT-003',
    status: 'Quantity Confirmed',
    deliveryDate: '2024-12-08',
    discrepancyStatus: 'Plus',
    transporter: 'PT Trans Mandiri',
    distributor: 'PT Distributor C',
    regionFrom: 'Semarang',
    regionTo: 'Yogyakarta',
  },
  {
    loadSheet: 'LS-2024-004',
    faktur: 'FKT-004',
    status: 'Quantity Confirmed',
    deliveryDate: '2024-12-02',
    discrepancyStatus: 'Mix',
    transporter: 'PT Trans Express',
    distributor: 'PT Distributor D',
    regionFrom: 'Medan',
    regionTo: 'Pekanbaru',
  },
  {
    loadSheet: 'LS-2024-005',
    faktur: 'FKT-005',
    status: 'Quantity Confirmed',
    deliveryDate: '2024-12-06',
    discrepancyStatus: 'Plus',
    transporter: 'PT Trans Logistik',
    distributor: 'PT Distributor E',
    regionFrom: 'Makassar',
    regionTo: 'Manado',
  },
  {
    loadSheet: 'LS-2024-006',
    faktur: 'FKT-006',
    status: 'Quantity Confirmed',
    deliveryDate: '2024-12-03',
    discrepancyStatus: 'Mix',
    transporter: 'PT Trans Cargo',
    distributor: 'PT Distributor F',
    regionFrom: 'Denpasar',
    regionTo: 'Mataram',
  },
  {
    loadSheet: 'LS-2024-007',
    faktur: 'FKT-007',
    status: 'Quantity Confirmed',
    deliveryDate: '2024-12-09',
    discrepancyStatus: 'Plus',
    transporter: 'PT Trans Global',
    distributor: 'PT Distributor G',
    regionFrom: 'Palembang',
    regionTo: 'Lampung',
  },
  {
    loadSheet: 'LS-2024-008',
    faktur: 'FKT-008',
    status: 'Quantity Confirmed',
    deliveryDate: '2024-12-07',
    discrepancyStatus: 'Mix',
    transporter: 'PT Trans Nusantara',
    distributor: 'PT Distributor H',
    regionFrom: 'Pontianak',
    regionTo: 'Banjarmasin',
  },
  {
    loadSheet: 'LS-2024-009',
    faktur: 'FKT-009',
    status: 'Quantity Confirmed',
    deliveryDate: '2024-12-04',
    discrepancyStatus: 'Plus',
    transporter: 'PT Trans Utama',
    distributor: 'PT Distributor I',
    regionFrom: 'Balikpapan',
    regionTo: 'Samarinda',
  },
  {
    loadSheet: 'LS-2024-010',
    faktur: 'FKT-010',
    status: 'Quantity Confirmed',
    deliveryDate: '2024-12-10',
    discrepancyStatus: 'Mix',
    transporter: 'PT Trans Prima',
    distributor: 'PT Distributor J',
    regionFrom: 'Padang',
    regionTo: 'Jambi',
  },
])

// Computed property for filtered data
const filteredDataList = computed(() => {
  let filtered = cloneDeep(dataList.value)

  // Apply search filter
  if (search.value) {
    filtered = filtered.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(search.value.toLowerCase()),
      ),
    )
  }

  // Apply status filter
  if (filterForm.value.status) {
    filtered = filtered.filter((item) => item.status === filterForm.value.status)
  }

  // Apply discrepancy status filter
  if (filterForm.value.discrepancyStatus) {
    filtered = filtered.filter(
      (item) => item.discrepancyStatus === filterForm.value.discrepancyStatus,
    )
  }

  // Apply delivery date filter
  if (filterForm.value.deliveryDate) {
    filtered = filtered.filter((item) => item.deliveryDate === filterForm.value.deliveryDate)
  }

  return filtered
})

const getStatusBadgeClass = (status: string) => {
  if (status === 'Quantity Confirmed') return 'badge-success'
  return 'badge-secondary'
}

const getDiscrepancyBadgeClass = (status: string) => {
  if (status === 'Plus') return 'badge-primary'
  if (status === 'Mix') return 'badge-info'
  return 'badge-secondary'
}

const formatDate = (date: string) => {
  return moment(date).format('YYYY/MM/DD')
}

const setList = (listData: ReceivingData[]) => {
  const result: ReceivingData[] = []
  for (const [index, item] of listData.entries()) {
    const start = currentPage.value * pageSize.value - pageSize.value
    const end = currentPage.value * pageSize.value - 1
    if (index >= start && index <= end) {
      result.push(item)
    }
  }
  list.value = result
}

const setPage = (value: number) => {
  currentPage.value = value
  setList(filteredDataList.value)
}

const goDetail = (data: ReceivingData) => {
  router.push({
    name: 'dispatchListDetail',
    params: { id: data.loadSheet },
  })
}

const goSearch = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    currentPage.value = 1
    setList(filteredDataList.value)
  }
}

const toggleFilter = () => {
  showFilter.value = !showFilter.value
}

const applyFilter = () => {
  const payload: { key: string; value: string }[] = []

  if (filterForm.value.status) {
    payload.push({ key: 'Status', value: filterForm.value.status })
  }

  if (filterForm.value.discrepancyStatus) {
    payload.push({ key: 'Discrepancy Status', value: filterForm.value.discrepancyStatus })
  }

  if (filterForm.value.deliveryDate) {
    payload.push({ key: 'Delivery Date', value: filterForm.value.deliveryDate })
  }

  filteredPayload.value = payload
  currentPage.value = 1
  setList(filteredDataList.value)
}

const resetFilter = () => {
  filterForm.value = {
    status: '',
    discrepancyStatus: '',
    deliveryDate: '',
  }
  filteredPayload.value = []
  currentPage.value = 1
  setList(filteredDataList.value)
}

const deleteFilter = (key: string) => {
  if (key === 'Status') {
    filterForm.value.status = ''
  } else if (key === 'Discrepancy Status') {
    filterForm.value.discrepancyStatus = ''
  } else if (key === 'Delivery Date') {
    filterForm.value.deliveryDate = ''
  }

  filteredPayload.value = filteredPayload.value.filter((item) => item.key !== key)
  currentPage.value = 1
  setList(filteredDataList.value)
}

const sortColumn = (columnName: string | null) => {
  const columnMap = {
    'Load Sheet': 'loadSheet',
    Faktur: 'faktur',
    Status: 'status',
    'Delivery Date': 'deliveryDate',
    'Discrepancy Status': 'discrepancyStatus',
    Transporter: 'transporter',
    Distributor: 'distributor',
    'Region From': 'regionFrom',
    'Region To': 'regionTo',
  } as { [key: string]: string }

  const roleSort = ['asc', 'desc', '']
  const listData = cloneDeep(filteredDataList.value)
  let result: ReceivingData[] = []

  if (columnName) {
    if (sortColumnName.value !== columnName) sortBy.value = ''
    sortColumnName.value = columnName

    const indexSort = roleSort.findIndex((item) => item === sortBy.value)
    if (indexSort === -1) return setList(filteredDataList.value)
    sortBy.value = indexSort + 1 === roleSort.length ? roleSort[0] : roleSort[indexSort + 1]

    if (!sortBy.value) return setList(filteredDataList.value)
  }

  const name = columnName || sortColumnName.value

  if (name === 'Delivery Date') {
    result = listData.sort((a, b) => {
      const convA = a[columnMap[name]] ? new Date(a[columnMap[name]]).getTime() : 0
      const convB = b[columnMap[name]] ? new Date(b[columnMap[name]]).getTime() : 0
      if (sortBy.value === 'asc') {
        return convA - convB
      } else {
        return convB - convA
      }
    })
  } else {
    result = listData.sort((a, b) => {
      const convA = a[columnMap[name]] ? a[columnMap[name]] : ''
      const convB = b[columnMap[name]] ? b[columnMap[name]] : ''
      if (sortBy.value === 'asc') {
        return convA.localeCompare(convB)
      } else {
        return convB.localeCompare(convA)
      }
    })
  }

  return setList(result)
}

const exportData = () => {
  console.log('Export data')
  // TODO: Implement export functionality
  alert('Export functionality will be implemented')
}

onMounted(() => {
  setList(filteredDataList.value)
})
</script>

<style lang="scss" scoped>
.list__table {
  th,
  td {
    white-space: nowrap;
  }
}
</style>

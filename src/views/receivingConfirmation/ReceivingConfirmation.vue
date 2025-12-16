<template>
  <div>
    <Breadcrumb title="Create Receiving Confirmation" :routes="routes" />
    <hr class="-mx-[24px] mb-[24px]" />

    <div class="border border-gray-200 rounded-xl p-[24px]">
      <!-- Header Section -->
      <div class="flex justify-between align-items-center gap-[8px] mb-[24px]">
        <h1>List Data</h1>
        <div class="flex align-items-center gap-3">
          <UiInputSearch v-model="search" placeholder="Search" @keypress="goSearch" />

          <!-- Filter Button -->
          <button class="btn btn-light" @click="toggleFilter()">
            <i class="ki-duotone ki-filter"></i>
            Filter
          </button>

          <button class="btn btn-primary" @click="createNew()">
            <i class="ki-duotone ki-plus-circle"></i>
            Create
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
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div>
            <label class="form-label">Discrepancy</label>
            <select v-model="filterForm.discrepancy" class="form-select">
              <option value="">All Discrepancy</option>
              <option value="No Discrepancy">No Discrepancy</option>
              <option value="Quantity Mismatch">Quantity Mismatch</option>
              <option value="Partial Delivery">Partial Delivery</option>
              <option value="Quality Issue">Quality Issue</option>
            </select>
          </div>
          <div>
            <label class="form-label">Received Date</label>
            <input type="date" v-model="filterForm.receivedDate" class="form-control" />
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
              <td colspan="17" class="text-center">No data found.</td>
            </tr>
            <tr v-for="(item, index) in list" :key="index">
              <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
              <td>{{ item.beritaAcaraId }}</td>
              <td>{{ item.tripId }}</td>
              <td>{{ item.noOrder }}</td>
              <td>
                <span class="badge badge-outline" :class="getStatusBadgeClass(item.status)">
                  {{ item.status }}
                </span>
              </td>
              <td>{{ item.rejectReason }}</td>
              <td>
                <span
                  class="badge badge-outline"
                  :class="getDiscrepancyBadgeClass(item.discrepancy)"
                >
                  {{ item.discrepancy }}
                </span>
              </td>
              <td>{{ formatDate(item.receivedDate) }}</td>
              <td>{{ item.pickup }}</td>
              <td>{{ item.destination }}</td>
              <td>{{ item.transporter }}</td>
              <td>{{ item.truckType }}</td>
              <td>{{ item.noPolisi }}</td>
              <td>{{ formatDate(item.createdDate) }}</td>
              <td>{{ item.createdBy }}</td>
              <td>{{ formatDate(item.updateDate) }}</td>
              <td>{{ item.updateBy }}</td>
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
  beritaAcaraId: string
  tripId: string
  noOrder: string
  status: string
  rejectReason: string
  discrepancy: string
  receivedDate: string
  pickup: string
  destination: string
  transporter: string
  truckType: string
  noPolisi: string
  createdDate: string
  createdBy: string
  updateDate: string
  updateBy: string
}

interface FilterForm {
  status: string
  discrepancy: string
  receivedDate: string
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
  discrepancy: '',
  receivedDate: '',
})

const columns = ref<string[]>([
  'No',
  'Report ID',
  'Trip ID',
  'Order Number',
  'Status',
  'Reject Reason',
  'Discrepancy',
  'Received Date',
  'Pickup',
  'Destination',
  'Transporter',
  'Truck Type',
  'License Plate',
  'Created Date',
  'Created By',
  'Update Date',
  'Update By',
])

// 10 Dummy data for demonstration
const dataList = ref<ReceivingData[]>([
  {
    beritaAcaraId: 'BA-2024-001',
    tripId: 'TRP-001',
    noOrder: 'ORD-2024-001',
    status: 'Completed',
    rejectReason: '-',
    discrepancy: 'No Discrepancy',
    receivedDate: '2024-12-01',
    pickup: 'Jakarta Warehouse',
    destination: 'Bandung Store',
    transporter: 'PT Trans Jaya',
    truckType: 'Box Truck',
    noPolisi: 'B 1234 XYZ',
    createdDate: '2024-11-28',
    createdBy: 'Admin User',
    updateDate: '2024-12-01',
    updateBy: 'System',
  },
  {
    beritaAcaraId: 'BA-2024-002',
    tripId: 'TRP-002',
    noOrder: 'ORD-2024-002',
    status: 'Pending',
    rejectReason: '-',
    discrepancy: 'Quantity Mismatch',
    receivedDate: '2024-12-05',
    pickup: 'Surabaya Warehouse',
    destination: 'Malang Store',
    transporter: 'PT Trans Sejahtera',
    truckType: 'Flatbed',
    noPolisi: 'L 5678 ABC',
    createdDate: '2024-12-02',
    createdBy: 'John Doe',
    updateDate: '2024-12-05',
    updateBy: 'Jane Smith',
  },
  {
    beritaAcaraId: 'BA-2024-003',
    tripId: 'TRP-003',
    noOrder: 'ORD-2024-003',
    status: 'Completed',
    rejectReason: '-',
    discrepancy: 'No Discrepancy',
    receivedDate: '2024-12-08',
    pickup: 'Semarang Warehouse',
    destination: 'Yogyakarta Store',
    transporter: 'PT Trans Mandiri',
    truckType: 'Container',
    noPolisi: 'H 9012 DEF',
    createdDate: '2024-12-05',
    createdBy: 'Admin User',
    updateDate: '2024-12-08',
    updateBy: 'System',
  },
  {
    beritaAcaraId: 'BA-2024-004',
    tripId: 'TRP-004',
    noOrder: 'ORD-2024-004',
    status: 'Rejected',
    rejectReason: 'Damaged Goods',
    discrepancy: 'Quality Issue',
    receivedDate: '2024-12-02',
    pickup: 'Medan Warehouse',
    destination: 'Pekanbaru Store',
    transporter: 'PT Trans Express',
    truckType: 'Box Truck',
    noPolisi: 'BK 3456 GHI',
    createdDate: '2024-11-30',
    createdBy: 'Supervisor',
    updateDate: '2024-12-02',
    updateBy: 'Quality Control',
  },
  {
    beritaAcaraId: 'BA-2024-005',
    tripId: 'TRP-005',
    noOrder: 'ORD-2024-005',
    status: 'Completed',
    rejectReason: '-',
    discrepancy: 'No Discrepancy',
    receivedDate: '2024-12-06',
    pickup: 'Makassar Warehouse',
    destination: 'Manado Store',
    transporter: 'PT Trans Logistik',
    truckType: 'Refrigerated',
    noPolisi: 'DD 7890 JKL',
    createdDate: '2024-12-03',
    createdBy: 'Admin User',
    updateDate: '2024-12-06',
    updateBy: 'System',
  },
  {
    beritaAcaraId: 'BA-2024-006',
    tripId: 'TRP-006',
    noOrder: 'ORD-2024-006',
    status: 'Pending',
    rejectReason: '-',
    discrepancy: 'Partial Delivery',
    receivedDate: '2024-12-03',
    pickup: 'Denpasar Warehouse',
    destination: 'Mataram Store',
    transporter: 'PT Trans Cargo',
    truckType: 'Box Truck',
    noPolisi: 'DK 2345 MNO',
    createdDate: '2024-12-01',
    createdBy: 'John Doe',
    updateDate: '2024-12-03',
    updateBy: 'Warehouse Staff',
  },
  {
    beritaAcaraId: 'BA-2024-007',
    tripId: 'TRP-007',
    noOrder: 'ORD-2024-007',
    status: 'Completed',
    rejectReason: '-',
    discrepancy: 'No Discrepancy',
    receivedDate: '2024-12-09',
    pickup: 'Palembang Warehouse',
    destination: 'Lampung Store',
    transporter: 'PT Trans Global',
    truckType: 'Flatbed',
    noPolisi: 'BG 6789 PQR',
    createdDate: '2024-12-06',
    createdBy: 'Admin User',
    updateDate: '2024-12-09',
    updateBy: 'System',
  },
  {
    beritaAcaraId: 'BA-2024-008',
    tripId: 'TRP-008',
    noOrder: 'ORD-2024-008',
    status: 'Completed',
    rejectReason: '-',
    discrepancy: 'No Discrepancy',
    receivedDate: '2024-12-07',
    pickup: 'Pontianak Warehouse',
    destination: 'Banjarmasin Store',
    transporter: 'PT Trans Nusantara',
    truckType: 'Container',
    noPolisi: 'KB 0123 STU',
    createdDate: '2024-12-04',
    createdBy: 'Admin User',
    updateDate: '2024-12-07',
    updateBy: 'System',
  },
  {
    beritaAcaraId: 'BA-2024-009',
    tripId: 'TRP-009',
    noOrder: 'ORD-2024-009',
    status: 'Pending',
    rejectReason: '-',
    discrepancy: 'Quantity Mismatch',
    receivedDate: '2024-12-04',
    pickup: 'Balikpapan Warehouse',
    destination: 'Samarinda Store',
    transporter: 'PT Trans Utama',
    truckType: 'Box Truck',
    noPolisi: 'KT 4567 VWX',
    createdDate: '2024-12-01',
    createdBy: 'Supervisor',
    updateDate: '2024-12-04',
    updateBy: 'Warehouse Manager',
  },
  {
    beritaAcaraId: 'BA-2024-010',
    tripId: 'TRP-010',
    noOrder: 'ORD-2024-010',
    status: 'Completed',
    rejectReason: '-',
    discrepancy: 'No Discrepancy',
    receivedDate: '2024-12-10',
    pickup: 'Padang Warehouse',
    destination: 'Jambi Store',
    transporter: 'PT Trans Prima',
    truckType: 'Refrigerated',
    noPolisi: 'BA 8901 YZA',
    createdDate: '2024-12-07',
    createdBy: 'Admin User',
    updateDate: '2024-12-10',
    updateBy: 'System',
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

  // Apply discrepancy filter
  if (filterForm.value.discrepancy) {
    filtered = filtered.filter((item) => item.discrepancy === filterForm.value.discrepancy)
  }

  // Apply received date filter
  if (filterForm.value.receivedDate) {
    filtered = filtered.filter((item) => item.receivedDate === filterForm.value.receivedDate)
  }

  return filtered
})

const getStatusBadgeClass = (status: string) => {
  if (status === 'Completed') return 'badge-success'
  if (status === 'Pending') return 'badge-warning'
  if (status === 'Rejected') return 'badge-danger'
  return 'badge-secondary'
}

const getDiscrepancyBadgeClass = (discrepancy: string) => {
  if (discrepancy === 'No Discrepancy') return 'badge-success'
  if (discrepancy === 'Quantity Mismatch') return 'badge-warning'
  if (discrepancy === 'Partial Delivery') return 'badge-info'
  if (discrepancy === 'Quality Issue') return 'badge-danger'
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

  if (filterForm.value.discrepancy) {
    payload.push({ key: 'Discrepancy', value: filterForm.value.discrepancy })
  }

  if (filterForm.value.receivedDate) {
    payload.push({ key: 'Received Date', value: filterForm.value.receivedDate })
  }

  filteredPayload.value = payload
  currentPage.value = 1
  setList(filteredDataList.value)
}

const resetFilter = () => {
  filterForm.value = {
    status: '',
    discrepancy: '',
    receivedDate: '',
  }
  filteredPayload.value = []
  currentPage.value = 1
  setList(filteredDataList.value)
}

const deleteFilter = (key: string) => {
  if (key === 'Status') {
    filterForm.value.status = ''
  } else if (key === 'Discrepancy') {
    filterForm.value.discrepancy = ''
  } else if (key === 'Received Date') {
    filterForm.value.receivedDate = ''
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

const createNew = () => {
  router.push({ name: 'receivingConfirmationCreate' })
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

  &::-webkit-scrollbar {
    width: 10px;
    height: 10px;
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    width: 10px;
    height: 10px;
    border-radius: 15px;
    background-color: #dbdfe9;
  }
}
</style>

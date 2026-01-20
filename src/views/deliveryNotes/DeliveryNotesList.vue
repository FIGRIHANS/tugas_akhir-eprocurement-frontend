<template>
  <div>
    <Breadcrumb title="Delivery Notes List" :routes="routes" />
    <hr class="-mx-[24px] mb-[24px]" />

    <div class="border border-gray-200 rounded-xl p-[24px]">
      <!-- Header Section -->
      <div class="flex justify-between align-items-center gap-[8px] mb-[24px]">
        <h3 class="text-lg font-semibold">List Data</h3>
        <div class="flex align-items-center gap-3">
          <UiInputSearch v-model="search" placeholder="Search" @keypress="goSearch" />

          <!-- Filter Button -->
          <button class="btn btn-light" @click="toggleFilter()">
            <i class="ki-duotone ki-filter"></i>
            Filter
          </button>

          <button class="btn btn-primary" @click="createNew()">
            <i class="ki-duotone ki-plus-circle"></i>
            Export Data
          </button>
        </div>
      </div>

      <!-- Filter Section -->
      <div v-if="showFilter" class="border border-gray-200 rounded-lg p-4 mb-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="form-label">Status</label>
            <select v-model="filterForm.status" class="form-select">
              <option value="">All Status</option>
              <option value="Draft">Draft</option>
              <option value="Waiting Approval">Waiting Approval</option>
              <option value="Received">Received</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div>
            <label class="form-label">Vendor Code</label>
            <input
              type="text"
              v-model="filterForm.vendorCode"
              class="form-control"
              placeholder="Enter vendor code"
            />
          </div>
          <div>
            <label class="form-label">Estimated Arrival From</label>
            <input type="date" v-model="filterForm.estimatedArrivalFrom" class="form-control" />
          </div>
          <div>
            <label class="form-label">Estimated Arrival To</label>
            <input type="date" v-model="filterForm.estimatedArrivalTo" class="form-control" />
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
        <table class="table align-middle text-gray-700 font-medium text-sm">
          <thead>
            <tr>
              <th
                v-for="(item, index) in columns"
                :key="index"
                class="!border-b-blue-500 !bg-blue-100 !text-blue-500"
                :class="{
                  list__long: index !== 0,
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
              <td colspan="18" class="text-center">No data found.</td>
            </tr>
            <tr v-for="(item, index) in list" :key="index">
              <td class="text-center">
                <button
                  class="btn btn-outline btn-icon btn-primary w-[32px] h-[32px]"
                  @click="viewDetail(item.id)"
                  title="View Detail"
                >
                  <i class="ki-filled ki-eye !text-lg"></i>
                </button>
              </td>
              <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
              <td>{{ item.deliveryNoteNumber }}</td>
              <td>{{ item.tripID }}</td>
              <td>{{ item.poNumber }}</td>
              <td>
                <span class="badge badge-outline" :class="getStatusBadgeClass(item.status)">
                  {{ item.status }}
                </span>
              </td>
              <td>{{ item.vendorCode }}</td>
              <td>{{ formatDate(item.estimatedArrival) }}</td>
              <td>{{ item.pickupAddress }}</td>
              <td>{{ item.destinationAddress }}</td>
              <td>{{ item.transporter }}</td>
              <td>{{ item.truckType || '-' }}</td>
              <td>{{ item.licensePlate }}</td>
              <td>{{ formatDate(item.createdUtcDate) }}</td>
              <td>{{ item.createdBy }}</td>
              <td>{{ formatDate(item.updatedUtcDate) }}</td>
              <td>{{ item.updatedBy }}</td>
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
import DeliveryNotesService, { type DeliveryNotesData } from '@/services/deliveryNotes.service'
// Expose moment to template
const moment = momentLib
const router = useRouter()

interface FilterForm {
  status: string
  vendorCode: string
  estimatedArrivalFrom: string
  estimatedArrivalTo: string
}

const routes = ref<routeTypes[]>([
  {
    name: 'Digital Delivery Notes',
    to: '/digital-delivery-notes',
  },
])

const search = ref<string>('')
const currentPage = ref<number>(1)
const pageSize = ref<number>(5)
const list = ref<DeliveryNotesData[]>([])
const sortBy = ref<string>('')
const sortColumnName = ref<string>('')
const showFilter = ref<boolean>(false)
const filteredPayload = ref<{ key: string; value: string }[]>([])
const isLoading = ref<boolean>(false)
const errorMessage = ref<string>('')

const filterForm = ref<FilterForm>({
  status: '',
  vendorCode: '',
  estimatedArrivalFrom: '',
  estimatedArrivalTo: '',
})

const columns = ref<string[]>([
  'Action',
  'No',
  'Delivery Note Number',
  'Trip ID',
  'PO Number',
  'Status',
  'Vendor Code',
  'Estimated Arrival',
  'Pickup Address',
  'Destination Address',
  'Transporter',
  'Truck Type',
  'License Plate',
  'Created Date',
  'Created By',
  'Update Date',
  'Update By',
])

const dataList = ref<DeliveryNotesData[]>([])
const fetchData = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await DeliveryNotesService.getList({
      searchText: search.value || undefined,
      status: filterForm.value.status || undefined,
      vendorCode: filterForm.value.vendorCode || undefined,
      estimatedArrivalFrom: filterForm.value.estimatedArrivalFrom || undefined,
      estimatedArrivalTo: filterForm.value.estimatedArrivalTo || undefined,
    })

    dataList.value = response
    setList(filteredDataList.value)
  } catch (error: unknown) {
    console.error('Failed to fetch data:', error)
    errorMessage.value = 'Gagal mengambil data. Silakan coba lagi.'
  } finally {
    isLoading.value = false
  }
}

// Computed property for filtered data
const filteredDataList = computed(() => {
  let filtered = cloneDeep(dataList.value)

  // Apply search filter (client-side untuk pencarian lokal)
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

  // Note: hasDiscrepancy is not in DeliveryNotesData interface
  // This filter is commented out until the backend adds this field
  // if (filterForm.value.hasDiscrepancy) {
  //   const hasDiscrepancy = filterForm.value.hasDiscrepancy === 'true'
  //   filtered = filtered.filter((item) => item.hasDiscrepancy === hasDiscrepancy)
  // }

  return filtered
})

const getStatusBadgeClass = (status: string) => {
  if (status === 'Received') return 'badge-success'
  if (status === 'Waiting Approval') return 'badge-warning'
  if (status === 'Draft') return 'badge-info'
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

const setList = (listData: DeliveryNotesData[]) => {
  const result: DeliveryNotesData[] = []
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

  if (filterForm.value.vendorCode) {
    payload.push({ key: 'Vendor Code', value: filterForm.value.vendorCode })
  }

  if (filterForm.value.estimatedArrivalFrom) {
    payload.push({ key: 'Estimated Arrival From', value: filterForm.value.estimatedArrivalFrom })
  }

  if (filterForm.value.estimatedArrivalTo) {
    payload.push({ key: 'Estimated Arrival To', value: filterForm.value.estimatedArrivalTo })
  }

  filteredPayload.value = payload
  currentPage.value = 1
  setList(filteredDataList.value)
}

const resetFilter = () => {
  filterForm.value = {
    status: '',
    vendorCode: '',
    estimatedArrivalFrom: '',
    estimatedArrivalTo: '',
  }
  filteredPayload.value = []
  currentPage.value = 1
  setList(filteredDataList.value)
}

const deleteFilter = (key: string) => {
  if (key === 'Status') {
    filterForm.value.status = ''
  } else if (key === 'Vendor Code') {
    filterForm.value.vendorCode = ''
  } else if (key === 'Estimated Arrival From') {
    filterForm.value.estimatedArrivalFrom = ''
  } else if (key === 'Estimated Arrival To') {
    filterForm.value.estimatedArrivalTo = ''
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
  let result: DeliveryNotesData[] = []

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

const viewDetail = (id: number) => {
  router.push({ name: 'receivingConfirmationDetail', params: { id } })
}

onMounted(() => {
  fetchData()
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

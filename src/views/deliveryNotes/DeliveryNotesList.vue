<template>
  <div>
    <Breadcrumb title="Delivery Notes List" :routes="routes" />
    <hr class="-mx-[24px] mb-[24px]" />

    <!-- Analytics Widgets -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      <!-- Total -->
      <div class="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
        <div class="w-11 h-11 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
          <i class="ki-duotone ki-package text-teal-600 text-xl"></i>
        </div>
        <div>
          <p class="text-[11px] text-gray-400 font-medium uppercase tracking-wide">Total DN</p>
          <p class="text-2xl font-bold text-gray-800 leading-tight">{{ dnStats.total }}</p>
        </div>
      </div>
      <!-- On Delivery -->
      <div class="bg-white border border-amber-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
        <div class="w-11 h-11 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
          <i class="ki-duotone ki-truck text-amber-500 text-xl"></i>
        </div>
        <div>
          <p class="text-[11px] text-gray-400 font-medium uppercase tracking-wide">On Delivery</p>
          <p class="text-2xl font-bold text-amber-600 leading-tight">{{ dnStats.onDelivery }}</p>
        </div>
      </div>
      <!-- Received -->
      <div class="bg-white border border-green-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
        <div class="w-11 h-11 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
          <i class="ki-duotone ki-check-circle text-green-600 text-xl"></i>
        </div>
        <div>
          <p class="text-[11px] text-gray-400 font-medium uppercase tracking-wide">Received</p>
          <p class="text-2xl font-bold text-green-600 leading-tight">{{ dnStats.received }}</p>
        </div>
      </div>
      <!-- Partial Received -->
      <div class="bg-white border border-orange-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
        <div class="w-11 h-11 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
          <i class="ki-duotone ki-information-2 text-orange-500 text-xl"></i>
        </div>
        <div>
          <p class="text-[11px] text-gray-400 font-medium uppercase tracking-wide">Partial Received</p>
          <p class="text-2xl font-bold text-orange-500 leading-tight">{{ dnStats.partialReceived }}</p>
        </div>
      </div>
      <!-- Completed -->
      <div class="bg-white border border-teal-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
        <div class="w-11 h-11 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
          <i class="ki-duotone ki-shield-tick text-teal-600 text-xl"></i>
        </div>
        <div>
          <p class="text-[11px] text-gray-400 font-medium uppercase tracking-wide">Completed</p>
          <p class="text-2xl font-bold text-teal-600 leading-tight">{{ dnStats.completed }}</p>
        </div>
      </div>
    </div>

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

          <button v-if="canCreate" class="btn btn-primary" @click="createNew()">
            <i class="ki-duotone ki-plus-circle"></i>
            Create
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
              <option value="On Delivery">On Delivery</option>
              <option value="Received">Received</option>
              <option value="Partial Received">Partial Received</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div v-if="!isVendorUser">
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
                class="!border-b-teal-500 !bg-teal-100 !text-teal-500"
                :class="{
                  list__long: index !== 0,
                  'cursor-pointer': item !== 'Action',
                  '!text-teal-500': item === sortColumnName && sortBy !== '',
                }"
                @click="item !== 'Action' ? sortColumn(item) : null"
              >
                {{ item }}
                <i v-if="item !== 'Action'" class="ki-filled ki-arrow-up-down"></i>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="list.length === 0">
              <td :colspan="columns.length" class="text-center">
                <span v-if="isLoading">Loading...</span>
                <span v-else-if="errorMessage">{{ errorMessage }}</span>
                <span v-else>No data found.</span>
              </td>
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
              <td v-if="!isVendorUser">{{ item.vendorCode }}</td>
              <td>{{ formatDate(item.estimatedArrival) }}</td>
              <td>{{ item.pickupAddress }}</td>
              <td>{{ item.destinationAddress }}</td>
              <td>{{ item.transporter }}</td>
              <td>{{ item.truckType || '-' }}</td>
              <td>{{ item.licensePlate }}</td>
              <td>{{ formatDate(item.createdUtcDate) }}</td>
              <!-- <td>{{ item.createdBy }}</td> -->
              <td>{{ formatDate(item.updatedUtcDate) }}</td>
              <!-- <td>{{ item.updatedBy }}</td> -->
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="flex items-center justify-between mt-[24px]">
        <p class="m-0 text-sm">
          Showing
          {{
            totalItems === 0
              ? 0
              : pageSize * currentPage > totalItems
                ? totalItems
                : pageSize * currentPage
          }}
          of {{ totalItems }} entries
        </p>
        <LPagination
          :totalItems="totalItems"
          :pageSize="pageSize"
          :currentPage="currentPage"
          @pageChange="setPage"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, watch, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { type routeTypes } from '@/core/type/components/breadcrumb'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import LPagination from '@/components/pagination/LPagination.vue'
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import momentLib from 'moment'
import { cloneDeep } from 'lodash'
import DeliveryNotesService, { type DeliveryNotesData } from '@/services/deliveryNotes.service'
import { useLoginStore } from '@/stores/views/login'
import { isRouteAllowed } from '@/core/utils/routeAccess'
// Expose moment to template
const moment = momentLib
const router = useRouter()
const userStore = useLoginStore()

const canCreate = computed(() =>
  isRouteAllowed('deliveryNotesCreate', userStore.userData),
)
const isVendorUser = computed(() => !!userStore.userData?.profile?.vendorCode)
const vendorID = computed(() => userStore.userData?.profile?.profileId ?? undefined)
const vendorCodeUser = computed(() => userStore.userData?.profile?.vendorCode ?? undefined)

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
const pageSize = ref<number>(10)
const totalItems = ref<number>(0)
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

const columns = computed(() => {
  const base = [
    'Action', 'No', 'Delivery Note Number', 'Trip ID', 'PO Number', 'Status',
  ]
  if (!isVendorUser.value) {
    base.push('Vendor Code')
  }
  return [
    ...base,
    'Estimated Arrival', 'Pickup Address', 'Destination Address',
    'Transporter', 'Truck Type', 'License Plate',
    'Created Date', 'Updated Date',
  ]
})

const dnStats = reactive({
  total: 0,
  onDelivery: 0,
  received: 0,
  partialReceived: 0,
  completed: 0,
})

const buildQueryParams = () => ({
  searchText: search.value || undefined,
  status: filterForm.value.status || undefined,
  vendorCode: isVendorUser.value ? vendorCodeUser.value : filterForm.value.vendorCode || undefined,
  vendorID: isVendorUser.value ? String(vendorID.value) : undefined,
  estimatedArrivalFrom: filterForm.value.estimatedArrivalFrom || undefined,
  estimatedArrivalTo: filterForm.value.estimatedArrivalTo || undefined,
  page: currentPage.value,
  pageSize: pageSize.value,
})

const fetchData = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await DeliveryNotesService.getList(buildQueryParams())

    list.value = response.items
    totalItems.value = response.total
    currentPage.value = response.page
    dnStats.total = response.total
    dnStats.onDelivery = response.onDelivery
    dnStats.received = response.received
    dnStats.partialReceived = response.partialReceived
    dnStats.completed = response.completed
  } catch (error: unknown) {
    console.error('Failed to fetch data:', error)
    errorMessage.value = 'Gagal mengambil data. Silakan coba lagi.'
    list.value = []
    totalItems.value = 0
  } finally {
    isLoading.value = false
  }
}

const getStatusBadgeClass = (status: string) => {
  switch (status.trim().toLowerCase()) {
    case 'draft':
      return 'badge-info'
    case 'on delivery':
      return 'badge-primary'
    case 'received':
      return 'badge-success'
    case 'partial received':
      return 'badge-warning'
    case 'completed':
      return 'badge-dark'
    default:
      return 'badge-secondary'
  }
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

const setPage = (value: number) => {
  currentPage.value = value
  fetchData()
}

const goSearch = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    currentPage.value = 1
    fetchData()
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
  fetchData()
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
  fetchData()
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
  fetchData()
}

const sortColumn = (columnName: string | null) => {
  const columnMap = {
    'Delivery Note Number': 'deliveryNoteNumber',
    'Trip ID': 'tripID',
    'PO Number': 'poNumber',
    Status: 'status',
    'Estimated Arrival': 'estimatedArrival',
    Transporter: 'transporter',
    'Created Date': 'createdUtcDate',
  } as { [key: string]: string }

  const roleSort = ['asc', 'desc', '']
  const listData = cloneDeep(list.value)
  let result: DeliveryNotesData[] = []

  if (columnName) {
    if (sortColumnName.value !== columnName) sortBy.value = ''
    sortColumnName.value = columnName

    const indexSort = roleSort.findIndex((item) => item === sortBy.value)
    if (indexSort === -1) return
    sortBy.value = indexSort + 1 === roleSort.length ? roleSort[0] : roleSort[indexSort + 1]

    if (!sortBy.value) return
  }

  const name = columnName || sortColumnName.value
  const field = columnMap[name]
  if (!field) return

  if (name === 'Estimated Arrival' || name === 'Created Date') {
    result = listData.sort((a, b) => {
      const convA = a[field as keyof DeliveryNotesData]
        ? new Date(String(a[field as keyof DeliveryNotesData])).getTime()
        : 0
      const convB = b[field as keyof DeliveryNotesData]
        ? new Date(String(b[field as keyof DeliveryNotesData])).getTime()
        : 0
      if (sortBy.value === 'asc') {
        return convA - convB
      }
      return convB - convA
    })
  } else {
    result = listData.sort((a, b) => {
      const convA = a[field as keyof DeliveryNotesData]
        ? String(a[field as keyof DeliveryNotesData])
        : ''
      const convB = b[field as keyof DeliveryNotesData]
        ? String(b[field as keyof DeliveryNotesData])
        : ''
      if (sortBy.value === 'asc') {
        return convA.localeCompare(convB)
      }
      return convB.localeCompare(convA)
    })
  }

  list.value = result
}

const createNew = () => {
  router.push({ name: 'deliveryNotesCreate' })
}

const viewDetail = (id: number) => {
  router.push({ name: 'deliveryNotesDetail', params: { id } })
}

onMounted(() => {
  if (userStore.userData) {
    fetchData()
  } else {
    const unwatch = watch(() => userStore.userData, (newVal) => {
      if (newVal) {
        fetchData()
        unwatch()
      }
    })
  }
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

<template>
  <div>
    <Breadcrumb title="Mock SAP Purchase Orders" :routes="routes" />
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

          <button class="btn btn-primary" @click="refreshData()">
            <i class="ki-duotone ki-arrows-circle"></i>
            Refresh
          </button>
        </div>
      </div>

      <!-- Filter Section -->
      <div v-if="showFilter" class="border border-gray-200 rounded-lg p-4 mb-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="form-label">PO Number</label>
            <input
              type="text"
              v-model="filterForm.poNumber"
              class="form-control"
              placeholder="Enter PO number"
            />
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
          <div v-if="!isVendorUser">
            <label class="form-label">Vendor Name</label>
            <input
              type="text"
              v-model="filterForm.vendorName"
              class="form-control"
              placeholder="Enter vendor name"
            />
          </div>
          <div>
            <label class="form-label">Status</label>
            <select v-model="filterForm.status" class="form-select">
              <option value="">All Status</option>
              <option value="Open">Open</option>
              <option value="Partially Delivered">Partially Delivered</option>
              <option value="Delivered">Delivered</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          <div>
            <label class="form-label">PO Date From</label>
            <input type="date" v-model="filterForm.poDateFrom" class="form-control" />
          </div>
          <div>
            <label class="form-label">PO Date To</label>
            <input type="date" v-model="filterForm.poDateTo" class="form-control" />
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

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-20">
        <div class="text-center">
          <i class="ki-duotone ki-loading text-4xl text-blue-500 animate-spin"></i>
          <p class="mt-4 text-gray-600">Loading data...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="errorMessage" class="border border-red-200 rounded-lg p-4 bg-red-50 mb-4">
        <div class="flex items-center gap-2 text-red-700">
          <i class="ki-duotone ki-information text-2xl"></i>
          <span>{{ errorMessage }}</span>
        </div>
      </div>

      <!-- Table Section -->
      <div v-else class="overflow-x-auto list__table mt-[24px]">
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
              <td :colspan="columns.length" class="text-center">No data found.</td>
            </tr>
            <tr v-for="(item, index) in list" :key="index">
              <td class="text-center">
                <button
                  class="btn btn-outline btn-icon btn-primary w-[32px] h-[32px]"
                  @click="viewDetail(item.poNumber)"
                  title="View Detail"
                >
                  <i class="ki-filled ki-eye !text-lg"></i>
                </button>
              </td>
              <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
              <td>{{ item.poNumber }}</td>
              <td v-if="!isVendorUser">{{ item.vendorCode }}</td>
              <td v-if="!isVendorUser">{{ item.vendorName }}</td>
              <td>{{ formatDate(item.poDate) }}</td>
              <td class="text-right">{{ formatCurrency(item.totalAmount) }}</td>
              <td>
                <span class="badge badge-outline" :class="getStatusBadgeClass(item.status)">
                  {{ item.status }}
                </span>
              </td>
              <td>{{ formatDate(item.createdUtcDate) }}</td>
              <td>{{ item.createdBy }}</td>
              <td>{{ formatDate(item.updatedUtcDate) }}</td>
              <td>{{ item.updatedBy }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="flex items-center justify-between mt-[24px]" v-if="!isLoading">
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
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { type routeTypes } from '@/core/type/components/breadcrumb'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import LPagination from '@/components/pagination/LPagination.vue'
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import momentLib from 'moment'
import { cloneDeep } from 'lodash'
import MockSapService, { type MockSapHeaderData } from '@/services/mockSap.service'
import { useLoginStore } from '@/stores/views/login'

const moment = momentLib
const router = useRouter()
const userStore = useLoginStore()

const isVendorUser = computed(() => !!userStore.userData?.profile?.vendorCode)
const vendorID = computed(() => userStore.userData?.profile?.profileId ?? undefined)
const vendorCodeUser = computed(() => userStore.userData?.profile?.vendorCode ?? undefined)

interface FilterForm {
  poNumber: string
  vendorCode: string
  vendorName: string
  status: string
  poDateFrom: string
  poDateTo: string
}

const routes = ref<routeTypes[]>([
  {
    name: 'Mock SAP',
    to: '/mock-sap',
  },
])

const search = ref<string>('')
const currentPage = ref<number>(1)
const pageSize = ref<number>(10)
const list = ref<MockSapHeaderData[]>([])
const sortBy = ref<string>('')
const sortColumnName = ref<string>('')
const showFilter = ref<boolean>(false)
const filteredPayload = ref<{ key: string; value: string }[]>([])
const isLoading = ref<boolean>(false)
const errorMessage = ref<string>('')

const filterForm = ref<FilterForm>({
  poNumber: '',
  vendorCode: '',
  vendorName: '',
  status: '',
  poDateFrom: '',
  poDateTo: '',
})

const columns = computed(() => {
  const base = ['Action', 'No', 'PO Number']
  if (!isVendorUser.value) {
    base.push('Vendor Code', 'Vendor Name')
  }
  return [...base, 'PO Date', 'Total Amount', 'Status', 'Created Date', 'Created By', 'Updated Date', 'Updated By']
})

const dataList = ref<MockSapHeaderData[]>([])

const fetchData = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await MockSapService.getList({
      searchText: search.value || undefined,
      poNumber: filterForm.value.poNumber || undefined,
      vendorCode: isVendorUser.value ? vendorCodeUser.value : filterForm.value.vendorCode || undefined,
      vendorID: isVendorUser.value ? vendorID.value.toString() : undefined,
      vendorName: isVendorUser.value ? undefined : filterForm.value.vendorName || undefined,
      poDateFrom: filterForm.value.poDateFrom || undefined,
      poDateTo: filterForm.value.poDateTo || undefined,
    })

    dataList.value = response
    setList(filteredDataList.value)
  } catch (error: unknown) {
    console.error('Failed to fetch data:', error)
    errorMessage.value = 'Failed to fetch data. Please try again.'
  } finally {
    isLoading.value = false
  }
}

// Computed property for filtered data
const filteredDataList = computed(() => {
  let filtered = cloneDeep(dataList.value)

  // Apply search filter (client-side)
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

  return filtered
})

const getStatusBadgeClass = (status: string) => {
  if (status === 'Delivered') return 'badge-success'
  if (status === 'Partially Delivered') return 'badge-warning'
  if (status === 'Open') return 'badge-info'
  if (status === 'Closed') return 'badge-secondary'
  return 'badge-secondary'
}

const formatDate = (date: string) => {
  if (!date) return '-'
  return moment(date).format('YYYY/MM/DD')
}

const formatCurrency = (amount: number | null) => {
  if (amount === null || amount === undefined) return '-'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

const setList = (listData: MockSapHeaderData[]) => {
  const result: MockSapHeaderData[] = []
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
    fetchData()
  }
}

const toggleFilter = () => {
  showFilter.value = !showFilter.value
}

const applyFilter = () => {
  const payload: { key: string; value: string }[] = []

  if (filterForm.value.poNumber) {
    payload.push({ key: 'PO Number', value: filterForm.value.poNumber })
  }

  if (filterForm.value.vendorCode) {
    payload.push({ key: 'Vendor Code', value: filterForm.value.vendorCode })
  }

  if (filterForm.value.vendorName) {
    payload.push({ key: 'Vendor Name', value: filterForm.value.vendorName })
  }

  if (filterForm.value.status) {
    payload.push({ key: 'Status', value: filterForm.value.status })
  }

  if (filterForm.value.poDateFrom) {
    payload.push({ key: 'PO Date From', value: filterForm.value.poDateFrom })
  }

  if (filterForm.value.poDateTo) {
    payload.push({ key: 'PO Date To', value: filterForm.value.poDateTo })
  }

  filteredPayload.value = payload
  currentPage.value = 1
  fetchData()
}

const resetFilter = () => {
  filterForm.value = {
    poNumber: '',
    vendorCode: '',
    vendorName: '',
    status: '',
    poDateFrom: '',
    poDateTo: '',
  }
  filteredPayload.value = []
  currentPage.value = 1
  fetchData()
}

const deleteFilter = (key: string) => {
  if (key === 'PO Number') {
    filterForm.value.poNumber = ''
  } else if (key === 'Vendor Code') {
    filterForm.value.vendorCode = ''
  } else if (key === 'Vendor Name') {
    filterForm.value.vendorName = ''
  } else if (key === 'Status') {
    filterForm.value.status = ''
  } else if (key === 'PO Date From') {
    filterForm.value.poDateFrom = ''
  } else if (key === 'PO Date To') {
    filterForm.value.poDateTo = ''
  }

  filteredPayload.value = filteredPayload.value.filter((item) => item.key !== key)
  currentPage.value = 1
  fetchData()
}

const sortColumn = (columnName: string | null) => {
  const columnMap = {
    'PO Number': 'poNumber',
    'Vendor Code': 'vendorCode',
    'Vendor Name': 'vendorName',
    'PO Date': 'poDate',
    'Total Amount': 'totalAmount',
    Status: 'status',
  } as { [key: string]: string }

  const roleSort = ['asc', 'desc', '']
  const listData = cloneDeep(filteredDataList.value)
  let result: MockSapHeaderData[] = []

  if (columnName) {
    if (sortColumnName.value !== columnName) sortBy.value = ''
    sortColumnName.value = columnName

    const indexSort = roleSort.findIndex((item) => item === sortBy.value)
    if (indexSort === -1) return setList(filteredDataList.value)
    sortBy.value = indexSort + 1 === roleSort.length ? roleSort[0] : roleSort[indexSort + 1]

    if (!sortBy.value) return setList(filteredDataList.value)
  }

  const name = columnName || sortColumnName.value

  if (name === 'PO Date') {
    result = listData.sort((a, b) => {
      const convA = a[columnMap[name]] ? new Date(a[columnMap[name]]).getTime() : 0
      const convB = b[columnMap[name]] ? new Date(b[columnMap[name]]).getTime() : 0
      if (sortBy.value === 'asc') {
        return convA - convB
      } else {
        return convB - convA
      }
    })
  } else if (name === 'Total Amount') {
    result = listData.sort((a, b) => {
      const convA = a.totalAmount || 0
      const convB = b.totalAmount || 0
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

const refreshData = () => {
  fetchData()
}

const viewDetail = (poNumber: string) => {
  router.push({ name: 'mockSapDetail', params: { poNumber } })
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


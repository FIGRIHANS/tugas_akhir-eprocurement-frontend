<template>
  <div>
    <BreadcrumbView title="Log Activity" :routes="[
      { name: 'Log Activity', to: '#' },
    ]" />

    <div class="card">
      <div class="card-header">
        <div class="flex w-full justify-between items-center">
          <h2 class="text-lg font-bold text-slate-800">Log Activity</h2>
          <div class="flex gap-2">
            <UiInputSearch v-model="search" placeholder="Search" />
            <!-- Filter Dropdown -->
            <div class="dropdown" data-dropdown="true" data-dropdown-trigger="click">
              <button class="dropdown-toggle btn btn-primary">
                <i class="ki-filled ki-filter"></i>
                Filter
              </button>
              <div class="dropdown-content w-full max-w-[305px] p-[16px]">
                <p class="text-lg font-semibold mb-[8px]">Filter</p>
                <div class="flex flex-col gap-[24px] py-[16px]">
                  <div class="relative">
                    <label class="absolute text-xs font-normal text-gray-500 -top-[8px] left-[10px] bg-white">
                      Transaction Type
                    </label>
                    <select v-model="filters.transactionType" class="select" name="select">
                      <option value="">All</option>
                      <option value="PO">PO</option>
                      <option value="Non PO">Non PO</option>
                    </select>
                  </div>
                  <div class="relative">
                    <label class="absolute text-xs font-normal text-gray-500 -top-[8px] left-[10px] bg-white">
                      Employee Name
                    </label>
                    <select v-model="filters.employeeName" class="select" name="select">
                      <option value="">All</option>
                      <option v-for="item of employeeNameOptions" :key="item.value" :value="item.value">
                        {{ item.text }}
                      </option>
                    </select>
                  </div>
                  <div class="relative">
                    <label class="absolute text-xs font-normal text-gray-500 -top-[8px] left-[10px] bg-white">
                      Date Range
                    </label>
                    <input type="date" v-model="filters.dateFrom" class="input" placeholder="From" />
                  </div>
                  <div class="relative">
                    <input type="date" v-model="filters.dateTo" class="input" placeholder="To" />
                  </div>
                </div>
                <div class="flex align-center justify-between gap-[16px]">
                  <button class="btn btn-outline btn-primary btn-lg" @click="resetFilters">
                    <i class="ki-duotone ki-arrows-circle"></i>
                    Reset
                  </button>
                  <button class="btn btn-primary btn-lg" data-dropdown-dismiss="true">
                    <i class="ki-filled ki-check-circle"></i>
                    Apply
                  </button>
                </div>
              </div>
            </div>
            <UiButton variant="primary" @click="syncLogActivity" :disabled="isSyncing">
              <UiIcon variant="duotone" name="arrows-circle" />
              {{ isSyncing ? 'Syncing...' : 'Sync Log Activity' }}
            </UiButton>
          </div>
        </div>
      </div>
      <div class="card-body integration">
        <div>
          <div v-if="loading" class="text-center py-4">Loading log activities...</div>
          <div v-else-if="error" class="text-center py-4 text-red-500">
            Error: {{ error }}
          </div>

          <div v-else-if="filteredLogActivities.length > 0"
            class="integration__table border border-gray-200 rounded-xl overflow-x-auto">
            <table class="table align-middle text-gray-700 font-medium text-sm min-w-[1200px]">
              <thead>
                <tr>
                  <th class="integration__field-base !border-b-blue-500 !bg-blue-100 !text-blue-500"></th>
                  <th class="text-nowrap integration__field-base !border-b-blue-500 !bg-blue-100 !text-blue-500"
                    v-for="item in columns" :key="item.name">
                    {{ item.name }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in filteredLogActivities" :key="row.id"
                  class="integration__field-items hover:bg-blue-50">
                  <!-- ACTION -->
                  <td>
                    <div class="dropdown" data-dropdown="true" data-dropdown-trigger="click"
                      data-dropdown-placement="bottom-end">
                      <UiButton class="dropdown-toggle" variant="light" :outline="true" :icon="true" size="sm">
                        <UiIcon name="dots-vertical" />
                      </UiButton>

                      <div class="dropdown-content w-auto p-4 space-y-2">
                        <div class="flex flex-col space-y-2">
                          <UiButton variant="light" class="border-none" :outline="true" size="md"
                            @click="viewDetail(row.id)">
                            <UiIcon name="eye" class="mr-2" />
                            View Details
                          </UiButton>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td class="font-medium">{{ formatDate(row.date) }}</td>
                  <td>{{ row.referenceNumber }}</td>
                  <td>{{ row.invoiceVendorNumber }}</td>
                  <td>
                    <span class="badge" :class="row.transactionType === 'PO'
                      ? 'bg-blue-50 text-blue-600'
                      : 'bg-green-50 text-green-600'">
                      {{ row.transactionType }}
                    </span>
                  </td>
                  <td>{{ row.employeeName }}</td>
                  <td>{{ row.employeeEmail }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else class="text-center py-4">No log activities found.</div>
        </div>

        <LPagination v-if="filteredLogActivities.length > 0" class="mt-4" :totalItems="totalItems"
          :pageSize="pageSize" :currentPage="currentPage" @page-change="changePage" />
      </div>
    </div>

    <!-- Detail modal -->
    <UiModal :title="'Log Activity Details'" v-model="isDetailModalOpen" size="lg">
      <div v-if="selectedLog" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-sm text-gray-500">Date</label>
            <p class="font-medium">{{ formatDate(selectedLog.date) }}</p>
          </div>
          <div>
            <label class="text-sm text-gray-500">Reference Number</label>
            <p class="font-medium">{{ selectedLog.referenceNumber }}</p>
          </div>
          <div>
            <label class="text-sm text-gray-500">Invoice Vendor Number</label>
            <p class="font-medium">{{ selectedLog.invoiceVendorNumber }}</p>
          </div>
          <div>
            <label class="text-sm text-gray-500">Transaction Type</label>
            <p class="font-medium">{{ selectedLog.transactionType }}</p>
          </div>
          <div>
            <label class="text-sm text-gray-500">Employee Name</label>
            <p class="font-medium">{{ selectedLog.employeeName }}</p>
          </div>
          <div>
            <label class="text-sm text-gray-500">Employee Email</label>
            <p class="font-medium">{{ selectedLog.employeeEmail }}</p>
          </div>
          <div class="col-span-2">
            <label class="text-sm text-gray-500">Description</label>
            <p class="font-medium">{{ selectedLog.description }}</p>
          </div>
        </div>
      </div>
      <div class="mt-4 w-full gap-2 justify-end items-center flex">
        <UiButton variant="primary" @click="isDetailModalOpen = false">Close</UiButton>
      </div>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import BreadcrumbView from '@/components/BreadcrumbView.vue'
import UiModal from '@/components/modal/UiModal.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import { computed, onMounted, reactive, ref } from 'vue'
import LPagination from '@/components/pagination/LPagination.vue'

// Types
interface ILogActivity {
  id: string
  date: string
  referenceNumber: string
  invoiceVendorNumber: string
  transactionType: 'PO' | 'Non PO'
  employeeName: string
  employeeEmail: string
  description: string
}

// State
const search = ref('')
const isDetailModalOpen = ref(false)
const selectedLog = ref<ILogActivity | null>(null)
const loading = ref(false)
const error = ref('')
const isSyncing = ref(false)

const logActivities = ref<ILogActivity[]>([
  {
    id: '1',
    date: '2024-06-15',
    referenceNumber: 'INV-001',
    invoiceVendorNumber: 'VEN-12345',
    transactionType: 'PO',
    employeeName: 'John Doe',
    employeeEmail: 'john.doe@example.com',
    description: 'Invoice created and submitted for approval',
  },
  {
    id: '2',
    date: '2024-06-14',
    referenceNumber: 'INV-002',
    invoiceVendorNumber: 'VEN-67890',
    transactionType: 'Non PO',
    employeeName: 'Jane Smith',
    employeeEmail: 'jane.smith@example.com',
    description: 'Invoice verified and approved',
  },
  {
    id: '3',
    date: '2024-06-13',
    referenceNumber: 'INV-003',
    invoiceVendorNumber: 'VEN-11111',
    transactionType: 'PO',
    employeeName: 'Bob Johnson',
    employeeEmail: 'bob.johnson@example.com',
    description: 'Invoice processing completed',
  },
])

const currentPage = ref(1)
const pageSize = ref(10)
const totalItems = ref(logActivities.value.length)

const filters = reactive({
  transactionType: '',
  employeeName: '',
  dateFrom: '',
  dateTo: '',
})

const employeeNameOptions = [
  { text: 'John Doe', value: 'John Doe' },
  { text: 'Jane Smith', value: 'Jane Smith' },
  { text: 'Bob Johnson', value: 'Bob Johnson' },
]

const columns = ref([
  { name: 'Date' },
  { name: 'Reference Number' },
  { name: 'Invoice Vendor Number' },
  { name: 'Transaction Type' },
  { name: 'Employee Name' },
  { name: 'Employee Email' },
])

// Helper function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

// Filters and pagination
const filteredLogActivities = computed(() => {
  let list = logActivities.value

  const q = search.value.toLowerCase().trim()
  if (q) {
    list = list.filter(
      (i) =>
        i.referenceNumber.toLowerCase().includes(q) ||
        i.invoiceVendorNumber.toLowerCase().includes(q) ||
        i.employeeName.toLowerCase().includes(q) ||
        i.employeeEmail.toLowerCase().includes(q),
    )
  }

  if (filters.transactionType) {
    list = list.filter((i) => i.transactionType === filters.transactionType)
  }

  if (filters.employeeName) {
    list = list.filter((i) => i.employeeName === filters.employeeName)
  }

  if (filters.dateFrom) {
    list = list.filter((i) => new Date(i.date) >= new Date(filters.dateFrom))
  }

  if (filters.dateTo) {
    list = list.filter((i) => new Date(i.date) <= new Date(filters.dateTo))
  }


  // Apply pagination
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  return list.slice(startIndex, endIndex)
})

// Methods
const resetFilters = () => {
  filters.transactionType = ''
  filters.employeeName = ''
  filters.dateFrom = ''
  filters.dateTo = ''
  currentPage.value = 1
}

const changePage = (page: number) => {
  currentPage.value = page
}

const viewDetail = (id: string) => {
  const log = logActivities.value.find(l => l.id === id)
  if (log) {
    selectedLog.value = log
    isDetailModalOpen.value = true
  }
}

const syncLogActivity = async () => {
  isSyncing.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Add new log activities or update existing ones
    // This is a placeholder for the actual API call
    console.log('Syncing log activities...')
  } catch (err) {
    error.value = 'Failed to sync log activities'
    console.error(err)
  } finally {
    isSyncing.value = false
  }
}

onMounted(() => {
  loading.value = false
})
</script>

<style lang="scss" scoped>
@use '../workflowConfiguration/styles/integration-list.scss';
</style>

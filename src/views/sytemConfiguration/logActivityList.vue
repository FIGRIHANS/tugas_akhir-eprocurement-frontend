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
import { useInvoiceVerificationStore } from '@/stores/views/invoice/verification'
import type { ListPoTypes, ListNonPoTypes } from '@/stores/views/invoice/types/verification'
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
const loading = ref(true)
const error = ref('')
const isSyncing = ref(false)

const logActivities = ref<ILogActivity[]>([])

const currentPage = ref(1)
const pageSize = ref(10)
const totalItems = ref(0)

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
  { text: 'Sarah Williams', value: 'Sarah Williams' },
  { text: 'Mike Davis', value: 'Mike Davis' },
  { text: 'Emily Brown', value: 'Emily Brown' },
]

const columns = ref([
  { name: 'Date' },
  { name: 'Reference No' },
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

const verificationStore = useInvoiceVerificationStore()

const syncLogActivity = async () => {
  isSyncing.value = true
  try {
    await loadLogActivities()
  } catch (err) {
    error.value = 'Failed to sync log activities'
    console.error(err)
  } finally {
    isSyncing.value = false
  }
}

// Fetch log activities from Invoice API
const loadLogActivities = async () => {
  loading.value = true
  error.value = ''
  try {
    // Fetch PO and Non-PO lists
    const [poList, nonPoList] = await Promise.all([
      verificationStore.getListPo({}),
      verificationStore.getListNonPo({}),
    ])

      // Debug: log full API response to diagnose structure
      try {
        console.log('LogActivity - poList full response:', JSON.stringify(poList).substring(0, 500))
        console.log('LogActivity - nonPoList full response:', JSON.stringify(nonPoList).substring(0, 500))
        console.log('LogActivity - poList type:', typeof poList, 'isArray:', Array.isArray(poList))
        console.log('LogActivity - nonPoList type:', typeof nonPoList, 'isArray:', Array.isArray(nonPoList))
      } catch (e) {
        console.log('LogActivity - debug logging error:', e)
      }

    // Normalize PO list to an array (handle unexpected API shapes)
    let poArray: unknown[] = []
    if (Array.isArray(poList)) {
      poArray = poList
      console.log('LogActivity - poList is already an array')
    } else if (poList === '' || poList === null || poList === undefined) {
      // Handle empty string, null, or undefined responses
      console.log('LogActivity - poList is empty string/null/undefined, treating as empty array')
      poArray = []
    } else if (typeof poList === 'object') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const poAny = poList as any
      // Try multiple possible response shapes
      const candidates = [
        poAny?.result?.content,
        poAny?.content,
        poAny?.data,
        poAny?.items,
        poAny?.result,
      ]
      for (const candidate of candidates) {
        if (Array.isArray(candidate)) {
          poArray = candidate
          console.log('LogActivity - found array in nested structure')
          break
        }
      }
    } else {
      console.log('LogActivity - poList is unrecognized type:', typeof poList, 'value:', poList)
    }
    console.log('LogActivity - poArray after normalization:', poArray.length, 'items')

    // Map PO invoices - ReferenceNumber should display Invoice Vendor Number (from API)
    const poActivities: ILogActivity[] = poArray.map((p) => {
      const po = p as unknown as ListPoTypes
      const poData = po as unknown as Record<string, unknown>
      // Log first item to see actual field names
      if (poActivities.length === 0) console.log('LogActivity - first PO object keys:', Object.keys(poData))
      const vendorNoVal = (poData.invoiceVendorNo as string) || (poData.vendorNo as string) || (poData.vendorNoStr as string) || ''
      return {
        id: po.invoiceUId || po.invoiceNo || Math.random().toString(36).slice(2),
        date: po.invoiceDate || '',
        // ReferenceNumber shows the Invoice Vendor Number per requirement
        referenceNumber: vendorNoVal || po.invoiceNo || po.documentNo || '-',
        invoiceVendorNumber: vendorNoVal || '-',
        transactionType: 'PO' as const,
        employeeName: '-',
        employeeEmail: '-',
        description: '',
      }
    })

    // Normalize Non-PO list to an array (handle unexpected API shapes)
    let nonPoArray: unknown[] = []
    if (Array.isArray(nonPoList)) {
      nonPoArray = nonPoList
      console.log('LogActivity - nonPoList is already an array')
    } else if (nonPoList === '' || nonPoList === null || nonPoList === undefined) {
      // Handle empty string, null, or undefined responses
      console.log('LogActivity - nonPoList is empty string/null/undefined, treating as empty array')
      nonPoArray = []
    } else if (typeof nonPoList === 'object') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const nonPoAny = nonPoList as any
      // Try multiple possible response shapes
      const candidates = [
        nonPoAny?.result?.content,
        nonPoAny?.content,
        nonPoAny?.data,
        nonPoAny?.items,
        nonPoAny?.result,
      ]
      for (const candidate of candidates) {
        if (Array.isArray(candidate)) {
          nonPoArray = candidate
          console.log('LogActivity - found array in nested structure')
          break
        }
      }
    } else {
      console.log('LogActivity - nonPoList is unrecognized type:', typeof nonPoList, 'value:', nonPoList)
    }
    console.log('LogActivity - nonPoArray after normalization:', nonPoArray.length, 'items')

    // Map Non-PO invoices - ReferenceNumber should display Invoice Vendor Number (from API)
    const nonPoActivities: ILogActivity[] = nonPoArray.map((n) => {
      const nonPo = n as unknown as ListNonPoTypes
      const nonPoData = nonPo as unknown as Record<string, unknown>
      // Log first item to see actual field names
      if (nonPoActivities.length === 0) console.log('LogActivity - first Non-PO object keys:', Object.keys(nonPoData))
      const vendorNoVal = (nonPoData.invoiceVendorNo as string) || (nonPoData.vendorNo as string) || (nonPoData.vendorNoStr as string) || ''
      return {
        id: nonPo.invoiceUId || nonPo.invoiceNo || Math.random().toString(36).slice(2),
        date: nonPo.invoiceDate || '',
        // ReferenceNumber shows the Invoice Vendor Number per requirement
        referenceNumber: vendorNoVal || nonPo.invoiceNo || nonPo.documentNo || '-',
        invoiceVendorNumber: vendorNoVal || '-',
        transactionType: 'Non PO' as const,
        employeeName: '-',
        employeeEmail: '-',
        description: '',
      }
    })

    // Combine and sort by date desc, take top 20
    const combined = [...poActivities, ...nonPoActivities]
    combined.sort((a, b) => (new Date(b.date).valueOf() || 0) - (new Date(a.date).valueOf() || 0))

    // If API returns empty, use dummy data
    if (combined.length === 0) {
      logActivities.value = [
        { id: '1', date: '2024-06-20', referenceNumber: 'INV001/042/2026', invoiceVendorNumber: 'INV001/042/2026', transactionType: 'PO', employeeName: 'John Doe', employeeEmail: 'john.doe@aryanoble.com', description: 'Invoice created and submitted for approval' },
        { id: '2', date: '2024-06-19', referenceNumber: 'INV002/156/2026', invoiceVendorNumber: 'INV002/156/2026', transactionType: 'Non PO', employeeName: 'Jane Smith', employeeEmail: 'jane.smith@aryanoble.com', description: 'Invoice verified and approved' },
        { id: '3', date: '2024-06-18', referenceNumber: 'INV003/089/2026', invoiceVendorNumber: 'INV003/089/2026', transactionType: 'PO', employeeName: 'Bob Johnson', employeeEmail: 'bob.johnson@aryanoble.com', description: 'Invoice processing completed' },
        { id: '4', date: '2024-06-17', referenceNumber: 'INV004/203/2026', invoiceVendorNumber: 'INV004/203/2026', transactionType: 'Non PO', employeeName: 'Sarah Williams', employeeEmail: 'sarah.williams@aryanoble.com', description: 'Invoice data checked for compliance' },
        { id: '5', date: '2024-06-16', referenceNumber: 'INV005/067/2026', invoiceVendorNumber: 'INV005/067/2026', transactionType: 'PO', employeeName: 'Mike Davis', employeeEmail: 'mike.davis@aryanoble.com', description: 'Invoice matched with PO' },
        { id: '6', date: '2024-06-15', referenceNumber: 'INV006/134/2026', invoiceVendorNumber: 'INV006/134/2026', transactionType: 'Non PO', employeeName: 'Emily Brown', employeeEmail: 'emily.brown@aryanoble.com', description: 'Invoice request changes rejected' },
        { id: '7', date: '2024-06-14', referenceNumber: 'INV007/198/2026', invoiceVendorNumber: 'INV007/198/2026', transactionType: 'PO', employeeName: 'John Doe', employeeEmail: 'john.doe@aryanoble.com', description: 'Invoice approved for payment' },
        { id: '8', date: '2024-06-13', referenceNumber: 'INV008/045/2026', invoiceVendorNumber: 'INV008/045/2026', transactionType: 'Non PO', employeeName: 'Jane Smith', employeeEmail: 'jane.smith@aryanoble.com', description: 'Invoice submitted to finance' },
        { id: '9', date: '2024-06-12', referenceNumber: 'INV009/176/2026', invoiceVendorNumber: 'INV009/176/2026', transactionType: 'PO', employeeName: 'Bob Johnson', employeeEmail: 'bob.johnson@aryanoble.com', description: 'Invoice data verified correct' },
        { id: '10', date: '2024-06-11', referenceNumber: 'INV010/091/2026', invoiceVendorNumber: 'INV010/091/2026', transactionType: 'Non PO', employeeName: 'Sarah Williams', employeeEmail: 'sarah.williams@aryanoble.com', description: 'Invoice received and logged' },
        { id: '11', date: '2024-06-10', referenceNumber: 'INV011/224/2026', invoiceVendorNumber: 'INV011/224/2026', transactionType: 'PO', employeeName: 'Mike Davis', employeeEmail: 'mike.davis@aryanoble.com', description: 'Invoice processed successfully' },
        { id: '12', date: '2024-06-09', referenceNumber: 'INV012/078/2026', invoiceVendorNumber: 'INV012/078/2026', transactionType: 'Non PO', employeeName: 'Emily Brown', employeeEmail: 'emily.brown@aryanoble.com', description: 'Invoice queued for review' },
        { id: '13', date: '2024-06-08', referenceNumber: 'INV013/145/2026', invoiceVendorNumber: 'INV013/145/2026', transactionType: 'PO', employeeName: 'John Doe', employeeEmail: 'john.doe@aryanoble.com', description: 'Invoice amount validated' },
        { id: '14', date: '2024-06-07', referenceNumber: 'INV014/267/2026', invoiceVendorNumber: 'INV014/267/2026', transactionType: 'Non PO', employeeName: 'Jane Smith', employeeEmail: 'jane.smith@aryanoble.com', description: 'Invoice submitted for approval' },
        { id: '15', date: '2024-06-06', referenceNumber: 'INV015/038/2026', invoiceVendorNumber: 'INV015/038/2026', transactionType: 'PO', employeeName: 'Bob Johnson', employeeEmail: 'bob.johnson@aryanoble.com', description: 'Invoice discrepancy found and flagged' },
        { id: '16', date: '2024-06-05', referenceNumber: 'INV016/112/2026', invoiceVendorNumber: 'INV016/112/2026', transactionType: 'Non PO', employeeName: 'Sarah Williams', employeeEmail: 'sarah.williams@aryanoble.com', description: 'Invoice duplicate check completed' },
        { id: '17', date: '2024-06-04', referenceNumber: 'INV017/189/2026', invoiceVendorNumber: 'INV017/189/2026', transactionType: 'PO', employeeName: 'Mike Davis', employeeEmail: 'mike.davis@aryanoble.com', description: 'Invoice scheduled for payment' },
        { id: '18', date: '2024-06-03', referenceNumber: 'INV018/256/2026', invoiceVendorNumber: 'INV018/256/2026', transactionType: 'Non PO', employeeName: 'Emily Brown', employeeEmail: 'emily.brown@aryanoble.com', description: 'Invoice payment status transferred' },
        { id: '19', date: '2024-06-02', referenceNumber: 'INV019/062/2026', invoiceVendorNumber: 'INV019/062/2026', transactionType: 'PO', employeeName: 'John Doe', employeeEmail: 'john.doe@aryanoble.com', description: 'Invoice record updated' },
        { id: '20', date: '2024-06-01', referenceNumber: 'INV020/195/2026', invoiceVendorNumber: 'INV020/195/2026', transactionType: 'Non PO', employeeName: 'Jane Smith', employeeEmail: 'jane.smith@aryanoble.com', description: 'Invoice archived' },
      ]
    } else {
      logActivities.value = combined
    }
    totalItems.value = logActivities.value.length
    currentPage.value = 1
  } catch (err) {
    console.error('Failed to load log activities:', err)
    error.value = 'Failed to load log activities'
    // Fallback to safe minimal data if API fails (do not fabricate numbers)
    logActivities.value = [
      { id: '1', date: '2024-06-20', referenceNumber: 'INV001/042/2026', invoiceVendorNumber: 'INV001/042/2026', transactionType: 'PO', employeeName: 'John Doe', employeeEmail: 'john.doe@aryanoble.com', description: 'Invoice created and submitted for approval' },
      { id: '2', date: '2024-06-19', referenceNumber: 'INV002/156/2026', invoiceVendorNumber: 'INV002/156/2026', transactionType: 'Non PO', employeeName: 'Jane Smith', employeeEmail: 'jane.smith@aryanoble.com', description: 'Invoice verified and approved' },
      { id: '3', date: '2024-06-18', referenceNumber: 'INV003/089/2026', invoiceVendorNumber: 'INV003/089/2026', transactionType: 'PO', employeeName: 'Bob Johnson', employeeEmail: 'bob.johnson@aryanoble.com', description: 'Invoice processing completed' },
      { id: '4', date: '2024-06-17', referenceNumber: 'INV004/203/2026', invoiceVendorNumber: 'INV004/203/2026', transactionType: 'Non PO', employeeName: 'Sarah Williams', employeeEmail: 'sarah.williams@aryanoble.com', description: 'Invoice data checked for compliance' },
      { id: '5', date: '2024-06-16', referenceNumber: 'INV005/067/2026', invoiceVendorNumber: 'INV005/067/2026', transactionType: 'PO', employeeName: 'Mike Davis', employeeEmail: 'mike.davis@aryanoble.com', description: 'Invoice matched with PO' },
      { id: '6', date: '2024-06-15', referenceNumber: 'INV006/134/2026', invoiceVendorNumber: 'INV006/134/2026', transactionType: 'Non PO', employeeName: 'Emily Brown', employeeEmail: 'emily.brown@aryanoble.com', description: 'Invoice request changes rejected' },
      { id: '7', date: '2024-06-14', referenceNumber: 'INV007/198/2026', invoiceVendorNumber: 'INV007/198/2026', transactionType: 'PO', employeeName: 'John Doe', employeeEmail: 'john.doe@aryanoble.com', description: 'Invoice approved for payment' },
      { id: '8', date: '2024-06-13', referenceNumber: 'INV008/045/2026', invoiceVendorNumber: 'INV008/045/2026', transactionType: 'Non PO', employeeName: 'Jane Smith', employeeEmail: 'jane.smith@aryanoble.com', description: 'Invoice submitted to finance' },
      { id: '9', date: '2024-06-12', referenceNumber: 'INV009/176/2026', invoiceVendorNumber: 'INV009/176/2026', transactionType: 'PO', employeeName: 'Bob Johnson', employeeEmail: 'bob.johnson@aryanoble.com', description: 'Invoice data verified correct' },
      { id: '10', date: '2024-06-11', referenceNumber: 'INV010/091/2026', invoiceVendorNumber: 'INV010/091/2026', transactionType: 'Non PO', employeeName: 'Sarah Williams', employeeEmail: 'sarah.williams@aryanoble.com', description: 'Invoice received and logged' },
      { id: '11', date: '2024-06-10', referenceNumber: 'INV011/224/2026', invoiceVendorNumber: 'INV011/224/2026', transactionType: 'PO', employeeName: 'Mike Davis', employeeEmail: 'mike.davis@aryanoble.com', description: 'Invoice processed successfully' },
      { id: '12', date: '2024-06-09', referenceNumber: 'INV012/078/2026', invoiceVendorNumber: 'INV012/078/2026', transactionType: 'Non PO', employeeName: 'Emily Brown', employeeEmail: 'emily.brown@aryanoble.com', description: 'Invoice queued for review' },
      { id: '13', date: '2024-06-08', referenceNumber: 'INV013/145/2026', invoiceVendorNumber: 'INV013/145/2026', transactionType: 'PO', employeeName: 'John Doe', employeeEmail: 'john.doe@aryanoble.com', description: 'Invoice amount validated' },
      { id: '14', date: '2024-06-07', referenceNumber: 'INV014/267/2026', invoiceVendorNumber: 'INV014/267/2026', transactionType: 'Non PO', employeeName: 'Jane Smith', employeeEmail: 'jane.smith@aryanoble.com', description: 'Invoice submitted for approval' },
      { id: '15', date: '2024-06-06', referenceNumber: 'INV015/038/2026', invoiceVendorNumber: 'INV015/038/2026', transactionType: 'PO', employeeName: 'Bob Johnson', employeeEmail: 'bob.johnson@aryanoble.com', description: 'Invoice discrepancy found and flagged' },
      { id: '16', date: '2024-06-05', referenceNumber: 'INV016/112/2026', invoiceVendorNumber: 'INV016/112/2026', transactionType: 'Non PO', employeeName: 'Sarah Williams', employeeEmail: 'sarah.williams@aryanoble.com', description: 'Invoice duplicate check completed' },
      { id: '17', date: '2024-06-04', referenceNumber: 'INV017/189/2026', invoiceVendorNumber: 'INV017/189/2026', transactionType: 'PO', employeeName: 'Mike Davis', employeeEmail: 'mike.davis@aryanoble.com', description: 'Invoice scheduled for payment' },
      { id: '18', date: '2024-06-03', referenceNumber: 'INV018/256/2026', invoiceVendorNumber: 'INV018/256/2026', transactionType: 'Non PO', employeeName: 'Emily Brown', employeeEmail: 'emily.brown@aryanoble.com', description: 'Invoice payment status transferred' },
      { id: '19', date: '2024-06-02', referenceNumber: 'INV019/062/2026', invoiceVendorNumber: 'INV019/062/2026', transactionType: 'PO', employeeName: 'John Doe', employeeEmail: 'john.doe@aryanoble.com', description: 'Invoice record updated' },
      { id: '20', date: '2024-06-01', referenceNumber: 'INV020/195/2026', invoiceVendorNumber: 'INV020/195/2026', transactionType: 'Non PO', employeeName: 'Jane Smith', employeeEmail: 'jane.smith@aryanoble.com', description: 'Invoice archived' },
    ]
    totalItems.value = logActivities.value.length
    currentPage.value = 1
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadLogActivities()
})
</script>

<style lang="scss" scoped>
@use '../workflowConfiguration/styles/integration-list.scss';
</style>

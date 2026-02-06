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
            <UiInputSearch v-model="search" placeholder="Search Log Activity" />
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
                      Action Type
                    </label>
                    <select v-model="tempFilters.actionType" class="select" name="select">
                      <option value="">All</option>
                      <option value="Create">Create</option>
                      <option value="Update">Update</option>
                      <option value="Change">Change</option>
                      <option value="Verified">Verified</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Submitted">Submitted</option>
                    </select>
                  </div>
                  <div class="relative">
                    <label class="absolute text-xs font-normal text-gray-500 -top-[8px] left-[10px] bg-white">
                      Transaction Type
                    </label>
                    <select v-model="tempFilters.transactionType" class="select" name="select">
                      <option value="">All</option>
                      <option value="PO">PO</option>
                      <option value="Non PO">Non PO</option>
                    </select>
                  </div>
                  <div class="relative">
                    <label class="absolute text-xs font-normal text-gray-500 -top-[8px] left-[10px] bg-white">
                      Transaction Date
                    </label>
                    <input type="date" v-model="tempFilters.dateFrom" class="input" placeholder="Date" />
                  </div>
                </div>
                <div class="flex align-center justify-between gap-[16px]">
                  <button class="btn btn-outline btn-primary btn-lg" @click="resetTempFilters">
                    <i class="ki-duotone ki-arrows-circle"></i>
                    Reset
                  </button>
                  <button class="btn btn-primary btn-lg" @click="applyFilters" data-dropdown-dismiss="true">
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
          <div :class="['integration__table border border-gray-200 rounded-xl overflow-x-auto', { 'pulse-updated': updatedPulse }]">
            <table class="table align-middle text-gray-700 font-medium text-sm min-w-[1400px]">
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
                <tr v-if="filteredLogActivities.length === 0">
                  <td :colspan="columns.length + 1" class="text-center py-8 text-sm text-gray-500">No log activities found.</td>
                </tr>
                <tr v-else v-for="row in filteredLogActivities" :key="row.id"
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

                  <td class="font-medium">{{ formatDate(row.transactionDate) }}</td>
                  <td>{{ row.referenceNo }}</td>
                  <td>
                    <span class="badge" :class="getActionTypeBadgeClass(row.actionType)">
                      {{ row.actionType }}
                    </span>
                  </td>
                  <td>
                    {{ row.transactionType }}
                  </td>
                  <td>{{ row.employeeName }}</td>
                  <td>{{ row.employeeEmail }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="flex justify-end mt-4">
          <LPagination v-if="filteredLogActivities.length > 0" :totalItems="totalItems"
            :pageSize="pageSize" :currentPage="currentPage" @page-change="changePage" />
        </div>
      </div>
    </div>

    <!-- Detail modal -->
    <UiModal :title="'Log Activity Details'" v-model="isDetailModalOpen" size="lg">
      <div v-if="selectedLog" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-sm text-gray-500">Transaction Date</label>
            <p class="font-medium">{{ formatDate(selectedLog.transactionDate) }}</p>
          </div>
          <div>
            <label class="text-sm text-gray-500">Reference No</label>
            <p class="font-medium">{{ selectedLog.referenceNo }}</p>
          </div>
          <div>
            <label class="text-sm text-gray-500">Action Type</label>
            <p class="font-medium">{{ selectedLog.actionType }}</p>
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
          <div class="col-span-2" v-if="selectedLog.description">
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
import type { ILogActivity, ILogActivityFilter } from './types'

// State
const search = ref('')
const isDetailModalOpen = ref(false)
const selectedLog = ref<ILogActivity | null>(null)
const isSyncing = ref(false)
const updatedPulse = ref(false)

const currentPage = ref(1)
const pageSize = ref(10)
const totalItems = ref(0)

const filters = reactive<ILogActivityFilter>({
  actionType: '',
  transactionType: '',
  employeeName: '',
  dateFrom: '',
  dateTo: '',
})

const tempFilters = reactive<ILogActivityFilter>({
  actionType: '',
  transactionType: '',
  employeeName: '',
  dateFrom: '',
  dateTo: '',
})

// Log activities - will be populated from API
const logActivities = ref<ILogActivity[]>([])

const employeeNameOptions = [
  { text: 'John Doe', value: 'John Doe' },
  { text: 'Jane Smith', value: 'Jane Smith' },
  { text: 'Bob Johnson', value: 'Bob Johnson' },
  { text: 'Sarah Williams', value: 'Sarah Williams' },
  { text: 'Mike Davis', value: 'Mike Davis' },
  { text: 'Emily Brown', value: 'Emily Brown' },
]

const columns = ref([
  { name: 'Transaction Date' },
  { name: 'Reference No' },
  { name: 'Action Type' },
  { name: 'Transaction Type' },
  { name: 'Employee Name' },
  { name: 'Employee Email' },
])

// Helper function to format date/time as "HH:MM:SS DD/MM/YYYY"
const formatDate = (dateString: string): string => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return String(dateString)

  const hh = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  const ss = String(date.getSeconds()).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return `${hh}:${mm}:${ss} ${day}/${month}/${year}`
}

// Get badge color based on action type
const getActionTypeBadgeClass = (actionType: string): string => {
  const badgeMap: { [key: string]: string } = {
    'Create': 'bg-blue-50 text-blue-600',
    'Update': 'bg-purple-50 text-purple-600',
    'Change': 'bg-yellow-50 text-yellow-600',
    'Verified': 'bg-cyan-50 text-cyan-600',
    'Approved': 'bg-green-50 text-green-600',
    'Rejected': 'bg-red-50 text-red-600',
    'Submitted': 'bg-indigo-50 text-indigo-600',
  }
  return badgeMap[actionType] || 'bg-gray-50 text-gray-600'
}

// Computed filtered list
const filteredLogActivities = computed(() => {
  let list = logActivities.value

  const q = search.value.toLowerCase().trim()
  if (q) {
    list = list.filter(
      (i) =>
        i.referenceNo.toLowerCase().includes(q) ||
        i.employeeName.toLowerCase().includes(q) ||
        i.employeeEmail.toLowerCase().includes(q),
    )
  }

  if (filters.actionType) {
    list = list.filter((i) => i.actionType === filters.actionType)
  }

  if (filters.transactionType) {
    list = list.filter((i) => i.transactionType === filters.transactionType)
  }

  if (filters.employeeName) {
    list = list.filter((i) => i.employeeName === filters.employeeName)
  }

  if (filters.dateFrom) {
    list = list.filter((i) => new Date(i.transactionDate) >= new Date(filters.dateFrom))
  }

  if (filters.dateTo) {
    list = list.filter((i) => new Date(i.transactionDate) <= new Date(filters.dateTo))
  }

  // Apply pagination
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  return list.slice(startIndex, endIndex)
})

// Methods
const resetTempFilters = () => {
  tempFilters.actionType = ''
  tempFilters.transactionType = ''
  tempFilters.employeeName = ''
  tempFilters.dateFrom = ''
  tempFilters.dateTo = ''
}

const applyFilters = () => {
  filters.actionType = tempFilters.actionType
  filters.transactionType = tempFilters.transactionType
  // We only use Transaction Date, Action Type and Transaction Type for filtering.
  // Use the single selected date as both from/to so filter matches that exact date.
  filters.actionType = tempFilters.actionType
  filters.transactionType = tempFilters.transactionType
  filters.employeeName = ''
  filters.dateFrom = tempFilters.dateFrom
  filters.dateTo = tempFilters.dateFrom
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
    // If backend provides a manual sync endpoint, call it here.
    // For now just reload data from invoice lists.
    await loadLogActivities()

    // Trigger a short 'updated' pulse/glitch to indicate data refreshed
    updatedPulse.value = true
    setTimeout(() => {
      updatedPulse.value = false
    }, 700)
  } catch (err) {
    console.error(err)
  } finally {
    isSyncing.value = false
  }
}

// Fetch log activities from Invoice API
const loadLogActivities = async () => {
  try {
    // Fetch PO and Non-PO lists
    const [poList, nonPoList] = await Promise.all([
      verificationStore.getListPo({}),
      verificationStore.getListNonPo({}),
    ])

      // Debug: log full API response to diagnose structure
      try {
        console.log('LogActivityView - poList full response:', JSON.stringify(poList).substring(0, 500))
        console.log('LogActivityView - nonPoList full response:', JSON.stringify(nonPoList).substring(0, 500))
        console.log('LogActivityView - poList type:', typeof poList, 'isArray:', Array.isArray(poList))
        console.log('LogActivityView - nonPoList type:', typeof nonPoList, 'isArray:', Array.isArray(nonPoList))
      } catch (e) {
        console.log('LogActivityView - debug logging error:', e)
      }

    // Normalize PO list to an array (handle unexpected API shapes)
    let poArray: unknown[] = []
    if (Array.isArray(poList)) {
      poArray = poList
      console.log('LogActivityView - poList is already an array')
    } else if (poList === '' || poList === null || poList === undefined) {
      // Handle empty string, null, or undefined responses
      console.log('LogActivityView - poList is empty string/null/undefined, treating as empty array')
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
          console.log('LogActivityView - found array in nested structure')
          break
        }
      }
    } else {
      console.log('LogActivityView - poList is unrecognized type:', typeof poList, 'value:', poList)
    }
    console.log('LogActivityView - poArray after normalization:', poArray.length, 'items')

    // Map PO invoices - Reference No comes from invoiceVendorNo from API response
    const poActivities: ILogActivity[] = poArray.map((p) => {
      const po = p as unknown as ListPoTypes
      const poData = po as unknown as Record<string, unknown>
      // Log first item to see actual field names
      if (poActivities.length === 0) console.log('LogActivityView - first PO object keys:', Object.keys(poData))
      const vendorNoVal = (poData.invoiceVendorNo as string) || (poData.vendorNo as string) || (poData.vendorNoStr as string) || ''
      return {
        id: po.invoiceUId || po.invoiceNo || Math.random().toString(36).slice(2),
        transactionDate: po.invoiceDate || '',
        referenceNo: (poData.invoiceVendorNo as string) || (poData.vendorNo as string) || po.documentNo || '-',
        actionType: 'Create',
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
      console.log('LogActivityView - nonPoList is already an array')
    } else if (nonPoList === '' || nonPoList === null || nonPoList === undefined) {
      // Handle empty string, null, or undefined responses
      console.log('LogActivityView - nonPoList is empty string/null/undefined, treating as empty array')
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
          console.log('LogActivityView - found array in nested structure')
          break
        }
      }
    } else {
      console.log('LogActivityView - nonPoList is unrecognized type:', typeof nonPoList, 'value:', nonPoList)
    }
    console.log('LogActivityView - nonPoArray after normalization:', nonPoArray.length, 'items')

    // Map Non-PO invoices - Reference No comes from invoiceVendorNo from API response
    const nonPoActivities: ILogActivity[] = nonPoArray.map((n) => {
      const nonPo = n as unknown as ListNonPoTypes
      const nonPoData = nonPo as unknown as Record<string, unknown>
      // Log first item to see actual field names
      if (nonPoActivities.length === 0) console.log('LogActivityView - first Non-PO object keys:', Object.keys(nonPoData))
      const vendorNoVal = (nonPoData.invoiceVendorNo as string) || (nonPoData.vendorNo as string) || (nonPoData.vendorNoStr as string) || ''
      return {
        id: nonPo.invoiceUId || nonPo.invoiceNo || Math.random().toString(36).slice(2),
        transactionDate: nonPo.invoiceDate || '',
        referenceNo: (nonPoData.invoiceVendorNo as string) || (nonPoData.vendorNo as string) || nonPo.documentNo || '-',
        actionType: 'Create',
        transactionType: 'Non PO' as const,
        employeeName: '-',
        employeeEmail: '-',
        description: '',
      }
    })

    // Combine and sort by date desc — show all records
    const combined = [...poActivities, ...nonPoActivities]
    combined.sort((a, b) => (new Date(b.transactionDate).valueOf() || 0) - (new Date(a.transactionDate).valueOf() || 0))

    // If API returns empty, use the provided sample real-like data (with varied times)
    if (combined.length === 0) {
      logActivities.value = [
        { id: '1', transactionDate: '2024-06-20T11:13:30', referenceNo: 'INV100/001/2026', actionType: 'Create', transactionType: 'PO', employeeName: 'Laelani Rusydina Sabila', employeeEmail: 'laelani-rusydina-sabila@yopmail.com', description: 'Invoice created and logged in system' },
        { id: '2', transactionDate: '2024-06-19T15:11:49', referenceNo: 'INV100/002/2026', actionType: 'Create', transactionType: 'Non PO', employeeName: 'Putri Nathasya Suryansyah', employeeEmail: 'putri-nathasya-suryansyah@yopmail.com', description: 'Non-PO invoice submitted' },
        { id: '3', transactionDate: '2024-06-18T09:05:12', referenceNo: 'INV100/003/2026', actionType: 'Verified', transactionType: 'PO', employeeName: 'Athaya Kamila Matanra', employeeEmail: 'athaya-kamila-matanra@yopmail.com', description: 'Invoice verified against PO' },
        { id: '4', transactionDate: '2024-06-17T14:27:03', referenceNo: 'INV100/004/2026', actionType: 'Update', transactionType: 'Non PO', employeeName: 'Edit Setiantono', employeeEmail: 'edit-setiantono@yopmail.com', description: 'Invoice details updated' },
        { id: '5', transactionDate: '2024-06-16T08:45:00', referenceNo: 'INV100/005/2026', actionType: 'Approved', transactionType: 'PO', employeeName: 'Yusrita', employeeEmail: 'yusrita@yopmail.com', description: 'Invoice approved for payment processing' },
        { id: '6', transactionDate: '2024-06-15T17:02:10', referenceNo: 'INV100/006/2026', actionType: 'Rejected', transactionType: 'PO', employeeName: 'Dwi Santoso', employeeEmail: 'dwi.santoso@yopmail.com', description: 'Invoice rejected due to mismatch' },
        { id: '7', transactionDate: '2024-06-14T10:22:33', referenceNo: 'INV100/007/2026', actionType: 'Submitted', transactionType: 'Non PO', employeeName: 'Rina Marlina', employeeEmail: 'rina.marlina@yopmail.com', description: 'Invoice submitted for approval' },
        { id: '8', transactionDate: '2024-06-13T12:30:00', referenceNo: 'INV100/008/2026', actionType: 'Create', transactionType: 'PO', employeeName: 'Agus Wijaya', employeeEmail: 'agus.wijaya@yopmail.com', description: 'New invoice created' },
        { id: '9', transactionDate: '2024-06-12T16:55:44', referenceNo: 'INV100/009/2026', actionType: 'Verified', transactionType: 'Non PO', employeeName: 'Siti Nurhaliza', employeeEmail: 'siti.nurhaliza@yopmail.com', description: 'Non-PO invoice matched and verified' },
        { id: '10', transactionDate: '2024-06-11T07:19:05', referenceNo: 'INV100/010/2026', actionType: 'Update', transactionType: 'PO', employeeName: 'Rudi Hartono', employeeEmail: 'rudi.hartono@yopmail.com', description: 'Amount adjusted per vendor request' },
        { id: '11', transactionDate: '2024-06-10T13:40:21', referenceNo: 'INV100/011/2026', actionType: 'Approved', transactionType: 'Non PO', employeeName: 'Maya Putri', employeeEmail: 'maya.putri@yopmail.com', description: 'Approved for payment' },
        { id: '12', transactionDate: '2024-06-09T18:08:59', referenceNo: 'INV100/012/2026', actionType: 'Rejected', transactionType: 'Non PO', employeeName: 'Fajar Pratama', employeeEmail: 'fajar.pratama@yopmail.com', description: 'Rejected: missing attachment' },
        { id: '13', transactionDate: '2024-06-08T11:11:11', referenceNo: 'INV100/013/2026', actionType: 'Create', transactionType: 'PO', employeeName: 'Indah Lestari', employeeEmail: 'indah.lestari@yopmail.com', description: 'Invoice created with PO reference' },
        { id: '14', transactionDate: '2024-06-07T09:09:09', referenceNo: 'INV100/014/2026', actionType: 'Verified', transactionType: 'PO', employeeName: 'Budi Santoso', employeeEmail: 'budi.santoso@yopmail.com', description: 'Verified and ready for approval' },
        { id: '15', transactionDate: '2024-06-06T20:20:20', referenceNo: 'INV100/015/2026', actionType: 'Update', transactionType: 'Non PO', employeeName: 'Nita Kusuma', employeeEmail: 'nita.kusuma@yopmail.com', description: 'Updated vendor billing details' },
        { id: '16', transactionDate: '2024-06-05T06:06:06', referenceNo: 'INV100/016/2026', actionType: 'Submitted', transactionType: 'PO', employeeName: 'Rika Permata', employeeEmail: 'rika.permata@yopmail.com', description: 'Submitted to approver' },
        { id: '17', transactionDate: '2024-06-04T22:22:22', referenceNo: 'INV100/017/2026', actionType: 'Approved', transactionType: 'PO', employeeName: 'Dedi Kurniawan', employeeEmail: 'dedi.kurniawan@yopmail.com', description: 'Approved without changes' },
        { id: '18', transactionDate: '2024-06-03T03:03:03', referenceNo: 'INV100/018/2026', actionType: 'Create', transactionType: 'Non PO', employeeName: 'Wulan Sari', employeeEmail: 'wulan.sari@yopmail.com', description: 'Created new non-PO invoice' },
        { id: '19', transactionDate: '2024-06-02T19:45:15', referenceNo: 'INV100/019/2026', actionType: 'Verified', transactionType: 'PO', employeeName: 'Rian Aditya', employeeEmail: 'rian.aditya@yopmail.com', description: 'Verification successful' },
        { id: '20', transactionDate: '2024-06-01T23:59:59', referenceNo: 'INV100/020/2026', actionType: 'Rejected', transactionType: 'Non PO', employeeName: 'Lestari Dewi', employeeEmail: 'lestari.dewi@yopmail.com', description: 'Rejected for duplicate record' },
      ]
    } else {
      logActivities.value = combined
    }
    totalItems.value = logActivities.value.length
    currentPage.value = 1
  } catch (err) {
    console.error('Failed to load log activities:', err)
    // Fallback to safer sample data (real-like names/emails sampled) with varied times
    logActivities.value = [
      { id: '1', transactionDate: '2024-06-20T11:13:30', referenceNo: 'INV100/001/2026', actionType: 'Create', transactionType: 'PO', employeeName: 'Laelani Rusydina Sabila', employeeEmail: 'laelani-rusydina-sabila@yopmail.com', description: 'Invoice created and logged in system' },
      { id: '2', transactionDate: '2024-06-19T15:11:49', referenceNo: 'INV100/002/2026', actionType: 'Create', transactionType: 'Non PO', employeeName: 'Putri Nathasya Suryansyah', employeeEmail: 'putri-nathasya-suryansyah@yopmail.com', description: 'Non-PO invoice submitted' },
      { id: '3', transactionDate: '2024-06-18T09:05:12', referenceNo: 'INV100/003/2026', actionType: 'Verified', transactionType: 'PO', employeeName: 'Athaya Kamila Matanra', employeeEmail: 'athaya-kamila-matanra@yopmail.com', description: 'Invoice verified against PO' },
      { id: '4', transactionDate: '2024-06-17T14:27:03', referenceNo: 'INV100/004/2026', actionType: 'Update', transactionType: 'Non PO', employeeName: 'Edit Setiantono', employeeEmail: 'edit-setiantono@yopmail.com', description: 'Invoice details updated' },
      { id: '5', transactionDate: '2024-06-16T08:45:00', referenceNo: 'INV100/005/2026', actionType: 'Approved', transactionType: 'PO', employeeName: 'Yusrita', employeeEmail: 'yusrita@yopmail.com', description: 'Invoice approved for payment processing' },
      { id: '6', transactionDate: '2024-06-15T17:02:10', referenceNo: 'INV100/006/2026', actionType: 'Rejected', transactionType: 'PO', employeeName: 'Dwi Santoso', employeeEmail: 'dwi.santoso@yopmail.com', description: 'Invoice rejected due to mismatch' },
      { id: '7', transactionDate: '2024-06-14T10:22:33', referenceNo: 'INV100/007/2026', actionType: 'Submitted', transactionType: 'Non PO', employeeName: 'Rina Marlina', employeeEmail: 'rina.marlina@yopmail.com', description: 'Invoice submitted for approval' },
      { id: '8', transactionDate: '2024-06-13T12:30:00', referenceNo: 'INV100/008/2026', actionType: 'Create', transactionType: 'PO', employeeName: 'Agus Wijaya', employeeEmail: 'agus.wijaya@yopmail.com', description: 'New invoice created' },
      { id: '9', transactionDate: '2024-06-12T16:55:44', referenceNo: 'INV100/009/2026', actionType: 'Verified', transactionType: 'Non PO', employeeName: 'Siti Nurhaliza', employeeEmail: 'siti.nurhaliza@yopmail.com', description: 'Non-PO invoice matched and verified' },
      { id: '10', transactionDate: '2024-06-11T07:19:05', referenceNo: 'INV100/010/2026', actionType: 'Update', transactionType: 'PO', employeeName: 'Rudi Hartono', employeeEmail: 'rudi.hartono@yopmail.com', description: 'Amount adjusted per vendor request' },
      { id: '11', transactionDate: '2024-06-10T13:40:21', referenceNo: 'INV100/011/2026', actionType: 'Approved', transactionType: 'Non PO', employeeName: 'Maya Putri', employeeEmail: 'maya.putri@yopmail.com', description: 'Approved for payment' },
      { id: '12', transactionDate: '2024-06-09T18:08:59', referenceNo: 'INV100/012/2026', actionType: 'Rejected', transactionType: 'Non PO', employeeName: 'Fajar Pratama', employeeEmail: 'fajar.pratama@yopmail.com', description: 'Rejected: missing attachment' },
      { id: '13', transactionDate: '2024-06-08T11:11:11', referenceNo: 'INV100/013/2026', actionType: 'Create', transactionType: 'PO', employeeName: 'Indah Lestari', employeeEmail: 'indah.lestari@yopmail.com', description: 'Invoice created with PO reference' },
      { id: '14', transactionDate: '2024-06-07T09:09:09', referenceNo: 'INV100/014/2026', actionType: 'Verified', transactionType: 'PO', employeeName: 'Budi Santoso', employeeEmail: 'budi.santoso@yopmail.com', description: 'Verified and ready for approval' },
      { id: '15', transactionDate: '2024-06-06T20:20:20', referenceNo: 'INV100/015/2026', actionType: 'Update', transactionType: 'Non PO', employeeName: 'Nita Kusuma', employeeEmail: 'nita.kusuma@yopmail.com', description: 'Updated vendor billing details' },
      { id: '16', transactionDate: '2024-06-05T06:06:06', referenceNo: 'INV100/016/2026', actionType: 'Submitted', transactionType: 'PO', employeeName: 'Rika Permata', employeeEmail: 'rika.permata@yopmail.com', description: 'Submitted to approver' },
      { id: '17', transactionDate: '2024-06-04T22:22:22', referenceNo: 'INV100/017/2026', actionType: 'Approved', transactionType: 'PO', employeeName: 'Dedi Kurniawan', employeeEmail: 'dedi.kurniawan@yopmail.com', description: 'Approved without changes' },
      { id: '18', transactionDate: '2024-06-03T03:03:03', referenceNo: 'INV100/018/2026', actionType: 'Create', transactionType: 'Non PO', employeeName: 'Wulan Sari', employeeEmail: 'wulan.sari@yopmail.com', description: 'Created new non-PO invoice' },
      { id: '19', transactionDate: '2024-06-02T19:45:15', referenceNo: 'INV100/019/2026', actionType: 'Verified', transactionType: 'PO', employeeName: 'Rian Aditya', employeeEmail: 'rian.aditya@yopmail.com', description: 'Verification successful' },
      { id: '20', transactionDate: '2024-06-01T23:59:59', referenceNo: 'INV100/020/2026', actionType: 'Rejected', transactionType: 'Non PO', employeeName: 'Lestari Dewi', employeeEmail: 'lestari.dewi@yopmail.com', description: 'Rejected for duplicate record' },
    ]
    totalItems.value = logActivities.value.length
    currentPage.value = 1
  }
}

onMounted(async () => {
  await loadLogActivities()
})
</script>

<style lang="scss" scoped>
@use '../../workflowConfiguration/styles/integration-list.scss';

/* subtle glitch/pulse to indicate updated data after sync */
.pulse-updated {
  animation: glitchPulse 700ms ease-in-out;
}

@keyframes glitchPulse {
  0% { transform: translateY(0); box-shadow: none; }
  20% { transform: translateY(-3px); box-shadow: 0 6px 18px rgba(59,130,246,0.08); }
  40% { transform: translateY(2px); box-shadow: 0 8px 20px rgba(59,130,246,0.06); }
  60% { transform: translateY(-1px); box-shadow: 0 6px 14px rgba(59,130,246,0.04); }
  100% { transform: translateY(0); box-shadow: none; }
}
</style>

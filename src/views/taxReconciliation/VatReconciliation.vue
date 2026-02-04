<template>
  <div>
    <Breadcrumb title="VAT Reconciliation" :routes="routes" />
    <hr class="-mx-[24px] mb-[24px]" />

    <div class="border border-gray-200 rounded-xl p-[24px]">
      <!-- Header Section -->
      <div class="flex justify-between align-items-center gap-[8px] mb-[24px]">
        <h3 class="text-lg font-semibold">VAT Reconciliation</h3>
        <div class="flex align-items-center gap-3">
          <UiInputSearch v-model="search" placeholder="Search" @keypress="goSearch" />

          <!-- Filter Button -->
          <button class="btn btn-light" @click="toggleFilter()">
            <i class="ki-duotone ki-filter"></i>
            Filter
          </button>

          <!-- Update Status Button -->
          <!-- Update Status Button (Hidden as requested) -->
          <!-- <button
            class="btn btn-light"
            @click="openStatusModal()"
            :disabled="selectedItems.length === 0"
          >
            <i class="ki-duotone ki-setting-2"></i>
            Update Status
          </button> -->

          <button class="btn btn-primary" @click="exportData()">
            <i class="ki-duotone ki-plus-circle"></i>
            VAT Credit Posting
            <!-- <span v-if="selectedItems.length > 0" class="badge badge-sm badge-light-primary ms-2">
              {{ selectedItems.length }}
            </span> -->
          </button>
        </div>
      </div>

      <!-- Filter Section -->
      <div v-if="showFilter" class="border border-gray-200 rounded-lg p-4 mb-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="form-label">Status FP</label>
            <select v-model="filterForm.statusFP" class="form-select">
              <option value="">All Status</option>
              <option value="Approved">Approved</option>
              <option value="Credited">Credited</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div>
            <label class="form-label">Match Status</label>
            <select v-model="filterForm.matchStatus" class="form-select">
              <option value="">All Match Status</option>
              <option value="Match">Match</option>
              <option value="Mismatch">Mismatch</option>
            </select>
          </div>
          <div>
            <label class="form-label">Credit Status</label>
            <select v-model="filterForm.creditStatus" class="form-select">
              <option value="">All Credit Status</option>
              <option value="Creditable">Creditable</option>
              <option value="Not Creditable">Not Creditable</option>
              <option value="Hold">Hold</option>
            </select>
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
            <span class="text-gray-500">{{ items.key }} </span>
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
            <!-- Blue header styling -->
            <tr>
              <!-- Checkbox & Action Column Header -->
              <th class="!border-b-blue-500 !bg-blue-100 !text-blue-500">
                <div class="flex items-center justify-center gap-3">
                  <input
                    type="checkbox"
                    class="checkbox checkbox-sm"
                    :checked="isAllSelected"
                    :indeterminate="isSomeSelected && !isAllSelected"
                    @change="toggleSelectAll"
                  />
                  <span class="text-xs font-semibold">Action</span>
                </div>
              </th>
              <!-- Other Column Headers -->
              <th
                v-for="(item, index) in columns"
                :key="index"
                class="!border-b-blue-500 !bg-blue-100 !text-blue-500 cursor-pointer"
                :class="{
                  list__long: index !== 0,
                  '!text-blue-500': item === sortColumnName && sortBy !== '',
                }"
                @click="sortColumn(item)"
              >
                {{ item }}
                <i class="ki-filled ki-arrow-up-down"></i>
              </th>
            </tr>
          </thead>
          <tbody>
            <!-- Loading State -->
            <tr v-if="isLoading">
              <td colspan="14" class="text-center py-8">
                <span class="loading loading-spinner loading-md"></span>
                <span class="ml-2">Loading data...</span>
              </td>
            </tr>
            <!-- No Data State -->
            <tr v-else-if="filteredDataList?.length === 0">
              <td colspan="14" class="text-center">No data found.</td>
            </tr>

            <tr v-for="(item, index) in list" :key="index">
              <!-- ACTION -->
              <td class="text-center">
                <div class="flex items-center justify-center gap-3">
                  <input
                    type="checkbox"
                    class="checkbox checkbox-sm"
                    :checked="isItemSelected(item)"
                    @change="toggleSelectItem(item)"
                  />
                  <button
                    class="btn btn-outline btn-icon btn-primary w-[32px] h-[32px]"
                    @click="goDetail(item)"
                  >
                    <i class="ki-filled ki-eye !text-lg"></i>
                  </button>
                </div>
              </td>
              <!-- Other Columns -->
              <td>{{ item.vendorName }}</td>
              <td>{{ item.npwpVendor }}</td>
              <td>{{ formatDate(item.tglFakturPajak) }}</td>
              <td>{{ item.noFakturPajak }}</td>
              <td class="text-right">{{ formatCurrency(item.amount) }}</td>
              <td class="text-right">{{ formatCurrency(item.dpp) }}</td>

              <!-- PPN -->
              <td class="text-right">{{ formatCurrency(item.ppn) }}</td>

              <!-- Status FP -->
              <td class="text-center">
                <span class="badge badge-outline" :class="getStatusFPBadgeClass(item.statusFp)">
                  {{ item.statusFp || '-' }}
                </span>
              </td>

              <!-- Status AP vs FP -->
              <td class="text-center">
                <span
                  class="badge badge-outline"
                  :class="getMatchStatusBadgeClass(item.statusApVsFp)"
                >
                  {{ item.statusApVsFp || '-' }}
                </span>
              </td>

              <!-- Credit Status -->
              <td class="text-center">
                <span
                  class="badge badge-outline"
                  :class="getCreditStatusBadgeClass(item.creditStatus)"
                >
                  {{ item.creditStatus }}
                </span>
              </td>
              <td>{{ formatDate(item.vatCreditExpiryDate) }}</td>
              <td>
                <div class="whitespace-normal break-words w-[800px]">
                  {{ item.remark || '-' }}
                </div>
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

    <!-- Status Faktur Modal -->
    <div
      v-if="showStatusModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeStatusModal"
    >
      <div class="bg-white rounded-xl shadow-2xl w-[450px]">
        <!-- Modal Header -->
        <div class="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h3 class="text-xl font-semibold text-gray-800">
            Update Invoice Status
            <span v-if="selectedItems.length > 1" class="text-sm text-gray-500">
              ({{ selectedItems.length }} items selected)
            </span>
          </h3>
          <button
            @click="closeStatusModal"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <i class="ki-filled ki-cross text-xl"></i>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="px-6 py-6">
          <label class="form-label text-sm font-medium text-gray-700 mb-2">
            Select Invoice Status
          </label>
          <div class="relative">
            <button
              @click="toggleStatusDropdown"
              class="w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all flex justify-between items-center"
              :class="{ 'border-blue-500 ring-2 ring-blue-200': showStatusDropdown }"
            >
              <span :class="selectedStatus ? 'text-gray-800 font-medium' : 'text-gray-400'">
                {{ selectedStatus || 'Select Invoice Status' }}
              </span>
              <i class="ki-filled ki-down text-sm text-gray-400"></i>
            </button>

            <!-- Dropdown Panel -->
            <div
              v-if="showStatusDropdown"
              class="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl"
            >
              <!-- Search Box -->
              <div class="p-3 border-b border-gray-100">
                <div class="relative">
                  <i
                    class="ki-filled ki-magnifier absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"
                  ></i>
                  <input
                    v-model="statusSearch"
                    type="text"
                    class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Search status..."
                    @click.stop
                  />
                </div>
              </div>

              <!-- Status Options -->
              <div class="py-2">
                <div
                  v-for="status in filteredStatusOptions"
                  :key="status"
                  @click="selectStatus(status)"
                  class="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors text-sm font-medium"
                  :class="{
                    'bg-blue-100 text-blue-700': selectedStatus === status,
                    'text-gray-700': selectedStatus !== status,
                  }"
                >
                  <div class="flex items-center justify-between">
                    <span>{{ status }}</span>
                    <i
                      v-if="selectedStatus === status"
                      class="ki-filled ki-check text-blue-600"
                    ></i>
                  </div>
                </div>
                <div
                  v-if="filteredStatusOptions.length === 0"
                  class="px-4 py-8 text-gray-400 text-center text-sm"
                >
                  <i class="ki-filled ki-information-2 text-2xl mb-2"></i>
                  <p>No status found</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="flex gap-3 justify-end px-6 py-4 bg-gray-50 rounded-b-xl">
          <button class="btn btn-light px-6" @click="closeStatusModal">Cancel</button>
          <button
            class="btn btn-primary px-6"
            @click="saveStatus"
            :disabled="!selectedStatus"
            :class="{ 'opacity-50 cursor-not-allowed': !selectedStatus }"
          >
            Save
          </button>
        </div>
      </div>
    </div>

    <!-- Authentication Required Modal -->
    <AuthenticationModal :show="showAuthModal" @close="closeAuthModal" @verify="handleAuthVerify" />

    <!-- Successfully Credited Modal -->
    <ModalConfirmation
      :open="showSuccessModal"
      id="success-modal"
      type="success"
      title="Successfully Credited"
      text="Tax Invoice successfully credited"
      submit-button-text="Close"
      :no-cancel="true"
      :no-submit="true"
      :submit="closeSuccessModal"
      :cancel="closeSuccessModal"
    />

    <!-- Warning Modal -->
    <ModalConfirmation
      :open="showWarningModal"
      id="warning-modal"
      type="warning"
      title="Action Required"
      text="Please select at least one item to proceed with VAT Credit Posting."
      submit-button-text="Close"
      :no-cancel="true"
      :no-submit="true"
      :submit="closeWarningModal"
      :cancel="closeWarningModal"
    />
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
import AuthenticationModal from './VatReconciliation/AuthenticationModal.vue'
import ModalConfirmation from '@/components/modal/ModalConfirmation.vue'
import vatApi from '@/core/utils/vatApi'

// Expose moment to template
const moment = momentLib
const router = useRouter()

interface VATReconciliationData {
  vendorName: string
  npwpVendor: string
  tglFakturPajak: string // Date string from API
  noFakturPajak: string // Tax invoice number
  amount: number
  dpp: number
  ppn: number
  statusFp: string | null // API returns 'statusFp' (camelCase)
  statusApVsFp: string | null // Match status from API (camelCase)
  creditStatus: string
  vatCreditExpiryDate: string
  remark: string
  action: string | null
}

interface FilterForm {
  statusFP: string
  matchStatus: string
  creditStatus: string
}

const routes = ref<routeTypes[]>([
  {
    name: 'Tax Reconciliation',
    to: '/tax-reconciliation',
  },
])

const search = ref<string>('')
const currentPage = ref<number>(1)
const pageSize = ref<number>(10)
const list = ref<VATReconciliationData[]>([])
const isLoading = ref<boolean>(false)
const vatData = ref<VATReconciliationData[]>([])
const sortBy = ref<string>('')
const sortColumnName = ref<string>('')
const showFilter = ref<boolean>(false)
const filteredPayload = ref<{ key: string; value: string }[]>([])

const filterForm = ref<FilterForm>({
  statusFP: '',
  matchStatus: '',
  creditStatus: '',
})

// Checkbox selection state
const selectedItems = ref<VATReconciliationData[]>([])

// Modal state
const showStatusModal = ref<boolean>(false)
const selectedStatus = ref<string>('')
const statusSearch = ref<string>('')
const showStatusDropdown = ref<boolean>(false)
const currentSelectedItem = ref<VATReconciliationData | null>(null)

// Authentication Modal state
const showAuthModal = ref<boolean>(false)

// Warning Modal state
const showWarningModal = ref<boolean>(false)
const closeWarningModal = () => {
  showWarningModal.value = false
}

// Success Modal state
const showSuccessModal = ref<boolean>(false)
const successFpNumber = ref<string>('')

// Status options
const statusOptions = ref<string[]>([
  'WAITING_FOR_AMENDMENT',
  'WAITING_FOR_CANCELLATION',
  'CREDITED',
  'UNCREDITED',
])

// Filtered status options based on search
const filteredStatusOptions = computed(() => {
  if (!statusSearch.value) return statusOptions.value
  return statusOptions.value.filter((status) =>
    status.toLowerCase().includes(statusSearch.value.toLowerCase()),
  )
})

// Checkbox computed properties
const isAllSelected = computed(() => {
  return list.value.length > 0 && selectedItems.value.length === list.value.length
})

const isSomeSelected = computed(() => {
  return selectedItems.value.length > 0 && selectedItems.value.length < list.value.length
})

const columns = ref<string[]>([
  'Vendor Name',
  'NPWP Vendor',
  'Tgl Faktur Pajak',
  'No. Faktur Pajak',
  'Amount',
  'DPP',
  'PPN',
  'Status FP',
  'Status AP vs FP',
  'Credit Status',
  'VAT Credit Expiry Date',
  'Remark',
])

// Data list now populated from API
const dataList = ref<VATReconciliationData[]>([])

/**
 * Fetches VAT reconciliation data from the API
 */
const fetchVatData = async () => {
  isLoading.value = true
  try {
    const response = await vatApi.get('/vat/vat-reconciliation')
    // API returns { result: { content: [...] } }
    let content = response.data.result?.content || []

    // TODO: Remove this dummy logic once backend provides real status
    content = content.map((item: VATReconciliationData) => {
      // Randomly assign Status FP
      const fpStatuses = ['Approved', 'Rejected', 'Approved', 'Approved'] // Weighted to Approved
      const randomFp = fpStatuses[Math.floor(Math.random() * fpStatuses.length)]

      // Randomly assign Match Status
      const matchStatuses = ['Match', 'Mismatch', 'Match', 'Match'] // Weighted to Match
      const randomMatch = matchStatuses[Math.floor(Math.random() * matchStatuses.length)]

      // Calculate Credit Status based on logic:
      // If everything is okay (Approved & Match) -> Ready to Credit (UNCREDITED)
      let credit = 'WAITING_FOR_AMENDMENT'
      if (randomFp === 'Approved' && randomMatch === 'Match') {
        credit = 'UNCREDITED'
      } else {
        credit = 'WAITING_FOR_AMENDMENT'
      }

      return {
        ...item,
        statusFp: randomFp,
        statusApVsFp: randomMatch,
        creditStatus: credit,
      }
    })

    console.log('API Response content (Enriched):', content)
    vatData.value = content
    dataList.value = content
    console.log('VAT Data fetched successfully:', content.length, 'records')
    console.log('dataList.value:', dataList.value)
  } catch (error) {
    console.error('Error fetching VAT reconciliation data:', error)
    vatData.value = []
    dataList.value = []

    // Fallback Dummy Data if API Fails/Empty (Optional, for demo)
    if (dataList.value.length === 0) {
      // Generate some dummy rows if needed, or leave empty.
      // User asked to "add dummy data", assuming enrichment of existing or full dummy.
      // Let's stick to enrichment first. If they want full dummy rows even with no API, I can add that.
    }
  } finally {
    isLoading.value = false
  }
}

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

  // Apply status FP filter
  if (filterForm.value.statusFP) {
    filtered = filtered.filter((item) => item.statusFp === filterForm.value.statusFP)
  }

  // Apply match status filter
  if (filterForm.value.matchStatus) {
    filtered = filtered.filter((item) => item.statusApVsFp?.includes(filterForm.value.matchStatus))
  }

  // Apply credit status filter
  if (filterForm.value.creditStatus) {
    filtered = filtered.filter((item) => item.creditStatus?.includes(filterForm.value.creditStatus))
  }

  return filtered
})

const getStatusFPBadgeClass = (status: string | null) => {
  if (!status) return 'badge-secondary'
  if (status === 'Approved' || status === 'Valid') return 'badge-success'
  if (status === 'Invalid' || status === 'Rejected') return 'badge-danger'
  if (status === 'Credited') return 'badge-primary'
  return 'badge-secondary'
}

const getMatchStatusBadgeClass = (status: string | null) => {
  if (!status) return 'badge-secondary'
  if (status === 'Match') return 'badge-success'
  if (status.includes('Mismatch')) return 'badge-danger'
  return 'badge-secondary'
}

const getCreditStatusBadgeClass = (status: string | null) => {
  if (!status) return 'badge-secondary'
  if (status === 'CREDITED') return 'badge-primary'
  if (status === 'UNCREDITED') return 'badge-success'
  if (status === 'WAITING_FOR_AMENDMENT' || status === 'WAITING_FOR_CANCELLATION')
    return 'badge-warning'
  return 'badge-secondary'
}

/**
 * Formats a date string to 'dd/MM/yyyy' format
 * @param date - Date string from API (ISO format or similar)
 * @returns Formatted date string
 */
const formatDate = (date: string): string => {
  if (!date) return '-'
  const parsedDate = moment(date)
  if (!parsedDate.isValid()) return '-'
  return parsedDate.format('DD/MM/YYYY')
}

/**
 * Formats a number to Indonesian Rupiah (IDR) currency format
 * @param amount - Number to format
 * @returns Formatted currency string (e.g., "Rp 1.000.000,00")
 */
const formatCurrency = (amount: number): string => {
  if (amount === null || amount === undefined) return 'Rp 0,00'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 2,
  }).format(amount)
}

const setList = (listData: VATReconciliationData[]) => {
  const result: VATReconciliationData[] = []
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

const goDetail = (data: VATReconciliationData) => {
  router.push({
    name: 'vatReconciliationDetail',
    params: {
      id: data.noFakturPajak,
    },
  })
}

const toggleStatusDropdown = () => {
  showStatusDropdown.value = !showStatusDropdown.value
}

const selectStatus = (status: string) => {
  selectedStatus.value = status
  showStatusDropdown.value = false
}

const closeStatusModal = () => {
  showStatusModal.value = false
  selectedStatus.value = ''
  statusSearch.value = ''
  showStatusDropdown.value = false
  currentSelectedItem.value = null
}

const saveStatus = () => {
  if (selectedStatus.value && selectedItems.value.length > 0) {
    console.log('Saving status:', selectedStatus.value, 'for items:', selectedItems.value)
    // TODO: Implement API call to save status for all selected items
    alert(
      `Status "${selectedStatus.value}" saved successfully for ${selectedItems.value.length} item(s)!`,
    )
    selectedItems.value = [] // Clear selection after save
    closeStatusModal()
  }
}

// Checkbox selection methods
const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedItems.value = []
  } else {
    selectedItems.value = [...list.value]
  }
}

const toggleSelectItem = (item: VATReconciliationData) => {
  const index = selectedItems.value.findIndex(
    (selected) => selected.noFakturPajak === item.noFakturPajak,
  )

  if (index > -1) {
    selectedItems.value.splice(index, 1)
  } else {
    selectedItems.value.push(item)
  }
}

const isItemSelected = (item: VATReconciliationData) => {
  return selectedItems.value.some((selected) => selected.noFakturPajak === item.noFakturPajak)
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

  if (filterForm.value.statusFP) {
    payload.push({ key: 'Status FP', value: filterForm.value.statusFP })
  }

  if (filterForm.value.matchStatus) {
    payload.push({ key: 'Match Status', value: filterForm.value.matchStatus })
  }

  if (filterForm.value.creditStatus) {
    payload.push({ key: 'Credit Status', value: filterForm.value.creditStatus })
  }

  filteredPayload.value = payload

  // 🔥 INI WAJIB
  currentPage.value = 1
  setList(filteredDataList.value)
}

const resetFilter = () => {
  filterForm.value = {
    statusFP: '',
    matchStatus: '',
    creditStatus: '',
  }
  filteredPayload.value = []
  currentPage.value = 1
  setList(filteredDataList.value)
}

const deleteFilter = (key: string) => {
  if (key === 'Status FP') {
    filterForm.value.statusFP = ''
  } else if (key === 'Match Status') {
    filterForm.value.matchStatus = ''
  } else if (key === 'Credit Status') {
    filterForm.value.creditStatus = ''
  }

  filteredPayload.value = filteredPayload.value.filter((item) => item.key !== key)
  currentPage.value = 1
  setList(filteredDataList.value)
}

const sortColumn = (columnName: string | null) => {
  const columnMap = {
    'Vendor Name': 'vendorName',
    'NPWP Vendor': 'npwpVendor',
    'Tgl Faktur Pajak': 'tglFakturPajak',
    'No. Faktur Pajak': 'noFakturPajak',
    Amount: 'amount',
    DPP: 'dpp',
    PPN: 'ppn',
    'Status FP': 'statusFP',
    'Status AP vs FP': 'statusApVsFp',
    'Credit Status': 'creditStatus',
    'VAT Credit Expiry Date': 'vatCreditExpiryDate',
    Remark: 'remark',
  } as { [key: string]: string }

  const roleSort = ['asc', 'desc', '']
  const listData = cloneDeep(filteredDataList.value)
  let result: VATReconciliationData[] = []

  if (columnName) {
    if (sortColumnName.value !== columnName) sortBy.value = ''
    sortColumnName.value = columnName

    const indexSort = roleSort.findIndex((item) => item === sortBy.value)
    if (indexSort === -1) return setList(filteredDataList.value)
    sortBy.value = indexSort + 1 === roleSort.length ? roleSort[0] : roleSort[indexSort + 1]

    if (!sortBy.value) return setList(filteredDataList.value)
  }

  const name = columnName || sortColumnName.value

  if (name === 'Tgl Invoice' || name === 'Tgl Faktur Pajak' || name === 'VAT Credit Expiry Date') {
    result = listData.sort((a, b) => {
      // Handle potential date format DD/MM/YYYY or YYYY-MM-DD
      const parseDate = (dateStr: string) => {
        if (!dateStr || dateStr === '-') return 0
        if (dateStr.includes('/')) {
          const [d, m, y] = dateStr.split('/')
          return new Date(`${y}-${m}-${d}`).getTime()
        }
        return new Date(dateStr).getTime()
      }

      const valA = a[columnMap[name] as keyof VATReconciliationData]
      const valB = b[columnMap[name] as keyof VATReconciliationData]

      const convA = parseDate(String(valA))
      const convB = parseDate(String(valB))

      if (sortBy.value === 'asc') {
        return convA - convB
      } else {
        return convB - convA
      }
    })
  } else if (name === 'DPP' || name === 'PPN' || name === 'Amount') {
    result = listData.sort((a, b) => {
      const valA = a[columnMap[name] as keyof VATReconciliationData]
      const valB = b[columnMap[name] as keyof VATReconciliationData]

      const convA = Number(valA) || 0
      const convB = Number(valB) || 0

      if (sortBy.value === 'asc') {
        return convA - convB
      } else {
        return convB - convA
      }
    })
  } else {
    result = listData.sort((a, b) => {
      const valA = a[columnMap[name] as keyof VATReconciliationData]
      const valB = b[columnMap[name] as keyof VATReconciliationData]

      const convA = valA ? String(valA) : ''
      const convB = valB ? String(valB) : ''

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
  if (selectedItems.value.length === 0) {
    showWarningModal.value = true
    return
  }
  // Open authentication modal
  showAuthModal.value = true
}

// Authentication Modal handlers
const closeAuthModal = () => {
  showAuthModal.value = false
}

const handleAuthVerify = (code: string) => {
  console.log('Verification code received:', code)
  // TODO: Add API call to verify the code here
  // For now, show success modal after verification
  closeAuthModal()
  // successFpNumber.value = selectedItems.value[0]?.noFakturPajak || 'FP293429993' // No longer needed
  showSuccessModal.value = true
}

// Success Modal handlers
const closeSuccessModal = () => {
  showSuccessModal.value = false
  successFpNumber.value = ''
  selectedItems.value = [] // Clear selection after success
}

onMounted(async () => {
  await fetchVatData()
})

// Watch for changes in filtered data and update list
watch(
  filteredDataList,
  (newData) => {
    console.log('filteredDataList updated:', newData.length, 'items')
    setList(newData)
  },
  { immediate: true },
)
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

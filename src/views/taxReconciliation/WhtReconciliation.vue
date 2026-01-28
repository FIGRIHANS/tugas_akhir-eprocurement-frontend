<template>
  <div>
    <Breadcrumb title="WHT Reconciliation" :routes="routes" />
    <hr class="-mx-[24px] mb-[24px]" />

    <div class="border border-gray-200 rounded-xl p-[24px]">
      <!-- Header Section -->
      <div class="flex justify-between align-items-center gap-[8px] mb-[24px]">
        <h1>WHT Reconciliation</h1>
        <div class="flex align-items-center gap-3">
          <UiInputSearch v-model="search" placeholder="Search" @keypress="goSearch" />

          <!-- Filter Button -->
          <button class="btn btn-light" @click="toggleFilter()">
            <i class="ki-duotone ki-filter"></i>
            Filter
          </button>

          <button class="btn btn-light" @click="exportToXml()">
            <i class="ki-duotone ki-file-down"></i>
            Export XML
          </button>

          <button class="btn btn-primary" @click="exportData()">
            <i class="ki-duotone ki-plus-circle"></i>
            WHT Credit Posting
          </button>
        </div>
      </div>

      <!-- Filter Section -->
      <div v-if="showFilter" class="border border-gray-200 rounded-lg p-4 mb-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="form-label">Status WHT</label>
            <select v-model="filterForm.statusWht" class="form-select">
              <option value="">All Status</option>
              <option value="Valid">Valid</option>
              <option value="Invalid">Invalid</option>
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
            <tr>
              <th class="!border-b-blue-500 !bg-blue-100 !w-[50px] text-center">
                <input
                  type="checkbox"
                  class="checkbox"
                  :checked="isAllSelected"
                  @change="toggleSelectAll"
                />
              </th>
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
                <i v-if="item !== 'Action' ? true : false" class="ki-filled ki-arrow-up-down"></i>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredDataList?.length === 0">
              <td colspan="15" class="text-center">No data found.</td>
            </tr>
            <tr v-for="(item, index) in list" :key="index">
              <!-- Checkbox Column -->
              <td class="text-center">
                <input
                  type="checkbox"
                  class="checkbox"
                  :checked="isSelected(item)"
                  @change="toggleSelect(item)"
                />
              </td>
              <!-- Action Column - First -->
              <td>
                <button
                  class="btn btn-outline btn-icon btn-primary w-[32px] h-[32px]"
                  @click="goDetail(item)"
                >
                  <i class="ki-filled ki-eye !text-lg"></i>
                </button>
              </td>
              <!-- Data Columns -->
              <td>{{ item.masaPajak }}</td>
              <td>{{ item.tahunPajak }}</td>
              <td>{{ item.npwp }}</td>
              <td>{{ item.idTku }}</td>
              <td>{{ item.fasilitas }}</td>
              <td>{{ item.kodeObjek }}</td>
              <td class="text-right">{{ formatCurrency(item.dpp) }}</td>
              <td class="text-right">{{ item.tarif }}%</td>
              <td>{{ item.jenisDokRef }}</td>
              <td>{{ item.nomorDokRef }}</td>
              <td>{{ formatDate(item.tanggalDok) }}</td>
              <td class="text-center">
                <span class="badge badge-outline" :class="getStatusWhtBadgeClass(item.statusWht)">
                  {{ item.statusWht }}
                </span>
              </td>
              <td class="text-center">
                <span
                  class="badge badge-outline"
                  :class="getMatchStatusBadgeClass(item.matchStatus)"
                >
                  {{ item.matchStatus }}
                </span>
              </td>
              <td class="text-center">
                <span
                  class="badge badge-outline"
                  :class="getCreditStatusBadgeClass(item.creditStatus)"
                >
                  {{ item.creditStatus }}
                </span>
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

    <!-- Authentication Modal -->
    <AuthenticationModal :show="showAuthModal" @close="closeAuthModal" @verify="handleAuthVerify" />

    <!-- Successfully Credited Modal -->
    <ModalConfirmation
      :open="showSuccessModal"
      id="success-modal"
      type="success"
      title="Successfully Credited"
      text="WHT Receipt successfully credited"
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
      text="Please select at least one item to proceed with WHT Credit Posting."
      submit-button-text="Close"
      :no-cancel="true"
      :no-submit="true"
      :submit="closeWarningModal"
      :cancel="closeWarningModal"
    />

    <!-- Status Faktur Modal -->
    <div
      v-if="showStatusModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeStatusModal"
    >
      <div class="bg-white rounded-xl shadow-2xl w-[450px]">
        <!-- Modal Header -->
        <div class="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h3 class="text-xl font-semibold text-gray-800">Invoice Status</h3>
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
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { type routeTypes } from '@/core/type/components/breadcrumb'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import LPagination from '@/components/pagination/LPagination.vue'
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import momentLib from 'moment'
import { cloneDeep } from 'lodash'
import AuthenticationModal from './VatReconciliation/AuthenticationModal.vue'
import ModalConfirmation from '@/components/modal/ModalConfirmation.vue'

// Expose moment to template
const moment = momentLib

interface WHTReconciliationData {
  masaPajak: string
  tahunPajak: string
  npwp: string
  idTku: string
  fasilitas: string
  kodeObjek: string
  dpp: number
  tarif: number
  jenisDokRef: string
  nomorDokRef: string
  tanggalDok: string
  statusWht: string
  matchStatus: string
  creditStatus: string
}

interface FilterForm {
  statusWht: string
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
const list = ref<WHTReconciliationData[]>([])
const sortBy = ref<string>('')
const sortColumnName = ref<string>('')
const showFilter = ref<boolean>(false)
const filteredPayload = ref<{ key: string; value: string }[]>([])

const filterForm = ref<FilterForm>({
  statusWht: '',
  matchStatus: '',
  creditStatus: '',
})

// Modal state
const showStatusModal = ref<boolean>(false)
const selectedStatus = ref<string>('')
const statusSearch = ref<string>('')
const showStatusDropdown = ref<boolean>(false)
const currentSelectedItem = ref<WHTReconciliationData | null>(null)

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

// Actions Modal State
const showAuthModal = ref(false)
const showSuccessModal = ref(false)
const showWarningModal = ref(false)

// Selection Logic
const selectedItems = ref<WHTReconciliationData[]>([])

const isAllSelected = computed(() => {
  return list.value.length > 0 && selectedItems.value.length === list.value.length
})

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedItems.value = []
  } else {
    selectedItems.value = [...list.value]
  }
}

const toggleSelect = (item: WHTReconciliationData) => {
  const index = selectedItems.value.findIndex(
    (selected) =>
      selected.nomorDokRef === item.nomorDokRef && selected.kodeObjek === item.kodeObjek,
  )
  if (index === -1) {
    selectedItems.value.push(item)
  } else {
    selectedItems.value.splice(index, 1)
  }
}

const isSelected = (item: WHTReconciliationData) => {
  return selectedItems.value.some(
    (selected) =>
      selected.nomorDokRef === item.nomorDokRef && selected.kodeObjek === item.kodeObjek,
  )
}

// Columns based on user request
const columns = ref<string[]>([
  'Action',
  'Masa Pajak',
  'Tahun Pajak',
  'NPWP',
  'ID TKU Penerima Penghasilan',
  'Fasilitas',
  'Kode Objek',
  'DPP',
  'Tarif (%)', // Added unit for clarity
  'Jenis Dok. Referensi',
  'Nomor Dok. Referensi',
  'Tanggal Dokumen',
  'Status WHT',
  'Match Status',
  'Credit Status',
])

// Sample data logic: One invoice -> Multiple Tax Rows
const dataList = ref<WHTReconciliationData[]>([
  // Invoice 1: Multiple Tax Objects
  {
    masaPajak: '1',
    tahunPajak: '2025',
    npwp: '3172024806201234',
    idTku: '3172024806201234000000',
    fasilitas: 'N/A',
    kodeObjek: '22-100-07',
    dpp: 10000000,
    tarif: 0.25,
    jenisDokRef: 'CommercialInvoice',
    nomorDokRef: '0100012292489165',
    tanggalDok: '2024-01-13',
    statusWht: 'Valid',
    matchStatus: 'Match',
    creditStatus: 'Creditable',
  },
  {
    masaPajak: '1',
    tahunPajak: '2025',
    npwp: '3172024806201234',
    idTku: '3172024806201234000000',
    fasilitas: 'DTP',
    kodeObjek: '22-405-01',
    dpp: 10000000,
    tarif: 0.1,
    jenisDokRef: 'CommercialInvoice',
    nomorDokRef: '0100012292489165', // Same Invoice
    tanggalDok: '2024-01-13',
    statusWht: 'Valid',
    matchStatus: 'Match',
    creditStatus: 'Creditable',
  },

  // Invoice 2: Single Tax Object
  {
    masaPajak: '1',
    tahunPajak: '2025',
    npwp: '01.234.567.8-901.000',
    idTku: '012345678901000000000',
    fasilitas: 'N/A',
    kodeObjek: '23-100-01', // Jasa
    dpp: 5000000,
    tarif: 2,
    jenisDokRef: 'CommercialInvoice',
    nomorDokRef: 'INV/2025/001',
    tanggalDok: '2025-01-15',
    statusWht: 'Valid',
    matchStatus: 'Match',
    creditStatus: 'Creditable',
  },

  // Invoice 3: Mismatch Example
  {
    masaPajak: '1',
    tahunPajak: '2025',
    npwp: '02.345.678.9-012.000',
    idTku: '023456789012000000000',
    fasilitas: 'N/A',
    kodeObjek: '22-100-07',
    dpp: 15000000,
    tarif: 0.25,
    jenisDokRef: 'CommercialInvoice',
    nomorDokRef: 'INV/2025/002',
    tanggalDok: '2025-01-16',
    statusWht: 'Invalid',
    matchStatus: 'Mismatch', // Trigger red badge
    creditStatus: 'Hold',
  },

  // Invoice 4: Another Shared Invoice
  {
    masaPajak: '1',
    tahunPajak: '2025',
    npwp: '03.456.789.0-123.000',
    idTku: '034567890123000000000',
    fasilitas: 'N/A',
    kodeObjek: '24-104-08',
    dpp: 25000000,
    tarif: 2,
    jenisDokRef: 'CommercialInvoice',
    nomorDokRef: 'INV/2025/MIXED',
    tanggalDok: '2025-01-20',
    statusWht: 'Valid',
    matchStatus: 'Match',
    creditStatus: 'Creditable',
  },
  {
    masaPajak: '1',
    tahunPajak: '2025',
    npwp: '03.456.789.0-123.000',
    idTku: '034567890123000000000',
    fasilitas: 'N/A',
    kodeObjek: '23-100-02',
    dpp: 5000000,
    tarif: 2,
    jenisDokRef: 'CommercialInvoice',
    nomorDokRef: 'INV/2025/MIXED', // Same Invoice
    tanggalDok: '2025-01-20',
    statusWht: 'Valid',
    matchStatus: 'Mismatch',
    creditStatus: 'Not Creditable',
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

  // Apply filters
  if (filterForm.value.statusWht) {
    filtered = filtered.filter((item) => item.statusWht === filterForm.value.statusWht)
  }

  if (filterForm.value.matchStatus) {
    filtered = filtered.filter((item) => item.matchStatus.includes(filterForm.value.matchStatus))
  }

  if (filterForm.value.creditStatus) {
    filtered = filtered.filter((item) => item.creditStatus.includes(filterForm.value.creditStatus))
  }

  return filtered
})

const getStatusWhtBadgeClass = (status: string) => {
  if (status === 'Valid') return 'badge-success'
  if (status === 'Invalid') return 'badge-danger'
  return 'badge-secondary'
}

const getMatchStatusBadgeClass = (status: string) => {
  if (status === 'Match') return 'badge-success'
  if (status.includes('Mismatch')) return 'badge-danger' // Red for mismatch
  return 'badge-secondary'
}

const getCreditStatusBadgeClass = (status: string) => {
  if (status === 'Creditable') return 'badge-success'
  if (status === 'Not Creditable') return 'badge-danger'
  if (status === 'Hold') return 'badge-secondary'
  return 'badge-secondary'
}

const formatDate = (date: string) => {
  return moment(date).format('DD/MM/YYYY')
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

const setList = (listData: WHTReconciliationData[]) => {
  const result: WHTReconciliationData[] = []
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

const goDetail = (data: WHTReconciliationData) => {
  console.log('Detail', data)
  // Logic for detailed view can be added here
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

  if (filterForm.value.statusWht) {
    payload.push({ key: 'Status WHT', value: filterForm.value.statusWht })
  }

  if (filterForm.value.matchStatus) {
    payload.push({ key: 'Match Status', value: filterForm.value.matchStatus })
  }

  if (filterForm.value.creditStatus) {
    payload.push({ key: 'Credit Status', value: filterForm.value.creditStatus })
  }

  filteredPayload.value = payload
  currentPage.value = 1
  setList(filteredDataList.value)
}

const resetFilter = () => {
  filterForm.value = {
    statusWht: '',
    matchStatus: '',
    creditStatus: '',
  }
  filteredPayload.value = []
  currentPage.value = 1
  setList(filteredDataList.value)
}

const deleteFilter = (key: string) => {
  if (key === 'Status WHT') {
    filterForm.value.statusWht = ''
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
    'Masa Pajak': 'masaPajak',
    'Tahun Pajak': 'tahunPajak',
    NPWP: 'npwp',
    'ID TKU Penerima Penghasilan': 'idTku',
    Fasilitas: 'fasilitas',
    'Kode Objek': 'kodeObjek',
    DPP: 'dpp',
    'Tarif (%)': 'tarif',
    'Jenis Dok. Referensi': 'jenisDokRef',
    'Nomor Dok. Referensi': 'nomorDokRef',
    'Tanggal Dokumen': 'tanggalDok',
    'Status WHT': 'statusWht',
    'Match Status': 'matchStatus',
    'Credit Status': 'creditStatus',
  } as { [key: string]: string }

  const roleSort = ['asc', 'desc', '']
  const listData = cloneDeep(filteredDataList.value)
  let result: WHTReconciliationData[] = []

  if (columnName) {
    if (sortColumnName.value !== columnName) sortBy.value = ''
    sortColumnName.value = columnName

    const indexSort = roleSort.findIndex((item) => item === sortBy.value)
    if (indexSort === -1) return setList(filteredDataList.value)
    sortBy.value = indexSort + 1 === roleSort.length ? roleSort[0] : roleSort[indexSort + 1]

    if (!sortBy.value) return setList(filteredDataList.value)
  }

  const name = columnName || sortColumnName.value

  if (name === 'Tanggal Dokumen') {
    result = listData.sort((a, b) => {
      const convA = a[columnMap[name]] ? new Date(a[columnMap[name]]).getTime() : 0
      const convB = b[columnMap[name]] ? new Date(b[columnMap[name]]).getTime() : 0
      if (sortBy.value === 'asc') {
        return convA - convB
      } else {
        return convB - convA
      }
    })
  } else if (name === 'DPP' || name === 'Tarif (%)') {
    result = listData.sort((a, b) => {
      const convA = (a as Record<string, any>)[columnMap[name]] || 0
      const convB = (b as Record<string, any>)[columnMap[name]] || 0
      if (sortBy.value === 'asc') {
        return convA - convB
      } else {
        return convB - convA
      }
    })
  } else {
    result = listData.sort((a, b) => {
      const convA = (a as Record<string, any>)[columnMap[name]]
        ? String((a as Record<string, any>)[columnMap[name]])
        : ''
      const convB = (b as Record<string, any>)[columnMap[name]]
        ? String((b as Record<string, any>)[columnMap[name]])
        : ''
      if (sortBy.value === 'asc') {
        return convA.localeCompare(convB)
      } else {
        return convB.localeCompare(convA)
      }
    })
  }

  return setList(result)
}

const exportToXml = () => {
  const dataToExport = selectedItems.value.length > 0 ? selectedItems.value : filteredDataList.value

  if (dataToExport.length === 0) {
    alert('No data to export')
    return
  }

  // Hardcoded TIN for now, ideally comes from config/user profile
  const filerTin = '3172022408981234'

  let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xmlContent += '<BpuBulk xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">\n'
  xmlContent += `  <TIN>${filerTin}</TIN>\n`
  xmlContent += '  <ListOfBpu>\n'

  dataToExport.forEach((item) => {
    xmlContent += '    <Bpu>\n'
    xmlContent += `      <TaxPeriodMonth>${item.masaPajak}</TaxPeriodMonth>\n`
    xmlContent += `      <TaxPeriodYear>${item.tahunPajak}</TaxPeriodYear>\n`
    xmlContent += `      <CounterpartTin>${item.npwp}</CounterpartTin>\n`
    xmlContent += `      <IDPlaceOfBusinessActivityOfIncomeRecipient>${item.idTku}</IDPlaceOfBusinessActivityOfIncomeRecipient>\n`
    xmlContent += `      <TaxCertificate>${item.fasilitas || 'N/A'}</TaxCertificate>\n`
    xmlContent += `      <TaxObjectCode>${item.kodeObjek}</TaxObjectCode>\n`
    xmlContent += `      <TaxBase>${Math.round(item.dpp)}</TaxBase>\n`
    xmlContent += `      <Rate>${item.tarif}</Rate>\n`
    xmlContent += `      <Document>${item.jenisDokRef}</Document>\n`
    xmlContent += `      <DocumentNumber>${item.nomorDokRef}</DocumentNumber>\n`
    xmlContent += `      <DocumentDate>${item.tanggalDok}</DocumentDate>\n`
    // Placeholder values for fields not in current data interface
    xmlContent += `      <IDPlaceOfBusinessActivity>3172022407981234000000</IDPlaceOfBusinessActivity>\n`
    xmlContent += `      <GovTreasurerOpt>N/A</GovTreasurerOpt>\n`
    xmlContent += `      <SP2DNumber xsi:nil="true"/>\n`
    // Assuming WithholdingDate is same as DocumentDate or derived
    xmlContent += `      <WithholdingDate>${item.tanggalDok}</WithholdingDate>\n`
    xmlContent += '    </Bpu>\n'
  })

  xmlContent += '  </ListOfBpu>\n'
  xmlContent += '</BpuBulk>'

  const blob = new Blob([xmlContent], { type: 'application/xml' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `WHT_Export_${moment().format('YYYYMMDD_HHmmss')}.xml`
  link.click()
  URL.revokeObjectURL(link.href)
}

const exportData = () => {
  if (selectedItems.value.length === 0) {
    showWarningModal.value = true
    return
  }
  showAuthModal.value = true
}

const closeWarningModal = () => {
  showWarningModal.value = false
}

const closeAuthModal = () => {
  showAuthModal.value = false
}

const handleAuthVerify = (code: string) => {
  console.log('Verifying WHT with code:', code) // Code is practically ignored as we just need verify event
  closeAuthModal()
  showSuccessModal.value = true
}

const closeSuccessModal = () => {
  showSuccessModal.value = false
  selectedItems.value = [] // Clear items
}

// Status Modal Methods
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
  if (selectedStatus.value && currentSelectedItem.value) {
    console.log('Saving status:', selectedStatus.value, 'for item:', currentSelectedItem.value)
    // TODO: Implement API call to save status
    alert(`Status "${selectedStatus.value}" saved successfully!`)
    closeStatusModal()
  }
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

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
          <button
            class="btn btn-light"
            @click="openStatusModal()"
            :disabled="selectedItems.length === 0"
          >
            <i class="ki-duotone ki-setting-2"></i>
            Update Status
          </button>

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
            <tr v-if="filteredDataList?.length === 0">
              <td colspan="13" class="text-center">No data found.</td>
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

              <!-- Vendor Name -->
              <td>{{ item.vendorName }}</td>

              <!-- NPWP Vendor -->
              <td>{{ item.npwpVendor }}</td>

              <!-- Tgl Faktur Pajak -->
              <td>{{ formatDate(item.tglFakturPajak) }}</td>

              <!-- No Faktur Pajak -->
              <td>{{ item.noFakturPajak }}</td>

              <!-- Amount -->
              <td class="text-right">{{ formatCurrency(item.amount) }}</td>

              <!-- DPP -->
              <td class="text-right">{{ formatCurrency(item.dpp) }}</td>

              <!-- PPN -->
              <td class="text-right">{{ formatCurrency(item.ppn) }}</td>

              <!-- Status FP -->
              <td class="text-center">
                <span class="badge badge-outline" :class="getStatusFPBadgeClass(item.statusFP)">
                  {{ item.statusFP }}
                </span>
              </td>

              <!-- Status AP vs FP -->
              <td class="text-center">
                <span
                  class="badge badge-outline"
                  :class="getMatchStatusBadgeClass(item.statusAPvsFP)"
                >
                  {{ item.statusAPvsFP }}
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

              <!-- VAT Credit Expiry Date -->
              <td>{{ formatDate(item.vatCreditExpiryDate) }}</td>

              <!-- Remark -->
              <td>{{ item.remark || '-' }}</td>
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

    <div
      v-if="showVatCreditPostingModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeVatCreditPostingModal"
    >
      <div class="bg-white rounded-xl shadow-2xl w-[450px]">
        <!-- Modal Header -->
        <div class="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h3 class="text-xl font-semibold text-gray-800">
            Enter The Code For VAT Credit Posting
            <span v-if="selectedItems.length > 1" class="text-sm text-gray-500">
              ({{ selectedItems.length }} items selected)
            </span>
          </h3>
          <button
            @click="closeVatCreditPostingModal"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <i class="ki-filled ki-cross text-xl"></i>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="px-6 py-6">
          <label class="form-label text-sm font-medium text-gray-700 mb-2"> Input Code </label>
          <div class="relative">
            <!-- Dropdown Panel -->
            <div class="w-full mt-2 rounded-lg">
              <!-- Search Box -->
              <UiInput v-model="codeVatCreditPosting" placeholder="Input Code" />

              <!-- Status Options -->
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="flex gap-3 justify-end px-6 py-4 bg-gray-50 rounded-b-xl">
          <button class="btn btn-light px-6" @click="closeVatCreditPostingModal">Cancel</button>
          <button
            class="btn btn-primary px-6"
            @click="saveVatCreditPosting"
            :disabled="codeVatCreditPosting.length === 0"
            :class="{ 'opacity-50 cursor-not-allowed': codeVatCreditPosting.length === 0 }"
          >
            Save
          </button>
        </div>
      </div>
    </div>

    <UiModal v-model="showModalSuccess" size="sm">
      <div class="text-center mb-6">
        <ModalSuccessLogo class="mx-auto" />
        <h3 class="text-center text-lg font-medium">Yeayyy</h3>
        <p class="text-center text-base text-gray-600 mb-5">VAT credit posting successfully</p>
        <button class="btn btn-primary px-6" @click="closeModalSuccessPosting">Close</button>
      </div>
    </UiModal>
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
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
import UiModal from '@/components/modal/UiModal.vue'
import ModalSuccessLogo from '@/assets/svg/ModalSuccessLogo.vue'

// Expose moment to template
const moment = momentLib
const router = useRouter()

interface VATReconciliationData {
  vendorName: string
  npwpVendor: string
  tglFakturPajak: string
  noFakturPajak: string
  amount: number
  dpp: number
  ppn: number
  statusFP: string
  statusAPvsFP: string
  creditStatus: string
  vatCreditExpiryDate: string
  remark: string
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
const showModalSuccess = ref<boolean>(false)
const showVatCreditPostingModal = ref<boolean>(false)
const showStatusModal = ref<boolean>(false)
const selectedStatus = ref<string>('')
const statusSearch = ref<string>('')
const showStatusDropdown = ref<boolean>(false)
const currentSelectedItem = ref<VATReconciliationData | null>(null)

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

const codeVatCreditPosting = ref<string>('')

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

// Sample data
const dataList = ref<VATReconciliationData[]>([
  {
    vendorName: 'United Tractor TB',
    npwpVendor: '111111111111110',
    tglFakturPajak: '2025-09-01',
    noFakturPajak: '40211111111101',
    amount: 5000000,
    dpp: 4583333,
    ppn: 550000,
    statusFP: 'Approved',
    statusAPvsFP: 'Match',
    creditStatus: 'Creditable',
    vatCreditExpiryDate: '2025-12-01',
    remark: '',
  },
  {
    vendorName: 'Astra Otoparts Tbk',
    npwpVendor: '222222222222220',
    tglFakturPajak: '2025-09-03',
    noFakturPajak: '40211111111102',
    amount: 7500000,
    dpp: 6875000,
    ppn: 825000,
    statusFP: 'Approved',
    statusAPvsFP: 'Mismatch',
    creditStatus: 'Hold',
    vatCreditExpiryDate: '2025-12-03',
    remark: 'Amount mismatch',
  },
  {
    vendorName: 'Indofood CBP',
    npwpVendor: '333333333333330',
    tglFakturPajak: '2025-09-05',
    noFakturPajak: '40211111111103',
    amount: 3000000,
    dpp: 2750000,
    ppn: 330000,
    statusFP: 'Rejected',
    statusAPvsFP: 'Mismatch',
    creditStatus: 'Not Creditable',
    vatCreditExpiryDate: '2025-12-05',
    remark: 'Invalid FP',
  },
  {
    vendorName: 'Telkom Indonesia',
    npwpVendor: '444444444444440',
    tglFakturPajak: '2025-09-07',
    noFakturPajak: '40211111111104',
    amount: 12000000,
    dpp: 11000000,
    ppn: 1320000,
    statusFP: 'Approved',
    statusAPvsFP: 'Match',
    creditStatus: 'Creditable',
    vatCreditExpiryDate: '2025-12-07',
    remark: '',
  },
  {
    vendorName: 'PLN Persero',
    npwpVendor: '555555555555550',
    tglFakturPajak: '2025-09-09',
    noFakturPajak: '40211111111105',
    amount: 9500000,
    dpp: 8727273,
    ppn: 1047273,
    statusFP: 'Credited',
    statusAPvsFP: 'Match',
    creditStatus: 'Credited',
    vatCreditExpiryDate: '2025-12-09',
    remark: 'Already credited',
  },
  {
    vendorName: 'Pertamina Patra Niaga',
    npwpVendor: '666666666666660',
    tglFakturPajak: '2025-09-11',
    noFakturPajak: '40211111111106',
    amount: 20000000,
    dpp: 18333333,
    ppn: 2200000,
    statusFP: 'Approved',
    statusAPvsFP: 'Match',
    creditStatus: 'Creditable',
    vatCreditExpiryDate: '2025-12-11',
    remark: '',
  },
  {
    vendorName: 'Bank Mandiri',
    npwpVendor: '777777777777770',
    tglFakturPajak: '2025-09-13',
    noFakturPajak: '40211111111107',
    amount: 6500000,
    dpp: 5963303,
    ppn: 715697,
    statusFP: 'Approved',
    statusAPvsFP: 'Mismatch',
    creditStatus: 'Hold',
    vatCreditExpiryDate: '2025-12-13',
    remark: 'PPN difference',
  },
  {
    vendorName: 'BCA Finance',
    npwpVendor: '888888888888880',
    tglFakturPajak: '2025-09-15',
    noFakturPajak: '40211111111108',
    amount: 4000000,
    dpp: 3669725,
    ppn: 440275,
    statusFP: 'Rejected',
    statusAPvsFP: 'Mismatch',
    creditStatus: 'Not Creditable',
    vatCreditExpiryDate: '2025-12-15',
    remark: 'FP not valid',
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

  // Apply status FP filter
  if (filterForm.value.statusFP) {
    filtered = filtered.filter((item) => item.statusFP === filterForm.value.statusFP)
  }

  // Apply match status filter
  if (filterForm.value.matchStatus) {
    filtered = filtered.filter((item) => item.statusAPvsFP.includes(filterForm.value.matchStatus))
  }

  // Apply credit status filter
  if (filterForm.value.creditStatus) {
    filtered = filtered.filter((item) => item.creditStatus.includes(filterForm.value.creditStatus))
  }

  return filtered
})

const getStatusFPBadgeClass = (status: string) => {
  if (status === 'Approved') return 'badge-success'
  if (status === 'Credited') return 'badge-primary'
  if (status === 'Rejected') return 'badge-danger'
  return 'badge-secondary'
}

const getMatchStatusBadgeClass = (status: string) => {
  if (status === 'Match') return 'badge-success'
  if (status.includes('Mismatch')) return 'badge-warning'
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

const saveVatCreditPosting = () => {
  closeVatCreditPostingModal()
  showModalSuccess.value = true
}

const closeVatCreditPostingModal = () => {
  showVatCreditPostingModal.value = false
  codeVatCreditPosting.value = ''
}

const closeModalSuccessPosting = () => {
  showModalSuccess.value = false
}

const openStatusModal = () => {
  if (selectedItems.value.length > 0) {
    // Use first selected item for modal display
    currentSelectedItem.value = selectedItems.value[0]
    selectedStatus.value = ''
    statusSearch.value = ''
    showStatusDropdown.value = false
    showStatusModal.value = true
  }
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
    (selected) => selected.noFakturPajak === item.noFakturPajak, // Using nsfp as unique identifier
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
  const columnMap: Record<string, string> = {
    'Vendor Name': 'vendorName',
    'NPWP Vendor': 'npwpVendor',
    'Tgl Faktur Pajak': 'tglFakturPajak',
    'No. Faktur Pajak': 'noFakturPajak',
    Amount: 'amount',
    DPP: 'dpp',
    PPN: 'ppn',
    'Status FP': 'statusFP',
    'Status AP vs FP': 'statusAPvsFP',
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

  if (name === 'Tgl Invoice' || name === 'Tgl FP') {
    result = listData.sort((a, b) => {
      const convA = a[columnMap[name]] ? new Date(a[columnMap[name]]).getTime() : 0
      const convB = b[columnMap[name]] ? new Date(b[columnMap[name]]).getTime() : 0
      if (sortBy.value === 'asc') {
        return convA - convB
      } else {
        return convB - convA
      }
    })
  } else if (name === 'DPP' || name === 'PPN') {
    result = listData.sort((a, b) => {
      const convA = a[columnMap[name]] || 0
      const convB = b[columnMap[name]] || 0
      if (sortBy.value === 'asc') {
        return convA - convB
      } else {
        return convB - convA
      }
    })
  } else {
    result = listData.sort((a, b) => {
      const convA = a[columnMap[name]] ? String(a[columnMap[name]]) : ''
      const convB = b[columnMap[name]] ? String(b[columnMap[name]]) : ''
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
  showVatCreditPostingModal.value = true
  // Navigate to invoice add page with preview tab
  // router.push({
  //   name: 'invoiceAdd',
  //   query: {
  //     tab: 'preview',
  //     type: 'po-view',
  //   },
  // })
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

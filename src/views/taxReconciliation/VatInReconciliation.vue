<template>
  <div>
    <Breadcrumb title="VAT (Pajak Masukan)" :routes="routes" />
    <hr class="-mx-[24px] mb-[24px]" />

    <div class="card shadow-sm border border-gray-200 rounded-xl overflow-hidden bg-white">
      <!-- Tab Content -->
      <div class="card-body p-0">
        <!-- Shared Header -->
        <div class="flex justify-between items-center gap-3 flex-wrap px-[24px] pt-[24px] mb-[32px]">
          <div class="flex flex-col gap-1">
            <h3 class="text-lg font-semibold text-gray-800 m-0">List Data</h3>
          </div>
          
          <!-- Header Actions (only for Queue) -->
          <div v-if="workspace === 'queue'" class="flex gap-2 flex-wrap items-center">
            <UiInputSearch v-model="pendingSearch" placeholder="Search invoice / vendor" @search="fetchPendingVat" />
            <button type="button" class="btn btn-outline btn-primary" @click="fetchPendingVat">
              <i class="ki-filled ki-arrows-circle !text-base"></i>
              Refresh
            </button>
            <button type="button" class="btn btn-primary" @click="goManualPjSubmit">
              <i class="ki-filled ki-plus-circle !text-base"></i>
              Submit without Invoice
            </button>
          </div>
        </div>

        <!-- View Toggle Tabs -->
        <div class="flex items-center border border-gray-200 rounded-lg overflow-hidden text-sm w-fit mb-8 mx-[24px]">
          <button
            type="button"
            :class="[
              'px-4 py-2 font-medium transition-colors flex items-center gap-2',
              workspace === 'queue'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-500 hover:bg-gray-50',
            ]"
            @click="setWorkspace('queue')"
          >
            Invoice Queue
          </button>
          <button
            type="button"
            :class="[
              'px-4 py-2 font-medium transition-colors border-l border-gray-200 flex items-center gap-2',
              workspace === 'pj'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-500 hover:bg-gray-50',
            ]"
            @click="setWorkspace('pj')"
          >
            Pajak Express
          </button>
        </div>

      <template v-if="workspace === 'queue'">
        <div class="overflow-x-auto mx-[24px] rounded-xl mb-[8px]">
        <table class="table align-middle text-gray-700 font-medium text-sm">
          <thead>
            <tr>
              <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500">Source</th>
              <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500">Invoice No</th>
              <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500">Vendor</th>
              <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500">NPWP</th>
              <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500 text-right">DPP</th>
              <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500 text-right">VAT</th>
              <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loadingPendingVat">
              <td colspan="7" class="text-center py-10">
                <span class="loading loading-spinner loading-md text-primary"></span>
                <p class="mt-2 text-gray-500">Loading invoices…</p>
              </td>
            </tr>
            <tr v-else-if="pendingVatRows.length === 0">
              <td colspan="7" class="text-center py-10 text-gray-400 italic">
                No approved invoices pending VAT reconciliation.
              </td>
            </tr>
            <tr v-for="(inv, idx) in pendingVatRows" :key="'pv-' + idx + '-' + (inv.invoiceNo || '')">
              <td>
                <span
                  :class="
                    inv.invoiceSource === 'PO'
                      ? 'badge badge-light-primary px-2'
                      : 'badge badge-light-warning px-2'
                  "
                >
                  {{ inv.invoiceSource || '—' }}
                </span>
              </td>
              <td>{{ inv.invoiceNo || '—' }}</td>
              <td>{{ inv.vendorName || '—' }}</td>
              <td>{{ inv.vendorNpwp || '—' }}</td>
              <td class="text-right">{{ formatCurrency(inv.dpp ?? 0) }}</td>
              <td class="text-right text-primary font-medium">{{ formatCurrency(displayVatOnRow(inv)) }}</td>
              <td class="text-center">
                <button type="button" class="btn btn-primary" @click="goSubmitFromInvoice(inv)">
                  Submit to PJ
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        </div>

      <!-- Pending Pagination Footer -->
      <div v-if="pendingVatTotal > 0" class="flex items-center justify-between mt-[24px] px-[24px] pb-[24px]">
        <p class="text-sm text-gray-500">
          Showing <b>{{ pendingVatRows.length }}</b> of <b>{{ pendingVatTotal }}</b> entries
        </p>
        <LPagination
          :totalItems="pendingVatTotal"
          :pageSize="pendingVatLimit"
          :currentPage="pendingVatPage"
          @pageChange="onPendingPageChange"
        />
      </div>
      </template>

      <template v-else-if="workspace === 'pj'">
      <!-- Header Section -->
      <div class="flex flex-col gap-4 mb-[24px] px-[24px]">
        <!-- Coretax Period Sub-header -->
        <div v-if="workspace === 'pj'" class="flex flex-wrap items-end justify-between gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200 w-full">
          
          <!-- Left side: Tax Period & Actions -->
          <div class="flex flex-wrap items-end gap-3">
            <div class="form-control">
              <label class="label py-0 pb-1.5"><span class="label-text text-sm font-semibold text-gray-700">Tax Period (Coretax list)</span></label>
              <div class="flex gap-2">
                <select v-model="pjMonth" class="select select-bordered w-[100px] bg-white" @change="onPajakExpressPeriodChanged">
                  <option v-for="m in pjMonthOptions" :key="m.v" :value="m.v">{{ m.label }}</option>
                </select>
                <input
                  v-model="pjYear"
                  type="text"
                  maxlength="4"
                  class="input input-bordered w-[80px] bg-white"
                  placeholder="yyyy"
                  @change="onPajakExpressPeriodChanged"
                />
              </div>
            </div>
            
            <div class="h-[40px] w-[1px] bg-gray-300 mx-2 hidden lg:block"></div>
            
            <button type="button" class="btn btn-outline btn-primary bg-white" :disabled="isLoading || isPrepopulating" @click="reloadVat">
              <i class="ki-duotone ki-arrows-circle !text-base"></i>
              Reload Data
            </button>
            <button type="button" class="btn btn-warning" :disabled="isLoading || isPrepopulating" @click="runPrepopulateBulk">
              <i class="ki-duotone ki-cloud-download !text-base"></i>
              Pull Prepopulated Data
              <span v-if="isPrepopulating" class="loading loading-spinner loading-xs ml-1"></span>
            </button>
          </div>

          <!-- Right side: Search & Filter -->
          <div class="flex items-center gap-3">
            <UiInputSearch v-model="search" placeholder="Search" @keypress="goSearch" />

            <button class="btn btn-light bg-white border-gray-200" @click="toggleFilter()">
              <i class="ki-duotone ki-filter"></i>
              Filter
            </button>
          </div>

        </div>

      </div>

      <!-- Filter Section -->
      <div v-if="showFilter" class="border border-gray-200 rounded-lg p-4 mb-4 mx-[24px]">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="form-label">Status FP</label>
            <select v-model="filterForm.statusFP" class="form-select">
              <option value="">All Status</option>
              <option value="Approved">Approved</option>
              <option value="Credited">Credited</option>
              <option value="Rejected">Rejected</option>
              <option value="Created">Created</option>
              <option value="Amended">Amended</option>
              <option value="Canceled">Canceled</option>
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
              <option value="CREDITED">CREDITED</option>
              <option value="UNCREDITED">UNCREDITED</option>
              <option value="INVALID">INVALID</option>
            </select>
          </div>
        </div>
        <div class="flex gap-2 mt-4">
          <button class="btn btn-primary btn-sm" @click="applyFilter()">Apply Filter</button>
          <button class="btn btn-light btn-sm" @click="resetFilter()">Reset</button>
        </div>
      </div>

      <!-- Active Filters Display -->
      <div class="flex overflow-x-auto gap-3 mb-5 items-center px-[24px]" v-if="filteredPayload.length > 0">
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
      <div class="overflow-x-auto list__table mx-[24px] rounded-xl overflow-hidden">
        <table class="table align-middle text-gray-700 font-medium text-sm">
          <thead>
            <!-- Blue header styling -->
            <tr>
              <!-- Checkbox & Action Column Header -->
              <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500">
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
                class="!border-b-teal-500 !bg-teal-100 !text-teal-500 cursor-pointer"
                :class="{
                  list__long: index !== 0,
                  '!text-primary': item === sortColumnName && sortBy !== '',
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
                    class="btn btn-outline btn-icon btn-primary w-[32px] h-[32px] tooltip"
                    data-tip="View Details"
                    @click="goDetail(item)"
                  >
                    <i class="ki-filled ki-eye !text-lg"></i>
                  </button>
                  <button
                    v-if="workspace === 'pj' && item.action"
                    class="btn btn-outline btn-icon btn-success w-[32px] h-[32px] tooltip"
                    data-tip="Download PDF"
                    @click="handleDownloadPdf(item)"
                  >
                    <i class="ki-filled ki-file-down !text-lg"></i>
                  </button>
                  <button
                    v-if="workspace === 'pj'"
                    class="btn btn-outline btn-icon btn-warning w-[32px] h-[32px] tooltip"
                    data-tip="Replace/Cancel"
                    @click="openReplaceCancelModal(item)"
                  >
                    <i class="ki-filled ki-arrows-loop !text-lg"></i>
                  </button>
                </div>
              </td>
              <!-- Other Columns -->
              <td>
                <div class="flex items-center gap-2">
                  <span>{{ item.vendorName }}</span>
                  <span
                    :class="
                      item.poNumber && item.poNumber !== '-'
                        ? 'badge badge-light-primary px-2 font-semibold text-xs'
                        : 'badge badge-light-warning px-2 font-semibold text-xs'
                    "
                  >
                    {{ item.poNumber && item.poNumber !== '-' ? 'PO' : 'Non-PO' }}
                  </span>
                </div>
              </td>
              <td>{{ item.npwpVendor }}</td>
              <td>{{ formatDate(item.tglFakturPajak) }}</td>
              <td>{{ item.noFakturPajak }}</td>
              <td class="text-right">{{ formatCurrency(item.amount) }}</td>
              <td class="text-right">{{ formatCurrency(item.dpp) }}</td>

              <!-- PPN -->
              <td class="text-right">{{ formatCurrency(item.ppn) }}</td>

              <td>
                <span class="badge badge-outline" :class="getStatusFPBadgeClass(item.statusFp)">
                  {{ item.statusFp || '-' }}
                </span>
              </td>

              <td>
                <span
                  class="badge badge-outline"
                  :class="getMatchStatusBadgeClass(item.statusApVsFp)"
                >
                  {{ item.statusApVsFp || '-' }}
                </span>
              </td>

              <td>
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
      <div class="flex items-center justify-between mt-[24px] flex-wrap gap-2 px-[24px] pb-[24px]">
        <p class="m-0 text-sm">
          Showing
          {{
            pageSize * currentPage > (workspace === 'pj' ? (pjTotalRows > 0 ? pjTotalRows : list.length) : filteredDataList.length)
              ? (workspace === 'pj' ? (pjTotalRows > 0 ? pjTotalRows : list.length) : filteredDataList.length)
              : pageSize * currentPage
          }}
          of {{ workspace === 'pj' ? (pjTotalRows > 0 ? pjTotalRows : list.length) : filteredDataList.length }} entries
        </p>
        <LPagination
          :totalItems="paginationTotalForPager"
          :pageSize="pageSize"
          :currentPage="currentPage"
          @pageChange="setPage"
        />
      </div>
      </template>
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
              class="w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg hover:border-primary-clarity focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all flex justify-between items-center"
              :class="{ 'border-primary ring-2 ring-primary-clarity': showStatusDropdown }"
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
                    class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
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
                  class="px-4 py-3 hover:bg-primary-light cursor-pointer transition-colors text-sm font-medium"
                  :class="{
                    'bg-primary-light text-primary': selectedStatus === status,
                    'text-gray-700': selectedStatus !== status,
                  }"
                >
                  <div class="flex items-center justify-between">
                    <span>{{ status }}</span>
                    <i v-if="selectedStatus === status" class="ki-filled ki-check text-primary"></i>
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
import { postVatInUpload, postVatInPrepopulated, postVatInDownloadPdf, postVatInReplaceCancel } from '@/core/utils/vatPxInvoiceApi'
import axios from 'axios'
import BpuService, { type InvoiceVatQueueRow } from '@/services/bpu.service'
import { useNotificationStore } from '@/stores/notification/notificationStore'

// Expose moment to template
const moment = momentLib
const router = useRouter()

interface VATReconciliationData {
  id?: number | string | null
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
  poNumber?: string
  invoiceNo?: string
}

interface FilterForm {
  statusFP: string
  matchStatus: string
  creditStatus: string
}

const routes = ref<routeTypes[]>([
  { name: 'Tax Reconciliation' },
])

const search = ref<string>('')
const currentPage = ref<number>(1)
const pageSize = ref<number>(10)
const list = ref<VATReconciliationData[]>([])
const isLoading = ref<boolean>(false)
const isPrepopulating = ref<boolean>(false)
/** Batch posting IF_TXR_015 upload while auth flow runs. */
const isPostingVat = ref<boolean>(false)
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

type VatDataSource = 'erp' | 'pajakExpress'

type Workspace = 'queue' | 'pj'

const workspace = ref<Workspace>('queue')
const pendingVatRows = ref<InvoiceVatQueueRow[]>([])
const loadingPendingVat = ref(false)
const pendingSearch = ref('')
const pendingVatPage = ref(1)
const pendingVatLimit = ref(10)
const pendingVatTotal = ref(0)

function onPendingPageChange(page: number) {
  pendingVatPage.value = page
  fetchPendingVat()
}

/** Tab PJ: driver fetch `vat-reconciliation`; antrian pakai Invoice API `/tax/available-invoices`. */
const dataSource = ref<VatDataSource>('erp')

const pjMonthOptions = Array.from({ length: 12 }, (_, i) => {
  const v = String(i + 1).padStart(2, '0')
  return { v, label: v }
})

const pjMonth = ref(momentLib().format('MM'))
const pjYear = ref(String(momentLib().year()))
/** Total rows reported by Pajak Express IF_TXR_015 header (server-side paging). */
const pjTotalRows = ref(0)

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
  'Tax Invoice Date',
  'Tax Invoice No.',
  'Amount',
  'DPP',
  'PPN',
  'Tax Invoice Status',
  'AP vs Tax Invoice Status',
  'Credit Status',
  'VAT Credit Expiry Date',
  'Remark',
])

// Data list now populated from API
const dataList = ref<VATReconciliationData[]>([])

function readPxVatHeader(response: { headers?: unknown }, canonName: string): string {
  const h = response.headers
  if (!h || typeof h !== 'object') return ''
  const lower = canonName.toLowerCase()
  const getter = typeof (h as { get?: (key: string) => unknown }).get === 'function'
    ? (h as { get: (key: string) => unknown }).get.bind(h)
    : null
  if (getter) {
    const fromGet = getter(canonName) ?? getter(lower)
    if (fromGet !== undefined && fromGet !== null && String(fromGet).trim() !== '')
      return String(fromGet).trim()
  }
  const rec = h as Record<string, unknown>
  for (const [k, v] of Object.entries(rec)) {
    if (typeof k !== 'string' || v === undefined || v === null) continue
    if (typeof v === 'function') continue
    if (k.toLowerCase() === lower) return String(v).trim()
  }
  return ''
}

function strFrom(row: Record<string, unknown>, ...keys: string[]): string {
  for (const k of keys) {
    const v = row[k]
    if (v === undefined || v === null) continue
    const s = String(v).trim()
    if (s !== '') return s
  }
  return ''
}

function nullableStrFrom(row: Record<string, unknown>, ...keys: string[]): string | null {
  const s = strFrom(row, ...keys)
  return s === '' ? null : s
}

function normalizeVatApiRow(raw: unknown): VATReconciliationData {
  const r = (raw ?? {}) as Record<string, unknown>

  const vendorName = strFrom(r, 'vendorName', 'VendorName')
  const npwpVendor = strFrom(r, 'npwpVendor', 'NpwpVendor', 'NPWPPembeli', 'npwpPembeli')
  const tglFakturPajak = strFrom(r, 'tglFakturPajak', 'TglFakturPajak')
  const noFakturPajak = strFrom(r, 'noFakturPajak', 'NoFakturPajak')

  const toNum = (v: unknown) => {
    if (v === undefined || v === null || v === '') return 0
    const n = Number(v)
    return Number.isFinite(n) ? n : 0
  }

  const amount = toNum(r.amount ?? r.Amount)
  const dpp = toNum(r.dpp ?? r.DPP)
  const ppn = toNum(r.ppn ?? r.PPN)

  const statusFp = nullableStrFrom(r, 'statusFp', 'StatusFp', 'StatusFP')
  const statusApVsFp = nullableStrFrom(r, 'statusApVsFp', 'StatusApVsFp')
  const creditStatus = strFrom(r, 'creditStatus', 'CreditStatus') || 'UNCREDITED'
  const vatCreditExpiryDate = strFrom(r, 'vatCreditExpiryDate', 'VatCreditExpiryDate')
  const remark = strFrom(r, 'remark', 'Remark')
  const action = nullableStrFrom(r, 'action', 'Action')

  const poNumber = strFrom(r, 'poNumber', 'PoNumber')
  const invoiceNo = strFrom(r, 'invoiceNo', 'InvoiceNo', 'invoiceNumber')
  const id = r.id ?? r.Id ?? null

  return {
    id: id as number | string | null,
    vendorName,
    npwpVendor,
    tglFakturPajak,
    noFakturPajak,
    amount,
    dpp,
    ppn,
    statusFp,
    statusApVsFp,
    creditStatus,
    vatCreditExpiryDate,
    remark,
    action,
    poNumber,
    invoiceNo,
  }
}

/**
 * Loads VAT reconciliation: ERP uses stored proc list; Pajak Express calls IF_TXR_015 mapped list with server paging.
 */
const fetchVatData = async (opts?: { page?: number }) => {
  isLoading.value = true
  try {
    if (dataSource.value === 'pajakExpress') {
      const y = pjYear.value.replace(/\D/g, '')
      const page = opts?.page ?? currentPage.value
      if (opts?.page !== undefined) currentPage.value = opts.page

      if (y.length !== 4 || !pjMonth.value) {
        vatData.value = []
        dataList.value = []
        pjTotalRows.value = 0
        return
      }

      const periode = `${pjMonth.value}/${y}`
      const response = await vatApi.get('/vat/vat-reconciliation', {
        params: {
          source: 'PajakExpress',
          periode,
          page,
          limit: pageSize.value,
        },
      })

      const rawList = response.data.result?.content || []
      const content = (Array.isArray(rawList) ? rawList : []).map((row: unknown) =>
        normalizeVatApiRow(row),
      )

      const totalRowStr = readPxVatHeader(response, 'X-Px-Vat-In-TotalRow')
      const parsedTotal = parseInt(totalRowStr, 10)
      pjTotalRows.value = Number.isFinite(parsedTotal) && parsedTotal > 0 ? parsedTotal : content.length

      vatData.value = content
      dataList.value = content
    } else {
      pjTotalRows.value = 0
      const response = await vatApi.get('/vat/vat-reconciliation')
      const rawList = response.data.result?.content || []
      const content = (Array.isArray(rawList) ? rawList : []).map((row: unknown) =>
        normalizeVatApiRow(row),
      )

      vatData.value = content
      dataList.value = content

      const notificationStore = useNotificationStore()
      const newExpiryNotifications = notificationStore.checkVatExpiryNotifications(content)
      const newMismatchNotifications = notificationStore.checkVatMismatchNotifications(content)
      if (newExpiryNotifications > 0 || newMismatchNotifications > 0) {
        console.log(`Created ${newExpiryNotifications} expiry and ${newMismatchNotifications} mismatch notifications`)
      }
    }
  } catch (error) {
    console.error('Error fetching VAT reconciliation data:', error)
    vatData.value = []
    dataList.value = []
    pjTotalRows.value = 0
  } finally {
    isLoading.value = false
  }
}

async function runPrepopulateBulk() {
  if (!pjMonth.value || !pjYear.value || pjYear.value.length !== 4) return
  isPrepopulating.value = true
  try {
    const payload = {
      fgPermintaan: 1,
      requestFakturMasukan: {
        prepopTahunPajak: pjYear.value,
        prepopMasaPajak: pjMonth.value,
      }
    }
    const res = await postVatInPrepopulated(payload)
    if (!res.data?.isError) {
      console.log('Prepopulated data retrieved successfully.')
    } else {
      console.warn('Prepopulated data issue:', res.data?.message)
    }
    await fetchVatData()
  } catch (error) {
    console.error('Error prepopulating VAT in:', error)
  } finally {
    isPrepopulating.value = false
  }
}

async function fetchPendingVat() {
  loadingPendingVat.value = true
  try {
    const params: any = {
      page: pendingVatPage.value,
      pageSize: pendingVatLimit.value
    }
    if (pendingSearch.value.trim()) {
      params.search = pendingSearch.value.trim()
    }

    const res = await BpuService.getInvoiceQueueForVat(params)
    const r = res.result
    if (!r || r.isError) {
      pendingVatRows.value = []
      pendingVatTotal.value = 0
      if (r?.message?.trim()) console.warn('Antrian VAT invoice:', r.message)
      return
    }
    const contentData = r.content as any
    pendingVatRows.value = contentData?.items ? contentData.items : (Array.isArray(contentData) ? contentData : [])
    pendingVatTotal.value = contentData?.total || pendingVatRows.value.length
  } catch (e) {
    console.error('fetchPendingVat', e)
    pendingVatRows.value = []
  } finally {
    loadingPendingVat.value = false
  }
}

function displayVatOnRow(inv: InvoiceVatQueueRow): number {
  if (inv.vatAmount != null && Number.isFinite(Number(inv.vatAmount))) return Number(inv.vatAmount)
  const loose = inv as unknown as Record<string, unknown>
  const raw = loose.VATAmount ?? loose.vatAmount
  if (raw != null && Number.isFinite(Number(raw))) return Number(raw)
  return 0
}

function goManualPjSubmit() {
  router.push({ name: 'vatPjSubmitFromInvoice' })
}

function goSubmitFromInvoice(inv: InvoiceVatQueueRow) {
  let defMasa = momentLib().format('MM')
  let defYear = momentLib().format('YYYY')
  if (inv.createdUtcDate) {
    const m = momentLib(inv.createdUtcDate)
    if (m.isValid()) {
      defMasa = m.format('MM')
      defYear = m.format('YYYY')
    }
  }
  router.push({
    name: 'vatPjSubmitFromInvoice',
    query: {
      invoiceId: String(inv.id),
      invoiceUId: String(inv.invoiceUId ?? ''),
      invoiceNo: inv.invoiceNo ?? '',
      vendorName: inv.vendorName ?? '',
      vendorNpwp: inv.vendorNpwp ?? '',
      dpp: String(inv.dpp ?? 0),
      vatAmount: String(displayVatOnRow(inv)),
      defMasa,
      defYear,
    },
  })
}

async function setWorkspace(w: Workspace) {
  workspace.value = w
  if (w === 'queue') {
    await fetchPendingVat()
    return
  }
  dataSource.value = 'pajakExpress'
  currentPage.value = 1
  pjTotalRows.value = 0
  await fetchVatData()
}

const onPajakExpressPeriodChanged = async () => {
  currentPage.value = 1
  if (workspace.value !== 'pj') return
  await fetchVatData()
}

const reloadVat = async () => {
  if (workspace.value !== 'pj') return
  await fetchVatData({ page: currentPage.value })
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

const paginationTotalForPager = computed(() => {
  if (workspace.value === 'pj') {
    return Math.max(pjTotalRows.value, 1)
  }
  return filteredDataList.value.length
})

const getStatusFPBadgeClass = (status: string | null) => {
  if (!status) return 'badge-secondary'
  if (status === 'Approved' || status === 'Valid') return 'badge-success'
  if (status === 'Invalid' || status === 'Rejected') return 'badge-danger'
  if (status === 'Credited' || status === 'Created') return 'badge-primary'
  if (status === 'Amended') return 'badge-warning'
  if (status === 'Canceled') return 'badge-outline'
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
  if (status === 'INVALID') return 'badge-danger'
  if (status === 'Creditable') return 'badge-success'
  if (status === 'Not Creditable' || status === 'Hold') return 'badge-outline'
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
  if (dataSource.value === 'pajakExpress') {
    list.value = listData
    return
  }
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

const setPage = async (value: number) => {
  if (dataSource.value === 'pajakExpress') {
    await fetchVatData({ page: value })
    return
  }
  currentPage.value = value
  setList(filteredDataList.value)
}

const goDetail = (data: VATReconciliationData) => {
  sessionStorage.setItem('vatIn_detail_item', JSON.stringify(data))
  router.push({
    name: 'vatInReconciliationDetail',
    params: {
      id: data.noFakturPajak || '0',
    },
  })
}

const handleDownloadPdf = async (item: VATReconciliationData) => {
  if (!item.action) {
    alert("URL Coretax tidak tersedia untuk diunduh.");
    return;
  }
  try {
    const res = await postVatInDownloadPdf({ url: item.action });
    if (res.data?.data?.arraybuff) {
      // Decode base64
      const binaryString = window.atob(res.data.data.arraybuff);
      const binaryLen = binaryString.length;
      const bytes = new Uint8Array(binaryLen);
      for (let i = 0; i < binaryLen; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `Faktur_${item.noFakturPajak || 'Pajak'}.pdf`;
      link.click();
    } else {
      alert("Gagal mengunduh PDF atau format response tidak sesuai.");
    }
  } catch (error: any) {
    console.error("Error downloading PDF:", error);
    alert("Terjadi kesalahan saat mengunduh PDF: " + (error?.response?.data?.message || error.message));
  }
}

const openReplaceCancelModal = (item: VATReconciliationData) => {
  if (confirm(`Apakah Anda yakin ingin melakukan Replace / Cancel untuk Faktur ${item.noFakturPajak}?`)) {
    handleReplaceCancel(item);
  }
}

const handleReplaceCancel = async (item: VATReconciliationData) => {
  try {
    // Pajak Express requires 'INV#' prefix and stripped formatting for Replace/Cancel
    const strippedFaktur = item.noFakturPajak ? item.noFakturPajak.replace(/\D/g, '') : '';
    const formattedFaktur = `INV#${strippedFaktur}`;
    
    const payload = {
      id: item.id || 0,
      nomorFaktur: formattedFaktur
    };
    const res = await postVatInReplaceCancel(payload);
    alert("Faktur berhasil di-Replace / Cancel!");
    await fetchVatData();
  } catch (error: any) {
    console.error("Error on Replace/Cancel:", error);
    alert("Gagal Replace/Cancel: " + (error?.response?.data?.message || error.message));
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
    // ERP: pagination is client-side; reset to page 1 on search.
    // Pajak Express: pagination is server-side; keep current page and filter client-side on loaded rows only.
    if (dataSource.value === 'erp') {
      currentPage.value = 1
    }
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

  if (dataSource.value === 'erp') {
    currentPage.value = 1
  }
  setList(filteredDataList.value)
}

const resetFilter = () => {
  filterForm.value = {
    statusFP: '',
    matchStatus: '',
    creditStatus: '',
  }
  filteredPayload.value = []
  if (dataSource.value === 'erp') {
    currentPage.value = 1
  }
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
  if (dataSource.value === 'erp') {
    currentPage.value = 1
  }
  setList(filteredDataList.value)
}

const sortColumn = (columnName: string | null) => {
  const columnMap = {
    'Vendor Name': 'vendorName',
    'NPWP Vendor': 'npwpVendor',
    'Tax Invoice Date': 'tglFakturPajak',
    'Tax Invoice No.': 'noFakturPajak',
    Amount: 'amount',
    DPP: 'dpp',
    PPN: 'ppn',
    'Tax Invoice Status': 'statusFP',
    'AP vs Tax Invoice Status': 'statusApVsFp',
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

  if (name === 'Tgl Invoice' || name === 'Tax Invoice Date' || name === 'VAT Credit Expiry Date') {
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

function passthroughBackendMessage(e: unknown): string {
  if (axios.isAxiosError(e)) {
    const data = e.response?.data as { message?: string; result?: string } | undefined
    const m = typeof data?.message === 'string' ? data.message : undefined
    if (m?.trim()) return m
    if (typeof data?.result === 'string' && data.result.trim()) return data.result
    return e.message || 'Terjadi kesalahan pada server.'
  }
  return e instanceof Error ? e.message : String(e)
}

/**
 * Untuk ERP: tetap modal sukses (posting pajak PJ belum dihubungkan).
 * Untuk Pajak Express: panggil `POST /vat/vat-in/upload` (IF_TXR_015 fgPermintaan=2) per baris terpilih.
 */
const handleAuthVerify = async (code: string) => {
  console.log('Verification code received:', code)
  closeAuthModal()

  if (dataSource.value !== 'pajakExpress') {
    showSuccessModal.value = true
    return
  }

  const masa = pjMonth.value.trim()
  const tahun = pjYear.value.replace(/\D/g, '').trim()

  if (masa.length === 0 || tahun.length !== 4) {
    alert('Isi bulan dan tahun pajak (yyyy) untuk sumber Pajak Express.')
    return
  }

  const items = [...selectedItems.value]
  if (items.length === 0) {
    showWarningModal.value = true
    return
  }

  isPostingVat.value = true
  const errors: string[] = []

  try {
    for (const item of items) {
      const nomor = item.noFakturPajak?.trim()
      if (!nomor) {
        errors.push('Baris tanpa Nomor Faktur dilewati')
        continue
      }
      try {
        await postVatInUpload({
          payload: {
            fgPermintaan: 2,
            konfirmasiFakturMasukan: {
              konfirmasiPengkreditan: 'CREDITED',
              nomorFaktur: nomor,
              masaPajak: masa,
              tahunPajak: tahun,
            },
          },
          npwpPenjual: item.npwpVendor || undefined,
          namaVendor: item.vendorName || undefined,
          dpp: item.dpp > 0 ? item.dpp : undefined,
          ppn: item.ppn > 0 ? item.ppn : undefined,
          tanggalFaktur: item.tglFakturPajak
            ? new Date(item.tglFakturPajak).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
        })
      } catch (inner) {
        errors.push(`${nomor}: ${passthroughBackendMessage(inner)}`)
      }
    }

    if (errors.length === items.length) {
      alert(`Posting gagal untuk semua faktur.\n${errors.slice(0, 5).join('\n')}${errors.length > 5 ? '\n…' : ''}`)
      return
    }

    if (errors.length > 0) {
      alert(
        `${errors.length} dari ${items.length} gagal. Detail (maks 5):\n${errors.slice(0, 5).join('\n')}${errors.length > 5 ? '\n…' : ''}`,
      )
    }

    await fetchVatData({ page: currentPage.value })
    showSuccessModal.value = true
  } finally {
    isPostingVat.value = false
  }
}

// Success Modal handlers
const closeSuccessModal = () => {
  showSuccessModal.value = false
  successFpNumber.value = ''
  selectedItems.value = [] // Clear selection after success
}

onMounted(async () => {
  await fetchPendingVat()
})

// Watch for changes in filtered data and update list
watch(
  filteredDataList,
  (newData) => {
    if (workspace.value === 'queue') return
    console.log('filteredDataList updated:', newData.length, 'items')
    setList(newData)
  },
  { immediate: true },
)
</script>

<style lang="scss" scoped>
.badge-light-primary {
  background-color: #f1faff;
  color: #009ef7;
}
.badge-light-warning {
  background-color: #fff8dd;
  color: #ffc700;
}

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

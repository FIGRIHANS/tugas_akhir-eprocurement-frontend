<template>
  <div>
    <Breadcrumb title="FTP Invoice Integration" :routes="routes" />
    <hr class="-mx-[24px] mb-[24px]" />

    <div class="card shadow-sm border border-gray-200 rounded-xl overflow-hidden">
      <div class="card-header py-[8px] px-[20px]">
        <div class="flex items-center border border-gray-200 rounded-lg overflow-hidden text-sm">
          <button
            :class="[
              'px-4 py-2 font-medium transition-colors',
              activeTab === 'ftpData'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-500 hover:bg-gray-50',
            ]"
            @click="setActiveTab('ftpData')"
          >
            FTP Data
          </button>
          <button
            :class="[
              'px-4 py-2 font-medium transition-colors border-l border-gray-200',
              activeTab === 'upload'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-500 hover:bg-gray-50',
            ]"
            @click="setActiveTab('upload')"
          >
            Upload Invoice & Tax Document
          </button>
        </div>
      </div>

      <div class="card-body p-[24px] bg-white">
        <div class="page-header flex justify-between items-center gap-3">
          <h1 class="page-header__title m-0 shrink-0">{{ activeTabTitle }}</h1>
          <div class="page-header__actions flex items-center gap-3">
            <div class="page-header__search">
              <UiInputSearch v-model="search" placeholder="Search" @search="triggerSearch" />
            </div>
            <FilterList :data="filterForm" @setData="setDataFilter" ref="filterChild" />
            <button
              v-if="activeTab === 'ftpData' && isProfile3200"
              class="btn btn-primary inline-flex items-center gap-2 shrink-0"
              @click="syncFtpData"
              :disabled="isSyncLoading"
            >
              <svg
                v-if="isSyncLoading"
                class="animate-spin h-6 w-6 text-white-600 shrink-0"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              <i v-else class="ki-duotone ki-arrows-circle shrink-0"></i>
              <span class="whitespace-nowrap">
                {{ isSyncLoading ? 'Syncing...' : 'Sync Excel Data' }}
              </span>
            </button>
            <button
              v-if="activeTab === 'upload'"
              class="btn btn-primary inline-flex items-center gap-2 shrink-0"
              @click="openUploadModal()"
            >
              <i class="ki-duotone ki-upload shrink-0"></i>
              <span class="whitespace-nowrap">Upload Files</span>
            </button>
            <button
              v-if="activeTab === 'ftpData'"
              class="btn btn-primary inline-flex items-center gap-2 shrink-0"
              @click="goAdd()"
            >
              <i class="ki-duotone ki-plus-circle shrink-0"></i>
              <span class="whitespace-nowrap">Add Invoice</span>
            </button>
          </div>
        </div>
        <div class="flex overflow-x-auto gap-3 mb-5 items-center" v-if="filteredPayload.length > 0">
          <div class="font-medium text-lg text-gray-800">Filter</div>
          <div v-for="items in filteredPayload" :key="items.key">
            <div class="btn btn-light btn-sm" v-if="items.value !== ''">
              <span class="text-gray-500"> {{ items.key }} </span>
              <span class="font-semibold">
                <p v-if="items.key === 'Status'">
                  {{
                    StatusInvoice.find((item) => item.value.toString() === items.value.toString())
                      ?.label
                  }}
                </p>
                <p v-else-if="items.key === 'Company Code'">
                  {{
                    companyCodeList.find((item) => item.code.toString() === filterForm.companyCode)
                      ?.name
                  }}
                </p>
                <p v-else-if="items.key === 'Invoice Type'">
                  {{
                    invoicePoTypeList.find(
                      (item) => item.code.toString() === filterForm.invoiceType,
                    )?.name
                  }}
                </p>
                <p v-else>{{ filterForm.date }}</p>
              </span>
              <i class="ki-filled ki-cross" @click="deleteFilter(items.key)"></i>
            </div>
          </div>
          <UiButton variant="light" size="sm" class="btn-clear" @click="resetFilter()">
            {{ $t('vendor.masterFilters.reset') }}
          </UiButton>
        </div>
        <div class="overflow-x-auto list__table mt-[24px]">
          <!-- Simplified table for Upload tab -->
          <template v-if="activeTab === 'upload'">
            <table class="table align-middle text-gray-700 font-medium text-sm">
              <thead>
                <tr>
                  <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500"></th>
                  <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500">Status</th>
                  <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500">Vendor Name</th>
                  <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500">Invoice Document</th>
                  <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500">Tax Document</th>
                  <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500">Reference Document</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="paginatedUploadList.length === 0">
                  <td colspan="6" class="text-center">No data found.</td>
                </tr>
                <tr
                  v-for="(d, idx) in paginatedUploadList"
                  :key="String(d.invoiceUId) || `upload-${idx}`"
                >
                  <td class="flex items-center gap-[12px]">
                    <button
                      class="btn btn-outline btn-icon btn-primary w-[32px] h-[32px]"
                      @click="openViewer(d)"
                    >
                      <i class="ki-filled ki-eye !text-lg"></i>
                    </button>
                  </td>
                  <td>
                    <span
                      class="badge badge-outline"
                      :class="d.status === 'Done' ? 'badge-success' : 'badge-primary'"
                    >
                      {{ d.status || '-' }}
                    </span>
                  </td>
                  <td>{{ d.vendorName || '-' }}</td>
                  <td>
                    <div class="min-w-0">
                      <div class="font-medium truncate" :title="getUploadInvoiceFileName(d)">
                        {{ getUploadInvoiceFileName(d) }}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="min-w-0">
                      <div class="font-medium truncate" :title="getUploadTaxFileName(d)">
                        {{ getUploadTaxFileName(d) }}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="min-w-0">
                      <div class="truncate" :title="getUploadReferenceFileName(d)">
                        {{ getUploadReferenceFileName(d) }}
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </template>

          <!-- Full FTP Data table from getListPo -->
          <template v-else>
            <table class="table align-middle text-gray-700 font-medium text-sm">
              <thead>
                <tr>
                  <th
                    v-for="(item, index) in columns"
                    :key="index"
                    class="!border-b-teal-500 !bg-teal-100 !text-teal-500 whitespace-nowrap"
                    :class="{
                      'list__long ': index !== 0,
                      'cursor-pointer': item,
                      '!text-teal-500': item === sortColumnName && sortBy !== '',
                    }"
                    @click="sortColumn(item)"
                  >
                    {{ item }}
                    <i v-if="item" class="ki-filled ki-arrow-up-down"></i>
                  </th>
                  <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500 whitespace-nowrap">
                    Sync Data
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="list.length === 0">
                  <td :colspan="columns.length + 1" class="text-center">No data found.</td>
                </tr>
                <template v-for="(parent, index) in list" :key="index">
                  <tr>
                    <td class="flex items-center gap-[24px]">
                      <button
                        class="btn btn-outline btn-icon btn-primary w-[32px] h-[32px]"
                        @click="goView(parent)"
                      >
                        <i class="ki-filled ki-eye !text-lg"></i>
                      </button>
                      <button
                        class="btn btn-outline btn-primary btn-icon w-[32px] h-[32px]"
                        @click="openDetailVerification(parent.invoiceUId)"
                      >
                        <i class="ki-duotone ki-data !text-lg"></i>
                      </button>
                    </td>

                    <td>
                      <span class="badge badge-outline" :class="colorBadge(parent.statusCode)">
                        {{ parent.statusName }}
                      </span>
                    </td>
                    <td>{{ parent.vendorName }}</td>
                    <td>{{ parent.documentNo }}</td>
                    <td>{{ parent.companyCode }}</td>
                    <td>{{ parent.invoiceTypeName }}</td>
                    <td>{{ moment(parent.invoiceDate).format('YYYY/MM/DD') }}</td>
                    <td>{{ useFormatIdr(parent.totalGrossAmount) }}</td>
                    <td>{{ useFormatIdr(parent.totalNetAmount) }}</td>
                    <td>
                      {{
                        parent.estimatedPaymentDate
                          ? moment(parent.estimatedPaymentDate).format('YYYY/MM/DD')
                          : '-'
                      }}
                    </td>
                    <td>{{ parent.invoiceNo }}</td>
                    <td>{{ parent.invoiceSourceName }}</td>
                    <td>
                      <span class="badge" :class="getStatusBadgeClass(parent.fpStatus)">
                        {{ parent.fpStatus || 'Warning' }}
                      </span>
                    </td>
                    <td>
                      <span class="badge" :class="getStatusBadgeClass(parent.vatStatus)">
                        {{ parent.vatStatus || 'Warning' }}
                      </span>
                    </td>
                    <td>
                      <span class="badge" :class="getStatusBadgeClass(parent.whtStatus)">
                        {{ parent.whtStatus || 'Warning' }}
                      </span>
                    </td>
                    <td>
                      <span class="badge" :class="getStatusBadgeClass(parent.poPrice)">
                        {{ parent.poPrice || 'Warning' }}
                      </span>
                    </td>
                    <td>
                      <button
                        v-if="canSyncFtpDataRow(parent)"
                        class="btn btn-sm btn-primary inline-flex items-center gap-2 whitespace-nowrap"
                        :disabled="syncingRowId === resolveFtpUploadUIdFromRow(parent)"
                        @click="syncFtpUploadRow(parent)"
                      >
                        <svg
                          v-if="syncingRowId === resolveFtpUploadUIdFromRow(parent)"
                          class="animate-spin h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            class="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="4"
                          ></circle>
                          <path
                            class="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          ></path>
                        </svg>
                        <i v-else class="ki-duotone ki-arrows-circle"></i>
                        Sync Data
                      </button>
                      <span v-else class="text-gray-400 text-sm">-</span>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </template>
        </div>

        <div class="flex items-center justify-between mt-[24px]">
          <p class="m-0 text-sm">
            Tampilkan
            {{ pageSize * currentPage > totalItems ? totalItems : pageSize * currentPage }} data
            dari total data {{ totalItems }}
          </p>
          <LPagination
            :totalItems="totalItems"
            :pageSize="pageSize"
            :currentPage="currentPage"
            @pageChange="setPage"
          />
        </div>
        <DetailVerificationModal type="po" @loadDetail="loadData" @setClearId="viewDetailId = ''" />
        <UploadModal @uploaded="onUploaded" />
        <UploadViewerModal :data="viewerData" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted, watch, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import { type routeTypes } from '@/core/type/components/breadcrumb'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import type { filterListTypes } from '../invoice/types/invoiceList'
import LPagination from '@/components/pagination/LPagination.vue'
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import { useInvoiceSubmissionStore } from '@/stores/views/invoice/submission'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'
import { useLoginStore } from '@/stores/views/login'
import { useFormatIdr } from '@/composables/currency'
import type { ListPoTypes } from '@/stores/views/invoice/types/submission'
import moment from 'moment'
import { cloneDeep } from 'lodash'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import { KTModal } from '@/metronic/core'
import type { FtpUploadViewerData } from './FtpUploadViewerModal.vue'
import type { FtpUploadListItem, FtpUploadOriginalFileNames } from './types/ftpUpload'
import {
  normalizeFtpUploadListItem,
  resolveFtpInvoiceFileName,
  resolveFtpReferenceFileName,
  resolveFtpTaxFileName,
} from './types/ftpUpload'
import {
  buildSyncContextFromSyncResponse,
  canSyncFtpDataRow,
  fetchFtpUploadDetail,
  fetchFtpUploadList,
  resolveFtpUploadUIdFromRow,
  saveActiveFtpUploadUId,
  saveFtpSyncContext,
  sortFtpUploadsByNewest,
  syncFtpUpload,
} from './types/ftpUploadService'

const invoiceMasterApi = useInvoiceMasterDataStore()

const FilterList = defineAsyncComponent(() => import('./FtpFilterList.vue'))
const DetailVerificationModal = defineAsyncComponent(
  () => import('./FtpDetailVerificationModal.vue'),
)
const UploadModal = defineAsyncComponent(() => import('./FtpUploadModal.vue'))
const UploadViewerModal = defineAsyncComponent(() => import('./FtpUploadViewerModal.vue'))

const routes = ref<routeTypes[]>([
  {
    name: 'FTP Invoice Integration',
    to: '/invoice/ftp-integration',
  },
])

const companyCodeList = computed(() => invoiceMasterApi.companyCode)
const invoicePoTypeList = computed(() => invoiceMasterApi.invoicePoType)

const invoiceApi = useInvoiceSubmissionStore()
const loginStore = useLoginStore()
const router = useRouter()
const search = ref<string>('')
const currentPage = ref<number>(1)
const pageSize = ref<number>(10)
const sourceList = ref<ListPoTypes[]>([])
const sortBy = ref<string>('')
const sortColumnName = ref<string>('')
const filteredPayload = ref([])
const filterChild = ref(null)
const viewDetailId = ref('')
const isSyncLoading = ref(false)
const syncingRowId = ref<string | null>(null)
const FTP_INVOICE_SOURCE = 3
const DRAFT_STATUS_CODE = 0
const DRAFT_STATUS_NAME = 'draft'

const isProfile3200 = computed(() => loginStore.userData?.profile?.profileId === 3200)

const activeTab = ref<'ftpData' | 'upload'>('ftpData')
const activeTabTitle = computed(() =>
  activeTab.value === 'ftpData' ? 'FTP Data' : 'Upload Invoice & Tax Document',
)

const setActiveTab = (tab: 'ftpData' | 'upload') => {
  if (activeTab.value === tab) return
  activeTab.value = tab
  currentPage.value = 1
  sortBy.value = ''
  sortColumnName.value = ''
  callList()
  if (tab === 'upload') fetchFtpUploads()
}

// Upload list fetched from backend. Empty until API responds.
const uploadList = ref<FtpUploadListItem[]>([])

const getCachedOriginalNames = (invoiceUId?: string | null): FtpUploadOriginalFileNames | undefined => {
  if (!invoiceUId) return undefined
  return originalFileNamesCache.value[String(invoiceUId)]
}

const getUploadInvoiceFileName = (item: FtpUploadListItem) =>
  resolveFtpInvoiceFileName(item, getCachedOriginalNames(item.invoiceUId))

const getUploadTaxFileName = (item: FtpUploadListItem) =>
  resolveFtpTaxFileName(item, getCachedOriginalNames(item.invoiceUId))

const getUploadReferenceFileName = (item: FtpUploadListItem) =>
  resolveFtpReferenceFileName(item, getCachedOriginalNames(item.invoiceUId))

const fetchFtpUploads = async () => {
  try {
    const items = await fetchFtpUploadList()
    uploadList.value = sortFtpUploadsByNewest(
      items.map((item) =>
        normalizeFtpUploadListItem(item, getCachedOriginalNames(item.invoiceUId)),
      ),
    )
  } catch (err) {
    uploadList.value = []
    console.debug('Failed to fetch FTP uploads list', err)
  }
}

const FTP_ORIGINAL_NAMES_KEY = 'ftp_upload_original_names'

const loadOriginalFileNamesCache = (): Record<string, FtpUploadOriginalFileNames> => {
  try {
    const raw = sessionStorage.getItem(FTP_ORIGINAL_NAMES_KEY)
    return raw ? (JSON.parse(raw) as Record<string, FtpUploadOriginalFileNames>) : {}
  } catch {
    return {}
  }
}

const originalFileNamesCache = ref<Record<string, FtpUploadOriginalFileNames>>(loadOriginalFileNamesCache())

const saveOriginalFileNames = (invoiceUId: string, names: FtpUploadOriginalFileNames) => {
  originalFileNamesCache.value = {
    ...originalFileNamesCache.value,
    [invoiceUId]: names,
  }
  sessionStorage.setItem(FTP_ORIGINAL_NAMES_KEY, JSON.stringify(originalFileNamesCache.value))
}

const viewerData = ref<FtpUploadViewerData>({
  invoiceUId: null,
  invoiceNo: null,
  vendorName: null,
  status: null,
  createdAt: null,
  parsedPreview: null,
  invoice: { fileName: null, blobPath: null, url: null },
  tax: { fileName: null, blobPath: null, url: null },
  reference: null,
})

const mapUploadDetailToViewer = (
  detail: FtpUploadListItem,
  nameFallbacks?: FtpUploadOriginalFileNames,
): FtpUploadViewerData => {
  const normalized = normalizeFtpUploadListItem(detail, nameFallbacks)
  const referenceFileName = resolveFtpReferenceFileName(normalized, nameFallbacks)

  return {
    invoiceUId: normalized.invoiceUId || null,
    invoiceNo: normalized.invoiceNo || null,
    vendorName: normalized.vendorName || null,
    status: normalized.status || null,
    createdAt: normalized.createdAt || null,
    parsedPreview: normalized.parsedPreview || null,
    invoice: {
      fileName: resolveFtpInvoiceFileName(normalized, nameFallbacks),
      storedFileName: normalized.files?.invoice?.fileName || normalized.invoiceFileName || null,
      blobPath: normalized.invoiceBlobPath || normalized.files?.invoice?.blobPath || null,
      url: normalized.invoiceFileUrl || normalized.files?.invoice?.url || null,
    },
    tax: {
      fileName: resolveFtpTaxFileName(normalized, nameFallbacks),
      storedFileName: normalized.files?.tax?.fileName || normalized.taxFileName || null,
      blobPath: normalized.taxBlobPath || normalized.files?.tax?.blobPath || null,
      url: normalized.taxFileUrl || normalized.files?.tax?.url || null,
    },
    reference:
      referenceFileName === '-'
        ? null
        : {
            fileName: referenceFileName,
            storedFileName:
              normalized.files?.reference?.fileName || normalized.referenceFileName || null,
            blobPath:
              normalized.referenceBlobPath || normalized.files?.reference?.blobPath || null,
            url: normalized.referenceFileUrl || normalized.files?.reference?.url || null,
          },
  }
}

const openViewer = async (item: FtpUploadListItem) => {
  viewerData.value = {
    invoiceUId: null,
    invoiceNo: null,
    vendorName: null,
    status: null,
    createdAt: null,
    parsedPreview: null,
    invoice: { fileName: null, blobPath: null, url: null },
    tax: { fileName: null, blobPath: null, url: null },
    reference: null,
  }

  if (item) {
    viewerData.value = mapUploadDetailToViewer(item)
  }

  try {
    if (item?.invoiceUId) {
      const detail = await fetchFtpUploadDetail(String(item.invoiceUId))
      const cachedNames = originalFileNamesCache.value[String(item.invoiceUId)]
      viewerData.value = mapUploadDetailToViewer(detail, cachedNames)
    }
  } catch (err) {
    console.debug('Failed to fetch ftp upload detail', err)
  }

  const el = document.querySelector('#ftp_view_modal')
  let modal = KTModal.getInstance(el as HTMLElement)
  if (!modal && el) modal = new KTModal(el as HTMLElement)
  if (modal) modal.show()
}

const updateUploadDummyStatuses = () => {
  // mark uploadList entries as Uploaded/Done based on presence in sourceList
  try {
    const ftpItems = sourceList.value || []
    uploadList.value = uploadList.value.map((d) => {
      const invoiceNo = d.invoiceNo || undefined
      const documentNo = d.documentNo || undefined

      const match = ftpItems.find(
        (s) => (s.invoiceNo && invoiceNo && String(s.invoiceNo) === String(invoiceNo)) || (s.documentNo && documentNo && String(s.documentNo) === String(documentNo)),
      )

      if (match) {
        const newStatus = match.statusCode === DRAFT_STATUS_CODE ? 'Uploaded' : 'Done'
        return { ...d, status: newStatus, invoiceUId: match.invoiceUId || d.invoiceUId }
      }

      return d
    })
  } catch {
    // ignore
  }
}

const getListStatusCode = (): number | null => {
  if (filterForm.status === '0' || filterForm.status) {
    return Number(filterForm.status)
  }

  return null
}

const openDetailVerification = (invoiceId: string) => {
  viewDetailId.value = invoiceId
  const idModal = document.querySelector('#detail_verification_modal')
  const modal = KTModal.getInstance(idModal as HTMLElement)
  modal.show()
}

const loadData = async () => {
  try {
    await invoiceApi.getPoDetail(viewDetailId.value)
  } catch (error) {
    console.error('Error loading PO detail:', error)
  }
}

const StatusInvoice = ref([
  { value: '1', label: 'Waiting to Verify' },
  { value: '0', label: 'Draft' },
  { value: '2', label: 'Waiting for Approval' },
  { value: '4', label: 'Approved' },
  { value: '5', label: 'Rejected' },
  { value: '7', label: 'Sent to SAP' },
])

const filterForm = reactive<filterListTypes>({
  status: '',
  date: '',
  companyCode: '',
  invoiceType: '',
})

const columns = ref<string[]>([
  '',
  'Status',
  'Vendor Name',
  'Invoice Vendor No',
  'Company Code',
  'Invoice PO Type',
  'Invoice Date',
  'Total Gross Amount',
  'Total Net Amount',
  'Estimated Payment Date',
  'Submitted Document No',
  'Invoice Source',
  'FP Status',
  'VAT Status',
  'WHT Status',
  'PO Price',
])

const COLUMN_FIELD_MAP = {
  'Submitted Document No': 'invoiceNo',
  Status: 'statusName',
  'Vendor Name': 'vendorName',
  'Invoice Vendor No': 'documentNo',
  'Company Code': 'companyCode',
  'Invoice PO Type': 'invoiceTypeName',
  'Invoice Date': 'invoiceDate',
  'Total Gross Amount': 'totalGrossAmount',
  'Total Net Amount': 'totalNetAmount',
  'Estimated Payment Date': 'estimatedPaymentDate',
  'Invoice Source': 'invoiceSourceName',
} as const

const colorBadge = (status: number) => {
  if (status === 0) return 'badge-secondary'
  if (status === 1) return 'badge-primary'
  if (status === 2) return 'badge-info'
  if (status === 3) return 'badge-success'
  if (status === 4) return 'badge-success'
  if (status === 5) return 'badge-danger'
  if (status === 6) return 'badge-secondary'
  if (status === 7) return 'badge-primary'
  if (status === 8) return 'badge-warning'
  if (status === 9) return 'badge-info'
  if (status === 10) return 'badge-success'
}

// Helper function for verification status badge colors
const getStatusBadgeClass = (status: boolean) => {
  if (status === true) return 'badge-success'
  if (status === false) return 'badge-warning'
  // if (status === 'Error') return 'badge-danger'
  // return 'badge-secondary'
}

// const randomStatus = () => {
//   const pool = [true, false]
//   return pool[Math.floor(Math.random() * pool.length)]
// }

const getCreatedTimestamp = (item: ListPoTypes) => {
  if (!item.createdUtcDate) return 0
  const timestamp = moment(item.createdUtcDate).valueOf()
  return Number.isFinite(timestamp) ? timestamp : 0
}

const sortByNewestFirst = (items: ListPoTypes[]) => {
  return [...items].sort((a, b) => {
    const dateDiff = getCreatedTimestamp(b) - getCreatedTimestamp(a)
    if (dateDiff !== 0) return dateDiff
    return (b.id || 0) - (a.id || 0)
  })
}

const filterBySearch = (items: ListPoTypes[]) => {
  const query = search.value.trim().toLowerCase()
  if (!query) return items

  return items.filter((item) => {
    const haystack = [
      item.vendorName,
      item.documentNo,
      item.invoiceNo,
      item.companyCode,
      item.companyName,
      item.statusName,
      item.invoiceTypeName,
      item.invoiceSourceName,
      item.poNo,
      item.grDocumentNo,
    ]
      .filter((value) => value != null && String(value).trim() !== '')
      .join(' ')
      .toLowerCase()

    return haystack.includes(query)
  })
}

const isUploadedFtpData = (item: ListPoTypes) => {
  const sourceName = item.invoiceSourceName?.toLowerCase() || ''
  return item.invoiceSource === FTP_INVOICE_SOURCE || sourceName.includes('ftp')
}

const isDraftData = (item: ListPoTypes) => {
  return (
    item.statusCode === DRAFT_STATUS_CODE || item.statusName?.toLowerCase() === DRAFT_STATUS_NAME
  )
}

const filterByActiveTab = (items: ListPoTypes[]) => {
  if (activeTab.value === 'upload') {
    return items.filter(isDraftData)
  }

  return items
}

const getFtpListParams = () => {
  const params = {
    statusCode: getListStatusCode(),
    companyCode: filterForm.companyCode,
    invoiceTypeCode: Number(filterForm.invoiceType),
    invoiceDate: filterForm.date,
    page: 1,
    pageSize: 1000,
  }

  if (activeTab.value === 'upload') {
    return {
      ...params,
      statusCode: DRAFT_STATUS_CODE,
      invoiceSource: FTP_INVOICE_SOURCE,
    }
  }

  return params
}

const applyColumnSort = (items: ListPoTypes[]) => {
  const name = sortColumnName.value
  const field = name ? COLUMN_FIELD_MAP[name as keyof typeof COLUMN_FIELD_MAP] : undefined
  if (!field || !sortBy.value) return items

  const sorted = [...items]

  if (name === 'Total Gross Amount' || name === 'Total Net Amount') {
    return sorted.sort((a, b) => {
      const aVal = Number(a[field as keyof ListPoTypes]) || 0
      const bVal = Number(b[field as keyof ListPoTypes]) || 0
      return sortBy.value === 'asc' ? aVal - bVal : bVal - aVal
    })
  }

  if (name === 'Invoice Date' || name === 'Estimated Payment Date') {
    return sorted.sort((a, b) => {
      const aVal = a[field as keyof ListPoTypes]
        ? new Date(String(a[field as keyof ListPoTypes])).getTime()
        : 0
      const bVal = b[field as keyof ListPoTypes]
        ? new Date(String(b[field as keyof ListPoTypes])).getTime()
        : 0
      return sortBy.value === 'asc' ? aVal - bVal : bVal - aVal
    })
  }

  return sorted.sort((a, b) => {
    const aVal = String(a[field as keyof ListPoTypes] ?? '')
    const bVal = String(b[field as keyof ListPoTypes] ?? '')
    return sortBy.value === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
  })
}

const filterUploadListBySearch = (items: FtpUploadListItem[]) => {
  const query = search.value.trim().toLowerCase()
  if (!query) return items

  return items.filter((item) => {
    const cachedNames = getCachedOriginalNames(item.invoiceUId)
    const haystack = [
      item.status,
      item.vendorName,
      item.invoiceNo,
      item.documentNo,
      resolveFtpInvoiceFileName(item, cachedNames),
      resolveFtpTaxFileName(item, cachedNames),
      resolveFtpReferenceFileName(item, cachedNames),
    ]
      .filter((value) => value != null && String(value).trim() !== '' && value !== '-')
      .join(' ')
      .toLowerCase()

    return haystack.includes(query)
  })
}

const filteredUploadList = computed(() => filterUploadListBySearch(uploadList.value))

const paginatedUploadList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredUploadList.value.slice(start, start + pageSize.value)
})

const sortedList = computed(() => {
  let data = filterBySearch(filterByActiveTab(cloneDeep(sourceList.value)))

  if (sortBy.value && sortColumnName.value) {
    data = applyColumnSort(data)
  } else {
    data = sortByNewestFirst(data)
  }

  return data
})

const totalItems = computed(() =>
  activeTab.value === 'upload' ? filteredUploadList.value.length : sortedList.value.length,
)

const list = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return sortedList.value.slice(start, start + pageSize.value)
})

const setPage = (value: number) => {
  currentPage.value = value
}

const goView = (data: ListPoTypes) => {
  router.push({
    name: 'invoiceAdd',
    query: {
      type: 'po-view',
      invoice: data.invoiceUId,
      from: 'ftp',
    },
  })
}

const goAdd = () => {
  router.push({
    name: 'invoiceAdd',
    query: {
      type: 'po',
      from: 'ftp',
    },
  })
}

const syncFtpUploadRow = async (row: ListPoTypes) => {
  if (!canSyncFtpDataRow(row)) return

  const uid = resolveFtpUploadUIdFromRow(row)
  if (!uid) return

  syncingRowId.value = uid
  try {
    const syncResult = await syncFtpUpload(uid)
    const context = buildSyncContextFromSyncResponse(syncResult)
    saveFtpSyncContext(context)
    saveActiveFtpUploadUId(syncResult.ftpUploadUId)

    if (syncResult.warnings?.length) {
      alert(syncResult.warnings.join('\n'))
    }

    router.push({
      name: 'invoiceAdd',
      query: {
        type: 'po',
        from: 'ftp',
        ftpUpload: syncResult.ftpUploadUId,
      },
    })
  } catch (error: unknown) {
    const err = error as { response?: { data?: { result?: { message?: string } } }; message?: string }
    const message =
      err.response?.data?.result?.message ||
      err.message ||
      'Gagal sync data FTP. Pastikan vendor name sudah terisi.'
    alert(message)
    console.error('Failed to sync FTP upload row:', error)
  } finally {
    syncingRowId.value = null
  }
}

const syncFtpData = async () => {
  isSyncLoading.value = true
  try {
    await invoiceApi.syncInvoicFromFtp()
    currentPage.value = 1
    callList()
  } catch (error) {
    console.error('Error syncing FTP data:', error)
  } finally {
    isSyncLoading.value = false
  }
}

const openUploadModal = () => {
  const el = document.querySelector('#ftp_upload_modal')
  const modal = KTModal.getInstance(el as HTMLElement)
  if (modal) modal.show()
}

const onUploaded = (
  payload:
    | {
        uid?: string | null
        preview?: Record<string, unknown>
        originalFileNames?: FtpUploadOriginalFileNames
      }
    | string
    | null,
) => {
  let uid: string | null = null
  let originalFileNames: FtpUploadOriginalFileNames | null = null

  if (payload && typeof payload === 'object' && 'uid' in payload) {
    uid = payload.uid || null
    originalFileNames = payload.originalFileNames || null
  } else if (typeof payload === 'string') {
    uid = payload
  }

  if (uid && originalFileNames) {
    saveOriginalFileNames(uid, originalFileNames)
  }

  callList()
  activeTab.value = 'ftpData'
  currentPage.value = 1
  setTimeout(() => updateUploadDummyStatuses(), 250)
}

const callList = async () => {
  try {
    await invoiceApi.getListPo(getFtpListParams())
    const data = cloneDeep(invoiceApi.listPo)
    sourceList.value = activeTab.value === 'upload' ? data.filter(isUploadedFtpData) : data
    // after updating sourceList, sync upload dummy statuses
    updateUploadDummyStatuses()
  } catch (error) {
    console.error('Failed to load FTP invoice list:', error)
    sourceList.value = []
  }
}

const setDataFilter = (data: filterListTypes) => {
  const filteredData: { key: string; value: string | number }[] = []

  if (data.status !== '') {
    filteredData.push({
      key: 'Status',
      value: data.status,
    })
  }

  if (data.date !== '') {
    filteredData.push({
      key: 'Date',
      value: data.date,
    })
  }

  if (data.companyCode && data.companyCode.trim() !== '') {
    filteredData.push({
      key: 'Company Code',
      value: data.companyCode,
    })
  }

  if (data.invoiceType && data.invoiceType.trim() !== '') {
    filteredData.push({
      key: 'Invoice Type',
      value: data.invoiceType,
    })
  }

  filteredPayload.value = filteredData
  filterForm.status = data.status
  filterForm.date = data.date
  filterForm.companyCode = data.companyCode
  filterForm.invoiceType = data.invoiceType
  currentPage.value = 1
  callList()
}

const triggerSearch = () => {
  currentPage.value = 1
}

watch(search, () => {
  currentPage.value = 1
})

const sortColumn = (columnName: string | null) => {
  const roleSort = ['asc', 'desc', '']

  if (columnName) {
    if (sortColumnName.value !== columnName) sortBy.value = ''
    sortColumnName.value = columnName

    const indexSort = roleSort.findIndex((item) => item === sortBy.value)
    if (indexSort === -1) {
      sortBy.value = ''
      sortColumnName.value = ''
      return
    }

    sortBy.value = indexSort + 1 === roleSort.length ? roleSort[0] : roleSort[indexSort + 1]

    if (!sortBy.value) {
      sortColumnName.value = ''
    }
  }

  currentPage.value = 1
}

const deleteFilter = (key: string) => {
  const deletedData = filteredPayload.value.filter((item) => item.key !== key)
  filteredPayload.value = deletedData

  if (key === 'Status') {
    filterChild.value.resetStatus()
  } else if (key === 'Date') {
    filterChild.value.resetDate()
  } else if (key === 'Company Code') {
    filterChild.value.resetCompanyCode()
  } else {
    filterChild.value.resetInvoiceType()
  }
  filterChild.value.goFilter()
  currentPage.value = 1
  callList()
}

const resetFilter = () => {
  filterForm.status = null
  filterChild.value.resetFilter()
  filteredPayload.value = []
  filterChild.value.goFilter()
  currentPage.value = 1
  callList()
}

onMounted(() => {
  callList()
})
</script>

<style lang="scss" scoped>
@use '../invoice/styles/invoice-list.scss';
@use '../../components/ui/pdfUpload/styles/upload.scss';

.page-header {
  &__actions {
    flex-shrink: 0;
    flex-wrap: nowrap;

    :deep(.dropdown-toggle) {
      white-space: nowrap;
    }
  }

  &__search {
    inline-size: 200px;
    flex-shrink: 0;

    :deep(.input) {
      inline-size: 100%;
    }
  }
}

// Custom width for Submitted Document No column in FTP Invoice Integration
:deep(.list__table) {
  th:nth-child(11),
  td:nth-child(11) {
    min-inline-size: 250px;
    white-space: nowrap;
  }
}
</style>

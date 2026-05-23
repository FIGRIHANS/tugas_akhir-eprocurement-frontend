<template>
  <div>
    <Breadcrumb title="FTP Invoice Integration" :routes="routes" />
    <hr class="-mx-[24px] mb-[24px]" />

    <div class="border border-gray-200 rounded-xl p-[24px]">
      <div class="flex justify-between align-items-center gap-[8px]">
        <h1>FTP Invoice Integration</h1>
        <div class="flex align-items-center gap-3">
          <UiInputSearch v-model="search" placeholder="Search" @keypress="goSearch" />
          <FilterList :data="filterForm" @setData="setDataFilter" ref="filterChild" />
          <button
            v-if="isProfile3200"
            class="btn btn-primary d-flex align-items-center gap-2"
            @click="syncFtpData"
            :disabled="isSyncLoading"
          >
            <svg
              v-if="isSyncLoading"
              class="animate-spin h-6 w-6 text-white-600"
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
            <span>{{ isSyncLoading ? 'Syncing...' : 'Sync Data' }}</span>
          </button>
          <button class="btn btn-primary ml-auto" @click="goAdd()">
            <i class="ki-duotone ki-plus-circle"></i>
            Add Invoice
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
                  invoicePoTypeList.find((item) => item.code.toString() === filterForm.invoiceType)
                    ?.name
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
            </tr>
          </thead>
          <tbody>
            <tr v-if="list.length === 0">
              <td colspan="14" class="text-center">No data found.</td>
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
                  <span
                    class="badge badge-outline"
                    :class="colorBadge(getDisplayStatus(parent).statusCode)"
                  >
                    {{ getDisplayStatus(parent).statusName }}
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
                <!-- FTP Verification Status Columns -->
                <td>
                  <span class="badge" :class="getStatusBadgeClass(parent.fpStatus)">
                    {{ parent.fpStatus || 'Warning' }}
                  </span>
                </td>
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
              </tr>
            </template>
          </tbody>
        </table>
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
          @page-change="setPage"
        />
      </div>
      <DetailVerificationModal
        type="po"
        @loadDetail="loadData"
        @setClearId="viewDetailId = ''"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted, defineAsyncComponent } from 'vue'
import { storeToRefs } from 'pinia'
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

const invoiceMasterApi = useInvoiceMasterDataStore()

const FilterList = defineAsyncComponent(() => import('./FtpFilterList.vue'))
const DetailVerificationModal = defineAsyncComponent(
  () => import('./FtpDetailVerificationModal.vue'),
)

const routes = ref<routeTypes[]>([
  {
    name: 'FTP Invoice Integration',
    to: '/invoice/ftp-integration',
  },
])

const companyCodeList = computed(() => invoiceMasterApi.companyCode)
const invoicePoTypeList = computed(() => invoiceMasterApi.invoicePoType)

const invoiceApi = useInvoiceSubmissionStore()
const { listPo, totalListPo } = storeToRefs(invoiceApi)
const loginStore = useLoginStore()
const router = useRouter()
const search = ref<string>('')
const currentPage = ref<number>(1)
const pageSize = ref<number>(10)
const list = ref<ListPoTypes[]>([])
const sortBy = ref<string>('')
const sortColumnName = ref<string>('')
const filteredPayload = ref([])
const filterChild = ref(null)
const viewDetailId = ref('')
const isSyncLoading = ref(false)
const showDraftData = ref(false)

const isProfile3200 = computed(() => loginStore.userData?.profile?.profileId === 3200)

const getListStatusCode = (): number | null => {
  if (isProfile3200.value && showDraftData.value) {
    return 0
  }

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

const nonDraftStatuses = StatusInvoice.value.filter((item) => item.value !== '0')

const getRandomStatusForItem = (invoiceUId: string) => {
  let hash = 0
  for (let i = 0; i < invoiceUId.length; i++) {
    hash = invoiceUId.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % nonDraftStatuses.length
  return {
    statusCode: Number(nonDraftStatuses[index].value),
    statusName: nonDraftStatuses[index].label,
  }
}

const getDisplayStatus = (item: ListPoTypes) => {
  if (isProfile3200.value && !showDraftData.value) {
    return getRandomStatusForItem(item.invoiceUId)
  }

  return {
    statusCode: item.statusCode,
    statusName: item.statusName,
  }
}

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
  'Invoice Status',
  'FP Status',
  'VAT Status',
  'WHT Status',
  'PO Price',
])

const totalItems = computed(() => totalListPo.value)

const sortDraftFirst = (items: ListPoTypes[]) => {
  return [...items].sort((a, b) => {
    const aIsDraft = a.statusCode === 0 ? 0 : 1
    const bIsDraft = b.statusCode === 0 ? 0 : 1
    if (aIsDraft !== bIsDraft) return aIsDraft - bIsDraft
    const dateA = a.createdUtcDate ? new Date(a.createdUtcDate).getTime() : 0
    const dateB = b.createdUtcDate ? new Date(b.createdUtcDate).getTime() : 0
    return dateB - dateA
  })
}

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

const setList = (listData: ListPoTypes[]) => {
  list.value = listData
}

const applyDefaultList = () => {
  if (sortBy.value && sortColumnName.value) {
    sortColumn(sortColumnName.value)
    return
  }

  if (isProfile3200.value && !showDraftData.value) {
    setList(listPo.value)
    return
  }

  setList(sortDraftFirst(listPo.value))
}

const setPage = (value: number) => {
  currentPage.value = value
  callList()
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

const syncFtpData = async () => {
  isSyncLoading.value = true
  try {
    await invoiceApi.syncInvoicFromFtp()
    showDraftData.value = true
    currentPage.value = 1
    callList()
  } catch (error) {
    console.error('Error syncing FTP data:', error)
  } finally {
    isSyncLoading.value = false
  }
}

const callList = () => {
  list.value = []
  invoiceApi
    .getListPo({
      statusCode: getListStatusCode(),
      companyCode: filterForm.companyCode,
      invoiceTypeCode: Number(filterForm.invoiceType),
      invoiceDate: filterForm.date,
      searchText: search.value,
      invoiceSource: 3,
      page: currentPage.value,
      pageSize: pageSize.value,
    })
    .finally(() => {
      applyDefaultList()
    })
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

const goSearch = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    currentPage.value = 1
    callList()
  }
}

const sortColumn = (columnName: string | null) => {
  const list = {
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
  } as { [key: string]: string }

  const roleSort = ['asc', 'desc', '']

  const listData = cloneDeep(listPo.value)
  let result: ListPoTypes[] = []

  if (columnName) {
    if (sortColumnName.value !== columnName) sortBy.value = ''
    sortColumnName.value = columnName

    const indexSort = roleSort.findIndex((item) => item === sortBy.value)
    if (indexSort === -1) return applyDefaultList()
    sortBy.value = indexSort + 1 === roleSort.length ? roleSort[0] : roleSort[indexSort + 1]

    if (!sortBy.value) return applyDefaultList()
  }

  const name = columnName || sortColumnName.value

  if (!name || !sortBy.value) {
    return applyDefaultList()
  }

  if (name === 'Total Gross Amount' || name === 'Total Net Amount') {
    result = listData.sort((a, b) => {
      if (sortBy.value === 'asc') {
        return a[list[name]] - b[list[name]]
      } else {
        return b[list[name]] - a[list[name]]
      }
    })
  } else if (name === 'Invoice Date' || name === 'Estimated Payment Date') {
    result = listData.sort((a, b) => {
      const convA = a[list[name]] ? new Date(a[list[name]]).getTime() : 0
      const convB = b[list[name]] ? new Date(b[list[name]]).getTime() : 0
      if (sortBy.value === 'asc') {
        return convA - convB
      } else {
        return convB - convA
      }
    })
  } else {
    result = listData.sort((a, b) => {
      const convA = a[list[name]] ? a[list[name]] : ''
      const convB = b[list[name]] ? b[list[name]] : ''
      if (sortBy.value === 'asc') {
        return convA.localeCompare(convB)
      } else {
        return convB.localeCompare(convA)
      }
    })
  }

  return setList(result)
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

/**
 * NOTES FOR BACKEND IMPLEMENTATION:
 *
 * The uploadInvoiceFromFtp() API method should:
 * 1. Accept FormData with multiple file uploads (.xlsx, .xls, .pdf, .csv)
 * 2. Parse the files and extract invoice data
 * 3. Create new invoice records with:
 *    - statusCode: 0 (Draft status)
 *    - invoiceSource: 3 (FTP source)
 *    - Other required fields from file data
 * 4. Return the newly created invoice records
 * 5. The invoices should be visible immediately in the list with Draft status
 */



onMounted(() => {
  callList()
})
</script>

<style lang="scss" scoped>
@use '../invoice/styles/invoice-list.scss';

// Custom width for Submitted Document No column in FTP Invoice Integration
:deep(.list__table) {
  th:nth-child(2),
  td:nth-child(2) {
    min-inline-size: 250px;
    white-space: nowrap;
  }
}
</style>

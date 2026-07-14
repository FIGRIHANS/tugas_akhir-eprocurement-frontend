<template>
  <div class="border border-gray-200 rounded-xl p-[24px]">
    <div class="flex justify-between gap-[8px]">
      <UiInputSearch
        v-model="search"
        placeholder="Cari Invoice"
        class="w-[250px]"
        @keypress="goSearch"
      />
      <FilterList :data="filterForm" @setData="setDataFilter" ref="filterChild" />
    </div>
    <div
      v-if="filteredPayload.length > 0"
      class="flex overflow-x-auto gap-3 mb-5 items-center mt-5"
    >
      <div class="font-medium text-lg text-gray-800">Filter</div>
      <div v-for="items in filteredPayload" :key="items.key">
        <div class="btn btn-light btn-sm" v-if="items.value !== '' || items.value !== null">
          <span class="text-gray-500"> {{ items.key }} </span>
          <span class="font-semibold">
            <p v-if="items.key === 'Status'">
              {{ StatusInvoice.find((item) => item.value === Number(items.value))?.label }}
            </p>
            <p v-if="items.key === 'Company Code'">
              {{
                companyCodeList.find((item) => item.code.toString() === filterForm.companyCode)
                  ?.name
              }}
            </p>
            <p v-else-if="items.key === 'Invoice Type'">
              {{
                invoiceNonPoTypeList.find((item) => item.code.toString() === filterForm.invoiceType)
                  ?.name
              }}
            </p>
            <p v-else-if="items.key === 'Date'">{{ filterForm.date }}</p>
          </span>
          <i class="ki-filled ki-cross" @click="deleteFilter(items.key)"></i>
        </div>
      </div>
      <UiButton variant="light" size="sm" class="btn-clear" @click="resetFilter()">
        {{ $t('vendor.masterFilters.reset') }}
      </UiButton>
    </div>
    <div class="mt-[24px]">
      <div class="pending__table overflow-x-auto">
        <table class="table align-middle text-gray-700 rounded-xl font-medium text-sm">
          <thead>
            <tr>
              <th
                v-for="(item, index) in columns"
                class="pending__column"
                :key="index"
                :class="{
                  'pending__column--auto': index <= 1,
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
            <TableListSkeleton v-if="isListNonPoLoading" :columns="columns.length" :rows="5" />
            <tr v-else-if="list.length === 0">
              <td :colspan="columns.length" class="text-center py-6">No data found.</td>
            </tr>
            <template v-else v-for="(parent, index) in list" :key="parent.invoiceUId || index">
              <tr>
                <td>
                  <div class="dropdown" data-dropdown="true" data-dropdown-trigger="click">
                    <button
                      class="dropdown-toggle btn btn-light btn-icon"
                      @click="checkAndFetchApprovalStatus(parent.invoiceUId)"
                    >
                      <i class="ki-filled ki-dots-vertical"></i>
                    </button>
                    <div class="dropdown-content w-full max-w-56 py-2">
                      <div class="menu menu-default flex flex-col w-full">
                        <div
                          v-if="parent.statusCode === 4 && canSendToSap"
                          class="menu-item"
                          @click="sendToSap(parent.invoiceUId)"
                        >
                          <div class="menu-link">
                            <span class="menu-icon">
                              <i class="ki-duotone ki-paper-plane !text-lg"></i>
                            </span>
                            <span class="menu-title"> Send to SAP </span>
                          </div>
                        </div>
                        <div class="menu-item" @click="openDetailInvoice(parent.invoiceUId)">
                          <div class="menu-link">
                            <span class="menu-icon">
                              <i class="ki-duotone ki-eye !text-lg"></i>
                            </span>
                            <span class="menu-title"> Detail </span>
                          </div>
                        </div>
                        <div class="menu-item" @click="openDetailApproval(parent.invoiceUId)">
                          <div class="menu-link">
                            <span class="menu-icon">
                              <i class="ki-duotone ki-data !text-lg"></i>
                            </span>
                            <span class="menu-title"> Detail Approval </span>
                          </div>
                        </div>
                        <div
                          v-if="isAccountingTax && parent.statusCode === 2"
                          class="menu-item"
                          @click="openDetailInvoiceEdit(parent.invoiceUId)"
                        >
                          <div class="menu-link">
                            <span class="menu-icon">
                              <i class="ki-duotone ki-message-edit"></i>
                            </span>
                            <span class="menu-title"> Edit </span>
                          </div>
                        </div>
                        <div
                          v-if="isFinanceApSupervisor && parent.statusCode === 2"
                          class="menu-item"
                          @click="openDetailInvoiceEdit(parent.invoiceUId)"
                        >
                          <div class="menu-link">
                            <span class="menu-icon">
                              <i class="ki-duotone ki-message-edit"></i>
                            </span>
                            <span class="menu-title"> Edit </span>
                          </div>
                        </div>
                        <div
                          v-if="
                            !isAccountingTax &&
                            parent.statusCode === 4 &&
                            !approvedByFinanceApCache.get(parent.invoiceUId)
                          "
                          class="menu-item"
                          @click="openDetailInvoiceEdit(parent.invoiceUId)"
                        >
                          <div class="menu-link">
                            <span class="menu-icon">
                              <i class="ki-duotone ki-message-edit"></i>
                            </span>
                            <span class="menu-title"> Edit </span>
                          </div>
                        </div>
                        <div
                          v-if="
                            !isAccountingTax &&
                            parent.statusCode === 7 &&
                            !approvedByFinanceApCache.get(parent.invoiceUId)
                          "
                          class="menu-item"
                          @click="openDetailInvoiceEditSendSap(parent.invoiceUId)"
                        >
                          <div class="menu-link">
                            <span class="menu-icon">
                              <i class="ki-duotone ki-message-edit"></i>
                            </span>
                            <span class="menu-title"> Edit </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
                <td>{{ parent.invoiceNo || '-' }}</td>
                <td class="max-w-[200px] truncate" :title="parent.notes">
                  {{ parent.notes || '-' }}
                </td>
                <td>
                  <span
                    class="badge badge-outline"
                    :class="colorBadge(getItemDisplayStatus(parent).statusCode)"
                  >
                    {{ getItemDisplayStatus(parent).statusName }}
                  </span>
                </td>
                <td>{{ parent.vendorName || '-' }}</td>
                <td>{{ parent.invoiceTypeName || '-' }}</td>
                <td>{{ parent.companyCode || '-' }}</td>
                <td>{{ useFormatIdr(parent.whtBaseAmount) || '-' }}</td>
                <td>{{ useFormatIdr(parent.vatAmount) || '-' }}</td>
                <td>{{ useFormatIdr(parent.whtAmount) || '-' }}</td>
                <td>{{ useFormatIdr(parent.totalNetAmount) || '-' }}</td>
                <td>{{ parent.taxNo || '-' }}</td>
                <td>{{ parent.documentNo || '-' }}</td>
                <td>
                  {{
                    parent.actionerDate && parent.actionerDate !== '1900-01-01T00:00:00'
                      ? moment(parent.actionerDate).format('YYYY/MM/DD')
                      : '-'
                  }}
                </td>
                <td>
                  {{
                    parent.estimatedPaymentDate
                      ? moment(parent.estimatedPaymentDate).format('YYYY/MM/DD')
                      : '-'
                  }}
                </td>
                <td>
                  {{
                    parent.invoiceDate
                      ? moment.utc(parent.invoiceDate).local().format('YYYY/MM/DD HH:mm:ss ')
                      : '-'
                  }}
                </td>
              </tr>
              <tr v-show="parent.isOpenChild">
                <td></td>
                <td colspan="6" class="!pt-[0px]">
                  <table class="table table-bordered table-sm mb-0">
                    <thead>
                      <tr class="border-b">
                        <th v-for="(item, index) in columnsChild" :key="index">
                          {{ item }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <template v-for="(sub, index) in parent.pOs" :key="index">
                        <tr>
                          <td>{{ sub.poNo || '-' }}</td>
                          <td>{{ sub.grDocumentNo || '-' }}</td>
                          <td>{{ sub.itemText || '-' }}</td>
                          <td>{{ useFormatIdr(sub.itemAmount) || '-' }}</td>
                          <td>{{ sub.quantity || '-' }}</td>
                        </tr>
                      </template>
                    </tbody>
                  </table>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
      <div class="flex items-center justify-between mt-[24px]">
        <p class="m-0 text-sm">
          Tampilkan
          {{ pageSize * currentPage > totalItems ? totalItems : pageSize * currentPage }}
          data dari total data {{ totalItems }}
        </p>
        <LPagination
          :totalItems="totalItems"
          :pageSize="pageSize"
          :currentPage="currentPage"
          @pageChange="onPageChange"
        />
      </div>
    </div>
    <SuccessSendToSap />
    <FailedSendToSap />
    <UiLoading v-model="isLoadingSap" text="Loading...." />
    <ModalDetailApproval @loadDetail="loadData" @setClearId="viewDetailId = ''" />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted, defineAsyncComponent } from 'vue'
import {
  buildFilterChips,
  clearPersistedListFilters,
  loadPersistedListFilters,
  savePersistedListFilters,
} from '@/composables/usePersistedListFilters'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { KTModal } from '@/metronic/core'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import LPagination from '@/components/pagination/LPagination.vue'
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import { useInvoiceVerificationStore } from '@/stores/views/invoice/verification'
import type { filterListTypes } from '../types/pendingApproval'
import type { ListNonPoTypes } from '@/stores/views/invoice/types/verification'
import { useInvoiceSubmissionStore } from '@/stores/views/invoice/submission'
import { useLoginStore } from '@/stores/views/login'
import { useFormatIdr } from '@/composables/currency'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'
import UiLoading from '@/components/modal/UiLoading.vue'
import TableListSkeleton from '@/components/skeleton/TableListSkeleton.vue'
import moment from 'moment'
import { useFinanceInvoiceListTable, FINANCE_LIST_UI_PAGE_SIZE } from '@/composables/useFinanceInvoiceListTable'
import { resolveFinanceListItemDisplay } from '@/composables/useInvoiceWorkflow'

const ModalDetailApproval = defineAsyncComponent(() => import('./DetailApproval.vue'))
const FilterList = defineAsyncComponent(() => import('./FilterList.vue'))
const SuccessSendToSap = defineAsyncComponent(
  () => import('./pendingApproval/SuccessSendToSap.vue'),
)
const FailedSendToSap = defineAsyncComponent(() => import('./pendingApproval/FailedSendToSap.vue'))
const invoiceMasterApi = useInvoiceMasterDataStore()

const companyCodeList = computed(() => invoiceMasterApi.companyCode)
const invoiceNonPoTypeList = computed(() => invoiceMasterApi.invoiceNonPoType)

const invoiceApi = useInvoiceSubmissionStore()
const verificationApi = useInvoiceVerificationStore()
const { listNonPo, listNonPoTotal, isListNonPoLoading } = storeToRefs(verificationApi)
const loginStore = useLoginStore()
const filterChild = ref(null)
const router = useRouter()
const approvedByFinanceApCache = ref<Map<string, boolean>>(new Map())
const invoicesBeingChecked = ref<Set<string>>(new Set())
const search = ref<string>('')
const viewDetailId = ref<string>('')
const isLoadingSap = ref<boolean>(false)

const StatusInvoice = ref([
  { value: 2, label: 'Waiting for Approval' },
  { value: 4, label: 'Approved' },
  { value: 5, label: 'Rejected' },
  { value: 7, label: 'Sent to SAP' },
  { value: 10, label: 'Paid' },
])

const filteredPayload = ref([])

const filterForm = reactive<filterListTypes>({
  status: 2,
  date: '',
  companyCode: '',
  invoiceType: '',
})

const FILTER_STORAGE_KEY = 'invoiceApprovalNoPo'

const persistCurrentFilters = () => {
  savePersistedListFilters(FILTER_STORAGE_KEY, {
    status: filterForm.status,
    date: filterForm.date,
    companyCode: filterForm.companyCode,
    invoiceType: filterForm.invoiceType,
    search: search.value,
  })
}

const applyPersistedFilters = () => {
  const saved = loadPersistedListFilters(FILTER_STORAGE_KEY)
  if (!saved) {
    filteredPayload.value = buildFilterChips(filterForm)
    return
  }

  let nextStatus: number | null =
    saved.status === null || saved.status === undefined || saved.status === ''
      ? null
      : Number(saved.status)
  // Waiting for Verify is Verification-only — never keep it on Approval.
  if (nextStatus === 1) nextStatus = 2

  filterForm.status = nextStatus
  filterForm.date = saved.date || ''
  filterForm.companyCode = saved.companyCode || ''
  filterForm.invoiceType = saved.invoiceType || ''
  search.value = saved.search || ''
  filteredPayload.value = buildFilterChips(filterForm)
}

const columns = ref<string[]>([
  '',
  'Submitted Document No',
  'Description',
  'Status',
  'Vendor Name',
  'Invoice Type',
  'Company Code',
  'Base Amount',
  'VAT Ammount',
  'WHT Amount',
  'Total Net Amount',
  'No Tax Invoice',
  'Invoice Vendor No.',
  'Approval Date',
  'Estimated Payment Date',
  'Invoice Submission Date',
])

const columnsChild = ref(['No PO', 'No GR', 'Item Description', 'Item Amount', 'Quantity'])

const verifList = computed(() => listNonPo.value)

const buildListParams = (page: number) => ({
  statusCode: filterForm.status,
  companyCode: filterForm.companyCode,
  invoiceTypeCode: Number(filterForm.invoiceType),
  invoiceDate: filterForm.date,
  searchText: search.value,
  page,
  pageSize: FINANCE_LIST_UI_PAGE_SIZE,
})

const fetchListPage = async (page: number) => {
  await verificationApi.getListNonPo(buildListParams(page))
}

const {
  currentPage,
  pageSize,
  list,
  totalItems,
  setPage,
  sortColumn,
  sortColumnName,
  sortBy,
  onPageChange,
} = useFinanceInvoiceListTable<ListNonPoTypes>(verifList, listNonPoTotal, {
  sortFieldMap: {
    'Submitted Document No': 'invoiceNo',
    Description: 'notes',
    Status: 'statusName',
    'Vendor Name': 'vendorName',
    'Invoice Type': 'invoiceTypeName',
    'Company Code': 'companyCode',
    'Base Amount': 'whtBaseAmount',
    'VAT Ammount': 'vatAmount',
    'WHT Amount': 'whtAmount',
    'Total Net Amount': 'totalNetAmount',
    'No Tax Invoice': 'taxNo',
    'Invoice Vendor No.': 'documentNo',
    'Estimated Payment Date': 'estimatedPaymentDate',
    'Invoice Submission Date': 'invoiceDate',
  },
  amountColumns: ['Base Amount', 'VAT Ammount', 'WHT Amount', 'Total Net Amount'],
  dateColumns: ['Invoice Submission Date', 'Estimated Payment Date'],
  onPageChange: fetchListPage,
})

const canSendToSap = computed(() => loginStore.userData?.profile?.profileId !== 3003)

const isAccountingTax = computed(() => loginStore.userData?.profile?.profileId === 3003)

const isFinanceApSupervisor = computed(
  () => Number(loginStore.userData?.profile?.profileId) === 3004,
)

const colorBadge = (statusCode: number) => {
  const list = {
    0: 'bg-gray-50 text-gray-600',
    1: 'bg-primary-light text-primary',
    2: 'bg-purple-50 text-purple-600',
    3: 'bg-emerald-50 text-emerald-600',
    4: 'bg-emerald-100 text-emerald-700',
    5: 'bg-red-50 text-red-600',
    6: 'bg-gray-100 text-gray-600',
    7: 'bg-slate-50 text-slate-600',
    8: 'bg-yellow-50 text-yellow-700',
    9: 'bg-primary-light text-primary',
    10: 'bg-emerald-500 text-white',
  } as { [key: number]: string }
  return list[statusCode]
}

const getItemDisplayStatus = (item: ListNonPoTypes) => {
  return resolveFinanceListItemDisplay(item, filterForm.status)
}

const callList = async () => {
  setPage(1)
  await fetchListPage(1)
}

const goSearch = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    persistCurrentFilters()
    callList()
  }
}

const openDetailApproval = (invoiceId: string) => {
  closeDropdown()
  viewDetailId.value = invoiceId
  const idModal = document.querySelector('#detail_approval_modal')
  const modal = KTModal.getInstance(idModal as HTMLElement)
  modal.show()
}

const openDetailInvoice = (invoiceId: string) => {
  closeDropdown()
  router.push({
    name: 'invoiceDetailNonPo',
    query: {
      id: invoiceId,
      type: '2',
      invoiceType: 'no_po',
    },
  })
}

const openDetailInvoiceEdit = (invoiceId: string) => {
  router.push({
    name: 'invoiceDetailEdit',
    query: {
      id: invoiceId,
      type: '2',
      invoiceType: 'no_po',
      edit: 'true',
    },
  })
}

const openDetailInvoiceEditSendSap = (invoiceId: string) => {
  router.push({
    name: 'invoiceDetailEdit',
    query: {
      id: invoiceId,
      type: '2',
      invoiceType: 'no_po',
      edit: 'true',
      isSendSap: 'true',
    },
  })
}

const isApprovedByFinanceAp = async (invoiceUId: string): Promise<boolean> => {
  // Check cache first
  if (approvedByFinanceApCache.value.has(invoiceUId)) {
    return approvedByFinanceApCache.value.get(invoiceUId) || false
  }

  try {
    // Fetch detail to check workflow
    await invoiceApi.getNonPoDetail(invoiceUId)
    const detail = invoiceApi.detailNonPo

    if (detail?.workflow && Array.isArray(detail.workflow)) {
      // Check if there's an approval from profileId 3004 with stateCode 4 (APPROVED)
      const isApprovedByAp = detail.workflow.some(
        (item: any) => Number(item.profileId) === 3004 && Number(item.stateCode) === 4
      )
      approvedByFinanceApCache.value.set(invoiceUId, isApprovedByAp)
      return isApprovedByAp
    }
  } catch (error) {
    console.error('Error fetching invoice detail:', error)
  }

  approvedByFinanceApCache.value.set(invoiceUId, false)
  return false
}

const checkAndFetchApprovalStatus = async (invoiceUId: string) => {
  await isApprovedByFinanceAp(invoiceUId)
}

const resetFilter = () => {
  filterForm.status = null
  filterForm.date = ''
  filterForm.companyCode = ''
  filterForm.invoiceType = ''
  filterChild.value.resetFilter()
  filteredPayload.value = []
  clearPersistedListFilters(FILTER_STORAGE_KEY)
  filterChild.value.goFilter()
  callList()
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
  callList()
}

const setDataFilter = (data: filterListTypes) => {
  filteredPayload.value = buildFilterChips({
    status: data.status,
    date: data.date,
    companyCode: data.companyCode,
    invoiceType: data.invoiceType,
  })
  filterForm.status = data.status
  filterForm.date = data.date
  filterForm.companyCode = data.companyCode
  filterForm.invoiceType = data.invoiceType
  persistCurrentFilters()
  callList()
}

const loadData = () => {
  invoiceApi.getNonPoDetail(viewDetailId.value)
}

const closeDropdown = () => {
  const event = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window,
  })
  document.body.dispatchEvent(event)
}

const sendToSap = (invoiceUId: string) => {
  if (isLoadingSap.value) return
  closeDropdown()
  isLoadingSap.value = true
  verificationApi
    .postSapNonPo(invoiceUId)
    .then((statusCode: number) => {
      if (statusCode === 200) {
        openSuccesSap()
        callList()
      } else {
        openFailedSap()
      }
    })
    .catch(() => {
      openFailedSap()
    })
    .finally(() => {
      isLoadingSap.value = false
    })
}

const openSuccesSap = () => {
  const idModal = document.querySelector('#success_send_sap_modal')
  const modal = KTModal.getInstance(idModal as HTMLElement)
  modal.show()
}

const openFailedSap = () => {
  const idModal = document.querySelector('#failed_send_sap_modal')
  const modal = KTModal.getInstance(idModal as HTMLElement)
  modal.show()
}

onMounted(() => {
  applyPersistedFilters()
  callList()
})
</script>

<style lang="scss" scoped>
@use '../styles/pending-approval.scss';
</style>

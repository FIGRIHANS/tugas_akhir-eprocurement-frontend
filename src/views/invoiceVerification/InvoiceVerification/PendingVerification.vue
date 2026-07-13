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
      class="flex overflow-x-auto gap-3 mb-5 items-center mt-5"
      v-if="filteredPayload.length > 0"
    >
      <div class="font-medium text-lg text-gray-800">Filter</div>
      <div v-for="items in filteredPayload" :key="items.key">
        <div class="btn btn-light btn-sm" v-if="items.value !== '' || items.value !== null">
          <span class="text-gray-500"> {{ items.key }} </span>
          <span class="font-semibold">
            <p v-if="items.key === 'Status'">
              {{ StatusInvoice.find((item) => item.value === items.value)?.label }}
            </p>
            <p v-if="items.key === 'Company Code'">
              {{
                companyCodeList.find((item) => item.code.toString() === filterForm.companyCode)
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
            <TableListSkeleton v-if="isListPoLoading" :columns="columns.length" :rows="5" />
            <tr v-else-if="list.length === 0">
              <td :colspan="columns.length" class="text-center py-6">No data found.</td>
            </tr>
            <template v-else v-for="(parent, index) in list" :key="parent.invoiceUId || index">
              <tr>
                <td class="flex justify-between items-center gap-[24px]">
                  <button
                    class="btn btn-outline btn-primary btn-icon w-[32px] h-[32px]"
                    @click="openDetailInvoice(parent.invoiceUId)"
                  >
                    <i class="ki-filled ki-eye !text-lg"></i>
                  </button>
                  <button
                    class="btn btn-outline btn-primary btn-icon w-[32px] h-[32px]"
                    @click="openDetailVerification(parent.invoiceUId)"
                  >
                    <i class="ki-duotone ki-data !text-lg"></i>
                  </button>
                  <button
                    class="btn btn-icon btn-outline btn-primary w-[21px] h-[21px]"
                    @click="parent.isOpenChild = !parent.isOpenChild"
                  >
                    <i v-if="!parent.isOpenChild" class="ki-filled ki-right !text-[9px]"></i>
                    <i v-else class="ki-filled ki-down !text-[9px]"></i>
                  </button>
                </td>
                <td>{{ parent.invoiceNo || '-' }}</td>
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
                <td class="max-w-[200px] truncate" :title="parent.notes">
                  {{ parent.notes || '-' }}
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
      <div class="flex items-center gap-[16px] mt-[24px]">
        <div class="flex items-center">
          <div
            class="bg-primary rounded-md p-[7px] w-[40px] h-[40px] flex items-center justify-center"
          >
            <i class="ki-filled ki-eye text-white text-[24px]"></i>
          </div>
          <p class="ml-[8px]">: View Detail invoice</p>
        </div>
        <div class="flex items-center">
          <div
            class="bg-primary-light border border-primary-clarity rounded-md p-[7px] w-[40px] h-[40px] flex items-center justify-center"
          >
            <i class="ki-duotone ki-data text-primary text-[24px]"></i>
          </div>
          <p class="ml-[8px]">: Verification Detail Invoice</p>
        </div>
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
    <DetailVerificationModal @loadDetail="loadData" @setClearId="viewDetailId = ''" />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted, defineAsyncComponent } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import type { filterListTypes } from '../types/pendingVerification'
import type { ListPoTypes } from '@/stores/views/invoice/types/verification'
import LPagination from '@/components/pagination/LPagination.vue'
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import { KTModal } from '@/metronic/core'
import { useInvoiceVerificationStore } from '@/stores/views/invoice/verification'
import { useInvoiceSubmissionStore } from '@/stores/views/invoice/submission'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'
import { useFormatIdr } from '@/composables/currency'
import moment from 'moment'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import TableListSkeleton from '@/components/skeleton/TableListSkeleton.vue'
import {
  resolveFinanceListItemDisplay,
  filterVerificationVerifiedListItems,
  isVerificationVerifiedFilterActive,
} from '@/composables/useInvoiceWorkflow'
import { useFinanceInvoiceListTable, FINANCE_LIST_UI_PAGE_SIZE } from '@/composables/useFinanceInvoiceListTable'

const DetailVerificationModal = defineAsyncComponent(() => import('./DetailVerificationModal.vue'))
const FilterList = defineAsyncComponent(() => import('./FilterList.vue'))
const invoiceMasterApi = useInvoiceMasterDataStore()

const companyCodeList = computed(() => invoiceMasterApi.companyCode)

const invoiceApi = useInvoiceSubmissionStore()
const verificationApi = useInvoiceVerificationStore()
const { listPo, listPoTotal, isListPoLoading } = storeToRefs(verificationApi)
const router = useRouter()
const search = ref<string>('')
const viewDetailId = ref<string>('')
const filteredPayload = ref([])
const filterChild = ref(null)

const filterForm = reactive<filterListTypes>({
  status: 1,
  date: '',
  companyCode: '',
  invoiceType: '',
})

const verifList = computed(() => {
  const items = listPo.value
  if (isVerificationVerifiedFilterActive(filterForm.status)) {
    return filterVerificationVerifiedListItems(items)
  }
  return items
})

const buildListParams = (page: number) => ({
  statusCode: filterForm.status,
  companyCode: filterForm.companyCode,
  invoiceDate: filterForm.date,
  searchText: search.value,
  page,
  pageSize: FINANCE_LIST_UI_PAGE_SIZE,
})

const fetchListPage = async (page: number) => {
  await verificationApi.getListPo(buildListParams(page))
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
} = useFinanceInvoiceListTable<ListPoTypes>(verifList, listPoTotal, {
  sortFieldMap: {
    'Submitted Document No': 'invoiceNo',
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
    Description: 'notes',
  },
  amountColumns: ['Base Amount', 'VAT Ammount', 'WHT Amount', 'Total Net Amount'],
  dateColumns: ['Invoice Submission Date', 'Estimated Payment Date'],
  onPageChange: fetchListPage,
})

const StatusInvoice = ref([
  { value: 1, label: 'Waiting for Verify' },
  { value: 3, label: 'Verified' },
  { value: 4, label: 'Approved' },
  { value: 5, label: 'Rejected' },
  { value: 7, label: 'Sent to SAP' },
  { value: 10, label: 'Paid' },
])

const columns = ref<string[]>([
  '',
  'Submitted Document No',
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
  'Estimated Payment Date',
  'Invoice Submission Date',
  'Description',
])

const columnsChild = ref(['No PO', 'No GR', 'Item Description', 'Item Amount', 'Quantity'])

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
    9: 'bg-cyan-50 text-cyan-600',
    10: 'bg-emerald-500 text-white',
  } as { [key: number]: string }
  return list[statusCode]
}

const getItemDisplayStatus = (item: ListPoTypes) => {
  return resolveFinanceListItemDisplay(item, filterForm.status)
}

const callList = async () => {
  setPage(1)
  await fetchListPage(1)
}

const openDetailInvoice = (invoiceId: string) => {
  router.push({
    name: 'invoiceDetail',
    query: {
      id: invoiceId,
      type: '1',
    },
  })
}

const openDetailVerification = (invoiceId: string) => {
  viewDetailId.value = invoiceId
  const idModal = document.querySelector('#detail_verification_modal')
  const modal = KTModal.getInstance(idModal as HTMLElement)
  modal.show()
}

const goSearch = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    callList()
  }
}

const setDataFilter = (data: filterListTypes) => {
  const filteredData: { key: string; value: string | number }[] = []

  if (data.status !== null) {
    filteredData.push({
      key: 'Status',
      value: Number(data.status),
    })
  }

  if (data.date && data.date.trim() !== '') {
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

  filteredPayload.value = filteredData
  filterForm.status = data.status
  filterForm.date = data.date
  filterForm.companyCode = data.companyCode
  filterForm.invoiceType = ''
  callList()
}

const loadData = () => {
  invoiceApi.getPoDetail(viewDetailId.value)
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

const resetFilter = () => {
  filterForm.status = null
  filterChild.value.resetFilter()
  filteredPayload.value = []
  filterChild.value.goFilter()
  callList()
}

onMounted(() => {
  const filteredData: { key: string; value: string | number }[] = []
  filteredData.push({
    key: 'Status',
    value: 1,
  })
  filteredPayload.value = filteredData
  callList()
})
</script>

<style lang="scss" scoped>
@use '../styles/pending-verification.scss';
</style>

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
                :class="{
                  'list__long ': index !== 0,
                  'cursor-pointer': item,
                  '!text-blue-500': item === sortColumnName && sortBy !== '',
                }"
                @click="sortColumn(item)"
              >
                {{ item }}
                <i v-if="item" class="ki-filled ki-arrow-up-down"></i>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="poList?.length === 0">
              <td colspan="10" class="text-center">No data found.</td>
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
                  <button
                    class="btn btn-icon btn-outline btn-primary w-[21px] h-[21px]"
                    @click="parent.isOpenChild = !parent.isOpenChild"
                  >
                    <i v-if="!parent.isOpenChild" class="ki-filled ki-right !text-[9px]"></i>
                    <i v-else class="ki-filled ki-down !text-[9px]"></i>
                  </button>
                </td>
                <td>{{ parent.invoiceNo }}</td>
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
              </tr>
              <tr v-show="parent.isOpenChild">
                <td></td>
                <td colspan="5" class="!pt-[0px]">
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
          {{ pageSize * currentPage > poList.length ? poList.length : pageSize * currentPage }} data
          dari total data {{ poList.length }}
        </p>
        <LPagination
          :totalItems="poList.length"
          :pageSize="pageSize"
          :currentPage="currentPage"
          @pageChange="setPage"
        />
      </div>
      <DetailVerificationModal type="po" @loadDetail="loadData" @setClearId="viewDetailId = ''" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import { type routeTypes } from '@/core/type/components/breadcrumb'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import type { filterListTypes } from '../invoice/types/invoiceList'
import LPagination from '@/components/pagination/LPagination.vue'
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import { useInvoiceSubmissionStore } from '@/stores/views/invoice/submission'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'
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

const columns = ref([
  '',
  'Submitted Document No',
  'Status',
  'Vendor Name',
  'Invoice Vendor No',
  'Company Code',
  'Invoice PO Type',
  'Invoice Date',
  'Total Gross Amount',
  'Total Net Amount',
  'Estimated Payment Date',
])

const columnsChild = ref(['No PO', 'No GR', 'Item Description', 'Item Amount', 'Quantity'])

const poList = computed(() => invoiceApi.listPo)

const colorBadge = (statusCode: number) => {
  const list = {
    0: 'badge-primary',
    1: 'badge-warning',
    2: 'badge-info',
    4: 'badge-success',
    5: 'badge-danger',
    7: 'badge-primary',
  } as { [key: number]: string }
  return list[statusCode]
}

const setList = (listData: ListPoTypes[]) => {
  const result: ListPoTypes[] = []
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
  sortColumn(null)
}

const goView = (data: ListPoTypes) => {
  if (data.statusCode === 0 || data.statusCode === 5) {
    router.push({
      name: 'ftpInvoiceAdd',
      query: {
        type: 'po',
        invoice: data.invoiceUId,
      },
    })
  } else {
    router.push({
      name: 'ftpInvoiceAdd',
      query: {
        type: 'po-view',
        invoice: data.invoiceUId,
      },
    })
  }
}

const callList = () => {
  list.value = []
  invoiceApi
    .getListPo({
      statusCode: filterForm.status === '0' || filterForm.status ? Number(filterForm.status) : null,
      companyCode: filterForm.companyCode,
      invoiceTypeCode: Number(filterForm.invoiceType),
      invoiceDate: filterForm.date,
      searchText: search.value,
    })
    .finally(() => {
      sortColumn(null)
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
  callList()
}

const goSearch = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    callList()
  }
}

const goAdd = () => {
  router.push({
    name: 'ftpInvoiceAdd',
    query: {
      type: 'po',
    },
  })
}

const sortColumn = (columnName: string | null) => {
  const list = {
    'Submitted Document No': 'invoiceNo',
    Status: 'statusName',
    'Vendor Name': 'vendorName',
    'Invoice Vendor No': 'documentNo',
    'Company Code': 'companyCode',
    'Invoice Non PO Type': 'invoiceTypeName',
    'Invoice Date': 'invoiceDate',
    'Total Gross Amount': 'totalGrossAmount',
    'Total Net Amount': 'totalNetAmount',
    'Estimated Payment Date': 'estimatedPaymentDate',
  } as { [key: string]: string }

  const roleSort = ['asc', 'desc', '']

  const listData = cloneDeep(poList.value)
  let result: ListPoTypes[] = []

  if (columnName) {
    if (sortColumnName.value !== columnName) sortBy.value = ''
    sortColumnName.value = columnName

    const indexSort = roleSort.findIndex((item) => item === sortBy.value)
    if (indexSort === -1) return setList(poList.value)
    sortBy.value = indexSort + 1 === roleSort.length ? roleSort[0] : roleSort[indexSort + 1]

    if (!sortBy.value) return setList(poList.value)
  }

  const name = columnName || sortColumnName.value

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
  callList()
})
</script>

<style lang="scss" scoped>
@use '../invoice/styles/invoice-list.scss';

// Custom width for Submitted Document No column in FTP Invoice Integration
:deep(.list__table) {
  th:nth-child(2),
  td:nth-child(2) {
    min-width: 250px;
    white-space: nowrap;
  }
}
</style>

<template>
  <div>
    <section
      name="table"
      class="border rounded-md p-[24px] flex flex-col gap-[24px] justify-center bg-white"
    >
      <div class="flex flex-row gap-4 justify-between w-full">
        <h1>Invoice Non PO</h1>
        <div class="flex flex-row gap-3">
          <InputSearch placeholder="Search" v-model="search" @keypress="goSearch" />
          <FilterList type="non-po" :data="filterForm" @setData="setDataFilter" ref="filterChild" />
          <UiButton variant="primary" @click="goAdd(false)"
            ><i class="ki-duotone ki-plus-circle"></i>Add invoice</UiButton
          >
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
                  invoiceNonPoTypeList.find(
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
      <div class="scrollable-x-auto list__table">
        <table class="table align-middle">
          <thead>
            <tr class="text-nowrap border-b border-primary">
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
            <tr v-for="item in list" :key="item.invoiceUId" class="text-nowrap">
              <td class="flex items-center gap-[16px]">
                <button
                  class="btn btn-outline btn-primary btn-icon w-[32px] h-[32px]"
                  @click="goToDetail(item)"
                >
                  <i class="ki-filled ki-eye !text-lg"></i>
                </button>
                <button
                  class="btn btn-outline btn-primary btn-icon w-[32px] h-[32px]"
                  @click="openDetailVerification(item.invoiceUId)"
                >
                  <i class="ki-duotone ki-data !text-lg"></i>
                </button>
              </td>
              <td>{{ item.invoiceNo }}</td>
              <td>
                <span class="badge badge-outline" :class="colorBadge(item.statusCode)">
                  {{ item.statusName }}
                </span>
              </td>
              <td>{{ item.vendorName }}</td>
              <td>{{ item.documentNo || '-' }}</td>
              <td>{{ item.companyCode || '-' }}</td>
              <td>{{ item.invoiceTypeName }}</td>
              <td>{{ formatDateYearFirst(item.invoiceDate) }}</td>
              <td>{{ useFormatIdr(item.totalGrossAmount) }}</td>
              <td>{{ useFormatIdr(item.totalNetAmount) }}</td>
              <td>{{ formatDateYearFirst(item.actionerDate) }}</td>
              <td>{{ formatDateYearFirst(item.estimatedPaymentDate) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="flex items-center justify-between mt-[24px]">
        <p class="m-0 text-sm">
          Tampilkan
          {{ pageSize * currentPage > poList?.length ? poList?.length : pageSize * currentPage }}
          data dari total data
          {{ poList?.length }}
        </p>
        <LPagination
          :totalItems="poList?.length || 0"
          :pageSize="pageSize"
          :currentPage="currentPage"
          @page-change="setPage"
        />
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
    </section>
    <DetailVerificationModal @loadDetail="loadData" @setClearId="viewDetailId = ''" />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, defineAsyncComponent, onMounted, computed } from 'vue'
import LPagination from '@/components/pagination/LPagination.vue'
import type { filterListTypes } from '../../types/invoiceList'
import InputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import { useInvoiceSubmissionStore } from '@/stores/views/invoice/submission'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import { useFormatIdr } from '@/composables/currency'
import { formatDateYearFirst } from '@/composables/date-format'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'
// import moment from 'moment'
import type { ListPoTypes } from '@/stores/views/invoice/types/submission'
import { useRouter } from 'vue-router'
import { cloneDeep } from 'lodash'
import { KTModal } from '@/metronic/core'

const invoiceSubmissionApi = useInvoiceSubmissionStore()
const router = useRouter()
const invoiceMasterApi = useInvoiceMasterDataStore()
const filterChild = ref(null)
const viewDetailId = ref('')

const FilterList = defineAsyncComponent(() => import('./FilterList.vue'))
const DetailVerificationModal = defineAsyncComponent(
  () => import('../invoiceList/DetailVerificationModal.vue'),
)

// import UiModal from '@/components/modal/UiModal.vue'
// import UiSelect from '@/components/ui/atoms/select/UiSelect.vue'
// import UiInput from '@/components/ui/atoms/input/UiInput.vue'
const StatusInvoice = ref([
  { value: '1', label: 'Waiting to Verify' },
  { value: '0', label: 'Draft' },
  { value: '2', label: 'Waiting for Approval' },
  { value: '4', label: 'Approved' },
  { value: '5', label: 'Rejected' },
  { value: '7', label: 'Sent to SAP' },
  { value: '8', label: 'Planned' },
  { value: '9', label: 'Partially Paid' },
  { value: '10', label: 'Paid' },
])

const companyCodeList = computed(() => invoiceMasterApi.companyCode)
const invoiceNonPoTypeList = computed(() => invoiceMasterApi.invoiceNonPoType)

const search = ref<string>('')
const currentPage = ref<number>(1)
const pageSize = ref<number>(10)
const list = ref<ListPoTypes[]>([])
const sortBy = ref<string>('')
const sortColumnName = ref<string>('')

const poList = computed(() => invoiceSubmissionApi.listNonPo)

const filterForm = reactive<filterListTypes>({
  status: '',
  date: '',
  companyCode: '',
  invoiceType: '',
})

const filteredPayload = ref([])

const columns = ref([
  '',
  'Submitted Document No',
  'Status',
  'Vendor Name',
  'Invoice Vendor No',
  'Company Code',
  'Invoice Non PO Type',
  'Invoice Date',
  'Total Gross Amount',
  'Total Net Amount',
  'Approval Date',
  'Estimated Payment Date',
])

const resetFilter = () => {
  filterForm.status = null
  filterChild.value.resetFilter()
  filteredPayload.value = []
  filterChild.value.goFilter()

  listCall()
}

const goSearch = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    listCall()
  }
}

const colorBadge = (statusCode: number) => {
  const list = {
    0: 'badge-primary',
    1: 'badge-warning',
    2: 'badge-info',
    4: 'badge-success',
    5: 'badge-danger',
    7: 'badge-primary',
    8: 'badge-warning', // Planned
    9: 'badge-info', // Partially Paid
    10: 'badge-warning', // Paid
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

const openDetailVerification = (invoiceId: string) => {
  viewDetailId.value = invoiceId
  const idModal = document.querySelector('#detail_verification_modal')
  const modal = KTModal.getInstance(idModal as HTMLElement)
  modal.show()
}

const loadData = () => {
  invoiceSubmissionApi.getNonPoDetail(viewDetailId.value)
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
  listCall()
}

const setDataFilter = (data: filterListTypes) => {
  const filteredData: { key: string; value: string | number }[] = []

  if (data.status !== '') {
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
  listCall()
}

const listCall = () => {
  invoiceSubmissionApi
    .getListNonPo({
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

const goAdd = (isPo: boolean) => {
  router.push({
    name: 'invoiceAdd',
    query: {
      type: isPo ? 'po' : 'nonpo',
    },
  })
}

const goToDetail = (data: ListPoTypes) => {
  if (data.statusCode === 0 || data.statusCode === 5) {
    router.push({
      name: 'invoiceAdd',
      query: {
        type: 'nonpo',
        invoice: data.invoiceUId,
      },
    })
  } else {
    router.push({
      name: 'invoiceAdd',
      query: {
        type: 'non-po-view',
        invoice: data.invoiceUId,
      },
    })
  }
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

onMounted(() => {
  listCall()
})
</script>

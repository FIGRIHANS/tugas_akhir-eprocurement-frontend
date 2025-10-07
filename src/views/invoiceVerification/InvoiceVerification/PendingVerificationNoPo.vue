<template>
  <div class="border border-gray-200 rounded-xl p-[24px]">
    <div class="flex justify-between gap-[8px]">
      <div>
        <h1>Verification List</h1>
      </div>
      <div class="flex gap-[16px]">
        <UiInputSearch
          v-model="search"
          placeholder="Cari Invoice"
          class="w-[250px]"
          @keypress="goSearch"
        />
        <FilterList :data="filterForm" @setData="setDataFilter" ref="filterChild" />
      </div>
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
                  'cursor-pointer': item,
                  '!text-blue-500': item === sortColumnName && sortBy !== ''
                }"
                @click="sortColumn(item)"
              >
                {{ item }}
                <i v-if="item" class="ki-filled ki-arrow-up-down"></i>
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(parent, index) in list" :key="index">
              <tr>
                <td class="flex items-center gap-[16px]">
                  <button
                    class="btn btn-primary btn-icon w-[32px] h-[32px]"
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
                </td>
                <td>{{ parent.invoiceNo || '-' }}</td>
                <td>
                  <span class="badge badge-outline" :class="colorBadge(parent.statusCode)">
                    {{ parent.statusName }}
                  </span>
                </td>
                <td>{{ parent.vendorName || '-' }}</td>
                <td>{{ parent.invoiceTypeName || '-' }}</td>
                <td>{{ parent.companyCode || '-' }}</td>
                <td>{{ parent.department || '-' }}</td>
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
                      ? moment(parent.invoiceDate).format('YYYY/MM/DD HH:mm:ss')
                      : '-'
                  }}
                </td>
                <td>{{ parent.notes || '-' }}</td>
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
          {{
            pageSize * currentPage > verifList.length ? verifList.length : pageSize * currentPage
          }}
          data dari total data {{ verifList.length }}
        </p>
        <LPagination
          :totalItems="verifList.length"
          :pageSize="pageSize"
          :currentPage="currentPage"
          @pageChange="setPage"
        />
      </div>
    </div>
    <DetailVerificationModal @loadDetail="loadData" @setClearId="viewDetailId = ''" />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import type { filterListTypes } from '../types/pendingVerification'
import type { ListNonPoTypes } from '@/stores/views/invoice/types/verification'
import LPagination from '@/components/pagination/LPagination.vue'
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import { KTModal } from '@/metronic/core'
import { useInvoiceVerificationStore } from '@/stores/views/invoice/verification'
import { useInvoiceSubmissionStore } from '@/stores/views/invoice/submission'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'
import { useFormatIdr } from '@/composables/currency'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import moment from 'moment'
import { cloneDeep } from 'lodash'

const DetailVerificationModal = defineAsyncComponent(() => import('./DetailVerificationModal.vue'))
const FilterList = defineAsyncComponent(() => import('./FilterList.vue'))

const invoiceApi = useInvoiceSubmissionStore()
const verificationApi = useInvoiceVerificationStore()
const invoiceMasterApi = useInvoiceMasterDataStore()

const companyCodeList = computed(() => invoiceMasterApi.companyCode)
const invoiceNonPoTypeList = computed(() => invoiceMasterApi.invoiceNonPoType)
const filterChild = ref(null)
const router = useRouter()
const search = ref<string>('')
const currentPage = ref<number>(1)
const pageSize = ref<number>(10)
const list = ref<ListNonPoTypes[]>([])
const viewDetailId = ref<string>('')
const sortBy = ref<string>('')
const sortColumnName = ref<string>('')
const StatusInvoice = ref([
  { value: 1, label: 'Waiting for Verify' },
  { value: 2, label: 'Waiting for Approval' },
  { value: 4, label: 'Approved' },
  { value: 5, label: 'Rejected' },
  { value: 7, label: 'Sent to SAP' },
])

const filteredPayload = ref([])

const filterForm = reactive<filterListTypes>({
  status: 1,
  date: '',
  companyCode: '',
  invoiceType: '',
})

const columns = ref<string[]>([
  '',
  'Submitted Document No',
  'Status',
  'Vendor Name',
  'Invoice Type',
  'Company Code',
  'Departement',
  'Base Amount',
  'VAT Ammount',
  'WHT Amount',
  'Total Net Amount',
  'Tax Document No',
  'Invoice Vendor No.',
  'Estimated Payment Date',
  'Invoice Submission Date',
  'Description',
])

const columnsChild = ref(['No PO', 'No GR', 'Item Description', 'Item Amount', 'Quantity'])

const verifList = computed(() => verificationApi.listNonPo)

const colorBadge = (statusCode: number) => {
  const list = {
    1: 'badge-info',
    5: 'badge-danger',
    3: 'badge-success',
  } as { [key: number]: string }
  return list[statusCode]
}

const setPage = (value: number) => {
  currentPage.value = value
  sortColumn(null)
}

const openDetailInvoice = (invoiceId: string) => {
  router.push({
    name: 'invoiceDetailNonPo',
    query: {
      id: invoiceId,
      type: '1',
      invoiceType: 'no_po',
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

const resetFilter = () => {
  filterForm.status = null
  filterChild.value.resetFilter()
  filteredPayload.value = []
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

const setList = (listData: ListNonPoTypes[]) => {
  const result: ListNonPoTypes[] = []
  for (const [index, item] of listData.entries()) {
    const start = currentPage.value * pageSize.value - pageSize.value
    const end = currentPage.value * pageSize.value - 1
    if (index >= start && index <= end) {
      result.push(item)
    }
  }
  list.value = result
}

const callList = () => {
  list.value = []
  verificationApi
    .getListVerifNonPo({
      statusCode: filterForm.status || null,
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

const loadData = () => {
  invoiceApi.getNonPoDetail(viewDetailId.value)
}

const sortColumn = (columnName: string | null) => {
  const list = {
    'Submitted Document No': 'invoiceNo',
    'Status': 'statusName',
    'Vendor Name':  'vendorName',
    'Invoice Type': 'invoiceTypeName',
    'Company Code': 'companyCode',
    'Departement': 'department',
    'Base Amount': 'whtBaseAmount',
    'VAT Ammount': 'vatAmount',
    'WHT Amount': 'whtAmount',
    'Total Net Amount': 'totalNetAmount',
    'Tax Document No': 'taxNo',
    'Invoice Vendor No.': 'documentNo',
    'Estimated Payment Date': 'estimatedPaymentDate',
    'Invoice Submission Date': 'invoiceDate',
    'Description': 'notes'
  } as {[key: string]: string}

  const roleSort = ['asc', 'desc', '']

  const listData = cloneDeep(verifList.value)
  let result: ListNonPoTypes[] = []

  if (columnName) {
    if (sortColumnName.value !== columnName) sortBy.value = ''
    sortColumnName.value = columnName

    const indexSort = roleSort.findIndex((item) => item === sortBy.value)
    if (indexSort === -1) return setList(verifList.value)
    sortBy.value = indexSort + 1 === roleSort.length ? roleSort[0] : roleSort[indexSort + 1]
  
    if (!sortBy.value) return setList(verifList.value)
  }

  const name = columnName || sortColumnName.value

  if (name === 'Base Amount' || name === 'VAT Ammount' || name === 'Total Net Amount' || name === 'WHT Amount') {
    result = listData.sort((a, b) => {
      if (sortBy.value === 'asc') {
        return a[list[name]] - b[list[name]]
      } else {
        return b[list[name]] - a[list[name]]
      }
    })
  } else if (name === 'Invoice Submission Date' || name === 'Estimated Payment Date') {
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

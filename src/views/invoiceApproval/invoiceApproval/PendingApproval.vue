<template>
  <div class="border border-gray-200 rounded-xl p-[24px]">
    <div class="flex justify-between gap-[8px]">
      <UiInputSearch
        v-model="search"
        placeholder="Cari Invoice"
        class="w-[250px]"
        @keypress="goSearch"
      />
      <FilterList :data="filterForm" @setData="setDataFilter" />
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
            <template v-for="(parent, index) in list" :key="index">
              <tr>
                <td>
                  <div class="dropdown" data-dropdown="true" data-dropdown-trigger="click">
                    <button class="dropdown-toggle btn btn-light btn-icon">
                      <i class="ki-filled ki-dots-vertical"></i>
                    </button>
                    <div class="dropdown-content w-full max-w-56 py-2">
                      <div class="menu menu-default flex flex-col w-full">
                        <div
                          v-if="parent.statusCode === 4"
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
                          v-if="parent.statusCode === 4"
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
                          v-if="parent.statusCode === 7"
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
                <td>
                  <button
                    class="btn btn-icon btn-outline btn-primary w-[21px] h-[21px]"
                    @click="parent.isOpenChild = !parent.isOpenChild"
                  >
                    <i v-if="!parent.isOpenChild" class="ki-filled ki-right !text-[9px]"></i>
                    <i v-else class="ki-filled ki-down !text-[9px]"></i>
                  </button>
                </td>
                <td>{{ parent.invoiceNo || '-' }}</td>
                <td>{{ parent.notes || '-' }}</td>
                <td>
                  <span class="badge badge-outline" :class="colorBadge(parent.statusCode)">
                    {{ parent.statusName }}
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
                      ? moment(parent.invoiceDate).format('YYYY/MM/DD HH:mm:ss')
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
    <SuccessSendToSap />
    <FailedSendToSap />
    <ModalDetailApproval @loadDetail="loadData" @setClearId="viewDetailId = ''" />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import { KTModal } from '@/metronic/core'
import LPagination from '@/components/pagination/LPagination.vue'
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import { useInvoiceVerificationStore } from '@/stores/views/invoice/verification'
import type { filterListTypes } from '../types/pendingApproval'
import type { ListPoTypes } from '@/stores/views/invoice/types/verification'
import { useInvoiceSubmissionStore } from '@/stores/views/invoice/submission'
import { useFormatIdr } from '@/composables/currency'
import moment from 'moment'
import { cloneDeep } from 'lodash'

const ModalDetailApproval = defineAsyncComponent(() => import('./DetailApproval.vue'))
const FilterList = defineAsyncComponent(() => import('./FilterList.vue'))
const SuccessSendToSap = defineAsyncComponent(
  () => import('./pendingApproval/SuccessSendToSap.vue'),
)
const FailedSendToSap = defineAsyncComponent(() => import('./pendingApproval/FailedSendToSap.vue'))

const invoiceApi = useInvoiceSubmissionStore()
const verificationApi = useInvoiceVerificationStore()
const router = useRouter()
const search = ref<string>('')
const currentPage = ref<number>(1)
const pageSize = ref<number>(10)
const list = ref<ListPoTypes[]>([])
const viewDetailId = ref<string>('')
const isLoadingSap = ref<boolean>(false)
const sortBy = ref<string>('')
const sortColumnName = ref<string>('')

const filterForm = reactive<filterListTypes>({
  status: 2,
  date: '',
  companyCode: '',
  invoiceType: '',
})

const columns = ref<string[]>([
  '',
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
  'Estimated Payment Date',
  'Invoice Submission Date',
])

const columnsChild = ref(['No PO', 'No GR', 'Item Description', 'Item Amount', 'Quantity'])

const verifList = computed(() => verificationApi.listPo)

const colorBadge = (statusCode: number) => {
  const list = {
    2: 'badge-info',
    5: 'badge-danger',
    4: 'badge-success',
    7: 'badge-primary',
  } as { [key: number]: string }
  return list[statusCode]
}

const setPage = (value: number) => {
  currentPage.value = value
  sortColumn(null)
}

const goSearch = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
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
    name: 'invoiceDetail',
    query: {
      id: invoiceId,
      type: '2',
    },
  })
}

const openDetailInvoiceEdit = (invoiceId: string) => {
  const isSendSap = ref(false)
  if (filterForm.status === 7) {
    console.log('masuk')

    isSendSap.value = true
  }
  router.push({
    name: 'invoiceDetailEdit',
    query: {
      id: invoiceId,
      type: '2',
      edit: 'true',
      isSendSap: isSendSap.value.toString(),
    },
  })
}

const openDetailInvoiceEditSendSap = (invoiceId: string) => {
  router.push({
    name: 'invoiceDetailEdit',
    query: {
      id: invoiceId,
      type: '2',
      edit: 'true',
      isSendSap: 'true',
    },
  })
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

const callList = () => {
  list.value = []
  verificationApi
    .getListPo({
      statusCode: filterForm.status || 2,
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
  filterForm.status = data.status
  filterForm.date = data.date
  filterForm.companyCode = data.companyCode
  filterForm.invoiceType = data.invoiceType
  callList()
}

const loadData = () => {
  invoiceApi.getPoDetail(viewDetailId.value)
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
  closeDropdown()
  isLoadingSap.value = true
  verificationApi
    .postSap(invoiceUId)
    .then((statusCode: number) => {
      if (statusCode === 200) {
        openSuccesSap()
        callList()
      } else {
        openFailedSap()
      }
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

const sortColumn = (columnName: string | null) => {
  const list = {
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
  } as { [key: string]: string }

  const roleSort = ['asc', 'desc', '']

  const listData = cloneDeep(verifList.value)
  let result: ListPoTypes[] = []

  if (columnName) {
    if (sortColumnName.value !== columnName) sortBy.value = ''
    sortColumnName.value = columnName

    const indexSort = roleSort.findIndex((item) => item === sortBy.value)
    if (indexSort === -1) return setList(verifList.value)
    sortBy.value = indexSort + 1 === roleSort.length ? roleSort[0] : roleSort[indexSort + 1]

    if (!sortBy.value) return setList(verifList.value)
  }

  const name = columnName || sortColumnName.value

  if (
    name === 'Base Amount' ||
    name === 'VAT Ammount' ||
    name === 'WHT Amount' ||
    name === 'Total Net Amount'
  ) {
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
  callList()
})
</script>

<style lang="scss" scoped>
@use '../styles/pending-approval.scss';
</style>

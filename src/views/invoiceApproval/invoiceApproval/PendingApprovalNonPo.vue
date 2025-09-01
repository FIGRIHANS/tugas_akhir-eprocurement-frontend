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
                }"
              >
                {{ item }}
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
                          <a class="menu-link" href="#">
                            <span class="menu-icon">
                              <i class="ki-duotone ki-paper-plane !text-lg"></i>
                            </span>
                            <span class="menu-title"> Send to SAP </span>
                          </a>
                        </div>
                        <div class="menu-item" @click="openDetailInvoice(parent.invoiceUId)">
                          <a class="menu-link" href="#">
                            <span class="menu-icon">
                              <i class="ki-duotone ki-eye !text-lg"></i>
                            </span>
                            <span class="menu-title"> Detail </span>
                          </a>
                        </div>
                        <div class="menu-item" @click="openDetailApproval(parent.invoiceUId)">
                          <a class="menu-link" href="#">
                            <span class="menu-icon">
                              <i class="ki-duotone ki-data !text-lg"></i>
                            </span>
                            <span class="menu-title"> Detail Approval </span>
                          </a>
                        </div>
                        <div
                          v-if="parent.statusCode === 4"
                          class="menu-item"
                          @click="openDetailInvoiceEdit(parent.invoiceUId)"
                        >
                          <a class="menu-link" href="#">
                            <span class="menu-icon">
                              <i class="ki-duotone ki-message-edit"></i>
                            </span>
                            <span class="menu-title"> Edit </span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
                <!-- <td>
                  <button class="btn btn-icon btn-outline btn-primary w-[21px] h-[21px]" @click="parent.isOpenChild = !parent.isOpenChild">
                    <i v-if="!parent.isOpenChild" class="ki-filled ki-right !text-[9px]"></i>
                    <i v-else class="ki-filled ki-down !text-[9px]"></i>
                  </button>
                </td> -->
                <td>{{ parent.invoiceNo || '-' }}</td>
                <td>
                  <span class="badge badge-outline" :class="colorBadge(parent.statusCode)">
                    {{ parent.statusName }}
                  </span>
                </td>
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
import type { ListNonPoTypes } from '@/stores/views/invoice/types/verification'
import { useInvoiceSubmissionStore } from '@/stores/views/invoice/submission'
import { useFormatIdr } from '@/composables/currency'
import moment from 'moment'

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
const list = ref<ListNonPoTypes[]>([])
const viewDetailId = ref<string>('')
const isLoadingSap = ref<boolean>(false)

const filterForm = reactive<filterListTypes>({
  status: 2,
  date: '',
  companyCode: '',
  invoiceType: '',
})

const columns = ref<string[]>([
  '',
  // '',
  'Submitted Document No',
  'Status',
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

const verifList = computed(() => verificationApi.listNonPo)

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
  router.push({
    name: 'invoiceDetailEdit',
    query: {
      id: invoiceId,
      type: '2',
    },
  })
}

const setList = () => {
  const result: ListNonPoTypes[] = []
  for (const [index, item] of verifList.value.entries()) {
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
    .getListNonPo({
      statusCode: filterForm.status || 2,
      companyCode: filterForm.companyCode,
      invoiceTypeCode: Number(filterForm.invoiceType),
      invoiceDate: filterForm.date,
      searchText: search.value,
    })
    .finally(() => {
      setList()
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

onMounted(() => {
  callList()
})
</script>

<style lang="scss" scoped>
@use '../styles/pending-approval.scss';
</style>

<template>
  <div class="border border-gray-200 rounded-xl p-[24px]">
    <div class="flex justify-between gap-[8px]">
      <UiInputSearch v-model="search" placeholder="Cari Invoice" class="w-[250px]" @keypress="goSearch" />
      <FilterList :data="filterForm" @setData="setDataFilter" />
    </div>
    <div class="mt-[24px]">
      <div class="pending__table overflow-x-auto">
        <table class="table align-middle text-gray-700 rounded-xl font-medium text-sm">
          <thead>
            <tr>
              <th v-for="(item, index) in columns" class="pending__column" :key="index">{{ item }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in list" :key="index">
              <td class="max-w-[400px] flex justify-between items-center gap-[24px]">
                <button v-if="item.statusCode === 4" class="btn btn-primary whitespace-nowrap" @click="openSuccesSap">
                  <i class="ki-duotone ki-paper-plane"></i>
                  Send to SAP
                </button>
                <button class="btn btn-outline btn-icon btn-primary" @click="openDetailInvoice(item.invoiceUId)">
                  <i class="ki-duotone ki-eye"></i>
                </button>
                <button class="btn btn-outline btn-icon btn-primary" @click="openDetailApproval(item.invoiceUId)">
                  <i class="ki-duotone ki-data"></i>
                </button>
              </td>
              <td>{{ item.invoiceNo || '-' }}</td>
              <td>
                <span class="badge badge-outline" :class="colorBadge(item.statusCode)">
                  {{ item.statusName }}
                </span>
              </td>
              <td>{{ item.poNo || '-' }}</td>
              <td>{{ item.grDocumentNo || '-' }}</td>
              <td>{{ item.invoiceTypeName || '-' }}</td>
              <td>{{ item.companyCode || '-' }}</td>
              <td>{{ item.costCenterName || '-' }}</td>
              <td>{{ useFormatIdr(item.whtBaseAmount) || '-' }}</td>
              <td>{{ useFormatIdr(item.vatAmount) || '-' }}</td>
              <td>{{ useFormatIdr(item.whtAmount) || '-' }}</td>
              <td>{{ useFormatIdr(item.totalNetAmount) || '-' }}</td>
              <td>{{ item.taxNo || '-' }}</td>
              <td>{{ item.documentNo || '-' }}</td>
              <td>{{ item.estimatePaymentDate ? moment(item.estimatePaymentDate).format('YYYYMMDD') : '-' }}</td>
              <td>{{ item.invoiceDate ? moment(item.invoiceDate).format('YYYYMMDD') : '-' }}</td>
              <td>{{ item.notes || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="flex items-center justify-between mt-[24px]">
        <p class="m-0 text-sm">Tampilkan {{ pageSize * currentPage > verifList.length ? verifList.length : pageSize * currentPage }} data dari total data {{ verifList.length }}</p>
        <LPagination :totalItems="verifList.length" :pageSize="pageSize" :currentPage="currentPage" @pageChange="setPage" />
      </div>
    </div>
    <SuccessSendToSap />
    <ModalSuccessApproval />
    <ModalDetailApproval :detailId="viewDetailId" @loadDetail="loadData" @setClearId="viewDetailId = ''" />
    <!-- <ModalReturnInvoice /> -->
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

// const ModalConfirmApproval = defineAsyncComponent(() => import('./pendingApproval/ConfirmationApproval.vue'))
const ModalSuccessApproval = defineAsyncComponent(() => import('./pendingApproval/SuccessApproval.vue'))
const ModalDetailApproval = defineAsyncComponent(() => import('./DetailApproval.vue'))
// const ModalRejectApproval = defineAsyncComponent(() => import('./pendingApproval/RejectApproval.vue'))
// const ModalReturnInvoice = defineAsyncComponent(() => import('./pendingApproval/ReturnInvoice.vue'))
const FilterList = defineAsyncComponent(() => import('./FilterList.vue'))
const SuccessSendToSap = defineAsyncComponent(() => import('./pendingApproval/SuccessSendToSap.vue'))

const invoiceApi = useInvoiceSubmissionStore()
const verificationApi = useInvoiceVerificationStore()
const router = useRouter()
const search = ref<string>('')
const currentPage = ref<number>(1)
const pageSize = ref<number>(10)
const list = ref<ListPoTypes[]>([])
const viewDetailId = ref<string>('')

const filterForm = reactive<filterListTypes>({
  status: null,
  date: '',
  companyCode: '',
  invoiceType: ''
})

const columns = ref<string[]>([
  '',
  'No Invoice',
  'Status',
  'No PO',
  'No GR',
  'Invoice Type',
  'Company Code',
  'Department',
  'Base Amount',
  'VAT Ammount',
  'WHT Amount',
  'Total Net Amount',
  'Tax Document No.',
  'Invoice Vendor No.',
  'Estimated Payment Date',
  'Invoice Submission Date',
  'Description'
])

const verifList = computed(() => verificationApi.listPo)

const colorBadge = (statusCode: number) => {
  const list = {
    2: 'badge-info',
    5: 'badge-danger',
    4: 'badge-success'
  } as { [key: number]: string }
  return list[statusCode]
}

const setPage = (value: number) => {
  currentPage.value = value
}

// const getModalConfirm = () => {
//   const idModal = document.querySelector('#confirm_approval_modal')
//   return KTModal.getInstance(idModal as HTMLElement)
// }

// const getModalSuccess = () => {
//   const idModal = document.querySelector('#success_approval_modal')
//   return KTModal.getInstance(idModal as HTMLElement)
// }

// const openSuccessApproval = () => {
//   const modalConfirm = getModalConfirm()
//   modalConfirm.hide()
//   const modalSuccess = getModalSuccess()
//   modalSuccess.show()

//   setTimeout(() => {
//     modalSuccess.hide()
//   }, 1500)
// }

const goSearch = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    callList()
  }
}

const openDetailApproval = (invoiceId: string) => {
  viewDetailId.value = invoiceId
  const idModal = document.querySelector('#detail_approval_modal')
  const modal = KTModal.getInstance(idModal as HTMLElement)
  modal.show()
}

const openDetailInvoice = (invoiceId: string) => {
  router.push({
    name: 'invoiceDetail',
    query: {
      id: invoiceId,
      type: '2'
    }
  })
}

const setList = () => {
  const result: ListPoTypes[] = []
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
  verificationApi.getListPo({
    statusCode: filterForm.status || 2,
    companyCode: filterForm.companyCode,
    invoiceTypeCode: Number(filterForm.invoiceType),
    invoiceDate: filterForm.date,
    searchText: search.value
  }).finally(() => {
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
  invoiceApi.getPoDetail(viewDetailId.value)
}

const openSuccesSap = () => {
  const idModal = document.querySelector('#success_send_sap_modal')
  const modal = KTModal.getInstance(idModal as HTMLElement)
  modal.show()

  setTimeout(() => {
    modal.hide()
  }, 1500)
}

onMounted(() => {
  callList()
})
</script>

<style lang="scss" scoped>
@use '../styles/pending-approval.scss';
</style>

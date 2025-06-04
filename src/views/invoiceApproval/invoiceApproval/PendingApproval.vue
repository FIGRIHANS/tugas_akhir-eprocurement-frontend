<template>
  <div class="border border-gray-200 rounded-xl p-[24px]">
    <div class="flex justify-between gap-[8px]">
      <UiInputSearch v-model="search" placeholder="Cari Invoice" class="w-[250px]" />
      <FilterList />
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
              <td class="max-w-[200px] flex justify-between items-center gap-[4px]">
                <button class="btn btn-outline btn-icon btn-primary" @click="openDetailInvoice">
                  <i class="ki-duotone ki-eye"></i>
                </button>
                <button class="btn btn-outline btn-icon btn-primary" @click="openDetailApproval">
                  <i class="ki-duotone ki-data"></i>
                </button>
              </td>
              <td>{{ item.invoiceNumber }}</td>
              <td>
                <span class="badge badge-outline badge-info">
                  Ready To Approve
                </span>
              </td>
              <td>{{ item.vendorName }}</td>
              <td>{{ item.poNumber }}</td>
              <td>{{ item.grNumber }}</td>
              <td>{{ item.invoiceType }}</td>
              <td>{{ item.companyCode }}</td>
              <td>{{ item.baseAmount }}</td>
              <td>{{ item.vatAmount }}</td>
              <td>{{ item.whtAmount }}</td>
              <td>{{ item.totalNetAmount }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="flex items-center justify-between mt-[24px]">
        <p class="m-0">Tampilkan 10 data dari total data 100</p>
        <LPagination :totalItems="totalItem" :pageSize="pageSize" :currentPage="currentPage" @pageChange="setPage" />
      </div>
    </div>
    <ModalSuccessApproval />
    <ModalDetailApproval />
    <!-- <ModalReturnInvoice /> -->
  </div>
</template>

<script lang="ts" setup>
import { ref, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import type { listItemTypes } from '../types/pendingApproval'
import { KTModal } from '@/metronic/core'
import LPagination from '@/components/pagination/LPagination.vue'
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'

// const ModalConfirmApproval = defineAsyncComponent(() => import('./pendingApproval/ConfirmationApproval.vue'))
const ModalSuccessApproval = defineAsyncComponent(() => import('./pendingApproval/SuccessApproval.vue'))
const ModalDetailApproval = defineAsyncComponent(() => import('./DetailApproval.vue'))
// const ModalRejectApproval = defineAsyncComponent(() => import('./pendingApproval/RejectApproval.vue'))
// const ModalReturnInvoice = defineAsyncComponent(() => import('./pendingApproval/ReturnInvoice.vue'))
const FilterList = defineAsyncComponent(() => import('./FilterList.vue'))

const router = useRouter()
const search = ref<string>('')
const currentPage = ref<number>(1)
const pageSize = ref<number>(10)
const totalItem = ref<number>(100)

const columns = ref<string[]>([
  '',
  'No Invoice',
  'Status',
  'Vendor Name',
  'No PO',
  'No GR',
  'Invoice Type',
  'Company Code',
  'Base Amount',
  'VAT Ammount',
  'WHT Amount',
  'Total Net Amount'
])

const list = ref<listItemTypes[]>([
  {
    invoiceNumber: 'INV0000123',
    vendorName: 'PT Pharmacy',
    grNumber: '5000000054',
    poNumber: '1110052253',
    invoiceType: 'PT Pharmacy',
    companyCode: 'DELA',
    baseAmount: '100000',
    vatAmount: '11000',
    whtAmount: '2000',
    totalNetAmount: '109000'
  }
])

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

const openDetailApproval = () => {
  const idModal = document.querySelector('#detail_approval_modal')
  const modal = KTModal.getInstance(idModal as HTMLElement)
  modal.show()
}

const openDetailInvoice = () => {
  router.push({
    name: 'invoiceDetail'
  })
}
</script>

<style lang="scss" scoped>
@use '../styles/pending-approval.scss';
</style>

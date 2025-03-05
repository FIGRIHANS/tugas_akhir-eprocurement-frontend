<template>
  <div class="border border-gray-200 rounded-xl p-[24px]">
    <UiInputSearch v-model="search" placeholder="Cari Invoice" class="w-[250px]" />
    <div class="mt-[24px]">
      <table class="table align-middle text-gray-700 rounded-xl font-medium text-sm">
        <thead>
          <tr>
            <th v-for="(item, index) in columns" class="pending__column" :key="index">{{ item }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in list" :key="index">
            <td class="w-[70px]">
              <div class="dropdown" data-dropdown="true" data-dropdown-trigger="click" data-dropdown-dismiss="true">
                <button class="dropdown-toggle btn btn-light btn-icon">
                  <i class="ki-filled ki-dots-vertical"></i>
                </button>
                <div class="dropdown-content w-full max-w-56">
                  <div class="p-[10px]">
                    <button class="btn btn-clear btn-light w-full" @click="openDetailInvoice">
                      <i class="ki-duotone ki-eye"></i>
                      Detail Invoice
                    </button>
                    <button class="btn btn-clear btn-light w-full" @click="openDetailApproval">
                      <i class="ki-duotone ki-data"></i>
                      Detail Approval
                    </button>
                  </div>
                  <hr />
                  <div class="p-[10px]">
                    <div
                      class="flex items-center gap-[10px] cursor-pointer py-[10px] px-[16px] text-orange-500 hover:text-white hover:bg-orange-600 rounded-md"
                      @click="openReturn"
                    >
                      <i class="ki-duotone ki-arrows-loop"></i>
                      <span>Return to User</span>
                    </div>
                  </div>
                </div>
              </div>
            </td>
            <td class="w-[70px]">
              <button class="btn btn-primary btn-icon" @click="openConfirmApproval">
                <i class="ki-duotone ki-check-circle"></i>
              </button>
            </td>
            <td class="w-[70px]">
              <button class="btn btn-outline btn-danger btn-icon" @click="openReject">
                <i class="ki-duotone ki-cross-circle"></i>
              </button>
            </td>
            <td>{{ item.invoiceNumber }}</td>
            <td>
              <span class="badge badge-outline badge-info">
                Ready To Approve
              </span>
            </td>
            <td>{{ item.vendorName }}</td>
            <td>{{ item.amountDue }}</td>
          </tr>
        </tbody>
      </table>
      <div class="flex items-center justify-between mt-[24px]">
        <p class="m-0">Tampilkan 10 data dari total data 100</p>
        <LPagination :totalItems="totalItem" :pageSize="pageSize" :currentPage="currentPage" @pageChange="setPage" />
      </div>
    </div>
    <ModalConfirmApproval @approve="openSuccessApproval" />
    <ModalSuccessApproval />
    <ModalDetailApproval />
    <ModalRejectApproval />
    <ModalReturnInvoice />
  </div>
</template>

<script lang="ts" setup>
import { ref, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import type { listItemTypes } from '../types/pendingApproval'
import { KTModal } from '@/metronic/core'
import LPagination from '@/components/pagination/LPagination.vue'
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'

const ModalConfirmApproval = defineAsyncComponent(() => import('./pendingApproval/ConfirmationApproval.vue'))
const ModalSuccessApproval = defineAsyncComponent(() => import('./pendingApproval/SuccessApproval.vue'))
const ModalDetailApproval = defineAsyncComponent(() => import('./pendingApproval/DetailApproval.vue'))
const ModalRejectApproval = defineAsyncComponent(() => import('./pendingApproval/RejectApproval.vue'))
const ModalReturnInvoice = defineAsyncComponent(() => import('./pendingApproval/ReturnInvoice.vue'))

const router = useRouter()
const search = ref<string>('')
const currentPage = ref<number>(1)
const pageSize = ref<number>(10)
const totalItem = ref<number>(100)

const columns = ref<string[]>([
  '',
  '',
  '',
  'No Invoice',
  'Status',
  'Nama Vendor',
  'Amount Due'
])

const list = ref<listItemTypes[]>([
  {
    invoiceNumber: 'INV0000123',
    vendorName: 'PT Pharmacy',
    amountDue: '2365456'
  }
])

const setPage = (value: number) => {
  currentPage.value = value
}

const getModalConfirm = () => {
  const idModal = document.querySelector('#confirm_approval_modal')
  return KTModal.getInstance(idModal as HTMLElement)
}

const openConfirmApproval = () => {
  const modal = getModalConfirm()
  modal.show()
}

const getModalSuccess = () => {
  const idModal = document.querySelector('#success_approval_modal')
  return KTModal.getInstance(idModal as HTMLElement)
}

const openSuccessApproval = () => {
  const modalConfirm = getModalConfirm()
  modalConfirm.hide()
  const modalSuccess = getModalSuccess()
  modalSuccess.show()

  setTimeout(() => {
    modalSuccess.hide()
  }, 1500)
}

const openDetailApproval = () => {
  const idModal = document.querySelector('#detail_approval_modal')
  const modal = KTModal.getInstance(idModal as HTMLElement)
  modal.show()
}

const openReject = () => {
  const idModal = document.querySelector('#reject_approval_modal')
  const modal = KTModal.getInstance(idModal as HTMLElement)
  modal.show()
}

const openReturn = () => {
  const idModal = document.querySelector('#return_approval_modal')
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

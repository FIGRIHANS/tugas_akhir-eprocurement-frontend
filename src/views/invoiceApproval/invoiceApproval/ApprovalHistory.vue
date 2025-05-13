<template>
  <div class="border border-gray-200 rounded-xl p-[24px]">
    <div class="flex justify-between gap-[8px]">
      <UiInputSearch v-model="search" placeholder="Cari Invoice" class="w-[250px]" />
      <FilterList />
    </div>
    <div class="mt-[24px]">
      <div class="history__table overflow-x-auto">
        <table class="table align-middle text-gray-700 rounded-xl font-medium text-sm">
          <thead>
            <tr>
              <th v-for="(item, index) in columns" :key="index" class="history__column" :class="index === 0 ? 'w-[250px]' : ''">{{ item }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in list" :key="index">
              <td class="flex items-center justify-center gap-[20px] max-w-[250px]">
                <button v-if="item.status === 1" class="btn btn-primary whitespace-nowrap" @click="openSuccesSap">
                  <i class="ki-duotone ki-paper-plane"></i>
                  Send to SAP
                </button>
                <button class="btn btn-outline btn-primary btn-icon">
                  <i class="ki-duotone ki-eye"></i>
                </button>
                <button class="btn btn-outline btn-icon btn-primary" @click="openDetailApproval">
                  <i class="ki-duotone ki-data"></i>
                </button>
              </td>
              <td>{{ item.invoiceNumber }}</td>
              <td>
                <span class="badge badge-outline" :class="badgeColor(item.status)">
                  {{ badgeTitle(item.status) }}
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
    <SuccessSendToSap />
    <ModalDetailApproval />
  </div>
</template>

<script lang="ts" setup>
import { ref, defineAsyncComponent } from 'vue'
import type { listItemTypes } from '../types/approvalHistory'
import { KTModal } from '@/metronic/core'
import LPagination from '@/components/pagination/LPagination.vue'
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'

const SuccessSendToSap = defineAsyncComponent(() => import('./approvalHistory/SuccessSendToSap.vue'))
const ModalDetailApproval = defineAsyncComponent(() => import('./DetailApproval.vue'))
const FilterList = defineAsyncComponent(() => import('./FilterList.vue'))

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
    status: 1,
    vendorName: 'PT Pharmacy',
    grNumber: '5000000054',
    poNumber: '1110052253',
    invoiceType: 'PT Pharmacy',
    companyCode: 'DELA',
    baseAmount: '100000',
    vatAmount: '11000',
    whtAmount: '2000',
    totalNetAmount: '109000'
  },
  {
    invoiceNumber: 'INV0000123',
    status: 2,
    vendorName: 'PT Pharmacy',
    grNumber: '5000000054',
    poNumber: '1110052253',
    invoiceType: 'PT Pharmacy',
    companyCode: 'DELA',
    baseAmount: '100000',
    vatAmount: '11000',
    whtAmount: '2000',
    totalNetAmount: '109000'
  },
  {
    invoiceNumber: 'INV0000123',
    status: 3,
    vendorName: 'PT Pharmacy',
    grNumber: '5000000054',
    poNumber: '1110052253',
    invoiceType: 'PT Pharmacy',
    companyCode: 'DELA',
    baseAmount: '100000',
    vatAmount: '11000',
    whtAmount: '2000',
    totalNetAmount: '109000'
  },
  {
    invoiceNumber: 'INV0000123',
    status: 4,
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

const badgeColor = (status: number) => {
  const list = {
    1: 'badge-success',
    2: 'badge-danger',
    3: 'badge-warning',
    4: 'badge-primary'
  } as { [key: number]: string }
  return list[status]
}

const badgeTitle = (status: number) => {
  const list = {
    1: 'Approved',
    2: 'Rejected',
    3: 'Returned',
    4: 'Done'
  } as { [key: number]: string }
  return list[status]
}

const setPage = (value: number) => {
  currentPage.value = value
}

const openSuccesSap = () => {
  const idModal = document.querySelector('#success_send_sap_modal')
  const modal = KTModal.getInstance(idModal as HTMLElement)
  modal.show()

  setTimeout(() => {
    modal.hide()
  }, 1500)
}

const openDetailApproval = () => {
  const idModal = document.querySelector('#detail_approval_modal')
  const modal = KTModal.getInstance(idModal as HTMLElement)
  modal.show()
}
</script>

<style lang="scss" scoped>
@use '../styles/approval-history.scss';
</style>

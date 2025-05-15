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
              <td class="flex justify-between items-center gap-[8px]">
                <button class="btn btn-outline btn-primary btn-icon" @click="openDetailInvoice">
                  <i class="ki-duotone ki-eye"></i>
                </button>
                <button class="btn btn-outline btn-primary btn-icon" @click="openDetailVerification">
                  <i class="ki-duotone ki-data"></i>
                </button>
              </td>
              <td>{{ item.invoiceNumber }}</td>
              <td>
                <span class="badge badge-outline badge-info">
                  Ready To Verify
                </span>
              </td>
              <td>{{ item.vendorName }}</td>
              <td>{{ item.grNumber }}</td>
              <td>{{ item.poNumber }}</td>
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
    <DetailVerificationModal />
  </div>
</template>

<script lang="ts" setup>
import { ref, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import type { listItemTypes } from '../types/pendingVerification'
import LPagination from '@/components/pagination/LPagination.vue'
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import { KTModal } from '@/metronic/core'

const DetailVerificationModal = defineAsyncComponent(() => import('./DetailVerificationModal.vue'))
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
  },
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

const openDetailInvoice = () => {
  router.push({
    name: 'invoiceDetail'
  })
}

const openDetailVerification = () => {
  const idModal = document.querySelector('#detail_verification_modal')
  const modal = KTModal.getInstance(idModal as HTMLElement)
  modal.show()
}
</script>

<style lang="scss" scoped>
@use '../styles/pending-verification.scss';
</style>

<template>
  <div class="border border-gray-200 rounded-xl p-[24px]">
    <div class="flex justify-between gap-[8px]">
      <UiInputSearch v-model="search" placeholder="Cari Invoice" class="w-[250px]" />
      <FilterList :data="filterForm" />
    </div>

    <div class="overflow-x-auto list__table mt-[24px]">
      <table class="table align-middle text-gray-700 font-medium text-sm">
      <thead>
        <tr>
          <th v-for="(item, index) in columns" :key="index" :class="index !== 0 ? 'list__long' : ''">
            {{ item }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in list" :key="index">
          <td>
            <button class="btn btn-outline btn-icon btn-primary">
              <i class="ki-filled ki-eye"></i>
            </button>
          </td>
          <td>{{ item.invoiceNumber }}</td>
          <td>
            <span class="badge badge-outline badge-warning">
              Proses Verifikasi
            </span>
          </td>
          <td>{{ item.grNumber }}</td>
          <td>{{ item.poNumber }}</td>
          <td>{{ item.invoiceCategory }}</td>
          <td>{{ item.invoiceDate }}</td>
          <td>{{ item.vendorName }}</td>
          <td>{{ item.amountDue }}</td>
        </tr>
      </tbody>
      </table>
    </div>

    <div class="flex items-center justify-between mt-[24px]">
      <p class="m-0">Tampilkan 10 data dari total data 100</p>
      <LPagination :totalItems="totalItem" :pageSize="pageSize" :currentPage="currentPage" @pageChange="setPage" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, defineAsyncComponent } from 'vue'
import type { listTypes, filterListTypes } from '../../types/invoiceList'
import LPagination from '@/components/pagination/LPagination.vue'
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'

const FilterList = defineAsyncComponent(() => import('./FilterList.vue'))

const search = ref<string>('')
const currentPage = ref<number>(1)
const pageSize = ref<number>(10)
const totalItem = ref<number>(100)

const filterForm = reactive<filterListTypes>({
  status: '',
  category: '',
  date: ''
})

const columns = ref([
  '',
  'No Invoice',
  'Status',
  'No GR',
  'No PO',
  'Invoice Category',
  'Invoice Date',
  'Vendor Name',
  'Amount Due'
])

const list = ref<listTypes[]>([
  {
    invoiceNumber: 'INV238744',
    status: 1,
    grNumber: '5000000054',
    poNumber: '1110052253',
    invoiceCategory: 'With DP',
    invoiceDate: '15 Okt 2024',
    vendorName: 'PT Pharmacy',
    amountDue: '2365456'
  }
])

const setPage = (value: number) => {
  currentPage.value = value
}
</script>

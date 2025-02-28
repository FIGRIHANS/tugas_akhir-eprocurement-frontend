<template>
  <div class="border border-gray-200 rounded-xl p-[24px]">
    <div class="flex justify-between gap-[8px]">
      <div class="input w-[250px]">
        <i class="ki-outline ki-magnifier"></i>
        <input v-model="search" placeholder="Cari Invoice" type="text"/>
      </div>
      <button class="btn btn-primary" @click="goAdd">
        <i class="ki-duotone ki-plus-circle"></i>
        Add Invoice
      </button>
    </div>

    <div class="overflow-x-auto list__table mt-[24px]">
      <table class="table align-middle text-gray-700 font-medium text-sm">
      <thead>
        <tr>
          <th v-for="(item, index) in columns" :key="index" :class="index !== 0 && index !== columns.length - 1 ? 'list__long' : ''">
            {{ item }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in list" :key="index">
          <td>{{ item.no }}</td>
          <td>{{ item.invoiceNumber }}</td>
          <td>
            <span class="badge badge-outline badge-warning">
              Proses Verifikasi
            </span>
          </td>
          <td>{{ item.taxNumber }}</td>
          <td>{{ item.taxDate }}</td>
          <td>{{ item.taxCalculation }}</td>
          <td>{{ item.taxCode }}</td>
          <td>{{ item.whtCode }}</td>
          <td>{{ item.paymentTerm }}</td>
          <td>{{ item.companyName }}</td>
          <td>{{ item.vendorName }}</td>
          <td>
            <button class="btn btn-outline btn-primary">
              <i class="ki-filled ki-eye"></i>
            </button>
          </td>
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { listTypes } from '../types/invoiceList'
import LPagination from '@/components/pagination/LPagination.vue'

const router = useRouter()
const search = ref<string>('')
const currentPage = ref<number>(1)
const pageSize = ref<number>(10)
const totalItem = ref<number>(100)

const columns = ref([
  'No',
  'No Invoice',
  'Status',
  'No Faktur Pajak',
  'Tanggal Faktur',
  'Tax Calculation',
  'Tax Code',
  'WHT Code',
  'Payment Term',
  'Company',
  'Vendor',
  'Action'
])

const list = ref<listTypes[]>([
  {
    no: 1,
    invoiceNumber: 'INV238744',
    status: 1,
    taxNumber: '7236287634',
    taxDate: '15 Okt 2024',
    taxCalculation: 'Header',
    taxCode: '2766534',
    whtCode: 'W2',
    paymentTerm: 'Z045',
    companyName: 'PT Arya Noble',
    vendorName: 'PT Pharmacy'
  }
])

const goAdd = () => {
  router.push({
    name: 'invoiceAdd'
  })
}

const setPage = (value: number) => {
  currentPage.value = value
}
</script>

<style lang="scss" scoped>
@use '../styles/invoice-list.scss';
</style>

<template>
  <div class="border border-gray-200 rounded-xl p-[24px]">
    <div class="flex justify-between gap-[8px]">
      <UiInputSearch v-model="search" placeholder="Cari Invoice" class="w-[250px]" @keypress="goSearch" />
      <FilterList :data="filterForm" @setData="setDataFilter" />
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
            <button class="btn btn-outline btn-icon btn-primary" @click="goView(item.invoiceUId)">
              <i class="ki-filled ki-eye"></i>
            </button>
          </td>
          <td>{{ item.invoiceNo }}</td>
          <td>
            <span class="badge badge-outline badge-warning">
              Under Verification
            </span>
          </td>
          <td>{{ item.poNo }}</td>
          <td>{{ item.grDocumentNo }}</td>
          <td>{{ item.companyCode }}</td>
          <td>{{ item.invoiceTypeName }}</td>
          <td>{{ moment(item.invoiceDate).format('DD MMMM YYYY') }}</td>
          <td>{{ useFormatIdr(item.totalGrossAmount) }}</td>
          <td>{{ useFormatIdr(item.totalNetAmount) }}</td>
          <td>{{ item.estimatePaymentDate }}</td>
        </tr>
      </tbody>
      </table>
    </div>

    <div class="flex items-center justify-between mt-[24px]">
      <p class="m-0 text-sm">Tampilkan {{ poList.length > 10 ? 10 : poList.length }} data dari total data {{ poList.length }}</p>
      <LPagination :totalItems="poList.length" :pageSize="pageSize" :currentPage="currentPage" @pageChange="setPage" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import type { filterListTypes } from '../../types/invoiceList'
import LPagination from '@/components/pagination/LPagination.vue'
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import { useInvoiceSubmissionStore } from '@/stores/views/invoice/submission'
import { useFormatIdr } from '@/composables/currency'
import type { ListPoTypes } from '@/stores/views/invoice/types/submission'
import moment from 'moment'

const FilterList = defineAsyncComponent(() => import('./FilterList.vue'))

const invoiceApi = useInvoiceSubmissionStore()
const router = useRouter()
const search = ref<string>('')
const currentPage = ref<number>(1)
const pageSize = ref<number>(10)
const list = ref<ListPoTypes[]>([])

const filterForm = reactive<filterListTypes>({
  status: '',
  date: '',
  companyCode: '',
  invoiceType: ''
})

const columns = ref([
  '',
  'No Invoice',
  'Status',
  'No PO',
  'No GR',
  'Company Code',
  'Invoice PO Type',
  'Invoice Date',
  'Total Gross Amount',
  'Total Net Amount',
  'Estimated Payment Date'
])

const poList = computed(() => invoiceApi.listPo)

const setListPo = () => {
  const result: ListPoTypes[] = []
  for (const [index, item] of poList.value.entries()) {
    const start = currentPage.value * pageSize.value - pageSize.value
    const end = currentPage.value * pageSize.value - 1
    if (index >= start && index <= end) {
      result.push(item)
    }
  }
  list.value = result
}

const setPage = (value: number) => {
  currentPage.value = value
  setListPo()
}

const goView = (invoiceUId: string) => {
  router.push({
    name: 'invoiceAdd',
    query: {
      type: 'po-view',
      invoice: invoiceUId
    }
  })
}

const callList = () => {
  list.value = []
  invoiceApi.getListPo({
    statusCode: filterForm.status === '0' || filterForm.status ? Number(filterForm.status) : null,
    companyCode: filterForm.companyCode,
    invoiceTypeCode: Number(filterForm.invoiceType),
    invoiceDate: filterForm.date,
    searchText: search.value
  }).finally(() => {
    setListPo()
  })
}

const setDataFilter = (data: filterListTypes) => {
  filterForm.status = data.status
  filterForm.date = data.date
  filterForm.companyCode = data.companyCode
  filterForm.invoiceType = data.invoiceType
  callList()
}

const goSearch = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    callList()
  }
}

onMounted(() => {
  callList()
})
</script>

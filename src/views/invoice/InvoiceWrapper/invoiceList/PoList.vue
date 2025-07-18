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
          <template v-for="(parent, index) in list" :key="index">
            <tr>
              <td class="flex items-center gap-[24px]">
                <button class="btn btn-outline btn-icon btn-primary w-[32px] h-[32px]" @click="goView(parent)">
                  <i class="ki-filled ki-eye !text-lg"></i>
                </button>
                <button class="btn btn-icon btn-primary w-[21px] h-[21px]" @click="parent.isOpenChild = !parent.isOpenChild">
                  <i v-if="!parent.isOpenChild" class="ki-filled ki-right !text-[9px]"></i>
                  <i v-else class="ki-filled ki-down !text-[9px]"></i>
                </button>
              </td>
              <td>{{ parent.invoiceNo }}</td>
              <td>
                <span class="badge badge-outline" :class="colorBadge(parent.statusCode)">
                  {{ parent.statusName }}
                </span>
              </td>
              <td>{{ parent.vendorName }}</td>
              <td>{{ parent.documentNo }}</td>
              <td>{{ parent.companyCode }}</td>
              <td>{{ parent.invoiceTypeName }}</td>
              <td>{{ moment(parent.invoiceDate).format('DD MMMM YYYY') }}</td>
              <td>{{ useFormatIdr(parent.totalGrossAmount) }}</td>
              <td>{{ useFormatIdr(parent.totalNetAmount) }}</td>
              <td>{{ parent.estimatePaymentDate ? moment(parent.estimatePaymentDate).format('DD MMMM YYYY') : '-' }}</td>
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
      <p class="m-0 text-sm">Tampilkan {{ pageSize * currentPage > poList.length ? poList.length : pageSize * currentPage }} data dari total data {{ poList.length }}</p>
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
  status: '1',
  date: '',
  companyCode: '',
  invoiceType: ''
})

const columns = ref([
  '',
  'No Invoice',
  'Status',
  'Vendor Name',
  'Invoice Vendor No',
  'Company Code',
  'Invoice PO Type',
  'Invoice Date',
  'Total Gross Amount',
  'Total Net Amount',
  'Estimated Payment Date'
])

const columnsChild = ref([
  'No PO',
  'No GR',
  'Item Description',
  'Item Amount',
  'Quantity'
])

const poList = computed(() => invoiceApi.listPo)

const colorBadge = (statusCode: number) => {
  const list = {
    0: 'badge-primary',
    1: 'badge-warning',
    2: 'badge-info',
    4: 'badge-success',
    5: 'badge-danger'
  } as { [key: number]: string }
  return list[statusCode]
}

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

const goView = (data: ListPoTypes) => {
  if (data.statusCode === 0 || data.statusCode === 5) {
    router.push({
      name: 'invoiceAdd',
      query: {
        type: 'po',
        invoice: data.invoiceUId
      }
    })
  } else {
    router.push({
      name: 'invoiceAdd',
      query: {
        type: 'po-view',
        invoice: data.invoiceUId
      }
    })
  }
}

const callList = () => {
  list.value = []
  invoiceApi.getListPo({
    statusCode: filterForm.status === '0' || filterForm.status ? Number(filterForm.status) : 1,
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

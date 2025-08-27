<template>
  <div>
    <Breadcrumb title="Invoice" :routes="routes" />

    <section
      name="table"
      class="border rounded-md mt-[24px] p-[24px] flex flex-col gap-[24px] justify-center bg-white"
    >
      <div class="flex flex-row gap-[24px] justify-between w-full">
        <div>Invoice Non PO</div>
        <div class="flex flex-row gap-[8px]">
          <InputSearch placeholder="Search" v-model="search" />
          <FilterList :data="filterForm" @setData="setDataFilter" />
          <UiButton variant="primary"
            ><i class="ki-duotone ki-plus-circle"></i>Add invoice</UiButton
          >
        </div>
      </div>
      <div class="scrollable-x-auto">
        <table class="table align-middle">
          <thead>
            <tr class="text-nowrap border-b border-primary">
              <th
                v-for="(item, index) in columns"
                :key="index"
                :class="index !== 0 ? 'list__long' : ''"
              >
                {{ item }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in data" :key="item.invoiceNo" class="text-nowrap">
              <td>
                <button
                  class="btn btn-outline btn-icon btn-primary w-[32px] h-[32px]"
                  @click="console.log('masuk')"
                >
                  <i class="ki-filled ki-eye !text-lg"></i>
                </button>
              </td>
              <td>{{ item.invoiceNo }}</td>
              <td>
                <span class="badge badge-outline" :class="colorBadge(item.statusCode)">
                  {{ item.statusName }}
                </span>
              </td>
              <td>{{ item.vendorName }}</td>
              <td>{{ item.documentNo || '-' }}</td>
              <td>{{ item.companyCode || '-' }}</td>
              <td>{{ item.invoiceTypeName }}</td>
              <td>{{ item.invoiceDate }}</td>
              <td>{{ item.totalGrossAmount }}</td>
              <td>{{ item.totalNetAmount }}</td>
              <td>{{ item.estimatedPaymentDate }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="card-footer">
        <div>
          Tampilkan {{ '10' }} data dari total data
          {{ '100' }}
        </div>
        <LPagination
          :current-page="page"
          :page-size="10"
          :total-items="100"
          @page-change="handlePageChange"
        />
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, defineAsyncComponent, onMounted, computed } from 'vue'
import LPagination from '@/components/pagination/LPagination.vue'
import type { filterListTypes } from './types/invoiceList'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import InputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import type { routeTypes } from '@/core/type/components/breadcrumb'
const FilterList = defineAsyncComponent(() => import('./vendorListSubmission/FilterList.vue'))
import { useInvoiceSubmissionStore } from '@/stores/views/invoice/submission'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'

const invoiceSubmissionApi = useInvoiceSubmissionStore()

// import UiModal from '@/components/modal/UiModal.vue'
// import UiSelect from '@/components/ui/atoms/select/UiSelect.vue'
// import UiInput from '@/components/ui/atoms/input/UiInput.vue'

const search = ref('')
// const selectedItems = ref<number[]>([])
const page = ref(1)
// const isModalFilterOpen = ref(false)

const filterForm = reactive<filterListTypes>({
  status: '1',
  date: '',
  companyCode: '',
  invoiceType: '',
})

const columns = ref([
  '',
  'Submitted Document No',
  'Status',
  'Vendor Name',
  'Invoice Vendor No',
  'Company Code',
  'Invoice PO Type',
  'Invoice Date',
  'Total Gross Amount',
  'Total Net Amount',
  'Estimated Payment Date',
])

const data = ref([
  {
    statusCode: 1,
    invoiceNo: 'DPL-AP202312500001',
    statusName: 'Waiting to Verify',
    vendorName: 'PT Talent Setyaji',
    documentNo: 'INV2310232501726',
    companyCode: 'DPLA',
    invoiceTypeName: 'Non-PO - Non-Investment',
    invoiceDate: '16 Oktober 2024',
    totalGrossAmount: '1.000.000',
    totalNetAmount: '1.000.000',
    estimatedPaymentDate: '30 November 2024',
  },
])

const routes = ref<routeTypes[]>([
  {
    name: 'Invoice Non PO',
    to: '/tender/central',
  },
])

const colorBadge = (statusCode: number) => {
  const list = {
    0: 'badge-primary',
    1: 'badge-warning',
    2: 'badge-info',
    4: 'badge-success',
    5: 'badge-danger',
    7: 'badge-primary',
  } as { [key: number]: string }
  return list[statusCode]
}

const handlePageChange = () => {
  console.log('masuk')
}

const setDataFilter = (data: filterListTypes) => {
  filterForm.status = data.status
  filterForm.date = data.date
  filterForm.companyCode = data.companyCode
  filterForm.invoiceType = data.invoiceType
  listCall()
}

const listCall = () => {
  invoiceSubmissionApi
    .getListNonPo({
      statusCode: filterForm.status === '0' || filterForm.status ? Number(filterForm.status) : 1,
      companyCode: filterForm.companyCode,
      invoiceTypeCode: Number(filterForm.invoiceType),
      invoiceDate: filterForm.date,
      searchText: search.value,
    })
    .finally(() => {
      console.log(nonPoList.value, 'list')
    })
}

const nonPoList = computed(() => invoiceSubmissionApi.listNonPo)

onMounted(() => {
  listCall()
})

// const isIndeterminate = computed(() => {
//   return selectedItems.value.length > 0 && selectedItems.value.length < prData.value.length
// })

// watch(filter, () => {
//     hasActiveFilter()
// }, { immediate: true })
</script>

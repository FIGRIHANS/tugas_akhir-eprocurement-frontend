<template>
  <div class="border border-gray-200 rounded-xl p-[24px]">
    <div class="flex justify-between gap-[8px]">
      <UiInputSearch
        v-model="search"
        placeholder="Cari Invoice"
        class="w-[250px]"
        @keypress="goSearch"
      />
      <FilterList :data="filterForm" @setData="setDataFilter" />
    </div>

    <div class="overflow-x-auto list__table mt-[24px]">
      <table class="table align-middle text-gray-700 font-medium text-sm">
        <thead>
          <tr class="text-nowrap border-b border-primary">
            <th class="!bg-blue-100 !text-blue-500">Action</th>
            <th class="!bg-blue-100 !text-blue-500">Purch Req</th>
            <th class="!bg-blue-100 !text-blue-500">PR Scenario</th>
            <th class="!bg-blue-100 !text-blue-500">PR Item No</th>
            <th class="!bg-blue-100 !text-blue-500">PO Item No</th>
            <th class="!bg-blue-100 !text-blue-500">PO</th>
            <th class="!bg-blue-100 !text-blue-500">Tender Status</th>
            <th class="!bg-blue-100 !text-blue-500">Material No</th>
            <th class="!bg-blue-100 !text-blue-500">Material Desc</th>
            <th class="!bg-blue-100 !text-blue-500">Qty</th>
            <th class="!bg-blue-100 !text-blue-500">UoM</th>
            <th class="!bg-blue-100 !text-blue-500">Delivery Category</th>
            <th class="!bg-blue-100 !text-blue-500">Material Group</th>
            <th class="!bg-blue-100 !text-blue-500">Plant</th>
            <th class="!bg-blue-100 !text-blue-500">S Loc</th>
            <th class="!bg-blue-100 !text-blue-500">Purch Group</th>
            <th class="!bg-blue-100 !text-blue-500">Agreement</th>
            <th class="!bg-blue-100 !text-blue-500">Info Record</th>
            <th class="!bg-blue-100 !text-blue-500">Indicator</th>
            <th class="!bg-blue-100 !text-blue-500">Creation Indicator</th>
            <th class="!bg-blue-100 !text-blue-500">Account Assignment Category</th>
            <th class="!bg-blue-100 !text-blue-500">Asset No</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in prData" :key="item.id" class="text-nowrap">
            <td>
              <button class="btn btn-icon btn-outline btn-primary" @click="openDetail()">
                <i class="ki-filled ki-pencil"></i>
              </button>
            </td>
            <td>{{ item.purchReq }}</td>
            <td>{{ item.prScenario }}</td>
            <td>{{ item.prItemNo }}</td>
            <td>{{ item.poItemNo || '-' }}</td>
            <td>{{ item.po || '-' }}</td>
            <td>{{ item.tenderStatus }}</td>
            <td>{{ item.materialNo }}</td>
            <td>{{ item.materialDesc }}</td>
            <td>{{ item.qty }}</td>
            <td>{{ item.uom }}</td>
            <td>{{ item.deliveryCategory }}</td>
            <td>{{ item.materialGroup }}</td>
            <td>{{ item.plant }}</td>
            <td>{{ item.sLoc }}</td>
            <td>{{ item.purchGroup }}</td>
            <td>{{ item.agreement || '-' }}</td>
            <td>{{ item.infoRecord || '-' }}</td>
            <td>{{ item.indicator || '-' }}</td>
            <td>{{ item.creationIndicator }}</td>
            <td>{{ item.accountAssignmentCategory }}</td>
            <td>{{ item.assetNo }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex items-center justify-between mt-[24px]">
      <p class="m-0 text-sm">
        Tampilkan
        {{ pageSize * currentPage > poList.length ? poList.length : pageSize * currentPage }} data
        dari total data {{ poList.length }}
      </p>
      <LPagination
        :totalItems="poList.length"
        :pageSize="pageSize"
        :currentPage="currentPage"
        @pageChange="setPage"
      />
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
  invoiceType: '',
})

const prData = ref([
  {
    id: 1,
    purchReq: 'PR-001',
    prScenario: 'A',
    prItemNo: '10',
    poItemNo: null,
    po: null,
    tenderStatus: 'Open',
    materialNo: 'MAT-1001',
    materialDesc: 'Tinta Printer Epson',
    qty: 5,
    uom: 'PCS',
    deliveryCategory: 'Standard',
    materialGroup: 'GRP-01',
    plant: 'P001',
    sLoc: 'S001',
    purchGroup: 'PG10',
    agreement: null,
    infoRecord: 'IR-123',
    indicator: 'X',
    creationIndicator: 'A',
    accountAssignmentCategory: 'K',
    assetNo: 'ASSET-10',
  },
  {
    id: 2,
    purchReq: 'PR-002',
    prScenario: 'B',
    prItemNo: '20',
    poItemNo: 'PO-001',
    po: 'PO-001',
    tenderStatus: 'Awarded',
    materialNo: 'MAT-1002',
    materialDesc: 'Kertas A4 80gsm',
    qty: 100,
    uom: 'BOX',
    deliveryCategory: 'Express',
    materialGroup: 'GRP-02',
    plant: 'P002',
    sLoc: 'S002',
    purchGroup: 'PG20',
    agreement: 'AGR-456',
    infoRecord: null,
    indicator: '',
    creationIndicator: 'B',
    accountAssignmentCategory: 'A',
    assetNo: 'ASSET-20',
  },
  {
    id: 3,
    purchReq: 'PR-003',
    prScenario: 'A',
    prItemNo: '30',
    poItemNo: null,
    po: null,
    tenderStatus: 'Draft',
    materialNo: 'MAT-1003',
    materialDesc: 'Pena Gel Hitam',
    qty: 20,
    uom: 'PCS',
    deliveryCategory: 'Standard',
    materialGroup: 'GRP-01',
    plant: 'P001',
    sLoc: 'S001',
    purchGroup: 'PG10',
    agreement: null,
    infoRecord: null,
    indicator: 'Y',
    creationIndicator: 'A',
    accountAssignmentCategory: 'K',
    assetNo: 'ASSET-30',
  },
  {
    id: 4,
    purchReq: 'PR-004',
    prScenario: 'C',
    prItemNo: '40',
    poItemNo: 'PO-002',
    po: 'PO-002',
    tenderStatus: 'Awarded',
    materialNo: 'MAT-1004',
    materialDesc: 'CPU Core i7',
    qty: 2,
    uom: 'UNIT',
    deliveryCategory: 'Standard',
    materialGroup: 'GRP-03',
    plant: 'P003',
    sLoc: 'S003',
    purchGroup: 'PG30',
    agreement: null,
    infoRecord: 'IR-789',
    indicator: '',
    creationIndicator: 'C',
    accountAssignmentCategory: 'A',
    assetNo: 'ASSET-40',
  },
])

const poList = computed(() => invoiceApi.listPo)

const openDetail = () => {
  router.push({
    name: 'requisitionEdit',
    // query: {
    //   type: 'po',
    //   invoice: data.invoiceUId,
    // },
  })
}

// const colorBadge = (statusCode: number) => {
//   const list = {
//     0: 'badge-primary',
//     1: 'badge-warning',
//     2: 'badge-info',
//     4: 'badge-success',
//     5: 'badge-danger',
//     7: 'badge-primary',
//   } as { [key: number]: string }
//   return list[statusCode]
// }

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
        invoice: data.invoiceUId,
      },
    })
  } else {
    router.push({
      name: 'invoiceAdd',
      query: {
        type: 'po-view',
        invoice: data.invoiceUId,
      },
    })
  }
}

const callList = () => {
  list.value = []
  invoiceApi
    .getListPo({
      statusCode: filterForm.status === '0' || filterForm.status ? Number(filterForm.status) : 1,
      companyCode: filterForm.companyCode,
      invoiceTypeCode: Number(filterForm.invoiceType),
      invoiceDate: filterForm.date,
      searchText: search.value,
    })
    .finally(() => {
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

<template>
  <div>
    <Breadcrumb title="Goods Receipts" :routes="routes" />
    <hr class="-mx-[24px] mb-[24px]" />

    <div class="border border-gray-200 rounded-xl p-[24px]">
      <div class="flex justify-between align-items-center gap-[8px] mb-[24px]">
        <h3 class="text-lg font-semibold">Goods Receipt List</h3>
        <div class="flex align-items-center gap-3">
          <UiInputSearch v-model="search" placeholder="Search" @keypress="goSearch" />
          <button class="btn btn-light" @click="toggleFilter()">
            <i class="ki-duotone ki-filter"></i>
            Filter
          </button>
          <button class="btn btn-primary" @click="fetchData()">
            <i class="ki-duotone ki-arrows-circle"></i>
            Refresh
          </button>
        </div>
      </div>

      <div v-if="showFilter" class="border border-gray-200 rounded-lg p-4 mb-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="form-label">PO Number</label>
            <input v-model="filterForm.poNumber" type="text" class="form-control" />
          </div>
          <div>
            <label class="form-label">GR Document No</label>
            <input v-model="filterForm.grDocumentNo" type="text" class="form-control" />
          </div>
          <div>
            <label class="form-label">Delivery Order (DN)</label>
            <input v-model="filterForm.deliveryOrderNumber" type="text" class="form-control" />
          </div>
          <div v-if="!isVendorUser">
            <label class="form-label">Vendor Code</label>
            <input v-model="filterForm.vendorCode" type="text" class="form-control" />
          </div>
          <div>
            <label class="form-label">GR Date From</label>
            <input v-model="filterForm.grDateFrom" type="date" class="form-control" />
          </div>
          <div>
            <label class="form-label">GR Date To</label>
            <input v-model="filterForm.grDateTo" type="date" class="form-control" />
          </div>
        </div>
        <div class="flex gap-2 mt-4">
          <button class="btn btn-primary btn-sm" type="button" @click="applyFilter">Apply</button>
          <button class="btn btn-light btn-sm" type="button" @click="resetFilter">Reset</button>
        </div>
      </div>

      <div v-if="errorMessage" class="alert alert-danger mb-4">{{ errorMessage }}</div>

      <div class="overflow-x-auto list__table mt-[24px]">
        <table class="table align-middle text-gray-700 font-medium text-sm">
          <thead>
            <tr>
              <th
                v-for="(col, index) in columns"
                :key="index"
                class="!border-b-teal-500 !bg-teal-100 !text-teal-500"
              >
                {{ col }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading">
              <td :colspan="columns.length" class="text-center py-8">Loading…</td>
            </tr>
            <tr v-else-if="list.length === 0">
              <td :colspan="columns.length" class="text-center">No data found.</td>
            </tr>
            <tr v-for="(item, index) in list" v-else :key="item.grId">
              <td class="text-center">
                <button
                  type="button"
                  class="btn btn-outline btn-icon btn-primary w-[32px] h-[32px]"
                  title="View"
                  @click="viewDetail(item.grId)"
                >
                  <i class="ki-filled ki-eye !text-lg"></i>
                </button>
              </td>
              <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
              <td>{{ item.grDocumentNo }}</td>
              <td>{{ formatDate(item.grDocumentDate) }}</td>
              <td>{{ item.deliveryOrderNumber || '—' }}</td>
              <td>{{ item.poNumber || '—' }}</td>
              <td v-if="!isVendorUser">{{ item.vendorCode || '—' }}</td>
              <td>{{ item.vendorName || '—' }}</td>
              <td class="text-right">{{ formatMoney(item.totalAmount, item.currency) }}</td>
              <td>
                <span
                  class="badge badge-outline"
                  :class="item.hasDiscrepancy ? 'badge-warning' : 'badge-success'"
                >
                  {{ item.hasDiscrepancy ? 'Discrepancy' : 'OK' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex items-center justify-between mt-[24px]">
        <p class="m-0 text-sm">
          Showing
          {{
            pageSize * currentPage > filteredRows.length
              ? filteredRows.length
              : pageSize * currentPage
          }}
          of {{ filteredRows.length }} entries
        </p>
        <LPagination
          :totalItems="filteredRows.length"
          :pageSize="pageSize"
          :currentPage="currentPage"
          @pageChange="setPage"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { routeTypes } from '@/core/type/components/breadcrumb'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import LPagination from '@/components/pagination/LPagination.vue'
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import momentLib from 'moment'
import { cloneDeep } from 'lodash'
import GoodsReceiptService, { type GoodsReceiptHeaderDto } from '@/services/goodsReceipt.service'
import { useLoginStore } from '@/stores/views/login'

const moment = momentLib
const router = useRouter()
const userStore = useLoginStore()

const isVendorUser = computed(() => !!userStore.userData?.profile?.vendorCode)
const vendorProfileId = computed(() => userStore.userData?.profile?.profileId)
const vendorCodeUser = computed(() => userStore.userData?.profile?.vendorCode ?? undefined)

const routes = ref<routeTypes[]>([
  { name: 'Purchase Orders', to: '/mock-sap-list' },
  { name: 'Goods Receipts', to: '/goods-receipt-list' },
])

const search = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const dataList = ref<GoodsReceiptHeaderDto[]>([])
const isLoading = ref(false)
const errorMessage = ref('')
const showFilter = ref(false)

const filterForm = ref({
  poNumber: '',
  grDocumentNo: '',
  deliveryOrderNumber: '',
  vendorCode: '',
  grDateFrom: '',
  grDateTo: '',
})

const activeFilters = ref({ ...filterForm.value })

const columns = computed(() => {
  const base = ['Action', 'No', 'GR No', 'GR Date', 'Delivery Order', 'PO Number']
  if (!isVendorUser.value) base.push('Vendor Code')
  return [...base, 'Vendor Name', 'Total Amount', 'Receive Status']
})

const filteredRows = computed(() => {
  return cloneDeep(dataList.value)
})

const list = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredRows.value.slice(start, start + pageSize.value)
})

const fetchData = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const rows = await GoodsReceiptService.getList({
      searchText: search.value || undefined,
      poNumber: activeFilters.value.poNumber || undefined,
      grDocumentNo: activeFilters.value.grDocumentNo || undefined,
      deliveryOrderNumber: activeFilters.value.deliveryOrderNumber || undefined,
      vendorId: isVendorUser.value ? vendorProfileId.value : undefined,
      vendorCode: isVendorUser.value ? vendorCodeUser.value : activeFilters.value.vendorCode || undefined,
      grDocumentDateFrom: activeFilters.value.grDateFrom || undefined,
      grDocumentDateTo: activeFilters.value.grDateTo || undefined,
    })
    dataList.value = rows
    currentPage.value = 1
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Failed to load goods receipts'
    errorMessage.value = msg
    dataList.value = []
  } finally {
    isLoading.value = false
  }
}

const formatDate = (d: string) => (d ? moment(d).format('YYYY/MM/DD HH:mm') : '—')

const formatMoney = (amt: number | null | undefined, cur?: string) => {
  if (amt == null) return '—'
  const c = cur || 'IDR'
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: c, maximumFractionDigits: 2 }).format(amt)
}

const viewDetail = (grId: number) => {
  router.push({ name: 'goodsReceiptListDetail', params: { grId: String(grId) } })
}

const setPage = (p: number) => {
  currentPage.value = p
}

const goSearch = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    currentPage.value = 1
    fetchData()
  }
}

const toggleFilter = () => {
  showFilter.value = !showFilter.value
}

const applyFilter = () => {
  activeFilters.value = { ...filterForm.value }
  fetchData()
}

const resetFilter = () => {
  filterForm.value = {
    poNumber: '',
    grDocumentNo: '',
    deliveryOrderNumber: '',
    vendorCode: '',
    grDateFrom: '',
    grDateTo: '',
  }
  activeFilters.value = { ...filterForm.value }
  fetchData()
}

onMounted(() => {
  fetchData()
})
</script>

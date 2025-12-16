<template>
  <div>
    <Breadcrumb title="Receiving Confirmation Detail" :routes="routes" />
    <hr class="-mx-[24px] mb-[24px]" />

    <div class="border border-gray-200 rounded-xl p-[24px]">
      <!-- Header Section -->
      <div class="flex justify-between align-items-center mb-[24px]">
        <h1>LOAD SHEET : {{ loadSheetData.loadSheet }}</h1>
        <div class="flex gap-3">
          <button class="btn btn-danger" @click="printDocument()">
            <i class="ki-duotone ki-printer"></i>
            Print
          </button>
        </div>
      </div>

      <!-- Transporter Confirmation Card -->
      <div class="border border-gray-200 rounded-xl p-[24px] mb-[24px]">
        <h3 class="text-lg font-semibold mb-[16px]">Transporter Confirmation</h3>
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- Left Column - Form Fields -->
          <div class="lg:col-span-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <label class="form-label text-sm font-medium text-gray-600">Driver Name</label>
                <div class="text-gray-900 font-medium py-2">
                  {{ loadSheetData.driverName }}
                </div>
              </div>
              <div>
                <label class="form-label text-sm font-medium text-gray-600">Transporter</label>
                <div class="text-gray-900 font-medium py-2">
                  {{ loadSheetData.transporter }}
                </div>
              </div>
              <div>
                <label class="form-label text-sm font-medium text-gray-600">Distributor</label>
                <div class="text-gray-900 font-medium py-2">
                  {{ loadSheetData.distributor }}
                </div>
              </div>
              <div>
                <label class="form-label text-sm font-medium text-gray-600">Region From</label>
                <div class="text-gray-900 font-medium py-2">
                  {{ loadSheetData.regionFrom }}
                </div>
              </div>
              <div>
                <label class="form-label text-sm font-medium text-gray-600">Region To</label>
                <div class="text-gray-900 font-medium py-2">
                  {{ loadSheetData.regionTo }}
                </div>
              </div>
              <div>
                <label class="form-label text-sm font-medium text-gray-600">Arrival Date</label>
                <div class="text-gray-900 font-medium py-2">
                  {{ formatDate(loadSheetData.arrivalDate) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column - Signature Box -->
          <div class="lg:col-span-4">
            <label class="form-label text-sm font-medium text-gray-600">Driver Signature</label>
            <div class="border border-gray-300 rounded-lg p-4 mt-3 bg-gray-50">
              <!-- Signature Pad -->
              <VueSignature
                ref="signaturePad"
                :sigOption="signatureOptions"
                :w="'100%'"
                :h="'200px'"
                class="signature-pad"
              />

              <!-- Signature Actions -->
              <div class="flex gap-2 mt-3">
                <button class="btn btn-sm btn-light flex-1" @click="clearSignature">
                  <i class="ki-duotone ki-trash"></i>
                  Clear
                </button>
                <button class="btn btn-sm btn-primary flex-1" @click="saveSignature">
                  <i class="ki-duotone ki-check"></i>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Table Detail Section -->
      <div class="border border-gray-200 rounded-xl p-[24px]">
        <h3 class="text-lg font-semibold mb-[16px]">Detail Items</h3>

        <!-- Table Controls -->
        <div class="flex justify-between items-center mb-4">
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-700">Show</span>
            <select
              v-model="pageSize"
              class="form-select form-select-sm w-auto"
              @change="setPage(1)"
            >
              <option :value="5">5</option>
              <option :value="10">10</option>
              <option :value="25">25</option>
              <option :value="50">50</option>
            </select>
            <span class="text-sm text-gray-700">entries</span>
          </div>
          <div>
            <UiInputSearch v-model="searchTable" placeholder="Search" @keypress="handleSearch" />
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto list__table">
          <table class="table align-middle text-gray-700 font-medium text-sm">
            <thead>
              <tr>
                <th>Faktur</th>
                <th>SKU</th>
                <th>SKU Description</th>
                <th>Invoice Qty</th>
                <th>Received</th>
                <th>Discrepancy</th>
                <th>Remark</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="paginatedItems.length === 0">
                <td colspan="7" class="text-center">No data found.</td>
              </tr>
              <tr v-for="(item, index) in paginatedItems" :key="index">
                <td>{{ item.faktur }}</td>
                <td>{{ item.sku }}</td>
                <td>{{ item.skuDescription }}</td>
                <td>{{ item.invoiceQty }}</td>
                <td>{{ item.received }}</td>
                <td>
                  <span class="badge badge-outline" :class="getDiscrepancyBadge(item.discrepancy)">
                    {{ item.discrepancy }}
                  </span>
                </td>
                <td>{{ item.remark || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-between mt-[24px]">
          <p class="m-0 text-sm">
            Showing
            {{
              pageSize * currentPage > filteredItems.length
                ? filteredItems.length
                : pageSize * currentPage
            }}
            of {{ filteredItems.length }} entries
          </p>
          <LPagination
            :totalItems="filteredItems.length"
            :pageSize="pageSize"
            :currentPage="currentPage"
            @pageChange="setPage"
          />
        </div>
      </div>

      <!-- Back Button -->
      <div class="mt-[24px]">
        <button class="btn btn-light" @click="goBack()">
          <i class="ki-duotone ki-arrow-left"></i>
          Back to List
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { type routeTypes } from '@/core/type/components/breadcrumb'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import LPagination from '@/components/pagination/LPagination.vue'
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import VueSignature from 'vue3-signature'
import momentLib from 'moment'

const moment = momentLib
const router = useRouter()

interface DetailItem {
  faktur: string
  sku: string
  skuDescription: string
  invoiceQty: number
  received: number
  discrepancy: number
  remark: string
}

interface LoadSheetData {
  loadSheet: string
  driverName: string
  transporter: string
  distributor: string
  regionFrom: string
  regionTo: string
  arrivalDate: string
  signature: string | null
}

const routes = ref<routeTypes[]>([
  {
    name: 'Digital Receiving Confirmation',
    to: '/digital-receiving-confirmation',
  },
])

const searchTable = ref<string>('')
const currentPage = ref<number>(1)
const pageSize = ref<number>(10)
const signaturePad = ref<any>(null)

// Signature options
const signatureOptions = {
  penColor: '#000000',
  backgroundColor: '#ffffff',
}

// Dummy Load Sheet Data
const loadSheetData = ref<LoadSheetData>({
  loadSheet: 'LS-2024-001',
  driverName: 'Budi Santoso',
  transporter: 'PT Trans Jaya',
  distributor: 'PT Distributor A',
  regionFrom: 'Jakarta',
  regionTo: 'Bandung',
  arrivalDate: '2024-12-08',
  signature: null, // You can add signature image URL here
})

// Dummy Detail Items
const detailItems = ref<DetailItem[]>([
  {
    faktur: 'FKT-001',
    sku: 'SKU-001',
    skuDescription: 'Product A - Size M',
    invoiceQty: 100,
    received: 100,
    discrepancy: 0,
    remark: 'Complete',
  },
  {
    faktur: 'FKT-001',
    sku: 'SKU-002',
    skuDescription: 'Product B - Size L',
    invoiceQty: 50,
    received: 48,
    discrepancy: -2,
    remark: 'Minor shortage',
  },
  {
    faktur: 'FKT-002',
    sku: 'SKU-003',
    skuDescription: 'Product C - Size XL',
    invoiceQty: 75,
    received: 75,
    discrepancy: 0,
    remark: 'Complete',
  },
  {
    faktur: 'FKT-002',
    sku: 'SKU-004',
    skuDescription: 'Product D - Size S',
    invoiceQty: 120,
    received: 115,
    discrepancy: -5,
    remark: 'Damaged items',
  },
  {
    faktur: 'FKT-003',
    sku: 'SKU-005',
    skuDescription: 'Product E - Size M',
    invoiceQty: 80,
    received: 82,
    discrepancy: 2,
    remark: 'Excess delivery',
  },
  {
    faktur: 'FKT-003',
    sku: 'SKU-006',
    skuDescription: 'Product F - Size L',
    invoiceQty: 60,
    received: 60,
    discrepancy: 0,
    remark: 'Complete',
  },
  {
    faktur: 'FKT-004',
    sku: 'SKU-007',
    skuDescription: 'Product G - Size XL',
    invoiceQty: 90,
    received: 88,
    discrepancy: -2,
    remark: 'Minor shortage',
  },
  {
    faktur: 'FKT-004',
    sku: 'SKU-008',
    skuDescription: 'Product H - Size S',
    invoiceQty: 110,
    received: 110,
    discrepancy: 0,
    remark: 'Complete',
  },
])

const filteredItems = ref<DetailItem[]>([...detailItems.value])

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredItems.value.slice(start, end)
})

const formatDate = (date: string) => {
  return moment(date).format('DD MMMM YYYY')
}

const getDiscrepancyBadge = (discrepancy: number) => {
  if (discrepancy === 0) return 'badge-success'
  if (discrepancy > 0) return 'badge-info'
  return 'badge-danger'
}

const handleSearch = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    filterTableData()
  }
}

const filterTableData = () => {
  if (searchTable.value) {
    filteredItems.value = detailItems.value.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchTable.value.toLowerCase()),
      ),
    )
  } else {
    filteredItems.value = [...detailItems.value]
  }
  currentPage.value = 1
}

const setPage = (page: number) => {
  currentPage.value = page
}

const printDocument = () => {
  window.print()
}

const goBack = () => {
  router.push({ name: 'receivingConfirmation' })
}

const clearSignature = () => {
  if (signaturePad.value) {
    signaturePad.value.clear()
  }
}

const saveSignature = () => {
  if (signaturePad.value) {
    const { isEmpty, data } = signaturePad.value.save()
    if (!isEmpty) {
      // Save signature data (base64 image)
      loadSheetData.value.signature = data
      console.log('Signature saved:', data)
      // TODO: Send signature to API
      alert('Signature saved successfully!')
    } else {
      alert('Please draw a signature first')
    }
  }
}

onMounted(() => {
  // Load existing signature if available
  if (loadSheetData.value.signature && signaturePad.value) {
    signaturePad.value.fromDataURL(loadSheetData.value.signature)
  }
  // TODO: Load data based on route params
  // const id = route.params.id
  // Load actual data from API
})
</script>

<style lang="scss" scoped>
@media print {
  .btn,
  button {
    display: none;
  }
}

.form-control[readonly] {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.signature-pad {
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background: white;

  :deep(canvas) {
    border-radius: 0.5rem;
  }
}

.list__table {
  th,
  td {
    white-space: nowrap;
  }
}
</style>

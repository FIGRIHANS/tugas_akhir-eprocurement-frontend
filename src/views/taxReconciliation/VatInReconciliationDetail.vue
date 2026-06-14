<template>
  <div class="pb-20">
    <Breadcrumb title="VAT Reconciliation Detail" :routes="routes" />
    <hr class="-mx-[24px] mb-[24px]" />

    <!-- Loading -->
    <div
      v-if="isLoading"
      class="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-300"
    >
      <span class="loading loading-spinner loading-lg text-primary"></span>
      <p class="mt-4 text-gray-500 font-medium italic">Fetching tax record details...</p>
    </div>

    <!-- Not Found -->
    <div v-else-if="!detailData.nsfp" class="p-10 text-center bg-red-50 rounded-xl border border-red-100">
      <i class="ki-filled ki-information-2 text-4xl text-danger mb-4"></i>
      <h3 class="text-lg font-bold text-gray-800">Record Not Found</h3>
      <p class="text-gray-500 mb-6">The requested VAT reconciliation record could not be retrieved.</p>
      <button class="btn btn-primary" @click="goBack">
        <i class="ki-filled ki-arrow-left"></i>
        Back to List
      </button>
    </div>

    <!-- Content -->
    <div v-else class="space-y-6 animate-in fade-in duration-500">
      <!-- Status Overview Card -->
      <div class="card">
        <div class="card-body p-[24px]">
          <div class="flex flex-wrap items-start justify-between gap-6">

            <!-- Left: Info rows -->
            <div class="flex flex-col gap-[14px]">
              <div class="flex items-center gap-[10px]">
                <p class="font-normal text-sm text-gray-500 w-28 shrink-0">Match Status</p>
                <span :class="['badge px-3 py-1 text-sm font-bold', getMatchStatusBadgeClass(detailData.matchAPvsFP)]">
                  {{ detailData.matchAPvsFP || 'UNRECONCILED' }}
                </span>
              </div>
              <div v-if="detailData.nsfp" class="flex items-center gap-[10px]">
                <p class="font-normal text-sm text-gray-500 w-28 shrink-0">No. Faktur</p>
                <p class="font-bold text-sm text-primary">{{ detailData.nsfp }}</p>
              </div>
              <div v-if="detailData.invoiceNumber" class="flex items-center gap-[10px]">
                <p class="font-normal text-sm text-gray-500 w-28 shrink-0">Invoice No</p>
                <p class="font-semibold text-sm text-gray-800">{{ detailData.invoiceNumber }}</p>
              </div>
              <div v-if="detailData.creditStatus" class="flex items-center gap-[10px]">
                <p class="font-normal text-sm text-gray-500 w-28 shrink-0">Credit Status</p>
                <span :class="['badge px-2 py-0.5 text-xs font-semibold', getCreditStatusBadgeClass(detailData.creditStatus)]">
                  {{ detailData.creditStatus }}
                </span>
              </div>
            </div>


          </div>
        </div>
      </div>


      <!-- Main Layout -->
      <div class="flex flex-col lg:flex-row gap-[24px] items-start">
        <div class="flex-1 space-y-6">
          <!-- Section 1: Invoice Information -->
          <div class="card">
            <div class="card-header py-[17px] flex items-center justify-between gap-[8px]">
              <h3 class="card-title text-base font-semibold">Invoice Information</h3>
              <span
                :class="
                  detailData.poNumber && detailData.poNumber !== '-'
                    ? 'badge badge-light-primary px-2 font-semibold text-xs'
                    : 'badge badge-light-warning px-2 font-semibold text-xs'
                "
              >
                {{ detailData.poNumber && detailData.poNumber !== '-' ? 'PO' : 'Non-PO' }}
              </span>
            </div>
            <div class="card-body flex flex-col gap-[20px]">
              <div
                v-if="detailData.invoiceNumber"
                class="flex items-center justify-between gap-[10px]"
              >
                <p class="font-normal text-sm text-gray-600">Invoice Number</p>
                <p v-if="detailData.invoiceNumber === '-'" class="font-normal text-sm italic text-gray-400">Not matched to ERP</p>
                <p v-else class="font-normal text-sm font-semibold text-gray-800">{{ detailData.invoiceNumber }}</p>
              </div>
              <div
                v-if="detailData.poNumber"
                class="flex items-center justify-between gap-[10px]"
              >
                <p class="font-normal text-sm text-gray-600">PO Number</p>
                <p v-if="detailData.poNumber === '-'" class="font-normal text-sm italic text-gray-400">Not matched to ERP</p>
                <p v-else class="font-normal text-sm font-semibold text-gray-800">{{ detailData.poNumber }}</p>
              </div>
              <div
                v-if="detailData.tglInvoice"
                class="flex items-center justify-between gap-[10px]"
              >
                <p class="font-normal text-sm text-gray-600">Invoice Date</p>
                <p class="font-normal text-sm font-semibold text-gray-800">{{ formatDate(detailData.tglInvoice) }}</p>
              </div>
            </div>
          </div>

          <!-- Section 2: Tax Information -->
          <div class="card">
            <div class="card-header py-[17px] flex items-center justify-between gap-[8px]">
              <h3 class="card-title text-base font-semibold">Tax Information</h3>
            </div>
            <div class="card-body flex flex-col gap-[20px]">
              <div
                v-if="detailData.tglFP"
                class="flex items-center justify-between gap-[10px]"
              >
                <p class="font-normal text-sm text-gray-600">Tanggal FP</p>
                <p class="font-normal text-sm font-semibold text-gray-800">{{ formatDate(detailData.tglFP) }}</p>
              </div>
              <div
                v-if="detailData.statusFP"
                class="flex items-center justify-between gap-[10px]"
              >
                <p class="font-normal text-sm text-gray-600">Status FP</p>
                <span :class="getStatusFPBadgeClass(detailData.statusFP)">
                  {{ detailData.statusFP }}
                </span>
              </div>
            </div>
          </div>

          <!-- Section 3: Reconciliation Details -->
          <div class="card">
            <div class="card-header py-[17px] flex items-center justify-between gap-[8px]">
              <h3 class="card-title text-base font-semibold">Reconciliation Details</h3>
            </div>
            <div class="card-body flex flex-col gap-[20px]">
              <div
                v-if="detailData.matchAPvsFP"
                class="flex items-center justify-between gap-[10px]"
              >
                <p class="font-normal text-sm text-gray-600">Match AP vs FP</p>
                <span :class="getMatchStatusBadgeClass(detailData.matchAPvsFP)">
                  {{ detailData.matchAPvsFP }}
                </span>
              </div>
              <div
                v-if="detailData.creditStatus"
                class="flex items-center justify-between gap-[10px]"
              >
                <p class="font-normal text-sm text-gray-600">Credit Status</p>
                <span :class="getCreditStatusBadgeClass(detailData.creditStatus)">
                  {{ detailData.creditStatus }}
                </span>
              </div>
              <div
                v-if="detailData.masaPajakKredit"
                class="flex items-center justify-between gap-[10px]"
              >
                <p class="font-normal text-sm text-gray-600">Masa Pajak Kredit</p>
                <p class="font-normal text-sm font-semibold text-gray-800">{{ detailData.masaPajakKredit }}</p>
              </div>
              <div
                v-if="detailData.issue"
                class="flex items-center justify-between gap-[10px]"
              >
                <p class="font-normal text-sm text-gray-600">Issue</p>
                <p class="font-normal text-sm font-semibold text-danger">{{ detailData.issue }}</p>
              </div>
            </div>
          </div>

          <!-- Section 4: Remarks -->
          <div class="card">
            <div class="card-header py-[17px] flex items-center justify-between gap-[8px]">
              <h3 class="card-title text-base font-semibold">Remarks</h3>
            </div>
            <div class="card-body">
              <p class="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100 min-h-[80px]">
                {{ detailData.remarks || 'No remarks provided for this reconciliation record.' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Right Sidebar Panel -->
        <div class="w-full lg:max-w-sm space-y-6 lg:sticky lg:top-0">
          <!-- Tax Calculation Summary -->
          <div class="card">
            <div class="card-header py-[17px] flex items-center justify-between gap-[8px]">
              <h3 class="card-title text-base font-semibold">Tax Calculation</h3>
            </div>
            <div class="card-body flex flex-col gap-[20px]">
              <div class="flex items-center justify-between gap-[10px]">
                <p class="font-normal text-sm text-gray-600">Tax Base (DPP)</p>
                <p class="font-normal text-sm font-semibold text-gray-800">{{ formatCurrency(detailData.dpp || 0) }}</p>
              </div>
              <div class="flex items-center justify-between gap-[10px] border-t border-gray-100 pt-4">
                <p class="font-normal text-sm font-semibold text-danger">VAT (PPN)</p>
                <p class="font-bold text-base text-danger">{{ formatCurrency(detailData.ppn || 0) }}</p>
              </div>
              <div class="flex items-center justify-between gap-[10px] mt-2">
                <p class="font-normal text-sm text-gray-600">Total Gross Amount</p>
                <p class="font-normal text-sm font-semibold text-gray-800">{{ formatCurrency((detailData.dpp || 0) + (detailData.ppn || 0)) }}</p>
              </div>
            </div>
          </div>

          <!-- System Metadata Sidebar -->
          <div class="card">
            <div class="card-header py-[17px] flex items-center justify-between gap-[8px]">
              <h3 class="card-title text-base font-semibold">System Metadata</h3>
            </div>
            <div class="card-body flex flex-col gap-[20px]">
              <div v-if="detailData.nsfp" class="flex items-center justify-between gap-[10px]">
                <p class="font-normal text-sm text-gray-600">NSFP</p>
                <p class="font-normal text-sm text-gray-800 font-semibold">{{ detailData.nsfp }}</p>
              </div>
              <div v-if="detailData.npwpVendor" class="flex items-center justify-between gap-[10px]">
                <p class="font-normal text-sm text-gray-600">NPWP Vendor</p>
                <p class="font-normal text-sm font-semibold text-primary">{{ detailData.npwpVendor }}</p>
              </div>
              <div v-if="detailData.vendorName" class="flex items-center justify-between gap-[10px]">
                <p class="font-normal text-sm text-gray-600">Vendor Name</p>
                <p class="font-normal text-sm text-gray-800 font-semibold">{{ detailData.vendorName }}</p>
              </div>
              <div v-if="detailData.glAccount" class="flex items-center justify-between gap-[10px]">
                <p class="font-normal text-sm text-gray-600">GL Account</p>
                <p v-if="detailData.glAccount === '-'" class="font-normal text-sm italic text-gray-400">Not matched to ERP</p>
                <p v-else class="font-normal text-sm text-gray-800 font-semibold">{{ detailData.glAccount }}</p>
              </div>
              <div v-if="detailData.costCenter" class="flex items-center justify-between gap-[10px]">
                <p class="font-normal text-sm text-gray-600">Cost Center</p>
                <p v-if="detailData.costCenter === '-'" class="font-normal text-sm italic text-gray-400">Not matched to ERP</p>
                <p v-else class="font-normal text-sm text-gray-800 font-semibold">{{ detailData.costCenter }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Buttons -->
      <div class="pt-8 border-t border-gray-200 flex items-center justify-between">
        <button
          class="btn btn-outline btn-primary shadow-sm"
          @click="goBack"
        >
          <i class="ki-filled ki-arrow-left"></i> Back to List
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { type routeTypes } from '@/core/type/components/breadcrumb'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import momentLib from 'moment'
import vatApi from '@/core/utils/vatApi'

const moment = momentLib
const router = useRouter()
const route = useRoute()
const isLoading = ref<boolean>(false)

const routes = ref<routeTypes[]>([
  {
    name: 'Tax Reconciliation',
    to: '/tax-reconciliation',
  },
  {
    name: 'VAT Reconciliation',
    to: '/vat-reconciliation',
  },
  {
    name: 'Detail',
    to: '#',
  },
])

const detailData = ref({
  npwpVendor: '',
  vendorName: '',
  tglInvoice: '',
  tglFP: '',
  nsfp: '',
  dpp: 0,
  ppn: 0,
  statusFP: '',
  matchAPvsFP: '',
  creditStatus: '',
  masaPajakKredit: '',
  issue: '',
  remarks: '',
  invoiceNumber: '',
  poNumber: '',
  glAccount: '',
  costCenter: '',
})

// ── Computed ───────────────────────────────────────────────────────────
const statusColorClass = computed(() => {
  const s = (detailData.value.matchAPvsFP || '').toUpperCase()
  if (s === 'MATCH') return 'bg-success font-bold text-white'
  if (s.includes('MISMATCH')) return 'bg-danger font-bold text-white'
  return 'bg-gray-500 text-white'
})

const statusIcon = computed(() => {
  const s = (detailData.value.matchAPvsFP || '').toUpperCase()
  if (s === 'MATCH') return 'ki-check-circle'
  if (s.includes('MISMATCH')) return 'ki-cross-circle'
  return 'ki-information-2'
})

// ── Helpers ────────────────────────────────────────────────────────────
const formatDate = (date: string) => {
  if (!date) return '-'
  const m = moment(date)
  return m.isValid() ? m.format('DD/MM/YYYY') : '-'
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

const getStatusFPBadgeClass = (status: string) => {
  if (status === 'Valid' || status === 'Approved') return 'badge badge-success text-white font-bold'
  if (status === 'Invalid' || status === 'Rejected') return 'badge badge-light-danger font-bold text-danger'
  return 'badge badge-light font-bold text-gray-700'
}

const getMatchStatusBadgeClass = (status: string) => {
  if (status === 'Match') return 'badge badge-success text-white font-bold'
  if (status && status.includes('Mismatch')) return 'badge badge-light-danger font-bold text-danger'
  return 'badge badge-light font-bold text-gray-700'
}

const getCreditStatusBadgeClass = (status: string) => {
  const s = (status || '').toUpperCase()
  if (s === 'CREDITABLE' || s === 'CREDITED') return 'badge badge-success text-white font-bold'
  if (s === 'NOT CREDITABLE' || s === 'INVALID') return 'badge badge-light-danger font-bold text-danger'
  if (s === 'HOLD' || s === 'UNCREDITED') return 'badge badge-light font-bold text-gray-700'
  return 'badge badge-light font-bold text-gray-700'
}

const goBack = () => {
  router.back()
}


// ── Data Fetch ─────────────────────────────────────────────────────────
const fetchDetail = async () => {
  isLoading.value = true
  try {
    const targetNo = route.params.id as string
    
    // First try session storage (works for both ERP and Pajak Express sources)
    const stored = sessionStorage.getItem('vatIn_detail_item')
    let found = null
    
    if (stored) {
      const parsed = JSON.parse(stored)
      // Check if it matches the ID
      if (parsed.noFakturPajak === targetNo || parsed.NoFakturPajak === targetNo || targetNo === '0') {
        found = parsed
      }
    }
    
    // Fallback to API if not in session storage
    if (!found) {
      const response = await vatApi.get('/vat/vat-reconciliation')
      const rawList = response.data.result?.content || []
      found = rawList.find((row: any) => 
        row.noFakturPajak === targetNo || 
        row.NoFakturPajak === targetNo
      )
    }

    if (found) {
      detailData.value.npwpVendor = found.npwpVendor || found.NpwpVendor || ''
      detailData.value.vendorName = found.vendorName || found.VendorName || ''
      detailData.value.tglInvoice = found.tglFakturPajak || found.TglFakturPajak || ''
      detailData.value.tglFP = found.tglFakturPajak || found.TglFakturPajak || ''
      detailData.value.nsfp = found.noFakturPajak || found.NoFakturPajak || ''
      detailData.value.dpp = found.dpp || found.Dpp || 0
      detailData.value.ppn = found.ppn || found.Ppn || 0
      detailData.value.statusFP = found.statusFp || found.StatusFp || ''
      detailData.value.matchAPvsFP = found.statusApVsFp || found.StatusApVsFp || ''
      detailData.value.creditStatus = found.creditStatus || found.CreditStatus || 'UNCREDITED'
      detailData.value.remarks = found.remark || found.Remark || ''
      
      // Auto-extract additional information if available
      detailData.value.invoiceNumber = found.invoiceNo || found.InvoiceNo || found.invoiceNumber || '-'
      detailData.value.poNumber = found.poNumber || found.PoNumber || '-'
      detailData.value.glAccount = found.glAccount || found.GlAccount || '-'
      detailData.value.costCenter = found.costCenter || found.CostCenter || '-'
    }
  } catch (error) {
    console.error('Error fetching VAT reconciliation details:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchDetail()
})
</script>

<style scoped>
.badge-light-primary {
  background-color: #f1faff;
  color: #009ef7;
}
.badge-light-warning {
  background-color: #fff8dd;
  color: #ffc700;
}
.badge-light-danger {
  background-color: #fff5f8;
  color: #f1416c;
}
.badge-light {
  background-color: #f9f9f9;
  color: #7e8299;
}
.badge-outline {
  border: 1px solid currentColor;
  background-color: transparent;
}
</style>

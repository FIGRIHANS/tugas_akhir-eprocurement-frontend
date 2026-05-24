<template>
  <div>
    <Breadcrumb title="VAT Reconciliation Detail" :routes="routes" />
    <hr class="-mx-[24px] mb-[24px]" />

    <div class="border border-gray-200 rounded-xl p-[24px]">
      <!-- Header Section -->
      <div class="flex justify-between items-center mb-[24px]">
        <h1 class="text-2xl font-bold text-gray-800">VAT Reconciliation Detail</h1>
        <div class="flex gap-3">
          <button class="btn btn-light" @click="goBack">
            <i class="ki-duotone ki-arrow-left"></i>
            Back
          </button>
          <button class="btn btn-primary">
            <i class="ki-duotone ki-file-down"></i>
            Export
          </button>
        </div>
      </div>

      <!-- Invoice Information Section -->
      <div class="border border-gray-200 rounded-xl p-[24px] mb-[24px]">
        <h3 class="text-lg font-semibold mb-4">Invoice Information</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
          <!-- Left Column -->
          <div class="space-y-3">
            <div class="flex items-center gap-3">
              <label class="form-label text-sm font-medium text-gray-600 w-36 mb-0"
                >Invoice Number</label
              >
              <input
                v-model="detailData.invoiceNumber"
                type="text"
                class="input flex-1 bg-gray-50"
                disabled
              />
            </div>

            <div class="flex items-center gap-3">
              <label class="form-label text-sm font-medium text-gray-600 w-36 mb-0"
                >PO Number</label
              >
              <input
                v-model="detailData.poNumber"
                type="text"
                class="input flex-1 bg-gray-50"
                disabled
              />
            </div>

            <div class="flex items-center gap-3">
              <label class="form-label text-sm font-medium text-gray-600 w-36 mb-0"
                >Invoice Date</label
              >
              <input
                :value="formatDate(detailData.tglInvoice)"
                type="text"
                class="input flex-1 bg-gray-50"
                disabled
              />
            </div>

            <div class="flex items-center gap-3">
              <label class="form-label text-sm font-medium text-gray-600 w-36 mb-0"
                >NPWP Vendor</label
              >
              <input
                v-model="detailData.npwpVendor"
                type="text"
                class="input flex-1 bg-gray-50"
                disabled
              />
            </div>
          </div>

          <!-- Right Column -->
          <div class="space-y-3">
            <div class="flex items-center gap-3">
              <label class="form-label text-sm font-medium text-gray-600 w-36 mb-0"
                >Vendor Name</label
              >
              <input
                v-model="detailData.vendorName"
                type="text"
                class="input flex-1 bg-gray-50"
                disabled
              />
            </div>

            <div class="flex items-center gap-3">
              <label class="form-label text-sm font-medium text-gray-600 w-36 mb-0"
                >GL Account</label
              >
              <input
                v-model="detailData.glAccount"
                type="text"
                class="input flex-1 bg-gray-50"
                disabled
              />
            </div>

            <div class="flex items-center gap-3">
              <label class="form-label text-sm font-medium text-gray-600 w-36 mb-0"
                >Cost Center</label
              >
              <input
                v-model="detailData.costCenter"
                type="text"
                class="input flex-1 bg-gray-50"
                disabled
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Tax Information Section -->
      <div class="border border-gray-200 rounded-xl p-[24px] mb-[24px]">
        <h3 class="text-lg font-semibold mb-4">Tax Information</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
          <!-- Left Column -->
          <div class="space-y-3">
            <div class="flex items-center gap-3">
              <label class="form-label text-sm font-medium text-gray-600 w-36 mb-0">NSFP</label>
              <input
                v-model="detailData.nsfp"
                type="text"
                class="input flex-1 bg-gray-50"
                disabled
              />
            </div>

            <div class="flex items-center gap-3">
              <label class="form-label text-sm font-medium text-gray-600 w-36 mb-0"
                >Tanggal FP</label
              >
              <input
                :value="formatDate(detailData.tglFP)"
                type="text"
                class="input flex-1 bg-gray-50"
                disabled
              />
            </div>

            <div class="flex items-center gap-3">
              <label class="form-label text-sm font-medium text-gray-600 w-36 mb-0">DPP</label>
              <input
                :value="formatCurrency(detailData.dpp)"
                type="text"
                class="input flex-1 bg-gray-50"
                disabled
              />
            </div>
          </div>

          <!-- Right Column -->
          <div class="space-y-3">
            <div class="flex items-center gap-3">
              <label class="form-label text-sm font-medium text-gray-600 w-36 mb-0">PPN</label>
              <input
                :value="formatCurrency(detailData.ppn)"
                type="text"
                class="input flex-1 bg-gray-50"
                disabled
              />
            </div>

            <div class="flex items-center gap-3">
              <label class="form-label text-sm font-medium text-gray-600 w-36 mb-0"
                >Status FP</label
              >
              <div class="flex-1">
                <span class="badge" :class="getStatusFPBadgeClass(detailData.statusFP)">
                  {{ detailData.statusFP }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Reconciliation Status Section -->
      <div class="border border-gray-200 rounded-xl p-[24px] mb-[24px]">
        <h3 class="text-lg font-semibold mb-4">Reconciliation Status</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
          <!-- Left Column -->
          <div class="space-y-3">
            <div class="flex items-center gap-3">
              <label class="form-label text-sm font-medium text-gray-600 w-36 mb-0"
                >Match AP vs FP</label
              >
              <div class="flex-1">
                <span class="badge" :class="getMatchStatusBadgeClass(detailData.matchAPvsFP)">
                  {{ detailData.matchAPvsFP }}
                </span>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <label class="form-label text-sm font-medium text-gray-600 w-36 mb-0"
                >Credit Status</label
              >
              <div class="flex-1">
                <span class="badge" :class="getCreditStatusBadgeClass(detailData.creditStatus)">
                  {{ detailData.creditStatus }}
                </span>
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div class="space-y-3">
            <div class="flex items-center gap-3">
              <label class="form-label text-sm font-medium text-gray-600 w-36 mb-0"
                >Masa Pajak Kredit</label
              >
              <input
                v-model="detailData.masaPajakKredit"
                type="text"
                class="input flex-1 bg-gray-50"
                disabled
              />
            </div>

            <div class="flex items-center gap-3">
              <label class="form-label text-sm font-medium text-gray-600 w-36 mb-0">Issue</label>
              <input
                :value="detailData.issue || '-'"
                type="text"
                class="input flex-1 bg-gray-50"
                disabled
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Remarks Section -->
      <div class="border border-gray-200 rounded-xl p-[24px] mb-[24px]">
        <h3 class="text-lg font-semibold mb-4">Remarks</h3>
        <textarea
          v-model="detailData.remarks"
          class="textarea w-full bg-gray-50"
          rows="3"
          disabled
        ></textarea>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end gap-3 pt-6 border-t border-gray-200">
        <button class="btn btn-light">
          <i class="ki-duotone ki-trash"></i>
          Delete
        </button>
        <button class="btn btn-primary">
          <i class="ki-duotone ki-pencil"></i>
          Edit
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
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
  if (status === 'Valid' || status === 'Approved') return 'badge-success'
  if (status === 'Invalid' || status === 'Rejected') return 'badge-danger'
  return 'badge-secondary'
}

const getMatchStatusBadgeClass = (status: string) => {
  if (status === 'Match') return 'badge-success'
  if (status && status.includes('Mismatch')) return 'badge-danger'
  return 'badge-secondary'
}

const getCreditStatusBadgeClass = (status: string) => {
  if (status === 'Creditable' || status === 'CREDITED') return 'badge-success'
  if (status === 'Not Creditable' || status === 'INVALID') return 'badge-danger'
  if (status === 'Hold' || status === 'UNCREDITED') return 'badge-secondary'
  return 'badge-secondary'
}

const goBack = () => {
  router.push('/vat-reconciliation')
}

const fetchDetail = async () => {
  isLoading.value = true
  try {
    const response = await vatApi.get('/vat/vat-reconciliation')
    const rawList = response.data.result?.content || []
    const targetNo = route.params.id as string
    
    const found = rawList.find((row: any) => 
      row.noFakturPajak === targetNo || 
      row.NoFakturPajak === targetNo
    )

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

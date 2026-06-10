<template>
  <div class="pb-20">
    <Breadcrumb title="Tax Invoice Detail" :routes="routes" />
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
    <div v-else-if="!selectedRow" class="p-10 text-center bg-red-50 rounded-xl border border-red-100">
      <i class="ki-filled ki-information-2 text-4xl text-danger mb-4"></i>
      <h3 class="text-lg font-bold text-gray-800">Record Not Found</h3>
      <p class="text-gray-500 mb-6">The requested VAT Out invoice could not be retrieved.</p>
      <button class="btn btn-primary" @click="goBack">
        <i class="ki-filled ki-arrow-left"></i>
        Return to List
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
                <p class="font-normal text-sm text-gray-500 w-28 shrink-0">Status</p>
                <span :class="['badge px-3 py-1 text-sm font-bold', statusBadgeClass]">
                  {{ selectedRow.statusfaktur || 'NO STATUS' }}
                </span>
              </div>
              <div v-if="selectedRow.nomorfaktur" class="flex items-center gap-[10px]">
                <p class="font-normal text-sm text-gray-500 w-28 shrink-0">Invoice No.</p>
                <p class="font-bold text-sm text-primary">{{ selectedRow.nomorfaktur }}</p>
              </div>
              <div class="flex items-center gap-[10px]">
                <p class="font-normal text-sm text-gray-500 w-28 shrink-0">Tax Type</p>
                <p class="font-semibold text-sm text-gray-800">VAT Out (Pajak Luaran)</p>
              </div>
              <div v-if="selectedRow.tanggalfaktur" class="flex items-center gap-[10px]">
                <p class="font-normal text-sm text-gray-500 w-28 shrink-0">Invoice Date</p>
                <p class="font-normal text-sm text-gray-800">{{ formatDate(selectedRow.tanggalfaktur) }}</p>
              </div>
            </div>

            <!-- Right: Action Buttons -->
            <div class="flex flex-col gap-2 items-end">
              <template v-if="selectedRow.statusfaktur === 'DRAFT'">
                <button class="btn btn-primary w-full" @click="handleUpload">
                  <i class="ki-filled ki-cloud-change"></i> Upload to DJP
                </button>
                <button class="btn btn-danger w-full" @click="handleDelete">
                  <i class="ki-filled ki-trash"></i> Delete Draft
                </button>
              </template>
            </div>

          </div>
        </div>
      </div>

      <!-- Main Layout -->
      <div class="flex flex-col lg:flex-row gap-[24px] items-start">

        <!-- LEFT COLUMN -->
        <div class="flex-1 space-y-6">

          <!-- Section 1: Buyer Information -->
          <div class="card">
            <div class="card-header py-[17px] flex items-center justify-between gap-[8px]">
              <h3 class="card-title text-base font-semibold">Buyer Information</h3>
            </div>
            <div class="card-body flex flex-col gap-[20px]">
              <div class="flex items-center justify-between gap-[10px]">
                <p class="font-normal text-sm text-gray-600">Buyer Name</p>
                <p class="font-normal text-sm font-semibold text-gray-800">{{ selectedRow.namapembeli || '-' }}</p>
              </div>
              <div class="flex items-center justify-between gap-[10px]">
                <p class="font-normal text-sm text-gray-600">NPWP / NIK</p>
                <p class="font-normal text-sm font-semibold text-primary">{{ selectedRow.npwppembeli || '-' }}</p>
              </div>
              <div class="flex items-center justify-between gap-[10px]">
                <p class="font-normal text-sm text-gray-600">Address</p>
                <p class="font-normal text-sm text-gray-800 max-w-sm text-right leading-relaxed">{{ selectedRow.alamatpembeli || '-' }}</p>
              </div>
            </div>
          </div>

          <!-- Section 2: Seller Information -->
          <div class="card">
            <div class="card-header py-[17px] flex items-center justify-between gap-[8px]">
              <h3 class="card-title text-base font-semibold">Seller Information</h3>
            </div>
            <div class="card-body flex flex-col gap-[20px]">
              <div class="flex items-center justify-between gap-[10px]">
                <p class="font-normal text-sm text-gray-600">Seller Name</p>
                <p class="font-normal text-sm font-semibold text-gray-800">{{ selectedRow.namatokopenjual || '-' }}</p>
              </div>
              <div class="flex items-center justify-between gap-[10px]">
                <p class="font-normal text-sm text-gray-600">NPWP Seller</p>
                <p class="font-normal text-sm font-semibold text-primary">{{ selectedRow.npwppenjual || '-' }}</p>
              </div>
            </div>
          </div>

        </div>

        <!-- RIGHT COLUMN: Sidebar -->
        <div class="w-full lg:max-w-sm space-y-6 lg:sticky lg:top-0">

          <!-- Tax Calculation -->
          <div class="card">
            <div class="card-header py-[17px] flex items-center justify-between gap-[8px]">
              <h3 class="card-title text-base font-semibold">Tax Calculation</h3>
            </div>
            <div class="card-body flex flex-col gap-[20px]">
              <div class="flex items-center justify-between gap-[10px]">
                <p class="font-normal text-sm text-gray-600">Tax Base (DPP)</p>
                <p class="font-normal text-sm font-semibold text-gray-800">{{ formatCurrency(selectedRow.totaldpp) }}</p>
              </div>
              <div class="flex items-center justify-between gap-[10px] border-t border-gray-100 pt-4">
                <p class="font-normal text-sm font-semibold text-danger">VAT (PPN)</p>
                <p class="font-bold text-base text-danger">{{ formatCurrency(selectedRow.totalppn) }}</p>
              </div>
            </div>
          </div>

          <!-- System Metadata -->
          <div class="card">
            <div class="card-header py-[17px] flex items-center justify-between gap-[8px]">
              <h3 class="card-title text-base font-semibold">System Metadata</h3>
            </div>
            <div class="card-body flex flex-col gap-[20px]">
              <div class="flex items-center justify-between gap-[10px]">
                <p class="font-normal text-sm text-gray-600">Local DB ID</p>
                <p class="font-normal text-sm font-semibold text-gray-800"># {{ selectedRow.id || '-' }}</p>
              </div>
              <div class="flex items-center justify-between gap-[10px]">
                <p class="font-normal text-sm text-gray-600">Reference</p>
                <p class="font-normal text-sm text-gray-800">{{ selectedRow.referensi || '-' }}</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- Footer -->
      <div class="pt-8 border-t border-gray-200 flex items-center justify-between">
        <button class="btn btn-outline btn-primary shadow-sm" @click="goBack">
          <i class="ki-filled ki-arrow-left"></i>
          Back to List
        </button>
        <div class="flex gap-2">
          <template v-if="selectedRow.statusfaktur === 'DRAFT'">
            <button class="btn btn-primary" @click="handleUpload">
              <i class="ki-filled ki-cloud-change"></i> Upload to DJP
            </button>
          </template>
          <template v-if="selectedRow.statusfaktur === 'APPROVED'">
            <button class="btn btn-danger" @click="handleCancel">
              <i class="ki-filled ki-cross-circle"></i> Cancel Invoice
            </button>
          </template>
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { type routeTypes } from '@/core/type/components/breadcrumb'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import { getVatOutList } from '@/core/utils/vatPxInvoiceApi'
import Swal from 'sweetalert2'

const router = useRouter()
const route = useRoute()
const isLoading = ref<boolean>(false)
const selectedRow = ref<any>(null)
const vendorNpwp = '1091031210969728'

const routes = ref<routeTypes[]>([
  { name: 'Tax Reconciliation', to: '/tax-reconciliation' },
  { name: 'VAT (Pajak Luaran)', to: '/vat-out-reconciliation' },
  { name: 'Detail', to: '#' },
])

const statusBadgeClass = computed(() => {
  if (!selectedRow.value) return 'badge-light'
  const s = (selectedRow.value.statusfaktur || '').toUpperCase()
  if (s === 'DRAFT') return 'badge-light-primary'
  if (s === 'APPROVED' || s === 'Valid') return 'badge-success text-white'
  if (s === 'CANCELED') return 'badge-light-danger'
  return 'badge-light'
})

const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return dateString
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

const formatCurrency = (amount: number) => {
  const num = Number(amount) || 0
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(num)
}

const goBack = () => {
  router.push('/vat-out-reconciliation')
}

const handleUpload = () => {
  Swal.fire({
    title: 'Upload to DJP',
    text: 'This will submit the draft invoice to DJP.',
    icon: 'info',
    confirmButtonText: 'OK'
  })
}

const handleDelete = () => {
  Swal.fire({
    title: 'Delete Draft',
    text: 'This will delete the draft invoice.',
    icon: 'error',
    confirmButtonText: 'OK'
  })
}

const handleCancel = () => {
  Swal.fire({
    title: 'Cancel Invoice',
    text: 'This will officially cancel the tax invoice.',
    icon: 'warning',
    confirmButtonText: 'OK'
  })
}

const fetchDetail = async () => {
  isLoading.value = true
  try {
    const response = await getVatOutList(vendorNpwp, { page: 1, limit: 100 })
    const payload = response.data?.result?.content || response.data?.result || response.data
    const list = payload?.data || []

    const targetId = route.params.id as string
    selectedRow.value = list.find((item: any) => item.id == targetId)
  } catch (error) {
    console.error('Error fetching VAT out details:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchDetail()
})
</script>

<style scoped>
.text-danger { color: #f1416c; }
</style>

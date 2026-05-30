<template>
  <div class="pb-20">
    <Breadcrumb title="WHT - Unifikasi (BPU) Detail" :routes="routes" />
    <hr class="-mx-[24px] mb-[24px]" />

    <!-- Loading -->
    <div
      v-if="loading"
      class="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-300"
    >
      <span class="loading loading-spinner loading-lg text-primary"></span>
      <p class="mt-4 text-gray-500 font-medium italic">Fetching tax record details...</p>
    </div>

    <!-- Not Found -->
    <div v-else-if="!item" class="p-10 text-center bg-red-50 rounded-xl border border-red-100">
      <i class="ki-filled ki-information-2 text-4xl text-danger mb-4"></i>
      <h3 class="text-lg font-bold text-gray-800">Record Not Found</h3>
      <p class="text-gray-500 mb-6">The requested BPU record could not be retrieved.</p>
      <button class="btn btn-primary" @click="router.push('/wht-unifikasi')">
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
                <p class="font-normal text-sm text-gray-500 w-28 shrink-0">Status</p>
                <span :class="['badge px-3 py-1 text-sm font-bold', statusBadgeClass]">
                  {{ item.status || item.fgStatus || 'NO STATUS' }}
                </span>
              </div>
              <div v-if="item.nomorBuktiPotong || item.noBupot" class="flex items-center gap-[10px]">
                <p class="font-normal text-sm text-gray-500 w-28 shrink-0">No. Bupot</p>
                <p class="font-bold text-sm text-primary">{{ item.nomorBuktiPotong || item.noBupot }}</p>
              </div>
              <div class="flex items-center gap-[10px]">
                <p class="font-normal text-sm text-gray-500 w-28 shrink-0">Tax Type</p>
                <p class="font-semibold text-sm text-gray-800">WHT — Unifikasi (BPU)</p>
              </div>
              <div v-if="item.masaPajak || item.tahunPajak" class="flex items-center gap-[10px]">
                <p class="font-normal text-sm text-gray-500 w-28 shrink-0">Tax Period</p>
                <p class="font-semibold text-sm text-gray-800">{{ item.masaPajak }} / {{ item.tahunPajak }}</p>
              </div>
              <div v-if="item.errorMsg" class="flex items-start gap-[10px]">
                <p class="font-normal text-sm text-gray-500 w-28 shrink-0">Error</p>
                <p class="text-xs text-danger font-medium leading-relaxed">{{ item.errorMsg }}</p>
              </div>
            </div>

            <!-- Right: Action Buttons -->
            <div class="flex flex-col gap-2 items-end">
              <template v-if="(item.status || item.fgStatus)?.toUpperCase() === 'DRAFT'">
                <button class="btn btn-primary w-full" @click="showUploadConfirmModal = true">
                  <i class="ki-filled ki-cloud-change"></i> Upload to DJP
                </button>
              </template>
              <template v-if="isInProgress(item.status || item.fgStatus)">
                <button class="btn btn-warning w-full" :disabled="submitting" @click="handleVerify">
                  <span v-if="submitting" class="loading loading-spinner loading-xs"></span>
                  <i v-else class="ki-filled ki-arrow-circle-right"></i> Verify Status
                </button>
              </template>
              <template v-if="(item.status || item.fgStatus)?.toUpperCase() === 'NORMAL-DONE'">
                <button class="btn btn-danger w-full" @click="handleBatal" :disabled="submitting">
                  <i class="ki-filled ki-cross-circle"></i> Cancel Bupot
                </button>
              </template>
            </div>

          </div>
        </div>
      </div>

      <!-- Main Layout -->
      <div class="flex flex-col lg:flex-row gap-[24px] items-start">
        <div class="flex-1 space-y-6">
          <!-- Section 1: Recipient Information -->
          <div class="card">
            <div class="card-header py-[17px] flex items-center justify-between gap-[8px]">
              <h3 class="card-title text-base font-semibold">Recipient Information</h3>
            </div>
            <div class="card-body flex flex-col gap-[20px]">
              <div
                v-if="item.namaPenerima || item.nama"
                class="flex items-center justify-between gap-[10px]"
              >
                <p class="font-normal text-sm text-gray-600">Recipient Name</p>
                <p class="font-normal text-sm font-semibold text-gray-800">{{ item.namaPenerima || item.nama }}</p>
              </div>
              <div
                v-if="item.npwpPenerima || item.npwp"
                class="flex items-center justify-between gap-[10px]"
              >
                <p class="font-normal text-sm text-gray-600">NPWP / NIK</p>
                <p class="font-normal text-sm font-semibold text-primary">{{ item.npwpPenerima || item.npwp }}</p>
              </div>
              <div
                v-if="item.alamatPenerima"
                class="flex items-center justify-between gap-[10px]"
              >
                <p class="font-normal text-sm text-gray-600">Address</p>
                <p class="font-normal text-sm text-gray-700">{{ item.alamatPenerima }}</p>
              </div>
            </div>
          </div>

          <!-- Section 2: Financial & Tax Details -->
          <div class="card">
            <div class="card-header py-[17px] flex items-center justify-between gap-[8px]">
              <h3 class="card-title text-base font-semibold">Financial & Tax Details</h3>
            </div>
            <div class="card-body flex flex-col gap-[20px]">
              <div
                v-if="item.kodeObjekPajak"
                class="flex items-center justify-between gap-[10px]"
              >
                <p class="font-normal text-sm text-gray-600">Object Code</p>
                <p class="font-normal text-sm font-semibold text-gray-800">{{ item.kodeObjekPajak }}</p>
              </div>
              <div
                v-if="item.tglPemotongan"
                class="flex items-center justify-between gap-[10px]"
              >
                <p class="font-normal text-sm text-gray-600">Withholding Date</p>
                <p class="font-normal text-sm text-gray-800">{{ item.tglPemotongan }}</p>
              </div>
              <div
                v-if="item.pasalPPh"
                class="flex items-center justify-between gap-[10px]"
              >
                <p class="font-normal text-sm text-gray-600">Pasal PPh</p>
                <p class="font-normal text-sm text-gray-800">{{ item.pasalPPh }}</p>
              </div>
              <div
                v-if="item.statusPPh"
                class="flex items-center justify-between gap-[10px]"
              >
                <p class="font-normal text-sm text-gray-600">Status PPh</p>
                <p class="font-normal text-sm text-gray-800">{{ item.statusPPh }}</p>
              </div>
              <div
                v-if="item.masaPajak"
                class="flex items-center justify-between gap-[10px]"
              >
                <p class="font-normal text-sm text-gray-600">Tax Period</p>
                <p class="font-normal text-sm text-gray-800">{{ item.masaPajak }}</p>
              </div>
              <div
                v-if="item.tahunPajak"
                class="flex items-center justify-between gap-[10px]"
              >
                <p class="font-normal text-sm text-gray-600">Tax Year</p>
                <p class="font-normal text-sm text-gray-800">{{ item.tahunPajak }}</p>
              </div>
            </div>
          </div>

          <!-- Section 3: Classification (only if any field exists) -->
          <div
            v-if="item.kap || item.kjs || item.glAccount || item.idTku"
            class="card"
          >
            <div class="card-header py-[17px] flex items-center justify-between gap-[8px]">
              <h3 class="card-title text-base font-semibold">Classification & Payments</h3>
            </div>
            <div class="card-body flex flex-col gap-[20px]">
              <div
                v-if="item.kap"
                class="flex items-center justify-between gap-[10px]"
              >
                <p class="font-normal text-sm text-gray-600">KAP Code</p>
                <p class="font-normal text-sm text-gray-800">{{ item.kap }}</p>
              </div>
              <div
                v-if="item.kjs"
                class="flex items-center justify-between gap-[10px]"
              >
                <p class="font-normal text-sm text-gray-600">KJS Code</p>
                <p class="font-normal text-sm text-gray-800">{{ item.kjs }}</p>
              </div>
              <div
                v-if="item.glAccount"
                class="flex items-center justify-between gap-[10px]"
              >
                <p class="font-normal text-sm text-gray-600">GL Account</p>
                <p class="font-normal text-sm text-gray-800">{{ item.glAccount }}</p>
              </div>
              <div
                v-if="item.idTku"
                class="flex items-center justify-between gap-[10px]"
              >
                <p class="font-normal text-sm text-gray-600">Unit/TKU ID</p>
                <p class="font-normal text-sm text-gray-800">{{ item.idTku }}</p>
              </div>
            </div>
          </div>

          <!-- Section 4: Reference Documents -->
          <div
            v-if="item.dokReferensi && item.dokReferensi.length > 0"
            class="card p-[20px] shadow-sm"
          >
            <h3 class="text-lg font-semibold mb-[16px]">Reference Documents</h3>
            <div class="overflow-hidden border border-gray-100 rounded-lg">
              <table class="table table-auto w-full text-xs">
                <thead class="bg-gray-100/50 border-b border-gray-100 text-xs font-semibold text-gray-600">
                  <tr>
                    <th class="py-3 px-4 text-left font-medium">Document Type</th>
                    <th class="py-3 px-4 text-left font-medium">Document Number</th>
                    <th class="py-3 px-4 text-left font-medium">Date</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                  <tr v-for="(doc, idx) in item.dokReferensi" :key="idx" class="hover:bg-gray-50">
                    <td class="py-3 px-4 font-medium">{{ doc.dokReferensi }}</td>
                    <td class="py-3 px-4 font-bold text-primary">{{ doc.nomorDokumen }}</td>
                    <td class="py-3 px-4 text-gray-500">{{ doc.tanggal_Dokumen }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Right Panel -->
        <div class="w-full lg:max-w-sm space-y-6 lg:sticky lg:top-0">
          <!-- Tax Summary -->
          <div class="card">
            <div class="card-header py-[17px] flex items-center justify-between gap-[8px]">
              <h3 class="card-title text-base font-semibold">Tax Calculation</h3>
            </div>
            <div class="card-body flex flex-col gap-[20px]">
              <div class="flex items-center justify-between gap-[10px]">
                <p class="font-normal text-sm text-gray-600">Tax Base (DPP)</p>
                <p class="font-normal text-sm font-semibold text-gray-800">{{ formatCurrency(item.dpp || 0) }}</p>
              </div>
              <div class="flex items-center justify-between gap-[10px]">
                <p class="font-normal text-sm text-gray-600">Tax Rate</p>
                <p class="font-normal text-sm font-semibold text-gray-800">{{ item.tarif || 0 }}%</p>
              </div>
              <div class="flex items-center justify-between gap-[10px]">
                <p class="font-normal text-sm text-gray-600">Withheld PPh</p>
                <p class="font-normal text-sm font-semibold text-danger">{{ formatCurrency(item.pphDipotong || 0) }}</p>
              </div>
            </div>
          </div>

          <!-- System Metadata -->
          <div class="card">
            <div class="card-header py-[17px] flex items-center justify-between gap-[8px]">
              <h3 class="card-title text-base font-semibold">System Metadata</h3>
            </div>
            <div class="card-body flex flex-col gap-[20px]">
              <div v-if="item.pxId" class="flex items-center justify-between gap-[10px]">
                <p class="font-normal text-sm text-gray-600">PX-Internal ID</p>
                <p class="font-normal text-sm text-gray-800 font-semibold">{{ item.pxId }}</p>
              </div>
              <div v-if="item.nomorBuktiPotong || item.noBupot" class="flex items-center justify-between gap-[10px]">
                <p class="font-normal text-sm text-gray-600">No. Bupot</p>
                <p class="font-normal text-sm text-primary font-semibold">{{ item.nomorBuktiPotong || item.noBupot }}</p>
              </div>
              <div v-if="item.idBupot" class="flex items-center justify-between gap-[10px]">
                <p class="font-normal text-sm text-gray-600">ID Bupot (DJP)</p>
                <p class="font-normal text-sm text-gray-800 font-semibold">{{ item.idBupot }}</p>
              </div>
              <div v-if="item.createdAt" class="flex items-center justify-between gap-[10px]">
                <p class="font-normal text-sm text-gray-600">Created On</p>
                <p class="font-normal text-sm text-gray-800 font-semibold">{{ formatDate(item.createdAt) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="pt-8 border-t border-gray-200 flex items-center justify-between">
        <button
          class="btn btn-outline btn-primary shadow-sm"
          @click="goBack"
          :disabled="submitting"
        >
          <i class="ki-filled ki-arrow-left"></i> Back to List
        </button>
      </div>
    </div>

    <!-- Modal Upload -->
    <ModalConfirmation
      :open="showUploadConfirmModal"
      id="bpu-detail-upload-modal"
      title="Upload to DJP"
      :text="`Ready to submit BPU for ${item?.namaPenerima || item?.nama || 'this record'} to DJP? This will officially record the tax withholding.`"
      type="confirm"
      @submit="handleUpload"
      @cancel="showUploadConfirmModal = false"
      :loading="submitting"
    >
      <div class="w-full flex flex-col gap-4 mt-2">
        <div class="flex flex-col gap-2">
          <label class="form-label text-xs uppercase text-gray-500 font-bold"
            >Passphrase (PX-Internal)</label
          >
          <div class="relative">
            <input
              v-model="passphrase"
              :type="showPassphrase ? 'text' : 'password'"
              class="input w-full border-gray-200 focus:border-primary shadow-sm pr-10"
              placeholder="Enter your PX-Internal passphrase"
            />
            <button
              type="button"
              class="btn btn-icon btn-sm absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
              @click="showPassphrase = !showPassphrase"
            >
              <i
                :class="['ki-filled', showPassphrase ? 'ki-eye-slash' : 'ki-eye', 'text-gray-500']"
              ></i>
            </button>
          </div>
        </div>
      </div>
    </ModalConfirmation>

    <!-- Modal Cancel -->
    <ModalConfirmation
      :open="showBatalModal"
      id="bpu-detail-batal-modal"
      title="Cancel Official Bupot"
      text="This will officially invalidate the certificate in DJP. Continue?"
      type="danger"
      @submit="handleBatalSubmit"
      @cancel="showBatalModal = false"
      :loading="submitting"
    />

    <!-- Notification -->
    <ModalNotification
      :open="showNotif"
      id="bpu-detail-notif"
      :title="notifTitle"
      :text="notifText"
      :type="notifType"
      @on-close="showNotif = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import ModalConfirmation from '@/components/modal/ModalConfirmation.vue'
import ModalNotification from '@/components/modal/ModalNotification.vue'
import BpuService, { type BpuContent } from '@/services/bpu.service'
import moment from 'moment'

const router = useRouter()
const route = useRoute()
const npwpPemotong = '1091031210969728'
const nikSigner = '3172022407830008'

const routes = [
  { name: 'Tax Reconciliation', to: '/tax-reconciliation' },
  { name: 'WHT - Unifikasi (BPU)', to: '/wht-unifikasi' },
  { name: 'Detail', to: '#' },
]

// ── State ──────────────────────────────────────────────────────────────
const item = ref<BpuContent | null>(null)
const loading = ref(false)
const submitting = ref(false)
const showBatalModal = ref(false)
const showUploadConfirmModal = ref(false)
const passphrase = ref('Pajak123@@')
const showPassphrase = ref(false)
const showNotif = ref(false)
const notifTitle = ref('')
const notifText = ref('')
const notifType = ref<'success' | 'error'>('success')

// ── Computed ───────────────────────────────────────────────────────────
const statusColorClass = computed(() => {
  const s = (item.value?.status || item.value?.fgStatus || '').toUpperCase()
  if (s === 'DRAFT') return 'bg-primary'
  if (s === 'NORMAL-DONE') return 'bg-success font-bold'
  if (s.includes('PROGRESS') || s === 'SUBMITTED') return 'bg-warning text-yellow-900'
  if (s === 'ERROR') return 'bg-danger font-bold'
  return 'bg-gray-500'
})

const statusIcon = computed(() => {
  const s = (item.value?.status || item.value?.fgStatus || '').toUpperCase()
  if (s === 'DRAFT') return 'ki-notepad-edit'
  if (s === 'NORMAL-DONE') return 'ki-check-circle'
  if (s.includes('PROGRESS') || s === 'SUBMITTED') return 'ki-arrows-loop'
  if (s === 'ERROR') return 'ki-cross-circle'
  return 'ki-information-2'
})

const statusBadgeClass = computed(() => {
  const s = (item.value?.status || item.value?.fgStatus || '').toUpperCase()
  if (s === 'DRAFT') return 'badge-light-primary'
  if (s === 'NORMAL-DONE') return 'badge-success'
  if (s.includes('PROGRESS') || s === 'SUBMITTED') return 'badge-light-warning'
  if (s === 'ERROR') return 'badge-light-danger'
  return 'badge-light'
})


// ── Lifecycle ──────────────────────────────────────────────────────────
const fetchDetail = async (id: string) => {
  loading.value = true
  try {
    const res = await BpuService.getDetail(id, npwpPemotong)
    item.value = res.result?.content ?? null
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const init = () => {
  const currentId = route.params.id as string
  const stored = sessionStorage.getItem('bpu_detail_item')
  if (stored) {
    try {
      item.value = JSON.parse(stored) as BpuContent
      sessionStorage.removeItem('bpu_detail_item')
      return
    } catch {
      /* ignore */
    }
  }
  if (currentId) fetchDetail(currentId)
}

init()

watch(
  () => route.params.id,
  (newId) => {
    if (!newId) return
    const stored = sessionStorage.getItem('bpu_detail_item')
    if (stored) {
      try {
        item.value = JSON.parse(stored) as BpuContent
        sessionStorage.removeItem('bpu_detail_item')
        return
      } catch {
        /* ignore */
      }
    }
    fetchDetail(newId as string)
  },
)

// ── Helpers ────────────────────────────────────────────────────────────
const formatCurrency = (val: number | string) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(Number(val) || 0)

const formatDate = (date: string | Date | undefined) =>
  date ? moment(date).format('DD MMM YYYY, HH:mm') : '-'

const isInProgress = (status: string | null | undefined) => {
  if (!status) return false
  const s = status.toUpperCase()
  return s === 'SUBMITTED' || s.includes('SIGNING_IN_PROGRESS') || s.includes('SUBMITTED-')
}

// ── Actions ────────────────────────────────────────────────────────────
const handleUpload = async () => {
  submitting.value = true
  try {
    await BpuService.upload({
      id: item.value!.pxId,
      npwpNikPenandatangan: nikSigner,
      passphrase: passphrase.value,
    })
    showUploadConfirmModal.value = false
    notifTitle.value = 'Upload Success'
    notifText.value = 'BPU has been submitted to DJP for processing.'
    notifType.value = 'success'
    showNotif.value = true
    fetchDetail(route.params.id as string)
  } catch {
    notifTitle.value = 'Upload Failed'
    notifText.value = 'Could not submit to DJP. Please check your credentials.'
    notifType.value = 'error'
    showNotif.value = true
  } finally {
    submitting.value = false
  }
}

const handleVerify = async () => {
  submitting.value = true
  try {
    await BpuService.verify({
      id: item.value!.pxId,
      npwpPemotong,
      tahunPajak: item.value!.tahunPajak || moment().format('YYYY'),
      noBupot: item.value!.noBupot || item.value!.nomorBuktiPotong || '',
      idBupot: item.value!.idBupot || '',
      fgJnsBupot: 'BPU'
    })
    notifTitle.value = 'Status Synchronized'
    notifText.value = 'Status has been updated from DJP.'
    notifType.value = 'success'
    showNotif.value = true
    fetchDetail(route.params.id as string)
  } catch {
    notifTitle.value = 'Sync Failed'
    notifText.value = 'Could not synchronize status with DJP.'
    notifType.value = 'error'
    showNotif.value = true
  } finally {
    submitting.value = false
  }
}

const handleBatal = () => {
  showBatalModal.value = true
}

const handleBatalSubmit = async () => {
  submitting.value = true
  try {
    await BpuService.batalkan({
      id: item.value!.pxId,
      tglPembatalan: moment().format('DDMMYYYY'),
      npwpNikPenandatangan: nikSigner,
    })
    showBatalModal.value = false
    notifTitle.value = 'BPU Cancelled'
    notifText.value = 'The tax document has been officially cancelled on DJP.'
    notifType.value = 'success'
    showNotif.value = true
    fetchDetail(route.params.id as string)
  } catch {
    notifTitle.value = 'Cancellation Failed'
    notifText.value = 'Could not cancel the document. Please try again.'
    notifType.value = 'error'
    showNotif.value = true
  } finally {
    submitting.value = false
  }
}

const goBack = () => router.push('/wht-unifikasi')
</script>

<style scoped>
.badge-outline {
  border: 1px solid currentColor;
  background-color: transparent;
}
</style>

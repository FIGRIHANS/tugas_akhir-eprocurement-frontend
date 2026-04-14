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
      <!-- Status Header -->
      <div
        class="flex flex-wrap items-center justify-between gap-6 p-6 bg-white rounded-xl border border-gray-200 shadow-sm text-gray-800"
      >
        <div class="flex items-center gap-4">
          <div
            :class="[
              'w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-sm font-bold',
              statusColorClass,
            ]"
          >
            <i :class="['ki-filled', statusIcon, 'text-2xl']"></i>
          </div>
          <div>
            <div class="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-0.5">
              Tax Record Status
            </div>
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-xl font-bold text-gray-800">{{
                item.status || item.fgStatus || 'NO STATUS'
              }}</span>
              <span
                v-if="item.nomorBuktiPotong || item.noBupot"
                class="badge badge-primary badge-outline font-mono text-[10px] h-5"
              >
                {{ item.nomorBuktiPotong || item.noBupot }}
              </span>
            </div>
            <div v-if="item.errorMsg" class="mt-1 text-xs text-danger font-medium">
              {{ item.errorMsg }}
            </div>
          </div>
        </div>

        <div class="flex gap-2">
          <template v-if="(item.status || item.fgStatus)?.toUpperCase() === 'DRAFT'">
            <button class="btn btn-primary" @click="showUploadConfirmModal = true">
              <i class="ki-filled ki-cloud-change"></i> Upload to DJP
            </button>
          </template>
          <template v-if="isInProgress(item.status || item.fgStatus)">
            <button class="btn btn-warning" :disabled="submitting" @click="handleVerify">
              <span v-if="submitting" class="loading loading-spinner loading-xs"></span>
              <i v-else class="ki-filled ki-arrow-circle-right"></i> Verify Status
            </button>
          </template>
          <template v-if="(item.status || item.fgStatus)?.toUpperCase() === 'NORMAL-DONE'">
            <button class="btn btn-danger shadow-sm" @click="handleBatal" :disabled="submitting">
              <i class="ki-filled ki-cross-circle"></i> Cancel Bupot
            </button>
          </template>
        </div>
      </div>

      <!-- Main Layout -->
      <div class="flex flex-col lg:flex-row gap-[24px] items-start">
        <div class="flex-1 space-y-6">
          <!-- Section 1: Recipient Information -->
          <div class="card p-[20px] shadow-sm">
            <p
              class="font-bold text-sm mb-[16px] uppercase tracking-tight text-gray-700 flex items-center gap-2 border-b pb-2 border-gray-100"
            >
              Recipient Information
            </p>
            <div class="space-y-1">
              <div
                v-if="item.namaPenerima || item.nama"
                class="flex items-baseline flex-wrap lg:flex-nowrap py-[8px]"
              >
                <label class="form-label w-full lg:max-w-xs text-sm font-medium text-gray-600"
                  >Recipient Name</label
                >
                <input
                  class="input flex-1 bg-gray-50 border-gray-200 font-semibold text-sm text-gray-800"
                  :value="item.namaPenerima || item.nama"
                  disabled
                />
              </div>
              <div
                v-if="item.npwpPenerima || item.npwp"
                class="flex items-baseline flex-wrap lg:flex-nowrap py-[8px]"
              >
                <label class="form-label w-full lg:max-w-xs text-sm font-medium text-gray-600"
                  >NPWP / NIK</label
                >
                <input
                  class="input flex-1 bg-gray-50 border-gray-200 font-mono text-sm text-primary font-semibold"
                  :value="item.npwpPenerima || item.npwp"
                  disabled
                />
              </div>
              <div
                v-if="item.alamatPenerima"
                class="flex items-baseline flex-wrap lg:flex-nowrap py-[8px]"
              >
                <label class="form-label w-full lg:max-w-xs text-sm font-medium text-gray-600"
                  >Address</label
                >
                <input
                  class="input flex-1 bg-gray-50 border-gray-200 text-sm text-gray-700"
                  :value="item.alamatPenerima"
                  disabled
                />
              </div>
            </div>
          </div>

          <!-- Section 2: Financial & Tax Details -->
          <div class="card p-[20px] shadow-sm">
            <p
              class="font-bold text-sm mb-[16px] uppercase tracking-tight text-gray-700 flex items-center gap-2 border-b pb-2 border-gray-100"
            >
              Financial &amp; Tax Details
            </p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1">
              <div
                v-if="item.kodeObjekPajak"
                class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]"
              >
                <label class="form-label min-w-[120px] text-sm font-medium text-gray-600"
                  >Object Code</label
                >
                <input
                  class="input bg-gray-50 border-gray-200 font-semibold text-sm text-gray-800"
                  :value="item.kodeObjekPajak"
                  disabled
                />
              </div>
              <div
                v-if="item.tglPemotongan"
                class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]"
              >
                <label class="form-label min-w-[120px] text-gray-500">Withholding Date</label>
                <input
                  class="input bg-gray-50 border-gray-200"
                  :value="item.tglPemotongan"
                  disabled
                />
              </div>
              <div
                v-if="item.pasalPPh"
                class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]"
              >
                <label class="form-label min-w-[120px] text-gray-500">Pasal PPh</label>
                <input
                  class="input bg-gray-50 border-gray-200"
                  :value="item.pasalPPh"
                  disabled
                />
              </div>
              <div
                v-if="item.statusPPh"
                class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]"
              >
                <label class="form-label min-w-[120px] text-gray-500">Status PPh</label>
                <input
                  class="input bg-gray-50 border-gray-200"
                  :value="item.statusPPh"
                  disabled
                />
              </div>
              <div
                v-if="item.masaPajak"
                class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]"
              >
                <label class="form-label min-w-[120px] text-gray-500">Tax Period</label>
                <input
                  class="input bg-gray-50 border-gray-200"
                  :value="item.masaPajak"
                  disabled
                />
              </div>
              <div
                v-if="item.tahunPajak"
                class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]"
              >
                <label class="form-label min-w-[120px] text-gray-500">Tax Year</label>
                <input
                  class="input bg-gray-50 border-gray-200"
                  :value="item.tahunPajak"
                  disabled
                />
              </div>
            </div>
          </div>

          <!-- Section 3: Classification (only if any field exists) -->
          <div
            v-if="item.kap || item.kjs || item.glAccount || item.idTku"
            class="card p-[20px] shadow-sm"
          >
            <p
              class="font-bold text-sm mb-[16px] uppercase tracking-tight text-gray-700 flex items-center gap-2 border-b pb-2 border-gray-100"
            >
              Classification &amp; Internal Codes
            </p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1">
              <div
                v-if="item.kap"
                class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]"
              >
                <label class="form-label min-w-[120px] text-gray-500">KAP</label>
                <input class="input bg-gray-50 border-gray-200" :value="item.kap" disabled />
              </div>
              <div
                v-if="item.kjs"
                class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]"
              >
                <label class="form-label min-w-[120px] text-gray-500">KJS</label>
                <input class="input bg-gray-50 border-gray-200" :value="item.kjs" disabled />
              </div>
              <div
                v-if="item.glAccount"
                class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]"
              >
                <label class="form-label min-w-[120px] text-gray-500">GL Account</label>
                <input class="input bg-gray-50 border-gray-200" :value="item.glAccount" disabled />
              </div>
              <div
                v-if="item.idTku"
                class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]"
              >
                <label class="form-label min-w-[120px] text-gray-500">TKU ID</label>
                <input class="input bg-gray-50 border-gray-200" :value="item.idTku" disabled />
              </div>
            </div>
          </div>

          <!-- Section 4: Reference Documents -->
          <div
            v-if="item.dokReferensi && item.dokReferensi.length > 0"
            class="card p-[20px] shadow-sm"
          >
            <p
              class="font-bold text-sm mb-[16px] uppercase tracking-tight text-gray-700 flex items-center gap-2 border-b pb-2 border-gray-100"
            >
              Reference Documents
            </p>
            <div class="overflow-hidden border border-gray-100 rounded-lg">
              <table class="table table-auto w-full text-xs">
                <thead class="bg-gray-100/50 border-b border-gray-100">
                  <tr>
                    <th class="py-3 px-4 text-left font-bold text-gray-600 uppercase">
                      Document Type
                    </th>
                    <th class="py-3 px-4 text-left font-bold text-gray-600 uppercase">
                      Document No
                    </th>
                    <th class="py-3 px-4 text-left font-bold text-gray-600 uppercase">Date</th>
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
          <div class="card shadow-sm">
            <div class="card-header py-[16px] px-[20px] border-b border-gray-100 bg-gray-50">
              <span
                class="font-bold text-sm uppercase tracking-tight text-gray-700 flex items-center gap-2"
              >
                <i class="ki-filled ki-wallet text-danger"></i>
                Tax Summary
              </span>
            </div>
            <div class="card-body p-0">
              <div class="flex flex-col">
                <div
                  class="border-b border-gray-100 py-[15px] px-[20px] text-sm flex justify-between"
                >
                  <span class="text-gray-500 font-medium uppercase tracking-tight text-[11px]"
                    >Tax Base (DPP)</span
                  >
                  <span class="font-bold text-gray-800">{{ formatCurrency(item.dpp || 0) }}</span>
                </div>
                <div
                  class="border-b border-gray-100 py-[15px] px-[20px] text-sm flex justify-between"
                >
                  <span class="text-gray-500 font-medium uppercase tracking-tight text-[11px]"
                    >Tax Rate</span
                  >
                  <span class="font-bold text-gray-800">{{ item.tarif || 0 }}%</span>
                </div>
                <div
                  class="py-[20px] px-[20px] text-sm flex justify-between items-center bg-red-50/30"
                >
                  <span class="uppercase font-bold text-danger tracking-wider text-[11px]"
                    >Withheld PPh</span
                  >
                  <span class="text-xl font-black text-danger">{{
                    formatCurrency(item.pphDipotong || 0)
                  }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- System Metadata -->
          <div class="card p-[20px] shadow-sm bg-gray-50/50">
            <p class="font-bold text-[11px] mb-[16px] uppercase tracking-[0.15em] text-gray-400">
              System Metadata
            </p>
            <div class="space-y-4">
              <div v-if="item.pxId" class="flex flex-col gap-1">
                <label class="text-[11px] uppercase font-bold text-gray-400">PX-Internal ID</label>
                <div class="text-sm text-gray-600 font-semibold">{{ item.pxId }}</div>
              </div>
              <div v-if="item.nomorBuktiPotong || item.noBupot" class="flex flex-col gap-1">
                <label class="text-[11px] uppercase font-bold text-gray-400">No. Bupot</label>
                <div class="text-sm font-bold text-primary">
                  {{ item.nomorBuktiPotong || item.noBupot }}
                </div>
              </div>
              <div v-if="item.idBupot" class="flex flex-col gap-1">
                <label class="text-[11px] uppercase font-bold text-gray-400">ID Bupot (DJP)</label>
                <div class="text-sm text-gray-800 font-bold break-all">{{ item.idBupot }}</div>
              </div>
              <div v-if="item.createdAt" class="flex flex-col gap-1">
                <label class="text-[11px] uppercase font-bold text-gray-400">Created On</label>
                <div class="text-sm text-gray-600">{{ formatDate(item.createdAt) }}</div>
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
    await BpuService.verify({ id: item.value!.pxId })
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

<template>
  <div class="pb-20">
    <Breadcrumb title="WHT - Unifikasi (BPU) Detail" :routes="routes" />
    <hr class="-mx-[24px] mb-[24px]" />

    <!-- No reload spinner if data is already in state -->
    <div
      v-if="loading && !item"
      class="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-300"
    >
      <span class="loading loading-spinner loading-lg text-primary"></span>
      <p class="mt-4 text-gray-500 font-medium italic">Fetching tax record details...</p>
    </div>

    <div
      v-else-if="!item && !loading"
      class="p-10 text-center bg-red-50 rounded-xl border border-red-100"
    >
      <i class="ki-filled ki-information-2 text-4xl text-danger mb-4"></i>
      <h3 class="text-lg font-bold text-gray-800">Record Not Found</h3>
      <p class="text-gray-500 mb-6">The requested BPU record could not be retrieved.</p>
      <button class="btn btn-primary shadow-sm" @click="router.push('/wht-unifikasi')">
        <i class="ki-filled ki-arrow-left"></i>
        Return to Dashboard
      </button>
    </div>

    <div v-else class="space-y-6 animate-in fade-in duration-500">
      <!-- Standard Header with Status -->
      <div
        class="flex flex-wrap items-center justify-between gap-6 p-6 bg-white rounded-xl border border-gray-200 shadow-sm text-gray-800"
      >
        <div class="flex items-center gap-4">
          <div
            :class="[
              'w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-sm',
              statusColorClass,
            ]"
          >
            <i :class="['ki-filled', statusIcon, 'text-2xl']"></i>
          </div>
          <div>
            <div class="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-0.5">
              Tax Record Status
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xl font-bold text-gray-800 uppercase">{{
                item?.status || item?.fgStatus || 'NO STATUS'
              }}</span>
              <span
                v-if="item?.nomorBuktiPotong || item?.noBupot"
                class="badge badge-primary badge-outline font-mono text-[10px] h-5 px-2"
              >
                {{ item?.nomorBuktiPotong || item?.noBupot }}
              </span>
            </div>
          </div>
        </div>

        <div class>
          <template v-if="(item?.status || item?.fgStatus)?.toUpperCase() === 'DRAFT'">
            <button class="btn btn-sm btn-primary" @click="showUploadConfirmModal = true">
              <i class="ki-filled ki-cloud-change"></i>
              Upload to DJP
            </button>
          </template>

          <template v-if="isInProgress(item?.status || item?.fgStatus)">
            <button class="btn btn-sm btn-warning" @click="handleVerify">
              <i class="ki-filled ki-arrows-loop"></i>
              Verify Status
            </button>
          </template>

          <template v-if="(item?.status || item?.fgStatus)?.toUpperCase() === 'NORMAL-DONE'">
            <button class="btn btn-sm btn-danger" @click="handleBatal">
              <i class="ki-filled ki-cross-circle"></i>
              Cancel Bupot
            </button>
          </template>
        </div>
      </div>

      <!-- Detail Content Cards -->
      <div class="flex flex-col lg:flex-row gap-[24px] items-start">
        <div class="flex-1 space-y-6 w-full">
          <!-- Section 1: Recipient Information -->
          <div class="card p-[20px] shadow-sm">
            <p
              class="font-bold text-sm mb-[16px] uppercase tracking-tight text-gray-700 flex items-center gap-2 border-b pb-2 border-gray-100"
            >
              Recipient Information
            </p>
            <div class="space-y-1">
              <div class="flex items-baseline flex-wrap lg:flex-nowrap py-[8px]">
                <label class="form-label w-full lg:max-w-xs text-sm font-medium text-gray-600"
                  >Recipient Name</label
                >
                <div class="flex-1">
                  <input
                    class="input bg-gray-50 border-gray-200 font-semibold text-sm text-gray-800"
                    :value="item?.namaPenerima || item?.nama || '-'"
                    disabled
                  />
                </div>
              </div>
              <div class="flex items-baseline flex-wrap lg:flex-nowrap py-[8px]">
                <label class="form-label w-full lg:max-w-xs text-sm font-medium text-gray-600"
                  >NPWP / NIK</label
                >
                <div class="flex-1">
                  <input
                    class="input bg-gray-50 border-gray-200 font-mono text-sm text-primary font-semibold"
                    :value="item?.npwpPenerima || item?.npwp || '-'"
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Section 2: Financial & Tax Details -->
          <div class="card p-[20px] shadow-sm">
            <p
              class="font-bold text-sm mb-[16px] uppercase tracking-tight text-gray-700 flex items-center gap-2 border-b pb-2 border-gray-100"
            >
              Financial & Tax Details
            </p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1">
              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
                <label class="form-label min-w-[120px] text-sm font-medium text-gray-600"
                  >Object Code</label
                >
                <input
                  class="input bg-gray-50 border-gray-200 font-semibold text-sm text-gray-800"
                  :value="item?.kodeObjekPajak || '-'"
                  disabled
                />
              </div>
              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
                <label class="form-label min-w-[120px] text-sm font-medium text-gray-600"
                  >Date</label
                >
                <input
                  class="input bg-gray-50 border-gray-200 font-semibold text-sm text-gray-800"
                  :value="item?.tglPemotongan || '-'"
                  disabled
                />
              </div>
              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
                <label class="form-label min-w-[120px] text-sm font-medium text-gray-600"
                  >Pasal PPh</label
                >
                <input
                  class="input bg-gray-50 border-gray-200 font-semibold text-sm text-gray-800"
                  :value="item?.pasalPPh || '-'"
                  disabled
                />
              </div>
              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
                <label class="form-label min-w-[120px] text-sm font-medium text-gray-600"
                  >Status PPh</label
                >
                <input
                  class="input bg-gray-50 border-gray-200 font-semibold text-sm text-gray-800"
                  :value="item?.statusPPh || '-'"
                  disabled
                />
              </div>
            </div>
          </div>

          <!-- Section 3: Reference Documents -->
          <div
            v-if="item?.dokReferensi && item.dokReferensi.length > 0"
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

        <!-- Sidebar / Right Panel: Calculation Summary -->
        <div class="w-full lg:max-w-sm space-y-6 lg:sticky lg:top-0">
          <div class="card shadow-sm border border-gray-100">
            <div class="card-header py-[16px] px-[20px] border-b border-gray-100 bg-gray-50/50">
              <span
                class="font-bold text-sm uppercase tracking-tight text-gray-700 flex items-center gap-2"
              >
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
                  <span class="font-bold text-gray-800">{{ formatCurrency(item?.dpp || 0) }}</span>
                </div>
                <div
                  class="border-b border-gray-100 py-[15px] px-[20px] text-sm flex justify-between"
                >
                  <span class="text-gray-500 font-medium uppercase tracking-tight text-[11px]"
                    >Tax Rate</span
                  >
                  <span class="font-bold text-gray-800">{{ item?.tarif || 0 }}%</span>
                </div>
                <div
                  class="py-[20px] px-[20px] text-sm flex justify-between items-center bg-red-50/30"
                >
                  <span class="uppercase font-bold text-danger tracking-wider text-[11px]"
                    >Withheld PPh</span
                  >
                  <span class="text-xl font-black text-danger">{{
                    formatCurrency(item?.pphDipotong || 0)
                  }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Metadata Card -->
          <div class="card p-[20px] shadow-sm bg-gray-50/50">
            <p class="font-bold text-[11px] mb-[16px] uppercase tracking-[0.15em] text-gray-400">
              System Metadata
            </p>
            <div class="space-y-4">
              <div class="flex flex-col gap-1">
                <label class="text-[11px] uppercase font-bold text-gray-400">PX-Internal ID</label>
                <div class="text-sm font-mono text-gray-600 font-semibold">
                  {{ item?.pxId || '-' }}
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="flex flex-col gap-1">
                  <label class="text-[11px] uppercase font-bold text-gray-400">KAP Code</label>
                  <div class="text-sm font-bold text-gray-800">{{ item?.kap || '-' }}</div>
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-[11px] uppercase font-bold text-gray-400">KJS Code</label>
                  <div class="text-sm font-bold text-gray-800">{{ item?.kjs || '-' }}</div>
                </div>
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-[11px] uppercase font-bold text-gray-400">GL Account</label>
                <div class="text-sm font-bold text-gray-800">
                  {{ item?.glAccount || 'Internal Account' }}
                </div>
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-[11px] uppercase font-bold text-gray-400"
                  >Masa / Tahun Pajak</label
                >
                <div class="text-sm font-bold text-gray-800">
                  {{ item?.masaPajak || '-' }} / {{ item?.tahunPajak || '-' }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Footer -->
      <div class="pt-8 border-t border-gray-200 flex items-center justify-between">
        <button
          class="btn btn-outline btn-primary shadow-sm"
          @click="goBack"
          :disabled="submitting"
        >
          <i class="ki-filled ki-arrow-left"></i>
          Back to List
        </button>

        <div v-if="item?.createdAt" class="text-right">
          <p class="text-[10px] text-gray-400 uppercase font-bold">Created On</p>
          <p class="text-xs text-gray-600 italic">{{ formatDate(item.createdAt) }}</p>
        </div>
      </div>
    </div>

    <!-- Modals -->
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

    <ModalNotification
      :open="showNotif"
      id="bpu-detail-notif"
      :title="notifTitle"
      :text="notifText"
      :type="notifType"
      @on-close="onNotifClose"
    />

    <ModalConfirmation
      :open="showUploadConfirmModal"
      id="upload-bpu-modal"
      title="Upload to DJP"
      :text="`Ready to submit BPU for ${item?.namaPenerima || item?.nama || item?.name || 'this record'} to DJP? This will officially record the tax withholding.`"
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
                :class="[
                  'ki-filled',
                  showPassphrase ? 'ki-eye-slash' : 'ki-eye',
                  'text-gray-500',
                ]"
              ></i>
            </button>
          </div>
        </div>
      </div>
    </ModalConfirmation>
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

const routes = [
  { name: 'Tax Reconciliation', to: '/tax-reconciliation' },
  { name: 'WHT - Unifikasi (BPU)', to: '/wht-unifikasi' },
  { name: 'Detail', to: '#' },
]

// State
const item = ref<BpuContent | null>(null)
const loading = ref(false) // Start as false to avoid flicker if state exists
const submitting = ref(false)
const showBatalModal = ref(false)
const showUploadConfirmModal = ref(false)
const passphrase = ref('Pajak123@@')
const showPassphrase = ref(false)

const showNotif = ref(false)
const notifTitle = ref('')
const notifText = ref('')
const notifType = ref<'success' | 'error'>('success')

// Lifecycle
const fetchDetail = async (id: string) => {
  loading.value = true
  try {
    const res = await BpuService.getDetail(id, npwpPemotong)
    if (res.result && res.result.content) {
      item.value = res.result.content as BpuContent
    }
  } catch (err) {
    console.error('Error fetching BPU detail:', err)
  } finally {
    loading.value = false
  }
}

// SYNCHRONOUS INITIALIZATION
// This runs once when the component setup starts
const initFromState = () => {
  const state = window.history.state
  const currentId = route.params.id as string

  if (state && state.item && String(state.item.id) === currentId) {
    item.value = state.item as BpuContent
    // No need to fetch or show loading
  } else if (currentId) {
    fetchDetail(currentId)
  }
}

initFromState()

// Watch for route changes (if user clicks another row without unmounting)
watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      const state = window.history.state
      if (state && state.item && String(state.item.id) === String(newId)) {
        item.value = state.item as BpuContent
        loading.value = false
      } else {
        fetchDetail(newId as string)
      }
    }
  },
)

// Methods
const formatCurrency = (val: number | string) => {
  const num = Number(val) || 0
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(num)
}

const formatDate = (date: string | Date | undefined) => {
  if (!date) return '-'
  return moment(date).format('DD MMM YYYY, HH:mm')
}

const isInProgress = (status: string | null | undefined) => {
  if (!status) return false
  const s = status.toUpperCase()
  return s === 'SUBMITTED' || s.includes('SIGNING_IN_PROGRESS') || s.includes('SUBMITTED-')
}

const statusColorClass = computed(() => {
  if (!item.value) return 'bg-gray-400'
  const s = (item.value.status || item.value.fgStatus || '').toUpperCase()
  if (s === 'DRAFT') return 'bg-primary'
  if (s === 'NORMAL-DONE') return 'bg-success font-bold text-white shadow-sm'
  if (s.includes('PROGRESS') || s === 'SUBMITTED')
    return 'bg-warning text-yellow-900 border-yellow-200 border'
  if (s === 'ERROR') return 'bg-danger font-bold text-white shadow-sm'
  return 'bg-gray-500 shadow-sm'
})

const statusIcon = computed(() => {
  if (!item.value) return 'ki-information-2'
  const s = (item.value.status || item.value.fgStatus || '').toUpperCase()
  if (s === 'DRAFT') return 'ki-notepad-edit'
  if (s === 'NORMAL-DONE') return 'ki-check-circle'
  if (s.includes('PROGRESS') || s === 'SUBMITTED') return 'ki-arrows-loop'
  if (s === 'ERROR') return 'ki-cross-circle'
  return 'ki-information-2'
})

// Actions Handlers
const handleUpload = async () => {
  submitting.value = true
  try {
    await BpuService.upload({
      id: item.value!.pxId,
      npwpNikPenandatangan: '3172022407830008',
      passphrase: passphrase.value,
    })
    showUploadConfirmModal.value = false
    passphrase.value = ''
    notifTitle.value = 'Upload Success'
    notifText.value = 'BPU has been submitted to DJP for processing.'
    notifType.value = 'success'
    showNotif.value = true
    fetchDetail(route.params.id as string)
  } catch (err) {
    console.error(err)
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
    notifType.value = 'success'
    showNotif.value = true
    fetchDetail(route.params.id as string)
  } catch (err) {
    console.error(err)
    notifTitle.value = 'Sync Failed'
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
    await BpuService.batalkan(npwpPemotong, {
      id: item.value!.pxId,
      tglPembatalan: moment().format('DDMMYYYY'),
      npwpNikPenandatangan: '3172022407830008',
    })
    showBatalModal.value = false
    notifTitle.value = 'BPU Cancelled'
    notifType.value = 'success'
    showNotif.value = true
    fetchDetail(route.params.id as string)
  } catch (err) {
    console.error(err)
    notifTitle.value = 'Cancellation Failed'
    notifType.value = 'error'
    showNotif.value = true
  } finally {
    submitting.value = false
  }
}

const onNotifClose = () => {
  showNotif.value = false
}

const goBack = () => {
  router.push('/wht-unifikasi')
}
</script>

<style scoped>
.badge-outline {
  border: 1px solid currentColor;
  background-color: transparent;
}
</style>

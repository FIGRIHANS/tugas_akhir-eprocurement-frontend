<template>
  <div class="pb-20">
    <Breadcrumb title="PPh 21 Detail" :routes="routes" />
    <hr class="-mx-[24px] mb-[24px]" />

    <div
      v-if="loading"
      class="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-300"
    >
      <span class="loading loading-spinner loading-lg text-primary"></span>
      <p class="mt-4 text-gray-500 font-medium italic">Fetching tax record details...</p>
    </div>

    <div v-else-if="!item" class="p-10 text-center bg-red-50 rounded-xl border border-red-100">
      <i class="ki-filled ki-information-2 text-4xl text-danger mb-4"></i>
      <h3 class="text-lg font-bold text-gray-800">Record Not Found</h3>
      <p class="text-gray-500 mb-6">The requested PPh 21 record could not be retrieved.</p>
      <button class="btn btn-primary" @click="goBack">
        <i class="ki-filled ki-arrow-left"></i>
        Return to List
      </button>
    </div>

    <div v-else class="space-y-6 animate-in fade-in duration-500">
      <!-- Header with Status Banner -->
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
              PPh 21 — {{ featureLabel }}
            </div>
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-xl font-bold text-gray-800">
                {{ item.status || item.fgStatus || 'NO STATUS' }}
              </span>
              <span
                v-if="item.nomorBupot || item.nomorBuktiPotong || item.noBupot"
                class="badge badge-primary badge-outline font-mono text-[10px] h-5"
              >
                {{ item.nomorBupot || item.nomorBuktiPotong || item.noBupot }}
              </span>
              <span class="text-gray-400 text-sm">
                {{ item.masaPajak ? `Period ${item.masaPajak}/${item.tahunPajak}` : '' }}
              </span>
            </div>
          </div>
        </div>

        <div class="flex gap-2">
          <button class="btn btn-sm btn-light border border-gray-200" @click="goBack">
            <i class="ki-filled ki-arrow-left"></i>
            Back
          </button>

          <template v-if="(item.status || item.fgStatus)?.toUpperCase() === 'DRAFT'">
            <button class="btn btn-sm btn-primary" @click="showUploadConfirmModal = true">
              <i class="ki-filled ki-cloud-change"></i>
              Upload to DJP
            </button>
          </template>

          <template v-if="isInProgress(item.status || item.fgStatus)">
            <button class="btn btn-sm btn-warning" @click="handleVerify" :disabled="submitting">
              <span v-if="submitting" class="loading loading-spinner loading-xs"></span>
              <i v-else class="ki-filled ki-arrow-circle-right"></i>
              Verify Status
            </button>
          </template>

          <template v-if="(item.status || item.fgStatus)?.toUpperCase() === 'NORMAL-DONE'">
            <button class="btn btn-sm btn-danger" @click="handleBatal">
              <i class="ki-filled ki-cross-circle"></i>
              Cancel Bupot
            </button>
          </template>
        </div>
      </div>

      <!-- Detail Content -->
      <div class="flex flex-col lg:flex-row gap-[24px] items-start">
        <div class="flex-1 space-y-6">
          <!-- Recipient Information -->
          <div class="card p-[20px] shadow-sm">
            <p class="font-bold text-sm mb-[16px] uppercase tracking-tight text-gray-700 border-b pb-2 border-gray-100">
              Recipient Information
            </p>
            <div class="space-y-1">
              <div class="flex items-baseline flex-wrap lg:flex-nowrap py-[8px]">
                <label class="form-label w-full lg:max-w-xs text-sm font-medium text-gray-600">Recipient Name</label>
                <input
                  class="input flex-1 bg-gray-50 border-gray-200 font-semibold text-sm text-gray-800"
                  :value="item.namaPenerima || item.nama || '-'"
                  disabled
                />
              </div>
              <div class="flex items-baseline flex-wrap lg:flex-nowrap py-[8px]">
                <label class="form-label w-full lg:max-w-xs text-sm font-medium text-gray-600">NPWP / NIK</label>
                <input
                  class="input flex-1 bg-gray-50 border-gray-200 font-mono text-sm text-primary font-semibold"
                  :value="item.npwpPenerima || item.npwp || '-'"
                  disabled
                />
              </div>
            </div>
          </div>

          <!-- Tax & Financial Details -->
          <div class="card p-[20px] shadow-sm">
            <p class="font-bold text-sm mb-[16px] uppercase tracking-tight text-gray-700 border-b pb-2 border-gray-100">
              Tax & Financial Details
            </p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1">
              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
                <label class="form-label min-w-[140px] text-sm font-medium text-gray-600">Object Code</label>
                <input class="input bg-gray-50 border-gray-200 font-semibold text-sm text-gray-800" :value="item.kodeObjekPajak || '-'" disabled />
              </div>
              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
                <label class="form-label min-w-[140px] text-gray-500">Withholding Date</label>
                <input class="input bg-gray-50 border-gray-200" :value="item.tglPemotongan || '-'" disabled />
              </div>
              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
                <label class="form-label min-w-[140px] text-gray-500">Pasal PPh</label>
                <input class="input bg-gray-50 border-gray-200" :value="item.pasalPPh || '-'" disabled />
              </div>
              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
                <label class="form-label min-w-[140px] text-gray-500">PPh Status</label>
                <input class="input bg-gray-50 border-gray-200 font-semibold" :value="item.statusPPh || '-'" disabled />
              </div>
              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
                <label class="form-label min-w-[140px] text-gray-500">Tax Type</label>
                <input
                  class="input bg-gray-50 border-gray-200 font-semibold text-primary"
                  :value="item.feature === 'final' ? 'Final' : 'Tidak Final (Non-Final)'"
                  disabled
                />
              </div>
              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
                <label class="form-label min-w-[140px] text-gray-500">Tax Period</label>
                <input
                  class="input bg-gray-50 border-gray-200"
                  :value="item.masaPajak && item.tahunPajak ? `${item.masaPajak}/${item.tahunPajak}` : '-'"
                  disabled
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Right Panel -->
        <div class="w-full lg:max-w-sm space-y-6 lg:sticky lg:top-0">
          <!-- Tax Summary -->
          <div class="card shadow-sm">
            <div class="card-header py-[16px] px-[20px] border-b border-gray-100 bg-gray-50">
              <span class="font-bold text-sm uppercase tracking-tight text-gray-700 flex items-center gap-2">
                <i class="ki-filled ki-wallet text-danger"></i>
                Tax Summary
              </span>
            </div>
            <div class="card-body p-0">
              <div class="flex flex-col">
                <div class="border-b border-gray-100 py-[15px] px-[20px] text-sm flex justify-between">
                  <span class="text-gray-500 font-medium uppercase tracking-tight text-[11px]">Gross Income</span>
                  <span class="font-bold text-gray-800">{{ formatCurrency(Number(item.penghasilanKotor) || 0) }}</span>
                </div>
                <div class="border-b border-gray-100 py-[15px] px-[20px] text-sm flex justify-between">
                  <span class="text-gray-500 font-medium uppercase tracking-tight text-[11px]">Gross (Previous)</span>
                  <span class="font-bold text-gray-800">{{ formatCurrency(Number(item.penghasilanKotorSebelumnya) || 0) }}</span>
                </div>
                <div class="border-b border-gray-100 py-[15px] px-[20px] text-sm flex justify-between">
                  <span class="text-gray-500 font-medium uppercase tracking-tight text-[11px]">Tax Rate</span>
                  <span class="font-bold text-gray-800">{{ Number(item.tarif) || 0 }}%</span>
                </div>
                <div class="py-[20px] px-[20px] text-sm flex justify-between items-center bg-red-50/30">
                  <span class="uppercase font-bold text-danger tracking-wider text-[11px]">Withheld PPh 21</span>
                  <span class="text-xl font-black text-danger">{{ formatCurrency(Number(item.pphDipotong) || 0) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- System Metadata -->
          <div class="card p-[20px] shadow-sm bg-gray-50/50">
            <p class="font-bold text-[11px] mb-[16px] uppercase tracking-[0.15em] text-gray-400">System Metadata</p>
            <div class="space-y-4">
              <div class="flex flex-col gap-1">
                <label class="text-[11px] uppercase font-bold text-gray-400">Local DB ID</label>
                <div class="text-sm font-mono text-gray-600"># {{ item.id || '-' }}</div>
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-[11px] uppercase font-bold text-gray-400">PX ID (Pajak Express)</label>
                <div class="text-sm font-mono text-gray-600 font-semibold">{{ item.pxId || '-' }}</div>
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-[11px] uppercase font-bold text-gray-400">Bupot ID</label>
                <div class="text-sm font-bold text-gray-800">{{ item.idBupot || '-' }}</div>
              </div>
              <div v-if="item.createdAt" class="flex flex-col gap-1">
                <label class="text-[11px] uppercase font-bold text-gray-400">Created On</label>
                <div class="text-xs text-gray-600 italic">{{ formatDate(item.createdAt) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="pt-8 border-t border-gray-200 flex items-center justify-between">
        <button class="btn btn-outline btn-primary shadow-sm" @click="goBack" :disabled="submitting">
          <i class="ki-filled ki-arrow-left"></i>
          Back to List
        </button>
      </div>
    </div>

    <!-- Cancel Modal -->
    <ModalConfirmation
      :open="showBatalModal"
      id="pph21-detail-batal-modal"
      title="Cancel Official Bupot"
      text="This will officially invalidate the PPh 21 certificate in DJP. Continue?"
      type="danger"
      @submit="handleBatalSubmit"
      @cancel="showBatalModal = false"
      :loading="submitting"
    />

    <!-- Upload Modal -->
    <ModalConfirmation
      :open="showUploadConfirmModal"
      id="upload-pph21-modal"
      title="Upload to DJP"
      :text="`Ready to submit PPh 21 for ${item?.namaPenerima || item?.nama || 'this record'} to DJP?`"
      type="confirm"
      @submit="handleUpload"
      @cancel="showUploadConfirmModal = false"
      :loading="submitting"
    >
      <div class="w-full flex flex-col gap-4 mt-2">
        <div class="flex flex-col gap-2">
          <label class="form-label text-xs uppercase text-gray-500 font-bold">Passphrase (PX-Internal)</label>
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
              <i :class="['ki-filled', showPassphrase ? 'ki-eye-slash' : 'ki-eye', 'text-gray-500']"></i>
            </button>
          </div>
        </div>
      </div>
    </ModalConfirmation>

    <!-- Notification -->
    <ModalNotification
      :open="showNotif"
      id="pph21-detail-notif"
      :title="notifTitle"
      :text="notifText"
      :type="notifType"
      @on-close="showNotif = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import ModalConfirmation from '@/components/modal/ModalConfirmation.vue'
import ModalNotification from '@/components/modal/ModalNotification.vue'
import Pph21Service, { type Pph21Content } from '@/services/pph21.service'
import moment from 'moment'

const router = useRouter()
const route = useRoute()
const idNumeric = route.params.id as string
const nikSigner = '3172022407830008'
const npwpPemotong = '1091031210969728'

const routes = [
  { name: 'Tax Reconciliation', to: '/tax-reconciliation' },
  { name: 'WHT - Pasal 21', to: '/wht-pasal-21' },
  { name: 'Detail', to: '#' },
]

// State
const item = ref<Pph21Content | null>(null)
const loading = ref(true)
const submitting = ref(false)
const showBatalModal = ref(false)
const showUploadConfirmModal = ref(false)
const passphrase = ref('Pajak123@@')
const showPassphrase = ref(false)

const showNotif = ref(false)
const notifTitle = ref('')
const notifText = ref('')
const notifType = ref<'success' | 'error'>('success')

// Computed
const featureLabel = computed(() => {
  if (!item.value?.feature) return 'Non-Final'
  return item.value.feature === 'final' ? 'Final' : 'Non-Final'
})

const statusColorClass = computed(() => {
  if (!item.value) return 'bg-gray-400'
  const s = (item.value.status || item.value.fgStatus || '').toUpperCase()
  if (s === 'DRAFT') return 'bg-primary'
  if (s === 'NORMAL-DONE') return 'bg-success'
  if (s.includes('PROGRESS') || s === 'SUBMITTED') return 'bg-warning'
  if (s === 'ERROR') return 'bg-danger'
  return 'bg-gray-500'
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

// Helpers
const formatCurrency = (val: number | string) => {
  const num = Number(val) || 0
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num)
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

// Data Fetch
const fetchDetail = async () => {
  loading.value = true
  try {
    const res = await Pph21Service.getDetail(idNumeric)
    const content = (res as any)?.result?.content
    if (content) item.value = content as Pph21Content
  } catch (err) {
    console.error('Error fetching PPh 21 detail:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // Try sessionStorage first (set by list page viewDetail)
  const stored = sessionStorage.getItem('pph21_detail_item')
  if (stored) {
    try {
      item.value = JSON.parse(stored) as Pph21Content
      loading.value = false
    } catch {
      fetchDetail()
    }
  } else {
    fetchDetail()
  }
})

// Action Handlers
const handleUpload = async () => {
  if (!item.value) return
  submitting.value = true
  try {
    await Pph21Service.upload({
      id: item.value.id,  // Local DB id — backend maps to PxId for Pajak Express
      npwpNikPenandatangan: nikSigner,
      passphrase: passphrase.value,
    })
    showUploadConfirmModal.value = false
    passphrase.value = ''
    notifTitle.value = 'Upload Success'
    notifText.value = 'PPh 21 record has been submitted to DJP for processing.'
    notifType.value = 'success'
    showNotif.value = true
    fetchDetail()
  } catch (err) {
    console.error(err)
    notifTitle.value = 'Upload Failed'
    notifText.value = 'Failed to submit to DJP. Please check the passphrase or try again.'
    notifType.value = 'error'
    showNotif.value = true
  } finally {
    submitting.value = false
  }
}

const handleVerify = async () => {
  if (!item.value) return
  submitting.value = true
  try {
    await Pph21Service.verify({
      id: item.value.pxId,
      npwpPemotong,
      feature: item.value.feature || 'tdkfinal',
    })
    notifTitle.value = 'Status Synchronized'
    notifText.value = 'The status has been updated from DJP.'
    notifType.value = 'success'
    showNotif.value = true
    fetchDetail()
  } catch (err) {
    console.error(err)
    notifTitle.value = 'Sync Failed'
    notifText.value = 'Could not synchronize status with DJP at this time.'
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
  if (!item.value) return
  submitting.value = true
  try {
    await Pph21Service.batalkan({
      id: item.value.pxId,
      idBupot: item.value.idBupot || '',
      noBupot: item.value.nomorBupot || item.value.noBupot || '',
      masaPajak: item.value.masaPajak || '',
      tahunPajak: item.value.tahunPajak || '',
      tglPembatalan: moment().format('DDMMYYYY'),
      npwpNikPenandatangan: nikSigner,
      passphrase: 'Pajak123@@',
      namaTtd: 'Dave Navarro',
      position: 'Director',
      alamatPenandatangan: 'Jakarta',
      dcPenandatangan: '1',
      declare: '1',
    })
    showBatalModal.value = false
    notifTitle.value = 'Record Cancelled'
    notifText.value = 'The PPh 21 certificate has been officially cancelled on DJP.'
    notifType.value = 'success'
    showNotif.value = true
    fetchDetail()
  } catch (err) {
    console.error(err)
    notifTitle.value = 'Cancellation Failed'
    notifText.value = 'Could not cancel this record. Please try again.'
    notifType.value = 'error'
    showNotif.value = true
  } finally {
    submitting.value = false
  }
}

const goBack = () => {
  router.push('/wht-pasal-21')
}
</script>

<style scoped>
.text-danger { color: #f1416c; }
.badge-outline {
  border: 1px solid currentColor;
  background-color: transparent;
}
</style>

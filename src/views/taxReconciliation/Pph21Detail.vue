<template>
  <div class="pb-20">
    <Breadcrumb title="PPh 21 Detail" :routes="routes" />
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
      <p class="text-gray-500 mb-6">The requested PPh 21 record could not be retrieved.</p>
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
                  {{ item.status || item.fgStatus || 'NO STATUS' }}
                </span>
              </div>
              <div v-if="item.nomorBupot || item.nomorBuktiPotong || item.noBupot" class="flex items-center gap-[10px]">
                <p class="font-normal text-sm text-gray-500 w-28 shrink-0">No. Bupot</p>
                <p class="font-bold text-sm text-primary">{{ item.nomorBupot || item.nomorBuktiPotong || item.noBupot }}</p>
              </div>
              <div class="flex items-center gap-[10px]">
                <p class="font-normal text-sm text-gray-500 w-28 shrink-0">Tax Type</p>
                <p class="font-semibold text-sm text-gray-800">PPh 21 — {{ featureLabel }}</p>
              </div>
              <div v-if="item.masaPajak" class="flex items-center gap-[10px]">
                <p class="font-normal text-sm text-gray-500 w-28 shrink-0">Tax Period</p>
                <p class="font-semibold text-sm text-gray-800">{{ item.masaPajak }} / {{ item.tahunPajak }}</p>
              </div>
              <div v-if="item.errorMessage || item.errorMsg" class="flex items-start gap-[10px]">
                <p class="font-normal text-sm text-gray-500 w-28 shrink-0">Error</p>
                <p class="text-xs text-danger font-medium leading-relaxed">{{ item.errorMessage || item.errorMsg }}</p>
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
            </div>

          </div>
        </div>
      </div>


      <!-- Main Layout -->
      <div class="flex flex-col lg:flex-row gap-[24px] items-start">

        <!-- LEFT COLUMN -->
        <div class="flex-1 space-y-6">

          <!-- Section 1: Recipient Information -->
          <div class="card">
            <div class="card-header py-[17px] flex items-center justify-between gap-[8px]">
              <h3 class="card-title text-base font-semibold">Recipient Information</h3>
            </div>
            <div class="card-body flex flex-col gap-[20px]">
              <div v-if="item.namaPenerima || item.nama" class="flex items-center justify-between gap-[10px]">
                <p class="font-normal text-sm text-gray-600">Recipient Name</p>
                <p class="font-normal text-sm font-semibold text-gray-800">{{ item.namaPenerima || item.nama }}</p>
              </div>
              <div v-if="item.npwpPenerima || item.npwp" class="flex items-center justify-between gap-[10px]">
                <p class="font-normal text-sm text-gray-600">NPWP / NIK</p>
                <p class="font-normal text-sm font-semibold text-primary">{{ item.npwpPenerima || item.npwp }}</p>
              </div>
            </div>
          </div>

          <!-- Section 2: Financial & Tax Details -->
          <div class="card">
            <div class="card-header py-[17px] flex items-center justify-between gap-[8px]">
              <h3 class="card-title text-base font-semibold">Financial &amp; Tax Details</h3>
            </div>
            <div class="card-body flex flex-col gap-[20px]">
              <div v-if="item.kodeObjekPajak" class="flex items-center justify-between gap-[10px]">
                <p class="font-normal text-sm text-gray-600">Object Code</p>
                <p class="font-normal text-sm font-semibold text-gray-800">{{ item.kodeObjekPajak }}</p>
              </div>
              <div v-if="item.feature" class="flex items-center justify-between gap-[10px]">
                <p class="font-normal text-sm text-gray-600">Tax Type</p>
                <p class="font-normal text-sm font-semibold text-primary">
                  {{ item.feature === 'final' ? 'Final' : 'Tidak Final (Non-Final)' }}
                </p>
              </div>
              <div v-if="item.tglPemotongan" class="flex items-center justify-between gap-[10px]">
                <p class="font-normal text-sm text-gray-600">Withholding Date</p>
                <p class="font-normal text-sm text-gray-800">{{ item.tglPemotongan }}</p>
              </div>
              <div v-if="item.pasalPPh" class="flex items-center justify-between gap-[10px]">
                <p class="font-normal text-sm text-gray-600">Pasal PPh</p>
                <p class="font-normal text-sm text-gray-800">{{ item.pasalPPh }}</p>
              </div>
              <div v-if="item.statusPPh" class="flex items-center justify-between gap-[10px]">
                <p class="font-normal text-sm text-gray-600">PPh Status</p>
                <p class="font-normal text-sm text-gray-800">{{ item.statusPPh }}</p>
              </div>
              <div v-if="item.masaPajak && item.tahunPajak" class="flex items-center justify-between gap-[10px]">
                <p class="font-normal text-sm text-gray-600">Tax Period</p>
                <p class="font-normal text-sm text-gray-800">{{ item.masaPajak }} / {{ item.tahunPajak }}</p>
              </div>
            </div>
          </div>

          <!-- Section 3: Classification (kap / kjs / idTku) -->
          <div v-if="item.kap || item.kjs || item.idTku" class="card">
            <div class="card-header py-[17px] flex items-center justify-between gap-[8px]">
              <h3 class="card-title text-base font-semibold">Classification &amp; Payments</h3>
            </div>
            <div class="card-body flex flex-col gap-[20px]">
              <div v-if="item.kap" class="flex items-center justify-between gap-[10px]">
                <p class="font-normal text-sm text-gray-600">KAP Code</p>
                <p class="font-normal text-sm text-gray-800">{{ item.kap }}</p>
              </div>
              <div v-if="item.kjs" class="flex items-center justify-between gap-[10px]">
                <p class="font-normal text-sm text-gray-600">KJS Code</p>
                <p class="font-normal text-sm text-gray-800">{{ item.kjs }}</p>
              </div>
              <div v-if="item.idTku" class="flex items-center justify-between gap-[10px]">
                <p class="font-normal text-sm text-gray-600">Unit / TKU ID</p>
                <p class="font-normal text-sm text-gray-800">{{ item.idTku }}</p>
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
                <p class="font-normal text-sm text-gray-600">Gross Income</p>
                <p class="font-normal text-sm font-semibold text-gray-800">{{ formatCurrency(Number(item.penghasilanKotor) || 0) }}</p>
              </div>
              <div v-if="Number(item.penghasilanKotorSebelumnya) > 0" class="flex items-center justify-between gap-[10px]">
                <p class="font-normal text-sm text-gray-600">Gross (Previous)</p>
                <p class="font-normal text-sm text-gray-800">{{ formatCurrency(Number(item.penghasilanKotorSebelumnya)) }}</p>
              </div>
              <div class="flex items-center justify-between gap-[10px]">
                <p class="font-normal text-sm text-gray-600">Tax Rate</p>
                <p class="font-normal text-sm font-semibold text-gray-800">{{ Number(item.tarif) || 0 }}%</p>
              </div>
              <div class="flex items-center justify-between gap-[10px] border-t border-gray-100 pt-4">
                <p class="font-normal text-sm font-semibold text-danger">PPh 21 Withheld</p>
                <p class="font-bold text-base text-danger">{{ formatCurrency(Number(item.pphDipotong) || 0) }}</p>
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
                <p class="font-normal text-sm font-semibold text-gray-800"># {{ item.id || '-' }}</p>
              </div>
              <div v-if="item.pxId" class="flex items-center justify-between gap-[10px]">
                <p class="font-normal text-sm text-gray-600">PX ID</p>
                <p class="font-normal text-sm text-gray-800">{{ item.pxId }}</p>
              </div>
              <div v-if="item.idBupot" class="flex items-center justify-between gap-[10px]">
                <p class="font-normal text-sm text-gray-600">Bupot ID</p>
                <p class="font-normal text-sm text-gray-800">{{ item.idBupot }}</p>
              </div>
              <div v-if="item.createdAt" class="flex items-center justify-between gap-[10px]">
                <p class="font-normal text-sm text-gray-600">Created On</p>
                <p class="font-normal text-sm text-gray-800">{{ formatDate(item.createdAt) }}</p>
              </div>
              <div v-if="item.updatedAt" class="flex items-center justify-between gap-[10px]">
                <p class="font-normal text-sm text-gray-600">Last Updated</p>
                <p class="font-normal text-sm text-gray-800">{{ formatDate(item.updatedAt) }}</p>
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
            <button class="btn btn-danger" @click="handleBatal" :disabled="submitting">
              <i class="ki-filled ki-cross-circle"></i> Cancel Bupot
            </button>
          </template>
        </div>
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

const statusBadgeClass = computed(() => {
  if (!item.value) return 'badge-light'
  const s = (item.value.status || item.value.fgStatus || '').toUpperCase()
  if (s === 'DRAFT') return 'badge-light-primary'
  if (s === 'NORMAL-DONE') return 'badge-success'
  if (s.includes('PROGRESS') || s === 'SUBMITTED') return 'badge-light-warning'
  if (s === 'ERROR') return 'badge-light-danger'
  return 'badge-light'
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

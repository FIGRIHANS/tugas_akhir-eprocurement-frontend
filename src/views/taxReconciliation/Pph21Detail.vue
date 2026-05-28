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
            <div class="text-xs font-medium text-gray-500 mb-0.5">
              PPh 21 — {{ featureLabel }}
            </div>
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-xl font-bold text-gray-800">
                {{ item.status || item.fgStatus || 'NO STATUS' }}
              </span>
              <span
                v-if="item.nomorBupot || item.nomorBuktiPotong || item.noBupot"
                class="badge badge-primary badge-outline text-[10px] h-5"
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
          <template v-if="(item.status || item.fgStatus)?.toUpperCase() === 'DRAFT'">
            <button class="btn btn-md btn-primary" @click="showUploadConfirmModal = true">
              <i class="ki-filled ki-cloud-change"></i>
              Upload to DJP
            </button>
          </template>

          <template v-if="isInProgress(item.status || item.fgStatus)">
            <button class="btn btn-md btn-warning" @click="handleVerify" :disabled="submitting">
              <span v-if="submitting" class="loading loading-spinner loading-xs"></span>
              <i v-else class="ki-filled ki-arrow-circle-right"></i>
              Verify Status
            </button>
          </template>

          <template v-if="(item.status || item.fgStatus)?.toUpperCase() === 'NORMAL-DONE'">
            <button class="btn btn-md btn-danger" @click="handleBatal">
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
          <div class="card">
            <div class="card-header py-[17px] flex items-center justify-between gap-[8px]">
              <h3 class="card-title text-base font-semibold">Recipient Information</h3>
            </div>
            <div class="card-body flex flex-col gap-[20px]">
              <div class="flex items-center justify-between gap-[10px]">
                <p class="font-normal text-sm text-gray-600">Recipient Name</p>
                <p class="font-normal text-sm font-semibold text-gray-800">{{ item.namaPenerima || item.nama || '-' }}</p>
              </div>
              <div class="flex items-center justify-between gap-[10px]">
                <p class="font-normal text-sm text-gray-600">NPWP / NIK</p>
                <p class="font-normal text-sm font-semibold text-primary">{{ item.npwpPenerima || item.npwp || '-' }}</p>
              </div>
            </div>
          </div>

          <!-- Tax & Financial Details -->
          <div class="card">
            <div class="card-header py-[17px] flex items-center justify-between gap-[8px]">
              <h3 class="card-title text-base font-semibold">Financial & Tax Details</h3>
            </div>
            <div class="card-body flex flex-col gap-[20px]">
              <div class="flex items-center justify-between gap-[10px]">
                <p class="font-normal text-sm text-gray-600">Object Code</p>
                <p class="font-normal text-sm font-semibold text-gray-800">{{ item.kodeObjekPajak || '-' }}</p>
              </div>
              <div class="flex items-center justify-between gap-[10px]">
                <p class="font-normal text-sm text-gray-600">Withholding Date</p>
                <p class="font-normal text-sm text-gray-800">{{ item.tglPemotongan || '-' }}</p>
              </div>
              <div class="flex items-center justify-between gap-[10px]">
                <p class="font-normal text-sm text-gray-600">Pasal PPh</p>
                <p class="font-normal text-sm text-gray-800">{{ item.pasalPPh || '-' }}</p>
              </div>
              <div class="flex items-center justify-between gap-[10px]">
                <p class="font-normal text-sm text-gray-600">PPh Status</p>
                <p class="font-normal text-sm text-gray-800">{{ item.statusPPh || '-' }}</p>
              </div>
              <div class="flex items-center justify-between gap-[10px]">
                <p class="font-normal text-sm text-gray-600">Tax Type</p>
                <p class="font-normal text-sm font-semibold text-primary">
                  {{ item.feature === 'final' ? 'Final' : 'Tidak Final (Non-Final)' }}
                </p>
              </div>
              <div class="flex items-center justify-between gap-[10px]">
                <p class="font-normal text-sm text-gray-600">Tax Period</p>
                <p class="font-normal text-sm text-gray-800">
                  {{ item.masaPajak && item.tahunPajak ? `${item.masaPajak}/${item.tahunPajak}` : '-' }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Panel -->
        <div class="w-full lg:max-w-sm space-y-6 lg:sticky lg:top-0">
          <!-- Tax Summary -->
          <!-- Tax Summary -->
          <div class="card">
            <div class="card-header py-[17px] flex items-center justify-between gap-[8px]">
              <h3 class="card-title text-base font-semibold">Tax Calculation</h3>
            </div>
            <div class="card-body flex flex-col gap-[20px]">
              <div class="flex items-center justify-between gap-[10px]">
                <p class="font-normal text-sm text-gray-600">Gross Income</p>
                <p class="font-normal text-sm font-semibold text-gray-800">{{ formatCurrency(Number(item.penghasilanKotor) || 0) }}</p>
              </div>
              <div class="flex items-center justify-between gap-[10px]">
                <p class="font-normal text-sm text-gray-600">Gross (Previous)</p>
                <p class="font-normal text-sm font-semibold text-gray-800">{{ formatCurrency(Number(item.penghasilanKotorSebelumnya) || 0) }}</p>
              </div>
              <div class="flex items-center justify-between gap-[10px]">
                <p class="font-normal text-sm text-gray-600">Tax Rate</p>
                <p class="font-normal text-sm font-semibold text-gray-800">{{ Number(item.tarif) || 0 }}%</p>
              </div>
              <div class="flex items-center justify-between gap-[10px]">
                <p class="font-normal text-sm text-gray-600">Withheld PPh 21</p>
                <p class="font-normal text-sm font-semibold text-danger">{{ formatCurrency(Number(item.pphDipotong) || 0) }}</p>
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
                <p class="font-normal text-sm text-gray-800 font-semibold"># {{ item.id || '-' }}</p>
              </div>
              <div class="flex items-center justify-between gap-[10px]">
                <p class="font-normal text-sm text-gray-600">PX ID (Pajak Express)</p>
                <p class="font-normal text-sm text-gray-800 font-semibold">{{ item.pxId || '-' }}</p>
              </div>
              <div class="flex items-center justify-between gap-[10px]">
                <p class="font-normal text-sm text-gray-600">Bupot ID</p>
                <p class="font-normal text-sm text-gray-800 font-semibold">{{ item.idBupot || '-' }}</p>
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

<template>
  <div class="pb-20">
    <Breadcrumb title="Create New BPU" :routes="routes" />
    <hr class="-mx-[24px] mb-[24px]" />

    <div class="space-y-6">

      <div class="flex gap-[24px] items-start">
        <div class="flex-1 space-y-6">
          <!-- Section 1: Recipient Information -->
          <div class="card p-[20px]">
            <p class="font-semibold text-sm mb-[16px] uppercase tracking-tight text-gray-600">Recipient Information</p>
            <div class="flex flex-col gap-[8px]">
              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
                <label class="form-label w-full lg:max-w-xs">Identification Type</label>
                <div class="flex gap-6 items-center flex-1">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" v-model="form.fgNpwpNik" value="true" class="radio radio-primary radio-xs" />
                    <span class="text-sm">NPWP</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" v-model="form.fgNpwpNik" value="false" class="radio radio-primary radio-xs" />
                    <span class="text-sm">NIK</span>
                  </label>
                </div>
              </div>

              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
                <label class="form-label w-full lg:max-w-xs">{{ form.fgNpwpNik === 'true' ? 'NPWP' : 'NIK' }}</label>
                <div class="flex-1">
                  <input 
                    v-model="form.npwp" 
                    :class="['input', { 'border-danger !placeholder-red-400': wasValidated && !form.npwp }, form.invoiceId > 0 ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : '']" 
                    :placeholder="form.fgNpwpNik === 'true' ? 'Enter NPWP' : 'Enter NIK'" 
                    required
                    :disabled="form.invoiceId > 0"
                  >
                  <p v-if="wasValidated && !form.npwp" class="text-danger text-[11px] mt-1.5 font-medium ml-1 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                    <i class="ki-filled ki-information-2 text-[13px]"></i>
                    {{ form.fgNpwpNik === 'true' ? 'NPWP' : 'NIK' }} is required
                  </p>
                </div>
              </div>

              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
                <label class="form-label w-full lg:max-w-xs">Counterpart Name</label>
                <div class="flex-1">
                  <input 
                    v-model="form.nama" 
                    :class="['input', { 'border-danger !placeholder-red-400': wasValidated && !form.nama }, form.invoiceId > 0 ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : '']" 
                    placeholder="Enter recipient name" 
                    required
                    :disabled="form.invoiceId > 0"
                  >
                  <p v-if="wasValidated && !form.nama" class="text-danger text-[11px] mt-1.5 font-medium ml-1 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                    <i class="ki-filled ki-information-2 text-[13px]"></i>
                    Counterpart name is required
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Section 2: Financial Details -->
          <div class="card p-[20px]">
            <p class="font-semibold text-sm mb-[16px] uppercase tracking-tight text-gray-600">Financial & Tax Details</p>
            <div class="flex flex-col gap-[8px]">
              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
                <label class="form-label w-full lg:max-w-xs">Tax Object Code</label>
                <div class="flex-1">
                  <select 
                    v-model="form.dataDetilBpu.kodeObjekPajak" 
                    :class="['select', { 'border-danger': wasValidated && !form.dataDetilBpu.kodeObjekPajak }]" 
                    required
                  >
                    <option value="28-402-01">28-402-01 (Pasal 4 Ayat 2)</option>
                    <option value="24-104-01">24-104-01 (Pasal 23)</option>
                  </select>
                  <p v-if="wasValidated && !form.dataDetilBpu.kodeObjekPajak" class="text-danger text-[11px] mt-1.5 font-medium ml-1 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                    <i class="ki-filled ki-information-2 text-[13px]"></i>
                    Tax object code is required
                  </p>
                </div>
              </div>

              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
                <DatePicker 
                  v-model="form.tglPemotongan" 
                  label="Withholding Date" 
                  placeholder="Select withholding date"
                  :error="wasValidated && !form.tglPemotongan"
                  required
                />
              </div>

              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
                <label class="form-label w-full lg:max-w-xs">Tax Rate (%)</label>
                <div class="flex-1 relative">
                  <input 
                    type="number" step="0.1" 
                    v-model="form.dataDetilBpu.tarif" 
                    @input="calculatePPh" 
                    :class="['input pr-8', { 'border-danger': wasValidated && !form.dataDetilBpu.tarif }, form.invoiceId > 0 ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : '']" 
                    required
                    :disabled="form.invoiceId > 0"
                  >
                  <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                </div>
              </div>

              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
                <label class="form-label w-full lg:max-w-xs">Tax Base (DPP)</label>
                <div class="flex-1 relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Rp</span>
                  <input 
                    type="text" 
                    v-model="formattedDpp" 
                    @input="calculatePPh" 
                    :class="['input pl-10 font-semibold', { 'border-danger': wasValidated && (!form.dataDetilBpu.dpp || form.dataDetilBpu.dpp <= 0) }, form.invoiceId > 0 ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : '']" 
                    placeholder="0"
                    required
                    :disabled="form.invoiceId > 0"
                  >
                  <p v-if="wasValidated && (!form.dataDetilBpu.dpp || form.dataDetilBpu.dpp <= 0)" class="text-danger text-[11px] mt-1.5 font-medium ml-1 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                    <i class="ki-filled ki-information-2 text-[13px]"></i>
                    Tax base amount is required
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Section 3: Classification -->
          <div class="card p-[20px]">
            <p class="font-semibold text-sm mb-[16px] uppercase tracking-tight text-gray-600">Classification & Payments</p>
            <div class="grid grid-cols-2 gap-x-12 gap-y-2">
              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
                <label class="form-label min-w-[120px]">Pasal PPh</label>
                <input v-model="form.dataDetilBpu.pasalPPh" class="input" placeholder="e.g., 4 Ayat 2">
              </div>
              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
                <label class="form-label min-w-[120px]">Status PPh</label>
                <select v-model="form.dataDetilBpu.statusPPh" class="select">
                  <option value="Final">Final</option>
                  <option value="Non Final">Non Final</option>
                </select>
              </div>
              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
                <label class="form-label min-w-[120px]">KAP Code</label>
                <input v-model="form.dataDetilBpu.kap" class="input" placeholder="411128">
              </div>
              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
                <label class="form-label min-w-[120px]">KJS Code</label>
                <input v-model="form.dataDetilBpu.kjs" class="input" placeholder="100">
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar / Right Panel: Calculation Summary -->
        <div class="w-full lg:max-w-sm space-y-6 sticky top-0">
          <div class="card h-fit">
            <div class="card-header py-[16px] px-[20px]">
              <span class="font-semibold text-sm uppercase tracking-tight text-gray-600">Tax Calculation</span>
            </div>
            <div class="card-body p-0">
              <div class="flex flex-col">
                <div class="border-b border-gray-200 py-[20px] px-[20px] text-xs flex justify-between">
                  <span class="text-gray-500 uppercase tracking-tight">Tax Base (DPP)</span>
                  <span class="font-medium">{{ formatCurrency(form.dataDetilBpu.dpp) }}</span>
                </div>
                <div class="border-b border-gray-200 py-[20px] px-[20px] text-xs flex justify-between">
                  <span class="text-gray-500 uppercase tracking-tight">Tax Rate</span>
                  <span class="font-medium">{{ form.dataDetilBpu.tarif }}%</span>
                </div>
                <div class="calculation__last-field py-[22px] px-[20px] text-xs flex justify-between items-center">
                  <span class="uppercase tracking-wider">Calculated PPh</span>
                  <span class="text-lg">{{ formatCurrency(form.dataDetilBpu.pphDipotong) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Documentation & Accounting Card -->
          <div class="card p-[20px]">
            <p class="font-semibold text-sm mb-[16px] uppercase tracking-tight text-gray-600">Accounting & Docs</p>
            <div class="flex flex-col gap-4">
              <div class="flex flex-col gap-1">
                <label class="form-label">GL Account</label>
                <input v-model="form.glAccount" class="input" placeholder="Internal Account">
              </div>
              <div class="flex flex-col gap-1">
                <label class="form-label">Unit/TKU ID</label>
                <input v-model="form.idTku" class="input" placeholder="Unit Identifier">
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="pt-8 border-t border-gray-100 flex items-center justify-between">
        <button type="button" class="btn btn-outline btn-primary" @click="goBack" :disabled="submitting">
          <i class="ki-filled ki-arrow-left"></i>
          Back
        </button>
        <button type="submit" @click="submitCreateBpu" class="btn btn-primary px-12" :disabled="submitting">
          <span v-if="submitting" class="loading loading-spinner"></span>
          Save BPU Draft
          <i class="ki-duotone ki-paper-plane ml-2"></i>
        </button>
      </div>
    </div>

    <!-- Notifications -->
    <ModalNotification
      :open="showNotif"
      id="create-bpu-notif"
      :title="notifTitle"
      :text="notifText"
      :type="notifType"
      @on-close="onNotifClose"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import ModalNotification from '@/components/modal/ModalNotification.vue'
import DatePicker from '@/components/datePicker/DatePicker.vue'
import BpuService, { type BpuCreatePayload } from '@/services/bpu.service'
import moment from 'moment'

const router = useRouter()
const route = useRoute()

const routes = [
  { name: 'Tax Reconciliation', to: '/tax-reconciliation' },
  { name: 'WHT - Unifikasi (BPU)', to: '/wht-unifikasi' },
  { name: 'Create', to: '#' },
]

// --- State ---
const submitting = ref(false)
const wasValidated = ref(false)
const showNotif = ref(false)
const notifTitle = ref('')
const notifText = ref('')
const notifType = ref<'success' | 'error'>('success')

// Form Initialization
const form = ref<BpuCreatePayload>({
  invoiceId: 0,
  npwpPemotong: '1091031210969728',
  idTku: '1091031210969728000000',
  revNo: 0,
  masaPajak: '',
  tahunPajak: '',
  fgNpwpNik: 'true',
  npwp: '1234567890123456',
  nik: '',
  nama: 'PT BPU Testing',
  fgJnsBupot: 'BPU',
  tglPemotongan: moment().format('YYYY-MM-DD'),
  glAccount: '521111',
  dataDetilBpu: {
    sertifikatInsentifDipotong: '9',
    nomorSertifikatInsentif: '',
    kodeObjekPajak: '24-104-01',
    pasalPPh: 'Pasal 23',
    statusPPh: 'Non Final',
    dpp: 10000000,
    tarif: 2,
    pphDipotong: 200000,
    kap: '411124',
    kjs: '100',
    dokReferensi: [
      {
        dokReferensi: 'COMMERCIALINVOICE',
        nomorDokumen: 'INV/BPU/TEST/' + moment().format('YYYYMMDDHHmm'),
        tanggal_Dokumen: moment().format('DDMMYYYY'),
      },
    ],
    metodePembayaranBendahara: '',
    nomorSP2D: '',
  }
})

// --- Auto-populate from query params (when coming from Invoice Pending WHT list) ---
const populateFromQueryParams = () => {
  const q = route.query
  if (!q.invoiceId) return

  form.value.invoiceId = Number(q.invoiceId) || 0
  form.value.nama = String(q.vendorName || '')
  form.value.npwp = String(q.vendorNpwp || '')
  form.value.fgNpwpNik = q.vendorNpwp ? 'true' : 'false'
  form.value.dataDetilBpu.dpp = Number(q.dpp) || 0
  form.value.dataDetilBpu.pphDipotong = Number(q.whtAmount) || 0

  const invoiceNo = String(q.invoiceNo || '')
  if (form.value.dataDetilBpu.dokReferensi.length > 0) {
    form.value.dataDetilBpu.dokReferensi[0].nomorDokumen = invoiceNo
  }
}

onMounted(() => {
  populateFromQueryParams()
})

// Methods
const calculatePPh = () => {
  const dpp = Number(form.value.dataDetilBpu.dpp) || 0
  const tarif = Number(form.value.dataDetilBpu.tarif) || 0
  form.value.dataDetilBpu.pphDipotong = Math.round(dpp * (tarif / 100))
}

const formatCurrency = (val: number | string) => {
  const num = Number(val) || 0
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(num)
}

const formattedDpp = computed({
  get() {
    if (!form.value.dataDetilBpu.dpp) return ''
    return new Intl.NumberFormat('id-ID').format(Number(form.value.dataDetilBpu.dpp))
  },
  set(newValue) {
    const numericValue = newValue.replace(/[^0-9]/g, '')
    form.value.dataDetilBpu.dpp = numericValue ? Number(numericValue) : 0
    calculatePPh()
  }
})

const submitCreateBpu = async () => {
  wasValidated.value = true
  
  // Basic Validation
  if (!form.value.npwp || !form.value.nama || !form.value.dataDetilBpu.kodeObjekPajak || !form.value.tglPemotongan) {
    return
  }

  submitting.value = true
  try {
    const payload = JSON.parse(JSON.stringify(form.value))
    
    // Formatting for API
    payload.tglPemotongan = moment(form.value.tglPemotongan).format('DDMMYYYY')
    payload.masaPajak = moment(form.value.tglPemotongan).format('MM')
    payload.tahunPajak = moment(form.value.tglPemotongan).format('YYYY')
    
    // Financial items MUST be strings
    payload.dataDetilBpu.dpp = String(payload.dataDetilBpu.dpp)
    payload.dataDetilBpu.tarif = String(payload.dataDetilBpu.tarif)
    payload.dataDetilBpu.pphDipotong = String(payload.dataDetilBpu.pphDipotong)

    // Sync dokReferensi date
    if (payload.dataDetilBpu.dokReferensi && payload.dataDetilBpu.dokReferensi.length > 0) {
      payload.dataDetilBpu.dokReferensi[0].tanggal_Dokumen = payload.tglPemotongan
    }

    // Map identifier
    if (form.value.fgNpwpNik === 'true') {
      payload.npwp = form.value.npwp
      payload.nik = ''
    } else {
      payload.nik = form.value.npwp
      payload.npwp = ''
    }

    await BpuService.create(payload)

    notifTitle.value = 'BPU Created'
    notifText.value = 'The draft has been saved successfully. Redirecting to dashboard...'
    notifType.value = 'success'
    showNotif.value = true
  } catch (err) {
    console.error(err)
    notifTitle.value = 'Error Creating BPU'
    notifText.value = 'System failed to save the draft. Please check your network connection.'
    notifType.value = 'error'
    showNotif.value = true
  } finally {
    submitting.value = false
  }
}

const onNotifClose = () => {
  showNotif.value = false
  if (notifType.value === 'success') {
    router.push('/wht-unifikasi')
  }
}

const goBack = () => {
  router.push('/wht-unifikasi')
}
</script>

<style lang="scss" scoped>
:deep() {
  .calculation {
    &__last-field {
      background-color: #f0fdfa;
      color: #0d9488;
      border-bottom-right-radius: 12px;
      border-bottom-left-radius: 12px;
      @apply font-bold;
    }
  }
}
</style>

<style scoped>
.text-danger {
  color: #f1416c;
}

.input::placeholder,
.select::placeholder {
  transition: color 0.2s ease;
}

.border-danger::placeholder {
  color: #f1416c !important;
  opacity: 1;
}
</style>

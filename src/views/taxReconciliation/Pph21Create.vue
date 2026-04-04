<template>
  <div class="pb-20">
    <Breadcrumb title="Create New PPh 21" :routes="routes" />
    <hr class="-mx-[24px] mb-[24px]" />

    <div class="space-y-6">
      <div class="flex gap-[24px] items-start">
        <div class="flex-1 space-y-6">
          <!-- Section 1: Recipient Information -->
          <div class="card p-[20px]">
            <p class="font-semibold text-sm mb-[16px] uppercase tracking-tight text-gray-600">Recipient Information</p>
            <div class="flex flex-col gap-[8px]">
              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
                <label class="form-label w-full lg:max-w-xs">Identifier Type</label>
                <div class="flex gap-6 items-center flex-1">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" v-model="form.fgNpwpNik" :value="true" class="radio radio-primary radio-xs">
                    <span class="text-sm">NPWP (16 Digits)</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" v-model="form.fgNpwpNik" :value="false" class="radio radio-primary radio-xs">
                    <span class="text-sm">NIK (Identity Card)</span>
                  </label>
                </div>
              </div>

              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
                <label class="form-label w-full lg:max-w-xs">Tax ID / Number</label>
                <div class="flex-1">
                  <input v-model="form.npwp" class="input" :placeholder="form.fgNpwpNik ? 'Enter NPWP' : 'Enter NIK'" required>
                </div>
              </div>

              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
                <label class="form-label w-full lg:max-w-xs">Recipient Name</label>
                <div class="flex-1">
                  <input v-model="form.nama" class="input" placeholder="Enter recipient name" required>
                </div>
              </div>
            </div>
          </div>

          <!-- Section 2: Transaction Details -->
          <div class="card p-[20px]">
            <p class="font-semibold text-sm mb-[16px] uppercase tracking-tight text-gray-600">Transaction & Tax Details</p>
            <div class="flex flex-col gap-[8px]">
              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
                <label class="form-label w-full lg:max-w-xs">Tax Object Code</label>
                <div class="flex-1">
                  <select v-model="form.dataDetilPph21.kodeObjekPajak" class="select" required>
                    <option value="21-100-01">21-100-01 (Pegawai Tetap)</option>
                    <option value="21-100-02">21-100-02 (Pensiun)</option>
                    <option value="21-100-03">21-100-03 (Bukan Pegawai)</option>
                  </select>
                </div>
              </div>

              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
                <label class="form-label w-full lg:max-w-xs">Withholding Date</label>
                <div class="flex-1">
                  <input type="date" v-model="form.tglPemotongan" class="input" required>
                </div>
              </div>

              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
                <label class="form-label w-full lg:max-w-xs">Tax Rate (%)</label>
                <div class="flex-1 relative">
                  <input type="number" step="0.1" v-model="form.dataDetilPph21.tarif" @input="calculatePPh" class="input text-right pr-8" required>
                  <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                </div>
              </div>

              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
                <label class="form-label w-full lg:max-w-xs">Tax Base (DPP)</label>
                <div class="flex-1 relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Rp</span>
                  <input type="number" v-model="form.dataDetilPph21.dpp" @input="calculatePPh" class="input pl-10 text-right" required>
                </div>
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
                  <span class="font-medium">{{ formatCurrency(form.dataDetilPph21.dpp) }}</span>
                </div>
                <div class="border-b border-gray-200 py-[20px] px-[20px] text-xs flex justify-between">
                  <span class="text-gray-500 uppercase tracking-tight">Tax Rate</span>
                  <span class="font-medium">{{ form.dataDetilPph21.tarif }}%</span>
                </div>
                <div class="calculation__last-field py-[22px] px-[20px] text-xs flex justify-between items-center">
                  <span class="uppercase tracking-wider">Calculated PPh 21</span>
                  <span class="text-lg">{{ formatCurrency(form.dataDetilPph21.pphDipotong) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="card p-[20px] bg-gray-50/50 border-dashed border-gray-200">
            <div class="flex items-start gap-3">
              <i class="ki-outline ki-information-2 text-primary mt-0.5"></i>
              <p class="text-xs text-gray-500 leading-relaxed">
                PPh 21 calculation follows the standard <b>DPP x Rate</b> formula for regular employee withholding.
              </p>
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
        <button type="submit" @click="submitCreatePph" class="btn btn-primary px-12" :disabled="submitting">
          <span v-if="submitting" class="loading loading-spinner"></span>
          Save PPh 21 Draft
          <i class="ki-duotone ki-paper-plane ml-2"></i>
        </button>
      </div>
    </div>

    <!-- Notifications -->
    <ModalNotification
      :open="showNotif"
      id="create-pph-notif"
      :title="notifTitle"
      :text="notifText"
      :type="notifType"
      @on-close="onNotifClose"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import ModalNotification from '@/components/modal/ModalNotification.vue'
import Pph21Service, { type Pph21CreatePayload } from '@/services/pph21.service'
import moment from 'moment'

const router = useRouter()

const routes = [
  { name: 'Tax Reconciliation', to: '/tax-reconciliation' },
  { name: 'WHT - Pasal 21', to: '/wht-pasal-21' },
  { name: 'Create', to: '#' },
]

const npwpPemotong = '1091031210969728'

// State
const submitting = ref(false)
const showNotif = ref(false)
const notifTitle = ref('')
const notifText = ref('')
const notifType = ref<'success' | 'error'>('success')

// Form Initialization
const initialForm: Pph21CreatePayload = {
  invoiceId: 0,
  npwpPemotong: npwpPemotong,
  fgNpwpNik: true,
  npwp: '',
  nama: '',
  fgJnsBupot: 'PASAL21',
  tglPemotongan: moment().format('YYYY-MM-DD'),
  dataDetilPph21: {
    kodeObjekPajak: '21-100-01',
    pasalPPh: 'Pasal 21',
    dpp: 0,
    tarif: 5,
    pphDipotong: 0,
    dokReferensi: [{ dokReferensi: 'COMMERCIALINVOICE', nomorDokumen: 'DUMMY-RECON-21', tanggal_Dokumen: moment().format('DDMMYYYY') }]
  }
}
const form = ref<Pph21CreatePayload>(JSON.parse(JSON.stringify(initialForm)))

// Methods
const calculatePPh = () => {
  form.value.dataDetilPph21.pphDipotong = Math.round(
    form.value.dataDetilPph21.dpp * (form.value.dataDetilPph21.tarif / 100)
  )
}

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(val)
}

const submitCreatePph = async () => {
  submitting.value = true
  try {
    const payload = JSON.parse(JSON.stringify(form.value))
    payload.tglPemotongan = moment(form.value.tglPemotongan).format('DDMMYYYY')

    await Pph21Service.create(payload)
    
    notifTitle.value = 'PPh 21 Created'
    notifText.value = 'The draft has been saved successfully. Redirecting to dashboard...'
    notifType.value = 'success'
    showNotif.value = true
  } catch (err) {
    console.error(err)
    notifTitle.value = 'Error Creating PPh 21'
    notifType.value = 'error'
    showNotif.value = true
  } finally {
    submitting.value = false
  }
}

const onNotifClose = () => {
  showNotif.value = false
  if (notifType.value === 'success') {
    router.push('/wht-pasal-21')
  }
}

const goBack = () => {
  router.push('/wht-pasal-21')
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

<template>
  <div class="pb-20">
    <Breadcrumb title="Create New PPh 21" :routes="routes" />
    <hr class="-mx-[24px] mb-[24px]" />

    <div class="space-y-6">
      <div class="flex gap-[24px] items-start">
        <div class="flex-1 space-y-6">
          <!-- Section 1: Withholding Type -->
          <div class="card p-[20px]">
            <p class="font-semibold text-sm mb-[16px] uppercase tracking-tight text-gray-600">Withholding Type</p>
            <div class="flex flex-col gap-[8px]">
              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
                <label class="form-label w-full lg:max-w-xs">Feature</label>
                <div class="flex gap-6 items-center flex-1">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" v-model="form.feature" value="tdkfinal" class="radio radio-primary radio-xs" />
                    <span class="text-sm">Tidak Final (Non-Final)</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" v-model="form.feature" value="final" class="radio radio-primary radio-xs" />
                    <span class="text-sm">Final</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Section 2: Recipient Information -->
          <div class="card p-[20px]">
            <p class="font-semibold text-sm mb-[16px] uppercase tracking-tight text-gray-600">Recipient Information</p>
            <div class="flex flex-col gap-[8px]">
              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
                <label class="form-label w-full lg:max-w-xs">Identifier Type</label>
                <div class="flex gap-6 items-center flex-1">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" v-model="form.fgNpwpNik" :value="true" class="radio radio-primary radio-xs" />
                    <span class="text-sm">NPWP (16 Digits)</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" v-model="form.fgNpwpNik" :value="false" class="radio radio-primary radio-xs" />
                    <span class="text-sm">NIK (Identity Card)</span>
                  </label>
                </div>
              </div>

              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
                <label class="form-label w-full lg:max-w-xs">NPWP / NIK</label>
                <div class="flex-1">
                  <input
                    v-model="form.npwp"
                    class="input w-full"
                    :placeholder="form.fgNpwpNik ? 'Enter NPWP (16 digits)' : 'Enter NIK'"
                    :class="{ 'border-danger': errors.npwp }"
                    required
                  />
                  <p v-if="errors.npwp" class="text-danger text-xs mt-1">{{ errors.npwp }}</p>
                </div>
              </div>

              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
                <label class="form-label w-full lg:max-w-xs">Recipient Name</label>
                <div class="flex-1">
                  <input
                    v-model="form.nama"
                    class="input w-full"
                    placeholder="Enter recipient full name"
                    :class="{ 'border-danger': errors.nama }"
                    required
                  />
                  <p v-if="errors.nama" class="text-danger text-xs mt-1">{{ errors.nama }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Section 3: Transaction & Tax Details -->
          <div class="card p-[20px]">
            <p class="font-semibold text-sm mb-[16px] uppercase tracking-tight text-gray-600">Transaction & Tax Details</p>
            <div class="flex flex-col gap-[8px]">
              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
                <label class="form-label w-full lg:max-w-xs">Tax Object Code</label>
                <div class="flex-1">
                  <input
                    v-model="form.dataDetilBp21.kodeObjekPajak"
                    class="input w-full"
                    placeholder="e.g. 21-100-12"
                    :class="{ 'border-danger': errors.kodeObjekPajak }"
                  />
                  <p v-if="errors.kodeObjekPajak" class="text-danger text-xs mt-1">{{ errors.kodeObjekPajak }}</p>
                </div>
              </div>

              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
                <label class="form-label w-full lg:max-w-xs">PPh Status</label>
                <div class="flex-1">
                  <input
                    v-model="form.dataDetilBp21.statusPPh"
                    class="input w-full"
                    placeholder="e.g. TK/0, K/1"
                    :class="{ 'border-danger': errors.statusPPh }"
                  />
                  <p v-if="errors.statusPPh" class="text-danger text-xs mt-1">{{ errors.statusPPh }}</p>
                </div>
              </div>

              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
                <label class="form-label w-full lg:max-w-xs">Withholding Date</label>
                <div class="flex-1">
                  <input
                    type="date"
                    v-model="form.tglPemotongan"
                    class="input w-full"
                    :class="{ 'border-danger': errors.tglPemotongan }"
                    required
                  />
                  <p v-if="errors.tglPemotongan" class="text-danger text-xs mt-1">{{ errors.tglPemotongan }}</p>
                </div>
              </div>

              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
                <label class="form-label w-full lg:max-w-xs">Gross Income (Before)</label>
                <div class="flex-1 relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Rp</span>
                  <input
                    type="text"
                    v-model="formattedGrossIncomeBefore"
                    class="input w-full pl-10 font-semibold"
                    placeholder="0"
                  />
                </div>
              </div>

              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
                <label class="form-label w-full lg:max-w-xs">Gross Income (Current)</label>
                <div class="flex-1 relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Rp</span>
                  <input
                    type="text"
                    v-model="formattedGrossIncome"
                    class="input w-full pl-10 font-semibold"
                    :class="{ 'border-danger': errors.penghasilanKotor }"
                    placeholder="0"
                    @input="calculatePPh"
                    required
                  />
                  <p v-if="errors.penghasilanKotor" class="text-danger text-xs mt-1">{{ errors.penghasilanKotor }}</p>
                </div>
              </div>

              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
                <label class="form-label w-full lg:max-w-xs">Tax Rate (%)</label>
                <div class="flex-1 relative">
                  <input
                    type="number"
                    step="0.01"
                    v-model.number="form.dataDetilBp21.tarif"
                    class="input w-full pr-8"
                    :class="{ 'border-danger': errors.tarif }"
                    placeholder="0"
                    @input="calculatePPh"
                    required
                  />
                  <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                  <p v-if="errors.tarif" class="text-danger text-xs mt-1">{{ errors.tarif }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Section 4: Reference Document -->
          <div class="card p-[20px]">
            <p class="font-semibold text-sm mb-[16px] uppercase tracking-tight text-gray-600">Reference Document</p>
            <div class="flex flex-col gap-[8px]">
              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
                <label class="form-label w-full lg:max-w-xs">Document Type</label>
                <div class="flex-1">
                  <select v-model="form.dataDetilBp21.dokReferensi[0].dokReferensi" class="select w-full">
                    <option value="ANNOUNCEMENT">ANNOUNCEMENT</option>
                    <option value="COMMERCIALINVOICE">COMMERCIALINVOICE</option>
                    <option value="CONTRACT">CONTRACT</option>
                    <option value="CURRENTACCOUNT">CURRENTACCOUNT</option>
                    <option value="DEEDOFENGAGEMENT">DEEDOFENGAGEMENT</option>
                    <option value="DEEDOFGENERAL">DEEDOFGENERAL</option>
                    <option value="OTHER">OTHER</option>
                    <option value="PAYMENTPROOF">PAYMENTPROOF</option>
                    <option value="STATEMENTLETTER">STATEMENTLETTER</option>
                    <option value="TAXINVOICE">TAXINVOICE</option>
                    <option value="TRADECONFIRMATION">TRADECONFIRMATION</option>
                  </select>
                </div>
              </div>

              <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
                <label class="form-label w-full lg:max-w-xs">Document Number</label>
                <div class="flex-1">
                  <input
                    v-model="form.dataDetilBp21.dokReferensi[0].nomorDokumen"
                    class="input w-full"
                    placeholder="e.g. INV-001"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Panel: Tax Calculation Summary -->
        <div class="w-full lg:max-w-sm space-y-6 sticky top-0">
          <div class="card h-fit">
            <div class="card-header py-[16px] px-[20px]">
              <span class="font-semibold text-sm uppercase tracking-tight text-gray-600">Tax Calculation</span>
            </div>
            <div class="card-body p-0">
              <div class="flex flex-col">
                <div class="border-b border-gray-200 py-[20px] px-[20px] text-xs flex justify-between">
                  <span class="text-gray-500 uppercase tracking-tight">Gross Income</span>
                  <span class="font-medium">{{ formatCurrency(form.dataDetilBp21.penghasilanKotor) }}</span>
                </div>
                <div class="border-b border-gray-200 py-[20px] px-[20px] text-xs flex justify-between">
                  <span class="text-gray-500 uppercase tracking-tight">Tax Rate</span>
                  <span class="font-medium">{{ form.dataDetilBp21.tarif }}%</span>
                </div>
                <div class="border-b border-gray-200 py-[20px] px-[20px] text-xs flex justify-between">
                  <span class="text-gray-500 uppercase tracking-tight">Norm (%)</span>
                  <span class="font-medium">{{ form.dataDetilBp21.NormaPenghasilan }}%</span>
                </div>
                <div class="calculation__last-field py-[22px] px-[20px] text-xs flex justify-between items-center">
                  <span class="uppercase tracking-wider">PPh 21 Withheld</span>
                  <span class="text-lg">{{ formatCurrency(form.dataDetilBp21.pphDipotong) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="card p-[20px] bg-gray-50/50 border-dashed border-gray-200">
            <div class="flex items-start gap-3">
              <i class="ki-outline ki-information-2 text-primary mt-0.5"></i>
              <p class="text-xs text-gray-500 leading-relaxed">
                PPh 21 = <b>Gross Income × Rate × (Norm / 100)</b>. All amounts in IDR.
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
        <button type="submit" @click="submitCreate" class="btn btn-primary px-12" :disabled="submitting">
          <span v-if="submitting" class="loading loading-spinner"></span>
          Save PPh 21 Draft
          <i class="ki-duotone ki-paper-plane ml-2"></i>
        </button>
      </div>
    </div>

    <!-- Notifications -->
    <ModalNotification
      :open="showNotif"
      id="create-pph21-notif"
      :title="notifTitle"
      :text="notifText"
      :type="notifType"
      @on-close="onNotifClose"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
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

const npwpPemotong = '1091031210912281'

// State
const submitting = ref(false)
const showNotif = ref(false)
const notifTitle = ref('')
const notifText = ref('')
const notifType = ref<'success' | 'error'>('success')

// Errors
const errors = reactive<Record<string, string>>({})

// Form
const form = ref<Pph21CreatePayload>({
  npwpPemotong,
  idTku: npwpPemotong + '000000',
  revNo: 0,
  masaPajak: moment().format('MM'),
  tahunPajak: moment().format('YYYY'),
  fgNpwpNik: true,
  fgTransaction: 'NEW',
  npwp: '3602172704980004',
  nik: '',
  nama: 'Dave Navarro',
  fgJnsBupot: '21',
  tglPemotongan: moment().format('YYYY-MM-DD'),
  feature: 'tdkfinal',
  email: '',
  glAccount: '511010100',
  dataDetilBp21: {
    sertifikatInsentifDipotong: '9',
    nomorSertifikatInsentif: '',
    kodeObjekPajak: '21-100-12',
    pasalPPh: 'Pasal 21',
    statusPPh: 'TK/0',
    kap: '411121',
    kjs: '100',
    penghasilanKotorSebelumnya: 0,
    penghasilanKotor: 9000000,
    tarif: 5,
    pphDipotong: 450000,
    NormaPenghasilan: 100,
    dokReferensi: [
      {
        dokReferensi: 'COMMERCIALINVOICE',
        nomorDokumen: 'INV-PENGUJIAN-21',
        tanggal_Dokumen: moment().format('DDMMYYYY'),
      },
    ],
  },
})

// Computed for IDR Formatting in Input
const formattedGrossIncomeBefore = computed({
  get() {
    if (!form.value.dataDetilBp21.penghasilanKotorSebelumnya) return ''
    return new Intl.NumberFormat('id-ID').format(Number(form.value.dataDetilBp21.penghasilanKotorSebelumnya))
  },
  set(newValue: string) {
    const numericValue = newValue.replace(/[^0-9]/g, '')
    form.value.dataDetilBp21.penghasilanKotorSebelumnya = numericValue ? Number(numericValue) : 0
  }
})

const formattedGrossIncome = computed({
  get() {
    if (!form.value.dataDetilBp21.penghasilanKotor) return ''
    return new Intl.NumberFormat('id-ID').format(Number(form.value.dataDetilBp21.penghasilanKotor))
  },
  set(newValue: string) {
    const numericValue = newValue.replace(/[^0-9]/g, '')
    form.value.dataDetilBp21.penghasilanKotor = numericValue ? Number(numericValue) : 0
    calculatePPh()
  }
})

// Methods
const calculatePPh = () => {
  const gross = form.value.dataDetilBp21.penghasilanKotor || 0
  const rate = form.value.dataDetilBp21.tarif || 0
  const norm = form.value.dataDetilBp21.NormaPenghasilan || 100
  form.value.dataDetilBp21.pphDipotong = Math.round(gross * (rate / 100) * (norm / 100))
}

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val)

const validate = () => {
  Object.keys(errors).forEach((k) => delete errors[k])
  if (!form.value.npwp) errors.npwp = 'NPWP / NIK is required'
  if (!form.value.nama) errors.nama = 'Recipient name is required'
  if (!form.value.tglPemotongan) errors.tglPemotongan = 'Withholding date is required'
  if (!form.value.dataDetilBp21.kodeObjekPajak) errors.kodeObjekPajak = 'Tax object code is required'
  if (!form.value.dataDetilBp21.statusPPh) errors.statusPPh = 'PPh status is required'
  if (!form.value.dataDetilBp21.penghasilanKotor) errors.penghasilanKotor = 'Gross income is required'
  if (!form.value.dataDetilBp21.tarif) errors.tarif = 'Tax rate is required'
  return Object.keys(errors).length === 0
}

const submitCreate = async () => {
  if (!validate()) return
  submitting.value = true
  try {
    const payload = JSON.parse(JSON.stringify(form.value)) as Pph21CreatePayload
    // Convert date from YYYY-MM-DD to DDMMYYYY
    payload.tglPemotongan = moment(form.value.tglPemotongan).format('DDMMYYYY')
    // Derive masaPajak & tahunPajak from withholding date
    payload.masaPajak = moment(form.value.tglPemotongan).format('MM')
    payload.tahunPajak = moment(form.value.tglPemotongan).format('YYYY')
    // Ensure idTku is always sent
    payload.idTku = npwpPemotong + '000000'
    // Update dok referensi date
    payload.dataDetilBp21.dokReferensi[0].tanggal_Dokumen = moment(form.value.tglPemotongan).format('DDMMYYYY')
    // Strip optional integer fields that are null/undefined — .NET Int32 rejects null
    if (!payload.id) delete payload.id
    if (!payload.invoiceId) delete payload.invoiceId
    if (payload.revNo === undefined || payload.revNo === null) delete payload.revNo

    await Pph21Service.create(payload)

    notifTitle.value = 'PPh 21 Created'
    notifText.value = 'The draft has been saved successfully.'
    notifType.value = 'success'
    showNotif.value = true
    setTimeout(() => {
      showNotif.value = false
      router.push('/wht-pasal-21')
    }, 2500)
  } catch (err) {
    console.error(err)
    notifTitle.value = 'Error Creating PPh 21'
    notifText.value = 'Something went wrong. Please check required fields and try again.'
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
.text-danger {
  color: #f1416c;
}
.border-danger {
  border-color: #f1416c !important;
}
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

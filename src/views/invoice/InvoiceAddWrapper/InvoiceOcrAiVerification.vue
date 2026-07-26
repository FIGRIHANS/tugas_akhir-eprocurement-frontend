<template>
  <div
    class="p-4 w-full"
    id="reject-target-ocrAiVerification"
    data-reject-page="ocrAiVerification"
  >
    <div
      id="reject-target-ocrAiVerification-ocrAiVerification"
      class="grid grid-cols-12 gap-4"
    >
      <div class="col-span-7 space-y-4">
        <div class="card-header py-[8px] px-[20px]">
          <div class="border rounded-lg border-gray-300 p-[4px] flex items-center gap-[4px]">
            <button
              :class="[
                'btn btn-primary',
                tabOcrTab !== 'general' ? 'btn-clear info__header' : '',
              ]"
              @click="setTabOcr('general')"
            >
              General Data
            </button>
            <button
              :class="[
                'btn btn-primary',
                tabOcrTab !== 'tax' ? 'btn-clear info__header' : '',
              ]"
              @click="setTabOcr('tax')"
            >
              Tax & Invoice Verification
            </button>
          </div>
        </div>

        <div v-if="tabOcrTab === 'general'" class="bg-white shadow rounded-xl p-4">
          <h2 class="font-semibold text-lg mb-3">General Data</h2>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div v-for="(row, i) in generalData" :key="i">
              <p class="text-gray-500 text-xs">{{ row.label }}</p>
              <p class="font-semibold">{{ row.value }}</p>
            </div>
          </div>
        </div>

        <div v-if="tabOcrTab === 'general'" class="bg-white shadow rounded-xl p-4">
          <h2 class="font-semibold text-lg mb-3">General Status</h2>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div v-for="(row, i) in generalStatus" :key="i">
              <p class="text-gray-500 text-xs">{{ row.label }}</p>
              <p
                :class="[
                  'font-semibold',
                  row.status === 'success' && 'text-green-600',
                  row.status === 'warning' && 'text-yellow-500',
                  row.status === 'error' && 'text-red-500',
                ]"
              >
                {{ row.value }}
              </p>
            </div>
          </div>
        </div>

        <div v-if="tabOcrTab === 'tax'" class="bg-white shadow rounded-xl p-4">
          <div class="flex justify-between mb-3">
            <h2 class="font-semibold text-lg">Invoice Verification</h2>
            <div class="flex gap-2">
              <button
                :class="[
                  'btn',
                  taxVerificationClicked
                    ? 'btn-primary'
                    : 'bg-white text-teal-600 border-2 border-teal-600 hover:bg-teal-50',
                ]"
                @click="handleTaxVerification"
              >
                Tax Verification
              </button>
            </div>
          </div>
          <div class="border rounded-lg">
            <table class="w-full overflow-x-auto text-sm">
              <thead class="bg-gray-100">
                <tr>
                  <th class="p-2 text-left">Header</th>
                  <th class="p-2 text-left">QR Faktur Data</th>
                  <th class="p-2 text-left">FP Verifikasi</th>
                  <th class="p-2 text-left">Invoice OCR</th>
                  <th class="p-2 text-left">Invoice Verifikasi</th>
                  <th class="p-2 text-left">Remarks</th>
                </tr>
              </thead>

              <tbody v-if="isVerifyData">
                <tr
                  v-for="(row, index) in tableData"
                  :key="index"
                  :class="[editableRemarks[index] === NOT_MATCHED && 'bg-red-100', 'border-b']"
                >
                  <td class="p-2">{{ row.header }}</td>
                  <td class="p-2">{{ row.qr }}</td>

                  <td class="p-2">
                    <i
                      class="ki-filled ki-check-circle text-green-500"
                      v-if="row.fpVerified === true"
                    ></i>
                    <div
                      class="relative group flex items-center w-fit"
                      v-else-if="row.fpVerified === false"
                    >
                      <i class="ki-filled ki-cross-circle text-red-500 cursor-help"></i>
                      <!-- Tooltip -->
                      <div
                        v-if="shouldShowTooltip(row.header)"
                        class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block w-max px-2 py-1 bg-red-600 text-white text-center text-xs rounded shadow-lg z-10 whitespace-pre-line"
                      >
                        {{ getTooltipMessage(row.header, row.qr, 'QR') }}
                        <!-- Arrow -->
                        <div
                          class="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-red-600"
                        ></div>
                      </div>
                    </div>
                    <i class="ki-filled ki-minus-circle text-gray-500" v-else></i>
                  </td>

                  <td class="p-2">
                    <input
                      v-if="getOcrKey(row.header)"
                      v-model="ocrData[getOcrKey(row.header)]"
                      type="text"
                      class="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      :disabled="!isOcrFieldEditable(index, ocrData[getOcrKey(row.header)] || '')"
                    />
                    <span v-else class="text-gray-400">-</span>
                  </td>

                  <td class="p-2">
                    <span v-if="row.invoiceVerified === '-' || row.invoiceVerified === 'none'">
                      <i class="ki-filled ki-minus-circle text-gray-500"></i>
                    </span>
                    <template v-else>
                      <i
                        class="ki-filled ki-check-circle text-green-500"
                        v-if="row.invoiceVerified === true"
                      ></i>
                      <div
                        class="relative group flex items-center w-fit"
                        v-else-if="row.invoiceVerified === false"
                      >
                        <i class="ki-filled ki-cross-circle text-red-500 cursor-help"></i>
                        <!-- Tooltip -->
                        <div
                          v-if="shouldShowTooltip(row.header)"
                          class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block w-max px-2 py-1 bg-red-600 text-white text-center text-xs rounded shadow-lg z-10 whitespace-pre-line"
                        >
                          {{ getTooltipMessage(row.header, row.ocr, 'OCR') }}
                          <!-- Arrow -->
                          <div
                            class="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-red-600"
                          ></div>
                        </div>
                      </div>
                    </template>
                  </td>

                  <td class="p-2">
                    <select
                      v-model="editableRemarks[index]"
                      class="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                      :disabled="isRemarksSelectDisabled(index, row.remarks)"
                    >
                      <option v-if="editableRemarks[index] === '1'" value="1">Auto Verified</option>
                      <option value="2">Not match</option>
                      <option value="3">Manual Verified</option>
                    </select>
                  </td>
                </tr>
              </tbody>

              <tbody v-if="isLoadUpload">
                <tr>
                  <td>
                    <div class="flex justify-center items-center py-6">
                      <svg
                        class="animate-spin h-6 w-6 text-teal-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          class="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          stroke-width="4"
                        />
                        <path
                          class="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                      </svg>
                      <span class="ml-3 text-sm text-gray-600"> Verifying document... </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 class="font-semibold text-lg mt-4">PJAP Verification</h2>
          <div class="border rounded-lg mt-5">
            <table class="w-full overflow-x-auto text-sm">
              <thead class="bg-gray-100">
                <tr>
                  <th class="p-2 text-left">Field</th>
                  <th class="p-2 text-left">QR Faktur Status</th>
                  <th class="p-2 text-left">PJAP Status</th>
                  <th class="p-2 text-left">Remark</th>
                </tr>
              </thead>

              <tbody v-if="isVerify">
                <tr
                  v-for="(row, index) in bjapVerify"
                  :key="index"
                  :class="[{ 'bg-red-100': row.remarks === false }, 'border-b']"
                >
                  <td class="p-2">{{ row.header }}</td>
                  <td class="p-2">{{ row.qr }}</td>
                  <td class="p-2">{{ row.fpVerified }}</td>

                  <td class="p-2">
                    <div class="flex gap-2 items-center">
                      <i class="ki-filled ki-check-circle text-green-500" v-if="row.remarks"></i>
                      <i class="ki-filled ki-cross-circle text-red-500" v-else></i>
                      <p class="text-green-600" v-if="row.remarks === true">Matched</p>
                      <p class="text-red-600 font-semibold" v-else>Didn't Matched</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="col-span-5">
        <div class="bg-white shadow rounded-xl p-4 h-[90vh] flex flex-col">
          <div class="flex justify-between items-start gap-3 mb-3">
            <div>
              <h2 class="font-semibold text-lg">Preview Dokumen</h2>
            </div>
            <select v-model="selectedDocumentType" class="select w-[50%] justify-end shrink-0">
              <option v-for="item of documentTypeList" :key="item.code" :value="item.code">
                {{ item.name }}
              </option>
            </select>
          </div>

          <div class="flex-1 border rounded-lg overflow-hidden relative">
            <div
              v-if="isPreviewLoading"
              class="absolute inset-0 flex items-center justify-center bg-white/80 z-10"
            >
              <UiLoading size="md" variant="primary" />
            </div>
            <iframe
              v-if="previewUrl && !isPreviewLoading"
              :src="`${previewUrl}#navpanes=0&toolbar=0&statusbar=0&messages=0&view=FitH`"
              class="w-full h-full"
              style="border: none"
            ></iframe>
            <div v-else-if="!isPreviewLoading" class="text-gray-500 italic p-4">
              Tidak ada dokumen dari Invoice Header
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white shadow rounded-xl p-4 col-span-12">
        <InvoicePoGrView v-if="checkPo()" />
        <InvoiceItemView v-if="checkIsNonPo()" />
        <AdditionalCostView
          v-if="(checkIsWithoutDp() || checkPoWithDp() || checkIsPoPibCc()) && !checkIsNonPo()"
        />
      </div>
    </div>

    <UiModal v-model="showModalSuccess" size="sm">
      <div class="text-center mb-6">
        <ModalSuccessLogo class="mx-auto" />
        <h3 class="text-center text-lg font-medium">VAT Credit Posted Successfully</h3>
        <p class="text-center text-base text-gray-600 mb-5">
          VAT credit has been posted to the system.
        </p>
      </div>
    </UiModal>

    <!-- Loading Modal -->
    <UiModal v-model="isSyncLoading" size="sm" hide-header hide-close static>
      <div class="flex flex-col items-center gap-4 py-6">
        <UiLoading size="lg" variant="primary" class="mx-auto" />
        <div class="text-center">
          <h3 class="text-lg font-medium text-gray-900 mb-2">Verifying with DJP...</h3>
          <p class="text-sm text-gray-700">Please wait, matching tax invoice data.</p>
        </div>
      </div>
    </UiModal>
  </div>
</template>

<script lang="ts" setup>
import {
  ref,
  inject,
  onMounted,
  onUnmounted,
  watch,
  nextTick,
  defineAsyncComponent,
  reactive,
  computed,
  type Ref,
} from 'vue'
import type { formTypes } from '../types/invoiceAddWrapper'
import type { invoiceQrData } from '../types/invoiceQrdata'
import type { invoiceOcrData } from '../types/invoiceOcrData'
import type { OcrVerificationSnapshot } from '../types/ocrVerificationSnapshot'
import { defaultColumn, invoiceDpColumn, poCCColumn, manualAddColumn } from '@/static/invoicePoGr'
import { useRoute } from 'vue-router'
import UiModal from '@/components/modal/UiModal.vue'
import ModalSuccessLogo from '@/assets/svg/ModalSuccessLogo.vue'
import UiLoading from '@/components/UiLoading.vue'
import moment from 'moment'
import { parseIndoDate } from '@/composables/parseIndoDate'
import {
  deriveTkuFromNpwp,
  isTaxFakturSectionLabel,
  normalizeTaxFakturScanResult,
} from '@/core/utils/taxFakturVendor'
import { isRejectedInvoiceStatus } from '@/core/utils/invoiceSubmissionRoute'
import { useInvoiceVerificationStore } from '@/stores/views/invoice/verification'
import {
  hasBlobSasToken,
  resolveDocumentPreviewUrl,
  resolveDocumentUrlForApi,
  warnUnsignedDocumentUrl,
} from '@/composables/documentPreview'
import type { responseFileTypes } from '../types/invoiceDocument'

/* ---------------- async components ---------------- */

const InvoicePoGrView = defineAsyncComponent(
  () => import('./InvoicePreview/InvoicePoGrViewOcr.vue'),
)
const InvoiceItemView = defineAsyncComponent(
  () => import('./InvoicePreview/InvoiceItemViewOcr.vue'),
)
const AdditionalCostView = defineAsyncComponent(
  () => import('./InvoicePreview/AdditionalCostViewOcr.vue'),
)

/* ---------------- base ---------------- */
const route = useRoute()
const form = inject<formTypes>('form')
const markOcrPjapVerified = inject<(verified?: boolean) => void>('markOcrPjapVerified')
const isOcrPjapVerified = inject<Ref<boolean> | undefined>('isOcrPjapVerified')
const ocrPjapVerifiedInvoiceUId = inject<Ref<string> | undefined>('ocrPjapVerifiedInvoiceUId')
const ocrVerificationSnapshot = inject<Ref<OcrVerificationSnapshot | null> | undefined>(
  'ocrVerificationSnapshot',
)
const saveOcrVerificationSnapshot = inject<
  ((snapshot: OcrVerificationSnapshot) => void) | undefined
>('saveOcrVerificationSnapshot')
const setInvoiceSubmissionTab = inject<(tab: string) => void>('setInvoiceSubmissionTab')
const refreshInvoicePoGrAutofill = inject<(() => Promise<unknown>) | undefined>(
  'refreshInvoicePoGrAutofill',
)
const invoiceVerificationStore = useInvoiceVerificationStore()

const tabOcrTab = ref<'general' | 'tax'>('general')
const typeForm = ref<string>('po')
const isVerify = ref(false)
const isVerifyData = ref(false)
const isLoadUpload = ref(false)
const showModalSuccess = ref(false)
const selectedDocumentType = ref('1')
const previewUrl = ref('')
const isPreviewLoading = ref(false)
let previewObjectUrl: string | null = null
const taxVerificationClicked = ref(false)
const pjapVerificationClicked = ref(false)

const manualApprove = reactive<Record<number, boolean>>({})
const manualReject = reactive<Record<number, boolean>>({})

/* ---------------- helpers ---------------- */
const isEmpty = (val: unknown) =>
  val === undefined || val === null || val === '' || val === '-'


const getFormVendorTaxReferences = (): string[] => {
  const refs = [
    deriveTkuFromNpwp(form?.vendorNPWP),
    deriveTkuFromNpwp(form?.npwp),
    form?.vendorName,
  ]

  return refs
    .map((item) => String(item || '').trim())
    .filter((item, index, list) => item && list.indexOf(item) === index)
}

const matchesFormVendorTaxName = (value?: string, npwpSupplier?: string): boolean => {
  const scanned = String(value || '').trim()
  if (!scanned || isTaxFakturSectionLabel(scanned)) return false

  const refs = getFormVendorTaxReferences()
  if (refs.some((ref) => ref === scanned)) return true

  const rowTku = deriveTkuFromNpwp(npwpSupplier)
  if (!rowTku || rowTku !== scanned) return false
  return refs.some((ref) => ref === rowTku)
}

const parseCurrency = (value: string | number): number => {
  if (typeof value === 'number') return value
  if (!value || value === '-') return 0
  // Remove currency symbol, dots, and replace comma with dot for decimals (Indonesian format assumption)
  const clean = value.toString().replace(/[^0-9,-]+/g, '')
  // If it has comma, likely decimal separator in ID format
  return parseFloat(clean.replace(/\./g, '').replace(',', '.'))
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value)
}

const getDifference = (header: string, docValue: string) => {
  let formValue = 0
  const docNum = parseCurrency(docValue)

  if (header === 'Nilai Penjualan') formValue = Number(form?.subtotal || 0)
  if (header === 'PPN') formValue = Number(form?.vatAmount || 0)
  //  if (header === 'PPN BM') formValue = Number(form?.ppnbm || 0) // Assuming usage

  const diff = formValue - docNum
  return diff
}

const TOOLTIP_HEADERS = ['Nilai Penjualan', 'DPP Lainnya', 'PPN', 'PPN BM']
const shouldShowTooltip = (header: string) => TOOLTIP_HEADERS.includes(header)

const getTooltipMessage = (header: string, docValue: string, source: 'QR' | 'OCR') => {
  const diff = getDifference(header, docValue)
  const formattedDiff = formatCurrency(Math.abs(diff))

  // Mapping header name to form field name for better clarity
  let formField = 'Input Form'
  if (header === 'Nilai Penjualan') formField = 'Subtotal Form'
  if (header === 'PPN') formField = 'VAT Amount Form'

  return `Terdapat selisih antara\n${formField} dengan ${source}\nsebesar ${formattedDiff}`
}

type VerificationResult = boolean | 'none'

const normalizeDigits = (value?: string | null) => String(value || '').replace(/\D/g, '')

const normalizeTaxDateKey = (value?: string | Date | null): string => {
  if (!value) return ''
  const raw = value instanceof Date ? value.toISOString() : String(value)
  const parsed = moment(raw, ['DD MMMM YYYY', 'YYYY-MM-DD', 'YYYY/MM/DD', moment.ISO_8601], true)
  return parsed.isValid() ? parsed.format('YYYY-MM-DD') : raw.trim()
}

const matchesFormAmount = (header: string, value?: string): VerificationResult => {
  if (isEmpty(value)) return 'none'
  return Math.abs(getDifference(header, value)) < 1
}

const matchesFormTaxDate = (value?: string): VerificationResult => {
  if (isEmpty(value)) return 'none'
  const formDate = normalizeTaxDateKey(form?.taxDate || form?.taxInvoiceDate)
  if (!formDate) return true
  return normalizeTaxDateKey(value) === formDate
}

const matchesFormNpwp = (value?: string): VerificationResult => {
  if (isEmpty(value)) return 'none'
  const formNpwp = normalizeDigits(form?.npwp)
  if (!formNpwp) return true
  return normalizeDigits(value) === formNpwp
}

const matchesFormNpwpCompany = (value?: string): VerificationResult => {
  if (isEmpty(value)) return 'none'
  const formNpwp = normalizeDigits(form?.npwpCompany)
  if (!formNpwp) return true
  return normalizeDigits(value) === formNpwp
}

const matchesFormTaxNo = (value?: string): VerificationResult => {
  if (isEmpty(value)) return 'none'
  const formTaxNo = String(form?.taxNoInvoice || '').trim()
  if (!formTaxNo) return true
  return formTaxNo === String(value).trim()
}

const matchesFormCompanyName = (value?: string): VerificationResult => {
  if (isEmpty(value)) return 'none'
  const company = String(form?.companyName || '').trim()
  if (!company) return true
  return company === String(value).trim()
}

const matchesFpStatus = (value?: string): VerificationResult => {
  if (isEmpty(value)) return 'none'
  return String(value).trim().toUpperCase() === 'APPROVED'
}

const applyRemarkToVerification = (index: number, base: VerificationResult): VerificationResult => {
  const remark = editableRemarks.value[index]
  if (remark === '3') return true
  if (remark === '2') return false
  return base
}

const resolveAutoRemarks = (
  qrPass: VerificationResult,
  ocrPass: VerificationResult,
  qrValue?: string,
  ocrValue?: string,
): boolean | 'none' => {
  if (qrPass === 'none' || ocrPass === 'none') return 'none'
  if (qrValue !== undefined && ocrValue !== undefined && qrValue !== ocrValue) return false
  return qrPass === true && ocrPass === true
}

const isRemarksSelectDisabled = (index: number, rowRemarks: unknown) => {
  if (rowRemarks === 'none') return true
  return editableRemarks.value[index] === '1'
}

const isOcrFieldEditable = (index: number, fieldValue: string) =>
  fieldValue !== '' && editableRemarks.value[index] !== '1'

const clearTaxScanBuffers = () => {
  const ocrKeys: (keyof invoiceOcrData)[] = [
    'vendorBuyer',
    'npwpBuyer',
    'vendorSupplier',
    'npwpSupplier',
    'taxDocumentNumber',
    'taxDocumentDate',
    'dpp',
    'ppn',
    'ppnbm',
    'status',
  ]
  ocrKeys.forEach((key) => {
    ocrData[key] = ''
  })

  qrData.taxDocumentNumber = ''
  qrData.taxDocumentDate = ''
  qrData.status = ''
}

const resetTaxVerificationState = () => {
  taxOcrScanned.value = false
  scannedOcrStatus.value = ''
  scannedTaxInvoiceNo.value = ''
  markOcrPjapVerified?.(false)
}

const isRejectedInvoice = computed(() => isRejectedInvoiceStatus(form?.status))

const hasPersistedOcrVerification = (): boolean => {
  return Boolean(
    String(form?.taxInvoiceStatus || '').trim() ||
      String(form?.taxInvoiceNumber || '').trim() ||
      String(form?.ocrVendorName || '').trim(),
  )
}

const isVerifiedForCurrentInvoice = (): boolean => {
  if (!isOcrPjapVerified?.value) return false

  const currentInvoiceUId = String(form?.invoiceUId || route.query.invoice || '').trim()
  const verifiedInvoiceUId = String(ocrPjapVerifiedInvoiceUId?.value || '').trim()

  if (!currentInvoiceUId && !verifiedInvoiceUId) return true
  if (currentInvoiceUId && verifiedInvoiceUId) {
    return currentInvoiceUId === verifiedInvoiceUId
  }

  return isOcrPjapVerified.value
}

const formatTaxDateForOcrDisplay = (value?: string | Date | null) => {
  if (!value) return ''
  const raw = value instanceof Date ? value.toISOString() : String(value)
  const parsed = moment(raw, ['YYYY-MM-DD', 'YYYY/MM/DD', moment.ISO_8601], true)
  return parsed.isValid() ? parsed.format('DD MMMM YYYY') : raw
}

const resolvePersistedTaxStatus = () => {
  const status = String(form?.taxInvoiceStatus || '').trim()
  if (status) return status
  if (isRejectedInvoice.value && hasPersistedOcrVerification()) return 'APPROVED'
  return ''
}

const populateScanDataFromForm = (target: invoiceQrData | invoiceOcrData) => {
  const status = resolvePersistedTaxStatus()
  const invoiceNo = String(form?.taxInvoiceNumber || form?.taxNoInvoice || '').trim()

  target.vendorSupplier = String(form?.ocrVendorName || '')
  target.npwpSupplier = String(form?.vendorNPWP || form?.npwp || '')
  target.vendorBuyer = String(form?.ocrCompanyName || form?.companyName || '')
  target.npwpBuyer = String(form?.npwpCompany || '')
  target.taxDocumentNumber = invoiceNo
  target.taxDocumentDate = formatTaxDateForOcrDisplay(form?.taxInvoiceDate || form?.taxDate)
  target.dpp = form?.salesAmount != null ? String(form.salesAmount) : ''
  target.ppn = form?.ocrVatAmount != null ? String(form.ocrVatAmount) : ''
  target.ppnbm = form?.ocrVatbmAmount != null ? String(form.ocrVatbmAmount) : ''
  target.status = status
}

const restoreVerificationFromPersistedForm = () => {
  if (!hasPersistedOcrVerification()) return false

  const status = resolvePersistedTaxStatus()
  const invoiceNo = String(form?.taxInvoiceNumber || form?.taxNoInvoice || '').trim()

  populateScanDataFromForm(qrData)
  populateScanDataFromForm(ocrData)

  taxOcrScanned.value = true
  scannedOcrStatus.value = status
  scannedTaxInvoiceNo.value = invoiceNo
  pjapSyncStatus.value = status || null
  taxVerificationClicked.value = true
  isVerifyData.value = true
  tabOcrTab.value = 'tax'
  reconcileRemarksWithVerification()
  return true
}

const persistVerificationSnapshot = () => {
  saveOcrVerificationSnapshot?.({
    qrData: { ...qrData },
    ocrData: { ...ocrData },
    editableRemarks: { ...editableRemarks.value },
    pjapSyncStatus: pjapSyncStatus.value,
    taxVerificationClicked: taxVerificationClicked.value,
    pjapVerificationClicked: pjapVerificationClicked.value,
    isVerify: isVerify.value,
    scannedOcrStatus: scannedOcrStatus.value,
    scannedTaxInvoiceNo: scannedTaxInvoiceNo.value,
  })
}

const restoreFromVerificationSnapshot = (): boolean => {
  const snapshot = ocrVerificationSnapshot?.value
  if (!snapshot) return false

  Object.assign(qrData, snapshot.qrData)
  Object.assign(ocrData, snapshot.ocrData)
  editableRemarks.value = { ...snapshot.editableRemarks }
  pjapSyncStatus.value = snapshot.pjapSyncStatus
  taxVerificationClicked.value = snapshot.taxVerificationClicked
  pjapVerificationClicked.value = snapshot.pjapVerificationClicked
  isVerify.value = snapshot.isVerify
  scannedOcrStatus.value = snapshot.scannedOcrStatus
  scannedTaxInvoiceNo.value = snapshot.scannedTaxInvoiceNo
  taxOcrScanned.value = true
  isVerifyData.value = true
  tabOcrTab.value = 'tax'
  reconcileRemarksWithVerification()
  return true
}

const tryRestorePreviousVerification = async (): Promise<boolean> => {
  if (isOcrPjapVerified?.value && restoreFromVerificationSnapshot()) {
    return true
  }

  if (
    (isRejectedInvoice.value || isVerifiedForCurrentInvoice()) &&
    restoreVerificationFromPersistedForm()
  ) {
    await nextTick()
    persistVerificationSnapshot()
    return true
  }

  return false
}

const handleTaxVerification = async () => {
  taxVerificationClicked.value = true
  resetTaxVerificationState()
  clearTaxScanBuffers()
  await verifyInvoice()
  pjapVerificationClicked.value = true
  await verifyByPjap()
}

/* ---------------- qr & ocr ---------------- */
const qrData = reactive<invoiceQrData>({
  vendorBuyer: '',
  npwpBuyer: '',
  vendorSupplier: '',
  npwpSupplier: '',
  taxDocumentNumber: '',
  taxDocumentDate: '',
  dpp: '',
  ppn: '',
  ppnbm: '',
  status: '',
})

const ocrData = reactive<invoiceOcrData>({
  vendorBuyer: '',
  npwpBuyer: '',
  vendorSupplier: '',
  npwpSupplier: '',
  taxDocumentNumber: '',
  taxDocumentDate: '',
  dpp: '',
  ppn: '',
  ppnbm: '',
  status: '',
})

/* ---------------- GENERAL DATA (dari Invoice Header — tab Information) ---------------- */
const formatHeaderDate = (value?: string | null) => {
  if (!value) return '-'
  const parsed = moment(value, ['YYYY-MM-DD', 'YYYY/MM/DD', moment.ISO_8601], true)
  return parsed.isValid() ? parsed.format('DD MMMM YYYY') : value
}

const generalData = computed(() => [
  { label: 'GR Document No.', value: form?.invoicePoGr?.[0]?.grDocumentNo || '-' },
  { label: 'Invoice Vendor No.', value: form?.invoiceVendorNo || '-' },
  { label: 'Invoice Date', value: formatHeaderDate(form?.invoiceDate) },
  { label: 'Tax Document No.', value: form?.taxNoInvoice || '-' },
  { label: 'Tax Document Date', value: formatHeaderDate(form?.taxDate) },
  { label: 'Vendor Name', value: form?.vendorName || '-' },
  { label: 'Company', value: form?.companyName || form?.companyCode || '-' },
  { label: 'Total Gross Amount', value: form?.totalGrossAmount ?? '-' },
  { label: 'VAT Amount', value: form?.vatAmount ?? '-' },
  { label: 'Currency', value: form?.currency || '-' },
])

/* ---------------- document type ---------------- */
const documentTypeList = ref([
  { code: '1', name: 'Tax Document' },
  { code: '2', name: 'Invoice Document' },
  { code: '3', name: 'Reference Document' },
  { code: '4', name: 'Other Document' },
])

/* ---------------- PO logic ---------------- */
const checkPo = () => typeForm.value === 'po' || typeForm.value === 'po-view'
const checkIsNonPo = () =>
  typeForm.value === 'nonpo' ||
  typeForm.value === 'cas' ||
  (route.query.type === 'non-po-view' && route.query.casType === 'cas')
const checkIsWithoutDp = () => form?.invoiceDp === '9011'
const checkPoWithDp = () => form?.invoiceDp === '9013'
const checkIsPoPibCc = () =>
  (form?.invoiceType === '902' || form?.invoiceType === '903') && form?.status > 0

/* ---------------- columns ---------------- */
const columns = ref<string[]>([])
const setColumn = () => {
  const source =
    form?.invoiceType === '903'
      ? poCCColumn
      : form?.invoiceDp === '9012'
        ? invoiceDpColumn
        : form?.invoiceType === '902'
          ? manualAddColumn
          : defaultColumn

  const base = [...source]
  base.splice(6, 0, 'Qty Match', 'Unit Price Match', 'VAT Match', 'WHT Match')
  columns.value = base
}

/* ---------------- OCR KEY ---------------- */
const getOcrKey = (header: string): keyof invoiceOcrData | null => {
  const map: Record<string, keyof invoiceOcrData> = {
    'Nama Vendor': 'vendorSupplier',
    'NPWP Vendor': 'npwpSupplier',
    Perusahaan: 'vendorBuyer',
    NPWP: 'npwpBuyer',
    'No Faktur Pajak': 'taxDocumentNumber',
    'Tanggal Faktur Pajak': 'taxDocumentDate',
    'Nilai Penjualan': 'dpp',
    PPN: 'ppn',
    'PPN BM': 'ppnbm',
    'Status Approve FP': 'status',
  }
  return map[header] ?? null
}

/* ---------------- remarks & override ---------------- */
const editableRemarks = ref<Record<number, string>>({})
const manualOverride = reactive<Record<number, boolean>>({})
const NOT_MATCHED = '2'

/* ---------------- TABLE DATA (FIXED, FULL) ---------------- */
const tableData = computed(() => {
  const qrVendorPass: VerificationResult = isEmpty(qrData.vendorSupplier)
    ? 'none'
    : matchesFormVendorTaxName(qrData.vendorSupplier, qrData.npwpSupplier)
  const ocrVendorPass: VerificationResult = isEmpty(ocrData.vendorSupplier)
    ? 'none'
    : matchesFormVendorTaxName(ocrData.vendorSupplier, ocrData.npwpSupplier)
  const qrNpwpVendorPass = matchesFormNpwp(qrData.npwpSupplier)
  const ocrNpwpVendorPass = matchesFormNpwp(ocrData.npwpSupplier)
  const qrCompanyPass = matchesFormCompanyName(qrData.vendorBuyer)
  const ocrCompanyPass = matchesFormCompanyName(ocrData.vendorBuyer)
  const qrNpwpBuyerPass = matchesFormNpwpCompany(qrData.npwpBuyer)
  const ocrNpwpBuyerPass = matchesFormNpwpCompany(ocrData.npwpBuyer)
  const qrTaxNoPass = matchesFormTaxNo(qrData.taxDocumentNumber)
  const ocrTaxNoPass = matchesFormTaxNo(ocrData.taxDocumentNumber)
  const qrTaxDatePass = matchesFormTaxDate(qrData.taxDocumentDate)
  const ocrTaxDatePass = matchesFormTaxDate(ocrData.taxDocumentDate)
  const qrDppPass = matchesFormAmount('Nilai Penjualan', qrData.dpp)
  const ocrDppPass = matchesFormAmount('Nilai Penjualan', ocrData.dpp)
  const qrPpnPass = matchesFormAmount('PPN', qrData.ppn)
  const ocrPpnPass = matchesFormAmount('PPN', ocrData.ppn)
  const qrPpnbmPass: VerificationResult = isEmpty(qrData.ppnbm)
    ? 'none'
    : normalizeDigits(qrData.ppnbm) === normalizeDigits(ocrData.ppnbm)
  const ocrPpnbmPass: VerificationResult = isEmpty(ocrData.ppnbm)
    ? 'none'
    : normalizeDigits(qrData.ppnbm) === normalizeDigits(ocrData.ppnbm)
  const qrStatusPass = matchesFpStatus(qrData.status)
  const ocrStatusPass = matchesFpStatus(ocrData.status)

  return [
    {
      header: 'Nama Vendor',
      qr: qrData.vendorSupplier || '-',
      fpVerified: applyRemarkToVerification(0, qrVendorPass),
      ocr: ocrData.vendorSupplier || '-',
      invoiceVerified: applyRemarkToVerification(0, ocrVendorPass),
      remarks: resolveAutoRemarks(
        qrVendorPass,
        ocrVendorPass,
        qrData.vendorSupplier,
        ocrData.vendorSupplier,
      ),
    },
    {
      header: 'NPWP Vendor',
      qr: qrData.npwpSupplier || '-',
      fpVerified: applyRemarkToVerification(1, qrNpwpVendorPass),
      ocr: ocrData.npwpSupplier || '-',
      invoiceVerified: applyRemarkToVerification(1, ocrNpwpVendorPass),
      remarks: resolveAutoRemarks(
        qrNpwpVendorPass,
        ocrNpwpVendorPass,
        qrData.npwpSupplier,
        ocrData.npwpSupplier,
      ),
    },
    {
      header: 'Perusahaan',
      qr: qrData.vendorBuyer || '-',
      fpVerified: applyRemarkToVerification(2, qrCompanyPass),
      ocr: ocrData.vendorBuyer || '-',
      invoiceVerified: applyRemarkToVerification(2, ocrCompanyPass),
      remarks: resolveAutoRemarks(
        qrCompanyPass,
        ocrCompanyPass,
        qrData.vendorBuyer,
        ocrData.vendorBuyer,
      ),
    },
    {
      header: 'NPWP',
      qr: qrData.npwpBuyer || '-',
      fpVerified: applyRemarkToVerification(3, qrNpwpBuyerPass),
      ocr: ocrData.npwpBuyer || '-',
      invoiceVerified: applyRemarkToVerification(3, ocrNpwpBuyerPass),
      remarks: resolveAutoRemarks(
        qrNpwpBuyerPass,
        ocrNpwpBuyerPass,
        qrData.npwpBuyer,
        ocrData.npwpBuyer,
      ),
    },
    {
      header: 'No Faktur Pajak',
      qr: qrData.taxDocumentNumber || '-',
      fpVerified: applyRemarkToVerification(4, qrTaxNoPass),
      ocr: ocrData.taxDocumentNumber || '-',
      invoiceVerified: applyRemarkToVerification(4, ocrTaxNoPass),
      remarks: resolveAutoRemarks(
        qrTaxNoPass,
        ocrTaxNoPass,
        qrData.taxDocumentNumber,
        ocrData.taxDocumentNumber,
      ),
    },
    {
      header: 'Tanggal Faktur Pajak',
      qr: qrData.taxDocumentDate || '-',
      fpVerified: applyRemarkToVerification(5, qrTaxDatePass),
      ocr: ocrData.taxDocumentDate || '-',
      invoiceVerified: applyRemarkToVerification(5, ocrTaxDatePass),
      remarks: resolveAutoRemarks(
        qrTaxDatePass,
        ocrTaxDatePass,
        qrData.taxDocumentDate,
        ocrData.taxDocumentDate,
      ),
    },
    {
      header: 'Nilai Penjualan',
      qr: qrData.dpp || '-',
      fpVerified: applyRemarkToVerification(6, qrDppPass),
      ocr: ocrData.dpp || '-',
      invoiceVerified: applyRemarkToVerification(6, ocrDppPass),
      remarks: resolveAutoRemarks(qrDppPass, ocrDppPass, qrData.dpp, ocrData.dpp),
    },
    {
      header: 'DPP Lainnya',
      qr: '-',
      fpVerified: 'none',
      ocr: '-',
      invoiceVerified: 'none',
      remarks: 'none',
    },
    {
      header: 'PPN',
      qr: qrData.ppn || '-',
      fpVerified: applyRemarkToVerification(8, qrPpnPass),
      ocr: ocrData.ppn || '-',
      invoiceVerified: applyRemarkToVerification(8, ocrPpnPass),
      remarks: resolveAutoRemarks(qrPpnPass, ocrPpnPass, qrData.ppn, ocrData.ppn),
    },
    {
      header: 'PPN BM',
      qr: qrData.ppnbm || '-',
      fpVerified: applyRemarkToVerification(9, qrPpnbmPass),
      ocr: ocrData.ppnbm || '-',
      invoiceVerified: applyRemarkToVerification(9, ocrPpnbmPass),
      remarks: resolveAutoRemarks(qrPpnbmPass, ocrPpnbmPass, qrData.ppnbm, ocrData.ppnbm),
    },
    {
      header: 'Status Approve FP',
      qr: qrData.status || '-',
      fpVerified: applyRemarkToVerification(10, qrStatusPass),
      ocr: ocrData.status || '-',
      invoiceVerified: applyRemarkToVerification(10, ocrStatusPass),
      remarks: resolveAutoRemarks(qrStatusPass, ocrStatusPass, qrData.status, ocrData.status),
    },
    {
      header: 'Reference',
      qr: '-',
      fpVerified: 'none',
      ocr: '-',
      invoiceVerified: 'none',
      remarks: 'none',
    },
  ]
})

const reconcileRemarksWithVerification = () => {
  tableData.value.forEach((row, i) => {
    if (editableRemarks.value[i] === '3') return
    if (row.remarks === true) {
      editableRemarks.value[i] = '1'
      return
    }
    if (row.remarks === false) {
      editableRemarks.value[i] = '2'
      return
    }
    editableRemarks.value[i] = '4'
  })
}

/* ---------------- PJAP ---------------- */
/* ---------------- PJAP ---------------- */
const bjapVerify = computed(() => [
  {
    header: 'FP PJAP Status',
    qr: qrData.status || '-',
    fpVerified: pjapSyncStatus.value || '-',
    remarks: pjapSyncStatus.value === 'APPROVED',
  },
])

const setTabOcr = (tab: 'general' | 'tax') => {
  tabOcrTab.value = tab
}

const isSyncLoading = ref(false)
const pjapSyncStatus = ref<string | null>(null)
/** True only after user clicks Tax Verification and OCR API returns data. */
const taxOcrScanned = ref(false)
const scannedOcrStatus = ref('')
const scannedTaxInvoiceNo = ref('')

const generalStatus = computed(() => [
  {
    label: 'OCR Status',
    value: taxOcrScanned.value ? scannedOcrStatus.value || 'Pending' : 'Pending',
    status: taxOcrScanned.value && scannedOcrStatus.value ? 'success' : 'warning',
  },
  {
    label: 'Tax Invoice No.',
    value: taxOcrScanned.value ? scannedTaxInvoiceNo.value || '-' : '-',
    status: taxOcrScanned.value && scannedTaxInvoiceNo.value ? 'success' : 'warning',
  },
  {
    label: 'DJP / FP Status',
    value:
      pjapSyncStatus.value ||
      (taxOcrScanned.value ? scannedOcrStatus.value || form?.taxInvoiceStatus || '-' : '-'),
    status:
      !!pjapSyncStatus.value ||
      (taxOcrScanned.value && !!(scannedOcrStatus.value || form?.taxInvoiceStatus))
        ? 'success'
        : 'warning',
  },
])

/* ---------------- watchers ---------------- */
watch(isVerifyData, (val) => {
  if (!val) return
  reconcileRemarksWithVerification()
})

const getDocumentPreviewSource = (doc: responseFileTypes | null | undefined): string => {
  return (doc?.previewPath || doc?.path || '').trim()
}

/** Dokumen dari Invoice Header (tab Invoice Information) — field form yang sama. */
const getFormDocumentByType = (): responseFileTypes | null | undefined => {
  if (selectedDocumentType.value === '1') return form?.tax
  if (selectedDocumentType.value === '2') return form?.invoiceDocument
  if (selectedDocumentType.value === '3') return form?.referenceDocument
  if (selectedDocumentType.value === '4') return form?.otherDocument
  return null
}

const getSelectedDocumentLabel = (): string => {
  if (selectedDocumentType.value === '1') return 'Tax Document'
  if (selectedDocumentType.value === '2') return 'Invoice Document'
  if (selectedDocumentType.value === '3') return 'Reference Document'
  if (selectedDocumentType.value === '4') return 'Other Document'
  return 'Document'
}

const revokePreviewObjectUrl = () => {
  if (previewObjectUrl) {
    URL.revokeObjectURL(previewObjectUrl)
    previewObjectUrl = null
  }
}

const updatePreviewUrl = async () => {
  revokePreviewObjectUrl()
  previewUrl.value = ''

  const source = getDocumentPreviewSource(getFormDocumentByType())
  if (!source) return

  warnUnsignedDocumentUrl(source, getSelectedDocumentLabel())
  isPreviewLoading.value = true

  try {
    const resolved = await resolveDocumentPreviewUrl(source)
    if (!resolved) return

    if (!hasBlobSasToken(source)) previewObjectUrl = resolved
    previewUrl.value = resolved
  } finally {
    isPreviewLoading.value = false
  }
}

watch(selectedDocumentType, updatePreviewUrl)

watch(
  () => [
    form?.tax?.previewPath,
    form?.tax?.path,
    form?.invoiceDocument?.previewPath,
    form?.invoiceDocument?.path,
    form?.referenceDocument?.previewPath,
    form?.referenceDocument?.path,
    form?.otherDocument?.previewPath,
    form?.otherDocument?.path,
  ],
  updatePreviewUrl,
)

watch(
  editableRemarks.value,
  (val) => {
    Object.entries(val).forEach(([key, remark]) => {
      const index = Number(key)

      if (remark === '3') {
        // Manual Verified → force centang
        manualApprove[index] = true
        manualReject[index] = false
        manualOverride[index] = true
      } else if (remark === '2') {
        // Not match → force silang
        manualReject[index] = true
        manualApprove[index] = false
      } else {
        // Auto / none → reset
        manualApprove[index] = false
        manualReject[index] = false
      }
    })

    if (isVerifyData.value) {
      persistVerificationSnapshot()
    }
  },
  { deep: true },
)

const sendUploadFile = async () => {
  if (!resolveDocumentUrlForApi(form?.tax)) {
    console.warn('Tax document URL is missing — using saved form data only')
    return
  }

  try {
    Object.assign(
      qrData,
      normalizeTaxFakturScanResult(
        (await invoiceVerificationStore.uploadFileQr(form!.tax!)) as invoiceQrData &
          Record<string, unknown>,
      ),
    )
  } catch (error) {
    console.error('Tax document QR scan failed:', error)
  }

  try {
    Object.assign(
      ocrData,
      normalizeTaxFakturScanResult(
        (await invoiceVerificationStore.uploadFileOcr(form!.tax!)) as invoiceOcrData &
          Record<string, unknown>,
      ),
    )
  } catch (error) {
    console.error('Tax document OCR failed:', error)

    if (!form?.invoiceDocument || !resolveDocumentUrlForApi(form.invoiceDocument)) return

    try {
      Object.assign(
        ocrData,
        normalizeTaxFakturScanResult(
          (await invoiceVerificationStore.uploadFileOcr(form.invoiceDocument)) as invoiceOcrData &
            Record<string, unknown>,
        ),
      )
    } catch (fallbackError) {
      console.error('Invoice document OCR fallback failed:', fallbackError)
    }
  }

  if (!ocrData.npwpSupplier && qrData.npwpSupplier) {
    ocrData.npwpSupplier = qrData.npwpSupplier
  }
  if (!qrData.npwpSupplier && ocrData.npwpSupplier) {
    qrData.npwpSupplier = ocrData.npwpSupplier
  }

  Object.assign(qrData, normalizeTaxFakturScanResult({ ...qrData }))
  Object.assign(ocrData, normalizeTaxFakturScanResult({ ...ocrData }))
}

const verifyInvoice = async () => {
  isLoadUpload.value = true
  try {
    await sendUploadFile()
    await setOcrPayload()
    isVerifyData.value = true
    const scannedNo = (ocrData.taxDocumentNumber || '').trim()
    const scannedStatus = (ocrData.status || '').trim()
    const scannedDate = (ocrData.taxDocumentDate || '').trim()
    const isTaxScanSuccess = Boolean(scannedNo || scannedStatus || scannedDate)

    taxOcrScanned.value = isTaxScanSuccess
    scannedOcrStatus.value = scannedStatus
    scannedTaxInvoiceNo.value = scannedNo
    markOcrPjapVerified?.(isTaxScanSuccess)

    if (isTaxScanSuccess) {
      tabOcrTab.value = 'tax'
      await nextTick()
      persistVerificationSnapshot()
    }
  } finally {
    isLoadUpload.value = false
  }
}

const verifyByPjap = async () => {
  // User request: Hit API even if data is missing, to show "Not Match" in UI
  // if (!ocrData.taxDocumentNumber || !ocrData.npwpSupplier || !ocrData.taxDocumentDate) {
  //   console.warn('Missing OCR data for PJAP Sync')
  //   return
  // }

  console.log('Starting PJAP Sync...') // FORCE UPDATE
  isSyncLoading.value = true
  const parts = (ocrData.taxDocumentDate || '').split(' ')
  let month = 0
  let year = 0

  const monthMap: Record<string, number> = {
    januari: 1,
    februari: 2,
    maret: 3,
    april: 4,
    mei: 5,
    juni: 6,
    juli: 7,
    agustus: 8,
    september: 9,
    oktober: 10,
    november: 11,
    desember: 12,
    january: 1,
    february: 2,
    march: 3,
    may: 5,
    june: 6,
    july: 7,
    august: 8,
    october: 10,
    december: 12,
  }

  if (parts.length >= 3) {
    const mStr = parts[1].toLowerCase()
    month = monthMap[mStr] || 0
    year = parseInt(parts[2])
  }

  // Fallback
  if (!month || !year) {
    const m = moment(ocrData.taxDocumentDate)
    if (m.isValid()) {
      month = m.month() + 1
      year = m.year()
    }
  }

  if (month && year) {
    // Normal case
  } else {
    // Fallback if date parsing fails: send 0 or valid defaults if needed
    // User wants to hit API anyway
  }

  try {
    const res = await invoiceVerificationStore.sync({
      companyCode: form?.companyCode || '',
      noFaktur: ocrData.taxDocumentNumber || '',
      npwpVendor: ocrData.npwpSupplier || '',
      masaPajak: month || 0,
      tahunPajak: year || 0,
    })
    pjapSyncStatus.value = res?.taxInvoiceStatus || 'NOT MATCHED'
  } catch (error) {
    console.error('PJAP Sync failed', error)
    pjapSyncStatus.value = 'ERROR' // Will show as Not Match in UI
  } finally {
    isVerify.value = true
    isSyncLoading.value = false
    markOcrPjapVerified?.(taxOcrScanned.value)
    await nextTick()
    persistVerificationSnapshot()
    setInvoiceSubmissionTab?.('information')
  }
}

const setOcrPayload = async () => {
  if (!form) return

  // Map OCR payload into flattened form fields
  form.ocrVendorName = ocrData.vendorSupplier
  form.vendorNPWP = ocrData.npwpSupplier
  form.ocrCompanyName = ocrData.vendorBuyer
  form.npwpCompany = ocrData.npwpBuyer
  form.taxInvoiceNumber = ocrData.taxDocumentNumber
  form.taxInvoiceDate = parseIndoDate(ocrData.taxDocumentDate)
  form.salesAmount = parseFloat(ocrData.dpp) || 0
  form.otherDPP = 0
  form.ocrVatAmount = parseFloat(ocrData.ppn) || 0
  form.ocrVatbmAmount = parseFloat(ocrData.ppnbm) || 0
  form.taxInvoiceStatus = ocrData.status
  form.referenceNo = ''
  form.createdBy = ''
  form.createdUtcDate = moment().format()
  form.modifiedBy = ''
  form.modifiedUtcDate = moment().format()
}

/* ---------------- mount ---------------- */
onUnmounted(() => {
  revokePreviewObjectUrl()
})

onMounted(async () => {
  if (!(await tryRestorePreviousVerification())) {
    resetTaxVerificationState()
  }
  setColumn()
  typeForm.value = route.query.type?.toString().toLowerCase() || 'po'
  void updatePreviewUrl()
  void refreshInvoicePoGrAutofill?.()
})
</script>

<style lang="scss" scoped>
@use '../styles/invoice-preview.scss';
</style>

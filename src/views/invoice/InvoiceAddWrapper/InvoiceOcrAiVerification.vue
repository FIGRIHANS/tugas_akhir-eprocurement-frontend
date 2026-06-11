<template>
  <div class="p-4 w-full">
    <div class="grid grid-cols-12 gap-4">
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
          <p class="text-xs text-gray-500 mb-3">
            Data dari Invoice Header (tab Invoice Information)
          </p>
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

              <button
                :class="[
                  'btn',
                  pjapVerificationClicked
                    ? 'btn-primary'
                    : 'bg-white text-teal-600 border-2 border-teal-600 hover:bg-teal-50',
                ]"
                @click="handlePjapVerification"
                :disabled="isSyncLoading"
              >
                {{ isSyncLoading ? 'Verifying...' : 'Verify By PJAP' }}
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
                      :disabled="
                        ocrData[getOcrKey(row.header)] == '' || editableRemarks[index] === '1'
                      "
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
                      <div class="relative group flex items-center w-fit" v-else>
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
                      :disabled="editableRemarks[index] === '1' || editableRemarks[index] === '4'"
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
  defineAsyncComponent,
  reactive,
  computed,
} from 'vue'
import type { formTypes } from '../types/invoiceAddWrapper'
import type { invoiceQrData } from '../types/invoiceQrdata'
import type { invoiceOcrData } from '../types/invoiceOcrData'
import { defaultColumn, invoiceDpColumn, poCCColumn, manualAddColumn } from '@/static/invoicePoGr'
import { useRoute } from 'vue-router'
import UiModal from '@/components/modal/UiModal.vue'
import ModalSuccessLogo from '@/assets/svg/ModalSuccessLogo.vue'
import UiLoading from '@/components/UiLoading.vue'
import moment from 'moment'
import { parseIndoDate } from '@/composables/parseIndoDate'
import { useInvoiceVerificationStore } from '@/stores/views/invoice/verification'
import {
  hasBlobSasToken,
  resolveDocumentPreviewUrl,
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
const isEmpty = (val: any) => val === undefined || val === null || val === '' || val === '-'

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

const handleTaxVerification = () => {
  taxVerificationClicked.value = true
  verifyInvoice()
}

const handlePjapVerification = () => {
  pjapVerificationClicked.value = true
  verifyByPjap()
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
  return [
    {
      header: 'Nama Vendor',
      qr: qrData.vendorSupplier || '-',
      fpVerified:
        editableRemarks.value[0] === '3'
          ? true
          : editableRemarks.value[0] === '2'
            ? false
            : isEmpty(qrData.vendorSupplier)
              ? 'none'
              : form?.vendorName == qrData.vendorSupplier,
      ocr: ocrData.vendorSupplier || '-',
      invoiceVerified:
        editableRemarks.value[0] === '3'
          ? true
          : editableRemarks.value[0] === '2'
            ? false
            : isEmpty(ocrData.vendorSupplier)
              ? 'none'
              : form?.vendorName == ocrData.vendorSupplier,
      remarks:
        isEmpty(qrData.vendorSupplier) || isEmpty(ocrData.vendorSupplier)
          ? 'none'
          : form?.vendorName == qrData.vendorSupplier && form?.vendorName == ocrData.vendorSupplier,
    },
    {
      header: 'NPWP Vendor',
      qr: qrData.npwpSupplier || '-',
      fpVerified:
        editableRemarks.value[1] === '3'
          ? true
          : editableRemarks.value[1] === '2'
            ? false
            : isEmpty(qrData.npwpSupplier)
              ? 'none'
              : form?.npwp == qrData.npwpSupplier,
      ocr: ocrData.npwpSupplier || '-',
      invoiceVerified:
        editableRemarks.value[1] === '3'
          ? true
          : editableRemarks.value[1] === '2'
            ? false
            : isEmpty(ocrData.npwpSupplier)
              ? 'none'
              : form?.npwp == ocrData.npwpSupplier,
      remarks:
        isEmpty(qrData.npwpSupplier) || isEmpty(ocrData.npwpSupplier)
          ? 'none'
          : form?.npwp == qrData.npwpSupplier && form?.npwp == ocrData.npwpSupplier,
    },
    {
      header: 'Perusahaan',
      qr: qrData.vendorBuyer || '-',
      fpVerified:
        editableRemarks.value[2] === '3'
          ? true
          : editableRemarks.value[2] === '2'
            ? false
            : isEmpty(qrData.vendorBuyer)
              ? 'none'
              : form?.companyName == qrData.vendorBuyer,
      ocr: ocrData.vendorBuyer || '-',
      invoiceVerified:
        editableRemarks.value[2] === '3'
          ? true
          : editableRemarks.value[2] === '2'
            ? false
            : isEmpty(ocrData.vendorBuyer)
              ? 'none'
              : form?.companyName == ocrData.vendorBuyer,
      remarks:
        isEmpty(qrData.vendorBuyer) || isEmpty(ocrData.vendorBuyer)
          ? 'none'
          : form?.companyName == qrData.vendorBuyer && form?.companyName == ocrData.vendorBuyer,
    },
    {
      header: 'NPWP',
      qr: qrData.npwpBuyer || '-',
      fpVerified:
        editableRemarks.value[3] === '3'
          ? true
          : editableRemarks.value[3] === '2'
            ? false
            : isEmpty(qrData.npwpBuyer)
              ? 'none'
              : true,
      ocr: ocrData.npwpBuyer || '-',
      invoiceVerified:
        editableRemarks.value[3] === '3'
          ? true
          : editableRemarks.value[3] === '2'
            ? false
            : isEmpty(ocrData.npwpBuyer)
              ? 'none'
              : true,
      remarks: isEmpty(qrData.npwpBuyer) || isEmpty(ocrData.npwpBuyer) ? 'none' : true,
    },
    {
      header: 'No Faktur Pajak',
      qr: qrData.taxDocumentNumber || '-',
      fpVerified:
        editableRemarks.value[4] === '3'
          ? true
          : editableRemarks.value[4] === '2'
            ? false
            : isEmpty(qrData.taxDocumentNumber)
              ? 'none'
              : form?.taxNoInvoice == qrData.taxDocumentNumber,
      ocr: ocrData.taxDocumentNumber || '-',
      invoiceVerified:
        editableRemarks.value[4] === '3'
          ? true
          : editableRemarks.value[4] === '2'
            ? false
            : isEmpty(ocrData.taxDocumentNumber)
              ? 'none'
              : form?.taxNoInvoice == ocrData.taxDocumentNumber,
      remarks:
        isEmpty(qrData.taxDocumentNumber) || isEmpty(ocrData.taxDocumentNumber)
          ? 'none'
          : form?.taxNoInvoice == qrData.taxDocumentNumber &&
            form?.taxNoInvoice == ocrData.taxDocumentNumber,
    },
    {
      header: 'Tanggal Faktur Pajak',
      qr: qrData.taxDocumentDate || '-',
      fpVerified:
        editableRemarks.value[5] === '3'
          ? true
          : editableRemarks.value[5] === '2'
            ? false
            : isEmpty(qrData.taxDocumentDate)
              ? 'none'
              : true,
      ocr: ocrData.taxDocumentDate || '-',
      invoiceVerified:
        editableRemarks.value[5] === '3'
          ? true
          : editableRemarks.value[5] === '2'
            ? false
            : isEmpty(ocrData.taxDocumentDate)
              ? 'none'
              : true,
      remarks: isEmpty(qrData.taxDocumentDate) || isEmpty(ocrData.taxDocumentDate) ? 'none' : true,
    },
    {
      header: 'Nilai Penjualan',
      qr: qrData.dpp || '-',
      fpVerified:
        editableRemarks.value[6] === '3'
          ? true
          : editableRemarks.value[6] === '2'
            ? false
            : isEmpty(qrData.dpp)
              ? 'none'
              : Math.abs(getDifference('Nilai Penjualan', qrData.dpp)) < 1,
      ocr: ocrData.dpp || '-',
      invoiceVerified:
        editableRemarks.value[6] === '3'
          ? true
          : editableRemarks.value[6] === '2'
            ? false
            : isEmpty(ocrData.dpp)
              ? 'none'
              : Math.abs(getDifference('Nilai Penjualan', ocrData.dpp)) < 1,
      remarks: isEmpty(qrData.dpp) || isEmpty(ocrData.dpp) ? 'none' : true,
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
      fpVerified:
        editableRemarks.value[8] === '3'
          ? true
          : editableRemarks.value[8] === '2'
            ? false
            : isEmpty(qrData.ppn)
              ? 'none'
              : Math.abs(getDifference('PPN', qrData.ppn)) < 1,
      ocr: ocrData.ppn || '-',
      invoiceVerified:
        editableRemarks.value[8] === '3'
          ? true
          : editableRemarks.value[8] === '2'
            ? false
            : isEmpty(ocrData.ppn)
              ? 'none'
              : Math.abs(getDifference('PPN', ocrData.ppn)) < 1,
      remarks: isEmpty(qrData.ppn) || isEmpty(ocrData.ppn) ? 'none' : true,
    },
    {
      header: 'PPN BM',
      qr: qrData.ppnbm || '-',
      fpVerified:
        editableRemarks.value[9] === '3'
          ? true
          : editableRemarks.value[9] === '2'
            ? false
            : isEmpty(qrData.ppnbm)
              ? 'none'
              : true,
      ocr: ocrData.ppnbm || '-',
      invoiceVerified:
        editableRemarks.value[9] === '3'
          ? true
          : editableRemarks.value[9] === '2'
            ? false
            : isEmpty(ocrData.ppnbm)
              ? 'none'
              : true,
      remarks: isEmpty(qrData.ppnbm) || isEmpty(ocrData.ppnbm) ? 'none' : true,
    },
    {
      header: 'Status Approve FP',
      qr: qrData.status || '-',
      fpVerified:
        editableRemarks.value[10] === '3'
          ? true
          : editableRemarks.value[10] === '2'
            ? false
            : isEmpty(qrData.status)
              ? 'none'
              : true,
      ocr: ocrData.status || '-',
      invoiceVerified:
        editableRemarks.value[10] === '3'
          ? true
          : editableRemarks.value[10] === '2'
            ? false
            : isEmpty(ocrData.status)
              ? 'none'
              : true,
      remarks: isEmpty(qrData.status) || isEmpty(ocrData.status) ? 'none' : true,
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

const generalStatus = computed(() => [
  {
    label: 'OCR Status',
    value: form?.taxInvoiceStatus || '-',
    status: form?.taxInvoiceStatus ? 'success' : 'warning',
  },
  {
    label: 'Tax Invoice No.',
    value: form?.taxInvoiceNumber || '-',
    status: form?.taxInvoiceNumber ? 'success' : 'warning',
  },
  {
    label: 'DJP / FP Status',
    value: pjapSyncStatus.value || form?.taxInvoiceStatus || '-',
    status: pjapSyncStatus.value || form?.taxInvoiceStatus ? 'success' : 'warning',
  },
])

/* ---------------- watchers ---------------- */
watch(isVerifyData, (val) => {
  if (!val) return
  tableData.value.forEach((row, i) => {
    if (editableRemarks.value[i] === undefined) {
      editableRemarks.value[i] = row.remarks === true ? '1' : row.remarks === false ? '2' : '4'
    }
    if (editableRemarks.value[i] === '3') manualOverride[i] = true
  })
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
  },
  { deep: true },
)

/* ---------------- upload ---------------- */
const sendUploadFile = async () => {
  Object.assign(ocrData, await invoiceVerificationStore.uploadFileOcr(form?.tax?.previewPath))
  Object.assign(qrData, await invoiceVerificationStore.uploadFileQr(form?.tax?.previewPath))
}

const verifyInvoice = async () => {
  isLoadUpload.value = true
  await sendUploadFile()

  await setOcrPayload()

  isLoadUpload.value = false
  isVerifyData.value = true
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
  }
}

const setOcrPayload = async () => {
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

onMounted(() => {
  setColumn()
  typeForm.value = route.query.type?.toString().toLowerCase() || 'po'
  void updatePreviewUrl()

  // If form has data (Edit Mode), populate ocrData so verifyByPjap works
  if (form?.taxInvoiceNumber) {
    ocrData.vendorSupplier = form.ocrVendorName || ''
    ocrData.npwpSupplier = form.vendorNPWP || ''
    ocrData.vendorBuyer = form.ocrCompanyName || ''
    ocrData.npwpBuyer = form.npwpCompany || ''
    ocrData.taxDocumentNumber = form.taxInvoiceNumber || ''
    // taxInvoiceDate usually YYYY-MM-DD from DB, verifyByPjap handles it via fallback
    ocrData.taxDocumentDate = form.taxInvoiceDate ? String(form.taxInvoiceDate) : ''
    ocrData.dpp = form.salesAmount?.toString() || ''
    ocrData.ppn = form.ocrVatAmount?.toString() || ''
    ocrData.ppnbm = form.ocrVatbmAmount?.toString() || ''
    ocrData.status = form.taxInvoiceStatus || ''
  }
})
</script>

<style lang="scss" scoped>
@use '../styles/invoice-preview.scss';
</style>

<template>
  <div class="p-4 w-full">
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-7 space-y-4">
        <div class="card-header py-[8px] px-[20px]">
          <div class="border rounded-lg border-gray-300 p-[4px] flex items-center gap-[4px]">
            <button
              class="btn btn-primary"
              :class="{ 'btn-clear info__header': tabOcrTab !== 'general' }"
              @click="setTabOcr('general')"
            >
              General Data
            </button>
            <button
              class="btn btn-primary"
              :class="{ 'btn-clear info__header': tabOcrTab !== 'tax' }"
              @click="setTabOcr('tax')"
            >
              Tax & Invoice Verification
            </button>
            <button
              class="btn btn-primary"
              :class="{ 'btn-clear info__header': tabOcrTab !== 'ai' }"
              @click="setTabOcr('ai')"
            >
              AI Action
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
              <UiButton
                class="px-3 py-1 bg-blue-600 text-white rounded-lg"
                @click="verifyInvoice()"
              >
                Tax Verification
              </UiButton>

              <UiButton
                class="px-3 py-1 bg-blue-600 text-white rounded-lg"
                @click="verifyByPjap"
                :disabled="isSyncLoading"
              >
                Verify By PJAP
              </UiButton>
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
                    <i
                      class="ki-filled ki-cross-circle text-red-500"
                      v-else-if="row.fpVerified === false"
                    ></i>
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
                      <i class="ki-filled ki-cross-circle text-red-500" v-else></i>
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
                        class="animate-spin h-6 w-6 text-blue-600"
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

        <div
          v-if="tabOcrTab === 'ai'"
          class="bg-white shadow-xl rounded-xl p-6 mt-4 border border-red-400"
        >
          <h2 class="font-bold text-xl text-red-700 mb-4 flex items-center gap-2">AI Action 🤖</h2>
        </div>
      </div>

      <div class="col-span-5">
        <div class="bg-white shadow rounded-xl p-4 h-[90vh] flex flex-col">
          <div class="flex justify-between items-center mb-3">
            <h2 class="font-semibold text-lg">Preview Dokumen</h2>
            <select v-model="selectedDocumentType" class="select w-[50%] justify-end">
              <option v-for="item of documentTypeList" :key="item.code" :value="item.code">
                {{ item.name }}
              </option>
            </select>
          </div>

          <div class="flex-1 border rounded-lg overflow-hidden">
            <iframe
              v-if="previewUrl"
              :src="`${previewUrl}#navpanes=0&toolbar=0&statusbar=0&messages=0&view=FitH`"
              class="w-full h-full"
              style="border: none"
            ></iframe>
            <div v-else class="text-gray-500 italic p-4">Tidak ada URL dokumen</div>
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
  </div>
</template>

<script lang="ts" setup>
import { ref, inject, onMounted, watch, defineAsyncComponent, reactive, computed } from 'vue'
import type { formTypes } from '../types/invoiceAddWrapper'
import type { invoiceQrData } from '../types/invoiceQrdata'
import type { invoiceOcrData } from '../types/invoiceOcrData'
import { defaultColumn, invoiceDpColumn, poCCColumn, manualAddColumn } from '@/static/invoicePoGr'
import { useRoute } from 'vue-router'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiModal from '@/components/modal/UiModal.vue'
import ModalSuccessLogo from '@/assets/svg/ModalSuccessLogo.vue'
import moment from 'moment'
import { useInvoiceVerificationStore } from '@/stores/views/invoice/verification'

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

const tabOcrTab = ref<'general' | 'tax' | 'ai'>('general')
const typeForm = ref<string>('po')
const isVerify = ref(false)
const isVerifyData = ref(false)
const isLoadUpload = ref(false)
const showModalSuccess = ref(false)
const selectedDocumentType = ref('1')
const previewUrl = ref(form?.tax?.previewPath ?? '')

const manualApprove = reactive<Record<number, boolean>>({})
const manualReject = reactive<Record<number, boolean>>({})

/* ---------------- helpers ---------------- */
const isEmpty = (val: any) => val === undefined || val === null || val === '' || val === '-'

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

/* ---------------- GENERAL DATA ---------------- */
const generalData = ref([
  { label: 'Vendor Invoice', value: form?.invoiceVendorNo },
  { label: 'Invoice Date', value: moment(form?.invoiceDate).format('DD MMMM YYYY') },
  { label: 'Posting Date', value: '10 Mei 2022' },
  { label: 'Amount', value: form?.vatAmount },
  { label: 'Tax Amount', value: form?.subtotal },
  { label: 'Currency', value: form?.currency },
])

const generalStatus = ref([
  { label: 'EVO No', value: 'E12206', status: 'success' },
  { label: 'OCR Status', value: 'Success', status: 'success' },
  { label: 'Integration', value: 'Success', status: 'success' },
  { label: 'DJP Status', value: 'Approved', status: 'success' },
])

/* ---------------- document type ---------------- */
const documentTypeList = ref([
  { code: '1', name: 'Tax Document' },
  { code: '2', name: 'Invoice Document' },
])

/* ---------------- PO logic ---------------- */
const checkPo = () => typeForm.value === 'po' || typeForm.value === 'po-view'
const checkIsNonPo = () => typeForm.value === 'nonpo'
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
const editableRemarks = reactive<Record<number, string>>({})
const manualOverride = reactive<Record<number, boolean>>({})
const NOT_MATCHED = '2'

/* ---------------- TABLE DATA (FIXED, FULL) ---------------- */
const tableData = computed(() => {
  return [
    {
      header: 'Nama Vendor',
      qr: qrData.vendorSupplier || '-',
      fpVerified:
        editableRemarks[0] === '3'
          ? true
          : editableRemarks[0] === '2'
            ? false
            : isEmpty(qrData.vendorSupplier)
              ? 'none'
              : form?.vendorName == qrData.vendorSupplier,
      ocr: ocrData.vendorSupplier || '-',
      invoiceVerified:
        editableRemarks[0] === '3'
          ? true
          : editableRemarks[0] === '2'
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
        editableRemarks[1] === '3'
          ? true
          : editableRemarks[1] === '2'
            ? false
            : isEmpty(qrData.npwpSupplier)
              ? 'none'
              : form?.npwp == qrData.npwpSupplier,
      ocr: ocrData.npwpSupplier || '-',
      invoiceVerified:
        editableRemarks[1] === '3'
          ? true
          : editableRemarks[1] === '2'
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
        editableRemarks[2] === '3'
          ? true
          : editableRemarks[2] === '2'
            ? false
            : isEmpty(qrData.vendorBuyer)
              ? 'none'
              : form?.companyName == qrData.vendorBuyer,
      ocr: ocrData.vendorBuyer || '-',
      invoiceVerified:
        editableRemarks[2] === '3'
          ? true
          : editableRemarks[2] === '2'
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
        editableRemarks[3] === '3'
          ? true
          : editableRemarks[3] === '2'
            ? false
            : isEmpty(qrData.npwpBuyer)
              ? 'none'
              : true,
      ocr: ocrData.npwpBuyer || '-',
      invoiceVerified:
        editableRemarks[3] === '3'
          ? true
          : editableRemarks[3] === '2'
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
        editableRemarks[4] === '3'
          ? true
          : editableRemarks[4] === '2'
            ? false
            : isEmpty(qrData.taxDocumentNumber)
              ? 'none'
              : form?.taxNoInvoice == qrData.taxDocumentNumber,
      ocr: ocrData.taxDocumentNumber || '-',
      invoiceVerified:
        editableRemarks[4] === '3'
          ? true
          : editableRemarks[4] === '2'
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
        editableRemarks[5] === '3'
          ? true
          : editableRemarks[5] === '2'
            ? false
            : isEmpty(qrData.taxDocumentDate)
              ? 'none'
              : true,
      ocr: ocrData.taxDocumentDate || '-',
      invoiceVerified:
        editableRemarks[5] === '3'
          ? true
          : editableRemarks[5] === '2'
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
        editableRemarks[6] === '3'
          ? true
          : editableRemarks[6] === '2'
            ? false
            : isEmpty(qrData.dpp)
              ? 'none'
              : true,
      ocr: ocrData.dpp || '-',
      invoiceVerified:
        editableRemarks[6] === '3'
          ? true
          : editableRemarks[6] === '2'
            ? false
            : isEmpty(ocrData.dpp)
              ? 'none'
              : true,
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
        editableRemarks[8] === '3'
          ? true
          : editableRemarks[8] === '2'
            ? false
            : isEmpty(qrData.ppn)
              ? 'none'
              : true,
      ocr: ocrData.ppn || '-',
      invoiceVerified:
        editableRemarks[8] === '3'
          ? true
          : editableRemarks[8] === '2'
            ? false
            : isEmpty(ocrData.ppn)
              ? 'none'
              : true,
      remarks: isEmpty(qrData.ppn) || isEmpty(ocrData.ppn) ? 'none' : true,
    },
    {
      header: 'PPN BM',
      qr: qrData.ppnbm || '-',
      fpVerified:
        editableRemarks[9] === '3'
          ? true
          : editableRemarks[9] === '2'
            ? false
            : isEmpty(qrData.ppnbm)
              ? 'none'
              : true,
      ocr: ocrData.ppnbm || '-',
      invoiceVerified:
        editableRemarks[9] === '3'
          ? true
          : editableRemarks[9] === '2'
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
        editableRemarks[10] === '3'
          ? true
          : editableRemarks[10] === '2'
            ? false
            : isEmpty(qrData.status)
              ? 'none'
              : true,
      ocr: ocrData.status || '-',
      invoiceVerified:
        editableRemarks[10] === '3'
          ? true
          : editableRemarks[10] === '2'
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

const setTabOcr = (tab: 'general' | 'tax' | 'ai') => {
  tabOcrTab.value = tab
}

const isSyncLoading = ref(false)
const pjapSyncStatus = ref<string | null>(null)

/* ---------------- watchers ---------------- */
watch(isVerifyData, (val) => {
  if (!val) return
  tableData.value.forEach((row, i) => {
    if (editableRemarks[i] === undefined) {
      editableRemarks[i] = row.remarks === true ? '1' : row.remarks === false ? '2' : '4'
    }
    if (editableRemarks[i] === '3') manualOverride[i] = true
  })
})

watch(selectedDocumentType, (val) => {
  previewUrl.value =
    val === '1' ? (form?.tax?.previewPath ?? '') : (form?.invoiceDocument?.previewPath ?? '')
})

watch(
  editableRemarks,
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
  isLoadUpload.value = false
  isVerifyData.value = true
}

const verifyByPjap = async () => {
  if (!ocrData.taxDocumentNumber || !ocrData.npwpSupplier || !ocrData.taxDocumentDate) {
    // Basic validation, maybe show alert if needed
    console.warn('Missing OCR data for PJAP Sync')
    return
  }

  console.log('Starting PJAP Sync...') // FORCE UPDATE
  isSyncLoading.value = true
  const parts = ocrData.taxDocumentDate.split(' ')
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
    try {
      const res = await invoiceVerificationStore.sync({
        noFaktur: ocrData.taxDocumentNumber,
        npwpVendor: ocrData.npwpSupplier,
        masaPajak: month,
        tahunPajak: year,
      })
      // The API response structure: { content: { taxInvoiceStatus: 'APPROVED', ... } } based on usage,
      // but based on user request example:
      // "result": { "message": "", "isError": false, "content": { "taxInvoiceStatus": "APPROVED", ... } }
      // The store returns response.data which is the 'result' object typically if using standard wrapper,
      // let's check store implementation.
      // Store: return response.data.
      // Api Result type SyncManualResult has taxInvoiceStatus.
      pjapSyncStatus.value = res.taxInvoiceStatus
      isVerify.value = true
    } catch (error) {
      console.error('PJAP Sync failed', error)
    }
  } else {
    console.warn('Could not parse date for PJAP Sync')
  }
  isSyncLoading.value = false
}

/* ---------------- mount ---------------- */
onMounted(() => {
  setColumn()
  typeForm.value = route.query.type?.toString().toLowerCase() || 'po'
})
</script>

<style lang="scss" scoped>
@use '../styles/invoice-preview.scss';
</style>

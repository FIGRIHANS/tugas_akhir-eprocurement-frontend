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
                {{ isSyncLoading ? 'Verifying...' : 'Verify By PJAP' }}
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
                    <div
                      class="relative group flex items-center w-fit"
                      v-else-if="row.fpVerified === false"
                    >
                      <i class="ki-filled ki-cross-circle text-red-500 cursor-help"></i>
                      <!-- Tooltip -->
                      <div
                        class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block w-max px-2 py-1 bg-red-600 text-white text-xs rounded shadow-lg z-10"
                      >
                        {{ row.header }} Mismatch
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
                          class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block w-max px-2 py-1 bg-red-600 text-white text-xs rounded shadow-lg z-10"
                        >
                          {{ row.header }} Mismatch
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
          :class="[
            'bg-white shadow-xl rounded-xl p-6 mt-4 border',
            aiMismatches.length === 0 ? 'border-green-600' : 'border-red-400',
          ]"
        >
          <h2 class="font-bold text-xl mb-4 flex items-center gap-2">AI Action 🤖</h2>
          <hr class="mb-4" />
          <div
            :class="[
              'flex gap-5 p-4 border rounded-lg items-start',
              aiMismatches.length === 0
                ? 'bg-green-50 border-green-300'
                : 'bg-red-50 border-red-300',
            ]"
          >
            <img
              src="https://cdnai.iconscout.com/ai-image/premium/thumb/ai-female-customer-care-agent-3d-illustration-png-download-jpg-13152628.png"
              alt="AI Assistant"
              class="w-20 h-20 object-contain flex-shrink-0"
            />
            <div class="flex-grow">
              <p
                v-if="aiMismatches.length === 0"
                class="font-extrabold text-lg text-green-600 mb-3"
              >
                Tidak ada mismatch
              </p>
              <p v-else class="font-extrabold text-lg text-red-800 mb-3">Terdapat mismatch pada:</p>

              <ul class="list-disc ml-6 space-y-1 text-base text-gray-800">
                <li v-for="(item, index) in aiMismatches" :key="index" class="font-semibold">
                  {{ item }}
                </li>
              </ul>
              <div class="flex gap-0 mt-5 border border-gray-300 rounded-lg overflow-hidden w-fit">
                <button
                  @click="setActive('back')"
                  :class="[
                    'px-5 py-2 font-semibold transition duration-150 border-r border-gray-300',
                    activeButton === 'back'
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-100 text-blue-600 hover:bg-gray-200',
                  ]"
                >
                  Send Back to Vendor
                </button>
                <button
                  @click="setActive('proceed')"
                  :class="[
                    'px-5 py-2 font-semibold transition duration-150',
                    activeButton === 'proceed'
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-100 text-blue-600 hover:bg-gray-200',
                  ]"
                >
                  Proceed
                </button>
              </div>
            </div>
          </div>
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
import { ref, inject, onMounted, watch, defineAsyncComponent, reactive, computed } from 'vue'
import type { formTypes } from '../types/invoiceAddWrapper'
import type { invoiceQrData } from '../types/invoiceQrdata'
import type { invoiceOcrData } from '../types/invoiceOcrData'
import { defaultColumn, invoiceDpColumn, poCCColumn, manualAddColumn } from '@/static/invoicePoGr'
import { useRoute } from 'vue-router'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiModal from '@/components/modal/UiModal.vue'
import ModalSuccessLogo from '@/assets/svg/ModalSuccessLogo.vue'
import UiLoading from '@/components/UiLoading.vue'
import moment from 'moment'
import { parseIndoDate } from '@/composables/parseIndoDate'
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
const activeButton = ref('')

const manualApprove = reactive<Record<number, boolean>>({})
const manualReject = reactive<Record<number, boolean>>({})

/* ---------------- helpers ---------------- */
const isEmpty = (val: any) => val === undefined || val === null || val === '' || val === '-'

const setActive = (btn: 'back' | 'proceed') => {
  activeButton.value = btn
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
const editableRemarks = ref<Record<number, string>>({})
const manualOverride = reactive<Record<number, boolean>>({})
const NOT_MATCHED = '2'

const aiLabelMap: Record<string, string> = {
  'Nama Vendor': 'Nama Vendor',
  'NPWP Vendor': 'NPWP Vendor',
  Perusahaan: 'Perusahaan',
  NPWP: 'NPWP',
  'No Faktur Pajak': 'No Faktur Pajak',
  'Tanggal Faktur Pajak': 'Tanggal Faktur Pajak',
  'Nilai Penjualan': 'Nilai Penjualan',
  'DPP Lainnya': 'DPP Lainnya',
  PPN: 'PPN',
  'PPN BM': 'PPN BM',
  'Status Approve FP': 'Status Approve FP',
  Reference: 'Reference',
}

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
              : true,
      ocr: ocrData.dpp || '-',
      invoiceVerified:
        editableRemarks.value[6] === '3'
          ? true
          : editableRemarks.value[6] === '2'
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
        editableRemarks.value[8] === '3'
          ? true
          : editableRemarks.value[8] === '2'
            ? false
            : isEmpty(qrData.ppn)
              ? 'none'
              : true,
      ocr: ocrData.ppn || '-',
      invoiceVerified:
        editableRemarks.value[8] === '3'
          ? true
          : editableRemarks.value[8] === '2'
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

const isRowMismatch = (row: any, index: number) => {
  const remark = editableRemarks.value[index]

  // Not Match manual
  if (remark === '2') return true

  // Manual Verified
  if (remark === '3') return false

  // Auto → pakai hasil sistem
  return row.remarks === false
}

const aiMismatches = computed(() => {
  return tableData.value
    .map((row, index) => ({ row, index }))
    .filter(({ row, index }) => isRowMismatch(row, index))
    .map(({ row }) => aiLabelMap[row.header] || row.header)
})

const triggerAiMismatch = () => {
  // jika ingin auto pindah tab AI
  // tabOcrTab.value = 'ai'
}

const setTabOcr = (tab: 'general' | 'tax' | 'ai') => {
  tabOcrTab.value = tab
}

const isSyncLoading = ref(false)
const pjapSyncStatus = ref<string | null>(null)

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

watch(selectedDocumentType, (val) => {
  previewUrl.value =
    val === '1' ? (form?.tax?.previewPath ?? '') : (form?.invoiceDocument?.previewPath ?? '')
})

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

watch(
  () => editableRemarks.value,
  () => {
    triggerAiMismatch()
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
onMounted(() => {
  setColumn()
  typeForm.value = route.query.type?.toString().toLowerCase() || 'po'

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

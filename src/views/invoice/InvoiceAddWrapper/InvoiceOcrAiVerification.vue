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
                @click="isVerify = true"
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
                    />
                    <span v-else class="text-gray-400">-</span>
                  </td>

                  <td class="p-2">
                    <span v-if="row.invoiceVerified === '-'">
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
                    >
                      <option value="Matched">Matched</option>
                      <option value="Didn't Matched">Didn't Matched</option>
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
// import { usePreviewFileStore } from '@/stores/general/previewFile'
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

const InvoicePoGrView = defineAsyncComponent(
  () => import('./InvoicePreview/InvoicePoGrViewOcr.vue'),
)
const InvoiceItemView = defineAsyncComponent(
  () => import('./InvoicePreview/InvoiceItemViewOcr.vue'),
)
const AdditionalCostView = defineAsyncComponent(
  () => import('./InvoicePreview/AdditionalCostViewOcr.vue'),
)

const route = useRoute()
const showModalSuccess = ref(false)
const invoiceVerificationStore = useInvoiceVerificationStore()

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

const form = inject<formTypes>('form')
const isLoadUpload = ref<boolean>(false)
// const previewApi = usePreviewFileStore()

const previewUrl = ref<string>(form?.tax?.previewPath ?? '')
const tabOcrTab = ref<string>('general')
const typeForm = ref<string>('')
const isVerify = ref(false)
const isVerifyData = ref(false)
const selectedDocumentType = ref<string>('1')

const editableRemarks = reactive<Record<number, string>>({})

const NOT_MATCHED = "Didn't Matched"
const checkPo = () => typeForm.value === 'po' || typeForm.value === 'po-view'
const checkIsNonPo = () => typeForm.value === 'nonpo'
const checkIsWithoutDp = () => form?.invoiceDp === '9011'
const checkPoWithDp = () => form?.invoiceDp === '9013'
const checkIsPoPibCc = () =>
  (form?.invoiceType === '902' || form?.invoiceType === '903') && form?.status > 0

const documentTypeList = ref([
  { code: '1', name: 'Tax Document' },
  { code: '2', name: 'Invoice Document' },
])

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

const tableData = computed(() => [
  {
    header: 'Nama Vendor',
    qr: qrData.vendorBuyer || '-',
    fpVerified: form?.vendorName == qrData.vendorBuyer,
    ocr: ocrData.vendorBuyer || '-',
    invoiceVerified: form?.vendorName == ocrData.vendorBuyer,
    remarks: form?.vendorName == qrData.vendorBuyer && form?.vendorName == ocrData.vendorBuyer,
  },
  {
    header: 'NPWP Vendor',
    qr: qrData.npwpBuyer || '-',
    fpVerified: form?.npwpNumber == qrData.npwpBuyer,
    ocr: ocrData.npwpBuyer || '-',
    invoiceVerified: form?.npwpNumber == ocrData.npwpBuyer,
    remarks: form?.npwpNumber == qrData.npwpBuyer && form?.npwpNumber == ocrData.npwpBuyer,
  },
  {
    header: 'Perusahaan',
    qr: qrData.vendorSupplier || '-',
    fpVerified: form?.companyName == qrData.vendorSupplier,
    ocr: ocrData.vendorSupplier,
    invoiceVerified: form?.companyName == ocrData.vendorSupplier,
    remarks:
      form?.companyName == qrData.vendorSupplier && form?.companyName == ocrData.vendorSupplier,
  },
  {
    header: 'NPWP',
    qr: qrData.npwpSupplier || '-',
    fpVerified: true,
    ocr: ocrData.npwpSupplier || '-',
    invoiceVerified: true,
    remarks: true,
  },
  {
    header: 'No Faktur Pajak',
    qr: qrData.taxDocumentNumber || '-',
    fpVerified: form?.taxNoInvoice == qrData.taxDocumentNumber,
    ocr: ocrData.taxDocumentNumber || '-',
    invoiceVerified: form?.taxNoInvoice == ocrData.taxDocumentNumber,
    remarks:
      form?.taxNumber == qrData.taxDocumentNumber && ocrData.taxDocumentNumber == form?.taxNumber,
  },
  {
    header: 'Tanggal Faktur Pajak',
    qr: qrData.taxDocumentDate || '-',
    fpVerified: !!qrData.taxDocumentDate,
    ocr: ocrData.taxDocumentDate || '-',
    invoiceVerified: !!ocrData.taxDocumentDate,
    remarks: true,
  },
  {
    header: 'Nilai Penjualan',
    qr: qrData.dpp || '-',
    fpVerified: true,
    ocr: ocrData.dpp || '-',
    invoiceVerified: true,
    remarks: form?.subtotal == Number(qrData.dpp) && form?.subtotal == Number(ocrData.dpp),
  },
  {
    header: 'DPP Lainnya',
    qr: '-',
    fpVerified: 'none',
    ocr: '-',
    invoiceVerified: '-',
    remarks: 'Invoice Not Match',
  },
  {
    header: 'PPN',
    qr: qrData.ppn || '-',
    fpVerified: true,
    ocr: ocrData.ppn || '-',
    invoiceVerified: true,
    remarks: true,
  },
  {
    header: 'PPN BM',
    qr: qrData.ppnbm || '-',
    fpVerified: true,
    ocr: ocrData.ppnbm || '-',
    invoiceVerified: true,
    remarks: true,
  },
  {
    header: 'Status Approve FP',
    qr: qrData.status || '-',
    fpVerified: true,
    ocr: ocrData.status || '-',
    invoiceVerified: true,
    remarks: true,
  },
  {
    header: 'Reference',
    qr: '-',
    fpVerified: 'none',
    ocr: '-',
    invoiceVerified: '-',
    remarks: 'none',
  },
])

const bjapVerify = computed(() => [
  {
    header: 'Status FP PJAP',
    qr: qrData.status || '-',
    fpVerified: 'Approved',
    remarks: qrData.status === 'APPROVED',
  },
])

const columns = ref([
  'Activity / Expense',
  'Item Amount',
  'Qty Match',
  'Unit Price Match',
  'VAT Match',
  'WHT Match',
  'Debit/Credit',
  'Tax Code',
  'VAT Amount',
  'Cost Center',
  'Profit Center',
  'Assignment',
  'WHT Type',
  'WHT Code',
  'WHT Base Amount',
  'WHT Amount',
])

const setTabOcr = (type: string) => {
  tabOcrTab.value = type
}

const sendUploadFile = async () => {
  const ocrResponse = (await invoiceVerificationStore.uploadFileOcr(
    form?.tax?.previewPath,
  )) as unknown as invoiceOcrData
  const qrResponse = (await invoiceVerificationStore.uploadFileQr(
    form?.tax?.previewPath,
  )) as unknown as invoiceQrData

  await setFileOcr(ocrResponse)
  await setFileQr(qrResponse)
}

const setFileQr = async (data: invoiceQrData) => {
  Object.assign(qrData, data)
}

const setFileOcr = async (data: invoiceOcrData) => {
  Object.assign(ocrData, data)
}

const verifyInvoice = async () => {
  isLoadUpload.value = true
  await sendUploadFile()
  isLoadUpload.value = false
  isVerifyData.value = true
}

const setColumn = () => {
  const sourceColumns =
    form?.invoiceType === '903'
      ? poCCColumn
      : form?.invoiceDp === '9012'
        ? invoiceDpColumn
        : form?.invoiceType === '902'
          ? manualAddColumn
          : defaultColumn
  const baseColumns = [...sourceColumns]
  baseColumns.splice(6, 0, 'Qty Match', 'Unit Price Match', 'VAT Match', 'WHT Match')
  columns.value = baseColumns
}

const getOcrKey = (header: string): keyof invoiceOcrData | null => {
  const map: Record<string, keyof invoiceOcrData> = {
    'Nama Vendor': 'vendorBuyer',
    'NPWP Vendor': 'npwpBuyer',
    Perusahaan: 'vendorSupplier',
    NPWP: 'npwpSupplier',
    'No Faktur Pajak': 'taxDocumentNumber',
    'Tanggal Faktur Pajak': 'taxDocumentDate',
    'Nilai Penjualan': 'dpp',
    PPN: 'ppn',
    'PPN BM': 'ppnbm',
    'Status Approve FP': 'status',
  }
  return map[header] ?? null
}

watch(isVerifyData, (val) => {
  if (!val) return

  tableData.value.forEach((row, index) => {
    if (editableRemarks[index] === undefined) {
      editableRemarks[index] =
        row.remarks === true || row.remarks === 'Matched' ? 'Matched' : "Didn't Matched"
    }
  })
})

watch(selectedDocumentType, async (newVal) => {
  const path = newVal === '1' ? form?.tax?.previewPath : form?.invoiceDocument?.previewPath
  if (!path) {
    previewUrl.value = ''
    return
  }
  previewUrl.value = path
})

onMounted(() => {
  setColumn()
  typeForm.value = route.query.type?.toString().toLowerCase() || 'po'
})
</script>

<style lang="scss" scoped>
@use '../styles/invoice-preview.scss';
</style>

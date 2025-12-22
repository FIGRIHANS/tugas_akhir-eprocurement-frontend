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
              <!-- <UiButton
                class="px-3 py-1 bg-blue-600 text-white rounded-lg"
                :disabled="!isVerify && !isApproved()"
                @click="openModalSuccess()"
              >
                VAT Credit Posting
              </UiButton> -->
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
                  :class="[
                    {
                      'bg-red-100':
                        row.remarks === false ||
                        row.remarks === 'Didn\'t Matched' ||
                        row.remarks === 'Invoice Not Match',
                    },
                    'border-b',
                  ]"
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

                  <td class="p-2">{{ row.ocr }}</td>

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
                    <p
                      class="text-green-600"
                      v-if="row.remarks === true || row.remarks === 'Matched'"
                    >
                      Matched
                    </p>
                    <p
                      class="text-red-600 font-semibold"
                      v-else-if="
                        row.remarks === false ||
                        row.remarks === 'Didn\'t Matched' ||
                        row.remarks === 'Invoice Not Match'
                      "
                    >
                      Didn't Matched
                    </p>
                    <p v-else>-</p>
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
                      <span class="ml-3 text-sm text-gray-600">Verifying document...</span>
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
          <hr class="mb-4" />
          <div class="flex gap-5 p-4 bg-red-50 border border-red-300 rounded-lg items-start">
            <img
              src="https://cdnai.iconscout.com/ai-image/premium/thumb/ai-female-customer-care-agent-3d-illustration-png-download-jpg-13152628.png"
              alt="AI Assistant"
              class="w-20 h-20 object-contain flex-shrink-0"
            />
            <div class="flex-grow">
              <p class="font-extrabold text-lg text-red-800 mb-3">Terdapat mismatch pada:</p>
              <ul class="list-disc ml-6 space-y-1 text-base text-gray-800">
                <li class="font-semibold">Invoice amount</li>
                <li class="font-semibold">Tax base (DPP)</li>
                <li class="font-semibold">PPN amount</li>
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
          <div
            class="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm leading-relaxed shadow-inner"
          >
            <p class="font-bold text-base mb-2 text-gray-700 border-b pb-2 border-gray-200">
              Pesan Revisi Otomatis:
            </p>
            <p>Yth. PT Sinar Packaging,</p>
            <p class="mt-2">
              Terkait Invoice <strong>INV-0924-3321</strong>, terdapat ketidaksesuaian berikut:
            </p>
            <ul class="list-decimal ml-6 mt-2 text-gray-700 space-y-1">
              <li>
                Harga per unit pada line item 10 tidak sesuai dengan PO (Rp 2.750
                <span class="text-red-600 font-semibold">≠</span> Rp 2.500).
              </li>
              <li>Faktur pajak yang terdaftar tidak sesuai dengan nilai invoice.</li>
            </ul>
            <p class="mt-3 font-medium">
              Mohon dilakukan revisi invoice dan pembetulan faktur pajak agar proses dapat
              dilanjutkan.
            </p>
            <p class="mt-1">Terima kasih.</p>
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
  npwppBuyer: '',
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
  FakturPajak: '',
  buyerNpwp: '',
  dpp: '',
  ppn: '',
  total: '',
  transactionDate: '',
  vendorName: '',
  vendorNpwp: '',
})
const form = inject<formTypes>('form')
const isLoadUpload = ref<boolean>(false)
// const previewApi = usePreviewFileStore()

const previewUrl = ref<string>(form?.tax?.previewPath ?? '')
const tabOcrTab = ref<string>('general')
const typeForm = ref<string>('')
const isVerify = ref(false)
const isVerifyData = ref(false)
const activeButton = ref<'back' | 'proceed'>('proceed')
const selectedDocumentType = ref<string>('1')

// --- Helper untuk pengecekan data OCR kosong ---
const isOcrEmpty = (val: any) => val === undefined || val === null || val === '-' || val === ''

const setActive = (btn: 'back' | 'proceed') => {
  activeButton.value = btn
}
const checkPo = () => typeForm.value === 'po' || typeForm.value === 'po-view'
const checkIsNonPo = () => typeForm.value === 'nonpo'
const checkIsWithoutDp = () => form?.invoiceDp === '9011'
const checkPoWithDp = () => form?.invoiceDp === '9013'
const checkIsPoPibCc = () =>
  (form?.invoiceType === '902' || form?.invoiceType === '903') && form?.status > 0

// const getPreviewUrl = async () => {
//   if (form?.tax?.path) {
//     const response = await previewApi.getPreview(form.tax.path)
//     previewUrl.value = window.URL.createObjectURL(response.data)
//   }
// }

// const openModalSuccess = () => {
//   showModalSuccess.value = true
// }

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

/* -------------------- Table Data (LOGIKA REQUEST USER) -------------------- */
const tableData = computed(() => [
  {
    header: 'Nama Vendor',
    qr: qrData.vendorBuyer || '-',
    fpVerified: form?.vendorName == qrData.vendorBuyer,
    ocr: ocrData.vendorName || '-',
    invoiceVerified: isOcrEmpty(ocrData.vendorName) ? '-' : form?.vendorName == ocrData.vendorName,
    remarks: isOcrEmpty(ocrData.vendorName)
      ? form?.vendorName == qrData.vendorBuyer
      : form?.vendorName == qrData.vendorBuyer && form?.vendorName == ocrData.vendorName,
  },
  {
    header: 'NPWP Vendor',
    qr: qrData.npwppBuyer || '-',
    fpVerified: form?.npwp == qrData.npwppBuyer,
    ocr: ocrData.buyerNpwp || '-',
    invoiceVerified: isOcrEmpty(ocrData.buyerNpwp) ? '-' : form?.npwpNumber == ocrData.buyerNpwp,
    remarks: isOcrEmpty(ocrData.buyerNpwp)
      ? form?.npwpNumber == qrData.npwppBuyer
      : form?.npwpNumber == qrData.npwppBuyer && form?.npwpNumber == ocrData.buyerNpwp,
  },
  {
    header: 'Perusahaan',
    qr: qrData.vendorSupplier || '-',
    fpVerified: form?.companyName == qrData.vendorSupplier,
    ocr: '-',
    invoiceVerified: '-',
    remarks: form?.companyName == qrData.vendorSupplier,
  },
  {
    header: 'NPWP',
    qr: qrData.npwpSupplier || '-',
    fpVerified: true,
    ocr: '-',
    invoiceVerified: '-',
    remarks: true,
  },
  {
    header: 'No Faktur Pajak',
    qr: qrData.taxDocumentNumber || '-',
    fpVerified: form?.taxNoInvoice == qrData.taxDocumentNumber,
    ocr: ocrData.FakturPajak || '-',
    invoiceVerified: isOcrEmpty(ocrData.FakturPajak) ? '-' : ocrData.FakturPajak == form?.taxNumber,
    remarks: isOcrEmpty(ocrData.FakturPajak)
      ? form?.taxNumber == qrData.taxDocumentNumber
      : form?.taxNumber == qrData.taxDocumentNumber && ocrData.FakturPajak == form?.taxNumber,
  },
  {
    header: 'Tanggal Faktur Pajak',
    qr: qrData.taxDocumentDate || '-',
    fpVerified: true,
    ocr: ocrData.transactionDate || '-',
    invoiceVerified: isOcrEmpty(ocrData.transactionDate) ? '-' : 'none',
    remarks: true,
  },
  {
    header: 'Nilai Penjualan',
    qr: qrData.dpp || '-',
    fpVerified: true,
    ocr: ocrData.dpp || '-',
    invoiceVerified: isOcrEmpty(ocrData.dpp) ? '-' : form?.subtotal == Number(ocrData.dpp),
    remarks: isOcrEmpty(ocrData.dpp)
      ? form?.subtotal == Number(qrData.dpp)
      : form?.subtotal == Number(qrData.dpp) && form?.subtotal == Number(ocrData.dpp),
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
    invoiceVerified: isOcrEmpty(ocrData.ppn) ? '-' : true,
    remarks: 'Matched',
  },
  {
    header: 'PPN BM',
    qr: qrData.ppnbm || '-',
    fpVerified: true,
    ocr: '-',
    invoiceVerified: '-',
    remarks: 'Matched',
  },
  {
    header: 'Status Approve FP',
    qr: qrData.status || '-',
    fpVerified: true,
    ocr: '-',
    invoiceVerified: '-',
    remarks: 'none',
  },
  {
    header: 'Reference',
    qr: '-',
    fpVerified: 'none',
    ocr: ocrData.FakturPajak || '-',
    invoiceVerified: isOcrEmpty(ocrData.FakturPajak) ? '-' : true,
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

const isApproved = () => qrData.status === 'APPROVED'
const setTabOcr = (type: string) => {
  tabOcrTab.value = type
}

const sendUploadFile = async () => {
  const ocrResponse = await invoiceVerificationStore.uploadFileOcr(
    form?.invoiceDocument?.previewPath,
  )
  const qrResponse = await invoiceVerificationStore.uploadFileQr(form?.tax?.previewPath)
  console.log(qrResponse)
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
  let sourceColumns =
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

watch(selectedDocumentType, async (newVal) => {
  const path = newVal === '1' ? form?.tax?.previewPath : form?.invoiceDocument?.previewPath
  if (!path) {
    previewUrl.value = ''
    return
  }
  previewUrl.value = path
})

onMounted(() => {
  // getPreviewUrl()
  setColumn()
  typeForm.value = route.query.type?.toString().toLowerCase() || 'po'
})
</script>

<style lang="scss" scoped>
@use '../styles/invoice-preview.scss';
</style>

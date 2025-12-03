<template>
  <div class="p-4 w-full">
    <!-- GRID UTAMA -->
    <div class="grid grid-cols-12 gap-4">
      <!-- ==================== KIRI ==================== -->
      <div class="col-span-7 space-y-4">
        <div class="card-header py-[8px] px-[20px]">
          <div class="border rounded-lg border-gray-300 p-[4px] flex items-center gap-[4px]">
            <button
              class="btn btn-primary"
              :class="{
                'btn-clear info__header': tabOcrTab !== 'general',
              }"
              @click="setTabOcr('general')"
            >
              General Data
            </button>
            <button
              class="btn btn-primary"
              :class="{
                'btn-clear info__header': tabOcrTab !== 'tax',
              }"
              @click="setTabOcr('tax')"
            >
              Tax & Invoice Verification
            </button>
            <button
              class="btn btn-primary"
              :class="{
                'btn-clear info__header': tabOcrTab !== 'ai',
              }"
              @click="setTabOcr('ai')"
            >
              AI Action
            </button>
          </div>
        </div>
        <!-- GENERAL DATA -->
        <div v-if="tabOcrTab === 'general'" class="bg-white shadow rounded-xl p-4">
          <h2 class="font-semibold text-lg mb-3">General Data</h2>

          <div class="grid grid-cols-2 gap-4 text-sm">
            <div v-for="(row, i) in generalData" :key="i">
              <p class="text-gray-500 text-xs">{{ row.label }}</p>
              <p class="font-semibold">{{ row.value }}</p>
            </div>
          </div>
        </div>

        <!-- GENERAL STATUS -->
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

        <!-- TABLE VERIFIKASI -->
        <div v-if="tabOcrTab === 'tax'" class="bg-white shadow rounded-xl p-4">
          <div class="flex justify-between mb-3">
            <h2 class="font-semibold text-lg">Invoice Verification</h2>
            <button
              class="px-3 py-1 bg-blue-600 text-white rounded-lg"
              @click="handleVerifyInvoice"
            >
              Verify Invoice
            </button>
          </div>

          <div class="overflow-auto border rounded-lg">
            <table class="w-full text-sm">
              <thead class="bg-gray-100">
                <tr>
                  <th class="p-2 text-left">Header</th>
                  <th class="p-2 text-left">Data</th>
                  <th class="p-2 text-left">Validasi</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="(row, index) in tableData"
                  :key="index"
                  :class="{ 'bg-yellow-100': row.highlight }"
                  class="border-b"
                >
                  <td class="p-2">{{ row.header }}</td>
                  <td class="p-2">{{ row.data }}</td>
                  <td class="p-2 flex items-center gap-2">
                    {{ row.validation }}
                    <i v-if="row.isVerified" class="ki-filled ki-check-circle text-green-500"></i>
                    <i v-else class="ki-filled ki-cross-circle text-red-500"></i>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- AI ACTION (MUNCUL SETELAH VERIFIKASI) -->
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
                  class="px-5 py-2 bg-gray-100 text-blue-600 font-semibold hover:bg-gray-200 transition duration-150 border-r border-gray-300"
                >
                  Send Back to Vendor
                </button>
                <button
                  class="px-5 py-2 bg-green-600 text-white font-semibold hover:bg-green-700 transition duration-150"
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

        <!-- TABLE DETAIL INVOICE -->
      </div>

      <!-- ==================== KANAN ==================== -->
      <div class="col-span-5">
        <div class="bg-white shadow rounded-xl p-4 h-[90vh] flex flex-col">
          <div class="flex justify-between items-center mb-3">
            <h2 class="font-semibold text-lg">Preview Dokumen</h2>
            <select v-model="selectedDocumentType" class="select w-[50%] justify-end">
              <option v-for="item of documentTypeList" :key="item.code" :value="item.code">
                {{ item.name }}
              </option>
            </select>

            <!-- <div class="flex items-center gap-2 text-gray-500">
              <button class="p-1 hover:text-blue-600">
                <i class="ki-filled ki-zoom-in"></i>
              </button>
              <button class="p-1 hover:text-blue-600">
                <i class="ki-filled ki-zoom-out"></i>
              </button>
            </div> -->
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
        <h2 class="font-semibold text-lg mb-3">Detail Item</h2>

        <!-- Invoice PO & GR Item By Search Table  -->

        <div v-if="form?.invoiceType !== '902'">
          <div v-if="form" class="overflow-x-auto pogr__table">
            <table
              class="table table-xs table-border"
              :class="{ 'border-danger': form?.invoicePoGrError }"
            >
              <thead>
                <tr>
                  <th
                    v-for="(item, index) in columns"
                    :key="index"
                    class="pogr__field-base"
                    :class="{
                      'pogr__field-base--po-item': item.toLowerCase() === 'item text',
                      'pogr__field-base--tax': item.toLowerCase() === 'tax code',
                    }"
                  >
                    {{ item }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="form.invoicePoGr.length === 0">
                  <td colspan="11" class="text-center text-[13px]">No Data Available</td>
                </tr>
                <template v-else>
                  <tr
                    v-for="(item, index) in form.invoicePoGr"
                    :key="index"
                    class="pogr__field-items"
                  >
                    <td>
                      <span v-if="(!item.isEdit && checkInvoiceDp()) || !checkInvoiceDp()">{{
                        item.poNo
                      }}</span>
                    </td>
                    <td v-if="!checkInvoiceDp()">{{ item.poItem }}</td>
                    <td v-if="!checkInvoiceDp() && !checkPoPib()">{{ item.grDocumentNo }}</td>
                    <td v-if="!checkInvoiceDp() && !checkPoPib()">{{ item.grDocumentItem }}</td>
                    <td v-if="!checkInvoiceDp() && !checkPoPib()">
                      {{
                        form.status === 5
                          ? moment(item.grDocumentDate).format('YYYY')
                          : item.grDocumentDate
                            ? moment(item.grDocumentDate).format('YYYY/MM/DD')
                            : item.grDocumentDate
                      }}
                    </td>
                    <td v-if="!checkInvoiceDp()">
                      {{
                        form.currency === item.currencyLC
                          ? useFormatIdr(item.itemAmountLC)
                          : useFormatUsd(item.itemAmountTC)
                      }}
                    </td>
                    <td v-if="!checkInvoiceDp()">{{ item.quantity }}</td>
                    <td v-if="!checkInvoiceDp()">{{ item.uom }}</td>
                    <td v-if="!checkInvoiceDp()">{{ item.itemText }}</td>
                    <td v-if="!checkInvoiceDp() && !checkPoPib()">
                      {{ item.conditionType || '-' }}
                    </td>
                    <td v-if="!checkInvoiceDp() && form.invoiceType !== '903'">
                      {{ item.conditionTypeDesc || '-' }}
                    </td>
                    <td v-if="!checkInvoiceDp() && form?.invoiceType !== '903'">
                      {{ item.qcStatus || '-' }}
                    </td>
                    <td v-if="form?.invoiceType === '903'">
                      <span>{{
                        form?.currency === item.currencyLC
                          ? useFormatIdr(item.vatAmount || 0)
                          : useFormatUsd(item.vatAmount || 0)
                      }}</span>
                    </td>
                    <td v-if="checkInvoiceDp()">
                      <span v-if="!item.isEdit">{{
                        form?.currency === 'IDR'
                          ? useFormatIdr(item.itemAmountLC)
                          : useFormatUsd(item.itemAmountLC)
                      }}</span>
                    </td>
                    <td>
                      <span v-if="!item.isEdit">{{ getTaxCodeName(item.taxCode) || '-' }}</span>
                    </td>
                    <td v-if="!checkPoPib()">
                      <!-- <span v-if="item.isEdit">{{ form?.currency === item.currencyLC ? useFormatIdr(formEdit.vatAmount) : useFormatUsd(formEdit.vatAmount) }}</span> -->
                      <span>{{
                        form?.currency === item.currencyLC
                          ? useFormatIdr(item.vatAmount || 0)
                          : useFormatUsd(item.vatAmount || 0)
                      }}</span>
                    </td>
                    <td>-</td>
                    <td>-</td>
                    <td>
                      {{
                        form?.currency === item.currencyLC
                          ? useFormatIdr(item.whtBaseAmount)
                          : useFormatUsd(item.whtBaseAmount)
                      }}
                    </td>
                    <td>-</td>
                    <td>{{ item.department || '-' }}</td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Invoice PO & Gr Add Item Manual -->
        <div v-else>
          <div v-if="form" class="overflow-x-auto pogr__table">
            <table
              class="table table-xs table-border"
              :class="{ 'border-danger': form?.invoicePoGrError }"
            >
              <thead>
                <tr>
                  <th
                    v-for="(item, index) in columns"
                    :key="index"
                    class="pogr__field-base"
                    :class="{
                      'pogr__field-base--po-number': item.toLowerCase() === 'po number',
                      'pogr__field-base--po-item': item.toLowerCase() === 'po item',
                      'pogr__field-base--department': item.toLowerCase() === 'department',
                    }"
                  >
                    {{ item }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="form.invoicePoGr.length === 0">
                  <td colspan="11" class="text-center text-[13px]">No Data Available</td>
                </tr>
                <template v-else>
                  <tr
                    v-for="(item, index) in form.invoicePoGr"
                    :key="index"
                    class="pogr__field-items"
                  >
                    <td>
                      <span>{{ item.poNo }} </span>
                    </td>
                    <td v-if="!checkInvoiceDp()">
                      <span>{{ item.poItem }}</span>
                    </td>
                    <td v-if="!checkInvoiceDp()">
                      <span>{{
                        form?.currency === 'IDR'
                          ? useFormatIdr(item.itemAmountLC)
                          : useFormatUsd(item.itemAmountLC)
                      }}</span>
                    </td>
                    <td v-if="!checkInvoiceDp()">
                      <span>{{ item.quantity }}</span>
                    </td>
                    <td v-if="!checkInvoiceDp()">
                      <span>{{ item.uom || '-' }}</span>
                    </td>
                    <td v-if="!checkInvoiceDp()">{{ item.itemText || '-' }}</td>
                    <td>
                      <p>
                        <i
                          class="flex items-center justify-center ki-filled ki-check-circle text-green-500"
                        ></i>
                      </p>
                    </td>
                    <td>
                      <p>
                        <i
                          class="flex items-center justify-center ki-filled ki-cross-circle text-red-500"
                        ></i>
                      </p>
                    </td>
                    <td>
                      <p>
                        <i
                          class="flex items-center justify-center ki-filled ki-check-circle text-green-500"
                        ></i>
                      </p>
                    </td>
                    <td>
                      <p>
                        <i
                          class="flex items-center justify-center ki-filled ki-cross-circle text-red-500"
                        ></i>
                      </p>
                    </td>
                    <td v-if="!checkInvoiceDp()">
                      <span>{{ getCostCenterName(item.department) || '-' }}</span>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, inject, onMounted, watch, computed } from 'vue'
import { usePreviewFileStore } from '@/stores/general/previewFile'
import type { formTypes } from '../types/invoiceAddWrapper'
import { useFormatIdr, useFormatUsd } from '@/composables/currency'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'
import moment from 'moment'
import { defaultColumn, invoiceDpColumn, poCCColumn, manualAddColumn } from '@/static/invoicePoGr'
// import type { itemsCostType } from '../../types/additionalCost'
// import { useInvoiceVerificationStore } from '@/stores/views/invoice/verification'

const invoiceMasterApi = useInvoiceMasterDataStore()
// const verificationApi = useInvoiceVerificationStore()

const listTaxCalculation = computed(() => invoiceMasterApi.taxList)
const costCenterList = computed(() => invoiceMasterApi.costCenterList)

const form = inject<formTypes>('form')
const previewApi = usePreviewFileStore()

const previewUrl = ref<string>(form.tax.path)
const tabOcrTab = ref<string>('general')

const showAiAction = ref(false)

const handleVerifyInvoice = () => {
  showAiAction.value = true
}

const getPreviewUrl = async () => {
  const response = await previewApi.getPreview(form.tax.path)
  const url = window.URL.createObjectURL(response.data)
  previewUrl.value = url
}

const checkInvoiceDp = () => {
  return form?.invoiceDp === '9012'
}

const checkPoPib = () => {
  return form?.invoiceType === '902'
}

const getCostCenterName = (costCenter: string) => {
  const index = costCenterList.value.findIndex((item) => item.code === costCenter)
  if (index !== -1) {
    const data = costCenterList.value[index]
    return `${data.code} - ${data.name}`
  }
  return '-'
}

const getTaxCodeName = (taxCode: string) => {
  const index = listTaxCalculation.value.findIndex((item) => item.code === taxCode)
  if (index !== -1) {
    const data = listTaxCalculation.value[index]
    return `${data.code} - ${data.name}`
  }
  return '-'
}

const documentTypeList = ref([
  { code: '1', name: 'Tax Document' },
  { code: '2', name: 'Invoice Document' },
  // { code: '3', name: 'Delivery Order' },
  // { code: '4', name: 'Other' },
])

const selectedDocumentType = ref<string>('1')

/* -------------------- Dummy General Data -------------------- */
const generalData = ref([
  { label: 'Vendor Invoice', value: '902205180001' },
  { label: 'Invoice Date', value: '8 Mei 2022' },
  { label: 'Posting Date', value: '10 Mei 2022' },
  { label: 'Amount', value: '1.028.200.000' },
  { label: 'Tax Amount', value: '102.820.000' },
  { label: 'Currency', value: 'IDR' },
])

const generalStatus = ref([
  { label: 'EVO No', value: 'E12206', status: 'success' },
  { label: 'OCR Status', value: 'Success', status: 'success' },
  { label: 'Integration', value: 'Success', status: 'success' },
  { label: 'DJP Status', value: 'Approved', status: 'success' },
])

/* -------------------- Table Data -------------------- */
const tableData = ref([
  {
    header: 'Nama Vendor',
    data: 'CIPTA PIRANTI SEJAHTERA',
    validation: '',
    isVerified: true,
  },
  { header: 'NPWP Vendor', data: '0754067908029000', validation: '', isVerified: true },
  { header: 'Perusahaan', data: 'ACARYA DATA ESA', validation: '', isVerified: true },
  { header: 'NPWP', data: '0430383257068000', validation: '', isVerified: true },
  {
    header: 'No Faktur Pajak',
    data: '04002500350159095',
    validation: ' ',
    isVerified: true,
  }, // Baris Tambahan 1
  { header: 'Tanggal Faktur Pajak', data: '29/10/2025', validation: '', isVerified: true }, // Baris Tambahan 2
  { header: 'Nilai Penjualan', data: '370,000.00', validation: ' ', highlight: true },
  { header: 'DPP Lainnya', data: '339,167.00', validation: '', isVerified: true }, // Baris Tambahan 3
  { header: 'PPN', data: '40,700.00', validation: '', isVerified: true }, // Baris Tambahan 4
  { header: 'PPN BM', data: '0.00', validation: '', isVerified: true }, // Baris Tambahan 5
  { header: 'Status Approve FP', data: 'APPROVED', validation: '', isVerified: true }, // Baris Tambahan 6
  { header: 'Reference', data: '(Referensi: 3544N5E1N6)', validation: '', isVerified: true }, // Baris Tambahan 7
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

const setColumn = () => {
  let sourceColumns // Array sumber (belum dimodifikasi)

  // 1. Tentukan array sumber
  if (form?.invoiceType === '903') {
    sourceColumns = poCCColumn
  } else if (form?.invoiceDp === '9012') {
    sourceColumns = invoiceDpColumn
  } else if (form?.invoiceType === '902') {
    sourceColumns = manualAddColumn
  } else {
    sourceColumns = defaultColumn
  }

  // **PERUBAHAN UTAMA: Buat salinan (baseColumns) dari array sumber**
  const baseColumns = [...sourceColumns]

  // 2. Lakukan penyisipan (splice) pada salinan (baseColumns)
  // baseColumns adalah array baru, jadi penyisipan tidak akan terulang pada sumber.
  baseColumns.splice(6, 0, 'Qty Match', 'Unit Price Match', 'VAT Match', 'WHT Match')

  // 3. Tetapkan hasil ke columns.value
  columns.value = baseColumns
}

watch(selectedDocumentType, async (newVal) => {
  let path = ''

  if (newVal === '1') {
    path = form?.tax.path
  } else if (newVal === '2') {
    path = form?.invoiceDocument.path
  }

  if (!path) {
    previewUrl.value = ''
    return
  }

  const response = await previewApi.getPreview(path)
  const url = window.URL.createObjectURL(response.data)
  previewUrl.value = url
})

onMounted(() => {
  getPreviewUrl()
  setColumn()
})
</script>

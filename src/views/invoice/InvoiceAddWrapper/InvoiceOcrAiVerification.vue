<template>
  <div class="p-4 w-full">
    <!-- GRID UTAMA -->
    <div class="grid grid-cols-12 gap-4">
      <!-- ==================== KIRI ==================== -->
      <div class="col-span-7 space-y-4">
        <!-- GENERAL DATA -->
        <div class="bg-white shadow rounded-xl p-4">
          <h2 class="font-semibold text-lg mb-3">General Data</h2>

          <div class="grid grid-cols-2 gap-4 text-sm">
            <div v-for="(row, i) in generalData" :key="i">
              <p class="text-gray-500 text-xs">{{ row.label }}</p>
              <p class="font-semibold">{{ row.value }}</p>
            </div>
          </div>
        </div>

        <!-- GENERAL STATUS -->
        <div class="bg-white shadow rounded-xl p-4">
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

        <div class="bg-white shadow rounded-xl p-4">
          <h2 class="font-semibold text-lg mb-3">Detail Item</h2>

          <div class="max-h-[350px] overflow-auto border rounded-lg">
            <table class="w-full text-sm">
              <thead class="bg-gray-100 text-xs">
                <tr>
                  <th class="p-2">QTY MATCH</th>
                  <th class="p-2">UNIT PRICE MATCH</th>
                  <th class="p-2">VAT MATCH</th>
                  <th class="p-2">WHT MATCH</th>
                  <th class="p-2">PRICE</th>
                  <th class="p-2">TOTAL AMOUNT</th>
                  <th class="p-2">VAT RATE</th>
                  <th class="p-2">VAT</th>
                  <th class="p-2">INVOICE AMOUNT</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="(row, i) in detailItems" :key="i" class="border-b">
                  <!-- MATCH ICONS -->
                  <td class="p-2 text-center">
                    <i
                      :class="
                        row.qtyMatch
                          ? 'ki-filled ki-check text-green-600'
                          : 'ki-filled ki-cross text-red-500'
                      "
                    ></i>
                  </td>
                  <td class="p-2 text-center">
                    <i
                      :class="
                        row.unitMatch
                          ? 'ki-filled ki-check text-green-600'
                          : 'ki-filled ki-cross text-red-500'
                      "
                    ></i>
                  </td>
                  <td class="p-2 text-center">
                    <i
                      :class="
                        row.vatMatch
                          ? 'ki-filled ki-check text-green-600'
                          : 'ki-filled ki-cross text-red-500'
                      "
                    ></i>
                  </td>
                  <td class="p-2 text-center">
                    <i
                      :class="
                        row.whtMatch
                          ? 'ki-filled ki-check text-green-600'
                          : 'ki-filled ki-cross text-red-500'
                      "
                    ></i>
                  </td>

                  <!-- NUMBERS -->
                  <td class="p-2">{{ row.price }}</td>
                  <td class="p-2">{{ row.totalAmount }}</td>
                  <td class="p-2">{{ row.vatRate }}</td>
                  <td class="p-2">{{ row.vat }}</td>
                  <td class="p-2 font-semibold">{{ row.invoiceAmount }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- TABLE VERIFIKASI -->
        <div class="bg-white shadow rounded-xl p-4">
          <div class="flex justify-between mb-3">
            <h2 class="font-semibold text-lg">Invoice Verification</h2>
            <button
              class="px-3 py-1 bg-blue-600 text-white rounded-lg"
              @click="handleVerifyInvoice"
            >
              Verify Invoice
            </button>
          </div>

          <div class="max-h-[300px] overflow-auto border rounded-lg">
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
        <div v-if="showAiAction" class="bg-white shadow rounded-xl p-4 mt-4 border border-blue-300">
          <h2 class="font-semibold text-lg mb-3">AI Action</h2>

          <div class="flex gap-4">
            <!-- Avatar AI -->
            <img
              src="https://cdnai.iconscout.com/ai-image/premium/thumb/ai-female-customer-care-agent-3d-illustration-png-download-jpg-13152628.png"
              alt="AI Assistant"
              class="w-20 h-20 object-contain"
            />

            <!-- Text -->
            <div class="text-sm">
              <p class="font-semibold text-red-500">Terdapat mismatch pada:</p>
              <ul class="list-disc ml-5">
                <li>Invoice amount</li>
                <li>Tax base (DPP)</li>
                <li>PPN amount</li>
              </ul>

              <div class="flex gap-3 mt-3">
                <button class="px-4 py-2 bg-blue-600 text-white rounded-lg">
                  Send Back to Vendor
                </button>
                <button class="px-4 py-2 bg-green-600 text-white rounded-lg">Proceed</button>
              </div>
            </div>
          </div>

          <!-- Pesan AI -->
          <div class="mt-4 p-3 bg-gray-50 rounded-lg text-sm leading-relaxed">
            Yth. PT Sinar Packaging, <br />
            Terkait Invoice <strong>INV-0924-3321</strong>, terdapat ketidaksesuaian berikut:
            <br /><br />
            1. Harga per unit pada line item 10 tidak sesuai dengan PO (Rp 2.750 ≠ Rp 2.500). <br />
            2. Faktur pajak yang terdaftar tidak sesuai dengan nilai invoice. <br /><br />
            Mohon dilakukan revisi invoice dan pembetulan faktur pajak agar proses dapat
            dilanjutkan.
            <br />
            Terima kasih.
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
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, inject, onMounted, watch } from 'vue'
import { usePreviewFileStore } from '@/stores/general/previewFile'
import type { formTypes } from '../types/invoiceAddWrapper'

const form = inject<formTypes>('form')
const previewApi = usePreviewFileStore()

const previewUrl = ref<string>(form.tax.path)

const showAiAction = ref(false)

const handleVerifyInvoice = () => {
  showAiAction.value = true
}

const getPreviewUrl = async () => {
  const response = await previewApi.getPreview(form.tax.path)
  const url = window.URL.createObjectURL(response.data)
  previewUrl.value = url
}

onMounted(() => {
  getPreviewUrl()
})

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
  { header: 'Nama Vendor', data: 'CIPTA PIRANTI', validation: 'Verified', isVerified: true },
  { header: 'NPWP Vendor', data: '0754067980829000', validation: 'OK', isVerified: true },
  { header: 'Perusahaan', data: 'ACARYA DATA ESA', validation: 'Verified', isVerified: false },
  { header: 'NPWP', data: '040338237508000', validation: 'OK', isVerified: true },
  { header: 'Nilai Penjualan', data: '370,000', validation: 'Hitung manual', highlight: true },
])

const detailItems = ref([
  {
    qtyMatch: true,
    unitMatch: true,
    vatMatch: true,
    whtMatch: true,
    price: '540',
    totalAmount: '129.600.000',
    vatRate: '10%',
    vat: '12.960.000',
    invoiceAmount: '116.640.000',
  },
  {
    qtyMatch: true,
    unitMatch: true,
    vatMatch: true,
    whtMatch: true,
    price: '670',
    totalAmount: '192.000.000',
    vatRate: '10%',
    vat: '19.200.000',
    invoiceAmount: '172.800.000',
  },
  {
    qtyMatch: true,
    unitMatch: true,
    vatMatch: true,
    whtMatch: true,
    price: '214.000',
    totalAmount: '85.600.000',
    vatRate: '10%',
    vat: '8.560.000',
    invoiceAmount: '77.040.000',
  },
  {
    qtyMatch: false,
    unitMatch: false,
    vatMatch: false,
    whtMatch: false,
    price: '1.500',
    totalAmount: '432.000.000',
    vatRate: '10%',
    vat: '43.200.000',
    invoiceAmount: '388.800.000',
  },
  {
    qtyMatch: true,
    unitMatch: true,
    vatMatch: true,
    whtMatch: false,
    price: '1.500',
    totalAmount: '180.000.000',
    vatRate: '10%',
    vat: '18.000.000',
    invoiceAmount: '162.000.000',
  },
])

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
</script>

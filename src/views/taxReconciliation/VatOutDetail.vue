<template>
  <div class="pb-20">
    <Breadcrumb title="Tax Invoice Detail" :routes="routes" />
    <hr class="-mx-[24px] mb-[24px]" />

    <!-- Loading -->
    <div
      v-if="isLoading"
      class="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-300"
    >
      <span class="loading loading-spinner loading-lg text-primary"></span>
      <p class="mt-4 text-gray-500 font-medium italic">Fetching tax record details...</p>
    </div>

    <!-- Not Found -->
    <div v-else-if="!selectedRow" class="p-10 text-center bg-red-50 rounded-xl border border-red-100">
      <i class="ki-filled ki-information-2 text-4xl text-danger mb-4"></i>
      <h3 class="text-lg font-bold text-gray-800">Record Not Found</h3>
      <p class="text-gray-500 mb-6">The requested VAT Out invoice could not be retrieved.</p>
      <button class="btn btn-primary" @click="goBack">
        <i class="ki-filled ki-arrow-left"></i>
        Return to List
      </button>
    </div>

    <!-- Content -->
    <div v-else class="space-y-6 animate-in fade-in duration-500">

      <!-- Status Overview Card -->
      <div class="card">
        <div class="card-body p-[24px]">
          <div class="flex flex-wrap items-start justify-between gap-6">

            <!-- Left: Info rows -->
            <div class="flex flex-col gap-[14px]">
              <div class="flex items-center gap-[10px]">
                <p class="font-normal text-sm text-gray-500 w-28 shrink-0">Status</p>
                <span :class="['badge px-3 py-1 text-sm font-bold', statusBadgeClass]">
                  {{ selectedRow.statusfaktur || 'NO STATUS' }}
                </span>
              </div>
              <div v-if="selectedRow.nomorfaktur" class="flex items-center gap-[10px]">
                <p class="font-normal text-sm text-gray-500 w-28 shrink-0">Invoice No.</p>
                <p class="font-bold text-sm text-primary">{{ selectedRow.nomorfaktur }}</p>
              </div>
              <div class="flex items-center gap-[10px]">
                <p class="font-normal text-sm text-gray-500 w-28 shrink-0">Tax Type</p>
                <p class="font-semibold text-sm text-gray-800">VAT Out (Pajak Luaran)</p>
              </div>
              <div v-if="selectedRow.tanggalfaktur" class="flex items-center gap-[10px]">
                <p class="font-normal text-sm text-gray-500 w-28 shrink-0">Invoice Date</p>
                <p class="font-normal text-sm text-gray-800">{{ formatDate(selectedRow.tanggalfaktur) }}</p>
              </div>
            </div>

            <!-- Right: Action Buttons -->
            <div class="flex flex-col gap-2 items-end">
              <template v-if="selectedRow.statusfaktur === 'DRAFT'">
                <button class="btn btn-primary w-full" @click="handleUpload">
                  <i class="ki-filled ki-cloud-change"></i> Upload to DJP
                </button>
                <button class="btn btn-danger w-full" @click="handleDelete">
                  <i class="ki-filled ki-trash"></i> Delete Draft
                </button>
              </template>
              <template v-if="selectedRow.statusfaktur === 'APPROVED' || selectedRow.statusfaktur === 'CANCELED'">
                <button class="btn btn-success w-full" @click="openPreview">
                  <i class="ki-filled ki-file-down"></i> View Faktur Pajak
                </button>
              </template>
            </div>

          </div>
        </div>
      </div>

      <!-- Main Layout -->
      <div class="flex flex-col lg:flex-row gap-[24px] items-start">

        <!-- LEFT COLUMN -->
        <div class="flex-1 space-y-6">

          <!-- Section 1: Buyer Information -->
          <div class="card">
            <div class="card-header py-[17px] flex items-center justify-between gap-[8px]">
              <h3 class="card-title text-base font-semibold">Buyer Information</h3>
            </div>
            <div class="card-body flex flex-col gap-[20px]">
              <div class="flex items-center justify-between gap-[10px]">
                <p class="font-normal text-sm text-gray-600">Buyer Name</p>
                <p class="font-normal text-sm font-semibold text-gray-800">{{ selectedRow.namapembeli || '-' }}</p>
              </div>
              <div class="flex items-center justify-between gap-[10px]">
                <p class="font-normal text-sm text-gray-600">NPWP / NIK</p>
                <p class="font-normal text-sm font-semibold text-primary">{{ selectedRow.npwppembeli || '-' }}</p>
              </div>
              <div class="flex items-center justify-between gap-[10px]">
                <p class="font-normal text-sm text-gray-600">Address</p>
                <p class="font-normal text-sm text-gray-800 max-w-sm text-right leading-relaxed">{{ selectedRow.alamatpembeli || '-' }}</p>
              </div>
            </div>
          </div>

          <!-- Section 2: Seller Information -->
          <div class="card">
            <div class="card-header py-[17px] flex items-center justify-between gap-[8px]">
              <h3 class="card-title text-base font-semibold">Seller Information</h3>
            </div>
            <div class="card-body flex flex-col gap-[20px]">
              <div class="flex items-center justify-between gap-[10px]">
                <p class="font-normal text-sm text-gray-600">Seller Name</p>
                <p class="font-normal text-sm font-semibold text-gray-800">{{ selectedRow.namatokopenjual || '-' }}</p>
              </div>
              <div class="flex items-center justify-between gap-[10px]">
                <p class="font-normal text-sm text-gray-600">NPWP Seller</p>
                <p class="font-normal text-sm font-semibold text-primary">{{ selectedRow.npwppenjual || '-' }}</p>
              </div>
            </div>
          </div>

        </div>

        <!-- RIGHT COLUMN: Sidebar -->
        <div class="w-full lg:max-w-sm space-y-6 lg:sticky lg:top-0">

          <!-- Tax Calculation -->
          <div class="card">
            <div class="card-header py-[17px] flex items-center justify-between gap-[8px]">
              <h3 class="card-title text-base font-semibold">Tax Calculation</h3>
            </div>
            <div class="card-body flex flex-col gap-[20px]">
              <div class="flex items-center justify-between gap-[10px]">
                <p class="font-normal text-sm text-gray-600">Tax Base (DPP)</p>
                <p class="font-normal text-sm font-semibold text-gray-800">{{ formatCurrency(selectedRow.totaldpp) }}</p>
              </div>
              <div class="flex items-center justify-between gap-[10px] border-t border-gray-100 pt-4">
                <p class="font-normal text-sm font-semibold text-danger">VAT (PPN)</p>
                <p class="font-bold text-base text-danger">{{ formatCurrency(selectedRow.totalppn) }}</p>
              </div>
            </div>
          </div>

          <!-- System Metadata -->
          <div class="card">
            <div class="card-header py-[17px] flex items-center justify-between gap-[8px]">
              <h3 class="card-title text-base font-semibold">System Metadata</h3>
            </div>
            <div class="card-body flex flex-col gap-[20px]">
              <div class="flex items-center justify-between gap-[10px]">
                <p class="font-normal text-sm text-gray-600">Local DB ID</p>
                <p class="font-normal text-sm font-semibold text-gray-800"># {{ selectedRow.id || '-' }}</p>
              </div>
              <div class="flex items-center justify-between gap-[10px]">
                <p class="font-normal text-sm text-gray-600">Reference</p>
                <p class="font-normal text-sm text-gray-800">{{ selectedRow.referensi || '-' }}</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- Footer -->
      <div class="pt-8 border-t border-gray-200 flex items-center justify-between">
        <button class="btn btn-outline btn-primary shadow-sm" @click="goBack">
          <i class="ki-filled ki-arrow-left"></i>
          Back to List
        </button>
        <div class="flex gap-2">
          <template v-if="selectedRow.statusfaktur === 'DRAFT'">
            <button class="btn btn-primary" @click="handleUpload">
              <i class="ki-filled ki-cloud-change"></i> Upload to DJP
            </button>
          </template>
          <template v-if="selectedRow.statusfaktur === 'APPROVED' || selectedRow.statusfaktur === 'CANCELED'">
            <button v-if="selectedRow.statusfaktur === 'APPROVED'" class="btn btn-danger" @click="handleCancel">
              <i class="ki-filled ki-cross-circle"></i> Cancel Invoice
            </button>
          </template>
        </div>
      </div>

    </div>
  </div>

  <UiModal v-model="showPreviewModal" title="View VAT Out PDF" size="xl">
    <div v-if="pdfLoading" class="flex flex-col items-center justify-center py-20">
      <span class="loading loading-spinner loading-lg text-primary"></span>
      <p class="mt-4 text-gray-500 font-medium">Generating PDF preview...</p>
    </div>
    <iframe v-else-if="pdfBlobUrl" :src="pdfBlobUrl" class="w-full h-[650px] rounded-lg border-0"></iframe>
  </UiModal>

  <!-- Hidden Printable Faktur Pajak Template -->
  <div style="position: fixed; top: 0; left: 0; z-index: -9999; opacity: 0; pointer-events: none;">
    <div id="faktur-print-hidden" style="width: 794px; height: 1122px; background: white; padding: 30px; box-sizing: border-box; font-family: Arial, sans-serif; color: black; line-height: 1.25; position: relative;">
      <div class="faktur-container-print-only" style="border: 1px solid black; padding: 20px; height: 100%; box-sizing: border-box; position: relative; display: flex; flex-direction: column; justify-content: space-between;">
      <div v-if="selectedRow?.statusfaktur === 'CANCELED'" style="position: absolute; top: 40%; left: 50%; transform: translate(-50%, -50%) rotate(-25deg); font-size: 80px; font-weight: 800; color: rgba(229, 62, 62, 0.15); border: 8px solid rgba(229, 62, 62, 0.15); padding: 8px 24px; pointer-events: none; z-index: 10; letter-spacing: 6px; text-transform: uppercase;">CANCELED</div>
      <div v-else style="position: absolute; top: 40%; left: 50%; transform: translate(-50%, -50%) rotate(-25deg); font-size: 80px; font-weight: 800; color: rgba(160, 174, 192, 0.12); border: 8px solid rgba(160, 174, 192, 0.12); padding: 8px 24px; pointer-events: none; z-index: 10; letter-spacing: 6px; text-transform: uppercase;">PROFORMA</div>

      <div style="text-align: center; font-size: 20px; font-weight: bold; margin-bottom: 15px; text-transform: uppercase;">Faktur Pajak</div>

      <table style="width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 8px;">
        <tr>
          <td colspan="4" style="border: 1px solid black; padding: 5px;">
            <strong>Kode dan Nomor Seri Faktur Pajak :</strong> {{ selectedRow?.nomorfaktur || '-' }}
          </td>
        </tr>
        <tr style="font-weight: bold; background-color: #f2f2f2;">
          <td colspan="4" style="border: 1px solid black; padding: 5px;">Pengusaha Kena Pajak</td>
        </tr>
        <tr>
          <td colspan="4" style="border: 1px solid black; padding: 5px; line-height: 1.4;">
            Nama : {{ selectedRow?.namatokopenjual || '-' }}<br/>
            Alamat : {{ selectedRow?.alamatpenjual || 'Kpg. Arlie no 7, RT007/RW001, TEBET BARAT, TEBET, KOTA ADM. JAKARTA SELATAN, DKI JAKARTA, 12810' }}<br/>
            NPWP : {{ selectedRow?.npwppenjual || '-' }}
          </td>
        </tr>
        <tr style="font-weight: bold; background-color: #f2f2f2;">
          <td colspan="4" style="border: 1px solid black; padding: 5px;">Pembeli Barang Kena Pajak / Penerima Jasa Kena Pajak</td>
        </tr>
        <tr>
          <td colspan="4" style="border: 1px solid black; padding: 5px; line-height: 1.4;">
            Nama : {{ selectedRow?.namapembeli || '-' }}<br/>
            Alamat : {{ selectedRow?.alamatpembeli || '-' }}<br/>
            NPWP : {{ selectedRow?.npwppembeli || '-' }}<br/>
            NIK : -<br/>
            Nomor Paspor : -<br/>
            Identitas Lain : -<br/>
            Email : {{ selectedRow?.emailpembeli || '-' }}
          </td>
        </tr>
      </table>

      <table style="width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 10px;">
        <thead>
          <tr style="background-color: #f2f2f2; text-align: center; font-weight: bold;">
            <th style="width: 5%; border: 1px solid black; padding: 5px;">No</th>
            <th style="width: 15%; border: 1px solid black; padding: 5px;">Kode Barang/Jasa</th>
            <th style="width: 55%; border: 1px solid black; padding: 5px;">Nama Barang Kena Pajak / Jasa Kena Pajak</th>
            <th style="width: 25%; border: 1px solid black; padding: 5px;">Harga Jual / Penggantian / Uang Muka / Termin (Rp)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid black; padding: 5px; text-align: center;">1</td>
            <td style="border: 1px solid black; padding: 5px; text-align: center;">000000</td>
            <td style="border: 1px solid black; padding: 5px; line-height: 1.3;">
              GOODS - Sample Item<br/>
              <span style="font-size: 10px; color: #555;">
                Rp {{ formatIndo(selectedRow?.totaldpp) }} x 1<br/>
                Potongan Harga = Rp 0,00<br/>
                PPnBM (0%) = Rp 0,00
              </span>
            </td>
            <td style="border: 1px solid black; padding: 5px; text-align: right;">{{ formatIndo(selectedRow?.totaldpp) }}</td>
          </tr>
          <tr>
            <td colspan="3" style="border: 1px solid black; padding: 5px; font-weight: bold;">Harga Jual / Penggantian / Uang Muka / Termin</td>
            <td style="border: 1px solid black; padding: 5px; text-align: right; font-weight: bold;">{{ formatIndo(selectedRow?.totaldpp) }}</td>
          </tr>
          <tr>
            <td colspan="3" style="border: 1px solid black; padding: 5px;">Dikurangi Potongan Harga</td>
            <td style="border: 1px solid black; padding: 5px; text-align: right;">0,00</td>
          </tr>
          <tr>
            <td colspan="3" style="border: 1px solid black; padding: 5px;">Dikurangi Uang Muka yang telah diterima</td>
            <td style="border: 1px solid black; padding: 5px; text-align: right;">0,00</td>
          </tr>
          <tr>
            <td colspan="3" style="border: 1px solid black; padding: 5px; font-weight: bold;">Dasar Pengenaan Pajak</td>
            <td style="border: 1px solid black; padding: 5px; text-align: right; font-weight: bold;">{{ formatIndo(selectedRow?.totaldpp) }}</td>
          </tr>
          <tr>
            <td colspan="3" style="border: 1px solid black; padding: 5px; font-weight: bold;">Jumlah PPN (Pajak Pertambahan Nilai)</td>
            <td style="border: 1px solid black; padding: 5px; text-align: right; font-weight: bold;">{{ formatIndo(selectedRow?.totalppn) }}</td>
          </tr>
          <tr>
            <td colspan="3" style="border: 1px solid black; padding: 5px;">Jumlah PPnBM (Pajak Penjualan atas Barang Mewah)</td>
            <td style="border: 1px solid black; padding: 5px; text-align: right;">{{ formatIndo(selectedRow?.totalppnbm || 0) }}</td>
          </tr>
        </tbody>
      </table>

      <p style="font-size: 9px; margin-top: 10px; line-height: 1.3; color: #4a5568;">
        Sesuai dengan ketentuan yang berlaku, Direktorat Jenderal Pajak mengatur bahwa Faktur Pajak ini telah ditandatangani secara elektronik sehingga tidak diperlukan tanda tangan basah pada Faktur Pajak ini.
      </p>

      <table style="width: 100%; border: 0; margin-top: 15px; font-size: 11px;">
        <tr>
          <td style="vertical-align: top; color: #555;">{{ selectedRow?.referensi || '' }}</td>
          <td style="text-align: center; width: 250px;">
            <div>Jakarta, {{ formatDisplayDate(selectedRow?.tanggalfaktur) }}</div>
            <div style="margin-top: 45px; font-weight: bold; text-decoration: underline; text-transform: uppercase;">{{ selectedRow?.namapenandatangan || 'RADHITYA ARIE KENPRASOJO' }}</div>
          </td>
        </tr>
      </table>

      <div style="font-size: 8px; border-top: 1px solid black; padding-top: 5px; margin-top: 25px; color: #4a5568; line-height: 1.3;">
        <strong>PEMBERITAHUAN:</strong> Faktur Pajak ini telah dilaporkan ke Direktorat Jenderal Pajak dan telah memperoleh persetujuan sesuai dengan ketentuan peraturan perpajakan yang berlaku. PERINGATAN: PKP yang menerbitkan Faktur Pajak yang tidak sesuai dengan keadaan yang sebenarnya dan/atau sesungguhnya dimaksud Pasal 13 ayat (9) UU PPN dikenai sanksi administrasi sesuai dengan Pasal 14 ayat (4) UU KUP.
        <span style="float: right;">1 dari 1</span>
      </div>
    </div>
  </div>
</div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { type routeTypes } from '@/core/type/components/breadcrumb'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import { getVatOutList, postVatInDownloadPdf } from '@/core/utils/vatPxInvoiceApi'
import UiModal from '@/components/modal/UiModal.vue'
import Swal from 'sweetalert2'

const router = useRouter()
const route = useRoute()
const isLoading = ref<boolean>(false)
const selectedRow = ref<any>(null)
const vendorNpwp = '1091031210969728'

const routes = ref<routeTypes[]>([
  { name: 'Tax Reconciliation', to: '/tax-reconciliation' },
  { name: 'VAT (Pajak Luaran)', to: '/vat-out-reconciliation' },
  { name: 'Detail', to: '#' },
])

const statusBadgeClass = computed(() => {
  if (!selectedRow.value) return 'badge-light'
  const s = (selectedRow.value.statusfaktur || '').toUpperCase()
  if (s === 'DRAFT') return 'badge-light-primary'
  if (s === 'APPROVED' || s === 'Valid') return 'badge-success text-white'
  if (s === 'CANCELED') return 'badge-light-danger'
  return 'badge-light'
})

const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return dateString
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

const formatCurrency = (amount: number) => {
  const num = Number(amount) || 0
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(num)
}

const goBack = () => {
  router.back()
}

const handleUpload = () => {
  Swal.fire({
    title: 'Upload to DJP',
    text: 'This will submit the draft invoice to DJP.',
    icon: 'info',
    confirmButtonText: 'OK'
  })
}

const handleDelete = () => {
  Swal.fire({
    title: 'Delete Draft',
    text: 'This will delete the draft invoice.',
    icon: 'error',
    confirmButtonText: 'OK'
  })
}

const handleCancel = () => {
  Swal.fire({
    title: 'Cancel Invoice',
    text: 'This will officially cancel the tax invoice.',
    icon: 'warning',
    confirmButtonText: 'OK'
  })
}

const fetchDetail = async () => {
  isLoading.value = true
  try {
    const response = await getVatOutList(vendorNpwp, { page: 1, limit: 100 })
    const payload = response.data?.result?.content || response.data?.result || response.data
    const list = payload?.data || []

    const targetId = route.params.id as string
    selectedRow.value = list.find((item: any) => item.id == targetId)
  } catch (error) {
    console.error('Error fetching VAT out details:', error)
  } finally {
    isLoading.value = false
  }
}

const handleDownloadPdf = () => {
  if (!selectedRow.value) return

  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    Swal.fire('Error', 'Failed to open print window. Please allow popups.', 'error')
    return
  }

  const formatIndo = (numStr: any) => {
    const val = parseFloat(numStr) || 0
    return new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val)
  }

  const formattedDpp = formatIndo(selectedRow.value.totaldpp)
  const formattedPpn = formatIndo(selectedRow.value.totalppn)
  const formattedPpnBm = formatIndo(selectedRow.value.totalppnbm || 0)

  const rawDate = selectedRow.value.tanggalfaktur
  let displayDate = ''
  if (rawDate) {
    const dateObj = new Date(rawDate)
    if (!isNaN(dateObj.getTime())) {
      displayDate = dateObj.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).replace(/\//g, '')
    } else if (rawDate.length === 8) {
      displayDate = rawDate
    }
  }

  const itemsHtml = `
    <tr>
      <td style="border: 1px solid black; text-align: center; padding: 4px;">1</td>
      <td style="border: 1px solid black; text-align: center; padding: 4px;">000000</td>
      <td style="border: 1px solid black; padding: 4px; font-size: 11px; line-height: 1.3;">
        GOODS - Sample Item<br/>
        Rp ${formatIndo(selectedRow.value.totaldpp)} x 1<br/>
        Potongan Harga = Rp 0,00<br/>
        PPnBM (0%) = Rp 0,00
      </td>
      <td style="border: 1px solid black; text-align: right; padding: 4px;">${formattedDpp}</td>
    </tr>
  `

  const htmlContent = `
    <html>
    <head>
      <title>Faktur Pajak - ${selectedRow.value.nomorfaktur || 'Draft'}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          font-size: 11px;
          color: black;
          margin: 10px;
        }
        .container {
          width: 100%;
          max-width: 750px;
          margin: 0 auto;
          border: 1px solid black;
          padding: 15px;
          position: relative;
        }
        .header-title {
          text-align: center;
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 15px;
          text-transform: uppercase;
        }
        .table-full {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 8px;
        }
        .table-full td, .table-full th {
          border: 1px solid black;
          padding: 5px;
          vertical-align: top;
        }
        .section-title {
          font-weight: bold;
          background-color: #f2f2f2;
        }
        .watermark {
          position: absolute;
          top: 30%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-25deg);
          font-size: 75px;
          font-weight: bold;
          color: rgba(200, 200, 200, 0.4);
          pointer-events: none;
          z-index: 999;
          letter-spacing: 5px;
        }
        .footer-sign {
          margin-top: 15px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .footer-note {
          font-size: 9px;
          border-top: 1px solid black;
          padding-top: 5px;
          margin-top: 25px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="watermark">Proforma</div>
        <div class="header-title">Faktur Pajak</div>

        <table class="table-full">
          <tr>
            <td colspan="4">
              <strong>Kode dan Nomor Seri Faktur Pajak :</strong> ${selectedRow.value.nomorfaktur || '-'}
            </td>
          </tr>

          <tr class="section-title">
            <td colspan="4">Pengusaha Kena Pajak</td>
          </tr>
          <tr>
            <td colspan="4" style="line-height: 1.4;">
              Nama : ${selectedRow.value.namatokopenjual || '-'}<br/>
              Alamat : ${selectedRow.value.alamatpenjual || 'Kpg. Arlie no 7, RT007/RW001, TEBET BARAT, TEBET, KOTA ADM. JAKARTA SELATAN, DKI JAKARTA, 12810'}<br/>
              NPWP : ${selectedRow.value.npwppenjual || '-'}
            </td>
          </tr>

          <tr class="section-title">
            <td colspan="4">Pembeli Barang Kena Pajak / Penerima Jasa Kena Pajak</td>
          </tr>
          <tr>
            <td colspan="4" style="line-height: 1.4;">
              Nama : ${selectedRow.value.namapembeli || '-'}<br/>
              Alamat : ${selectedRow.value.alamatpembeli || '-'}<br/>
              NPWP : ${selectedRow.value.npwppembeli || '-'}<br/>
              NIK : -<br/>
              Nomor Paspor : -<br/>
              Identitas Lain : -<br/>
              Email : ${selectedRow.value.emailpembeli || '-'}
            </td>
          </tr>
        </table>

        <table class="table-full" style="margin-top: 10px;">
          <thead>
            <tr style="background-color: #f2f2f2; text-align: center;">
              <th style="width: 5%;">No</th>
              <th style="width: 15%;">Kode Barang/Jasa</th>
              <th style="width: 55%;">Nama Barang Kena Pajak / Jasa Kena Pajak</th>
              <th style="width: 25%;">Harga Jual / Penggantian / Uang Muka / Termin (Rp)</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
            <tr>
              <td colspan="3" style="font-weight: bold; border: 1px solid black;">Harga Jual / Penggantian / Uang Muka / Termin</td>
              <td style="border: 1px solid black; text-align: right; font-weight: bold;">${formattedDpp}</td>
            </tr>
            <tr>
              <td colspan="3" style="border: 1px solid black;">Dikurangi Potongan Harga</td>
              <td style="border: 1px solid black; text-align: right;">0,00</td>
            </tr>
            <tr>
              <td colspan="3" style="border: 1px solid black;">Dikurangi Uang Muka yang telah diterima</td>
              <td style="border: 1px solid black; text-align: right;">0,00</td>
            </tr>
            <tr>
              <td colspan="3" style="font-weight: bold; border: 1px solid black;">Dasar Pengenaan Pajak</td>
              <td style="border: 1px solid black; text-align: right; font-weight: bold;">${formattedDpp}</td>
            </tr>
            <tr>
              <td colspan="3" style="font-weight: bold; border: 1px solid black;">Jumlah PPN (Pajak Pertambahan Nilai)</td>
              <td style="border: 1px solid black; text-align: right; font-weight: bold;">${formattedPpn}</td>
            </tr>
            <tr>
              <td colspan="3" style="border: 1px solid black;">Jumlah PPnBM (Pajak Penjualan atas Barang Mewah)</td>
              <td style="border: 1px solid black; text-align: right;">${formattedPpnBm}</td>
            </tr>
          </tbody>
        </table>

        <p style="font-size: 10px; margin-top: 10px; line-height: 1.3; margin-bottom: 15px;">
          Sesuai dengan ketentuan yang berlaku, Direktorat Jenderal Pajak mengatur bahwa Faktur Pajak ini telah ditandatangani secara elektronik sehingga tidak diperlukan tanda tangan basah pada Faktur Pajak ini.
        </p>

        <div class="footer-sign">
          <div>
            <span style="font-size: 10px; display: block; margin-top: 10px;">${selectedRow.value.referensi || ''}</span>
          </div>
          <div style="text-align: center; margin-right: 40px; font-size: 11px;">
            <span style="display: block; margin-bottom: 45px;">Jakarta, ${displayDate}</span>
            <strong style="text-decoration: underline; text-transform: uppercase;">${selectedRow.value.namapenandatangan || 'RADHITYA ARIE KENPRASOJO'}</strong>
          </div>
        </div>

        <div class="footer-note">
          <strong>PEMBERITAHUAN:</strong> Faktur Pajak ini telah dilaporkan ke Direktorat Jenderal Pajak dan telah memperoleh persetujuan sesuai dengan ketentuan peraturan perpajakan yang berlaku. PERINGATAN: PKP yang menerbitkan Faktur Pajak yang tidak sesuai dengan keadaan yang sebenarnya and/atau sesungguhnya dimaksud Pasal 13 ayat (9) UU PPN dikenai sanksi administrasi sesuai dengan Pasal 14 ayat (4) UU KUP.
          <span style="float: right;">1 dari 1</span>
        </div>
      </div>

      <script>
        window.onload = function() {
          window.print();
          setTimeout(function() { window.close(); }, 500);
        };
      <\/script>
    </body>
    </html>
  `

      printWindow.document.write(htmlContent)
      printWindow.document.close()
}

const showPreviewModal = ref(false)
const pdfBlobUrl = ref('')
const pdfLoading = ref(false)

const loadHtml2Pdf = () => {
  return new Promise<any>((resolve) => {
    if ((window as any).html2pdf) {
      resolve((window as any).html2pdf)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js'
    script.onload = () => resolve((window as any).html2pdf)
    document.head.appendChild(script)
  })
}

const openPreview = async () => {
  showPreviewModal.value = true
  pdfLoading.value = true
  pdfBlobUrl.value = ''

  try {
    const html2pdf = await loadHtml2Pdf()
    setTimeout(() => {
      const element = document.getElementById('faktur-print-hidden')
      const opt = {
        margin: 0,
        filename: `Faktur_${selectedRow.value?.nomorfaktur || 'Pajak'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, scrollY: 0, scrollX: 0 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }

      html2pdf().from(element).set(opt).toPdf().get('pdf').then((pdf: any) => {
        const blob = pdf.output('blob')
        pdfBlobUrl.value = URL.createObjectURL(blob)
        pdfLoading.value = false
      }).catch((err: any) => {
        console.error('Error rendering pdf', err)
        pdfLoading.value = false
      })
    }, 300)
  } catch (error) {
    console.error('Failed to load html2pdf script:', error)
    pdfLoading.value = false
  }
}

const formatIndo = (numStr: any) => {
  const val = parseFloat(numStr) || 0
  return new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val)
}

const formatDisplayDate = (dateString: string) => {
  if (!dateString) return ''
  const dateObj = new Date(dateString)
  if (!isNaN(dateObj.getTime())) {
    return dateObj.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '')
  }
  return dateString
}

onMounted(() => {
  fetchDetail()
})
</script>

<style scoped>
.text-danger { color: #f1416c; }

.faktur-container-preview {
  position: relative;
  background-color: white;
  border: 1px solid #e2e8f0;
  padding: 24px;
  font-family: Arial, sans-serif;
  color: #1a202c;
  overflow: hidden;
}
.faktur-header {
  text-align: center;
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.faktur-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 11px;
}
.faktur-table td, .faktur-table th {
  border: 1px solid #1a202c;
  padding: 6px;
  vertical-align: top;
}
.faktur-section {
  font-weight: bold;
  background-color: #f7fafc;
}
.lh-1_5 {
  line-height: 1.5;
}
.text-2xs {
  font-size: 9px;
}
.faktur-footer {
  font-size: 8px;
  border-top: 1px solid #1a202c;
  padding-top: 6px;
  margin-top: 24px;
  color: #4a5568;
}
.watermark-text {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-25deg);
  font-size: 80px;
  font-weight: 800;
  color: rgba(160, 174, 192, 0.12);
  border: 8px solid rgba(160, 174, 192, 0.12);
  padding: 8px 24px;
  pointer-events: none;
  z-index: 10;
  letter-spacing: 6px;
  text-transform: uppercase;
}
.watermark-text.canceled {
  color: rgba(229, 62, 62, 0.15);
  border-color: rgba(229, 62, 62, 0.15);
}
</style>

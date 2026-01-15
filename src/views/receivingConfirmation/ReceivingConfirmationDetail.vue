<template>
  <div>
    <Breadcrumb title="Receiving Confirmation Detail" :routes="routes" />
    <hr class="-mx-[24px] mb-[24px]" />

    <div class="border border-gray-200 rounded-xl p-[24px]">
      <!-- Form Section -->
      <div class="border border-gray-200 rounded-xl p-[24px] mb-[24px]">
        <h3 class="text-lg font-semibold mb-4">Receiving Confirmation Information</h3>
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- Left and Middle Columns - Form Fields (8 columns) -->
          <div class="lg:col-span-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              <!-- Left Column -->
              <div class="space-y-3">
                <!-- Order No -->
                <div class="flex items-center gap-3">
                  <label class="form-label text-sm font-medium text-gray-600 w-36 mb-0"
                    >Order No</label
                  >
                  <input
                    v-model="formData.orderNo"
                    type="text"
                    class="input flex-1 bg-gray-50"
                    disabled
                  />
                </div>

                <!-- Employee Name -->
                <div class="flex items-center gap-3">
                  <label class="form-label text-sm font-medium text-gray-600 w-36 mb-0"
                    >Employee Name</label
                  >
                  <input
                    v-model="formData.namaKaryawan"
                    type="text"
                    class="input flex-1 bg-gray-50"
                    disabled
                  />
                </div>

                <!-- Driver Name -->
                <div class="flex items-center gap-3">
                  <label class="form-label text-sm font-medium text-gray-600 w-36 mb-0"
                    >Driver Name</label
                  >
                  <input
                    v-model="formData.namaSopir"
                    type="text"
                    class="input flex-1 bg-gray-50"
                    disabled
                  />
                </div>

                <!-- License Plate -->
                <div class="flex items-center gap-3">
                  <label class="form-label text-sm font-medium text-gray-600 w-36 mb-0"
                    >License Plate</label
                  >
                  <input
                    v-model="formData.noPolisi"
                    type="text"
                    class="input flex-1 bg-gray-50"
                    disabled
                  />
                </div>

                <!-- Transporter -->
                <div class="flex items-center gap-3">
                  <label class="form-label text-sm font-medium text-gray-600 w-36 mb-0"
                    >Transporter</label
                  >
                  <input
                    v-model="formData.transporter"
                    type="text"
                    class="input flex-1 bg-gray-50"
                    disabled
                  />
                </div>
              </div>

              <!-- Right Column -->
              <div class="space-y-3">
                <!-- Pickup -->
                <div class="flex items-center gap-3">
                  <label class="form-label text-sm font-medium text-gray-600 w-36 mb-0"
                    >Pickup</label
                  >
                  <input
                    v-model="formData.pickup"
                    type="text"
                    class="input flex-1 bg-gray-50"
                    disabled
                  />
                </div>

                <!-- Destination -->
                <div class="flex items-center gap-3">
                  <label class="form-label text-sm font-medium text-gray-600 w-36 mb-0"
                    >Destination</label
                  >
                  <input
                    v-model="formData.destination"
                    type="text"
                    class="input flex-1 bg-gray-50"
                    disabled
                  />
                </div>

                <!-- Order Date -->
                <div class="flex items-center gap-3">
                  <label class="form-label text-sm font-medium text-gray-600 w-36 mb-0"
                    >Order Date</label
                  >
                  <input
                    v-model="formData.orderDate"
                    type="text"
                    class="input flex-1 bg-gray-50"
                    disabled
                  />
                </div>

                <!-- Received Date -->
                <div class="flex items-center gap-3">
                  <label class="form-label text-sm font-medium text-gray-600 w-36 mb-0"
                    >Received Date</label
                  >
                  <input
                    v-model="formData.receivedDate"
                    type="date"
                    class="input flex-1 bg-gray-50"
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column - Signature Display (4 columns) -->
          <div class="lg:col-span-4">
            <div class="border border-gray-200 rounded-lg p-4 h-full flex flex-col">
              <h3 class="text-sm font-semibold mb-3">Employee Signature</h3>
              <div
                class="flex-1 border border-gray-300 rounded bg-gray-50 flex items-center justify-center"
              >
                <img
                  v-if="formData.signature"
                  :src="formData.signature"
                  alt="Signature"
                  class="max-w-full max-h-full"
                />
                <span v-else class="text-gray-400 text-sm">No signature available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Table Section -->
      <div class="border border-gray-200 rounded-xl p-[24px]">
        <h3 class="text-lg font-semibold mb-4">List Receiving Confirmation Request</h3>
        <div class="overflow-x-auto list__table">
          <table class="table align-middle text-gray-700 font-medium text-sm">
            <thead>
              <!-- First Header Row -->
              <tr class="bg-blue-500 text-white">
                <th rowspan="2" class="text-center border-r">Action</th>
                <th rowspan="2" class="text-center border-r">No Pick Slip</th>
                <th rowspan="2" class="text-center border-r">SKU Description</th>
                <th colspan="2" class="text-center border-r">LOT. NO</th>
                <th colspan="3" class="text-center border-r">FG Receipt Confirmation</th>
                <th colspan="2" class="text-center border-r">Loading Difference</th>
                <th colspan="2" class="text-center border-r">Transporter Claim</th>
              </tr>
              <!-- Second Header Row -->
              <tr class="bg-blue-500 text-white">
                <th class="text-center border-r">Delivery Note</th>
                <th class="text-center border-r">Actual</th>
                <th class="text-center border-r">Delivery Note</th>
                <th class="text-center border-r">Received</th>
                <th class="text-center border-r">Difference</th>
                <th class="text-center border-r">More</th>
                <th class="text-center border-r">Less</th>
                <th class="text-center border-r">Repack Qty</th>
                <th class="text-center border-r">Damage Qty</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="tableData.length === 0">
                <td colspan="15" class="text-center">No data available</td>
              </tr>
              <tr v-for="(item, index) in tableData" :key="index">
                <td class="text-center border-r">
                  <button
                    class="btn btn-outline btn-icon btn-primary w-[32px] h-[32px]"
                    @click="viewItem(index)"
                    title="View Details"
                  >
                    <i class="ki-filled ki-eye !text-lg"></i>
                  </button>
                </td>
                <td>{{ item.pickSlip }}</td>
                <td>{{ item.description }}</td>
                <td class="text-right">{{ item.diSuratJalan }}</td>
                <td class="text-right">{{ item.actual }}</td>
                <td class="text-right">{{ item.diSuratJalanKonfirmasi }}</td>
                <td class="text-right">{{ item.diterima }}</td>
                <td class="text-right">{{ item.selisih }}</td>
                <td class="text-right">{{ item.lebih }}</td>
                <td class="text-right">{{ item.kurang }}</td>
                <td class="text-right">{{ item.repackQty }}</td>
                <td class="text-right">{{ item.damageQty }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3 justify-end mt-6">
        <button class="btn btn-light" @click="goBack()">
          <i class="ki-duotone ki-arrow-left"></i>
          Back to List
        </button>

        <!-- Show Approve/Reject buttons only if status is NOT Completed -->
        <template v-if="currentStatus !== 'Completed'">
          <button class="btn btn-danger" @click="openRejectModal()">
            <i class="ki-duotone ki-cross-circle"></i>
            Reject
          </button>
          <button class="btn btn-primary" @click="approveConfirmation()">
            <i class="ki-duotone ki-check-circle"></i>
            Approve
          </button>
        </template>

        <!-- Show Print to PDF button only if status is Completed -->
        <template v-else>
          <button class="btn btn-success" @click="printToPDF()">
            <i class="ki-duotone ki-printer"></i>
            Print to PDF
          </button>
        </template>
      </div>

      <!-- Rejection Modal -->
      <div
        v-if="showRejectModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click.self="closeRejectModal()"
      >
        <div class="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 class="text-lg font-semibold mb-4">Rejection Reason</h3>
          <div class="mb-4">
            <label class="form-label text-sm font-medium text-gray-600 mb-2"
              >Please provide a reason for rejection</label
            >
            <textarea
              v-model="rejectionReason"
              class="input w-full h-32 resize-none p-3"
              placeholder="Please enter the reason for rejection..."
            ></textarea>
          </div>
          <div class="flex gap-3 justify-end">
            <button class="btn btn-light" @click="closeRejectModal()">Cancel</button>
            <button class="btn btn-danger" @click="confirmReject()">Confirm Reject</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { type routeTypes } from '@/core/type/components/breadcrumb'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import ReceivingConfirmationService from '@/services/receivingConfirmation.service'
import Swal from 'sweetalert2'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const router = useRouter()
const route = useRoute()

interface FormData {
  orderNo: string
  namaKaryawan: string
  namaSopir: string
  noPolisi: string
  transporter: string
  pickup: string
  destination: string
  orderDate: string
  receivedDate: string
  signature: string | null
}

interface TableData {
  pickSlip: string
  sku: string
  description: string
  diSuratJalan: number
  actual: number
  diSuratJalanKonfirmasi: number
  diterima: number
  selisih: number
  lebih: number
  kurang: number
  repackQty: number
  damageQty: number
}

const routes = ref<routeTypes[]>([
  {
    name: 'Digital Receiving Confirmation',
    to: '/digital-receiving-confirmation',
  },
])

// Form Data (Read-only)
const formData = ref<FormData>({
  orderNo: 'ORD-2024-001',
  namaKaryawan: 'John Doe',
  namaSopir: 'Driver Name',
  noPolisi: 'B 1234 XYZ',
  transporter: 'PT Trans Jaya',
  pickup: 'Jakarta Warehouse',
  destination: 'Bandung Store',
  orderDate: '2024-12-01',
  receivedDate: '2024-12-05',
  signature: null,
})

// Table Data (Read-only)
const tableData = ref<TableData[]>([
  {
    pickSlip: 'PS-001',
    sku: 'SKU-12345',
    description: 'Product Sample A',
    diSuratJalan: 100,
    actual: 100,
    diSuratJalanKonfirmasi: 100,
    diterima: 98,
    selisih: -2,
    lebih: 0,
    kurang: 2,
    repackQty: 0,
    damageQty: 2,
  },
  {
    pickSlip: 'PS-002',
    sku: 'SKU-67890',
    description: 'Product Sample B',
    diSuratJalan: 50,
    actual: 50,
    diSuratJalanKonfirmasi: 50,
    diterima: 52,
    selisih: 2,
    lebih: 2,
    kurang: 0,
    repackQty: 0,
    damageQty: 0,
  },
])

// Rejection Modal State
const showRejectModal = ref<boolean>(false)
const rejectionReason = ref<string>('')
const currentStatus = ref<string>('')

// Functions
const goBack = () => {
  router.push({ name: 'receivingConfirmation' })
}

const viewItem = (index: number) => {
  const item = tableData.value[index]
  console.log('Viewing item:', item)
  Swal.fire({
    title: 'Item Details',
    text: `${item.pickSlip} - ${item.description}`,
    icon: 'info',
    confirmButtonText: 'OK',
  })
}

const openRejectModal = () => {
  showRejectModal.value = true
  rejectionReason.value = ''
}

const closeRejectModal = () => {
  showRejectModal.value = false
  rejectionReason.value = ''
}

const printToPDF = () => {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  let yPos = 20

  // Header - Company Info
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('GOODS RECEIPT INVOICE', pageWidth / 2, yPos, { align: 'center' })
  yPos += 8

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Receiving Confirmation Report', pageWidth / 2, yPos, { align: 'center' })
  yPos += 15

  // Horizontal line
  doc.setLineWidth(0.5)
  doc.line(14, yPos, pageWidth - 14, yPos)
  yPos += 10

  // Document Info - Two Columns
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')

  // Left Column
  const leftX = 14
  const rightX = pageWidth / 2 + 10
  const labelWidth = 35

  // Report Information
  doc.text('Report ID:', leftX, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(String(formData.value.orderNo || '-'), leftX + labelWidth, yPos)

  doc.setFont('helvetica', 'bold')
  doc.text('Trip ID:', rightX, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(tableData.value[0]?.pickSlip || '-', rightX + labelWidth, yPos)
  yPos += 6

  doc.setFont('helvetica', 'bold')
  doc.text('Order Number:', leftX, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(formData.value.orderNo || '-', leftX + labelWidth, yPos)

  doc.setFont('helvetica', 'bold')
  doc.text('Status:', rightX, yPos)
  doc.setFont('helvetica', 'normal')
  // Status with color
  if (currentStatus.value === 'Completed') {
    doc.setTextColor(34, 197, 94) // Green
  } else if (currentStatus.value === 'Rejected') {
    doc.setTextColor(239, 68, 68) // Red
  }
  doc.text(currentStatus.value || '-', rightX + labelWidth, yPos)
  doc.setTextColor(0, 0, 0) // Reset to black
  yPos += 6

  doc.setFont('helvetica', 'bold')
  doc.text('Received Date:', leftX, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(formData.value.receivedDate || '-', leftX + labelWidth, yPos)

  doc.setFont('helvetica', 'bold')
  doc.text('Has Discrepancy:', rightX, yPos)
  doc.setFont('helvetica', 'normal')
  const hasDiscrepancy = tableData.value.some((item) => item.selisih !== 0)
  doc.text(hasDiscrepancy ? 'Yes' : 'No', rightX + labelWidth, yPos)
  yPos += 10

  // Location & Transport Information
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setFillColor(59, 130, 246) // Blue background
  doc.rect(leftX, yPos, pageWidth - 28, 6, 'F')
  doc.setTextColor(255, 255, 255)
  doc.text('TRANSPORT INFORMATION', leftX + 2, yPos + 4)
  doc.setTextColor(0, 0, 0)
  yPos += 10

  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('Pickup:', leftX, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(formData.value.pickup || '-', leftX + labelWidth, yPos)

  doc.setFont('helvetica', 'bold')
  doc.text('Transporter:', rightX, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(formData.value.transporter || '-', rightX + labelWidth, yPos)
  yPos += 6

  doc.setFont('helvetica', 'bold')
  doc.text('Destination:', leftX, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(formData.value.destination || '-', leftX + labelWidth, yPos)

  doc.setFont('helvetica', 'bold')
  doc.text('License Plate:', rightX, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(formData.value.noPolisi || '-', rightX + labelWidth, yPos)
  yPos += 6

  doc.setFont('helvetica', 'bold')
  doc.text('Driver Name:', leftX, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(formData.value.namaSopir || '-', leftX + labelWidth, yPos)

  doc.setFont('helvetica', 'bold')
  doc.text('WH Checker:', rightX, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(formData.value.namaKaryawan || '-', rightX + labelWidth, yPos)
  yPos += 12

  // Items Table
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setFillColor(59, 130, 246)
  doc.rect(leftX, yPos, pageWidth - 28, 6, 'F')
  doc.setTextColor(255, 255, 255)
  doc.text('ITEMS DETAILS', leftX + 2, yPos + 4)
  doc.setTextColor(0, 0, 0)
  yPos += 10

  // Prepare table data
  const tableHeaders = [
    'No',
    'SKU',
    'Description',
    'Lot No',
    'Surat Jalan',
    'Actual',
    'Difference',
    'Repack',
    'Damage',
  ]

  const tableRows = tableData.value.map((item, index) => [
    String(index + 1),
    item.sku,
    item.description,
    item.pickSlip || '-',
    String(item.diSuratJalan),
    String(item.diterima),
    String(item.selisih),
    String(item.repackQty),
    String(item.damageQty),
  ])

  autoTable(doc, {
    startY: yPos,
    head: [tableHeaders],
    body: tableRows,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center',
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      1: { cellWidth: 25 },
      2: { cellWidth: 45 },
      3: { cellWidth: 20 },
      4: { halign: 'right', cellWidth: 18 },
      5: { halign: 'right', cellWidth: 18 },
      6: { halign: 'right', cellWidth: 18 },
      7: { halign: 'right', cellWidth: 15 },
      8: { halign: 'right', cellWidth: 15 },
    },
    didParseCell: (data) => {
      // Highlight rows with discrepancies
      if (data.section === 'body' && data.column.index === 6) {
        const diff = Number(data.cell.text[0])
        if (diff !== 0) {
          data.cell.styles.textColor = diff > 0 ? [34, 197, 94] : [239, 68, 68]
          data.cell.styles.fontStyle = 'bold'
        }
      }
    },
  })

  // Get Y position after table
  const finalY = (doc as any).lastAutoTable.finalY + 15

  // Signature Section
  if (finalY < pageHeight - 50) {
    yPos = finalY
  } else {
    doc.addPage()
    yPos = 20
  }

  // Signature boxes
  const signatureBoxWidth = 60
  const signatureBoxHeight = 35
  const sigLeftX = leftX
  const sigRightX = pageWidth - 14 - signatureBoxWidth

  // WH Checker Signature
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text('Warehouse Checker', sigLeftX, yPos)
  doc.rect(sigLeftX, yPos + 2, signatureBoxWidth, signatureBoxHeight)

  // Add signature image if available
  if (formData.value.signature) {
    try {
      doc.addImage(
        formData.value.signature,
        'PNG',
        sigLeftX + 5,
        yPos + 5,
        signatureBoxWidth - 10,
        signatureBoxHeight - 15,
      )
    } catch (error) {
      console.error('Error adding signature to PDF:', error)
    }
  }

  doc.setFont('helvetica', 'normal')
  doc.text(
    formData.value.namaKaryawan || '-',
    sigLeftX + signatureBoxWidth / 2,
    yPos + signatureBoxHeight + 6,
    {
      align: 'center',
    },
  )

  // Driver Signature
  doc.setFont('helvetica', 'bold')
  doc.text('Driver', sigRightX, yPos)
  doc.rect(sigRightX, yPos + 2, signatureBoxWidth, signatureBoxHeight)
  doc.setFont('helvetica', 'normal')
  doc.text(
    formData.value.namaSopir || '-',
    sigRightX + signatureBoxWidth / 2,
    yPos + signatureBoxHeight + 6,
    {
      align: 'center',
    },
  )

  // Footer
  doc.setFontSize(8)
  doc.setTextColor(128, 128, 128)
  doc.text(`Generated on ${new Date().toLocaleString('id-ID')}`, pageWidth / 2, pageHeight - 10, {
    align: 'center',
  })

  // Save PDF
  const fileName = `Receiving_Confirmation_${formData.value.orderNo}_${new Date().getTime()}.pdf`
  doc.save(fileName)
}

const confirmReject = async () => {
  // Validate rejection reason
  if (!rejectionReason.value.trim()) {
    await Swal.fire({
      title: 'Error',
      text: 'Please provide a rejection reason',
      icon: 'error',
      confirmButtonText: 'OK',
    })
    return
  }

  console.log('Form Data:', formData.value)
  console.log('Table Data:', tableData.value)
  console.log('Rejection Reason:', rejectionReason.value)

  try {
    // Send rejection data to API with status "Rejected"
    await ReceivingConfirmationService.updateStatus(Number(route.params.id), {
      reportID: Number(route.params.id),
      status: 3, // Rejected = 3 (from enum)
      generalRejectReason: rejectionReason.value,
    })

    await Swal.fire({
      title: 'Rejected!',
      text: `Receiving confirmation rejected!\nReason: ${rejectionReason.value}`,
      icon: 'success',
      confirmButtonText: 'OK',
    })

    // Close modal and redirect
    closeRejectModal()
    router.push({ name: 'receivingConfirmation' })
  } catch (error) {
    console.error('Error rejecting receiving confirmation:', error)
    await Swal.fire({
      title: 'Error',
      text: 'Failed to reject receiving confirmation',
      icon: 'error',
      confirmButtonText: 'OK',
    })
  }
}

const approveConfirmation = async () => {
  console.log('Form Data:', formData.value)
  console.log('Table Data:', tableData.value)

  try {
    // Send approval data to API with status "Completed"
    await ReceivingConfirmationService.updateStatus(Number(route.params.id), {
      reportID: Number(route.params.id),
      status: 2, // Completed = 2 (from enum)
      generalRejectReason: '',
    })

    await Swal.fire({
      title: 'Approved!',
      text: 'Receiving confirmation approved successfully!',
      icon: 'success',
      confirmButtonText: 'OK',
    })

    // Redirect to list
    router.push({ name: 'receivingConfirmation' })
  } catch (error) {
    console.error('Error approving receiving confirmation:', error)
    await Swal.fire({
      title: 'Error',
      text: 'Failed to approve receiving confirmation',
      icon: 'error',
      confirmButtonText: 'OK',
    })
  }
}

onMounted(() => {
  const id = route.params.id
  console.log('Loading receiving confirmation with ID:', id)

  // Load data from API
  ReceivingConfirmationService.getDetail(Number(id))
    .then((data) => {
      if (data) {
        // Map API response to FormData structure
        formData.value = {
          orderNo: data.orderNumber || '',
          namaKaryawan: data.whCheckerName || '',
          namaSopir: data.driverName || '',
          noPolisi: data.licensePlate || '',
          transporter: data.transporter || '',
          pickup: data.pickup || '',
          destination: data.destination || '',
          orderDate: data.receivedDate
            ? new Date(data.receivedDate).toISOString().split('T')[0]
            : '',
          receivedDate: data.receivedDate
            ? new Date(data.receivedDate).toISOString().split('T')[0]
            : '',
          signature: data.digitalSignaturePath || null,
        }

        // Set current status
        currentStatus.value = data.status || ''

        // Map API items to TableData structure
        tableData.value = data.items.map((item) => ({
          pickSlip: item.noPickSlip || '',
          sku: item.sku || '',
          description: item.deskripsi || '',
          diSuratJalan: item.qtySuratJalan || 0,
          actual: item.qtyActual || 0,
          diSuratJalanKonfirmasi: item.qtySuratJalan || 0,
          diterima: item.qtyActual || 0,
          selisih: item.qtySelisih || 0,
          lebih: item.qtySelisih > 0 ? item.qtySelisih : 0,
          kurang: item.qtySelisih < 0 ? Math.abs(item.qtySelisih) : 0,
          repackQty: item.repackQty || 0,
          damageQty: item.damageQty || 0,
        }))
      }
    })
    .catch((error) => {
      console.error('Error loading receiving confirmation:', error)
      Swal.fire({
        title: 'Error',
        text: 'Failed to load receiving confirmation data',
        icon: 'error',
        confirmButtonText: 'OK',
      })
    })
})
</script>

<style lang="scss" scoped>
.list__table {
  th,
  td {
    white-space: nowrap;
  }

  &::-webkit-scrollbar {
    width: 10px;
    height: 10px;
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    width: 10px;
    height: 10px;
    border-radius: 15px;
    background-color: #dbdfe9;
  }
}
</style>

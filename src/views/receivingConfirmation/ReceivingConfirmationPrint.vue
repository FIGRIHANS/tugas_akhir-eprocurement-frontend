<template>
  <div class="invoice-wrapper" id="invoice-print-wrapper">
    <!-- Loading overlay -->
    <div v-if="isLoading" class="invoice-loading">
      <i class="ki-duotone ki-loading text-4xl text-gray-800 animate-spin"></i>
      <p class="mt-3 text-gray-600">Preparing report…</p>
    </div>

    <!-- Invoice page (A4) -->
    <div v-else id="invoice-print-page" class="invoice-page">
      <!-- ── Header bar ─────────────────────────────────────────── -->
      <div class="inv-header">
        <div class="inv-header-left">
          <div class="inv-company-logo">
            <span class="inv-company-initials">PT</span>
          </div>
          <div>
            <div class="inv-company-name">PT. EVOX</div>
            <div class="inv-company-sub">Receiving Confirmation Report</div>
          </div>
        </div>
        <div class="inv-header-right">
          <div class="inv-label" style="font-size: 20px;">RECEIVING CONFIRMATION</div>
          <div class="inv-doc-no">{{ formData.orderNo || '—' }}</div>
        </div>
      </div>

      <!-- ── Document Information ────────────────────────────────── -->
      <div class="inv-section">
        <div class="inv-section-title">Document Information</div>
        <div class="inv-info-grid">
          <div class="inv-info-item">
            <span class="inv-detail-label">Report ID</span>
            <span class="inv-info-value">{{ formData.orderNo || '—' }}</span>
          </div>
          <div class="inv-info-item">
            <span class="inv-detail-label">Trip ID</span>
            <span class="inv-info-value">{{ formData.tripID || '—' }}</span>
          </div>
          <div class="inv-info-item">
            <span class="inv-detail-label">Delivery Note Number</span>
            <span class="inv-info-value">{{ formData.orderNo || '—' }}</span>
          </div>
          <div class="inv-info-item">
            <span class="inv-detail-label">Status</span>
            <span class="inv-info-value" :class="statusColorClass">{{ currentStatus || '—' }}</span>
          </div>
          <div class="inv-info-item">
            <span class="inv-detail-label">PO Number</span>
            <span class="inv-info-value">{{ formData.poNumber || '—' }}</span>
          </div>
          <div class="inv-info-item">
            <span class="inv-detail-label">Has Discrepancy</span>
            <span class="inv-info-value">{{ hasDiscrepancy ? 'Yes' : 'No' }}</span>
          </div>
          <div class="inv-info-item">
            <span class="inv-detail-label">Received Date</span>
            <span class="inv-info-value">{{ formData.receivedDate || '—' }}</span>
          </div>
        </div>
      </div>

      <!-- ── Transport Information ────────────────────────────────── -->
      <div class="inv-section">
        <div class="inv-section-title">Transport Information</div>
        <div class="inv-info-grid">
          <div class="inv-info-item">
            <span class="inv-detail-label">Pickup</span>
            <span class="inv-info-value">{{ formData.pickup || '—' }}</span>
          </div>
          <div class="inv-info-item">
            <span class="inv-detail-label">Transporter</span>
            <span class="inv-info-value">{{ formData.transporter || '—' }}</span>
          </div>
          <div class="inv-info-item">
            <span class="inv-detail-label">Destination</span>
            <span class="inv-info-value">{{ formData.destination || '—' }}</span>
          </div>
          <div class="inv-info-item">
            <span class="inv-detail-label">License Plate</span>
            <span class="inv-info-value">{{ formData.noPolisi || '—' }}</span>
          </div>
          <div class="inv-info-item">
            <span class="inv-detail-label">Driver Name</span>
            <span class="inv-info-value">{{ formData.namaSopir || '—' }}</span>
          </div>
          <div class="inv-info-item">
            <span class="inv-detail-label">WH Checker</span>
            <span class="inv-info-value">{{ formData.namaKaryawan || '—' }}</span>
          </div>
        </div>
      </div>

      <!-- ── Items Details ─────────────────────────────────── -->
      <div class="inv-section">
        <div class="inv-section-title">Items Details</div>
        <table class="inv-table">
          <thead>
            <tr>
              <th class="text-center">No</th>
              <th>Material Number</th>
              <th>Description</th>
              <th>Lot No</th>
              <th class="text-right">Surat Jalan</th>
              <th class="text-right">Actual</th>
              <th class="text-right">Difference</th>
              <th class="text-right">Repack</th>
              <th class="text-right">Damage</th>
              <th class="text-center">Condition Type</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!tableData?.length">
              <td colspan="10" class="text-center inv-empty">No items</td>
            </tr>
            <tr v-for="(line, idx) in tableData" :key="line.id">
              <td class="text-center">{{ idx + 1 }}</td>
              <td>{{ line.sku || '—' }}</td>
              <td>{{ line.description || '—' }}</td>
              <td>{{ line.lotNo || '—' }}</td>
              <td class="text-right">{{ line.diSuratJalanKonfirmasi || line.diSuratJalan || 0 }}</td>
              <td class="text-right">{{ line.diterima || line.actual || 0 }}</td>
              <td class="text-right" :class="{ 'text-green-600 font-bold': line.selisih > 0, 'text-red-600 font-bold': line.selisih < 0 }">
                {{ line.selisih || 0 }}
              </td>
              <td class="text-right">{{ line.repackQty || 0 }}</td>
              <td class="text-right">{{ line.damageQty || 0 }}</td>
              <td class="text-center">{{ line.conditionType || '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ── Signatures ───────────────────────────────────────────── -->
      <div class="inv-signature-row">
        <div class="inv-signature-box">
          <div class="inv-signature-title">Warehouse Checker</div>
          <div class="inv-signature-area">
            <img v-if="formData.signature" :src="formData.signature" alt="WH Checker Signature" />
          </div>
          <div class="inv-signature-date">{{ formatPdfDate(formData.receivedDate) }}</div>
          <div class="inv-signature-name">{{ formData.namaKaryawan || '—' }}</div>
        </div>
        <div class="inv-signature-box">
          <div class="inv-signature-title">Driver</div>
          <div class="inv-signature-area">
            <img v-if="driverSignatureFromDN" :src="driverSignatureFromDN" alt="Driver Signature" />
          </div>
          <div class="inv-signature-date">{{ formatPdfDate(driverSignatureDateFromDN) }}</div>
          <div class="inv-signature-name">{{ formData.namaSopir || '—' }}</div>
        </div>
      </div>

      <!-- ── Footer ───────────────────────────────── -->
      <div class="inv-footer-row mt-8">
        <div class="inv-disclaimer">
          <p class="inv-disclaimer-footer text-center w-full">
            Generated on {{ formatDateTime(new Date().toISOString()) }} &nbsp;|&nbsp; Ref:
            {{ formData.orderNo }}
          </p>
        </div>
      </div>
    </div>
    <!-- /invoice-page -->

    <!-- ── Action Buttons ─────────────────────────────────────── -->
    <div class="inv-actions">
      <button class="btn btn-outline btn-primary" type="button" @click="$emit('close')">
        <i class="ki-filled ki-arrow-left"></i>
        Back
      </button>
      <button class="btn btn-primary" type="button" @click="handlePrint" :disabled="isLoading">
        <i class="ki-filled ki-printer"></i>
        Print / Save PDF
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import momentLib from 'moment'
import DeliveryNotesService from '@/services/deliveryNotes.service'

const moment = momentLib

// ── Props / Emits ────────────────────────────────────────────────
const props = defineProps<{
  formData: any
  tableData: any[]
  currentStatus: string
}>()

defineEmits<{ (e: 'close'): void }>()

// ── State ────────────────────────────────────────────────────────
const isLoading = ref(true)
const driverSignatureFromDN = ref<string | null>(null)
const driverSignatureDateFromDN = ref<string | null>(null)

// ── Computed ─────────────────────────────────────────────────────
const hasDiscrepancy = computed(() => props.tableData?.some((item) => item.selisih !== 0))

const statusColorClass = computed(() => {
  if (props.currentStatus === 'Completed') return 'text-green-600 font-bold'
  if (props.currentStatus === 'Rejected') return 'text-red-600 font-bold'
  return ''
})

// ── Helpers ──────────────────────────────────────────────────────
const formatDateTime = (d: string) => (d ? moment(d).format('DD MMM YYYY HH:mm') : '—')

const formatPdfDate = (value?: string | null): string => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

// ── API Calls ────────────────────────────────────────────────────
async function fetchDeliveryNote() {
  if (!props.formData.orderNo) return
  try {
    const deliveryNotes = await DeliveryNotesService.getByDeliveryNoteNumber(props.formData.orderNo)
    if (deliveryNotes) {
      driverSignatureFromDN.value = deliveryNotes.driverSignature || null
      driverSignatureDateFromDN.value = deliveryNotes.createdUtcDate || null
    }
  } catch (error) {
    console.error('Error fetching driver signature from delivery notes:', error)
  }
}

// ── Print ────────────────────────────────────────────────────────
function handlePrint() {
  const printEl = document.getElementById('invoice-print-wrapper')
  if (!printEl) {
    window.print()
    return
  }

  const parent = printEl.parentNode
  const nextSibling = printEl.nextSibling

  document.body.appendChild(printEl)
  document.body.classList.add('printing-invoice')

  window.print()

  document.body.classList.remove('printing-invoice')
  if (nextSibling) {
    parent?.insertBefore(printEl, nextSibling)
  } else {
    parent?.appendChild(printEl)
  }
}

// ── Lifecycle ────────────────────────────────────────────────────
onMounted(async () => {
  isLoading.value = true
  await fetchDeliveryNote()
  isLoading.value = false
})
</script>

<style scoped>
/* ── Wrapper & Loading ─────────────────────────────────────────── */
.invoice-wrapper {
  font-family: 'Inter', 'Segoe UI', sans-serif;
  color: #000;
}

.invoice-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
}

/* ── Actions (screen only) ─────────────────────────────────────── */
.inv-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 24px;
}

/* ── A4 Page ──────────────────────────────────────────────────── */
.invoice-page {
  background: #fff;
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  padding: 14mm 16mm;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
  border-radius: 0;
  box-sizing: border-box;
}

/* ── Header ───────────────────────────────────────────────────── */
.inv-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 14px;
  border-bottom: 2px solid #000;
  margin-bottom: 18px;
}

.inv-header-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.inv-company-logo {
  width: 52px;
  height: 52px;
  border: 1px solid #000;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.inv-company-initials {
  color: #000;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 1px;
}

.inv-company-name {
  font-size: 16px;
  font-weight: 700;
  color: #000;
}

.inv-company-sub {
  font-size: 11px;
  color: #333;
  margin-top: 2px;
}

.inv-header-right {
  text-align: right;
}

.inv-label {
  font-weight: 800;
  color: #000;
  letter-spacing: 1px;
}

.inv-doc-no {
  font-size: 13px;
  color: #000;
  margin-top: 2px;
  font-weight: 600;
}

/* ── Section Title ────────────────────────────────────────────── */
.inv-section-title {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #000;
  margin-bottom: 8px;
  border-bottom: 1px solid #000;
  padding-bottom: 4px;
}

/* ── Detail Label ─────────────────────────────────────────────── */
.inv-detail-label {
  color: #333;
  min-width: 120px;
  font-weight: 600;
  flex-shrink: 0;
}

/* ── General Section ──────────────────────────────────────────── */
.inv-section {
  margin-bottom: 16px;
}

/* ── Info Grid ─────────────────────── */
.inv-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px 20px;
}

.inv-info-item {
  display: flex;
  gap: 8px;
  font-size: 11px;
  line-height: 1.5;
}

.inv-info-value {
  font-weight: 600;
  color: #000;
}

/* ── Items Table ──────────────────────────────────────────────── */
.inv-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 11px;
  border: 1px solid #000;
}

.inv-table thead tr {
  background: #eee;
  color: #000;
}

.inv-table th {
  padding: 7px 8px;
  font-weight: 600;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 1px solid #000;
}

.inv-table td {
  padding: 6px 8px;
  border: 1px solid #000;
  color: #000;
}

.inv-table tbody tr:nth-child(even) td {
  background: #f9f9f9;
}

.text-center {
  text-align: center;
}
.text-right {
  text-align: right;
}
.text-green-600 {
  color: #16a34a;
}
.text-red-600 {
  color: #dc2626;
}
.font-bold {
  font-weight: bold;
}
.inv-empty {
  color: #666;
  font-style: italic;
  padding: 10px 0;
  font-size: 11px;
}

/* ── Signatures ───────────────────────────────────────────── */
.inv-signature-row {
  display: flex;
  justify-content: space-between;
  margin-top: 32px;
  padding: 0 32px;
}

.inv-signature-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 180px;
}

.inv-signature-title {
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 8px;
}

.inv-signature-area {
  height: 80px;
  width: 100%;
  border: 1px solid #000;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.inv-signature-area img {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
}

.inv-signature-date {
  font-size: 10px;
  color: #333;
  margin-bottom: 4px;
}

.inv-signature-name {
  font-size: 11px;
  font-weight: 600;
}

/* ── Footer ──────────────────────────────────── */
.inv-footer-row {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  padding-top: 12px;
  border-top: 1px solid #000;
}

.inv-disclaimer {
  flex: 1;
  font-size: 10px;
  color: #333;
  line-height: 1.6;
}

.inv-disclaimer-footer {
  font-size: 9px;
  color: #666;
  margin-top: 6px !important;
}

/* ── Print Media ──────────────────────────────────────────────── */
@media print {
  .inv-actions,
  .invoice-loading {
    display: none !important;
  }

  .invoice-page {
    box-shadow: none;
    margin: 0;
    padding: 10mm 12mm;
    width: 100%;
    min-height: auto;
    border-radius: 0;
  }
}
</style>

<style>
@media print {
  body.printing-invoice > *:not(#invoice-print-wrapper) {
    display: none !important;
  }
  body.printing-invoice {
    background: white !important;
    margin: 0 !important;
    padding: 0 !important;
  }
}
</style>

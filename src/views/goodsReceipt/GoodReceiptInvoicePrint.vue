<template>
  <div class="invoice-wrapper" id="invoice-print-wrapper">
    <!-- Loading overlay -->
    <div v-if="isLoading" class="invoice-loading">
      <i class="ki-duotone ki-loading text-4xl text-gray-800 animate-spin"></i>
      <p class="mt-3 text-gray-600">Preparing invoice…</p>
    </div>

    <!-- Invoice page (A4) -->
    <div v-else id="invoice-print-page" class="invoice-page">
      <!-- ── Header bar ─────────────────────────────────────────── -->
      <div class="inv-header">
        <div class="inv-header-left">
          <div class="inv-company-logo">
            <span class="inv-company-initials">{{ initials(vendorInfo?.vendorName) }}</span>
          </div>
          <div>
            <div class="inv-company-name">
              {{ vendorInfo?.vendorName || detail.vendorName || '—' }}
            </div>
            <div class="inv-company-sub">Official Vendor Invoice</div>
          </div>
        </div>
        <div class="inv-header-right">
          <div class="inv-label">INVOICE</div>
          <div class="inv-doc-no">{{ vendorInvoiceNo }}</div>
        </div>
      </div>

      <!-- ── Two-column: Vendor + Sold To ──────────────────────── -->
      <div class="inv-party-row">
        <!-- Vendor Information -->
        <div class="inv-party-box">
          <div class="inv-section-title">From (Vendor)</div>
          <div class="inv-party-name">{{ vendorInfo?.vendorName || detail.vendorName || '—' }}</div>
          <div class="inv-party-detail">
            <span class="inv-detail-label">Address</span>
            <span>{{ vendorInfo?.addressCompanyDetail || '—' }}</span>
          </div>
          <div class="inv-party-detail" v-if="vendorInfo?.cityName">
            <span class="inv-detail-label">City</span>
            <span
              >{{ vendorInfo.cityName
              }}<span v-if="vendorInfo.countryName">, {{ vendorInfo.countryName }}</span></span
            >
          </div>
          <div class="inv-party-detail">
            <span class="inv-detail-label">Phone</span>
            <span>{{ vendorInfo?.vendorPhone || '—' }}</span>
          </div>
          <div class="inv-party-detail">
            <span class="inv-detail-label">Email</span>
            <span>{{ vendorInfo?.vendorEmail || '—' }}</span>
          </div>
          <div class="inv-party-detail" v-if="vendorInfo?.vendorWebsite">
            <span class="inv-detail-label">Website</span>
            <span>{{ vendorInfo.vendorWebsite }}</span>
          </div>
          <div class="inv-party-detail" v-if="vendorInfo?.npwp">
            <span class="inv-detail-label">NPWP</span>
            <span>{{ vendorInfo.npwp }}</span>
          </div>
          <div class="inv-party-detail">
            <span class="inv-detail-label">Vendor Code</span>
            <span>{{ detail.vendorCode || '—' }}</span>
          </div>
        </div>

        <!-- Sold To -->
        <div class="inv-party-box inv-party-box--sold">
          <div class="inv-section-title">Sold To</div>
          <div class="inv-party-name">PT. Acarya Data Esa</div>
          <div class="inv-party-detail">
            <span class="inv-detail-label">Legal Entity</span>
            <span>Limited Liability Company</span>
          </div>
          <div class="inv-party-detail">
            <span class="inv-detail-label">Business No.</span>
            <span>1183367</span>
          </div>
          <div class="inv-party-detail">
            <span class="inv-detail-label">Address</span>
            <span>Ruko Tanjung Barat Indah, Blok F Nomor 4</span>
          </div>
          <div class="inv-party-detail">
            <span class="inv-detail-label">City</span>
            <span>South Jakarta</span>
          </div>
        </div>
      </div>

      <!-- ── Invoice Information ────────────────────────────────── -->
      <div class="inv-section">
        <div class="inv-section-title">Invoice Information</div>
        <div class="inv-info-grid">
          <div class="inv-info-item">
            <span class="inv-detail-label">GR Document No</span>
            <span class="inv-info-value">{{ detail.grDocumentNo || '—' }}</span>
          </div>
          <div class="inv-info-item">
            <span class="inv-detail-label">GR Date</span>
            <span class="inv-info-value">{{ formatDate(detail.grDocumentDate) }}</span>
          </div>
          <div class="inv-info-item">
            <span class="inv-detail-label">PO Number</span>
            <span class="inv-info-value">{{ detail.poNumber || '—' }}</span>
          </div>
          <div class="inv-info-item">
            <span class="inv-detail-label">PO Date</span>
            <span class="inv-info-value">{{
              detail.poDate ? formatDate(detail.poDate) : '—'
            }}</span>
          </div>
          <div class="inv-info-item">
            <span class="inv-detail-label">Delivery Order</span>
            <span class="inv-info-value">{{ detail.deliveryOrderNumber || '—' }}</span>
          </div>
          <div class="inv-info-item">
            <span class="inv-detail-label">Trip ID</span>
            <span class="inv-info-value">{{ detail.tripID || '—' }}</span>
          </div>
          <!-- <div class="inv-info-item">
            <span class="inv-detail-label">Status</span>
            <span class="inv-info-value">{{ detail.status }}</span>
          </div> -->
          <!-- <div class="inv-info-item">
            <span class="inv-detail-label">Payment Status</span>
            <span class="inv-info-value">{{ detail.paymentStatus || '—' }}</span>
          </div> -->
          <div class="inv-info-item" v-if="detail.notes">
            <span class="inv-detail-label">Notes</span>
            <span class="inv-info-value">{{ detail.notes }}</span>
          </div>
        </div>
      </div>

      <!-- ── Goods Receipt Items ─────────────────────────────────── -->
      <div class="inv-section">
        <div class="inv-section-title">Goods Receipt Item List</div>
        <table class="inv-table">
          <thead>
            <tr>
              <th class="text-center">No</th>
              <th>SKU</th>
              <th>Item Description</th>
              <th class="text-center">UOM</th>
              <th class="text-right">Qty Good</th>
              <th class="text-right">Qty Damaged</th>
              <th class="text-right">Unit Price</th>
              <th class="text-right">Line Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!detail.items?.length">
              <td colspan="8" class="text-center inv-empty">No items</td>
            </tr>
            <tr v-for="(line, idx) in detail.items" :key="line.id">
              <td class="text-center">{{ idx + 1 }}</td>
              <td>{{ line.sku || '—' }}</td>
              <td>{{ line.itemName || '—' }}</td>
              <td class="text-center">{{ line.uom || '—' }}</td>
              <td class="text-right">{{ line.qtyReceivedGood }}</td>
              <td class="text-right">{{ line.qtyDamaged }}</td>
              <td class="text-right">{{ formatMoney(line.unitPrice, detail.currency) }}</td>
              <td class="text-right">{{ formatMoney(line.lineAmount, detail.currency) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ── Financial Summary ──────────────────────────────────── -->
      <div class="inv-summary-row">
        <div class="inv-summary-spacer"></div>
        <div class="inv-summary-box">
          <div class="inv-summary-line inv-summary-total">
            <span>Total Amount</span>
            <span>{{ formatMoney(detail.totalAmount, detail.currency) }}</span>
          </div>
          <div class="inv-summary-line inv-summary-currency">
            <span>Currency</span>
            <span>{{ detail.currency || 'IDR' }}</span>
          </div>
        </div>
      </div>

      <!-- ── Bank Information ───────────────────────────────────── -->
      <div class="inv-section inv-bank-section">
        <div class="inv-section-title">Bank Information</div>
        <div v-if="primaryBank" class="inv-bank-grid">
          <div class="inv-info-item">
            <span class="inv-detail-label">Bank Name</span>
            <span class="inv-info-value">{{ primaryBank.bankName || '—' }}</span>
          </div>
          <div class="inv-info-item">
            <span class="inv-detail-label">Bank Code</span>
            <span class="inv-info-value">{{ primaryBank.bankCode || '—' }}</span>
          </div>
          <div class="inv-info-item">
            <span class="inv-detail-label">Swift Code</span>
            <span class="inv-info-value">{{ primaryBank.bankSwiftCode || '—' }}</span>
          </div>
          <div class="inv-info-item">
            <span class="inv-detail-label">Account Name</span>
            <span class="inv-info-value">{{ primaryBank.accountName || '—' }}</span>
          </div>
          <div class="inv-info-item">
            <span class="inv-detail-label">Account Number</span>
            <span class="inv-info-value">{{ primaryBank.accountNo || '—' }}</span>
          </div>
          <div class="inv-info-item">
            <span class="inv-detail-label">Currency</span>
            <span class="inv-info-value">{{
              primaryBank.currencyLabel || primaryBank.currencySymbol || '—'
            }}</span>
          </div>
          <div class="inv-info-item" v-if="primaryBank.bankBankAddress || primaryBank.bankAddress">
            <span class="inv-detail-label">Bank Address</span>
            <span class="inv-info-value">{{
              primaryBank.bankBankAddress || primaryBank.bankAddress
            }}</span>
          </div>
        </div>
        <div v-else class="inv-empty">Bank information not available.</div>
      </div>

      <!-- ── QR Code + Disclaimer ───────────────────────────────── -->
      <div class="inv-footer-row">
        <div class="inv-qr-box">
          <canvas ref="qrCanvas" class="inv-qr-canvas"></canvas>
          <div class="inv-qr-label">Scan to verify</div>
        </div>
        <div class="inv-disclaimer">
          <div class="inv-disclaimer-title">Disclaimer</div>
          <p>
            This invoice is generated electronically and is valid without a physical signature. The
            information contained herein is based on the Goods Receipt record approved in the
            e-Procurement system. Any discrepancy must be reported within 7 working days of receipt.
            PT. Acarya Data Esa reserves the right to reject claims submitted beyond this period.
          </p>
          <p class="inv-disclaimer-footer">
            Generated on {{ formatDateTime(new Date().toISOString()) }} &nbsp;|&nbsp; Ref:
            {{ vendorInvoiceNo }}
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
import type { GoodsReceiptDetailContentDto } from '@/services/goodsReceipt.service'
import type { IAdministration, IPayment } from '@/stores/vendor/types/vendor'
import vendorApi from '@/core/utils/vendorApi'

const moment = momentLib

// ── Props / Emits ────────────────────────────────────────────────
const props = defineProps<{
  detail: GoodsReceiptDetailContentDto
  vendorId: number | null
}>()

defineEmits<{ (e: 'close'): void }>()

// ── State ────────────────────────────────────────────────────────
const isLoading = ref(true)
const vendorInfo = ref<IAdministration | null>(null)
const bankList = ref<IPayment[]>([])
const qrCanvas = ref<HTMLCanvasElement | null>(null)

// ── Computed ─────────────────────────────────────────────────────
const primaryBank = computed<IPayment | null>(() => {
  if (!bankList.value.length) return null
  const active = bankList.value.find((b) => b.isActive)
  return active ?? bankList.value[0]
})

const vendorInvoiceNo = computed(() => {
  const vName = vendorInfo.value?.vendorName || props.detail.vendorName || 'VND'
  const vAbbr =
    vName
      .replace(/[^a-zA-Z]/g, '')
      .substring(0, 3)
      .toUpperCase() || 'VND'

  const dateStr = props.detail.grDocumentDate || new Date().toISOString()
  const d = new Date(dateStr)
  const yy = d.getFullYear().toString().substring(2, 4)
  const mm = (d.getMonth() + 1).toString().padStart(2, '0')

  // Create a deterministic sequence number independent from database ID or GR Number
  const hashInput = vName + dateStr
  let hash = 0
  for (let i = 0; i < hashInput.length; i++) {
    hash = (hash << 5) - hash + hashInput.charCodeAt(i)
    hash |= 0
  }
  const seq = String(Math.abs(hash) % 1000).padStart(3, '0')

  return `INV/${vAbbr}/${yy}${mm}/${seq}`
})

// ── Helpers ──────────────────────────────────────────────────────
function initials(name?: string | null): string {
  if (!name) return 'V'
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

const formatDate = (d: string) => (d ? moment(d).format('DD MMM YYYY') : '—')
const formatDateTime = (d: string) => (d ? moment(d).format('DD MMM YYYY HH:mm') : '—')

const formatMoney = (amt: number | null | undefined, cur?: string) => {
  if (amt == null) return '—'
  const c = cur || 'IDR'
  try {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: c,
      maximumFractionDigits: 2,
    }).format(amt)
  } catch {
    return String(amt)
  }
}

// ── API Calls ────────────────────────────────────────────────────
async function fetchVendorInfo() {
  if (!props.vendorId) {
    console.warn('[InvoicePrint] vendorId is null – skipping vendor info fetch')
    return
  }
  try {
    // Use the administration endpoint which returns IAdministration directly
    // (has addressCompanyDetail, vendorPhone, vendorEmail, vendorWebsite, npwp, etc.)
    const res = await vendorApi.get('/public/vendor/registration/administration', {
      params: { vendorId: props.vendorId },
    })
    const body = res.data?.result
    if (!body?.isError) {
      vendorInfo.value = body?.content ?? null
    } else {
      console.warn('[InvoicePrint] fetchVendorInfo error:', body?.message)
    }
  } catch (e) {
    console.warn('[InvoicePrint] fetchVendorInfo failed:', e)
  }
}

async function fetchBankList() {
  if (!props.vendorId) {
    console.warn('[InvoicePrint] vendorId is null – skipping bank list fetch')
    return
  }
  try {
    const res = await vendorApi.get('/public/verifiedvendor/getbanklist', {
      params: { vendorId: props.vendorId },
    })
    const body = res.data?.result
    if (!body?.isError && Array.isArray(body?.content)) {
      bankList.value = body.content
    } else if (res.data?.statusCode === 200 && Array.isArray(res.data?.result?.content)) {
      bankList.value = res.data.result.content
    } else {
      console.warn('[InvoicePrint] fetchBankList unexpected response:', res.data)
    }
  } catch (e) {
    console.warn('[InvoicePrint] fetchBankList failed:', e)
  }
}

// ── QR Code (canvas-based, no extra lib needed) ──────────────────
function drawQrPlaceholder() {
  const canvas = qrCanvas.value
  if (!canvas) return
  const size = 80
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Simple patterned placeholder representing a QR
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, size, size)
  ctx.fillStyle = '#000000'

  const cellSize = size / 10
  const pattern = [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
    [4, 0],
    [5, 0],
    [6, 0],
    [0, 1],
    [6, 1],
    [0, 2],
    [2, 2],
    [3, 2],
    [4, 2],
    [6, 2],
    [0, 3],
    [2, 3],
    [4, 3],
    [6, 3],
    [0, 4],
    [2, 4],
    [3, 4],
    [4, 4],
    [6, 4],
    [0, 5],
    [6, 5],
    [0, 6],
    [1, 6],
    [2, 6],
    [3, 6],
    [4, 6],
    [5, 6],
    [6, 6],
    [8, 0],
    [9, 0],
    [8, 1],
    [7, 2],
    [9, 2],
    [8, 3],
    [7, 4],
    [8, 4],
    [9, 4],
    [7, 7],
    [8, 7],
    [9, 7],
    [7, 8],
    [9, 8],
    [7, 9],
    [8, 9],
    [9, 9],
    [1, 8],
    [2, 8],
    [3, 8],
    [1, 9],
    [3, 9],
  ]
  pattern.forEach(([col, row]) => {
    ctx.fillRect(col * cellSize, row * cellSize, cellSize - 1, cellSize - 1)
  })

  // Overlay doc no text small
  ctx.fillStyle = '#000000'
  ctx.font = `${Math.floor(cellSize * 0.8)}px monospace`
  ctx.textAlign = 'center'
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
  console.log('[InvoicePrint] vendorId prop:', props.vendorId)
  isLoading.value = true
  await Promise.allSettled([fetchVendorInfo(), fetchBankList()])
  console.log('[InvoicePrint] vendorInfo:', vendorInfo.value)
  console.log('[InvoicePrint] bankList:', bankList.value)
  isLoading.value = false
  await nextTick()
  drawQrPlaceholder()
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
  font-size: 26px;
  font-weight: 800;
  color: #000;
  letter-spacing: 3px;
}

.inv-doc-no {
  font-size: 13px;
  color: #000;
  margin-top: 2px;
  font-weight: 600;
}

/* ── Party Row ────────────────────────────────────────────────── */
.inv-party-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 18px;
}

.inv-party-box,
.inv-party-box--sold {
  background: #fff;
  border: 1px solid #000;
  border-radius: 0;
  padding: 12px 14px;
}

.inv-party-name {
  font-size: 13px;
  font-weight: 700;
  color: #000;
  margin-bottom: 8px;
}

.inv-party-detail {
  display: flex;
  gap: 8px;
  font-size: 11px;
  margin-bottom: 3px;
  line-height: 1.4;
  color: #000;
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
  min-width: 90px;
  font-weight: 600;
  flex-shrink: 0;
}

/* ── General Section ──────────────────────────────────────────── */
.inv-section {
  margin-bottom: 16px;
}

/* ── Info Grid (Invoice Info / Bank Info) ─────────────────────── */
.inv-info-grid,
.inv-bank-grid {
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
.inv-empty {
  color: #666;
  font-style: italic;
  padding: 10px 0;
  font-size: 11px;
}

/* ── Financial Summary ────────────────────────────────────────── */
.inv-summary-row {
  display: flex;
  margin-bottom: 16px;
}

.inv-summary-spacer {
  flex: 1;
}

.inv-summary-box {
  min-width: 220px;
  border: 1px solid #000;
  border-radius: 0;
  overflow: hidden;
}

.inv-summary-line {
  display: flex;
  justify-content: space-between;
  padding: 7px 12px;
  font-size: 11px;
  border-bottom: 1px solid #000;
}

.inv-summary-line:last-child {
  border-bottom: none;
}

.inv-summary-total {
  background: #eee;
  color: #000;
  font-weight: 700;
  font-size: 12px;
}

.inv-summary-currency {
  background: #fff;
  color: #000;
}

/* ── Bank Section ─────────────────────────────────────────────── */
.inv-bank-section {
  background: #fff;
  border: 1px solid #000;
  border-radius: 0;
  padding: 12px 14px;
  margin-bottom: 16px;
}

/* ── Footer: QR + Disclaimer ──────────────────────────────────── */
.inv-footer-row {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  padding-top: 12px;
  border-top: 1px solid #000;
}

.inv-qr-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.inv-qr-canvas {
  border: 1px solid #000;
  border-radius: 0;
}

.inv-qr-label {
  font-size: 9px;
  color: #333;
  text-align: center;
}

.inv-disclaimer {
  flex: 1;
  font-size: 10px;
  color: #333;
  line-height: 1.6;
}

.inv-disclaimer-title {
  font-size: 11px;
  font-weight: 700;
  color: #000;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.inv-disclaimer p {
  margin: 0 0 6px;
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

<template>
  <div>
    <Breadcrumb title="Goods Receipt Detail" :routes="routes" />
    <hr class="-mx-[24px] mb-[24px]" />

    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <div class="text-center">
        <i class="ki-duotone ki-loading text-4xl text-teal-500 animate-spin"></i>
        <p class="mt-4 text-gray-600">Loading…</p>
      </div>
    </div>

    <div v-else-if="error" class="border border-red-200 rounded-xl p-[24px] bg-red-50 text-center">
      <p class="text-red-700">{{ error }}</p>
      <button class="btn btn-outline btn-primary mt-4" type="button" @click="goBack">
        <i class="ki-filled ki-arrow-left"></i>
        Back
      </button>
    </div>

    <div v-else-if="detail" class="space-y-6">
      <div class="border border-gray-200 rounded-xl p-[24px]">
        <h3 class="text-lg font-semibold mb-4">Goods Receipt</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
          <div class="flex gap-3">
            <span class="text-gray-500 w-44 shrink-0">GR No</span>
            <span class="font-medium">{{ detail.grDocumentNo }}</span>
          </div>
          <div class="flex gap-3">
            <span class="text-gray-500 w-44 shrink-0">GR Date</span>
            <span>{{ formatDt(detail.grDocumentDate) }}</span>
          </div>
          <div class="flex gap-3">
            <span class="text-gray-500 w-44 shrink-0">PO Number</span>
            <span>{{ detail.poNumber || '—' }}</span>
          </div>
          <div class="flex gap-3">
            <span class="text-gray-500 w-44 shrink-0">PO Date</span>
            <span>{{ detail.poDate ? formatDate(detail.poDate) : '—' }}</span>
          </div>
          <div class="flex gap-3">
            <span class="text-gray-500 w-44 shrink-0">Delivery order (DN)</span>
            <span>{{ detail.deliveryOrderNumber || '—' }}</span>
          </div>
          <div class="flex gap-3">
            <span class="text-gray-500 w-44 shrink-0">Trip ID</span>
            <span>{{ detail.tripID || '—' }}</span>
          </div>
          <div class="flex gap-3">
            <span class="text-gray-500 w-44 shrink-0">Vendor code</span>
            <span>{{ detail.vendorCode || '—' }}</span>
          </div>
          <div class="flex gap-3">
            <span class="text-gray-500 w-44 shrink-0">Vendor name</span>
            <span>{{ detail.vendorName || '—' }}</span>
          </div>
          <div class="flex gap-3">
            <span class="text-gray-500 w-44 shrink-0">Total amount</span>
            <span>{{ formatMoney(detail.totalAmount, detail.currency) }}</span>
          </div>
          <div class="flex gap-3">
            <span class="text-gray-500 w-44 shrink-0">Status</span>
            <span
              class="badge badge-outline"
              :class="detail.hasDiscrepancy ? 'badge-warning' : 'badge-success'"
            >
              {{ detail.status }}
            </span>
          </div>
          <div class="flex gap-3">
            <span class="text-gray-500 w-44 shrink-0">Payment status</span>
            <span
              class="badge badge-outline"
              :class="getPaymentStatusBadgeClass(detail.paymentStatus)"
            >
              {{ detail.paymentStatus || '—' }}
            </span>
          </div>
          <div class="flex gap-3 md:col-span-2">
            <span class="text-gray-500 w-44 shrink-0">Notes</span>
            <span>{{ detail.notes || '—' }}</span>
          </div>
          <div class="flex gap-3">
            <span class="text-gray-500 w-44 shrink-0">Created</span>
            <span>{{ formatDt(detail.createdUtcDate) }} ({{ detail.createdByName || detail.createdBy }})</span>
          </div>
          <div class="flex gap-3">
            <span class="text-gray-500 w-44 shrink-0">Updated</span>
            <span>{{ formatDt(detail.updatedUtcDate) }} ({{ detail.updatedByName || detail.updatedBy }})</span>
          </div>
        </div>
      </div>

      <div class="border border-gray-200 rounded-xl p-[24px]">
        <h3 class="text-lg font-semibold mb-4">Item Lines (Received)</h3>
        <div class="overflow-x-auto list__table">
          <table class="table align-middle text-gray-700 font-medium text-sm">
            <thead>
              <tr class="!bg-teal-100 !text-teal-700">
                <th class="text-center">No</th>
                <th class="text-center">SKU</th>
                <th>Item</th>
                <th class="text-center">UOM</th>
                <th class="text-right">Qty good</th>
                <th class="text-right">Qty damaged</th>
                <th class="text-right">Qty repack</th>
                <th class="text-right">Unit price</th>
                <th class="text-right">Line amount</th>
                <th>Lot</th>
                <th class="text-center">Condition type</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!detail.items?.length">
                <td colspan="11" class="text-center py-6 text-gray-400">No lines</td>
              </tr>
              <tr v-for="(line, idx) in detail.items" v-else :key="line.id">
                <td class="text-center">{{ idx + 1 }}</td>
                <td class="text-center">{{ line.sku || '—' }}</td>
                <td>{{ line.itemName || '—' }}</td>
                <td class="text-center">{{ line.uom || '—' }}</td>
                <td class="text-right">{{ line.qtyReceivedGood }}</td>
                <td class="text-right">{{ line.qtyDamaged }}</td>
                <td class="text-right">{{ line.qtyRepack }}</td>
                <td class="text-right">{{ formatMoney(line.unitPrice, detail.currency) }}</td>
                <td class="text-right">{{ formatMoney(line.lineAmount, detail.currency) }}</td>
                <td>{{ line.lotNo || '—' }}</td>
                <td class="text-center">{{ line.conditionType || '—' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="flex justify-end items-center gap-[8px] mt-[24px]">
        <button class="btn btn-outline btn-primary" type="button" @click="goBack">
          <i class="ki-filled ki-arrow-left"></i>
          Back
        </button>
        <!-- Print Invoice: visible when Approved OR Payment status = PAID -->
        <button class="btn btn-success" type="button" @click="showPrintView = true">
          <i class="ki-filled ki-printer"></i>
          Print Invoice
        </button>
      </div>
    </div>
  </div>

  <!-- ── Print Invoice Overlay ─────────────────────────────────── -->
  <div v-if="showPrintView && detail" class="print-invoice-overlay">
    <div class="print-invoice-container">
      <GoodReceiptInvoicePrint
        :detail="detail"
        :vendor-id="resolvedVendorId"
        @close="showPrintView = false"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { routeTypes } from '@/core/type/components/breadcrumb'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import momentLib from 'moment'
import GoodsReceiptService, {
  type GoodsReceiptDetailContentDto,
} from '@/services/goodsReceipt.service'
import { useLoginStore } from '@/stores/views/login'
import GoodReceiptInvoicePrint from './GoodReceiptInvoicePrint.vue'

const moment = momentLib
const route = useRoute()
const router = useRouter()
const userStore = useLoginStore()

const isVendorUser = computed(() => !!userStore.userData?.profile?.vendorCode)
const vendorProfileId = computed(() => userStore.userData?.profile?.profileId)
const vendorCodeUser = computed(() => userStore.userData?.profile?.vendorCode ?? undefined)

const routes = ref<routeTypes[]>([
  { name: 'Goods Receipts', to: '/goods-receipt-list' },
  { name: 'Detail', to: '/goods-receipt-list' },
])

const detail = ref<GoodsReceiptDetailContentDto | null>(null)
const isLoading = ref(true)
const error = ref('')
const showPrintView = ref(false)

/** True when Print Invoice should be shown:
 *  - GR status is "Approved", OR
 *  - Payment status is "PAID"
 */
const canPrintInvoice = computed(() => {
  const s = detail.value?.status?.trim().toLowerCase()
  const p = detail.value?.paymentStatus?.trim().toUpperCase()
  return s === 'completed'
})

/** VendorId taken directly from the GR header record (NOT from logged-in user) */
const resolvedVendorId = computed<number | null>(() => {
  const d = detail.value
  if (!d) return null
  return (d.vendorId ?? d.vendorID ?? null) as number | null
})

const load = async () => {
  const grId = Number(route.params.grId)
  if (!grId || Number.isNaN(grId)) {
    error.value = 'Invalid goods receipt id'
    isLoading.value = false
    return
  }
  isLoading.value = true
  error.value = ''
  try {
    const params: {
      grId: number
      accessVendorId?: number
      accessVendorCode?: string
    } = { grId }
    if (isVendorUser.value && vendorProfileId.value != null) {
      params.accessVendorId = vendorProfileId.value
    }
    if (isVendorUser.value && vendorCodeUser.value) {
      params.accessVendorCode = vendorCodeUser.value
    }
    detail.value = await GoodsReceiptService.getDetail(params)
  } catch (e: unknown) {
    detail.value = null
    error.value = e instanceof Error ? e.message : 'Failed to load detail'
  } finally {
    isLoading.value = false
  }
}

const formatDate = (d: string) => moment(d).format('YYYY/MM/DD')
const formatDt = (d: string) => moment(d).format('YYYY/MM/DD HH:mm')

const getPaymentStatusBadgeClass = (status?: string) => {
  if (!status) return 'badge-light'
  if (status.trim().toUpperCase() === 'PAID') return 'badge-success'
  if (status.trim().toLowerCase() === 'waiting for payment') return 'badge-warning'
  return 'badge-info'
}

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

const goBack = () => router.push({ name: 'goodsReceiptList' })

onMounted(() => {
  if (userStore.userData && Object.keys(userStore.userData as object).length > 0) {
    load()
  } else {
    const unwatch = watch(
      () => userStore.userData,
      (newVal) => {
        if (newVal && Object.keys(newVal as object).length > 0) {
          load()
          unwatch()
        }
      },
    )
  }
})
</script>

<style scoped>
/* ── Print Invoice Overlay ─────────────────────────────────────── */
.print-invoice-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  z-index: 1000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  overflow-y: auto;
  padding: 24px 16px;
}

.print-invoice-container {
  background: #f1f5f9;
  border-radius: 12px;
  padding: 24px;
  width: 100%;
  max-width: 900px;
  position: relative;
}

@media print {
  /* Hide the detail page itself when printing – the print template handles its own @media print styles */
  .print-invoice-overlay {
    position: static;
    background: none;
    padding: 0;
  }

  .print-invoice-container {
    background: none;
    padding: 0;
    border-radius: 0;
  }
}
</style>

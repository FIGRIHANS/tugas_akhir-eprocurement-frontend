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
      <button class="btn btn-primary mt-4" type="button" @click="goBack">Back to list</button>
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
            <span class="badge badge-outline" :class="detail.hasDiscrepancy ? 'badge-warning' : 'badge-success'">
              {{ detail.status }}
            </span>
          </div>
          <div class="flex gap-3 md:col-span-2">
            <span class="text-gray-500 w-44 shrink-0">Notes</span>
            <span>{{ detail.notes || '—' }}</span>
          </div>
          <div class="flex gap-3">
            <span class="text-gray-500 w-44 shrink-0">Created</span>
            <span>{{ formatDt(detail.createdUtcDate) }} ({{ detail.createdBy }})</span>
          </div>
          <div class="flex gap-3">
            <span class="text-gray-500 w-44 shrink-0">Updated</span>
            <span>{{ formatDt(detail.updatedUtcDate) }} ({{ detail.updatedBy }})</span>
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
              </tr>
            </thead>
            <tbody>
              <tr v-if="!detail.items?.length">
                <td colspan="10" class="text-center py-6 text-gray-400">No lines</td>
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
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <button class="btn btn-light" type="button" @click="goBack">
          <i class="ki-duotone ki-arrow-left"></i>
          Back to list
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { routeTypes } from '@/core/type/components/breadcrumb'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import momentLib from 'moment'
import GoodsReceiptService, { type GoodsReceiptDetailContentDto } from '@/services/goodsReceipt.service'
import { useLoginStore } from '@/stores/views/login'

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

const formatMoney = (amt: number | null | undefined, cur?: string) => {
  if (amt == null) return '—'
  const c = cur || 'IDR'
  try {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: c, maximumFractionDigits: 2 }).format(amt)
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

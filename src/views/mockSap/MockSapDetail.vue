<template>
  <div>
    <Breadcrumb title="Mock SAP PO Detail" :routes="routes" />
    <hr class="-mx-[24px] mb-[24px]" />

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <div class="text-center">
        <i class="ki-duotone ki-loading text-4xl text-blue-500 animate-spin"></i>
        <p class="mt-4 text-gray-600">Loading PO details...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="border border-red-200 rounded-xl p-[24px] bg-red-50">
      <div class="text-center">
        <i class="ki-duotone ki-information text-4xl text-red-500 mb-4"></i>
        <h3 class="text-lg font-semibold text-red-700">Error Loading Data</h3>
        <p class="text-red-600 mt-2">{{ error }}</p>
        <button class="btn btn-primary mt-4" @click="goBack()">
          <i class="ki-duotone ki-arrow-left"></i>
          Back to List
        </button>
      </div>
    </div>

    <!-- Detail Content -->
    <div v-else-if="detailData" class="border border-gray-200 rounded-xl p-[24px]">
      <!-- Header Card -->
      <div class="border border-gray-200 rounded-xl p-[24px] mb-[24px]">
        <h3 class="text-lg font-semibold mb-4">Purchase Order Information</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <!-- Left Column -->
          <div class="space-y-4">
            <!-- PO Number -->
            <div class="flex items-center gap-4">
              <label class="form-label text-sm font-medium text-gray-600 w-40 mb-0">
                PO Number
              </label>
              <input
                v-model="detailData.poNumber"
                type="text"
                class="input flex-1 bg-gray-50"
                disabled
              />
            </div>

            <!-- Vendor Code -->
            <div class="flex items-center gap-4">
              <label class="form-label text-sm font-medium text-gray-600 w-40 mb-0">
                Vendor Code
              </label>
              <input
                v-model="detailData.vendorCode"
                type="text"
                class="input flex-1 bg-gray-50"
                disabled
              />
            </div>

            <!-- Vendor Name -->
            <div class="flex items-center gap-4">
              <label class="form-label text-sm font-medium text-gray-600 w-40 mb-0">
                Vendor Name
              </label>
              <input
                v-model="detailData.vendorName"
                type="text"
                class="input flex-1 bg-gray-50"
                disabled
              />
            </div>

            <!-- PO Date -->
            <div class="flex items-center gap-4">
              <label class="form-label text-sm font-medium text-gray-600 w-40 mb-0">
                PO Date
              </label>
              <input
                v-model="formattedPoDate"
                type="text"
                class="input flex-1 bg-gray-50"
                disabled
              />
            </div>
          </div>

          <!-- Right Column -->
          <div class="space-y-4">
            <!-- Total Amount -->
            <div class="flex items-center gap-4">
              <label class="form-label text-sm font-medium text-gray-600 w-40 mb-0">
                Total Amount
              </label>
              <input
                v-model="formattedTotalAmount"
                type="text"
                class="input flex-1 bg-gray-50"
                disabled
              />
            </div>

            <!-- Status -->
            <div class="flex items-center gap-4">
              <label class="form-label text-sm font-medium text-gray-600 w-40 mb-0">
                Status
              </label>
              <div class="flex-1">
                <span class="badge badge-outline" :class="getStatusBadgeClass(detailData.status)">
                  {{ detailData.status }}
                </span>
              </div>
            </div>

            <!-- Created By -->
            <div class="flex items-center gap-4">
              <label class="form-label text-sm font-medium text-gray-600 w-40 mb-0">
                Created By
              </label>
              <input
                v-model="detailData.createdBy"
                type="text"
                class="input flex-1 bg-gray-50"
                disabled
              />
            </div>

            <!-- Created Date -->
            <div class="flex items-center gap-4">
              <label class="form-label text-sm font-medium text-gray-600 w-40 mb-0">
                Created Date
              </label>
              <input
                v-model="formattedCreatedDate"
                type="text"
                class="input flex-1 bg-gray-50"
                disabled
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Items Table Section -->
      <div class="border border-gray-200 rounded-xl p-[24px] mt-[24px]">
        <h3 class="text-lg font-semibold mb-4">PO Items</h3>
        <div class="overflow-x-auto list__table">
          <table class="table align-middle text-gray-700 font-medium text-sm">
            <thead>
              <tr class="bg-blue-500 text-white">
                <th class="text-center">No</th>
                <th class="text-center">SKU</th>
                <th class="text-center">Item Name</th>
                <th class="text-center">UOM</th>
                <th class="text-center">Total Qty Ordered</th>
                <th class="text-center">Unit Price</th>
                <th class="text-center">Subtotal</th>
                <th class="text-center">Qty In Transit</th>
                <th class="text-center">Qty Delivered</th>
                <th class="text-center">Qty Pending</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!detailData.items || detailData.items.length === 0">
                <td colspan="10" class="text-center py-8">
                  <div class="text-gray-400">
                    <i class="ki-duotone ki-information text-3xl mb-2"></i>
                    <p>No items found</p>
                  </div>
                </td>
              </tr>
              <tr v-for="(item, index) in detailData.items" :key="index">
                <td class="text-center">{{ index + 1 }}</td>
                <td class="text-center">{{ item.sku }}</td>
                <td class="text-left">{{ item.itemName }}</td>
                <td class="text-center">{{ item.uom }}</td>
                <td class="text-right">{{ formatNumber(calculateTotalQtyOrdered(item)) }}</td>
                <td class="text-right">{{ formatCurrency(item.unitPrice) }}</td>
                <td class="text-right">{{ formatCurrency(calculateSubtotal(item)) }}</td>
                <td class="text-right">{{ formatNumber(item.qtyInTransit) }}</td>
                <td class="text-right">{{ formatNumber(item.qtyDelivered) }}</td>
                <td class="text-right">{{ formatNumber(calculateQtyPending(item)) }}</td>
              </tr>
            </tbody>
            <tfoot v-if="detailData.items && detailData.items.length > 0">
              <tr class="font-semibold bg-gray-50">
                <td colspan="6" class="text-right">Grand Total:</td>
                <td class="text-right">{{ formatCurrency(calculateGrandTotal()) }}</td>
                <td colspan="3"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-[24px]">
        <div class="border border-gray-200 rounded-lg p-4">
          <div class="text-sm text-gray-600 mb-1">Total Items</div>
          <div class="text-2xl font-semibold text-blue-600">
            {{ detailData.items?.length || 0 }}
          </div>
        </div>
        <div class="border border-gray-200 rounded-lg p-4">
          <div class="text-sm text-gray-600 mb-1">Total Quantity Ordered</div>
          <div class="text-2xl font-semibold text-green-600">
            {{ formatNumber(getTotalQtyOrdered()) }}
          </div>
        </div>
        <div class="border border-gray-200 rounded-lg p-4">
          <div class="text-sm text-gray-600 mb-1">Total Quantity Delivered</div>
          <div class="text-2xl font-semibold text-orange-600">
            {{ formatNumber(getTotalQtyDelivered()) }}
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-[24px] flex gap-3 justify-end">
        <button class="btn btn-light" @click="goBack()">
          <i class="ki-duotone ki-arrow-left"></i>
          Back to List
        </button>
        <!-- <button class="btn btn-primary" @click="printDetail()">
          <i class="ki-duotone ki-printer"></i>
          Print
        </button> -->
      </div>
    </div>

    <!-- Notification Modal -->
    <ModalNotification
      :open="showNotificationModal"
      :id="'notification-modal'"
      :type="notificationModal.type"
      :title="notificationModal.title"
      :text="notificationModal.text"
      :onClose="
        () => {
          showNotificationModal = false
        }
      "
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { type routeTypes } from '@/core/type/components/breadcrumb'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import ModalNotification from '@/components/modal/ModalNotification.vue'
import MockSapService, { type MockSapHeaderData, type MockSapDetailItem } from '@/services/mockSap.service'
import momentLib from 'moment'

const moment = momentLib
const router = useRouter()
const route = useRoute()

// Breadcrumb
const routes = ref<routeTypes[]>([
  {
    name: 'Mock SAP',
    to: '/mock-sap-list',
  },
])

// States
const isLoading = ref<boolean>(true)
const error = ref<string | null>(null)
const detailData = ref<MockSapHeaderData | null>(null)

// Modal state
const showNotificationModal = ref<boolean>(false)
const notificationModal = ref({
  type: 'info' as 'info' | 'success' | 'error' | 'warning',
  title: '',
  text: '',
})

// Computed properties for formatted fields
const formattedPoDate = computed(() => {
  if (!detailData.value?.poDate) return '-'
  try {
    return moment(detailData.value.poDate).format('DD MMMM YYYY')
  } catch {
    return detailData.value.poDate
  }
})

const formattedCreatedDate = computed(() => {
  if (!detailData.value?.createdUtcDate) return '-'
  try {
    return moment(detailData.value.createdUtcDate).format('DD MMMM YYYY HH:mm')
  } catch {
    return detailData.value.createdUtcDate
  }
})

const formattedTotalAmount = computed(() => {
  if (!detailData.value?.totalAmount) return '-'
  return formatCurrency(detailData.value.totalAmount)
})

const getStatusBadgeClass = (status: string) => {
  if (status === 'Delivered') return 'badge-success'
  if (status === 'Partially Delivered') return 'badge-warning'
  if (status === 'Open') return 'badge-info'
  if (status === 'Closed') return 'badge-secondary'
  return 'badge-secondary'
}

const formatCurrency = (amount: number | null | undefined) => {
  if (amount === null || amount === undefined) return '-'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

const formatNumber = (num: number | null | undefined) => {
  if (num === null || num === undefined) return '0'
  return new Intl.NumberFormat('id-ID').format(num)
}

// Calculate Total Qty Ordered (Original) = Qty Pending + Qty In Transit + Qty Delivered
const calculateTotalQtyOrdered = (item: MockSapDetailItem) => {
  return item.qtyOrdered 
}

const calculateQtyPending = (item: MockSapDetailItem) => {
  return item.qtyOrdered - item.qtyDelivered
}

const calculateSubtotal = (item: MockSapDetailItem) => {
  if (!item.unitPrice) return 0
  const totalQty = calculateTotalQtyOrdered(item)
  return item.unitPrice * totalQty
}

const calculateGrandTotal = () => {
  if (!detailData.value?.items) return 0
  return detailData.value.items.reduce((sum, item) => {
    return sum + calculateSubtotal(item)
  }, 0)
}

const getTotalQtyOrdered = () => {
  if (!detailData.value?.items) return 0
  return detailData.value.items.reduce((sum, item) => sum + calculateTotalQtyOrdered(item), 0)
}

const getTotalQtyDelivered = () => {
  if (!detailData.value?.items) return 0
  return detailData.value.items.reduce((sum, item) => sum + item.qtyDelivered, 0)
}

const fetchDetail = async () => {
  const poNumber = route.params.poNumber

  if (!poNumber || Array.isArray(poNumber)) {
    error.value = 'Invalid PO Number'
    isLoading.value = false
    return
  }

  try {
    isLoading.value = true
    error.value = null

    const data = await MockSapService.getDetail(poNumber)

    if (data) {
      detailData.value = data
    } else {
      error.value = 'Purchase Order not found'
    }
  } catch (err) {
    console.error('Error fetching PO detail:', err)
    error.value = 'Failed to load PO details. Please try again.'

    notificationModal.value = {
      type: 'error',
      title: 'Error',
      text: 'Failed to load PO details',
    }
    showNotificationModal.value = true
  } finally {
    isLoading.value = false
  }
}

const goBack = () => {
  router.push({ name: 'mockSapList' })
}

const printDetail = () => {
  window.print()
}

onMounted(() => {
  fetchDetail()
})
</script>

<style lang="scss" scoped>
@media print {
  .btn,
  button {
    display: none;
  }
}

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


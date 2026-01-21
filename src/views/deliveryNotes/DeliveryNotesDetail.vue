<template>
  <div>
    <Breadcrumb title="Delivery Notes Detail" :routes="routes" />
    <hr class="-mx-[24px] mb-[24px]" />

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <div class="text-center">
        <i class="ki-duotone ki-loading text-4xl text-blue-500 animate-spin"></i>
        <p class="mt-4 text-gray-600">Loading delivery note details...</p>
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
      <!-- Form Card -->
      <div class="border border-gray-200 rounded-xl p-[24px] mb-[24px]">
        <h3 class="text-lg font-semibold mb-4">Delivery Details</h3>
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- Left and Middle Columns - Form Fields (8 columns) -->
          <div class="lg:col-span-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              <!-- Left Column -->
              <div class="space-y-3">
                <!-- Delivery Note Number -->
                <div class="flex items-center gap-4">
                  <label class="form-label text-sm font-medium text-gray-600 w-40 mb-0">
                    Delivery Note #
                  </label>
                  <input
                    v-model="detailData.deliveryNoteNumber"
                    type="text"
                    class="input flex-1 bg-gray-50"
                    disabled
                  />
                </div>

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

                <!-- Trip ID -->
                <div class="flex items-center gap-4">
                  <label class="form-label text-sm font-medium text-gray-600 w-40 mb-0">
                    Trip ID
                  </label>
                  <input
                    v-model="detailData.tripID"
                    type="text"
                    class="input flex-1 bg-gray-50"
                    disabled
                  />
                </div>

                <!-- Driver Name -->
                <div class="flex items-center gap-4">
                  <label class="form-label text-sm font-medium text-gray-600 w-40 mb-0">
                    Driver Name
                  </label>
                  <input
                    v-model="detailData.driverName"
                    type="text"
                    class="input flex-1 bg-gray-50"
                    disabled
                  />
                </div>

                <!-- License Plate -->
                <div class="flex items-center gap-4">
                  <label class="form-label text-sm font-medium text-gray-600 w-40 mb-0">
                    License Plate
                  </label>
                  <input
                    v-model="detailData.licensePlate"
                    type="text"
                    class="input flex-1 bg-gray-50"
                    disabled
                  />
                </div>

                <!-- Transporter -->
                <div class="flex items-center gap-4">
                  <label class="form-label text-sm font-medium text-gray-600 w-40 mb-0">
                    Transporter
                  </label>
                  <input
                    v-model="detailData.transporter"
                    type="text"
                    class="input flex-1 bg-gray-50"
                    disabled
                  />
                </div>
              </div>

              <!-- Right Column -->
              <div class="space-y-3">
                <!-- Pickup Address -->
                <div class="flex items-center gap-4">
                  <label class="form-label text-sm font-medium text-gray-600 w-36 mb-0">
                    Pickup Address
                  </label>
                  <input
                    v-model="detailData.pickupAddress"
                    type="text"
                    class="input flex-1 bg-gray-50"
                    disabled
                  />
                </div>

                <!-- Destination Address -->
                <div class="flex items-center gap-4">
                  <label class="form-label text-sm font-medium text-gray-600 w-36 mb-0">
                    Destination
                  </label>
                  <input
                    v-model="detailData.destinationAddress"
                    type="text"
                    class="input flex-1 bg-gray-50"
                    disabled
                  />
                </div>

                <!-- Truck Type -->
                <div class="flex items-center gap-4">
                  <label class="form-label text-sm font-medium text-gray-600 w-36 mb-0">
                    Truck Type
                  </label>
                  <input
                    v-model="detailData.truckType"
                    type="text"
                    class="input flex-1 bg-gray-50"
                    disabled
                  />
                </div>

                <!-- Shipping Date -->
                <div class="flex items-center gap-4">
                  <label class="form-label text-sm font-medium text-gray-600 w-36 mb-0">
                    Shipping Date
                  </label>
                  <input
                    v-model="formattedShippingDate"
                    type="text"
                    class="input flex-1 bg-gray-50"
                    disabled
                  />
                </div>

                <!-- Status -->
                <div class="flex items-center gap-4">
                  <label class="form-label text-sm font-medium text-gray-600 w-36 mb-0">
                    Status
                  </label>
                  <input
                    v-model="detailData.status"
                    type="text"
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
              <h3 class="text-sm font-semibold mb-3">Driver Signature</h3>
              <div
                class="flex-1 border border-gray-300 rounded bg-gray-50 flex items-center justify-center min-h-[200px]"
              >
                <img
                  v-if="
                    detailData.driverSignature &&
                    detailData.driverSignature.trim() &&
                    detailData.driverSignature.startsWith('data:image')
                  "
                  :src="detailData.driverSignature"
                  alt="Driver Signature"
                  class="max-w-full max-h-full"
                />
                <span v-else class="text-gray-400 text-sm">No signature available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Table Section -->
      <div class="border border-gray-200 rounded-xl p-[24px] mt-[24px]">
        <h3 class="text-lg font-semibold mb-4">Items List</h3>
        <div class="overflow-x-auto list__table">
          <table class="table align-middle text-gray-700 font-medium text-sm">
            <thead>
              <tr class="bg-blue-500 text-white">
                <th class="text-center">No</th>
                <th class="text-center">SKU</th>
                <th class="text-center">Description</th>
                <th class="text-center">UOM</th>
                <th class="text-center">Lot No</th>
                <th class="text-center">Qty Shipped</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!detailData.items || detailData.items.length === 0">
                <td colspan="6" class="text-center py-8">
                  <div class="text-gray-400">
                    <i class="ki-duotone ki-information text-3xl mb-2"></i>
                    <p>No items found</p>
                  </div>
                </td>
              </tr>
              <tr v-for="(item, index) in detailData.items" :key="index">
                <td class="text-center">{{ index + 1 }}</td>
                <td class="text-center">{{ item.sku }}</td>
                <td class="text-center">{{ item.description }}</td>
                <td class="text-center">{{ item.uom }}</td>
                <td class="text-center">{{ item.lotNo }}</td>
                <td class="text-center">{{ item.qtyShipped }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-[24px] flex gap-3 justify-end">
        <button class="btn btn-light" @click="goBack()">
          <i class="ki-duotone ki-arrow-left"></i>
          Back to List
        </button>
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
import DeliveryNotesService, { type DeliveryNotesData } from '@/services/deliveryNotes.service'

const router = useRouter()
const route = useRoute()

// Breadcrumb
const routes = ref<routeTypes[]>([
  {
    name: 'Delivery Notes',
    to: '/delivery-notes-list',
  },
])

// States
const isLoading = ref<boolean>(true)
const error = ref<string | null>(null)
const detailData = ref<DeliveryNotesData | null>(null)

// Modal state
const showNotificationModal = ref<boolean>(false)
const notificationModal = ref({
  type: 'info' as 'info' | 'success' | 'error' | 'warning',
  title: '',
  text: '',
})

// Computed property for formatted shipping date
const formattedShippingDate = computed(() => {
  if (!detailData.value?.shippingDate) return '-'
  try {
    const date = new Date(detailData.value.shippingDate)
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return detailData.value.shippingDate
  }
})

const fetchDetail = async () => {
  const id = route.params.id

  if (!id || Array.isArray(id)) {
    error.value = 'Invalid delivery note ID'
    isLoading.value = false
    return
  }

  const numericId = parseInt(id, 10)
  if (isNaN(numericId)) {
    error.value = 'Invalid delivery note ID format'
    isLoading.value = false
    return
  }

  try {
    isLoading.value = true
    error.value = null

    const data = await DeliveryNotesService.getDetail(numericId)

    if (data) {
      detailData.value = data
    } else {
      error.value = 'Delivery note not found'
    }
  } catch (err) {
    console.error('Error fetching delivery note detail:', err)
    error.value = 'Failed to load delivery note details. Please try again.'

    notificationModal.value = {
      type: 'error',
      title: 'Error',
      text: 'Failed to load delivery note details',
    }
    showNotificationModal.value = true
  } finally {
    isLoading.value = false
  }
}

const goBack = () => {
  router.push({ name: 'deliveryNotesList' })
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

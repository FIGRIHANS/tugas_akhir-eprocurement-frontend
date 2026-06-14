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
        <button class="btn btn-outline btn-primary mt-4" @click="goBack()">
          <i class="ki-filled ki-arrow-left"></i>
          Back
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

                <!-- Trip ID -->
                <div class="flex items-center gap-4">
                  <label class="form-label text-sm font-medium text-gray-600 w-40 mb-0">
                    Trip ID
                  </label>
                  <input
                    v-model="detailData.tripID"
                    type="text"
                    class="input flex-1"
                    :class="isDraft ? 'bg-white' : 'bg-gray-50'"
                    :disabled="!isDraft"
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
                    class="input flex-1"
                    :class="isDraft ? 'bg-white' : 'bg-gray-50'"
                    :disabled="!isDraft"
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
                    class="input flex-1"
                    :class="isDraft ? 'bg-white' : 'bg-gray-50'"
                    :disabled="!isDraft"
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
                    class="input flex-1"
                    :class="isDraft ? 'bg-white' : 'bg-gray-50'"
                    :disabled="!isDraft"
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
                    class="input flex-1"
                    :class="isDraft ? 'bg-white' : 'bg-gray-50'"
                    :disabled="!isDraft"
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
                    class="input flex-1"
                    :class="isDraft ? 'bg-white' : 'bg-gray-50'"
                    :disabled="!isDraft"
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
                    class="input flex-1"
                    :class="isDraft ? 'bg-white' : 'bg-gray-50'"
                    :disabled="!isDraft"
                  />
                </div>

                <!-- Shipping Date -->
                <div class="flex items-center gap-4">
                  <label class="form-label text-sm font-medium text-gray-600 w-36 mb-0">
                    Shipping Date
                  </label>
                  <input
                    v-model="shippingDateInput"
                    :type="isDraft ? 'date' : 'text'"
                    class="input flex-1"
                    :class="isDraft ? 'bg-white' : 'bg-gray-50'"
                    :disabled="!isDraft"
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
        <div class="mb-4 flex justify-between items-center">
          <h3 class="text-lg font-semibold">Items List</h3>
          <button v-if="isDraft" class="btn btn-primary btn-sm" @click="addNewItem">
            <i class="ki-duotone ki-plus"></i>
            Add Item
          </button>
        </div>
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
                <th v-if="isDraft" class="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!detailData.items || detailData.items.length === 0">
                <td :colspan="isDraft ? 7 : 6" class="text-center py-8">
                  <div class="text-gray-400">
                    <i class="ki-duotone ki-information text-3xl mb-2"></i>
                    <p>No items found</p>
                  </div>
                </td>
              </tr>
              <tr v-for="(item, index) in detailData.items" :key="index">
                <td class="text-center">{{ index + 1 }}</td>
                <td class="text-center">
                  <input v-if="isDraft" v-model="item.sku" type="text" class="input input-sm w-32" />
                  <span v-else>{{ item.sku }}</span>
                </td>
                <td class="text-center">
                  <input
                    v-if="isDraft"
                    v-model="item.description"
                    type="text"
                    class="input input-sm w-48"
                  />
                  <span v-else>{{ item.description }}</span>
                </td>
                <td class="text-center">
                  <input v-if="isDraft" v-model="item.uom" type="text" class="input input-sm w-20" />
                  <span v-else>{{ item.uom }}</span>
                </td>
                <td class="text-center">
                  <input
                    v-if="isDraft"
                    v-model="item.lotNo"
                    type="text"
                    class="input input-sm w-28"
                  />
                  <span v-else>{{ item.lotNo }}</span>
                </td>
                <td class="text-center">
                  <input
                    v-if="isDraft"
                    v-model.number="item.qtyShipped"
                    type="number"
                    min="0"
                    class="input input-sm w-24 text-center"
                  />
                  <span v-else>{{ item.qtyShipped }}</span>
                </td>
                <td v-if="isDraft" class="text-center">
                  <button
                    class="btn btn-sm btn-danger btn-icon"
                    @click="removeItem(index)"
                    title="Remove"
                  >
                    <i class="ki-duotone ki-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-between items-center gap-[8px] mt-[24px]">
        <button
          v-if="isDraft"
          class="btn btn-outline btn-primary"
          :disabled="isSubmitting"
          @click="updateDeliveryNote(true)"
        >
          Save as Draft
          <i class="ki-duotone ki-bookmark"></i>
        </button>
        <div v-else></div>
        <div class="flex items-center justify-end gap-[8px]">
          <button
            class="btn btn-outline btn-primary"
            :disabled="isSubmitting"
            @click="goBack()"
          >
            <i class="ki-filled ki-arrow-left"></i>
            Back
          </button>
          <button
            v-if="isDraft"
            class="btn btn-primary"
            :disabled="isSubmitting"
            @click="updateDeliveryNote(false)"
          >
            <span v-if="isSubmitting">Submitting...</span>
            <template v-else>
              Submit
              <i class="ki-duotone ki-paper-plane"></i>
            </template>
          </button>
        </div>
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
import DeliveryNotesService, {
  type DeliveryNoteCreatePayload,
  type DeliveryNotesData,
} from '@/services/deliveryNotes.service'

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
const isSubmitting = ref<boolean>(false)

// Modal state
const showNotificationModal = ref<boolean>(false)
const notificationModal = ref({
  type: 'info' as 'info' | 'success' | 'error' | 'warning',
  title: '',
  text: '',
})

const isDraft = computed(() => detailData.value?.status === 'Draft')

const formatShippingDate = (value?: string): string => {
  if (!value) return '-'
  try {
    const date = new Date(value)
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return value
  }
}

// Computed property for shipping date display/edit.
const shippingDateInput = computed({
  get: () => {
    if (!detailData.value?.shippingDate) return ''
    if (isDraft.value) {
      return new Date(detailData.value.shippingDate).toISOString().split('T')[0]
    }
    return formatShippingDate(detailData.value.shippingDate)
  },
  set: (value: string) => {
    if (detailData.value) {
      detailData.value.shippingDate = value
    }
  },
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

const addNewItem = () => {
  if (!detailData.value) return

  detailData.value.items.push({
    sku: '',
    description: '',
    uom: '',
    lotNo: '',
    qtyShipped: 0,
  })
}

const removeItem = (index: number) => {
  detailData.value?.items.splice(index, 1)
}

const validateUpdateForm = (isDraftUpdate = false): boolean => {
  if (!detailData.value) return false

  if (!isDraft.value) {
    notificationModal.value = {
      type: 'warning',
      title: 'Validation Error',
      text: 'Delivery note can only be updated while status is Draft',
    }
    showNotificationModal.value = true
    return false
  }

  if (!detailData.value.poNumber?.trim() || !detailData.value.vendorCode?.trim()) {
    notificationModal.value = {
      type: 'warning',
      title: 'Validation Error',
      text: 'PO Number and Vendor Code are required',
    }
    showNotificationModal.value = true
    return false
  }

  if (isDraftUpdate) return true

  if (
    !detailData.value.driverName?.trim() ||
    !detailData.value.licensePlate?.trim() ||
    !detailData.value.transporter?.trim() ||
    !detailData.value.pickupAddress?.trim() ||
    !detailData.value.destinationAddress?.trim() ||
    !detailData.value.shippingDate
  ) {
    notificationModal.value = {
      type: 'warning',
      title: 'Validation Error',
      text: 'Please complete delivery information before submitting',
    }
    showNotificationModal.value = true
    return false
  }

  if (!detailData.value.items || detailData.value.items.length === 0) {
    notificationModal.value = {
      type: 'warning',
      title: 'Validation Error',
      text: 'Please add at least one item',
    }
    showNotificationModal.value = true
    return false
  }

  for (let i = 0; i < detailData.value.items.length; i++) {
    const item = detailData.value.items[i]
    if (!item.sku || !item.description || !item.uom || !item.lotNo || item.qtyShipped <= 0) {
      notificationModal.value = {
        type: 'warning',
        title: 'Validation Error',
        text: `Please complete all fields for item #${i + 1}`,
      }
      showNotificationModal.value = true
      return false
    }
  }

  return true
}

const buildUpdatePayload = (isDraftUpdate = false): DeliveryNoteCreatePayload => {
  const data = detailData.value!
  const vendorID = data.vendorID === undefined || data.vendorID === '' ? undefined : Number(data.vendorID)

  return {
    deliveryNoteNumber: data.deliveryNoteNumber,
    poNumber: data.poNumber,
    vendorCode: data.vendorCode,
    vendorID: Number.isNaN(vendorID) ? undefined : vendorID,
    vendorName: data.vendorName || '',
    tripID: data.tripID || undefined,
    transporter: data.transporter || '',
    licensePlate: data.licensePlate || '',
    driverName: data.driverName || '',
    pickupAddress: data.pickupAddress || '',
    destinationAddress: data.destinationAddress || '',
    driverSignature: data.driverSignature || '',
    truckType: data.truckType || undefined,
    shippingDate: data.shippingDate
      ? new Date(data.shippingDate).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    status: isDraftUpdate ? 'Draft' : 'On Delivery',
    details: isDraftUpdate
      ? data.items.filter((item) => item.sku || item.description || item.uom || item.lotNo || item.qtyShipped > 0)
      : data.items,
  }
}

const updateDeliveryNote = async (isDraftUpdate = false) => {
  if (!detailData.value || !validateUpdateForm(isDraftUpdate)) return

  isSubmitting.value = true

  try {
    await DeliveryNotesService.update(detailData.value.id, buildUpdatePayload(isDraftUpdate))

    notificationModal.value = {
      type: 'success',
      title: 'Success',
      text: isDraftUpdate
        ? 'Delivery note draft updated successfully!'
        : 'Delivery note submitted successfully!',
    }
    showNotificationModal.value = true

    await new Promise((resolve) => setTimeout(resolve, 1500))
    router.push({ name: 'deliveryNotesList' })
  } catch (err) {
    console.error('Error updating delivery note:', err)
    notificationModal.value = {
      type: 'error',
      title: 'Error',
      text: 'Failed to update delivery note',
    }
    showNotificationModal.value = true
  } finally {
    isSubmitting.value = false
  }
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

.input-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}
</style>

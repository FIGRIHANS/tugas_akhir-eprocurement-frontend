<template>
  <div>
    <Breadcrumb title="Create Receiving Confirmation" :routes="routes" />
    <hr class="-mx-[24px] mb-[24px]" />

    <div class="border border-gray-200 rounded-xl p-[24px]">
      <!-- Header Section -->
      <div class="mb-[24px]">
        <h3 class="text-lg font-semibold">Receiving Confirmation Request</h3>
      </div>

      <!-- Form Konfirmasi Card -->
      <div class="border border-gray-200 rounded-xl p-[24px] mb-[24px]">
        <h3 class="text-lg font-semibold mb-4">Payment Confirmation</h3>
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- Left and Middle Columns - Form Fields (8 columns) -->
          <div class="lg:col-span-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              <!-- Left Column -->
              <div class="space-y-3">
                <!-- PO Number with Search -->
                <div class="flex items-center gap-4">
                  <label class="form-label text-sm font-medium text-gray-600 w-40 mb-0"
                    >Delivery Note Number <span class="text-red-500">*</span></label
                  >
                  <div class="flex-1 relative">
                    <div class="flex gap-2">
                      <input
                        v-model="deliveryNoteNumberSearch"
                        type="text"
                        class="input flex-1"
                        placeholder="Enter Delivery Note Number"
                        @keypress.enter="searchDeliveryNotes"
                      />
                      <button
                        class="btn btn-primary"
                        @click="searchDeliveryNotes"
                        :disabled="isSearching"
                      >
                        <i class="ki-duotone ki-search" v-if="!isSearching"></i>
                        <span v-if="isSearching">Loading...</span>
                        <span v-else>Search</span>
                      </button>
                    </div>
                    <!-- Dropdown for delivery notes selection -->
                    <div
                      v-if="deliveryNotesOptions.length > 0 && showDropdown"
                      class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                    >
                      <div
                        v-for="dn in deliveryNotesOptions"
                        :key="dn.id"
                        class="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0"
                        @click="selectDeliveryNote(dn)"
                      >
                        <div class="font-medium">{{ dn.deliveryNoteNumber }}</div>
                        <div class="text-sm text-gray-500">PO: {{ dn.poNumber }}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Selected Delivery Note Info -->
                <div v-if="selectedDeliveryNote" class="bg-blue-50 p-3 rounded-lg text-sm">
                  <div class="font-medium text-blue-700">
                    Selected: {{ selectedDeliveryNote.deliveryNoteNumber }}
                  </div>
                </div>

                <!-- Employee Name (Editable) -->
                <div class="flex items-center gap-4">
                  <label class="form-label text-sm font-medium text-gray-600 w-40 mb-0"
                    >Employee Name <span class="text-red-500">*</span></label
                  >
                  <input
                    v-model="formData.whCheckerName"
                    type="text"
                    class="input flex-1"
                    placeholder="Enter Employee Name"
                  />
                </div>
                <!-- Trip ID -->
                <div class="flex items-center gap-4">
                  <label class="form-label text-sm font-medium text-gray-600 w-40 mb-0"
                    >Trip ID <span class="text-red-500">*</span></label
                  >
                  <input
                    v-model="formData.tripID"
                    type="text"
                    class="input flex-1"
                    placeholder="Enter Trip ID"
                  />
                </div>

                <!-- Driver Name (Editable) -->
                <div class="flex items-center gap-4">
                  <label class="form-label text-sm font-medium text-gray-600 w-40 mb-0"
                    >Driver Name <span class="text-red-500">*</span></label
                  >
                  <input
                    v-model="formData.driverName"
                    type="text"
                    class="input flex-1"
                    placeholder="Enter Driver Name"
                  />
                </div>

                <!-- License Plate (Read-only from DN) -->
                <div class="flex items-center gap-4">
                  <label class="form-label text-sm font-medium text-gray-600 w-40 mb-0"
                    >License Plate</label
                  >
                  <input
                    v-model="formData.licensePlate"
                    type="text"
                    class="input flex-1 bg-gray-100"
                    placeholder="Auto-filled from Delivery Note"
                    readonly
                  />
                </div>

                <!-- Transporter (Read-only from DN) -->
                <div class="flex items-center gap-4">
                  <label class="form-label text-sm font-medium text-gray-600 w-40 mb-0"
                    >Transporter</label
                  >
                  <input
                    v-model="formData.transporter"
                    type="text"
                    class="input flex-1 bg-gray-100"
                    placeholder="Auto-filled from Delivery Note"
                    readonly
                  />
                </div>
              </div>

              <!-- Right Column -->
              <div class="space-y-3">
                <!-- Pickup (Read-only from DN) -->
                <div class="flex items-center gap-4">
                  <label class="form-label text-sm font-medium text-gray-600 w-36 mb-0"
                    >Pickup</label
                  >
                  <input
                    v-model="formData.pickup"
                    type="text"
                    class="input flex-1 bg-gray-100"
                    placeholder="Auto-filled from Delivery Note"
                    readonly
                  />
                </div>

                <!-- Destination (Read-only from DN) -->
                <div class="flex items-center gap-4">
                  <label class="form-label text-sm font-medium text-gray-600 w-36 mb-0"
                    >Destination</label
                  >
                  <input
                    v-model="formData.destination"
                    type="text"
                    class="input flex-1 bg-gray-100"
                    placeholder="Auto-filled from Delivery Note"
                    readonly
                  />
                </div>

                <!-- Truck Type (Read-only from DN) -->
                <div class="flex items-center gap-4">
                  <label class="form-label text-sm font-medium text-gray-600 w-36 mb-0"
                    >Truck Type</label
                  >
                  <input
                    v-model="formData.truckType"
                    type="text"
                    class="input flex-1 bg-gray-100"
                    placeholder="Auto-filled from Delivery Note"
                    readonly
                  />
                </div>

                <!-- Received Date (Editable) -->
                <div class="flex items-center gap-4">
                  <label class="form-label text-sm font-medium text-gray-600 w-36 mb-0"
                    >Received Date <span class="text-red-500">*</span></label
                  >
                  <input v-model="formData.receivedDate" type="date" class="input flex-1" />
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column - Signature Box (4 columns) -->
          <div class="lg:col-span-4">
            <label class="form-label text-sm font-medium text-gray-600"
              >Signature <span class="text-red-500">*</span></label
            >
            <div class="border border-gray-300 rounded-lg p-4 mt-2 bg-gray-50">
              <!-- Signature Pad -->
              <VueSignature
                ref="signaturePad"
                :sigOption="signatureOptions"
                :w="'100%'"
                :h="'200px'"
                class="signature-pad"
              />

              <!-- Clear Button (Vertical) -->
              <div class="mt-3">
                <button class="btn btn-sm btn-danger w-full" @click="clearSignature">
                  <i class="ki-duotone ki-trash"></i>
                  Clear
                </button>
              </div>

              <!-- Label -->
              <div class="text-center mt-3">
                <p class="text-sm font-semibold text-gray-700">Employee Signature</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Table Section -->
      <div class="border border-gray-200 rounded-xl p-[24px] mt-[24px]">
        <!-- Table Header -->
        <div class="mb-4">
          <h3 class="text-lg font-semibold">List Receiving Confirmation Request</h3>
          <p class="text-sm text-gray-500 mt-1">
            Only <strong>Received</strong>, <strong>Repack Qty</strong>, and
            <strong>Damage Qty</strong> can be edited. Difference, More, and Less are calculated
            automatically.
          </p>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto list__table">
          <table class="table align-middle text-gray-700 font-medium text-sm">
            <thead>
              <!-- First Header Row -->
              <tr class="bg-blue-500 text-white">
                <th rowspan="2" class="text-center border-r">No</th>
                <th rowspan="2" class="text-center border-r">No Pick Slip</th>
                <th rowspan="2" class="text-center border-r">SKU</th>
                <th rowspan="2" class="text-center border-r">Description</th>
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
                <th class="text-center border-r bg-green-600">Received</th>
                <th class="text-center border-r">Difference</th>
                <th class="text-center border-r">More</th>
                <th class="text-center border-r">Less</th>
                <th class="text-center border-r bg-green-600">Repack Qty</th>
                <th class="text-center border-r bg-green-600">Damage Qty</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="tableData.length === 0">
                <td colspan="13" class="text-center py-8">
                  <div class="text-gray-400">
                    <i class="ki-duotone ki-information text-3xl mb-2"></i>
                    <p>No data available. Search for a PO Number first.</p>
                  </div>
                </td>
              </tr>
              <tr v-for="(item, index) in tableData" :key="index">
                <td class="text-center">{{ index + 1 }}</td>
                <td>{{ item.noPickSlip }}</td>
                <td>{{ item.sku }}</td>
                <td>{{ item.deskripsi }}</td>
                <td class="text-right">{{ item.lotNoDeliveryNote }}</td>
                <td class="text-right">{{ item.lotNoActual }}</td>
                <td class="text-right">{{ item.qtySuratJalan }}</td>
                <!-- Received - Editable -->
                <td class="text-center">
                  <input
                    v-model.number="item.qtyActual"
                    type="number"
                    min="0"
                    class="input input-sm w-20 text-center"
                    @input="calculateDifference(index)"
                  />
                </td>
                <!-- Difference - Calculated -->
                <td class="text-right" :class="getDifferenceClass(item.qtySelisih)">
                  {{ item.qtySelisih }}
                </td>
                <!-- More - Calculated -->
                <td class="text-right text-green-600">{{ item.more }}</td>
                <!-- Less - Calculated -->
                <td class="text-right text-red-600">{{ item.less }}</td>
                <!-- Repack Qty - Editable -->
                <td class="text-center">
                  <input
                    v-model.number="item.repackQty"
                    type="number"
                    min="0"
                    class="input input-sm w-20 text-center"
                  />
                </td>
                <!-- Damage Qty - Editable -->
                <td class="text-center">
                  <input
                    v-model.number="item.damageQty"
                    type="number"
                    min="0"
                    class="input input-sm w-20 text-center"
                  />
                </td>
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
        <button class="btn btn-primary" @click="submitForm()" :disabled="isSubmitting">
          <i class="ki-duotone ki-save-2" v-if="!isSubmitting"></i>
          <span v-if="isSubmitting">Submitting...</span>
          <span v-else>Submit</span>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { type routeTypes } from '@/core/type/components/breadcrumb'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import VueSignature from 'vue3-signature'
import ModalNotification from '@/components/modal/ModalNotification.vue'
import DeliveryNotesService, { type DeliveryNotesData } from '@/services/deliveryNotes.service'
import ReceivingConfirmationService, {
  type ReceivingConfirmationCreatePayload,
  type ReceivingConfirmationDetailPayload,
} from '@/services/receivingConfirmation.service'

const router = useRouter()

// Interfaces
interface FormData {
  poNumber: string
  tripID: string
  orderNumber: string
  whCheckerName: string
  driverName: string
  licensePlate: string
  transporter: string
  truckType: string
  pickup: string
  destination: string
  receivedDate: string
  digitalSignaturePath: string | null
}

interface TableDataItem {
  sku: string
  deskripsi: string
  noPickSlip: string
  lotNoDeliveryNote: string
  lotNoActual: string
  qtySuratJalan: number
  qtyActual: number
  qtySelisih: number
  more: number
  less: number
  repackQty: number
  damageQty: number
  rejectReason: string
}

// Breadcrumb
const routes = ref<routeTypes[]>([
  {
    name: 'Digital Receiving Confirmation',
    to: '/receiving-confirmation-list',
  },
])

// States
const deliveryNoteNumberSearch = ref<string>('')
const isSearching = ref<boolean>(false)
const isSubmitting = ref<boolean>(false)
const showDropdown = ref<boolean>(false)
const deliveryNotesOptions = ref<DeliveryNotesData[]>([])
const selectedDeliveryNote = ref<DeliveryNotesData | null>(null)

interface SignaturePadInstance {
  clear: () => void
  save: () => string // Returns Base64 string directly
  fromDataURL: (data: string) => void
}

const signaturePad = ref<SignaturePadInstance | null>(null)

// Signature options
const signatureOptions = {
  penColor: '#000000',
  backgroundColor: '#ffffff',
}

// Form Data
const formData = ref<FormData>({
  poNumber: '',
  tripID: '',
  orderNumber: '',
  whCheckerName: '',
  driverName: '',
  licensePlate: '',
  transporter: '',
  truckType: '',
  pickup: '',
  destination: '',
  receivedDate: new Date().toISOString().split('T')[0], // Default to today
  digitalSignaturePath: null,
})

// Table Data
const tableData = ref<TableDataItem[]>([])

// Modal state
const showNotificationModal = ref<boolean>(false)
const notificationModal = ref({
  type: 'info' as 'info' | 'success' | 'error' | 'warning',
  title: '',
  text: '',
})

// Methods
const searchDeliveryNotes = async () => {
  if (!deliveryNoteNumberSearch.value.trim()) {
    notificationModal.value = {
      type: 'warning',
      title: 'Validation Error',
      text: 'Please enter a Delivery Note Number',
    }
    showNotificationModal.value = true
    return
  }

  isSearching.value = true
  showDropdown.value = false

  try {
    const result = await DeliveryNotesService.getByDeliveryNoteNumber(
      deliveryNoteNumberSearch.value,
    )

    if (!result) {
      notificationModal.value = {
        type: 'info',
        title: 'Not Found',
        text: 'No Delivery Note found for this Delivery Note Number',
      }
      showNotificationModal.value = true
      return
    }

    // langsung auto-fill
    selectDeliveryNote(result)
  } catch (error) {
    console.error('Error searching delivery notes:', error)
    notificationModal.value = {
      type: 'error',
      title: 'Error',
      text: 'Failed to search Delivery Notes. Please try again.',
    }
    showNotificationModal.value = true
  } finally {
    isSearching.value = false
  }
}

const selectDeliveryNote = (dn: DeliveryNotesData) => {
  selectedDeliveryNote.value = dn
  showDropdown.value = false

  // Auto-fill form data from selected Delivery Note
  formData.value.poNumber = dn.poNumber
  formData.value.tripID = dn.tripID || ''
  formData.value.orderNumber = dn.poNumber
  formData.value.driverName = dn.driverName || ''
  formData.value.licensePlate = dn.licensePlate || ''
  formData.value.transporter = dn.transporter || ''
  formData.value.truckType = dn.truckType || ''
  formData.value.pickup = dn.pickupAddress || ''
  formData.value.destination = dn.destinationAddress || ''

  // Populate table data from Delivery Note items
  if (dn.items && dn.items.length > 0) {
    tableData.value = dn.items.map((item) => ({
      sku: item.sku,
      deskripsi: item.description,
      noPickSlip: '',
      lotNoDeliveryNote: item.lotNo,
      lotNoActual: item.lotNo,
      qtySuratJalan: item.qtyShipped,
      qtyActual: item.qtyShipped,
      qtySelisih: 0,
      more: 0,
      less: 0,
      repackQty: 0,
      damageQty: 0,
      rejectReason: '',
    }))
  } else {
    tableData.value = []
  }
}

const calculateDifference = (index: number) => {
  const item = tableData.value[index]
  const diff = item.qtyActual - item.qtySuratJalan
  item.qtySelisih = diff
  item.more = diff > 0 ? diff : 0
  item.less = diff < 0 ? Math.abs(diff) : 0
}

const getDifferenceClass = (diff: number) => {
  if (diff > 0) return 'text-green-600 font-semibold'
  if (diff < 0) return 'text-red-600 font-semibold'
  return ''
}

const goBack = () => {
  router.push({ name: 'receivingConfirmationList' })
}

const clearSignature = () => {
  if (signaturePad.value) {
    signaturePad.value.clear()
  }
}

const validateForm = (): boolean => {
  if (!formData.value.poNumber) {
    notificationModal.value = {
      type: 'warning',
      title: 'Validation Error',
      text: 'Please select a Delivery Note first',
    }
    showNotificationModal.value = true
    return false
  }

  if (!formData.value.whCheckerName.trim()) {
    notificationModal.value = {
      type: 'warning',
      title: 'Validation Error',
      text: 'Please enter Employee Name',
    }
    showNotificationModal.value = true
    return false
  }

  if (!formData.value.driverName.trim()) {
    notificationModal.value = {
      type: 'warning',
      title: 'Validation Error',
      text: 'Please enter Driver Name',
    }
    showNotificationModal.value = true
    return false
  }

  if (!formData.value.receivedDate) {
    notificationModal.value = {
      type: 'warning',
      title: 'Validation Error',
      text: 'Please enter Received Date',
    }
    showNotificationModal.value = true
    return false
  }

  if (tableData.value.length === 0) {
    notificationModal.value = {
      type: 'warning',
      title: 'Validation Error',
      text: 'No items to submit. Please select a Delivery Note with items.',
    }
    showNotificationModal.value = true
    return false
  }

  // Check signature
  if (signaturePad.value) {
    const saveResult = signaturePad.value.save()
    if (!saveResult || saveResult.trim().length === 0) {
      notificationModal.value = {
        type: 'warning',
        title: 'Validation Error',
        text: 'Please provide a signature',
      }
      showNotificationModal.value = true
      return false
    }
  }

  return true
}

const submitForm = async () => {
  if (!validateForm()) return

  isSubmitting.value = true

  try {
    // Save signature data
    let signatureData = ''
    if (signaturePad.value) {
      const saveResult = signaturePad.value.save()
      console.log('Signature save result:', saveResult)
      console.log('Type of save result:', typeof saveResult)

      if (saveResult && saveResult.trim().length > 0) {
        signatureData = saveResult
      } else {
        notificationModal.value = {
          type: 'warning',
          title: 'Validation Error',
          text: 'Please provide a signature',
        }
        showNotificationModal.value = true
        isSubmitting.value = false
        return
      }
    } else {
      console.error('❌ Signature pad ref is null')
      isSubmitting.value = false
      return
    }

    console.log('Final signature data length:', signatureData?.length || 0)

    // Prepare items payload
    const items: ReceivingConfirmationDetailPayload[] = tableData.value.map((item) => ({
      sku: item.sku,
      deskripsi: item.deskripsi,
      noPickSlip: item.noPickSlip,
      lotNo: item.lotNoActual,
      qtySuratJalan: item.qtySuratJalan,
      qtyActual: item.qtyActual,
      repackQty: item.repackQty,
      damageQty: item.damageQty,
      rejectReason: item.rejectReason || undefined,
    }))

    // Prepare payload
    const payload: ReceivingConfirmationCreatePayload = {
      poNumber: formData.value.poNumber,
      tripID: formData.value.tripID || undefined,
      orderNumber: formData.value.orderNumber || undefined,
      receivedDate: formData.value.receivedDate,
      whCheckerName: formData.value.whCheckerName,
      driverName: formData.value.driverName,
      pickup: formData.value.pickup || undefined,
      destination: formData.value.destination || undefined,
      transporter: formData.value.transporter || undefined,
      truckType: formData.value.truckType || undefined,
      licensePlate: formData.value.licensePlate || undefined,
      digitalSignaturePath: signatureData || '', // Always send, even if empty
      items: items,
    }

    console.log('Submitting payload:', payload)
    console.log('Signature in payload:', payload.digitalSignaturePath ? 'YES' : 'NO (empty)')

    await ReceivingConfirmationService.create(payload)

    notificationModal.value = {
      type: 'success',
      title: 'Success',
      text: 'Receiving confirmation submitted successfully!',
    }
    showNotificationModal.value = true

    // Wait before redirect
    await new Promise((resolve) => setTimeout(resolve, 1500))
    router.push({ name: 'receivingConfirmationList' })
  } catch (error) {
    console.error('Error submitting form:', error)
    notificationModal.value = {
      type: 'error',
      title: 'Error',
      text: 'Failed to submit. Please try again.',
    }
    showNotificationModal.value = true
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  formData.value.receivedDate = new Date().toISOString().split('T')[0]
})
</script>

<style lang="scss" scoped>
@media print {
  .btn,
  button {
    display: none;
  }
}

.form-control[readonly],
.input[readonly] {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.signature-pad {
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background: white;

  :deep(canvas) {
    border-radius: 0.5rem;
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

<template>
  <div>
    <Breadcrumb title="Create Delivery Notes" :routes="routes" />
    <hr class="-mx-[24px] mb-[24px]" />

    <div class="border border-gray-200 rounded-xl p-[24px]">
      <!-- Header Section -->
      <div class="mb-[24px]">
        <h3 class="text-lg font-semibold">Delivery Notes Information</h3>
      </div>

      <!-- Form Card -->
      <div class="border border-gray-200 rounded-xl p-[24px] mb-[24px]">
        <h3 class="text-lg font-semibold mb-4">Delivery Details</h3>
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- Left and Middle Columns - Form Fields (8 columns) -->
          <div class="lg:col-span-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              <!-- Left Column -->
              <div class="space-y-3">
                <!-- PO Number with Search -->
                <div class="flex items-center gap-4">
                  <label class="form-label text-sm font-medium text-gray-600 w-40 mb-0"
                    >PO Number <span class="text-red-500">*</span></label
                  >
                  <div class="flex-1 relative">
                    <div class="flex gap-2">
                      <input
                        v-model="poNumberSearch"
                        type="text"
                        class="input flex-1"
                        placeholder="Enter PO Number"
                        @keypress.enter="searchPO"
                      />
                      <button class="btn btn-primary" @click="searchPO" :disabled="isSearching">
                        <i class="ki-duotone ki-search" v-if="!isSearching"></i>
                        <span v-if="isSearching">Loading...</span>
                        <span v-else>Search</span>
                      </button>
                    </div>
                    <!-- Dropdown for PO selection -->
                    <div
                      v-if="poOptions.length > 0 && showDropdown"
                      class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                    >
                      <div
                        v-for="po in poOptions"
                        :key="po.poNumber"
                        class="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0"
                        @click="selectPO(po)"
                      >
                        <div class="font-medium">{{ po.poNumber }}</div>
                        <div class="text-sm text-gray-500">
                          Vendor: {{ po.vendorCode }} - {{ po.vendorName }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Selected PO Info -->
                <div v-if="selectedPO" class="bg-blue-50 p-3 rounded-lg text-sm">
                  <div class="font-medium text-blue-700">
                    Selected: {{ selectedPO.poNumber }} - {{ selectedPO.vendorName }}
                  </div>
                </div>

                <!-- Delivery Note Number (Auto-generated or manual) -->
                <div class="flex items-center gap-4">
                  <label class="form-label text-sm font-medium text-gray-600 w-40 mb-0"
                    >Delivery Note # <span class="text-red-500">*</span></label
                  >
                  <input
                    v-model="formData.deliveryNoteNumber"
                    type="text"
                    class="input flex-1"
                    placeholder="Auto-generated or enter manually"
                  />
                </div>

                <!-- Vendor Code -->
                <div class="flex items-center gap-4">
                  <label class="form-label text-sm font-medium text-gray-600 w-40 mb-0"
                    >Vendor Code <span class="text-red-500">*</span></label
                  >
                  <input
                    v-model="formData.vendorCode"
                    type="text"
                    class="input flex-1"
                    placeholder="Enter Vendor Code"
                  />
                </div>

                <!-- Trip ID -->
                <div class="flex items-center gap-4">
                  <label class="form-label text-sm font-medium text-gray-600 w-40 mb-0"
                    >Trip ID</label
                  >
                  <input
                    v-model="formData.tripID"
                    type="text"
                    class="input flex-1"
                    placeholder="Enter Trip ID"
                  />
                </div>

                <!-- Driver Name -->
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

                <!-- License Plate -->
                <div class="flex items-center gap-4">
                  <label class="form-label text-sm font-medium text-gray-600 w-40 mb-0"
                    >License Plate <span class="text-red-500">*</span></label
                  >
                  <input
                    v-model="formData.licensePlate"
                    type="text"
                    class="input flex-1"
                    placeholder="Enter License Plate"
                  />
                </div>

                <!-- Transporter -->
                <div class="flex items-center gap-4">
                  <label class="form-label text-sm font-medium text-gray-600 w-40 mb-0"
                    >Transporter <span class="text-red-500">*</span></label
                  >
                  <input
                    v-model="formData.transporter"
                    type="text"
                    class="input flex-1"
                    placeholder="Enter Transporter"
                  />
                </div>
              </div>

              <!-- Right Column -->
              <div class="space-y-3">
                <!-- Pickup Address -->
                <div class="flex items-center gap-4">
                  <label class="form-label text-sm font-medium text-gray-600 w-36 mb-0"
                    >Pickup Address <span class="text-red-500">*</span></label
                  >
                  <input
                    v-model="formData.pickupAddress"
                    type="text"
                    class="input flex-1"
                    placeholder="Enter Pickup Address"
                  />
                </div>

                <!-- Destination Address -->
                <div class="flex items-center gap-4">
                  <label class="form-label text-sm font-medium text-gray-600 w-36 mb-0"
                    >Destination <span class="text-red-500">*</span></label
                  >
                  <input
                    v-model="formData.destinationAddress"
                    type="text"
                    class="input flex-1"
                    placeholder="Enter Destination Address"
                  />
                </div>

                <!-- Truck Type -->
                <div class="flex items-center gap-4">
                  <label class="form-label text-sm font-medium text-gray-600 w-36 mb-0"
                    >Truck Type</label
                  >
                  <input
                    v-model="formData.truckType"
                    type="text"
                    class="input flex-1"
                    placeholder="Enter Truck Type"
                  />
                </div>

                <!-- Estimated Arrival -->
                <div class="flex items-center gap-4">
                  <label class="form-label text-sm font-medium text-gray-600 w-36 mb-0"
                    >Estimated Arrival <span class="text-red-500">*</span></label
                  >
                  <input
                    v-model="formData.estimatedArrival"
                    type="datetime-local"
                    class="input flex-1"
                  />
                </div>

                <!-- Status -->
                <div class="flex items-center gap-4">
                  <label class="form-label text-sm font-medium text-gray-600 w-36 mb-0"
                    >Status <span class="text-red-500">*</span></label
                  >
                  <select v-model="formData.status" class="form-select flex-1">
                    <option value="Draft">Draft</option>
                    <option value="Waiting Approval">Waiting Approval</option>
                    <option value="Received">Received</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column - Signature Box (4 columns) -->
          <div class="lg:col-span-4">
            <label class="form-label text-sm font-medium text-gray-600"
              >Driver Signature <span class="text-red-500">*</span></label
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

              <!-- Clear Button -->
              <div class="mt-3">
                <button class="btn btn-sm btn-danger w-full" @click="clearSignature">
                  <i class="ki-duotone ki-trash"></i>
                  Clear
                </button>
              </div>

              <!-- Label -->
              <div class="text-center mt-3">
                <p class="text-sm font-semibold text-gray-700">Driver Signature</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Table Section -->
      <div class="border border-gray-200 rounded-xl p-[24px] mt-[24px]">
        <!-- Table Header -->
        <div class="mb-4 flex justify-between items-center">
          <div>
            <h3 class="text-lg font-semibold">Items List</h3>
            <p class="text-sm text-gray-500 mt-1">Add items to be included in this delivery note</p>
          </div>
          <button class="btn btn-primary btn-sm" @click="addNewItem">
            <i class="ki-duotone ki-plus"></i>
            Add Item
          </button>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto list__table">
          <table class="table align-middle text-gray-700 font-medium text-sm">
            <thead>
              <tr class="bg-blue-500 text-white">
                <th class="text-center">No</th>
                <th class="text-center">SKU <span class="text-red-300">*</span></th>
                <th class="text-center">Description <span class="text-red-300">*</span></th>
                <th class="text-center">UOM <span class="text-red-300">*</span></th>
                <th class="text-center">Lot No <span class="text-red-300">*</span></th>
                <th class="text-center">Qty Shipped <span class="text-red-300">*</span></th>
                <th class="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="tableData.length === 0">
                <td colspan="7" class="text-center py-8">
                  <div class="text-gray-400">
                    <i class="ki-duotone ki-information text-3xl mb-2"></i>
                    <p>No items added. Click "Add Item" to start.</p>
                  </div>
                </td>
              </tr>
              <tr v-for="(item, index) in tableData" :key="index">
                <td class="text-center">{{ index + 1 }}</td>
                <td>
                  <input
                    v-model="item.sku"
                    type="text"
                    class="input input-sm w-32"
                    placeholder="SKU"
                  />
                </td>
                <td>
                  <input
                    v-model="item.description"
                    type="text"
                    class="input input-sm w-48"
                    placeholder="Description"
                  />
                </td>
                <td>
                  <input
                    v-model="item.uom"
                    type="text"
                    class="input input-sm w-20"
                    placeholder="UOM"
                  />
                </td>
                <td>
                  <input
                    v-model="item.lotNo"
                    type="text"
                    class="input input-sm w-28"
                    placeholder="Lot No"
                  />
                </td>
                <td>
                  <input
                    v-model.number="item.qtyShipped"
                    type="number"
                    min="0"
                    class="input input-sm w-24 text-center"
                    placeholder="Qty"
                  />
                </td>
                <td class="text-center">
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { type routeTypes } from '@/core/type/components/breadcrumb'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import VueSignature from 'vue3-signature'
import ModalNotification from '@/components/modal/ModalNotification.vue'
import DeliveryNotesService, {
  type MockSapPoData,
  type DeliveryNoteCreatePayload,
} from '@/services/deliveryNotes.service'

const router = useRouter()

// Interfaces
interface FormData {
  deliveryNoteNumber: string
  poNumber: string
  vendorCode: string
  estimatedArrival: string
  pickupAddress: string
  status: string
  destinationAddress: string
  transporter: string
  truckType: string
  licensePlate: string
  driverName: string
  tripID: string
  driverSignature: string | null
}

interface TableDataItem {
  sku: string
  description: string
  uom: string
  lotNo: string
  qtyShipped: number
}

// Breadcrumb
const routes = ref<routeTypes[]>([
  {
    name: 'Delivery Notes Create',
    to: '/delivery-notes-create',
  },
])

// States
const isSubmitting = ref<boolean>(false)
const isSearching = ref<boolean>(false)
const showDropdown = ref<boolean>(false)
const poNumberSearch = ref<string>('')
const poOptions = ref<MockSapPoData[]>([])
const selectedPO = ref<MockSapPoData | null>(null)

interface SignaturePadInstance {
  clear: () => void
  save: () => { isEmpty: boolean; data: string }
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
  deliveryNoteNumber: '',
  poNumber: '',
  vendorCode: '',
  estimatedArrival: '',
  pickupAddress: '',
  status: 'Draft',
  destinationAddress: '',
  transporter: '',
  truckType: '',
  licensePlate: '',
  driverName: '',
  tripID: '',
  driverSignature: null,
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
const searchPO = async () => {
  if (!poNumberSearch.value.trim()) {
    notificationModal.value = {
      type: 'warning',
      title: 'Validation Error',
      text: 'Please enter a PO Number',
    }
    showNotificationModal.value = true
    return
  }

  isSearching.value = true
  showDropdown.value = false

  try {
    const results = await DeliveryNotesService.searchPoFromSap(poNumberSearch.value)
    poOptions.value = results

    if (results.length === 0) {
      notificationModal.value = {
        type: 'info',
        title: 'Not Found',
        text: 'No PO found in SAP system',
      }
      showNotificationModal.value = true
    } else if (results.length === 1) {
      // Auto-select if only one result
      selectPO(results[0])
    } else {
      showDropdown.value = true
    }
  } catch (error) {
    console.error('Error searching PO:', error)
    notificationModal.value = {
      type: 'error',
      title: 'Error',
      text: 'Failed to search PO. Please try again.',
    }
    showNotificationModal.value = true
  } finally {
    isSearching.value = false
  }
}

const selectPO = (po: MockSapPoData) => {
  selectedPO.value = po
  showDropdown.value = false

  // Auto-fill form data from selected PO
  formData.value.poNumber = po.poNumber
  formData.value.vendorCode = po.vendorCode

  // Populate table data from PO items
  if (po.items && po.items.length > 0) {
    tableData.value = po.items.map((item) => ({
      sku: item.sku,
      description: item.itemName,
      uom: item.uom,
      lotNo: '', // User needs to fill this
      qtyShipped: item.qtyOrdered, // Default to ordered qty, user can edit
    }))
  } else {
    tableData.value = []
  }
}

const addNewItem = () => {
  tableData.value.push({
    sku: '',
    description: '',
    uom: '',
    lotNo: '',
    qtyShipped: 0,
  })
}

const removeItem = (index: number) => {
  tableData.value.splice(index, 1)
}

const goBack = () => {
  router.push({ name: 'deliveryNotesList' })
}

const clearSignature = () => {
  if (signaturePad.value) {
    signaturePad.value.clear()
  }
}

const validateForm = (): boolean => {
  if (!formData.value.poNumber.trim()) {
    notificationModal.value = {
      type: 'warning',
      title: 'Validation Error',
      text: 'Please enter PO Number',
    }
    showNotificationModal.value = true
    return false
  }

  if (!formData.value.deliveryNoteNumber.trim()) {
    notificationModal.value = {
      type: 'warning',
      title: 'Validation Error',
      text: 'Please enter Delivery Note Number',
    }
    showNotificationModal.value = true
    return false
  }

  if (!formData.value.vendorCode.trim()) {
    notificationModal.value = {
      type: 'warning',
      title: 'Validation Error',
      text: 'Please enter Vendor Code',
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

  if (!formData.value.licensePlate.trim()) {
    notificationModal.value = {
      type: 'warning',
      title: 'Validation Error',
      text: 'Please enter License Plate',
    }
    showNotificationModal.value = true
    return false
  }

  if (!formData.value.transporter.trim()) {
    notificationModal.value = {
      type: 'warning',
      title: 'Validation Error',
      text: 'Please enter Transporter',
    }
    showNotificationModal.value = true
    return false
  }

  if (!formData.value.pickupAddress.trim()) {
    notificationModal.value = {
      type: 'warning',
      title: 'Validation Error',
      text: 'Please enter Pickup Address',
    }
    showNotificationModal.value = true
    return false
  }

  if (!formData.value.destinationAddress.trim()) {
    notificationModal.value = {
      type: 'warning',
      title: 'Validation Error',
      text: 'Please enter Destination Address',
    }
    showNotificationModal.value = true
    return false
  }

  if (!formData.value.estimatedArrival) {
    notificationModal.value = {
      type: 'warning',
      title: 'Validation Error',
      text: 'Please enter Estimated Arrival',
    }
    showNotificationModal.value = true
    return false
  }

  if (tableData.value.length === 0) {
    notificationModal.value = {
      type: 'warning',
      title: 'Validation Error',
      text: 'Please add at least one item',
    }
    showNotificationModal.value = true
    return false
  }

  // Validate items
  for (let i = 0; i < tableData.value.length; i++) {
    const item = tableData.value[i]
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

  // Check signature
  if (signaturePad.value) {
    const { isEmpty } = signaturePad.value.save()
    if (isEmpty) {
      notificationModal.value = {
        type: 'warning',
        title: 'Validation Error',
        text: 'Please provide driver signature',
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

      // vue3-signature returns the Base64 string directly (not an object)
      if (saveResult && typeof saveResult === 'string' && saveResult.length > 0) {
        signatureData = saveResult
        console.log('✅ Signature data captured successfully!')
        console.log('Signature data length:', signatureData.length)
        console.log('First 100 chars:', signatureData.substring(0, 100))
      } else if (!saveResult || saveResult.length === 0) {
        console.warn('⚠️ Signature pad is empty - user did not draw anything')
      } else {
        console.error('❌ Unexpected save result type:', typeof saveResult)
      }
    } else {
      console.error('❌ Signature pad ref is null')
    }

    console.log('Final signature data length:', signatureData?.length || 0)

    // Convert estimatedArrival to shippingDate (YYYY-MM-DD format)
    const shippingDate = formData.value.estimatedArrival
      ? formData.value.estimatedArrival.split('T')[0]
      : new Date().toISOString().split('T')[0]

    // Prepare payload according to backend structure
    const payload: DeliveryNoteCreatePayload = {
      deliveryNoteNumber: formData.value.deliveryNoteNumber,
      poNumber: formData.value.poNumber,
      vendorCode: formData.value.vendorCode,
      tripID: formData.value.tripID || undefined,
      transporter: formData.value.transporter,
      licensePlate: formData.value.licensePlate,
      driverName: formData.value.driverName,
      pickupAddress: formData.value.pickupAddress,
      destinationAddress: formData.value.destinationAddress,
      driverSignature: signatureData || '', // Ensure always included
      truckType: formData.value.truckType || undefined,
      shippingDate: shippingDate,
      status: 'Submitted', // Always set to Submitted on create
      details: tableData.value,
    }

    console.log('Submitting delivery note:', payload)
    console.log('Signature in payload:', payload.driverSignature ? 'YES' : 'NO (empty)')

    await DeliveryNotesService.create(payload)

    notificationModal.value = {
      type: 'success',
      title: 'Success',
      text: 'Delivery note created successfully!',
    }
    showNotificationModal.value = true

    // Wait before redirect
    await new Promise((resolve) => setTimeout(resolve, 1500))

    router.push({ name: 'deliveryNotesList' })
  } catch (error) {
    console.error('Error submitting form:', error)
    notificationModal.value = {
      type: 'error',
      title: 'Error',
      text: 'Failed to create delivery note. Please try again.',
    }
    showNotificationModal.value = true
  } finally {
    isSubmitting.value = false
  }
}
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

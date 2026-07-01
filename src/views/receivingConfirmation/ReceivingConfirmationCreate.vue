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
                        data-focus-key="dn-search"
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
                    data-focus-key="employee-name"
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
                    data-focus-key="trip-id"
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
                    data-focus-key="driver-name"
                  />
                </div>

                <!-- Vendor Name (Read-only from DN) -->
                <div class="flex items-center gap-4">
                  <label class="form-label text-sm font-medium text-gray-600 w-40 mb-0"
                    >Vendor Name</label
                  >
                  <input
                    v-model="formData.vendorName"
                    type="text"
                    class="input flex-1 bg-gray-100"
                    placeholder="Auto-filled from Delivery Note"
                    readonly
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
                  <input
                    v-model="formData.receivedDate"
                    type="date"
                    class="input flex-1"
                    :max="todayDateString"
                    data-focus-key="received-date"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column - Signature Box (4 columns) -->
          <div class="lg:col-span-4">
            <label class="form-label text-sm font-medium text-gray-600"
              >Signature <span class="text-red-500">*</span></label
            >
            <div
              class="border border-gray-300 rounded-lg p-4 mt-2 bg-gray-50"
              data-focus-key="signature"
              tabindex="-1"
            >
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

            <!-- Physical Delivery Note Upload -->
            <div class="mt-4">
              <label class="form-label text-sm font-medium text-gray-600">
                Vendor Delivery Document (Warehouse)
                <span class="text-xs text-red-500 ml-1">* (Required)</span>
              </label>
              <div class="mt-2">
                <div
                  v-if="!physicalDnFile"
                  class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors cursor-pointer"
                  @click="triggerPhysicalDnUpload"
                  @dragover.prevent
                  @drop.prevent="handlePhysicalDnDrop"
                >
                  <i class="ki-duotone ki-document-up text-2xl text-gray-400 mb-1"></i>
                  <p class="text-xs text-gray-500">Click to upload or drag & drop</p>
                  <p class="text-xs text-gray-400">PDF, PNG, JPG up to 5MB</p>
                </div>
                <div
                  v-else
                  class="border border-green-200 bg-green-50 rounded-lg p-3 flex flex-col items-center justify-center min-h-[120px]"
                >
                  <div class="w-full h-full p-2 flex flex-col">
                    <iframe
                      v-if="physicalDnBase64.startsWith('data:application/pdf')"
                      :src="physicalDnBase64"
                      class="w-full h-[150px] border border-gray-200 rounded mb-2"
                    ></iframe>
                    <img
                      v-else
                      :src="physicalDnBase64"
                      alt="Physical Delivery Note"
                      class="max-w-full max-h-[150px] object-contain rounded mx-auto mb-2"
                    />
                    <div class="flex items-center justify-center gap-2">
                      <span class="text-sm text-green-700 truncate max-w-[150px]">{{ physicalDnFile.name }}</span>
                      <button
                        class="btn btn-sm btn-icon btn-primary"
                        @click.prevent="previewFile(physicalDnBase64)"
                        title="Full Screen"
                      >
                        <i class="ki-duotone ki-maximize"></i>
                      </button>
                      <button
                        class="btn btn-sm btn-icon btn-danger"
                        @click.prevent="removePhysicalDn"
                        title="Remove"
                      >
                        <i class="ki-duotone ki-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <input
                  ref="physicalDnInput"
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  class="hidden"
                  @change="handlePhysicalDnChange"
                />
                <p v-if="physicalDnUploadError" class="text-xs text-red-500 mt-1">
                  {{ physicalDnUploadError }}
                </p>
              </div>
            </div>

            <!-- Vendor Delivery Document (Read-only from DN) -->
            <div class="mt-4" v-if="formData.vendorDeliveryDocumentPath">
              <label class="form-label text-sm font-medium text-gray-600">
                Vendor Delivery Document (Vendor)
              </label>
              <div class="mt-2">
                <div
                  class="border border-gray-200 bg-gray-50 rounded-lg p-3 flex flex-col items-center justify-center min-h-[120px]"
                >
                  <div class="w-full h-full p-2 flex flex-col">
                    <iframe
                      v-if="formData.vendorDeliveryDocumentPath.includes('application/pdf') || formData.vendorDeliveryDocumentPath.toLowerCase().endsWith('.pdf')"
                      :src="formData.vendorDeliveryDocumentPath"
                      class="w-full h-[150px] border border-gray-200 rounded mb-2"
                    ></iframe>
                    <img
                      v-else
                      :src="formData.vendorDeliveryDocumentPath"
                      alt="Vendor Delivery Document"
                      class="max-w-full max-h-[150px] object-contain rounded mx-auto mb-2"
                    />
                    <div class="text-center">
                      <button
                        class="btn btn-sm btn-outline btn-primary"
                        @click.prevent="previewFile(formData.vendorDeliveryDocumentPath)"
                        title="Full Screen"
                      >
                        <i class="ki-duotone ki-maximize"></i> Full Screen
                      </button>
                    </div>
                  </div>
                </div>
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
            <strong>Received</strong>, <strong>Lot Number (Actual)</strong>,
            <strong>Condition Type</strong>, <strong>Repack Qty</strong>, and
            <strong>Damage Qty</strong> can be edited. Difference, More, and Less are calculated
            automatically.
          </p>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto list__table rounded-lg border border-gray-200">
          <table class="table table-xs align-middle text-gray-700 font-medium text-sm">
            <thead>
              <!-- First Header Row -->
              <tr>
                <th
                  rowspan="2"
                  class="!border-b-teal-500 !bg-teal-100 !text-teal-500 text-center border-r"
                >
                  No
                </th>
                <th
                  rowspan="2"
                  class="!border-b-teal-500 !bg-teal-100 !text-teal-500 text-center border-r"
                >
                  Lot Number
                </th>
                <th
                  rowspan="2"
                  class="!border-b-teal-500 !bg-teal-100 !text-teal-500 text-center border-r"
                >
                  SKU
                </th>
                <th
                  rowspan="2"
                  class="!border-b-teal-500 !bg-teal-100 !text-teal-500 text-center border-r"
                >
                  Description
                </th>
                <th
                  colspan="2"
                  class="!border-b-teal-500 !bg-teal-100 !text-teal-500 text-center border-r"
                >
                  LOT. NO
                </th>
                <th
                  colspan="3"
                  class="!border-b-teal-500 !bg-teal-100 !text-teal-500 text-center border-r"
                >
                  FG Receipt Confirmation
                </th>
                <th
                  colspan="2"
                  class="!border-b-teal-500 !bg-teal-100 !text-teal-500 text-center border-r"
                >
                  Loading Difference
                </th>
                <th
                  colspan="2"
                  class="!border-b-teal-500 !bg-teal-100 !text-teal-500 text-center border-r"
                >
                  Transporter Claim
                </th>
                <th
                  rowspan="2"
                  class="!border-b-teal-500 !bg-teal-100 !text-teal-500 text-center border-r min-w-[120px]"
                >
                  Condition Type
                </th>
                <th
                  rowspan="2"
                  class="!border-b-teal-500 !bg-teal-100 !text-teal-500 text-center border-r min-w-[160px]"
                >
                  Reject Reason
                  <span class="block text-xs font-normal">(required if less &gt; 0)</span>
                </th>
                <th
                  rowspan="2"
                  class="!border-b-teal-500 !bg-teal-100 !text-teal-500 text-center border-r min-w-[200px]"
                >
                  Evidence
                  <span class="block text-xs font-normal">(required if less &gt; 0)</span>
                </th>
              </tr>
              <!-- Second Header Row -->
              <tr>
                <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500 text-center border-r">
                  Delivery Note
                </th>
                <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500 text-center border-r">
                  Actual
                </th>
                <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500 text-center border-r">
                  Delivery Note
                </th>
                <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500 text-center border-r">
                  Received
                </th>
                <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500 text-center border-r">
                  Difference
                </th>
                <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500 text-center border-r">
                  More
                </th>
                <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500 text-center border-r">
                  Less
                </th>
                <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500 text-center border-r">
                  Repack Qty
                </th>
                <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500 text-center border-r">
                  Damage Qty
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="tableData.length === 0">
                <td colspan="14" class="text-center py-8">
                  <div class="text-gray-400">
                    <i class="ki-duotone ki-information text-3xl mb-2"></i>
                    <p>No data available. Search for a Delivery Note Number first.</p>
                  </div>
                </td>
              </tr>
              <tr v-for="(item, index) in tableData" :key="index">
                <td class="text-center">{{ index + 1 }}</td>
                <td>{{ item.lotNoDeliveryNote }}</td>
                <td>{{ item.sku }}</td>
                <td>{{ item.deskripsi }}</td>
                <td class="text-right">{{ item.lotNoDeliveryNote }}</td>
                <td class="text-center">
                  <input
                    v-model="item.lotNoActual"
                    type="text"
                    class="input input-sm w-28 text-center"
                    placeholder="Lot No"
                    :data-focus-key="`item-${index}-lot-no`"
                  />
                </td>
                <td class="text-right">{{ item.qtySuratJalan }}</td>
                <!-- Received - Editable -->
                <td class="text-center">
                  <input
                    v-model.number="item.qtyActual"
                    type="number"
                    min="0"
                    :max="item.qtySuratJalan"
                    class="input input-sm w-20 text-center"
                    :class="{
                      'border-red-500 bg-red-50': item.qtyActual > item.qtySuratJalan,
                    }"
                    :data-focus-key="`item-${index}-qty-received`"
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
                    :max="item.less"
                    class="input input-sm w-20 text-center"
                    :class="{
                      'border-red-500 bg-red-50':
                        item.less > 0 && item.repackQty + item.damageQty > item.less,
                    }"
                    @input="normalizeItemQuantities(index)"
                  />
                </td>
                <!-- Damage Qty - Editable -->
                <td class="text-center">
                  <input
                    v-model.number="item.damageQty"
                    type="number"
                    min="0"
                    :max="item.less"
                    class="input input-sm w-20 text-center"
                    :class="{
                      'border-red-500 bg-red-50':
                        item.less > 0 && item.repackQty + item.damageQty > item.less,
                    }"
                    @input="normalizeItemQuantities(index)"
                  />
                </td>
                <td class="text-center">
                  <input
                    v-model="item.conditionType"
                    type="text"
                    class="input input-sm w-28 text-center"
                    placeholder="Condition Type"
                    :data-focus-key="`item-${index}-condition-type`"
                  />
                </td>
                <!-- Reject Reason - Required when less > 0 -->
                <td class="text-center">
                  <template v-if="item.less > 0">
                    <input
                      v-model="item.rejectReason"
                      type="text"
                      class="input input-sm w-40"
                      :class="{ 'border-red-500 bg-red-50': !item.rejectReason.trim() }"
                      placeholder="Required *"
                      :data-focus-key="`item-${index}-reject-reason`"
                    />
                    <p v-if="!item.rejectReason.trim()" class="text-red-500 text-xs mt-1">
                      Reject reason is required
                    </p>
                  </template>
                  <span v-else class="text-gray-400 text-xs">—</span>
                </td>
                <!-- Evidence Upload - Required when less > 0 -->
                <td class="text-center p-2">
                  <template v-if="item.less > 0">
                    <div class="flex flex-col items-center">
                      <div v-if="!item.evidenceFile" class="w-full">
                        <button
                          class="btn btn-sm btn-outline btn-primary w-full text-xs py-1"
                          @click="triggerEvidenceUpload(index)"
                        >
                          <i class="ki-duotone ki-file-up"></i> Upload
                        </button>
                      </div>
                      <div
                        v-else
                        class="flex items-center justify-between bg-green-50 border border-green-200 rounded px-2 py-1 w-full mt-1"
                      >
                        <span
                          class="text-xs text-green-700 truncate max-w-[80px]"
                          :title="item.evidenceFile.name"
                        >
                          <i class="ki-duotone ki-check-circle mr-1"></i> Added
                        </span>
                        <div class="flex items-center">
                          <button
                            class="text-primary hover:text-blue-700 ml-1"
                            @click.prevent="previewFile(item.evidenceBase64)"
                            title="Preview"
                          >
                            <i class="ki-duotone ki-eye text-sm"></i>
                          </button>
                          <button
                            class="text-red-500 hover:text-red-700 ml-1"
                            @click.prevent="removeEvidence(index)"
                            title="Remove"
                          >
                            <i class="ki-duotone ki-cross text-sm"></i>
                          </button>
                        </div>
                      </div>
                      <input
                        :ref="(el) => (evidenceInputs[index] = el as HTMLInputElement)"
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        class="hidden"
                        @change="(e) => handleEvidenceChange(e, index)"
                      />
                    </div>
                  </template>
                  <span v-else class="text-gray-400 text-xs">—</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-between items-center gap-[8px] mt-[24px]">
        <button
          class="btn btn-outline btn-primary"
          :disabled="isSubmitting || !canSaveDraft"
          @click="submitForm(true)"
        >
          Save as Draft
          <i class="ki-duotone ki-bookmark"></i>
        </button>
        <div class="flex items-center justify-end gap-[8px]">
          <button class="btn btn-outline btn-primary" :disabled="isSubmitting" @click="goBack()">
            <i class="ki-filled ki-arrow-left"></i>
            Back
          </button>
          <button
            class="btn btn-primary"
            :disabled="isSubmitting || !canSubmit"
            @click="submitForm(false)"
          >
            Submit
            <i class="ki-duotone ki-paper-plane"></i>
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
import { useRouter } from 'vue-router'
import { type routeTypes } from '@/core/type/components/breadcrumb'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import VueSignature from 'vue3-signature'
import ModalNotification from '@/components/modal/ModalNotification.vue'
import DeliveryNotesService, { type DeliveryNotesData } from '@/services/deliveryNotes.service'
import ReceivingConfirmationService, {
  getReceivingConfirmationErrorMessage,
  type ReceivingConfirmationCreatePayload,
  type ReceivingConfirmationDetailPayload,
} from '@/services/receivingConfirmation.service'
import {
  getTodayDateString,
  isDateAfterToday,
  normalizeNonNegativeInt,
  validateReceivingItemQuantities,
  isBlank,
  validationFail,
  validationOk,
  focusValidationField,
  type FormValidationResult,
} from '@/utils/formValidators'

const router = useRouter()
const todayDateString = getTodayDateString()

// Interfaces
interface FormData {
  poNumber: string
  vendorID: string
  vendorName: string
  tripID: string
  DeliveryNoteNumber: string
  whCheckerName: string
  driverName: string
  licensePlate: string
  transporter: string
  truckType: string
  pickup: string
  destination: string
  receivedDate: string
  digitalSignaturePath: string | null
  vendorDeliveryDocumentPath?: string
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
  conditionType: string
  evidenceFile?: File | null
  evidenceBase64?: string
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
  vendorID: '',
  vendorName: '',
  tripID: '',
  DeliveryNoteNumber: '',
  whCheckerName: '',
  driverName: '',
  licensePlate: '',
  transporter: '',
  truckType: '',
  pickup: '',
  destination: '',
  receivedDate: todayDateString,
  digitalSignaturePath: null,
})

// ─── Physical Delivery Note Upload ──────────────────────────────────────────
const physicalDnFile = ref<File | null>(null)
const physicalDnInput = ref<HTMLInputElement | null>(null)
const physicalDnUploadError = ref<string>('')
const physicalDnBase64 = ref<string>('')

const triggerPhysicalDnUpload = () => {
  physicalDnInput.value?.click()
}

const handlePhysicalDnFile = (file: File) => {
  physicalDnUploadError.value = ''
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    physicalDnUploadError.value = 'File size exceeds 5MB limit.'
    return
  }
  const allowed = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg']
  if (!allowed.includes(file.type)) {
    physicalDnUploadError.value = 'Only PDF, PNG, JPG files are allowed.'
    return
  }
  physicalDnFile.value = file
  const reader = new FileReader()
  reader.onload = (e) => {
    physicalDnBase64.value = (e.target?.result as string) || ''
  }
  reader.readAsDataURL(file)
}

const handlePhysicalDnChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) handlePhysicalDnFile(input.files[0])
}

const handlePhysicalDnDrop = (event: DragEvent) => {
  const file = event.dataTransfer?.files[0]
  if (file) handlePhysicalDnFile(file)
}

const removePhysicalDn = () => {
  physicalDnFile.value = null
  physicalDnBase64.value = ''
  physicalDnUploadError.value = ''
  if (physicalDnInput.value) physicalDnInput.value.value = ''
}

// ─── File Preview Helper ──────────────────────────────────────────────────────
const previewFile = (urlOrBase64: string | undefined | null) => {
  if (!urlOrBase64) return
  if (urlOrBase64.startsWith('data:')) {
    const newWindow = window.open()
    if (newWindow) {
      if (urlOrBase64.startsWith('data:application/pdf')) {
        newWindow.document.write(
          `<iframe src="${urlOrBase64}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`,
        )
      } else {
        newWindow.document.write(`<img src="${urlOrBase64}" style="max-width:100%;" />`)
      }
    }
  } else {
    window.open(urlOrBase64, '_blank')
  }
}

// Table Data
const tableData = ref<TableDataItem[]>([])

// ─── Evidence Upload per Item ─────────────────────────────────────────────
const evidenceInputs = ref<(HTMLInputElement | null)[]>([])

const triggerEvidenceUpload = (index: number) => {
  if (evidenceInputs.value[index]) {
    evidenceInputs.value[index]?.click()
  }
}

const handleEvidenceChange = (event: Event, index: number) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      showValidationError(`File size exceeds 5MB limit for item #${index + 1}`)
      input.value = ''
      return
    }
    const allowed = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg']
    if (!allowed.includes(file.type)) {
      showValidationError(`Only PDF, PNG, JPG allowed for item #${index + 1}`)
      input.value = ''
      return
    }

    const item = tableData.value[index]
    item.evidenceFile = file
    const reader = new FileReader()
    reader.onload = (e) => {
      item.evidenceBase64 = (e.target?.result as string) || ''
    }
    reader.readAsDataURL(file)
  }
}

const removeEvidence = (index: number) => {
  const item = tableData.value[index]
  item.evidenceFile = null
  item.evidenceBase64 = ''
  if (evidenceInputs.value[index]) {
    evidenceInputs.value[index]!.value = ''
  }
}

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
  formData.value.vendorID = dn.vendorID ? String(dn.vendorID) : ''
  formData.value.vendorName = dn.vendorName || ''
  formData.value.tripID = dn.tripID || ''
  formData.value.DeliveryNoteNumber = dn.deliveryNoteNumber || ''
  formData.value.driverName = dn.driverName || ''
  formData.value.licensePlate = dn.licensePlate || ''
  formData.value.transporter = dn.transporter || ''
  formData.value.truckType = dn.truckType || ''
  formData.value.pickup = dn.pickupAddress || ''
  formData.value.destination = dn.destinationAddress || ''
  formData.value.vendorDeliveryDocumentPath = dn.vendorDeliveryDocumentPath || ''

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
      conditionType: '',
    }))
  } else {
    tableData.value = []
  }
}

const calculateDifference = (index: number) => {
  const item = tableData.value[index]
  item.qtyActual = normalizeNonNegativeInt(item.qtyActual)
  if (item.qtyActual > item.qtySuratJalan) {
    item.qtyActual = item.qtySuratJalan
  }

  const diff = item.qtyActual - item.qtySuratJalan
  item.qtySelisih = diff
  item.more = diff > 0 ? diff : 0
  item.less = diff < 0 ? Math.abs(diff) : 0

  normalizeItemQuantities(index)
}

const normalizeItemQuantities = (index: number) => {
  const item = tableData.value[index]
  item.repackQty = normalizeNonNegativeInt(item.repackQty)
  item.damageQty = normalizeNonNegativeInt(item.damageQty)

  if (item.less <= 0) {
    item.repackQty = 0
    item.damageQty = 0
    return
  }

  const total = item.repackQty + item.damageQty
  if (total > item.less) {
    const overflow = total - item.less
    if (item.damageQty >= overflow) {
      item.damageQty -= overflow
    } else {
      item.repackQty = Math.max(0, item.repackQty - overflow)
      item.damageQty = 0
    }
  }
}

const showValidationError = (text: string) => {
  notificationModal.value = {
    type: 'warning',
    title: 'Validation Error',
    text,
  }
  showNotificationModal.value = true
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

const validateForm = async (isDraft = false): Promise<boolean> => {
  trimFormTextFields()
  const result = getValidationResult(isDraft)
  if (!result.valid) {
    showValidationError(result.message!)
    await focusValidationField(result.focusKey)
    return false
  }
  return true
}

const trimFormTextFields = () => {
  formData.value.whCheckerName = formData.value.whCheckerName.trim()
  formData.value.tripID = formData.value.tripID.trim()
  formData.value.driverName = formData.value.driverName.trim()

  for (const item of tableData.value) {
    item.lotNoActual = item.lotNoActual.trim()
    item.rejectReason = item.rejectReason.trim()
    item.conditionType = item.conditionType.trim()
  }
}

const getValidationResult = (isDraft = false): FormValidationResult => {
  if (isBlank(formData.value.poNumber)) {
    return validationFail('Delivery Note wajib dipilih terlebih dahulu.', 'dn-search')
  }

  if (isBlank(formData.value.whCheckerName)) {
    return validationFail('Employee Name wajib diisi.', 'employee-name')
  }

  if (isBlank(formData.value.tripID)) {
    return validationFail('Trip ID wajib diisi.', 'trip-id')
  }

  if (isBlank(formData.value.driverName)) {
    return validationFail('Driver Name wajib diisi.', 'driver-name')
  }

  if (isBlank(formData.value.receivedDate)) {
    return validationFail('Received Date wajib diisi.', 'received-date')
  }

  if (isDateAfterToday(formData.value.receivedDate)) {
    return validationFail('Received Date tidak boleh melebihi tanggal hari ini.', 'received-date')
  }

  if (!isDraft && !physicalDnFile.value) {
    return validationFail('Physical Delivery Note Document wajib diupload.')
  }

  if (tableData.value.length === 0) {
    return validationFail('Tidak ada item untuk disubmit. Pilih Delivery Note yang memiliki item.')
  }

  for (let i = 0; i < tableData.value.length; i++) {
    const item = tableData.value[i]
    const qtyResult = validateReceivingItemQuantities(
      item.qtySuratJalan,
      item.qtyActual,
      item.damageQty,
      item.repackQty,
    )
    if (!qtyResult.valid && qtyResult.message) {
      return validationFail(`${qtyResult.message} (item #${i + 1})`, `item-${i}-qty-received`)
    }

    if (item.less > 0) {
      if (isBlank(item.rejectReason)) {
        return validationFail(
          `Reject Reason wajib diisi untuk item #${i + 1}.`,
          `item-${i}-reject-reason`,
        )
      }
      if (!isDraft && !item.evidenceBase64) {
        return validationFail(`Evidence document wajib diupload untuk item #${i + 1}.`)
      }
    }
  }

  if (!isDraft && signaturePad.value) {
    const saveResult = signaturePad.value.save()
    if (!saveResult || saveResult.trim().length === 0) {
      return validationFail('Signature wajib diisi.', 'signature')
    }
  }

  return validationOk()
}

const canSaveDraft = computed(() => getValidationResult(true).valid)
const canSubmit = computed(() => getValidationResult(false).valid)

const submitForm = async (isDraft = false) => {
  if (!(await validateForm(isDraft))) return

  isSubmitting.value = true

  try {
    let signatureData = ''
    if (signaturePad.value) {
      const saveResult = signaturePad.value.save()
      if (saveResult && saveResult.trim().length > 0) {
        signatureData = saveResult
      } else if (!isDraft) {
        showValidationError('Signature wajib diisi.')
        isSubmitting.value = false
        return
      }
    } else if (!isDraft) {
      isSubmitting.value = false
      return
    }

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
      conditionType: item.conditionType || undefined,
      evidencePath: item.evidenceBase64 || undefined,
    }))

    // Prepare payload
    const payload: ReceivingConfirmationCreatePayload = {
      poNumber: formData.value.poNumber,
      vendorID: formData.value.vendorID || undefined,
      vendorName: formData.value.vendorName || undefined,
      tripID: formData.value.tripID || undefined,
      DeliveryNoteNumber: formData.value.DeliveryNoteNumber || undefined,
      receivedDate: formData.value.receivedDate,
      whCheckerName: formData.value.whCheckerName,
      driverName: formData.value.driverName,
      pickup: formData.value.pickup || undefined,
      destination: formData.value.destination || undefined,
      transporter: formData.value.transporter || undefined,
      truckType: formData.value.truckType || undefined,
      licensePlate: formData.value.licensePlate || undefined,
      digitalSignaturePath: signatureData || '', // Always send, even if empty
      physicalDeliveryNotePath: physicalDnBase64.value || undefined,
      status: isDraft ? 'Draft' : 'Waiting Supervisor',
      items: items,
    }

    console.log('Submitting payload:', payload)
    console.log('Signature in payload:', payload.digitalSignaturePath ? 'YES' : 'NO (empty)')

    await ReceivingConfirmationService.create(payload)

    notificationModal.value = {
      type: 'success',
      title: 'Success',
      text: isDraft
        ? 'Receiving confirmation saved as draft successfully!'
        : 'Receiving confirmation submitted successfully!',
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
      text: getReceivingConfirmationErrorMessage(error),
    }
    showNotificationModal.value = true
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  formData.value.receivedDate = todayDateString
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

<template>
  <div>
    <div
      v-if="showActionLoading"
      class="fixed inset-0 bg-black/30 flex items-center justify-center z-[60]"
    >
      <div class="bg-white rounded-xl p-6 flex flex-col items-center gap-3 shadow-lg min-w-[200px]">
        <i class="ki-duotone ki-loading text-4xl text-primary animate-spin"></i>
        <p class="text-gray-700 font-medium m-0">{{ loadingMessage }}</p>
      </div>
    </div>

    <Breadcrumb title="Receiving Confirmation Detail" :routes="routes" />
    <hr class="-mx-[24px] mb-[24px]" />

    <div class="border border-gray-200 rounded-xl p-[24px]">
      <!-- Form Section -->
      <div class="border border-gray-200 rounded-xl p-[24px] mb-[24px]">
        <h3 class="text-lg font-semibold mb-4">Receiving Confirmation Information</h3>
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- Left and Middle Columns - Form Fields (8 columns) -->
          <div class="lg:col-span-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              <!-- Left Column -->
              <div class="space-y-3">
                <!-- Delivery Note Number -->
                <div class="flex items-center gap-3">
                  <label class="form-label text-sm font-medium text-gray-600 w-36 mb-0"
                    >Delivery Note Number</label
                  >
                  <input
                    v-model="formData.orderNo"
                    type="text"
                    class="input flex-1 bg-gray-50"
                    disabled
                  />
                </div>

                <!-- PO Number -->
                <div class="flex items-center gap-3">
                  <label class="form-label text-sm font-medium text-gray-600 w-36 mb-0"
                    >PO Number</label
                  >
                  <input
                    v-model="formData.poNumber"
                    type="text"
                    class="input flex-1 bg-gray-50"
                    disabled
                  />
                </div>

                <!-- Employee Name -->
                <div class="flex items-center gap-3">
                  <label class="form-label text-sm font-medium text-gray-600 w-36 mb-0"
                    >Employee Name</label
                  >
                  <input
                    v-model="formData.namaKaryawan"
                    type="text"
                    class="input flex-1"
                    :class="canEditDraft ? 'bg-white' : 'bg-gray-50'"
                    :disabled="!canEditDraft"
                  />
                </div>

                <!-- Vendor Name -->
                <div class="flex items-center gap-3">
                  <label class="form-label text-sm font-medium text-gray-600 w-36 mb-0"
                    >Vendor Name</label
                  >
                  <input
                    v-model="formData.vendorName"
                    type="text"
                    class="input flex-1 bg-gray-50"
                    disabled
                  />
                </div>

                <!-- Driver Name -->
                <div class="flex items-center gap-3">
                  <label class="form-label text-sm font-medium text-gray-600 w-36 mb-0"
                    >Driver Name</label
                  >
                  <input
                    v-model="formData.namaSopir"
                    type="text"
                    class="input flex-1"
                    :class="canEditDraft ? 'bg-white' : 'bg-gray-50'"
                    :disabled="!canEditDraft"
                  />
                </div>

                <!-- License Plate -->
                <div class="flex items-center gap-3">
                  <label class="form-label text-sm font-medium text-gray-600 w-36 mb-0"
                    >License Plate</label
                  >
                  <input
                    v-model="formData.noPolisi"
                    type="text"
                    class="input flex-1 bg-gray-50"
                    disabled
                  />
                </div>

                <!-- Transporter -->
                <div class="flex items-center gap-3">
                  <label class="form-label text-sm font-medium text-gray-600 w-36 mb-0"
                    >Transporter</label
                  >
                  <input
                    v-model="formData.transporter"
                    type="text"
                    class="input flex-1 bg-gray-50"
                    disabled
                  />
                </div>
              </div>

              <!-- Right Column -->
              <div class="space-y-3">
                <!-- Pickup -->
                <div class="flex items-center gap-3">
                  <label class="form-label text-sm font-medium text-gray-600 w-36 mb-0"
                    >Pickup</label
                  >
                  <input
                    v-model="formData.pickup"
                    type="text"
                    class="input flex-1 bg-gray-50"
                    disabled
                  />
                </div>

                <!-- Destination -->
                <div class="flex items-center gap-3">
                  <label class="form-label text-sm font-medium text-gray-600 w-36 mb-0"
                    >Destination</label
                  >
                  <input
                    v-model="formData.destination"
                    type="text"
                    class="input flex-1 bg-gray-50"
                    disabled
                  />
                </div>

                <!-- Order Date -->
                <div class="flex items-center gap-3">
                  <label class="form-label text-sm font-medium text-gray-600 w-36 mb-0"
                    >Order Date</label
                  >
                  <input
                    v-model="formData.orderDate"
                    type="text"
                    class="input flex-1 bg-gray-50"
                    disabled
                  />
                </div>

                <!-- Received Date -->
                <div class="flex items-center gap-3">
                  <label class="form-label text-sm font-medium text-gray-600 w-36 mb-0"
                    >Received Date</label
                  >
                  <input
                    v-model="formData.receivedDate"
                    type="date"
                    class="input flex-1"
                    :class="canEditDraft ? 'bg-white' : 'bg-gray-50'"
                    :disabled="!canEditDraft"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column - Signature and Documents (4 columns) -->
          <div class="lg:col-span-4 flex flex-col gap-4">
            <div class="border border-gray-200 rounded-lg p-4 flex flex-col">
              <h3 class="text-sm font-semibold mb-3">Employee Signature</h3>
              <div class="signature-display">
                <img
                  v-if="formData.signature && formData.signature.trim()"
                  :src="formData.signature"
                  alt="Signature"
                  class="signature-image"
                />
                <span v-else class="text-gray-400 text-sm">No signature available</span>
              </div>
            </div>

            <!-- Physical Delivery Note -->
            <div class="border border-gray-200 rounded-lg p-4 flex flex-col">
              <h3 class="text-sm font-semibold mb-3">Vendor Delivery Document (Warehouse)</h3>
              <div
                class="flex-1 border border-gray-300 rounded bg-gray-50 flex flex-col items-center justify-center min-h-[120px]"
              >
                <div
                  v-if="formData.physicalDeliveryNotePath"
                  class="text-center w-full h-full p-2 flex flex-col"
                >
                  <iframe
                    v-if="
                      formData.physicalDeliveryNotePath.includes('application/pdf') ||
                      formData.physicalDeliveryNotePath.toLowerCase().endsWith('.pdf')
                    "
                    :src="formData.physicalDeliveryNotePath"
                    class="w-full h-[150px] border border-gray-200 rounded mb-2"
                  ></iframe>
                  <img
                    v-else
                    :src="formData.physicalDeliveryNotePath"
                    alt="Physical Delivery Note"
                    class="max-w-full max-h-[150px] object-contain rounded mx-auto mb-2"
                  />
                  <div>
                    <button
                      class="btn btn-sm btn-outline btn-primary"
                      @click.prevent="previewFile(formData.physicalDeliveryNotePath)"
                    >
                      <i class="ki-duotone ki-eye"></i> Full Screen
                    </button>
                  </div>
                </div>
                <span v-else class="text-gray-400 text-sm">No document uploaded</span>
              </div>
            </div>

            <!-- Vendor Delivery Document -->
            <div class="border border-gray-200 rounded-lg p-4 flex flex-col">
              <h3 class="text-sm font-semibold mb-3">Vendor Delivery Document (Vendor)</h3>
              <div
                class="flex-1 border border-gray-300 rounded bg-gray-50 flex flex-col items-center justify-center min-h-[120px]"
              >
                <div
                  v-if="formData.vendorDeliveryDocumentPath"
                  class="text-center w-full h-full p-2 flex flex-col"
                >
                  <iframe
                    v-if="
                      formData.vendorDeliveryDocumentPath.includes('application/pdf') ||
                      formData.vendorDeliveryDocumentPath.toLowerCase().endsWith('.pdf')
                    "
                    :src="formData.vendorDeliveryDocumentPath"
                    class="w-full h-[150px] border border-gray-200 rounded mb-2"
                  ></iframe>
                  <img
                    v-else
                    :src="formData.vendorDeliveryDocumentPath"
                    alt="Vendor Delivery Document"
                    class="max-w-full max-h-[150px] object-contain rounded mx-auto mb-2"
                  />
                  <div>
                    <button
                      class="btn btn-sm btn-outline btn-primary"
                      @click.prevent="previewFile(formData.vendorDeliveryDocumentPath)"
                    >
                      <i class="ki-duotone ki-eye"></i> Full Screen
                    </button>
                  </div>
                </div>
                <span v-else class="text-gray-400 text-sm">No document uploaded</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Table Section -->
      <div class="border border-gray-200 rounded-xl p-[24px]">
        <h3 class="text-lg font-semibold mb-4">List Receiving Confirmation Request</h3>
        <div class="overflow-x-auto list__table">
          <table class="table align-middle text-gray-700 font-medium text-sm">
            <thead>
              <!-- First Header Row -->
              <tr class="bg-teal-500 text-white">
                <th rowspan="2" class="text-center border-r">Action</th>
                <th rowspan="2" class="text-center border-r">Lot Number</th>
                <th rowspan="2" class="text-center border-r">SKU Description</th>
                <th colspan="2" class="text-center border-r">LOT. NO</th>
                <th colspan="3" class="text-center border-r">FG Receipt Confirmation</th>
                <th colspan="2" class="text-center border-r">Loading Difference</th>
                <th colspan="2" class="text-center border-r">Transporter Claim</th>
                <th rowspan="2" class="text-center border-r min-w-[120px]">Condition Type</th>
                <th rowspan="2" class="text-center border-r min-w-[160px]">Reject Reason</th>
                <th rowspan="2" class="text-center border-r min-w-[120px]">
                  Evidence
                  <span class="block text-xs font-normal">(required if difference &ne; 0)</span>
                </th>
              </tr>
              <!-- Second Header Row -->
              <tr class="bg-teal-500 text-white">
                <th class="text-center border-r">Delivery Note</th>
                <th class="text-center border-r">Actual</th>
                <th class="text-center border-r">Delivery Note</th>
                <th class="text-center border-r">Received</th>
                <th class="text-center border-r">Difference</th>
                <th class="text-center border-r">More</th>
                <th class="text-center border-r">Less</th>
                <th class="text-center border-r">Repack Qty</th>
                <th class="text-center border-r">Damage Qty</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="tableData.length === 0">
                <td colspan="16" class="text-center">No data available</td>
              </tr>
              <tr v-for="(item, index) in tableData" :key="index">
                <td class="text-center border-r">
                  <button
                    class="btn btn-outline btn-icon btn-primary w-[32px] h-[32px]"
                    @click="viewItem(index)"
                    title="View Details"
                  >
                    <i class="ki-filled ki-eye !text-lg"></i>
                  </button>
                </td>
                <td>{{ item.lotNo }}</td>
                <td>{{ item.description }}</td>
                <td class="text-right">{{ item.diSuratJalan }}</td>
                <td class="text-right">{{ item.actual }}</td>
                <td class="text-right">{{ item.diSuratJalanKonfirmasi }}</td>
                <td class="text-right">
                  <input
                    v-if="canEditDraft"
                    v-model.number="item.diterima"
                    type="number"
                    min="0"
                    :max="item.diSuratJalanKonfirmasi"
                    class="input input-sm w-20 text-center"
                    :class="{
                      'border-red-500 bg-red-50':
                        item.diterima > item.diSuratJalanKonfirmasi,
                    }"
                    @input="calculateItem(index)"
                  />
                  <span v-else>{{ item.diterima }}</span>
                </td>
                <td class="text-right">{{ item.selisih }}</td>
                <td class="text-right">{{ item.lebih }}</td>
                <td class="text-right">{{ item.kurang }}</td>
                <td class="text-right">
                  <input
                    v-if="canEditDraft"
                    v-model.number="item.repackQty"
                    type="number"
                    min="0"
                    :max="item.kurang"
                    class="input input-sm w-20 text-center"
                    :class="{
                      'border-red-500 bg-red-50':
                        item.kurang > 0 && item.repackQty + item.damageQty > item.kurang,
                    }"
                    @input="normalizeItemQuantities(index)"
                  />
                  <span v-else>{{ item.repackQty }}</span>
                </td>
                <td class="text-right">
                  <input
                    v-if="canEditDraft"
                    v-model.number="item.damageQty"
                    type="number"
                    min="0"
                    :max="item.kurang"
                    class="input input-sm w-20 text-center"
                    :class="{
                      'border-red-500 bg-red-50':
                        item.kurang > 0 && item.repackQty + item.damageQty > item.kurang,
                    }"
                    @input="normalizeItemQuantities(index)"
                  />
                  <span v-else>{{ item.damageQty }}</span>
                </td>
                <td class="text-center">
                  <input
                    v-if="canEditDraft"
                    v-model="item.conditionType"
                    type="text"
                    class="input input-sm w-28 text-center"
                    placeholder="Condition Type"
                  />
                  <span v-else>{{ item.conditionType || '—' }}</span>
                </td>
                <td class="text-left">
                  <template v-if="canEditDraft && item.kurang > 0">
                    <input
                      v-model="item.rejectReason"
                      type="text"
                      class="input input-sm w-40"
                      :class="{ 'border-red-500 bg-red-50': !item.rejectReason.trim() }"
                      placeholder="Required *"
                    />
                    <p v-if="!item.rejectReason.trim()" class="text-red-500 text-xs mt-1">
                      Reject reason is required
                    </p>
                  </template>
                  <span v-else-if="item.rejectReason" class="text-red-600 font-medium">
                    {{ item.rejectReason }}
                  </span>
                  <span v-else class="text-gray-400 text-xs">—</span>
                </td>
                <td class="text-center p-2">
                  <template v-if="canEditDraft">
                    <div class="flex flex-col items-center min-w-[120px]">
                      <div v-if="!hasEvidence(item)" class="w-full">
                        <button
                          class="btn btn-sm btn-outline btn-primary w-full text-xs py-1"
                          :class="{
                            'border-red-500 text-red-600':
                              hasQuantityDiscrepancy(item) && !hasEvidence(item),
                          }"
                          @click="triggerEvidenceUpload(index)"
                        >
                          <i class="ki-duotone ki-file-up"></i>
                          {{ hasQuantityDiscrepancy(item) ? 'Upload *' : 'Upload' }}
                        </button>
                        <p
                          v-if="hasQuantityDiscrepancy(item) && !hasEvidence(item)"
                          class="text-red-500 text-xs mt-1"
                        >
                          Evidence is required
                        </p>
                      </div>
                      <div v-else class="flex flex-col items-center gap-1 w-full">
                        <div class="evidence-preview-box relative group">
                          <iframe
                            v-if="isPdfEvidence(item.evidencePath)"
                            :src="item.evidencePath"
                            class="w-full h-full border-0"
                          ></iframe>
                          <img
                            v-else
                            :src="item.evidencePath"
                            alt="Evidence"
                            class="w-full h-full object-contain"
                          />
                          <div
                            class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <button
                              class="btn btn-sm btn-icon btn-primary"
                              @click.prevent="previewFile(item.evidencePath)"
                              title="Full Screen"
                            >
                              <i class="ki-duotone ki-maximize"></i>
                            </button>
                          </div>
                        </div>
                        <div class="flex items-center justify-center gap-1">
                          <button
                            class="btn btn-xs btn-outline btn-primary"
                            @click="triggerEvidenceUpload(index)"
                            title="Replace"
                          >
                            <i class="ki-duotone ki-arrows-circle"></i>
                          </button>
                          <button
                            class="btn btn-xs btn-outline btn-danger"
                            @click.prevent="removeEvidence(index)"
                            title="Remove"
                          >
                            <i class="ki-duotone ki-trash"></i>
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
                  <template v-else-if="item.evidencePath">
                    <div class="evidence-preview-box relative group">
                      <iframe
                        v-if="isPdfEvidence(item.evidencePath)"
                        :src="item.evidencePath"
                        class="w-full h-full border-0"
                      ></iframe>
                      <img
                        v-else
                        :src="item.evidencePath"
                        alt="Evidence"
                        class="w-full h-full object-contain"
                      />
                      <div
                        class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <button
                          class="btn btn-sm btn-icon btn-primary"
                          @click.prevent="previewFile(item.evidencePath)"
                          title="Full Screen"
                        >
                          <i class="ki-duotone ki-maximize"></i>
                        </button>
                      </div>
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
        <div></div>
        <div class="flex items-center justify-end gap-[8px]">
          <button
            class="btn btn-outline btn-primary"
            :disabled="showActionLoading"
            @click="goBack()"
          >
            <i class="ki-filled ki-arrow-left"></i>
            Back
          </button>

          <template v-if="canEditDraft">
            <button
              class="btn btn-primary"
              @click="updateConfirmation()"
              :disabled="showActionLoading"
            >
              <span v-if="isSubmitting" class="inline-flex items-center gap-2">
                <i class="ki-duotone ki-loading animate-spin"></i>
                Submitting...
              </span>
              <template v-else>
                Submit
                <i class="ki-duotone ki-paper-plane"></i>
              </template>
            </button>
          </template>

          <template v-if="isWaitingApproval && canApprove">
            <button
              class="btn btn-danger"
              :disabled="showActionLoading"
              @click="openRejectModal()"
            >
              <i class="ki-duotone ki-cross-circle"></i>
              Reject
            </button>
            <button
              class="btn btn-primary"
              :disabled="showActionLoading"
              @click="openApproveModal()"
            >
              <i class="ki-duotone ki-check-circle"></i>
              Approve
            </button>
          </template>

          <template v-if="isCompleted">
            <button class="btn btn-primary" @click="showPrintView = true">
              Print to PDF
              <i class="ki-duotone ki-printer"></i>
            </button>
          </template>
        </div>
      </div>

      <!-- Rejection Modal -->
      <div
        v-if="showRejectModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click.self="!isRejecting && closeRejectModal()"
      >
        <div class="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 class="text-lg font-semibold mb-4">Rejection Reason</h3>
          <div class="mb-4">
            <label class="form-label text-sm font-medium text-gray-600 mb-2"
              >Please provide a reason for rejection</label
            >
            <textarea
              v-model="rejectionReason"
              class="input w-full h-32 resize-none p-3"
              placeholder="Please enter the reason for rejection..."
              :disabled="isRejecting"
            ></textarea>
          </div>
          <div class="flex gap-3 justify-end">
            <button class="btn btn-light" :disabled="isRejecting" @click="closeRejectModal()">
              Cancel
            </button>
            <button class="btn btn-danger" :disabled="isRejecting" @click="confirmReject()">
              <span v-if="isRejecting" class="inline-flex items-center gap-2">
                <i class="ki-duotone ki-loading animate-spin"></i>
                Rejecting...
              </span>
              <template v-else>Confirm Reject</template>
            </button>
          </div>
        </div>
      </div>
    </div>

    <ModalConfirmation
      :open="showApproveModal"
      id="approve-receiving-confirmation-modal"
      type="confirm"
      title="Approve Receiving Confirmation"
      :text="approveConfirmText"
      submit-button-text="Approve"
      cancel-button-text="Cancel"
      :loading="isApproving"
      @submit="confirmApprove"
      @cancel="closeApproveModal"
    />

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

    <!-- ── Print Invoice Overlay ─────────────────────────────────── -->
    <div v-if="showPrintView" class="print-invoice-overlay">
      <div class="print-invoice-container">
        <ReceivingConfirmationPrint
          :form-data="formData"
          :table-data="tableData"
          :current-status="currentStatus"
          @close="showPrintView = false"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { type routeTypes } from '@/core/type/components/breadcrumb'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import ReceivingConfirmationService, {
  getReceivingConfirmationErrorMessage,
  type ReceivingConfirmationCreatePayload,
  type ReceivingConfirmationDetailPayload,
} from '@/services/receivingConfirmation.service'
import DeliveryNotesService from '@/services/deliveryNotes.service'
import ModalNotification from '@/components/modal/ModalNotification.vue'
import ModalConfirmation from '@/components/modal/ModalConfirmation.vue'
import { useLoginStore } from '@/stores/views/login'
import { isRouteAllowed } from '@/core/utils/routeAccess'
import ReceivingConfirmationPrint from './ReceivingConfirmationPrint.vue'
import {
  normalizeNonNegativeInt,
  validateReceivingItemQuantities,
} from '@/utils/formValidators'

const router = useRouter()
const route = useRoute()
const loginStore = useLoginStore()

// Only profile 3185 (WH Approver) can approve / reject
const canApprove = computed(() => loginStore.userData?.profile?.profileId === 3185)
const canCreate = computed(() =>
  isRouteAllowed('receivingConfirmationCreate', loginStore.userData),
)

interface FormData {
  orderNo: string
  poNumber: string
  vendorID: string
  vendorName: string
  tripID: string
  namaKaryawan: string
  namaSopir: string
  noPolisi: string
  transporter: string
  truckType: string
  pickup: string
  destination: string
  orderDate: string
  receivedDate: string
  signature: string | null
  driverSignature: string | null
  physicalDeliveryNotePath?: string
  vendorDeliveryDocumentPath?: string
}

interface TableData {
  id: number
  pickSlip: string
  sku: string
  description: string
  lotNo: string
  diSuratJalan: number
  actual: number
  diSuratJalanKonfirmasi: number
  diterima: number
  selisih: number
  lebih: number
  kurang: number
  repackQty: number
  damageQty: number
  rejectReason: string
  conditionType: string
  evidencePath?: string
  evidenceFile?: File | null
}

const routes = ref<routeTypes[]>([
  {
    name: 'Digital Receiving Confirmation',
    to: '/digital-receiving-confirmation',
  },
])

// Form Data (Read-only)
const formData = ref<FormData>({
  orderNo: '',
  poNumber: '',
  vendorID: '',
  vendorName: '',
  tripID: '',
  namaKaryawan: '',
  namaSopir: '',
  noPolisi: '',
  transporter: '',
  truckType: '',
  pickup: '',
  destination: '',
  orderDate: '',
  receivedDate: '',
  signature: null,
  driverSignature: null,
})

// Table Data — populated from API in onMounted
const tableData = ref<TableData[]>([])

// Evidence upload refs for draft edit mode
const evidenceInputs = ref<(HTMLInputElement | null)[]>([])

const hasQuantityDiscrepancy = (item: TableData) => item.selisih !== 0

const hasEvidence = (item: TableData) => Boolean(item.evidencePath?.trim())

const isPdfEvidence = (path: string | undefined) => {
  if (!path) return false
  return path.includes('application/pdf') || path.toLowerCase().endsWith('.pdf')
}

const triggerEvidenceUpload = (index: number) => {
  evidenceInputs.value[index]?.click()
}

const showValidationError = (text: string) => {
  notificationModal.value = {
    type: 'warning',
    title: 'Validation Error',
    text,
  }
  showNotificationModal.value = true
}

const handleEvidenceChange = (event: Event, index: number) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.[0]) return

  const file = input.files[0]
  const maxSize = 5 * 1024 * 1024
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
    item.evidencePath = (e.target?.result as string) || ''
  }
  reader.readAsDataURL(file)
}

const removeEvidence = (index: number) => {
  const item = tableData.value[index]
  item.evidenceFile = null
  item.evidencePath = ''
  if (evidenceInputs.value[index]) {
    evidenceInputs.value[index]!.value = ''
  }
}

// Rejection Modal State
const showRejectModal = ref<boolean>(false)
const rejectionReason = ref<string>('')
const showApproveModal = ref<boolean>(false)
const isApproving = ref<boolean>(false)
const isRejecting = ref<boolean>(false)
const currentStatus = ref<string>('')
const hasDiscrepancy = ref<boolean>(false)
const isSubmitting = ref<boolean>(false)
const showActionLoading = computed(
  () => isSubmitting.value || isApproving.value || isRejecting.value,
)
const loadingMessage = computed(() => {
  if (isRejecting.value) return 'Rejecting...'
  if (isApproving.value) return 'Approving...'
  return 'Submitting...'
})
const deliveryNoteInfo = ref({
  deliveryNoteNumber: '',
  tripID: '',
  poNumber: '',
  vendorName: '',
  vendorId: undefined as number | undefined,
  vendorCode: '',
})

// Modal state
const showNotificationModal = ref<boolean>(false)
const showPrintView = ref<boolean>(false)
const notificationModal = ref({
  type: 'info' as 'info' | 'success' | 'error' | 'warning',
  title: '',
  text: '',
})

const isDraft = computed(() => currentStatus.value === 'Draft')
const canEditDraft = computed(() => isDraft.value && canCreate.value)
const isWaitingApproval = computed(() =>
  ['Waiting Supervisor', 'Waiting Approval'].includes(currentStatus.value),
)
const isCompleted = computed(() => currentStatus.value === 'Completed')

const approveConfirmText = computed(() =>
  hasDiscrepancy.value
    ? 'This receiving confirmation has quantity discrepancy. Are you sure you want to approve it?'
    : 'Are you sure you want to approve this receiving confirmation?',
)

// Functions
const goBack = () => {
  router.push({ name: 'receivingConfirmationList' })
}

const viewItem = (index: number) => {
  const item = tableData.value[index]
  console.log('Viewing item:', item)
  notificationModal.value = {
    type: 'info',
    title: 'Item Details',
    text: `${item.pickSlip} - ${item.description}`,
  }
  showNotificationModal.value = true
}

const calculateItem = (index: number) => {
  const item = tableData.value[index]
  const qtySuratJalan = Number(item.diSuratJalanKonfirmasi) || 0
  let qtyActual = normalizeNonNegativeInt(item.diterima)

  if (qtyActual > qtySuratJalan) {
    qtyActual = qtySuratJalan
  }

  item.diterima = qtyActual
  item.actual = qtyActual

  const diff = qtyActual - qtySuratJalan
  item.selisih = diff
  item.lebih = diff > 0 ? diff : 0
  item.kurang = diff < 0 ? Math.abs(diff) : 0

  if (item.kurang === 0) {
    item.rejectReason = ''
  }

  normalizeItemQuantities(index)
}

const normalizeItemQuantities = (index: number) => {
  const item = tableData.value[index]
  item.repackQty = normalizeNonNegativeInt(item.repackQty)
  item.damageQty = normalizeNonNegativeInt(item.damageQty)

  if (item.kurang <= 0) {
    item.repackQty = 0
    item.damageQty = 0
    return
  }

  const total = item.repackQty + item.damageQty
  if (total > item.kurang) {
    const overflow = total - item.kurang
    if (item.damageQty >= overflow) {
      item.damageQty -= overflow
    } else {
      item.repackQty = Math.max(0, item.repackQty - overflow)
      item.damageQty = 0
    }
  }
}

const validateUpdateForm = (): boolean => {
  if (!canEditDraft.value) {
    notificationModal.value = {
      type: 'warning',
      title: 'Validation Error',
      text: !canCreate.value
        ? 'You do not have permission to edit receiving confirmation'
        : 'Receiving confirmation can only be updated while status is Draft',
    }
    showNotificationModal.value = true
    return false
  }

  if (!formData.value.namaKaryawan.trim()) {
    notificationModal.value = {
      type: 'warning',
      title: 'Validation Error',
      text: 'Please enter Employee Name',
    }
    showNotificationModal.value = true
    return false
  }

  if (!formData.value.namaSopir.trim()) {
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
      text: 'No items to submit',
    }
    showNotificationModal.value = true
    return false
  }

  const itemsMissingReason = tableData.value.filter(
    (item) => item.kurang > 0 && !item.rejectReason.trim(),
  )
  if (itemsMissingReason.length > 0) {
    notificationModal.value = {
      type: 'warning',
      title: 'Validation Error',
      text: `Please fill in the Reject Reason for ${itemsMissingReason.length} item(s) with shortage quantity.`,
    }
    showNotificationModal.value = true
    return false
  }

  for (let i = 0; i < tableData.value.length; i++) {
    const item = tableData.value[i]
    const qtyResult = validateReceivingItemQuantities(
      item.diSuratJalanKonfirmasi,
      item.diterima,
      item.damageQty,
      item.repackQty,
    )
    if (!qtyResult.valid && qtyResult.message) {
      notificationModal.value = {
        type: 'warning',
        title: 'Validation Error',
        text: `${qtyResult.message} (item #${i + 1})`,
      }
      showNotificationModal.value = true
      return false
    }

    if (hasQuantityDiscrepancy(item) && !hasEvidence(item)) {
      notificationModal.value = {
        type: 'warning',
        title: 'Validation Error',
        text: `Evidence document is required for item #${i + 1} with quantity difference.`,
      }
      showNotificationModal.value = true
      return false
    }
  }

  return true
}

const buildUpdatePayload = (): ReceivingConfirmationCreatePayload => {
  const items: ReceivingConfirmationDetailPayload[] = tableData.value.map((item) => ({
    sku: item.sku,
    deskripsi: item.description,
    noPickSlip: item.pickSlip,
    lotNo: item.lotNo,
    qtySuratJalan: item.diSuratJalanKonfirmasi,
    qtyActual: item.diterima,
    repackQty: item.repackQty,
    damageQty: item.damageQty,
    rejectReason: item.rejectReason.trim() || undefined,
    conditionType: item.conditionType.trim() || undefined,
    evidencePath: item.evidencePath?.trim() || undefined,
  }))

  return {
    poNumber: formData.value.poNumber,
    vendorID: formData.value.vendorID || undefined,
    vendorName: formData.value.vendorName || undefined,
    tripID: formData.value.tripID || undefined,
    DeliveryNoteNumber: formData.value.orderNo || undefined,
    receivedDate: formData.value.receivedDate,
    whCheckerName: formData.value.namaKaryawan,
    driverName: formData.value.namaSopir,
    pickup: formData.value.pickup || undefined,
    destination: formData.value.destination || undefined,
    transporter: formData.value.transporter || undefined,
    truckType: formData.value.truckType || undefined,
    licensePlate: formData.value.noPolisi || undefined,
    digitalSignaturePath: formData.value.signature || undefined,
    items,
  }
}

const updateConfirmation = async () => {
  if (!validateUpdateForm()) return

  isSubmitting.value = true

  try {
    await ReceivingConfirmationService.update(Number(route.params.id), buildUpdatePayload())

    notificationModal.value = {
      type: 'success',
      title: 'Success',
      text: 'Receiving confirmation updated and submitted for approval!',
    }
    showNotificationModal.value = true

    await new Promise((resolve) => setTimeout(resolve, 1500))
    router.push({ name: 'receivingConfirmationList' })
  } catch (error) {
    console.error('Error updating receiving confirmation:', error)
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

const openRejectModal = () => {
  showRejectModal.value = true
  rejectionReason.value = ''
}

const closeRejectModal = () => {
  if (isRejecting.value) return
  showRejectModal.value = false
  rejectionReason.value = ''
}

const openApproveModal = () => {
  showApproveModal.value = true
}

const closeApproveModal = () => {
  if (isApproving.value) return
  showApproveModal.value = false
}

const confirmApprove = async () => {
  if (isApproving.value) return
  isApproving.value = true

  try {
    const success = await approveConfirmation()
    if (success) {
      closeApproveModal()
    }
  } finally {
    isApproving.value = false
  }
}



const confirmReject = async () => {
  if (isRejecting.value) return

  // Validate rejection reason
  if (!rejectionReason.value.trim()) {
    notificationModal.value = {
      type: 'error',
      title: 'Error',
      text: 'Please provide a rejection reason',
    }
    showNotificationModal.value = true
    return
  }

  console.log('Form Data:', formData.value)
  console.log('Table Data:', tableData.value)
  console.log('Rejection Reason:', rejectionReason.value)

  isRejecting.value = true

  try {
    // Send rejection data to API with status "Rejected"
    await ReceivingConfirmationService.updateStatus(Number(route.params.id), {
      reportID: Number(route.params.id),
      status: 3, // Rejected = 3 (from enum)
      generalRejectReason: rejectionReason.value,
    })

    notificationModal.value = {
      type: 'success',
      title: 'Rejected!',
      text: `Receiving confirmation rejected!\nReason: ${rejectionReason.value}`,
    }
    showNotificationModal.value = true

    // Wait for modal to be acknowledged before redirecting
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Close modal and redirect
    closeRejectModal()
    router.push({ name: 'receivingConfirmationList' })
  } catch (error) {
    console.error('Error rejecting receiving confirmation:', error)
    notificationModal.value = {
      type: 'error',
      title: 'Error',
      text: 'Failed to reject receiving confirmation',
    }
    showNotificationModal.value = true
  } finally {
    isRejecting.value = false
  }
}

const approveConfirmation = async (): Promise<boolean> => {
  try {
    await ReceivingConfirmationService.updateStatus(Number(route.params.id), {
      reportID: Number(route.params.id),
      status: 2, // Completed = 2 (from enum)
      generalRejectReason: '',
    })
  } catch (error) {
    console.error('Error approving receiving confirmation:', error)
    notificationModal.value = {
      type: 'error',
      title: 'Error',
      text: 'Failed to approve receiving confirmation',
    }
    showNotificationModal.value = true
    return false
  }

  notificationModal.value = {
    type: 'success',
    title: 'Approved!',
    text: hasDiscrepancy.value
      ? 'Receiving confirmation approved with partial received. A notification has been created.'
      : 'Receiving confirmation approved successfully!',
  }
  showNotificationModal.value = true

  await new Promise((resolve) => setTimeout(resolve, 1500))
  router.push({ name: 'receivingConfirmation' })
  return true
}

onMounted(() => {
  const id = route.params.id
  console.log('Loading receiving confirmation with ID:', id)

  // Load data from API
  ReceivingConfirmationService.getDetail(Number(id))
    .then((data) => {
      if (data) {
        // Map API response to FormData structure
        formData.value = {
          orderNo: data.deliveryNoteNumber || '',
          poNumber: data.poNumber || '',
          vendorID: data.vendorID ? String(data.vendorID) : '',
          vendorName: data.vendorName || '',
          tripID: data.tripID || '',
          namaKaryawan: data.whCheckerName || '',
          namaSopir: data.driverName || '',
          noPolisi: data.licensePlate || '',
          transporter: data.transporter || '',
          truckType: data.truckType || '',
          pickup: data.pickup || '',
          destination: data.destination || '',
          orderDate: data.receivedDate
            ? new Date(data.receivedDate).toISOString().split('T')[0]
            : '',
          receivedDate: data.receivedDate
            ? new Date(data.receivedDate).toISOString().split('T')[0]
            : '',
          signature: data.digitalSignaturePath || null,
          driverSignature: data.driverSignature || null,
          physicalDeliveryNotePath: data.physicalDeliveryNotePath,
          vendorDeliveryDocumentPath: data.vendorDeliveryDocumentPath,
        }

        // Set current status and discrepancy info
        currentStatus.value = data.status || ''
        hasDiscrepancy.value = data.hasDiscrepancy || false
        deliveryNoteInfo.value = {
          deliveryNoteNumber: data.deliveryNoteNumber || '',
          tripID: data.tripID || '',
          poNumber: data.poNumber || '',
          vendorName: data.vendorName || '',
          vendorId: data.vendorID ? Number(data.vendorID) : undefined,
          vendorCode: data.vendorCode || '',
        }

        // Map API items to TableData structure
        tableData.value = data.items.map((item) => ({
          id: item.id,
          pickSlip: item.noPickSlip || '',
          sku: item.sku || '',
          description: item.deskripsi || '',
          lotNo: item.lotNo || '',
          diSuratJalan: item.qtySuratJalan || 0,
          actual: item.qtyActual || 0,
          diSuratJalanKonfirmasi: item.qtySuratJalan || 0,
          diterima: item.qtyActual || 0,
          selisih: item.qtySelisih || 0,
          lebih: item.qtySelisih > 0 ? item.qtySelisih : 0,
          kurang: item.qtySelisih < 0 ? Math.abs(item.qtySelisih) : 0,
          repackQty: item.repackQty || 0,
          damageQty: item.damageQty || 0,
          rejectReason: item.rejectReason || '',
          conditionType: item.conditionType || '',
          evidencePath: item.evidencePath,
        }))
      }
    })
    .catch((error) => {
      console.error('Error loading receiving confirmation:', error)
      notificationModal.value = {
        type: 'error',
        title: 'Error',
        text: 'Failed to load receiving confirmation data',
      }
      showNotificationModal.value = true
    })
})

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
</script>

<style lang="scss" scoped>
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

.signature-display {
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 160px;
  padding: 0.75rem;
  overflow: hidden;
}

.signature-image {
  max-width: 100%;
  max-height: 240px;
  width: auto;
  height: auto;
  object-fit: contain;
}

.evidence-preview-box {
  width: 100px;
  height: 100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  overflow: hidden;
  background: #f9fafb;
}
</style>

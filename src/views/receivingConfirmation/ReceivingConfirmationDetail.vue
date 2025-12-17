<template>
  <div>
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
                <!-- Order No -->
                <div class="flex items-center gap-3">
                  <label class="form-label text-sm font-medium text-gray-600 w-36 mb-0"
                    >Order No</label
                  >
                  <input
                    v-model="formData.orderNo"
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
                    class="input flex-1 bg-gray-50"
                    disabled
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
              <h3 class="text-sm font-semibold mb-3">Employee Signature</h3>
              <div
                class="flex-1 border border-gray-300 rounded bg-gray-50 flex items-center justify-center"
              >
                <img
                  v-if="formData.signature"
                  :src="formData.signature"
                  alt="Signature"
                  class="max-w-full max-h-full"
                />
                <span v-else class="text-gray-400 text-sm">No signature available</span>
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
              <tr>
                <th rowspan="2" class="text-center border-r">No Pick Slip</th>
                <th rowspan="2" class="text-center border-r">SKU Description</th>
                <th colspan="2" class="text-center border-r">LOT. NO</th>
                <th colspan="3" class="text-center border-r">FG Receipt Confirmation</th>
                <th colspan="2" class="text-center border-r">Loading Difference</th>
                <th colspan="2" class="text-center border-r">Transporter Claim</th>
                <th rowspan="2" class="text-center">Action</th>
              </tr>
              <!-- Second Header Row -->
              <tr>
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
                <td colspan="14" class="text-center">No data available</td>
              </tr>
              <tr v-for="(item, index) in tableData" :key="index">
                <td>{{ item.pickSlip }}</td>
                <td>{{ item.description }}</td>
                <td class="text-right">{{ item.diSuratJalan }}</td>
                <td class="text-right">{{ item.actual }}</td>
                <td class="text-right">{{ item.diSuratJalanKonfirmasi }}</td>
                <td class="text-right">{{ item.diterima }}</td>
                <td class="text-right">{{ item.selisih }}</td>
                <td class="text-right">{{ item.lebih }}</td>
                <td class="text-right">{{ item.kurang }}</td>
                <td class="text-right">{{ item.repackQty }}</td>
                <td class="text-right">{{ item.damageQty }}</td>
                <td class="text-center">
                  <button
                    class="btn btn-sm btn-icon btn-primary"
                    @click="viewItem(index)"
                    title="View Details"
                  >
                    <i class="ki-filled ki-eye"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3 justify-end mt-6">
        <button class="btn btn-light" @click="goBack()">
          <i class="ki-duotone ki-arrow-left"></i>
          Back to List
        </button>
        <button class="btn btn-danger" @click="openRejectModal()">
          <i class="ki-duotone ki-cross-circle"></i>
          Reject
        </button>
        <button class="btn btn-primary" @click="approveConfirmation()">
          <i class="ki-duotone ki-check-circle"></i>
          Approve
        </button>
      </div>

      <!-- Rejection Modal -->
      <div
        v-if="showRejectModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click.self="closeRejectModal()"
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
            ></textarea>
          </div>
          <div class="flex gap-3 justify-end">
            <button class="btn btn-light" @click="closeRejectModal()">Cancel</button>
            <button class="btn btn-danger" @click="confirmReject()">Confirm Reject</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { type routeTypes } from '@/core/type/components/breadcrumb'
import Breadcrumb from '@/components/BreadcrumbView.vue'

const router = useRouter()
const route = useRoute()

interface FormData {
  orderNo: string
  namaKaryawan: string
  namaSopir: string
  noPolisi: string
  transporter: string
  pickup: string
  destination: string
  orderDate: string
  receivedDate: string
  signature: string | null
}

interface TableData {
  pickSlip: string
  sku: string
  description: string
  diSuratJalan: number
  actual: number
  diSuratJalanKonfirmasi: number
  diterima: number
  selisih: number
  lebih: number
  kurang: number
  repackQty: number
  damageQty: number
}

const routes = ref<routeTypes[]>([
  {
    name: 'Digital Receiving Confirmation',
    to: '/digital-receiving-confirmation',
  },
])

// Form Data (Read-only)
const formData = ref<FormData>({
  orderNo: 'ORD-2024-001',
  namaKaryawan: 'John Doe',
  namaSopir: 'Driver Name',
  noPolisi: 'B 1234 XYZ',
  transporter: 'PT Trans Jaya',
  pickup: 'Jakarta Warehouse',
  destination: 'Bandung Store',
  orderDate: '2024-12-01',
  receivedDate: '2024-12-05',
  signature: null,
})

// Table Data (Read-only)
const tableData = ref<TableData[]>([
  {
    pickSlip: 'PS-001',
    sku: 'SKU-12345',
    description: 'Product Sample A',
    diSuratJalan: 100,
    actual: 100,
    diSuratJalanKonfirmasi: 100,
    diterima: 98,
    selisih: -2,
    lebih: 0,
    kurang: 2,
    repackQty: 0,
    damageQty: 2,
  },
  {
    pickSlip: 'PS-002',
    sku: 'SKU-67890',
    description: 'Product Sample B',
    diSuratJalan: 50,
    actual: 50,
    diSuratJalanKonfirmasi: 50,
    diterima: 52,
    selisih: 2,
    lebih: 2,
    kurang: 0,
    repackQty: 0,
    damageQty: 0,
  },
])

// Rejection Modal State
const showRejectModal = ref<boolean>(false)
const rejectionReason = ref<string>('')

// Functions
const goBack = () => {
  router.push({ name: 'receivingConfirmation' })
}

const viewItem = (index: number) => {
  const item = tableData.value[index]
  console.log('Viewing item:', item)
  alert(`Viewing details for: ${item.pickSlip} - ${item.description}`)
}

const openRejectModal = () => {
  showRejectModal.value = true
  rejectionReason.value = ''
}

const closeRejectModal = () => {
  showRejectModal.value = false
  rejectionReason.value = ''
}

const confirmReject = () => {
  // Validate rejection reason
  if (!rejectionReason.value.trim()) {
    alert('Please provide a rejection reason')
    return
  }

  console.log('Form Data:', formData.value)
  console.log('Table Data:', tableData.value)
  console.log('Rejection Reason:', rejectionReason.value)
  // TODO: Send rejection data to API with status "Rejected"
  alert(`Receiving confirmation rejected!\nReason: ${rejectionReason.value}`)

  // Close modal and redirect
  closeRejectModal()
  router.push({ name: 'receivingConfirmation' })
}

const approveConfirmation = () => {
  console.log('Form Data:', formData.value)
  console.log('Table Data:', tableData.value)
  // TODO: Send approval data to API with status "Approved"
  alert('Receiving confirmation approved successfully!')

  // Redirect to list
  router.push({ name: 'receivingConfirmation' })
}

onMounted(() => {
  // TODO: Load data based on route.params.id
  const id = route.params.id
  console.log('Loading receiving confirmation with ID:', id)
  // Load data from API
})
</script>

<style lang="scss" scoped>
.list__table {
  th,
  td {
    white-space: nowrap;
    padding: 12px 16px;
  }

  th {
    background-color: #f8f9fa;
    font-weight: 600;
    border: 1px solid #dee2e6;
  }

  td {
    border: 1px solid #dee2e6;
  }

  tbody tr:hover {
    background-color: #f8f9fa;
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

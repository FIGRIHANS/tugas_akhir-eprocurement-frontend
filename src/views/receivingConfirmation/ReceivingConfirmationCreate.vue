<template>
  <div>
    <Breadcrumb title="Create Receiving Confirmation" :routes="routes" />
    <hr class="-mx-[24px] mb-[24px]" />

    <div class="border border-gray-200 rounded-xl p-[24px]">
      <!-- Header Section -->
      <div class="mb-[24px]">
        <h1>Receiving Confirmation Request</h1>
      </div>

      <!-- Form Konfirmasi Card -->
      <div class="border border-gray-200 rounded-xl p-[24px] mb-[24px]">
        <h1 class="mb-[24px]">Payment Confirmation</h1>
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- Left and Middle Columns - Form Fields (8 columns) -->
          <div class="lg:col-span-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <!-- Left Column Fields -->
              <div>
                <label class="form-label text-sm font-medium text-gray-600 mb-2">Order No</label>
                <input
                  v-model="formData.orderNo"
                  type="text"
                  class="input"
                  placeholder="Enter Order No"
                />
              </div>
              <div>
                <label class="form-label text-sm font-medium text-gray-600 mb-2">Pickup</label>
                <input
                  v-model="formData.pickup"
                  type="text"
                  class="input"
                  placeholder="Enter Pickup Location"
                />
              </div>

              <div>
                <label class="form-label text-sm font-medium text-gray-600 mb-2"
                  >Employee Name</label
                >
                <input
                  v-model="formData.namaKaryawan"
                  type="text"
                  class="input"
                  placeholder="Enter Employee Name"
                />
              </div>
              <div>
                <label class="form-label text-sm font-medium text-gray-600 mb-2">Destination</label>
                <input
                  v-model="formData.destination"
                  type="text"
                  class="input"
                  placeholder="Enter Destination"
                />
              </div>

              <div>
                <label class="form-label text-sm font-medium text-gray-600 mb-2">Driver Name</label>
                <input
                  v-model="formData.namaSopir"
                  type="text"
                  class="input"
                  placeholder="Enter Driver Name"
                />
              </div>
              <div>
                <label class="form-label text-sm font-medium text-gray-600 mb-2">Order Date</label>
                <input
                  v-model="formData.orderDate"
                  type="text"
                  class="input"
                  placeholder="Enter Order Date"
                />
              </div>

              <div>
                <label class="form-label text-sm font-medium text-gray-600 mb-2"
                  >License Plate</label
                >
                <input
                  v-model="formData.noPolisi"
                  type="text"
                  class="input"
                  placeholder="Enter License Plate"
                />
              </div>
              <div>
                <label class="form-label text-sm font-medium text-gray-600 mb-2"
                  >Received Date</label
                >
                <input v-model="formData.receivedDate" type="datetime-local" class="input" />
              </div>

              <div>
                <label class="form-label text-sm font-medium text-gray-600 mb-2">Transporter</label>
                <input
                  v-model="formData.transporter"
                  type="text"
                  class="input"
                  placeholder="Enter Transporter"
                />
              </div>
            </div>
          </div>

          <!-- Right Column - Signature Box (4 columns) -->
          <div class="lg:col-span-4">
            <label class="form-label text-sm font-medium text-gray-600">Signature</label>
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
        <div class="flex justify-between items-center mb-[24px]">
          <h1>List Receiving Confirmation Request</h1>
        </div>

        <!-- Table -->
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
      <div class="mt-[24px] flex gap-3 justify-end">
        <button class="btn btn-light" @click="goBack()">
          <i class="ki-duotone ki-arrow-left"></i>
          Back to List
        </button>
        <button class="btn btn-primary" @click="submitForm()">
          <i class="ki-duotone ki-save-2"></i>
          Submit
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { type routeTypes } from '@/core/type/components/breadcrumb'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import VueSignature from 'vue3-signature'

const router = useRouter()

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

const signaturePad = ref<any>(null)

// Signature options
const signatureOptions = {
  penColor: '#000000',
  backgroundColor: '#ffffff',
}

// Form Data
const formData = ref<FormData>({
  orderNo: '',
  namaKaryawan: '',
  namaSopir: '',
  noPolisi: '',
  transporter: '',
  pickup: '',
  destination: '',
  orderDate: '',
  receivedDate: '',
  signature: null,
})

// Table Data
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

const goBack = () => {
  router.push({ name: 'receivingConfirmation' })
}

const clearSignature = () => {
  if (signaturePad.value) {
    signaturePad.value.clear()
  }
}

const viewItem = (index: number) => {
  const item = tableData.value[index]
  console.log('Viewing item:', item)
  // TODO: Open modal or navigate to detail page
  alert(`Viewing details for: ${item.pickSlip} - ${item.description}`)
}

const submitForm = () => {
  // Save signature data
  if (signaturePad.value) {
    const { isEmpty, data } = signaturePad.value.save()
    if (!isEmpty) {
      formData.value.signature = data
    }
  }

  // Validate form
  if (!formData.value.orderNo || !formData.value.namaKaryawan || !formData.value.namaSopir) {
    alert('Please fill in all required fields')
    return
  }

  // Validate table data
  if (tableData.value.length === 0) {
    alert('Please add at least one item to the table')
    return
  }

  console.log('Form Data:', formData.value)
  console.log('Table Data:', tableData.value)
  // TODO: Send data to API
  alert('Receiving confirmation submitted successfully!')

  // Redirect to list
  router.push({ name: 'receivingConfirmation' })
}

onMounted(() => {
  // Load existing signature if available
  if (formData.value.signature && signaturePad.value) {
    signaturePad.value.fromDataURL(formData.value.signature)
  }
  // TODO: Load data based on route params if editing
})
</script>

<style lang="scss" scoped>
@media print {
  .btn,
  button {
    display: none;
  }
}

.form-control[readonly] {
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

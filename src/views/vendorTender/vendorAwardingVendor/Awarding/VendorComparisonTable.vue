<template>
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">Vendor Awarding</h3>
    </div>
    <div class="card-body p-0">
      <div class="table-container">
        <div class="table-wrapper">
          <table class="table text-gray-700 font-medium text-sm">
            <thead>
              <tr>
                <th class="table-header">Tender Request Number</th>
                <th class="table-header">Type</th>
                <th class="table-header">Delivery Date</th>
                <th class="table-header">Plant</th>
                <th class="table-header">Material Group</th>
                <th class="table-header">Item No</th>
                <th class="table-header">Tender Price</th>
                <th class="table-header">Material</th>
                <th class="table-header">Material Desc</th>
                <th class="table-header">Quantity</th>
                <th class="table-header">Button Price</th>
                <th class="table-header">UOM</th>
                <th class="table-header">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in awardingComparisons" :key="item.itemId">
                <td class="table-cell">{{ item.itemId }}</td>
                <td class="table-cell">R</td>
                <td class="table-cell">2024-10-15</td>
                <td class="table-cell">CHP2</td>
                <td class="table-cell">4</td>
                <td class="table-cell">20</td>
                <td class="table-cell">{{ formatCurrency(item.vendors[0]?.finalPrice || '0') }}</td>
                <td class="table-cell">{{ item.material }}</td>
                <td class="table-cell">{{ item.materialDesc }}</td>
                <td class="table-cell">{{ item.quantity }}</td>
                <td class="table-cell">{{ formatCurrency(item.vendors[0]?.finalPrice || '0') }}</td>
                <td class="table-cell">{{ item.uom }}</td>
                <td class="table-cell">
                  <button
                    class="btn btn-sm btn-primary"
                    @click="openAwardModal(item)"
                  >
                    Award
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <!-- Award Modal -->
  <div v-if="showAwardModal" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5)">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Award Item: {{ selectedItem?.material }}</h5>
          <button type="button" class="btn-close" @click="closeAwardModal"></button>
        </div>
        <div class="modal-body">
          <div class="mb-4">
            <h6>Material Details</h6>
            <p><strong>Description:</strong> {{ selectedItem?.materialDesc }}</p>
            <p><strong>Quantity:</strong> {{ selectedItem?.quantity }} {{ selectedItem?.uom }}</p>
          </div>

          <div class="mb-4">
            <h6>Select Vendor</h6>
            <div class="row">
              <div
                v-for="vendor in selectedItem?.vendors"
                :key="vendor.vendorCode"
                class="col-md-4 mb-3"
              >
                <div
                  class="card cursor-pointer border"
                  :class="{ 'border-primary bg-light': selectedVendorCode === vendor.vendorCode }"
                  @click="selectedVendorCode = vendor.vendorCode"
                >
                  <div class="card-body text-center">
                    <h6 class="card-title">{{ vendor.vendorName }}</h6>
                    <p class="card-text">
                      <span class="text-muted">Offered:</span><br>
                      <span class="fw-bold">{{ formatCurrency(vendor.offeredPrice) }}</span>
                    </p>
                    <p v-if="vendor.finalPrice !== vendor.offeredPrice" class="card-text">
                      <span class="text-muted">Final:</span><br>
                      <span class="fw-bold text-success">{{ formatCurrency(vendor.finalPrice) }}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mb-4">
            <label class="form-label">Awarding Reason</label>
            <textarea
              v-model="awardingReason"
              class="form-control"
              rows="3"
              placeholder="Enter reason for awarding to this vendor..."
            ></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeAwardModal">Cancel</button>
          <button
            type="button"
            class="btn btn-primary"
            @click="confirmAward"
            :disabled="!selectedVendorCode || !awardingReason.trim()"
          >
            Confirm Award
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'
import type { AwardingComparison } from '../types/awarding'

const awardingComparisons = inject<AwardingComparison[]>('awardingComparisons', [])

const showAwardModal = ref(false)
const selectedItem = ref<AwardingComparison | null>(null)
const selectedVendorCode = ref('')
const awardingReason = ref('')

const formatCurrency = (value: string | number): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return '0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(num)
}

const openAwardModal = (item: AwardingComparison) => {
  selectedItem.value = item
  const currentSelected = item.vendors.find(v => v.isSelected)
  selectedVendorCode.value = currentSelected?.vendorCode || ''
  awardingReason.value = ''
  showAwardModal.value = true
}

const closeAwardModal = () => {
  showAwardModal.value = false
  selectedItem.value = null
  selectedVendorCode.value = ''
  awardingReason.value = ''
}

const confirmAward = () => {
  if (selectedItem.value && selectedVendorCode.value) {
    selectedItem.value.vendors.forEach(vendor => {
      vendor.isSelected = false
    })

    const selectedVendor = selectedItem.value.vendors.find(
      vendor => vendor.vendorCode === selectedVendorCode.value
    )
    if (selectedVendor) {
      selectedVendor.isSelected = true
    }

    closeAwardModal()
  }
}
</script>


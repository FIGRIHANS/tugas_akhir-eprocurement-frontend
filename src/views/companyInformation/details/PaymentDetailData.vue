<template>
  <div class="flex flex-col gap-6">
    <div class="card min-w-full">
      <div class="card-header">
        <h3 class="card-title">Payment Information</h3>
      </div>

      <div class="card-table scrollable-x-auto pb-2">
        <table class="table align-middle">
          <thead>
            <tr>
              <th></th>
              <th>No</th>
              <th class="min-w-40">Account No</th>
              <th class="min-w-52">Account Holder Name</th>
              <th class="min-w-32">SwiftCode</th>
              <th class="min-w-72">Account Discrepancy Statement</th>
              <th class="min-w-40">Account Cover</th>
              <th class="min-w-40">Currency</th>
              <th class="min-w-40">Bank Key</th>
              <th class="min-w-40">Bank Name</th>
              <th class="min-w-40">Bank Branch</th>
              <th class="min-w-72">Bank Address</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(paymentData, index) in data" :key="paymentData?.id">
              <td>
                <div class="dropdown" data-dropdown="true" data-dropdown-trigger="click">
                  <button class="dropdown-toggle px-0 size-8 flex justify-center btn btn-light">
                    <UiIcon name="dots-vertical" />
                  </button>

                  <!-- <div class="dropdown-content w-full max-w-56" data-dropdown-dismiss="true">
                    <div class="menu menu-default flex flex-col w-full text-sm">
                      <div class="menu-item text-primary" @click="downloadFile()">
                        <span class="menu-link">
                          <UiIcon name="file-down" variant="duotone" class="menu-icon" />
                          Download
                        </span>
                      </div>
                    </div>
                  </div> -->
                </div>
              </td>
              <td>{{ index + 1 }}</td>
              <td>{{ paymentData?.accountNo || '-' }}</td>
              <td>{{ paymentData?.accountName || '-' }}</td>
              <td>{{ paymentData?.bankSwiftCode || '-' }}</td>
              <td>
                <div class="flex justify-center">
                  <span v-if="!paymentData?.urlAccountDifferences">-</span>
                  <UiButton
                    v-else
                    variant="primary"
                    outline
                    size="sm"
                    @click="downloadFile(paymentData?.urlAccountDifferences)"
                  >
                    <UiIcon name="cloud-download" variant="duotone" />
                  </UiButton>
                </div>
              </td>
              <td>
                <div class="flex justify-center">
                  <span v-if="!paymentData?.urlFirstPage">-</span>
                  <UiButton
                    v-else
                    variant="primary"
                    outline
                    size="sm"
                    @click="downloadFile(paymentData?.urlFirstPage)"
                  >
                    <UiIcon name="cloud-download" variant="duotone" />
                  </UiButton>
                </div>
              </td>
              <td>{{ paymentData?.currencySymbol || '-' }}</td>
              <td>{{ paymentData?.bankCode || '-' }}</td>
              <td>{{ paymentData?.bankName || '-' }}</td>
              <td>{{ paymentData?.branch || '-' }}</td>
              <td>{{ paymentData?.bankAddress || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'

import { useVendorPaymentStore } from '@/stores/vendor/vendor'
import { useUploadStore } from '@/stores/general/upload'

import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'

const props = defineProps<{ vendorId: number | undefined }>()

const vendorStore = useVendorPaymentStore()
const uploadStore = useUploadStore()

const data = computed(() => vendorStore.data)

const downloadFile = async (path: string) => {
  await uploadStore.previewFile(path)
}

onMounted(() => {
  props.vendorId && vendorStore.getData(String(props.vendorId))
})

watch(
  () => props.vendorId,
  () => {
    vendorStore.getData(String(props.vendorId))
  },
)
</script>

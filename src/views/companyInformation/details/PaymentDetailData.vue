<template>
  <div class="flex flex-col gap-6">
    <div class="card min-w-full">
      <div class="card-header">
        <h3 class="card-title">{{ $t('vendorProfile.paymentInformation') }}</h3>
      </div>

      <div class="card-table scrollable-x-auto pb-2">
        <table class="table align-middle">
          <thead>
            <tr>
              <th>No</th>
              <th class="min-w-40">{{ $t('vendorProfile.accountNo') }}</th>
              <th class="min-w-52">{{ $t('vendorProfile.accountHolderName') }}</th>
              <th class="min-w-32">{{ $t('vendorProfile.swiftCode') }}</th>
              <th class="min-w-72">{{ $t('vendorProfile.accountDiscrepancy') }}</th>
              <th class="min-w-40">{{ $t('vendorProfile.accountCover') }}</th>
              <th class="min-w-40">{{ $t('vendorProfile.currency') }}</th>
              <th class="min-w-40">{{ $t('vendorProfile.bankKey') }}</th>
              <th class="min-w-40">{{ $t('vendorProfile.bankName') }}</th>
              <th class="min-w-40">{{ $t('vendorProfile.bankBranch') }}</th>
              <th class="min-w-72">{{ $t('vendorProfile.bankAddress') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(paymentData, index) in data" :key="paymentData?.id">
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

<template>
  <div class="flex flex-col gap-6">
    <div class="card min-w-full">
      <div class="card-header">
        <h3 class="card-title">Business License</h3>
      </div>

      <div class="card-table scrollable-x-auto pb-2">
        <table class="table align-middle">
          <thead>
            <tr>
              <th>License Type</th>
              <th>License Number</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Document</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(license, index) in data" :key="index">
              <td>{{ license?.licenseName || '-' }}</td>
              <td>{{ license?.licenseNo || '-' }}</td>
              <td>{{ formatDate(license?.issuedUTCDate) || '-' }}</td>
              <td>{{ formatDate(license?.expiredUTCDate) || '-' }}</td>
              <td>
                <div class="flex justify-center">
                  <span v-if="!license?.documentUrl">-</span>
                  <UiButton
                    v-else
                    variant="primary"
                    outline
                    size="sm"
                    @click="downloadFile(license?.documentUrl)"
                  >
                    <UiIcon name="cloud-download" variant="duotone" />
                    Download Document
                  </UiButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'

import { useVendorIzinUsahaStore } from '@/stores/vendor/vendor'
import { useUploadStore } from '@/stores/general/upload'

import { formatDate } from '@/composables/date-format'

import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'

const props = defineProps<{ vendorId: number | undefined }>()

const vendorStore = useVendorIzinUsahaStore()
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

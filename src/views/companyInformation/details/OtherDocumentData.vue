<template>
  <div class="card min-w-full">
    <div class="card-header">
      <h3 class="card-title">Other Documents</h3>
    </div>

    <div class="card-table">
      <table class="table align-middle">
        <thead>
          <tr>
            <th>Document Name</th>
            <th>Document Number</th>
            <th>Available until</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="data in dataResponse" :key="data.id">
            <td>
              <AttachmentView
                :file-data="{ name: data.documentName, path: data.documentUrl }"
                :upload-date="formatDate(data.issuedUTCDate)"
                @click="downloadFile(data.documentUrl)"
              />
            </td>
            <td>{{ data.documentNo }}</td>
            <td>{{ formatDate(data.expiredUTCDate) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'

import useOtherDocStore from '@/stores/vendor/otherDocuments'
import { useUploadStore } from '@/stores/general/upload'

import { formatDate } from '@/composables/date-format'

import AttachmentView from '@/components/ui/attachment/AttachmentView.vue'

const props = defineProps<{ vendorId: number | undefined }>()

const otherDocStore = useOtherDocStore()
const uploadStore = useUploadStore()

const dataResponse = computed(() => otherDocStore.data)

const downloadFile = async (path: string) => {
  await uploadStore.previewFile(path)
}

onMounted(() => {
  otherDocStore.get(Number(props.vendorId))
})

watch(
  () => props.vendorId,
  () => {
    otherDocStore.get(Number(props.vendorId))
  },
)
</script>

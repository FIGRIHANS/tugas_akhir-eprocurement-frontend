<template>
  <div class="modal" data-modal="true" id="ftp_view_modal">
    <div class="modal-content max-w-[900px] modal-center-y">
      <div class="modal-header">
        <h3 class="modal-title text-lg font-semibold text-gray-700">View Uploaded Files</h3>
        <button class="btn btn-xs btn-icon btn-light btn-clear" data-modal-dismiss="true">
          <i class="ki-duotone ki-cross"></i>
        </button>
      </div>

      <div class="modal-body p-4">
        <div class="border rounded-lg p-4 bg-gray-50 mb-5">
          <div class="font-semibold text-gray-700 mb-3">Upload Detail</div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div>
              <div class="text-gray-500">Invoice UID</div>
              <div class="font-medium break-all">{{ data.invoiceUId || '-' }}</div>
            </div>
            <div>
              <div class="text-gray-500">Invoice No</div>
              <div class="font-medium">{{ data.invoiceNo || '-' }}</div>
            </div>
            <div>
              <div class="text-gray-500">Company Code</div>
              <div class="font-medium">{{ data.companyCode || '-' }}</div>
            </div>
            <div>
              <div class="text-gray-500">Status</div>
              <div>
                <span
                  v-if="data.status"
                  class="badge badge-outline"
                  :class="data.status === 'Done' ? 'badge-success' : 'badge-primary'"
                >
                  {{ data.status }}
                </span>
                <span v-else class="font-medium">-</span>
              </div>
            </div>
            <div>
              <div class="text-gray-500">Created At</div>
              <div class="font-medium">{{ formattedCreatedAt }}</div>
            </div>
          </div>

          <div v-if="parsedPreviewEntries.length" class="mt-4 pt-4 border-t border-gray-200">
            <div class="font-semibold text-gray-700 mb-2">Parsed Preview</div>
            <table class="table text-sm w-full">
              <tbody>
                <tr v-for="entry in parsedPreviewEntries" :key="entry.key">
                  <td class="font-medium text-gray-500 w-[40%]">{{ entry.label }}</td>
                  <td>{{ entry.value }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="space-y-4">
          <div v-for="file in fileSections" :key="file.key">
            <label class="font-medium">{{ file.label }}</label>
            <div class="p-3 border rounded bg-gray-50 mt-2 flex items-start gap-3">
              <a
                v-if="file.url"
                :href="file.url"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-outline btn-icon btn-primary w-[32px] h-[32px] shrink-0"
                :title="`Open ${file.label}`"
              >
                <i class="ki-filled ki-eye !text-lg"></i>
              </a>
              <span
                v-else
                class="btn btn-outline btn-icon btn-light w-[32px] h-[32px] shrink-0 opacity-50 cursor-not-allowed"
                title="No file available"
              >
                <i class="ki-filled ki-eye !text-lg"></i>
              </span>

              <div class="min-w-0 flex-1 space-y-1 text-sm">
                <div>
                  <span class="text-gray-500">Original File Name:</span>
                  <span class="font-medium ml-1">{{ file.fileName || 'No file uploaded' }}</span>
                </div>
                <div v-if="file.storedFileName && file.storedFileName !== file.fileName">
                  <span class="text-gray-500">Stored File Name:</span>
                  <span class="font-medium ml-1">{{ file.storedFileName }}</span>
                  <span class="text-xs text-gray-400 ml-1">(nama file di server storage)</span>
                </div>
                <div v-if="file.blobPath">
                  <span class="text-gray-500">Blob Path:</span>
                  <span class="font-medium ml-1 break-all">{{ file.blobPath }}</span>
                </div>
                <div v-if="file.url">
                  <span class="text-gray-500">URL:</span>
                  <a
                    :href="file.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="font-medium ml-1 text-primary break-all hover:underline"
                  >
                    {{ file.url }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer flex gap-2 justify-end p-4">
        <button class="btn btn-light" data-modal-dismiss="true">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import moment from 'moment'

export interface FtpUploadFileInfo {
  fileName: string | null
  storedFileName?: string | null
  blobPath: string | null
  url: string | null
}

export interface FtpUploadViewerData {
  invoiceUId?: string | null
  invoiceNo?: string | null
  companyCode?: string | null
  status?: string | null
  createdAt?: string | null
  parsedPreview?: Record<string, unknown> | null
  invoice?: FtpUploadFileInfo
  tax?: FtpUploadFileInfo
  reference?: FtpUploadFileInfo | null
}

const props = defineProps<{ data: FtpUploadViewerData }>()

const data = computed(() => props.data)

const formattedCreatedAt = computed(() => {
  if (!data.value.createdAt) return '-'
  const parsed = moment(data.value.createdAt)
  return parsed.isValid() ? parsed.format('YYYY/MM/DD HH:mm:ss') : data.value.createdAt
})

const parsedPreviewEntries = computed(() => {
  const preview = data.value.parsedPreview
  if (!preview || typeof preview !== 'object') return []

  return Object.entries(preview)
    .filter(([, value]) => value != null && String(value).trim() !== '')
    .map(([key, value]) => ({
      key,
      label: key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase()),
      value: String(value),
    }))
})

const fileSections = computed(() => [
  {
    key: 'invoice',
    label: 'Invoice Document',
    fileName: data.value.invoice?.fileName || null,
    storedFileName: data.value.invoice?.storedFileName || null,
    blobPath: data.value.invoice?.blobPath || null,
    url: data.value.invoice?.url || null,
  },
  {
    key: 'tax',
    label: 'Tax Document',
    fileName: data.value.tax?.fileName || null,
    storedFileName: data.value.tax?.storedFileName || null,
    blobPath: data.value.tax?.blobPath || null,
    url: data.value.tax?.url || null,
  },
  {
    key: 'reference',
    label: 'Reference Document',
    fileName: data.value.reference?.fileName || null,
    storedFileName: data.value.reference?.storedFileName || null,
    blobPath: data.value.reference?.blobPath || null,
    url: data.value.reference?.url || null,
  },
])
</script>

<style scoped lang="scss">
.modal-body {
  .p-4 {
    display: block;
  }
}
</style>

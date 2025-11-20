<template>
  <div class="flex flex-col gap-[20px]">
    <!-- Invoice -->
    <div>
      <p class="font-normal text-sm text-gray-600">Invoice No</p>
      <div v-if="isEmpty(invoice)">-</div>
      <div v-else class="flex items-center justify-between mt-[10px]">
        <AttachmentView :file-data="invoice" :maxLength="40" />
        <button
          class="btn btn-icon btn-outline btn-primary"
          @click="download(invoice?.path || '')"
          :disabled="currentDownloading !== null"
        >
          <template v-if="currentDownloading === invoice?.path">
            <svg class="animate-spin h-5 w-5 text-blue-600" viewBox="0 0 24 24">
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
                fill="none"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          </template>
          <template v-else>
            <i class="ki-duotone ki-file-down"></i>
          </template>
        </button>
      </div>
    </div>

    <!-- Tax -->
    <div>
      <p class="font-normal text-sm text-gray-600">Faktur Pajak</p>
      <div v-if="isEmpty(tax)">-</div>
      <div v-else class="flex items-center justify-between mt-[10px]">
        <AttachmentView :file-data="tax" :maxLength="40" />
        <button
          class="btn btn-icon btn-outline btn-primary"
          @click="download(tax?.path)"
          :disabled="currentDownloading !== null"
        >
          <template v-if="currentDownloading === tax?.path">
            <svg class="animate-spin h-5 w-5 text-blue-600" viewBox="0 0 24 24">
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
                fill="none"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          </template>
          <template v-else>
            <i class="ki-duotone ki-file-down"></i>
          </template>
        </button>
      </div>
    </div>

    <!-- Reference -->
    <div>
      <p class="font-normal text-sm text-gray-600">Reference Document</p>
      <div v-if="isEmpty(reference)">-</div>
      <div v-else class="flex items-center justify-between mt-[10px]">
        <AttachmentView :file-data="reference" :maxLength="40" />
        <button
          class="btn btn-icon btn-outline btn-primary"
          @click="download(reference?.path)"
          :disabled="currentDownloading !== null"
        >
          <template v-if="currentDownloading === reference?.path">
            <svg class="animate-spin h-5 w-5 text-blue-600" viewBox="0 0 24 24">
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
                fill="none"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          </template>
          <template v-else>
            <i class="ki-duotone ki-file-down"></i>
          </template>
        </button>
      </div>
    </div>

    <!-- Other -->
    <div>
      <p class="font-normal text-sm text-gray-600">Other Document</p>
      <div v-if="isEmpty(other)">-</div>
      <div v-else class="flex items-center justify-between mt-[10px]">
        <AttachmentView :fileData="other" :maxLength="40" />
        <button
          class="btn btn-icon btn-outline btn-primary"
          @click="download(other?.path)"
          :disabled="currentDownloading !== null"
        >
          <template v-if="currentDownloading === other?.path">
            <svg class="animate-spin h-5 w-5 text-blue-600" viewBox="0 0 24 24">
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
                fill="none"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          </template>
          <template v-else>
            <i class="ki-duotone ki-file-down"></i>
          </template>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, inject, type Ref } from 'vue'
import type { formTypes } from '../../types/invoiceDetail'
import type { documentViewTypes } from '../../types/invoiceDocument'
import { isEmpty } from 'lodash'
import AttachmentView from '@/components/ui/attachment/AttachmentView.vue'
import { usePreviewFileStore } from '@/stores/general/previewFile'

const previewApi = usePreviewFileStore()
const form = inject<Ref<formTypes>>('form')

const invoice = ref<documentViewTypes | null>(null)
const tax = ref<documentViewTypes | null>(null)
const reference = ref<documentViewTypes | null>(null)
const other = ref<documentViewTypes | null>(null)

// state loading
const currentDownloading = ref<string | null>(null)

const download = async (path: string) => {
  if (!path) return

  try {
    currentDownloading.value = path

    const response = await previewApi.getPreview(path)

    const url = window.URL.createObjectURL(response.data)
    window.open(url, '_blank')

    setTimeout(() => URL.revokeObjectURL(url), 1000)
  } catch (e) {
    console.error(e)
  } finally {
    currentDownloading.value = null
  }
}

watch(
  () => form,
  () => {
    if (form?.value) {
      invoice.value = !isEmpty(form.value.invoiceDocument)
        ? {
            name: form.value.invoiceDocument.documentName,
            path: form.value.invoiceDocument.documentUrl,
          }
        : null

      tax.value = !isEmpty(form.value.tax)
        ? { name: form.value.tax.documentName, path: form.value.tax.documentUrl }
        : null

      reference.value = !isEmpty(form.value.referenceDocument)
        ? {
            name: form.value.referenceDocument.documentName,
            path: form.value.referenceDocument.documentUrl,
          }
        : null

      other.value = !isEmpty(form.value.otherDocument)
        ? {
            name: form.value.otherDocument.documentName,
            path: form.value.otherDocument.documentUrl,
          }
        : null
    }
  },
  { deep: true, immediate: true },
)
</script>

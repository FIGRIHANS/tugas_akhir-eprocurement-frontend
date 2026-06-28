<template>
  <div class="flex flex-col gap-[20px]">
    <!-- Invoice -->
    <div>
      <p class="font-normal text-sm text-gray-600">Invoice No</p>
      <div v-if="isEmpty(invoice)">-</div>
      <div v-else class="flex items-center justify-between mt-[10px]">
        <AttachmentView :file-data="invoice" :maxLength="40" />
        <DocumentActionButtons
          :path="invoice?.path"
          label="Invoice Document"
          :loading-path="currentDownloading"
          @preview="previewDocument"
          @download="download"
        />
      </div>
    </div>

    <!-- Tax -->
    <div>
      <p class="font-normal text-sm text-gray-600">Faktur Pajak</p>
      <div v-if="isEmpty(tax)">-</div>
      <div v-else class="flex items-center justify-between mt-[10px]">
        <AttachmentView :file-data="tax" :maxLength="40" />
        <DocumentActionButtons
          :path="tax?.path"
          label="Faktur Pajak"
          :loading-path="currentDownloading"
          @preview="previewDocument"
          @download="download"
        />
      </div>
    </div>

    <!-- Reference -->
    <div>
      <p class="font-normal text-sm text-gray-600">Reference Document</p>
      <div v-if="isEmpty(reference)">-</div>
      <div v-else class="flex items-center justify-between mt-[10px]">
        <AttachmentView :file-data="reference" :maxLength="40" />
        <DocumentActionButtons
          :path="reference?.path"
          label="Reference Document"
          :loading-path="currentDownloading"
          @preview="previewDocument"
          @download="download"
        />
      </div>
    </div>

    <!-- Other -->
    <div>
      <p class="font-normal text-sm text-gray-600">Other Document</p>
      <div v-if="isEmpty(other)">-</div>
      <div v-else class="flex items-center justify-between mt-[10px]">
        <AttachmentView :fileData="other" :maxLength="40" />
        <DocumentActionButtons
          :path="other?.path"
          label="Other Document"
          :loading-path="currentDownloading"
          @preview="previewDocument"
          @download="download"
        />
      </div>
    </div>

    <UiModal v-model="showPreviewModal" :title="previewTitle" size="xl" @update:model-value="onPreviewModalToggle">
      <div v-if="previewLoading" class="flex flex-col items-center justify-center py-20">
        <span class="loading loading-spinner loading-lg text-primary"></span>
        <p class="mt-4 text-gray-500 font-medium">Memuat preview dokumen...</p>
      </div>
      <iframe
        v-else-if="previewUrl"
        :src="previewUrl"
        class="w-full h-[650px] rounded-lg border-0"
        title="Document preview"
      />
      <p v-else class="py-10 text-center text-gray-500">Dokumen tidak dapat ditampilkan.</p>
    </UiModal>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, inject, type Ref } from 'vue'
import type { formTypes } from '../../types/invoiceDetail'
import type { documentViewTypes } from '../../types/invoiceDocument'
import { isEmpty } from 'lodash'
import AttachmentView from '@/components/ui/attachment/AttachmentView.vue'
import DocumentActionButtons from './DocumentActionButtons.vue'
import UiModal from '@/components/modal/UiModal.vue'
import { resolveDocumentPreviewUrl } from '@/composables/documentPreview'
const form = inject<Ref<formTypes>>('form')

const invoice = ref<documentViewTypes | null>(null)
const tax = ref<documentViewTypes | null>(null)
const reference = ref<documentViewTypes | null>(null)
const other = ref<documentViewTypes | null>(null)

const currentDownloading = ref<string | null>(null)
const showPreviewModal = ref(false)
const previewLoading = ref(false)
const previewTitle = ref('Document Preview')
const previewUrl = ref('')
const previewUsesObjectUrl = ref(false)

const revokePreviewUrl = () => {
  if (previewUrl.value && previewUsesObjectUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
  previewUrl.value = ''
  previewUsesObjectUrl.value = false
}

const onPreviewModalToggle = (open: boolean) => {
  if (!open) revokePreviewUrl()
}

const previewDocument = async (path: string | undefined, label: string) => {
  const filePath = (path || '').trim()
  if (!filePath) return

  previewTitle.value = label
  showPreviewModal.value = true
  previewLoading.value = true
  revokePreviewUrl()

  try {
    const url = await resolveDocumentPreviewUrl(filePath)
    if (!url) {
      showPreviewModal.value = false
      return
    }
    previewUrl.value = url
    previewUsesObjectUrl.value = url.startsWith('blob:')
  } catch (error) {
    console.error('Failed to preview document:', error)
    showPreviewModal.value = false
  } finally {
    previewLoading.value = false
  }
}

const download = async (path: string) => {
  if (!path) return

  try {
    currentDownloading.value = path
    const targetUrl = await resolveDocumentPreviewUrl(path)
    if (!targetUrl) return

    window.open(targetUrl, '_blank')

    if (targetUrl.startsWith('blob:')) {
      setTimeout(() => URL.revokeObjectURL(targetUrl), 1000)
    }
  } catch (error) {
    console.error('Failed to download document:', error)
  } finally {
    currentDownloading.value = null
  }
}

const mapDocument = (
  doc: { documentName?: string; documentUrl?: string; name?: string; path?: string } | null | undefined,
): documentViewTypes | null => {
  const url = (doc?.documentUrl || doc?.path || '').trim()
  if (isEmpty(doc) || !url) return null
  return {
    name: doc.documentName || doc.name || '-',
    path: url,
  }
}

watch(
  form,
  (value) => {
    if (!value) return
    invoice.value = mapDocument(value.invoiceDocument)
    tax.value = mapDocument(value.tax)
    reference.value = mapDocument(value.referenceDocument)
    other.value = mapDocument(value.otherDocument)
  },
  { deep: true, immediate: true },
)
</script>

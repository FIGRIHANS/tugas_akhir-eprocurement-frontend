<template>
  <div class="flex flex-col gap-[20px]">
    <div>
      <p class="font-normal text-sm text-gray-600">Invoice No</p>
      <div class="flex items-center justify-between mt-[10px]">
        <AttachmentView :file-data="invoice" />
        <button class="btn btn-icon btn-outline btn-primary" @click="download(invoice?.path || '')">
          <i class="ki-duotone ki-file-down"></i>
        </button>
      </div>
    </div>
    <div>
      <p class="font-normal text-sm text-gray-600">Faktur Pajak</p>
      <div v-if="isEmpty(tax)">-</div>
      <div v-else class="flex items-center justify-between mt-[10px]">
        <AttachmentView :file-data="tax" />
        <button class="btn btn-icon btn-outline btn-primary" @click="download(tax?.path)">
          <i class="ki-duotone ki-file-down"></i>
        </button>
      </div>
    </div>
    <div>
      <p class="font-normal text-sm text-gray-600">Reference Document</p>
      <div v-if="isEmpty(reference)">-</div>
      <div v-else class="flex items-center justify-between mt-[10px]">
        <AttachmentView :file-data="reference" />
        <button class="btn btn-icon btn-outline btn-primary" @click="download(reference?.path)">
          <i class="ki-duotone ki-file-down"></i>
        </button>
      </div>
    </div>
    <div>
      <p class="font-normal text-sm text-gray-600">Other Document</p>
      <div v-if="isEmpty(other)">-</div>
      <div v-else class="flex items-center justify-between mt-[10px]">
        <AttachmentView :file-data="other" />
        <button class="btn btn-icon btn-outline btn-primary" @click="download(other?.path)">
          <i class="ki-duotone ki-file-down"></i>
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

const download = (path: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  previewApi.getPreview(path).then((response: any) => {
    const url = window.URL.createObjectURL(response.data)
    window.open(url, '_blank')
    URL.revokeObjectURL(url)
    // const a = document.createElement('a')
    // a.href = url
    // const splitPath = path.split(/\\/)
    // const filename = splitPath[splitPath.length - 1]

    // a.download = filename
    // a.click()
    // URL.revokeObjectURL(url)
  })
}

watch(
  () => form,
  () => {
    if (form?.value) {
      invoice.value = !isEmpty(form?.value.invoiceDocument) ? { name: form.value.invoiceDocument.documentName, path: form.value.invoiceDocument.documentUrl } : null
      tax.value = !isEmpty(form?.value.tax) ? { name: form.value.tax.documentName, path: form.value.tax.documentUrl } : null
      reference.value = !isEmpty(form?.value.referenceDocument) ? { name: form.value.referenceDocument.documentName, path: form.value.referenceDocument.documentUrl } : null
      other.value = !isEmpty(form?.value.otherDocument) ? { name: form.value.otherDocument.documentName, path: form.value.otherDocument.documentUrl } : null
    }
  },
  {
    deep: true,
    immediate: true
  }
)
</script>

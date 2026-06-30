<template>
  <div class="px-[14px]">
    <p class="mb-[16px] font-semibold text-base">Invoice Header</p>
    <div class="flex flex-col gap-[46px]">
      <div
        v-for="(item, index) in list"
        :key="index"
        class="flex items-center flex-wrap lg:flex-nowrap gap-2.5"
      >
        <label class="form-label max-w-32">
          {{ item.title }}
          <span v-if="index === 0" class="text-red-500 ml-[4px]">*</span>
        </label>
        <pdfUploadTax
          ref="pdfUploadRef"
          v-show="
            (!form[item.varName as keyof typeof form] || isEditingField[item.varName]) &&
            canReplaceDocument
          "
          :error="!!form[item.varErrorName as keyof documentFormTypes]"
          :disabled="!canReplaceDocument"
          @setFile="setFile($event, item.varName as FileFieldKeys)"
        />
        <div
          v-if="form[item.varName as keyof typeof form] && !isEditingField[item.varName]"
          class="flex justify-between items-center gap-[8px] flex-1"
        >
          <AttachmentView
            :fileData="
              typeof form[item.varName as keyof documentFormTypes] === 'object'
                ? (form[item.varName as keyof documentFormTypes] as responseFileTypes)
                : null
            "
          />
          <div class="flex items-center gap-[8px] shrink-0">
            <button
              class="btn btn-icon btn-sm btn-outline btn-primary"
              title="Lihat dokumen"
              @click="
                openDocumentPreview(
                  (form[item.varName as keyof documentFormTypes] as responseFileTypes) || null,
                  item.title,
                )
              "
            >
              <i class="ki-filled ki-eye"></i>
            </button>
            <button
              v-if="canReplaceDocument"
              class="btn btn-icon btn-sm btn-active-light-primary text-primary"
              @click="changeFile(index, item.varName as FileFieldKeys)"
              title="Upload ulang"
            >
              <i class="ki-outline ki-pencil fs-2"></i>
            </button>
            <button
              v-if="canReplaceDocument"
              class="btn btn-icon btn-sm btn-active-light-danger text-danger"
              @click="removeFile(item.varName as FileFieldKeys)"
              title="Hapus"
            >
              <i class="ki-outline ki-trash fs-2"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, inject, watch, computed } from 'vue'
import type {
  documentFormTypes,
  responseFileTypes,
  listFormTypes,
} from '../../../types/invoiceDocument'
import type { formTypes } from '../../../types/invoiceAddWrapper'
import pdfUploadTax from '@/components/ui/pdfUpload/pdfUploadTaxDoc.vue'
import AttachmentView from '@/components/ui/attachment/AttachmentView.vue'
import { openPdfPreview } from '@/composables/documentPreview'

type FileFieldKeys = 'invoiceDocument' | 'tax' | 'referenceDocument' | 'otherDocument'

const formInject = inject<formTypes>('form')
const pdfUploadRef = ref()

const isEditingField = reactive<Record<string, boolean>>({
  tax: false,
})

const form = reactive<documentFormTypes>({
  invoiceDocument: null,
  tax: null,
  referenceDocument: null,
  otherDocument: null,
})

const canReplaceDocument = computed(() => {
  const status = formInject?.status
  return status === 0 || status === -1 || status === 5
})

const list = ref<listFormTypes[]>([
  {
    title: 'Tax Document',
    varName: 'tax',
    varErrorName: 'taxError',
  },
])

const preserveDocumentId = (
  file: responseFileTypes,
  previous: responseFileTypes | null,
): responseFileTypes => {
  const previousId = previous?.id ?? 0
  return {
    ...file,
    id: previousId > 0 ? previousId : file.id || 0,
  }
}

const setFile = (file: responseFileTypes, name: FileFieldKeys) => {
  form[name] = preserveDocumentId(file, form[name])
  isEditingField[name] = false
}

const changeFile = (index: number, name: FileFieldKeys) => {
  isEditingField[name] = true
  pdfUploadRef.value?.[index]?.triggerFileInput?.()
}

const removeFile = (name: FileFieldKeys) => {
  form[name] = null
  isEditingField[name] = false
}

const openDocumentPreview = (file: responseFileTypes | null, label: string) => {
  const signedUrl = (file?.previewPath || file?.path || '').trim()
  openPdfPreview(signedUrl || null, label)
}

watch(
  () => form,
  () => {
    if (formInject) {
      formInject.invoiceDocument = form.invoiceDocument
      formInject.tax = form.tax
      formInject.referenceDocument = form.referenceDocument
      formInject.otherDocument = form.otherDocument
    }
  },
  {
    deep: true,
  },
)

watch(
  () => formInject,
  () => {
    if (formInject) {
      form.invoiceDocument = formInject.invoiceDocument
      form.tax = formInject.tax
      form.referenceDocument = formInject.referenceDocument
      form.otherDocument = formInject.otherDocument
    }
  },
  {
    deep: true,
    immediate: true,
  },
)
</script>

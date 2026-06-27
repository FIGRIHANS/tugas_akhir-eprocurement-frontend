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
        </label>
        <pdfUpload
          ref="pdfUploadRef"
          v-show="!form[item.varName as keyof typeof form]"
          :error="!!form[item.varErrorName as keyof documentFormTypes]"
          :disabled="route.query.isSendSap === 'true'"
          @setFile="setFile($event, item.varName as keyof documentFormTypes)"
        />
        <div
          v-if="form[item.varName as keyof typeof form]"
          class="flex justify-between items-center gap-[8px] flex-1"
        >
          <AttachmentView
            :file-data="getAttachmentData(item.varName as keyof documentFormTypes)"
          />
          <div class="flex items-center gap-2 shrink-0">
            <button
              class="btn btn-icon btn-sm btn-outline btn-primary"
              title="Lihat dokumen"
              @click="previewDocument(getDocumentPath(item.varName as keyof documentFormTypes), item.title)"
            >
              <i class="ki-filled ki-eye"></i>
            </button>
            <span
              v-if="route.query.isSendSap !== 'true'"
              class="border-b border-dashed border-primary text-primary cursor-pointer text-xs font-medium"
              @click="changeFile(index)"
            >
              Edit
            </span>
          </div>
        </div>
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
import { ref, reactive, inject, watch, toRef, type Ref } from 'vue'
import type {
  documentFormTypes,
  documentDetailTypes,
  listFormTypes,
} from '../../../types/invoiceDocument'
import type { formTypes } from '../../../types/invoiceDetailEdit'
import pdfUpload from '@/components/ui/pdfUpload/pdfUpload.vue'
import AttachmentView from '@/components/ui/attachment/AttachmentView.vue'
import UiModal from '@/components/modal/UiModal.vue'
import { isEmpty } from 'lodash'
import { useRoute } from 'vue-router'
import { resolveDocumentPreviewUrl } from '@/composables/documentPreview'

const route = useRoute()

const form = reactive<documentFormTypes>({
  invoiceDocument: null,
  tax: null,
  referenceDocument: null,
  otherDocument: null,
})

const list = ref<listFormTypes[]>([
  {
    title: 'Invoice Document',
    varName: 'invoiceDocument',
    varErrorName: 'invoiceDocumentError',
  },
  {
    title: 'Faktur Pajak',
    varName: 'tax',
    varErrorName: 'taxError',
  },
  {
    title: 'Reference Document',
    varName: 'referenceDocument',
    varErrorName: 'referenceDocumentError',
  },
  {
    title: 'Other Document',
    varName: 'otherDocument',
    varErrorName: 'otherDocumentError',
  },
])

const formInject = inject<Ref<formTypes>>('form')
const pdfUploadRef = ref()

const showPreviewModal = ref(false)
const previewLoading = ref(false)
const previewTitle = ref('Document Preview')
const previewUrl = ref('')
const previewUsesObjectUrl = ref(false)

const getDocument = (name: keyof documentFormTypes) => {
  return form[name] as documentDetailTypes | null
}

const getDocumentPath = (name: keyof documentFormTypes) => {
  return getDocument(name)?.path || ''
}

const getAttachmentData = (name: keyof documentFormTypes) => {
  const doc = getDocument(name)
  if (!doc?.path) return null
  return {
    name: doc.name || '-',
    path: doc.path,
  }
}

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

const previewDocument = async (path: string, label: string) => {
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

const setFile = (file: documentDetailTypes, name: keyof documentFormTypes) => {
  const reftProperty = toRef(form, name)
  reftProperty.value = file
}

const changeFile = (index: number) => {
  pdfUploadRef.value[index].triggerFileInput()
}

watch(
  () => form,
  () => {
    if (formInject) {
      formInject.value.invoiceDocument = form.invoiceDocument
      formInject.value.tax = form.tax
      formInject.value.referenceDocument = form.referenceDocument
      formInject.value.otherDocument = form.otherDocument
    }
  },
  {
    deep: true,
  },
)

watch(
  formInject,
  () => {
    if (!formInject?.value) return
    form.invoiceDocument = isEmpty(formInject.value.invoiceDocument)
      ? null
      : formInject.value.invoiceDocument
    form.tax = isEmpty(formInject.value.tax) ? null : formInject.value.tax
    form.referenceDocument = isEmpty(formInject.value.referenceDocument)
      ? null
      : formInject.value.referenceDocument
    form.otherDocument = isEmpty(formInject.value.otherDocument)
      ? null
      : formInject.value.otherDocument
  },
  {
    deep: true,
    immediate: true,
  },
)
</script>

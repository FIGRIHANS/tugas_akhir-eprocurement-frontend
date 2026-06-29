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
          <span
            v-if="
              (item.varName === 'invoiceDocument' &&
                formInject?.invoiceType !== '2' &&
                formInject?.invoiceType !== '3' &&
                formInject?.invoiceType !== '5') ||
              (item.varName === 'tax' &&
                (formInject?.invoiceType === '3' || formInject?.invoiceType === '4'))
            "
            class="text-red-500 ml-[4px]"
            >*</span
          >
        </label>

        <pdfUpload
          ref="pdfUploadRef"
          v-show="
            (!form[item.varName as keyof documentFormTypes] || isEditingField[item.varName]) &&
            !checkIsView() &&
            canReplaceDocument
          "
          :error="index === 0 && !!formInject?.invoiceDocumentError && !hasAnyDocument"
          :disabled="
            formInject?.status !== 0 && formInject?.status !== -1 && formInject?.status !== 5
          "
          :varName="item.varName"
          @onLoading="(status) => handleChildLoading(status, item.varName)"
          @setFile="setFile($event, item.varName as FileFieldKeys)"
        />

        <div v-show="!form[item.varName as keyof typeof form] && checkIsView()">
          <p>-</p>
        </div>

        <div
          v-if="form[item.varName as keyof documentFormTypes] && !isEditingField[item.varName]"
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
            <span
              v-if="
                (formInject?.status === 0 ||
                  formInject?.status === -1 ||
                  formInject?.status === 5) &&
                item.varName === 'invoiceDocument'
              "
              class="border-b border-dashed border-primary text-primary cursor-pointer text-xs font-medium"
              @click="sendUploadFile"
              >Fill Invoice Data</span
            >
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

    <UiModal
      v-model="showPreviewModal"
      :title="previewTitle"
      size="xl"
      @update:model-value="onPreviewModalToggle"
    >
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

    <UiLoading v-model="isLoading"></UiLoading>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, inject, watch, computed, type Ref } from 'vue'
import type {
  documentFormTypes,
  responseFileTypes,
  listFormTypes,
} from '../../../types/invoiceDocument'
import type { formTypes } from '../../../types/invoiceAddWrapper'
import pdfUpload from '@/components/ui/pdfUpload/pdfUpload.vue'
import AttachmentView from '@/components/ui/attachment/AttachmentView.vue'
import UiModal from '@/components/modal/UiModal.vue'
import { useRoute } from 'vue-router'
import { resolveDocumentPreviewUrl, resolveDocumentUrlForApi } from '@/composables/documentPreview'
import { useInvoiceVerificationStore } from '@/stores/views/invoice/verification'
import UiLoading from '@/components/modal/UiLoading.vue'
import { parseIndoDate } from '@/composables/parseIndoDate'

type FileFieldKeys = 'invoiceDocument' | 'tax' | 'referenceDocument' | 'otherDocument'

const route = useRoute()
const invoiceVerificationStore = useInvoiceVerificationStore()
const formInject = inject<formTypes>('form')
const poGrAutoFetchTick = inject<Ref<number>>('poGrAutoFetchTick', ref(0))
const pdfUploadRef = ref()
const isLoading = ref<boolean>(false)
const hasAutoFilledInvoiceData = ref(false)

const showPreviewModal = ref(false)
const previewLoading = ref(false)
const previewTitle = ref('Document Preview')
const previewUrl = ref('')
const previewUsesObjectUrl = ref(false)

const isEditingField = reactive<Record<string, boolean>>({
  invoiceDocument: false,
  tax: false,
  referenceDocument: false,
  otherDocument: false,
})

const form = reactive<documentFormTypes>({
  invoiceDocument: null,
  tax: null,
  referenceDocument: null,
  otherDocument: null,
})

const hasAnyDocument = computed(() => {
  return !!(form.invoiceDocument || form.tax || form.referenceDocument || form.otherDocument)
})

const canReplaceDocument = computed(() => {
  const status = formInject?.status
  return status === 0 || status === -1 || status === 5
})

const handleChildLoading = (status: boolean, varName: string) => {
  isEditingField[varName] = status
}

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

const list = ref<listFormTypes[]>([
  { title: 'Invoice Document', varName: 'invoiceDocument', varErrorName: 'invoiceDocumentError' },
  {
    title: 'Reference Document',
    varName: 'referenceDocument',
    varErrorName: 'referenceDocumentError',
  },
  { title: 'Other Document', varName: 'otherDocument', varErrorName: 'otherDocumentError' },
])

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

const getDocumentPreviewSource = (file: responseFileTypes | null) => {
  return (file?.previewPath || file?.path || '').trim()
}

const openDocumentPreview = async (file: responseFileTypes | null, label: string) => {
  const source = getDocumentPreviewSource(file)
  if (!source) return

  previewTitle.value = label
  showPreviewModal.value = true
  previewLoading.value = true
  revokePreviewUrl()

  try {
    const url = await resolveDocumentPreviewUrl(source)
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

const sendUploadFile = async () => {
  isLoading.value = true
  try {
    const invoiceDoc = form?.invoiceDocument
    if (!invoiceDoc || !resolveDocumentUrlForApi(invoiceDoc)) return

    const response = await invoiceVerificationStore.uploadFileOcr(invoiceDoc)

    if (formInject && response) {
      const vendorNo = response.taxDocumentNumber || (response as { invoiceNo?: string }).invoiceNo
      if (vendorNo) formInject.invoiceVendorNo = vendorNo
      if (response.taxDocumentDate) {
        formInject.invoiceDate = parseIndoDate(response.taxDocumentDate)
      }
      poGrAutoFetchTick.value += 1
    }
  } catch (error) {
    console.error('Error filling invoice data:', error)
  } finally {
    isLoading.value = false
  }
}

const tryAutoFillFromInvoiceDocument = async () => {
  if (hasAutoFilledInvoiceData.value) return
  if (!resolveDocumentUrlForApi(form?.invoiceDocument)) return
  if (formInject?.invoiceVendorNo?.trim()) return
  if (checkIsView()) return
  if (formInject?.status !== 0 && formInject?.status !== -1 && formInject?.status !== 5) return

  hasAutoFilledInvoiceData.value = true
  await sendUploadFile()
}

const checkIsView = () => route.query.type?.toString().includes('view')

watch(
  () => form,
  () => {
    if (formInject) Object.assign(formInject, form)
  },
  { deep: true },
)

watch(
  () => formInject?.invoiceDocument?.previewPath,
  () => {
    void tryAutoFillFromInvoiceDocument()
  },
  { immediate: true },
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
  { deep: true, immediate: true },
)
</script>

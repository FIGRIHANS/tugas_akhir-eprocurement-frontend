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
            !checkIsView()
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
          <span
            v-if="formInject?.status === 0 || formInject?.status === -1 || formInject?.status === 5"
            class="border-b border-dashed border-primary text-primary cursor-pointer text-xs font-medium"
            @click="changeFile(index)"
            >Edit</span
          >

          <span
            v-if="
              (formInject?.status === 0 || formInject?.status === -1 || formInject?.status === 5) &&
              item.varName === 'invoiceDocument'
            "
            class="border-b border-dashed border-primary text-primary cursor-pointer text-xs font-medium"
            @click="sendUploadFile"
            >Fill Invoice Data</span
          >
        </div>
      </div>
    </div>
    <UiLoading v-model="isLoading"></UiLoading>
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
import pdfUpload from '@/components/ui/pdfUpload/pdfUpload.vue'
import AttachmentView from '@/components/ui/attachment/AttachmentView.vue'
import { useRoute } from 'vue-router'
import { useInvoiceVerificationStore } from '@/stores/views/invoice/verification'
import UiLoading from '@/components/modal/UiLoading.vue'
import { parseIndoDate } from '@/composables/parseIndoDate'
// import type { invoiceOcrData } from '@/views/invoice/types/invoiceOcrData'

type FileFieldKeys = 'invoiceDocument' | 'tax' | 'referenceDocument' | 'otherDocument'

const route = useRoute()
const invoiceVerificationStore = useInvoiceVerificationStore()
// const ocrData = inject<invoiceOcrData>('ocrData')
const formInject = inject<formTypes>('form')
const pdfUploadRef = ref()
const isLoading = ref<boolean>(false)

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

const handleChildLoading = (status: boolean, varName: string) => {
  isEditingField[varName] = status
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

const setFile = (file: responseFileTypes, name: FileFieldKeys) => {
  form[name] = file
  isEditingField[name] = false
}

const changeFile = (index: number) => {
  pdfUploadRef.value[index].triggerFileInput()
}

const sendUploadFile = async () => {
  isLoading.value = true
  try {
    if (form?.invoiceDocument?.previewPath) {
      const response = await invoiceVerificationStore.uploadFileOcr(
        form.invoiceDocument.previewPath,
      )

      if (formInject && response) {
        // Map OCR data to Invoice Header fields as requested
        formInject.invoiceNo = response.taxDocumentNumber // Using taxDocumentNumber as generic document number from OCR
        formInject.invoiceDate = parseIndoDate(response.taxDocumentDate)
      }
    }
  } catch (error) {
    console.error('Error filling invoice data:', error)
  } finally {
    isLoading.value = false
  }
}

const checkIsView = () => route.query.type?.toString().includes('view')

// Sync with formInject
watch(
  () => form,
  () => {
    if (formInject) Object.assign(formInject, form)
  },
  { deep: true },
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

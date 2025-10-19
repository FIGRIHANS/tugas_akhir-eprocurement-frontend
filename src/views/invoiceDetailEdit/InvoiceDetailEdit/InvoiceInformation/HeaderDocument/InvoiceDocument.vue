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
          @setFile="setFile($event, item.varName as keyof documentFormTypes)"
          :disabled="route.query.isSendSap === 'true'"
        />
        <div
          v-if="form[item.varName as keyof typeof form]"
          class="flex justify-between items-center gap-[8px] flex-1"
        >
          <AttachmentView
            :fileData="
              typeof form[item.varName as keyof documentFormTypes] === 'object'
                ? (form[item.varName as keyof documentFormTypes] as documentDetailTypes)
                : null
            "
          />
          <span
            v-if="route.query.isSendSap !== 'true'"
            class="border-b border-dashed border-primary text-primary cursor-pointer text-xs font-medium"
            @click="changeFile(index)"
            >Edit</span
          >
        </div>
      </div>
    </div>
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
import { isEmpty } from 'lodash'
import { useRoute } from 'vue-router'

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
  () => formInject,
  () => {
    if (formInject) {
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
    }
  },
  {
    deep: true,
    immediate: true,
  },
)
</script>

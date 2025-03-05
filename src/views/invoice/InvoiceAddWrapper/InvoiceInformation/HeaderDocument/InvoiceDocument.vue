<template>
  <div class="px-[14px]">
    <p class="mb-[16px] font-semibold text-base">Invoice Header</p>
    <div class="flex flex-col gap-[46px]">
      <div v-for="(item, index) in list" :key="index" class="flex items-center flex-wrap lg:flex-nowrap gap-2.5">
        <label class="form-label max-w-32">
          {{ item.title }}
        </label>
        <pdfUpload
          ref="pdfUploadRef"
          v-show="!form[item.varName as keyof typeof form]"
          :error="!!form[item.varErrorName  as keyof documentFormTypes]"
          @setFile="setFile($event, item.varName as keyof documentFormTypes)" 
        />
        <div v-if="form[item.varName as keyof typeof form]" class="flex justify-between items-center gap-[8px] flex-1">
          <AttachmentView :fileData="typeof form[item.varName as keyof documentFormTypes] === 'object' ? form[item.varName as keyof documentFormTypes] as File : null" />
          <span class="border-b border-dashed border-primary text-primary cursor-pointer text-xs font-medium" @click="changeFile(index)">Edit</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, inject, watch, toRef } from 'vue'
import type { documentFormTypes, listFormTypes } from '../../../types/invoiceDocument'
import type { formTypes } from '../../../types/invoiceAddWrapper'
import pdfUpload from '@/components/ui/pdfUpload/pdfUpload.vue'
import AttachmentView from '@/components/ui/attachment/AttachmentView.vue'

const form = reactive<documentFormTypes>({
  invoiceDocument: null,
  tax: null,
  referenceDocument: null,
  otherDocument: null
})

const list = ref<listFormTypes[]>([
  {
    title: 'Invoice Document',
    varName: 'invoiceDocument',
    varErrorName: 'invoiceDocumentError'
  },
  {
    title: 'Faktur Pajak',
    varName: 'tax',
    varErrorName: 'taxError'
  },
  {
    title: 'Reference Document',
    varName: 'referenceDocument',
    varErrorName: 'referenceDocumentError'
  },
  {
    title: 'Other Document',
    varName: 'otherDocument',
    varErrorName: 'otherDocumentError'
  }
])

const formInject = inject<formTypes>('form')
const pdfUploadRef = ref()

const setFile = (file: File, name: keyof documentFormTypes) => {
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
      formInject.invoiceDocument = form.invoiceDocument
      formInject.tax = form.tax
      formInject.referenceDocument = form.referenceDocument
      formInject.otherDocument = form.otherDocument
    }
  },
  {
    deep: true
  }
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
    immediate: true
  }
)
</script>

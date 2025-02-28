<template>
  <div>
    <div>
    <p class="mb-[16px] font-semibold text-base">Invoice Header</p>
    <div>
      <!-- Invoice Document -->
      <div class="flex items-center flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
        <label class="form-label max-w-32">
          Invoice Document
        </label>
        <pdfUpload v-if="!form.invoiceDocument" :error="form.invoiceDocumentError" @setFile="setFile($event, 'invoiceDocument')" />
        <div v-else class="flex justify-between items-center gap-[8px] flex-1">
          <AttachmentView />
          <span class="border-b border-dashed border-primary text-primary cursor-pointer text-xs font-medium">Edit</span>
        </div>
      </div>
      <!-- Faktur Pajak -->
      <div class="flex items-center flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
        <label class="form-label max-w-32">
          Faktur Pajak
        </label>
        <pdfUpload v-if="!form.tax" :error="form.taxError" @setFile="setFile($event, 'tax')" />
        <div v-else class="flex justify-between items-center gap-[8px] flex-1">
          <AttachmentView />
          <span class="border-b border-dashed border-primary text-primary cursor-pointer text-xs font-medium">Edit</span>
        </div>
      </div>
      <!-- BAST -->
      <div class="flex items-center flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
        <label class="form-label max-w-32">
          BAST
        </label>
        <pdfUpload v-if="!form.bast" :error="form.bastError" @setFile="setFile($event, 'bast')" />
        <div v-else class="flex justify-between items-center gap-[8px] flex-1">
          <AttachmentView />
          <span class="border-b border-dashed border-primary text-primary cursor-pointer text-xs font-medium">Edit</span>
        </div>
      </div>
      <!-- Reference Document -->
      <div class="flex items-center flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
        <label class="form-label max-w-32">
          Reference Document
        </label>
        <pdfUpload v-if="!form.referenceDocument" :error="form.referenceDocumentError" @setFile="setFile($event, 'referenceDocument')" />
        <div v-else class="flex justify-between items-center gap-[8px] flex-1">
          <AttachmentView />
          <span class="border-b border-dashed border-primary text-primary cursor-pointer text-xs font-medium">Edit</span>
        </div>
      </div>
      <!-- Bukti Potong -->
      <div class="flex items-center flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
        <label class="form-label max-w-32">
          Bukti Potong
        </label>
        <pdfUpload v-if="!form.buktiPotong" :error="form.buktiPotongError" @setFile="setFile($event, 'buktiPotong')" />
        <div v-else class="flex justify-between items-center gap-[8px] flex-1">
          <AttachmentView />
          <span class="border-b border-dashed border-primary text-primary cursor-pointer text-xs font-medium">Edit</span>
        </div>
      </div>
      <!-- Other Document -->
      <div class="flex items-center flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
        <label class="form-label max-w-32">
          Other Document
        </label>
        <pdfUpload v-if="!form.otherDocument" :error="form.otherDocumentError" @setFile="setFile($event, 'otherDocument')" />
        <div v-else class="flex justify-between items-center gap-[8px] flex-1">
          <AttachmentView />
          <span class="border-b border-dashed border-primary text-primary cursor-pointer text-xs font-medium">Edit</span>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, inject, watch } from 'vue'
import type { documentFormTypes } from '../../../types/invoiceDocument'
import type { formTypes } from '../../../types/invoiceAddWrapper'
import pdfUpload from '@/components/ui/pdfUpload/pdfUpload.vue'
import AttachmentView from '@/components/ui/attachment/AttachmentView.vue'

const form = reactive<documentFormTypes>({
  invoiceDocument: null,
  tax: null,
  bast: null,
  referenceDocument: null,
  buktiPotong: null,
  otherDocument: null
})

const formInject = inject<formTypes>('form')

const setFile = (file: File, name: keyof documentFormTypes) => {
  form[name] = file
}

watch(
  () => form,
  () => {
    if (formInject) {
      formInject.invoiceDocument = form.invoiceDocument
      formInject.tax = form.tax
      formInject.bast = form.bast
      formInject.referenceDocument = form.referenceDocument
      formInject.buktiPotong = form.buktiPotong
      formInject.otherDocument = form.otherDocument
    }
  },
  {
    deep: true
  }
)
</script>

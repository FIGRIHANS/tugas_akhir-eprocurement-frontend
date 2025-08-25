<template>
  <div class="card flex-1">
    <div class="card-header py-[8px] px-[20px]">
      <div class="border rounded-lg border-gray-300 p-[4px] flex items-center gap-[4px]">
        <button
          class="btn btn-primary"
          :class="{
            'btn-clear info__header': invoiceTypeTab !== 'header',
          }"
          @click="setTab('header')"
        >
          Requisition Header
        </button>
        <button
          class="btn btn-primary"
          :class="{
            'btn-clear info__header': invoiceTypeTab !== 'document',
          }"
          @click="setTab('document')"
        >
          Requisition Document
        </button>
      </div>
    </div>
    <div class="card-body py-[8px] px-[16px] max-h-[380px] overflow-y-auto scroll mr-[16px]">
      <Transition mode="out-in">
        <component :is="contentComponent" />
      </Transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, inject, type Component } from 'vue'
import type { formTypes } from '../../types/invoiceAddWrapper'
import InvoiceHeader from './HeaderDocument/InvoiceHeader.vue'
import InvoiceDocument from './HeaderDocument/InvoiceDocument.vue'

const form = inject<formTypes>('form')
const invoiceTypeTab = ref<string>('header')

const contentComponent = computed(() => {
  const components = {
    header: InvoiceHeader,
    document: InvoiceDocument,
  } as { [key: string]: Component }

  return components[invoiceTypeTab.value]
})

const setTab = (type: string) => {
  invoiceTypeTab.value = type
}

watch(
  () => form,
  () => {
    if (form) {
      const headerError =
        form.companyCodeError ||
        form.invoiceNoVendorError ||
        form.invoiceDateError ||
        form.taxNoInvoiceError ||
        form.descriptionError
      if (!headerError && form.invoiceDocumentError) {
        invoiceTypeTab.value = 'document'
      }
    }
  },
  {
    deep: true,
  },
)
</script>

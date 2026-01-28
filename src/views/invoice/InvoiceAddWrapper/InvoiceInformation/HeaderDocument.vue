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
          Invoice Header
        </button>
        <button
          class="btn btn-primary"
          :class="{
            'btn-clear info__header': invoiceTypeTab !== 'document',
          }"
          @click="setTab('document')"
        >
          Invoice Document
        </button>
        <button
          class="btn btn-primary"
          :class="{
            'btn-clear info__header': invoiceTypeTab !== 'tax',
          }"
          @click="setTab('tax')"
        >
          Tax Document
        </button>
        <button
          class="btn btn-primary"
          :class="{
            'btn-clear info__header': invoiceTypeTab !== 'chat',
          }"
          @click="setTab('chat')"
        >
          <i class="ki-filled ki-message-text-2"></i>
        </button>
      </div>
    </div>
    <div class="card-body py-[8px] px-[16px] max-h-[500px] overflow-y-auto scroll mr-[16px]">
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
import InvoiceTax from './HeaderDocument/InvoiceTax.vue'
import InvoiceChat from './HeaderDocument/InvoiceChat.vue'

const form = inject<formTypes>('form')
const invoiceTypeTab = ref<string>('header')

const contentComponent = computed(() => {
  const components = {
    header: InvoiceHeader,
    document: InvoiceDocument,
    tax: InvoiceTax,
    chat: InvoiceChat
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
        form.invoiceVendorNoError ||
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

<template>
  <div class="card flex-1">
    <div class="card-header py-[8px] px-[20px]">
      <div class="border rounded-lg border-gray-300 p-[4px] flex items-center gap-[4px]">
        <button
          class="btn btn-primary"
          :class="{
            'btn-clear info__header' : invoiceTypeTab !== 'header'
          }"
          @click="setTab('header')"
        >
          Invoice Header
        </button>
        <button
          class="btn btn-primary"
          :class="{
            'btn-clear info__header' : invoiceTypeTab !== 'document'
          }"
          @click="setTab('document')"
        >
          Invoice Document
        </button>
      </div>
    </div>
    <div class="card-body py-[8px] px-[16px] overflow-y-scroll header-document">
      <Transition mode="out-in">
        <component :is="contentComponent" />
      </Transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, type Component } from 'vue'
import InvoiceHeader from './HeaderDocument/InvoiceHeader.vue'
import InvoiceDocument from './HeaderDocument/InvoiceDocument.vue'
import InvoiceNonPoHeader from './HeaderDocument/InvoiceNonPoHeader.vue'

const invoiceTypeTab = ref<string>('header')

const contentComponent = computed(() => {
  const components = {
    header: InvoiceHeader,
    headerNonPo: InvoiceNonPoHeader,
    document: InvoiceDocument
  } as { [key: string]: Component }

  return components[invoiceTypeTab.value]
})

const setTab = (type: string) => {
  invoiceTypeTab.value = type
}
</script>

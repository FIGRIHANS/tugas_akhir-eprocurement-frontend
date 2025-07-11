<template>
  <div v-if="form" class="card">
    <div class="card-header py-[13px] flex items-center justify-between gap-[8px]">
      <div class="tabs" data-tabs="true">
        <button class="tab p-[8px]" :class="{ 'active': tabNow === 'header' }" @click="setTab('header')">
          Invoice Header
        </button>
        <button class="tab p-[8px]" :class="{ 'active': tabNow === 'document' }" @click="setTab('document')">
          Invoice Document
        </button>
      </div>
      <input v-if="isNeedCheck" v-model="form.invoiceHeaderDocumentCheck" class="checkbox" type="checkbox"/>
    </div>
    <div class="card-body overflow-y-scroll invoice-header" :class="{ 'document': tabNow === 'document' }">
      <Transition mode="out-in">
        <component :is="contentComponent" />
      </Transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, defineAsyncComponent, inject, type Component } from 'vue'
import type { formTypes } from '../types/invoiceDetail'

const InvoiceHeader = defineAsyncComponent(() => import('./InvoiceHeaderDocument/InvoiceHeader.vue'))
const InvoiceDocument = defineAsyncComponent(() => import('./InvoiceHeaderDocument/InvoiceDocument.vue'))

defineProps<{
  isNeedCheck: boolean
}>()

const form = inject<formTypes>('form')
const tabNow = ref<string>('header')

const contentComponent = computed(() => {
  const components = {
    header: InvoiceHeader,
    document: InvoiceDocument
  } as { [key: string]: Component }

  return components[tabNow.value]
})

const setTab = (tab: string) => {
  tabNow.value = tab
}
</script>

<style lang="scss" scoped>
@use '../styles/invoice-header-document.scss';
</style>

<template>
  <div class="card">
    <div class="card-header py-[13px]">
      <div class="tabs" data-tabs="true">
        <button class="tab p-[8px]" :class="{ 'active': tabNow === 'header' }" @click="setTab('header')">
          Invoice Header
        </button>
        <button class="tab p-[8px]" :class="{ 'active': tabNow === 'document' }" @click="setTab('document')">
          Invoice Document
        </button>
    </div>
    </div>
    <div class="card-body max-h-[299px]" :class="{ 'document': tabNow === 'document' }">
      <Transition mode="out-in">
        <component :is="contentComponent" />
      </Transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, defineAsyncComponent, type Component } from 'vue'

const InvoiceHeader = defineAsyncComponent(() => import('./InvoiceHeaderDocument/InvoiceHeader.vue'))
const InvoiceDocument = defineAsyncComponent(() => import('./InvoiceHeaderDocument/InvoiceDocument.vue'))

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

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
        <button
          v-if="!isFinanceOfficerVerificator"
          class="tab p-[8px]"
          :class="{ 'active': tabNow === 'chat' }"
          @click="setTab('chat')"
        >
          Chat
        </button>
      </div>
    </div>
    <div class=" py-[8px] px-[16px]  overflow-y-auto " :class="{ 'document': tabNow === 'document' }">
      <Transition mode="out-in">
        <component :is="contentComponent" />
      </Transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, defineAsyncComponent, inject, onMounted, type Component } from 'vue'
import type { formTypes } from '../types/invoiceDetail'
import { useLoginStore } from '@/stores/views/login'

const InvoiceHeader = defineAsyncComponent(() => import('./InvoiceHeaderDocument/InvoiceHeader.vue'))
const InvoiceDocument = defineAsyncComponent(() => import('./InvoiceHeaderDocument/InvoiceDocument.vue'))
const InvoiceChat = defineAsyncComponent(() => import('./InvoiceHeaderDocument/InvoiceChat.vue'))

const loginStore = useLoginStore()
const form = inject<formTypes>('form')
const tabNow = ref<string>('header')

const isFinanceOfficerVerificator = computed(
  () => loginStore.userData?.profile?.profileId === 3002,
)

const contentComponent = computed(() => {
  const components = {
    header: InvoiceHeader,
    document: InvoiceDocument,
    chat: InvoiceChat,
  } as { [key: string]: Component }

  return components[tabNow.value]
})

const setTab = (tab: string) => {
  if (tab === 'chat' && isFinanceOfficerVerificator.value) return
  tabNow.value = tab
}

onMounted(() => {
  if (isFinanceOfficerVerificator.value && tabNow.value === 'chat') {
    tabNow.value = 'header'
  }
})
</script>

<style lang="scss" scoped>
@use '../styles/invoice-header-document.scss';
</style>

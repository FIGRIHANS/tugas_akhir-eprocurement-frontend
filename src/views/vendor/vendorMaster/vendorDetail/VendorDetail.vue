<script lang="ts" setup>
import BreadcrumbView from '@/components/BreadcrumbView.vue'
import type { ITabClosable } from '@/components/ui/atoms/tab-closable/types/tabClosable'
import UiTabClosable from '@/components/ui/atoms/tab-closable/UiTabClosable.vue'
import { onMounted, ref, watch } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const tabs: ITabClosable[] = [
  { id: 'summary-information', label: 'Summary Information' },
  { id: 'data-administrasi', label: 'Data Administrasi', isClosable: true },
  { id: 'data-izin-usaha', label: 'Data Izin Usaha', isClosable: true },
  {
    id: 'data-informasi-pembayaran',
    label: 'Data Informasi Pembayaran',
    isClosable: true,
  },
  { id: 'data-akta-pendirian', label: 'Data Akta Pendirian', isClosable: true },
  { id: 'data-perlengkapan', label: 'Data Perlengkapan', isClosable: true },
  { id: 'data-pengalaman', label: 'Data Pengalaman', isClosable: true },
  { id: 'data-tenaga-ahli', label: 'Data Tenaga Ahli', isClosable: true },
  { id: 'dokumen-lainnya', label: 'Dokumen Lainnya', isClosable: true },
]
const openedTabs = ref<ITabClosable[]>([
  { id: 'summary-information', label: 'Summary Information' },
])

const currentTab = ref('summary-information')

const closeTab = (id: string) => {
  if (currentTab.value === id) {
    const index = openedTabs.value.findIndex((tab) => tab.id === id)
    currentTab.value = openedTabs.value[index - 1].id
  }
  openedTabs.value = openedTabs.value.filter((tab) => tab.id !== id)
}

const addTab = (id: string) => {
  openedTabs.value.push(tabs.find((tab) => tab.id === id)!)
}

watch(currentTab, () => {
  router.push({ name: currentTab.value })
})

onMounted(() => {
  addTab(route.name as string)
  currentTab.value = route.name as string
})
</script>
<template>
  <BreadcrumbView
    title="Vendor Master"
    :routes="[
      { name: 'Vendor Master', to: '/vendor-master' },
      { name: 'Verification Proccess', to: '' },
    ]"
  />
  <UiTabClosable
    :tabs="tabs"
    :opened-tabs="openedTabs"
    v-model:currentTab="currentTab"
    @close-tab="closeTab"
    @add-tab="addTab"
  />
  <RouterView v-slot="{ Component }">
    <component :is="Component" />
  </RouterView>
</template>

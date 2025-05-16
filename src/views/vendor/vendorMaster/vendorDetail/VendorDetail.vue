<script lang="ts" setup>
import BreadcrumbView from '@/components/BreadcrumbView.vue'
import type { ITabClosable } from '@/components/ui/atoms/tab-closable/types/tabClosable'
import UiTabClosable from '@/components/ui/atoms/tab-closable/UiTabClosable.vue'
import { useVendorStore, useVerificationDetailStore } from '@/stores/vendor/vendor'
import { ref, watch } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const vendorStore = useVendorStore()
const verificationStore = useVerificationDetailStore()

const tabs = ref<ITabClosable[]>([
  {
    id: 'summary-information',
    label: 'Summary Information',
  },
  {
    id: 'data-administrasi',
    label: 'Data Administrasi',
    isClosable: true,
  },
  {
    id: 'data-izin-usaha',
    label: 'Data Izin Usaha',
    isClosable: true,
  },
  {
    id: 'data-informasi-pembayaran',
    label: 'Data Informasi Pembayaran',
    isClosable: true,
  },
])

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
  currentTab.value = id
  if (openedTabs.value.some((tab) => tab.id === id)) return
  openedTabs.value.push(tabs.value.find((tab) => tab.id === id)!)
}

watch(currentTab, () => {
  router.push({ name: currentTab.value })
})

watch(
  () => route.name,
  (name) => {
    addTab(name as string)

    if (name === 'summary-information') {
      verificationStore.getData(Number(route.params.id))
    }
  },
  { immediate: true },
)

watch(
  () => vendorStore.vendors,
  (vendor) => {
    if (vendor.items.length && vendor.items[0].approvalStatusId === 1) {
      tabs.value = [
        ...tabs.value,
        { id: 'data-akta-pendirian', label: 'Data Akta Pendirian', isClosable: true },
        { id: 'data-perlengkapan', label: 'Data Perlengkapan', isClosable: true },
        { id: 'data-pengalaman', label: 'Data Pengalaman', isClosable: true },
        { id: 'data-tenaga-ahli', label: 'Data Tenaga Ahli', isClosable: true },
        { id: 'dokumen-lainnya', label: 'Dokumen Lainnya', isClosable: true },
      ]
    }
  },
)

watch(
  () => verificationStore.data,
  (data) => {
    if (
      data.some(
        (item) => item.verificationType === 'Administration approval' && item.status === 'Approved',
      )
    ) {
      tabs.value[1].isVerified = true
    }

    if (
      data.some(
        (item) => item.verificationType === 'Izin usaha approval' && item.status === 'Approved',
      )
    ) {
      tabs.value[2].isVerified = true
    }

    if (
      data.some(
        (item) => item.verificationType === 'Payment approval' && item.status === 'Approved',
      )
    ) {
      tabs.value[3].isVerified = true
    }
  },
)
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

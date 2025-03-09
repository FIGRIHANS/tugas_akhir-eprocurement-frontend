<template>
  <BreadcrumbView
    title="Vendor Master"
    :routes="[{ name: 'Vendor Master', to: '/vendor-master' }]"
  />
  <UiTab :items="tabs" v-model="currentTab" />
  <!-- information -->
  <VendorInformation v-if="currentTab === 'Information'" />

  <!-- Vendor AI System -->
  <div v-if="currentTab === 'Vendor AI System'">AI</div>
  <!-- Dashboard -->
  <div v-if="currentTab === 'Dashboard'">Dashboard</div>
  <!-- Vendor list -->
  <div v-if="currentTab === 'Vendor List'">Vendor List</div>
</template>

<script lang="ts" setup>
import BreadcrumbView from '@/components/BreadcrumbView.vue'
import UiTab from '@/components/ui/atoms/tab/UiTab.vue'
import { onMounted, ref } from 'vue'

import VendorInformation from './components/VendorInformation.vue'
const tabs = [
  { label: 'Information', value: 'Information' },
  { label: 'Vendor AI System', value: 'Vendor AI System' },
  { label: 'Dashboard', value: 'Dashboard' },
  { label: 'Vendor List', value: 'Vendor List' },
]

const currentTab = ref('Information')

onMounted(() => {})
</script>

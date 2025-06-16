<script setup lang="ts">
import BreadcrumbView from '@/components/BreadcrumbView.vue'
import type { ITabItem } from '@/components/ui/atoms/tab/types/tab'
import UiTab from '@/components/ui/atoms/tab/UiTab.vue'
import type { routeTypes } from '@/core/type/components/breadcrumb'
import { ref } from 'vue'
import InformationPage from './InformationPage.vue'
import DashboardAdmin from './DashboardAdmin.vue'

const bcRoutes: routeTypes[] = [
  {
    name: 'Home Vendor',
    to: '/dashboard',
  },
]

const tabItems: ITabItem[] = [
  {
    label: 'Information',
    value: 'information',
  },
  {
    label: 'Dashboard',
    value: 'dashboard',
  },
]
const currentTab = ref<string>('information')
</script>

<template>
  <BreadcrumbView title="Home" :routes="bcRoutes" />
  <UiTab :items="tabItems" v-model="currentTab" />

  <!-- information -->
  <InformationPage v-if="currentTab === 'information'" />
  <DashboardAdmin v-if="currentTab === 'dashboard'" />
</template>

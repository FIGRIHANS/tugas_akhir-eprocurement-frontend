<script setup lang="ts">
import BreadcrumbView from '@/components/BreadcrumbView.vue'
import type { routeTypes } from '@/core/type/components/breadcrumb'
import InformationPage from './InformationPage.vue'

const bcRoutes: routeTypes[] = [
  {
    name: 'Home Vendor',
    to: '/dashboard',
  },
]
</script>

<template>
  <BreadcrumbView title="Home" :routes="bcRoutes" />

  <!-- information -->
  <InformationPage />
</template>

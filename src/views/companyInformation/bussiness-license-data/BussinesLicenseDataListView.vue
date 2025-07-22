<template>
  <div>
    <BreadcrumbView
      title="Payment Information"
      :routes="[
        { name: 'Company Information', to: '/company-information' },
        { name: 'Business License Data', to: '#' },
      ]"
    />
    <PKPTableView />
    <OtherDocTableView />
  </div>
</template>

<script setup lang="ts">
import BreadcrumbView from '@/components/BreadcrumbView.vue'
import PKPTableView from './PKPTableView.vue'
import OtherDocTableView from './OtherDocTableView.vue'
</script>

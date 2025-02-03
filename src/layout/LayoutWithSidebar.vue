<template>
  <LNavbar />
  <LSidebar />

  <main class="ml-[280px] py-4 px-6">
    <RouterView />
  </main>
</template>

<script setup lang="ts">
import LNavbar from '@/components/layout/LayoutNavbar.vue'
import LSidebar from '@/components/layout/LayoutSidebar.vue'

import { RouterView } from 'vue-router'
</script>

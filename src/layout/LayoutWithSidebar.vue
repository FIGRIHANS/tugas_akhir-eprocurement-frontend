<template>
  <LNavbar />
  <LSidebar />

  <p>Layout With Sidebar</p>

  <main>
    <RouterView />
  </main>
</template>

<script setup lang="ts">
import LNavbar from '@/components/layout/LayoutNavbar.vue'
import LSidebar from '@/components/layout/LayoutSidebar.vue'

import { RouterView } from 'vue-router'
</script>

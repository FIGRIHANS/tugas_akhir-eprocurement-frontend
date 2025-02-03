<template>
  <LNavbar full />
  <LSidebar />

  <main class="ml-[280px] py-4 px-6">
    <RouterView />
  </main>
</template>

<script setup lang="ts">
import LNavbar from '@/components/layout/navbar/LNavbar.vue'
import LSidebar from '@/components/layout/LSidebar.vue'

import { RouterView } from 'vue-router'
</script>

<template>
  <LNavbar />

  <p>Layout Base</p>

  <main>
    <RouterView />
  </main>
</template>

<script setup lang="ts">
import LNavbar from '@/components/layout/navbar/LNavbar.vue'
import { RouterView } from 'vue-router'
</script>

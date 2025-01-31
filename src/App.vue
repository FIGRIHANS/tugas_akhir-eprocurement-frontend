<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'

// App.vue
import { nextTick, onMounted } from 'vue'
import KTComponent from './metronic/core/index.spa'
import KTLayout from './metronic/app/layouts/demo1.js'

onMounted(() => {
  nextTick(() => {
    KTComponent.init()
    KTLayout.init()
  })
})
</script>

<template>
  <header class="w-full bg-white shadow-md">
    <div class="">
      <nav class="flex justify-center gap-4 py-4">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

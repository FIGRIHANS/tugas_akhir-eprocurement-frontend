<script setup lang="ts">
import { RouterView } from 'vue-router'

// App.vue
import { nextTick, onMounted } from 'vue'
import KTComponent from './metronic/core/index.spa'
import KTLayout from './metronic/app/layouts/demo1'

onMounted(() => {
  nextTick(() => {
    KTComponent.init()
    KTLayout.init()
  })
})
</script>

<template>
  <RouterView />
</template>

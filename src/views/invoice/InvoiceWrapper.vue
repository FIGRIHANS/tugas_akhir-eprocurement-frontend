<template>
  <div>
    <Breadcrumb title="E-invoice" :routes="routes" />
    <RouterView v-slot="{ Component }">
      <Transition mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { type routeTypes } from '@/core/type/components/breadcrumb'
import Breadcrumb from '@/components/BreadcrumbView.vue'

const routes = ref<routeTypes[]>([
  {
    name: 'E-invoice',
    to: '/invoice'
  }
])
</script>

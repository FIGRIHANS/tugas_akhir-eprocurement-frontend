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
import { useRoute } from 'vue-router'

const route = useRoute()

const routes = ref<routeTypes[]>([])

if (route.name === 'invoice-list') {
  routes.value.push({
    name: 'E-invoice',
    to: '/invoice/list',
  })
} else {
  routes.value.push({
    name: 'Invoice Non PO',
    to: '/invoice/list/non-po',
  })
}
</script>

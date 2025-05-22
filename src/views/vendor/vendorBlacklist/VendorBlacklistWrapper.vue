<script setup lang="ts">
import BreadcrumbView from '@/components/BreadcrumbView.vue'
import UiTab from '@/components/ui/atoms/tab/UiTab.vue'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const tabs = [
  {
    label: 'Pending Blacklist',
    value: 'vendor-pending-blacklist',
  },
  {
    label: 'Blacklist Vendor',
    value: 'vendor-blacklist-list',
  },
]
const currentTab = ref('')

const handleChange = (value: string) => {
  router.push({ name: value })
}

onMounted(() => {
  currentTab.value = route.name as string
})
</script>
<template>
  <BreadcrumbView
    title="Vendor Blacklist"
    :routes="[{ name: 'Vendor blacklist', to: '/vendor-blacklist' }]"
  />
  <UiTab :items="tabs" v-model="currentTab" @update:model-value="handleChange" />
  <RouterView v-slot="{ Component }">
    <Transition>
      <component :is="Component" />
    </Transition>
  </RouterView>
</template>

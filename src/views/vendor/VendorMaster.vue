<script lang="ts" setup>
import BreadcrumbView from '@/components/BreadcrumbView.vue'
import UiTab from '@/components/ui/atoms/tab/UiTab.vue'
import { onMounted, ref } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const tabs = [
  { label: 'Information', value: 'information' },
  { label: 'Dashboard', value: 'dashboard' },
  { label: 'Vendor List', value: 'vendor-list' },
]

const currentTab = ref('information')

const handleChange = (value: string) => {
  router.push({ name: value })
}

onMounted(() => {
  currentTab.value = route.name as string
})
</script>
<template>
  <BreadcrumbView
    title="Vendor Master"
    :routes="[{ name: 'Vendor Master', to: '/vendor-master' }]"
  />
  <UiTab :items="tabs" v-model="currentTab" @update:model-value="handleChange" />
  <RouterView v-slot="{ Component }">
    <Transition mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>
</template>

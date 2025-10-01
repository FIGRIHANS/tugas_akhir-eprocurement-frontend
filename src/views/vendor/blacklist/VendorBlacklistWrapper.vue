<script setup lang="ts">
import BreadcrumbView from '@/components/BreadcrumbView.vue'
import UiTab from '@/components/ui/atoms/tab/UiTab.vue'
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const tabs = computed(() => [
  {
    label: t('vendorBlacklist.tabs.pendingBlacklist'),
    value: 'vendor-pending-blacklist',
  },
  {
    label: t('vendorBlacklist.tabs.blacklistVendor'),
    value: 'vendor-blacklist-list',
  },
])
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
    :title="$t('vendorBlacklist.title')"
    :routes="[{ name: $t('vendorBlacklist.breadcrumb.vendorBlacklist'), to: '/vendor-blacklist' }]"
  />
  <UiTab :items="tabs" v-model="currentTab" @update:model-value="handleChange" />
  <RouterView v-slot="{ Component }">
    <Transition>
      <component :is="Component" />
    </Transition>
  </RouterView>
</template>

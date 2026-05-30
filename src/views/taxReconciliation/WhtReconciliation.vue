<template>
  <div>
    <Breadcrumb :title="pageTitle" :routes="routes" />
    <hr class="-mx-[24px] mb-[24px]" />

    <div class="card shadow-sm border border-gray-200 rounded-xl overflow-hidden">

      <!-- Tab Content -->
      <div class="card-body p-[24px] bg-white">
        <WhtUnifikasiTab v-if="activeTab === 'unifikasi'" />
        <WhtPasal21Tab v-if="activeTab === 'pasal21'" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { type routeTypes } from '@/core/type/components/breadcrumb'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import WhtUnifikasiTab from './components/WhtUnifikasiTab.vue'
import WhtPasal21Tab from './components/WhtPasal21Tab.vue'

const route = useRoute()
const activeTab = ref<'unifikasi' | 'pasal21'>('unifikasi')

const pageTitle = computed(() => activeTab.value === 'unifikasi' ? 'WHT (Unifikasi)' : 'WHT (Pasal 21)')
const routes = computed<routeTypes[]>(() => [
  { name: 'Tax Reconciliation' },
  { name: pageTitle.value },
])

const setActiveTab = (tab: 'unifikasi' | 'pasal21') => {
  activeTab.value = tab
}

const syncTabWithRoute = () => {
  if (route.path.includes('wht-pasal-21')) {
    activeTab.value = 'pasal21'
  } else {
    activeTab.value = 'unifikasi'
  }
}

onMounted(() => {
  syncTabWithRoute()
})

watch(
  () => route.path,
  () => {
    syncTabWithRoute()
  },
)
</script>

<style lang="scss" scoped>
// Using utility classes from Tailwind mostly, but scoped styles for any overrides
</style>

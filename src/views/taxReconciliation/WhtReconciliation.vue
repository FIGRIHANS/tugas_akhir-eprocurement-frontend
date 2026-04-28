<template>
  <div>
    <Breadcrumb title="WHT Reconciliation" :routes="routes" />
    <hr class="-mx-[24px] mb-[24px]" />

    <div class="card shadow-sm border border-gray-200 rounded-xl overflow-hidden">
      <!-- Tab Navigation Header -->
      <div class="card-header py-[8px] px-[20px]">
      <div class="flex items-center border border-gray-200 rounded-lg overflow-hidden text-sm">
        <button
          :class="[
            'px-4 py-2 font-medium transition-colors',
            activeTab === 'unifikasi'
              ? 'bg-primary text-white'
              : 'bg-white text-gray-500 hover:bg-gray-50',
          ]"
          @click="setActiveTab('unifikasi')"
        >
          WHT - Unifikasi (BPU)
        </button>
        <button
          :class="[
            'px-4 py-2 font-medium transition-colors border-l border-gray-200',
            activeTab === 'pasal21'
              ? 'bg-primary text-white'
              : 'bg-white text-gray-500 hover:bg-gray-50',
          ]"
          @click="setActiveTab('pasal21')"
        >
          WHT - Pasal 21
        </button>
      </div>
    </div>

      <!-- Tab Content -->
      <div class="card-body p-[24px] bg-white">
        <WhtUnifikasiTab v-if="activeTab === 'unifikasi'" />
        <WhtPasal21Tab v-if="activeTab === 'pasal21'" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { type routeTypes } from '@/core/type/components/breadcrumb'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import WhtUnifikasiTab from './components/WhtUnifikasiTab.vue'
import WhtPasal21Tab from './components/WhtPasal21Tab.vue'

const route = useRoute()

const routes = ref<routeTypes[]>([
  {
    name: 'Tax Reconciliation',
    to: '/tax-reconciliation',
  },
  {
    name: 'WHT Reconciliation',
    to: '/wht-reconciliation',
  },
])

const activeTab = ref<'unifikasi' | 'pasal21'>('unifikasi')

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

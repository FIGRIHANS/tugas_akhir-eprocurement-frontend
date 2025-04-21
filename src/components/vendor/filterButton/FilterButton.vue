<script setup lang="ts">
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import { useRoute, useRouter, type LocationQueryValue } from 'vue-router'
import type { IFilterButton } from './types/filterButton'
import { ref, watch } from 'vue'

const route = useRoute()
const router = useRouter()

const filters = ref<IFilterButton[]>([])

watch(
  () => route.query,
  (query) => {
    filters.value = Object.entries(query)
      .filter(([key]) => key !== 'page')
      .filter(([key]) => key !== 'searchQuery')
      .map(([key, value]) => ({ key, value }))
  },
  { immediate: true, deep: true },
)

const handleRemoveFilter = (key: string, value?: LocationQueryValue) => {
  const query = { ...route.query }

  if (Array.isArray(query[key])) {
    query[key] = query[key].filter((current) => current !== value)
  } else {
    delete query[key]
  }

  router.push({ query })
}
</script>
<template>
  <div v-if="filters.length > 0" class="flex gap-3 flex-wrap mb-3 items-center">
    <h3 class="font-semibold text-lg">Filter</h3>
    <!-- iterate over filters -->
    <template v-for="filter in filters" :key="filter.key">
      <!-- if filters value is array then iterate -->
      <template v-if="Array.isArray(filter.value)">
        <div
          class="btn btn-outline btn-secondary"
          v-for="value in filter.value"
          :key="value?.toString()"
        >
          <span class="text-gray-500">{{ filter.key }}</span>
          <span class="font-semibold">{{ value }}</span>
          <UiIcon name="cross" @click="handleRemoveFilter(filter.key, value)" />
        </div>
      </template>
      <!-- else -->
      <div class="btn btn-outline btn-secondary" v-else>
        <span class="text-gray-500">{{ filter.key }}</span>
        <span class="font-semibold">{{ filter.value }}</span>
        <UiIcon name="cross" @click="handleRemoveFilter(filter.key)" />
      </div>
    </template>
  </div>
</template>

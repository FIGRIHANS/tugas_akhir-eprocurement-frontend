<template>
  <div class="flex overflow-x-auto gap-3 mb-5 items-center" v-if="filteredFilters.length">
    <div class="font-medium text-lg text-gray-800">Filter</div>
    <div class="btn btn-light btn-sm" v-for="(filter, index) in filteredFilters" :key="index">
      <span class="text-gray-500">{{ filtersKey.find((f) => f.item === filter.key)?.value }}</span>
      <span class="font-semibold">
        {{ filter.value }}
      </span>
      <UiIcon name="cross" @click="handleRemoveFilter(filter.key)" />
    </div>
    <UiButton variant="light" size="sm" class="btn-clear" @click="handleResetFilter">
      Reset Filter
    </UiButton>
  </div>
</template>
<script lang="ts" setup>
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter, type LocationQueryValue } from 'vue-router'

const router = useRouter()
const route = useRoute()
const filtersKey: { item: string; value: string }[] = [{ item: 'MasaBlacklist', value: 'Period' }]

const filters = ref<{ key: string; value: LocationQueryValue | LocationQueryValue[] }[]>([])

const filteredFilters = computed(() =>
  filters.value.filter((filter) => filter.key !== 'page' && filter.key !== 'searchQuery'),
)

const handleRemoveFilter = (key: string) => {
  const query = { ...route.query }
  delete query[key]

  router.push({ query })
}

const handleResetFilter = () => {
  const query = { ...route.query }
  filters.value.forEach((filter) => {
    delete query[filter.key]
  })

  router.push({ query })
}

watch(
  () => route.query,
  (query) => {
    filters.value = Object.entries(query).map(([key, value]) => ({ key, value }))
  },
  { immediate: true, deep: true },
)
</script>

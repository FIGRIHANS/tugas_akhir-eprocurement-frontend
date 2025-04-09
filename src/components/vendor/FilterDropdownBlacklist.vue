<script lang="ts" setup>
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import { reactive, watch } from 'vue'
import { useRoute, useRouter, type LocationQueryValue } from 'vue-router'

const router = useRouter()
const route = useRoute()

const periods = [
  { label: 'Sementara', value: 'Sementara' },
  { label: 'Selamanya', value: 'Selamanya' },
  { label: 'Semuanya', value: 'Semuanya' },
]

const filters: { tipe: Array<string> | string | LocationQueryValue[] } = reactive({
  tipe: [],
})

const handleFilter = () => {
  const query = Object.fromEntries(Object.entries(filters).filter(([, value]) => value))
  router.push({ query })
}

const handleReset = () => {
  filters.tipe = []
  router.replace({ query: {} })
}

watch(
  () => route.query,
  (query) => {
    if (query.tipe) {
      filters.tipe = Array.isArray(query.tipe) ? [...query.tipe] : [query.tipe]
    } else {
      filters.tipe = []
    }
  },
  { immediate: true },
)
</script>
<template>
  <form @submit.prevent="handleFilter">
    <div class="flex items-center space-x-3">
      <div
        class="dropdown"
        data-dropdown="true"
        data-dropdown-trigger="click"
        data-dropdown-placement="bottom-end"
      >
        <UiButton class="dropdown-toggle">
          <UiIcon variant="outline" name="filter" />
          <span>Filter</span>
        </UiButton>
        <div class="dropdown-content w-full max-w-60 p-4 space-y-5">
          <h1 class="text-lg font-semibold text-gray-700 mb-5">Filter</h1>
          <template v-for="period in periods" :key="period">
            <label class="form-label flex items-center gap-2.5">
              <input
                class="checkbox"
                type="checkbox"
                :value="period.value"
                v-model="filters.tipe"
              />
              {{ period.label }}
            </label>
          </template>
          <div class="flex items-center space-x-3">
            <UiButton
              :outline="true"
              class="flex-1"
              type="reset"
              @click="handleReset"
              data-dropdown-dismiss="true"
            >
              <UiIcon variant="filled" name="arrows-circle" />
              Reset
            </UiButton>
            <UiButton class="flex-1" data-dropdown-dismiss="true">
              <UiIcon variant="filled" name="check-circle" />
              Terapkan
            </UiButton>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>

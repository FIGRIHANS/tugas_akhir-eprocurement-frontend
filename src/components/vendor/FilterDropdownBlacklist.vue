<script lang="ts" setup>
import { useBlacklistPeriodStore } from '@/stores/vendor/reference'
import { onMounted, reactive, watch } from 'vue'
import { useRoute } from 'vue-router'
import FilterDropdown from './filterDropdown/FilterDropdown.vue'
import UiIcon from '../ui/atoms/icon/UiIcon.vue'

const route = useRoute()

const blacklistPeriod = useBlacklistPeriodStore()

const filters = reactive({
  MasaBlacklist: '',
})

watch(
  () => route.query,
  (query) => {
    filters.MasaBlacklist = (query.MasaBlacklist as string) || ''
  },
  { immediate: true },
)

onMounted(blacklistPeriod.getPeriod)
</script>
<template>
  <FilterDropdown :filters="filters">
    <template v-for="period in blacklistPeriod.period" :key="period">
      <label class="form-label flex items-center gap-2.5">
        <input
          class="peer"
          name="masa-blacklist"
          type="radio"
          :value="period.value"
          v-model="filters.MasaBlacklist"
          hidden
        />
        <div
          class="h-6 w-6 flex items-center justify-center peer-checked:bg-primary rounded-md text-white border border-primary"
        >
          <UiIcon
            name="check"
            variant="duotone"
            :class="{ hidden: filters.MasaBlacklist !== period.value }"
          />
        </div>
        <span class="font-medium">{{ period.value }}</span>
      </label>
    </template>
  </FilterDropdown>
</template>

<template>
  <div class="flex overflow-x-auto gap-3 mb-5 items-center" v-if="filteredFilters.length">
    <div class="font-medium text-lg text-gray-800">Filter</div>
    <div class="btn btn-light btn-sm" v-for="(filter, index) in filteredFilters" :key="index">
      <span class="text-gray-500">{{ filtersKey.find((f) => f.item === filter.key)?.value }}</span>
      <span class="font-semibold">
        <template v-if="filter.key === 'statusId'">
          {{ verifStatus.data.find((type) => type.code === filter.value)?.value }}
        </template>

        <template v-else-if="filter.key === 'categoryId'">
          {{
            categories.categories.find((item) => item.companyCategoryId.toString() === filter.value)
              ?.companyCategoryName
          }}
        </template>

        <template v-else>
          {{
            filter.key === 'startDate' || filter.key === 'endDate'
              ? formatDate(filter.key)
              : filter.value
          }}
        </template>
      </span>
      <UiIcon name="cross" @click="handleRemoveFilter(filter.key)" />
    </div>
    <UiButton variant="light" size="sm" class="btn-clear" @click="handleResetFilter">
      {{ $t('vendor.masterFilters.reset') }}
    </UiButton>
  </div>
</template>
<script lang="ts" setup>
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import { formatDate } from '@/composables/date-format'
import { useVendorCategoryStore } from '@/stores/vendor/category'
import { useVerificationStatus } from '@/stores/vendor/reference'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter, type LocationQueryValue } from 'vue-router'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const categories = useVendorCategoryStore()
const verifStatus = useVerificationStatus()

const filtersKey = computed(() => [
  { item: 'statusId', value: 'Status' },
  { item: 'categoryId', value: t('vendor.masterFilters.category') },
  { item: 'startDate', value: t('vendor.masterFilters.registrationStartDate') },
  { item: 'endDate', value: t('vendor.masterFilters.registrationEndDate') },
])

const filters = ref<{ key: string; value: LocationQueryValue | LocationQueryValue[] }[]>([])

const filteredFilters = computed(() =>
  filters.value.filter((filter) => filter.key !== 'page' && filter.key !== 'searchAny'),
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

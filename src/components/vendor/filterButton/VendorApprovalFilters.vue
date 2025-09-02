<template>
  <div class="flex overflow-x-auto gap-3 mb-5 items-center" v-if="filteredFilters.length">
    <div class="font-medium text-lg text-gray-800">Filter</div>
    <div class="btn btn-light btn-sm" v-for="(filter, index) in filteredFilters" :key="index">
      <span class="text-gray-500 text-nowrap">{{
        filtersKey.find((f) => f.item === filter.key)?.value
      }}</span>
      <span class="font-semibold text-nowrap">
        {{
          filter.key === 'SendApprovalDate'
            ? moment(filter.value as string).format('LL')
            : filter.value
        }}
      </span>
      <UiIcon name="cross" @click="handleRemoveFilter(filter.key)" />
    </div>
    <UiButton variant="light" size="sm" class="btn-clear text-nowrap" @click="handleResetFilter">
      Reset Filter
    </UiButton>
  </div>
</template>
<script lang="ts" setup>
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'

import moment from 'moment'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter, type LocationQueryValue } from 'vue-router'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const filtersKey = computed(() => [
  { item: 'ApprovalStatusName', value: 'Status' },
  { item: 'CompanyCategoryName', value: t('vendor.approvalFilters.category') },
  { item: 'SendApprovalDate', value: t('vendor.approvalFilters.approvalDateSent') },
  { item: 'ApprovalTypeName', value: 'Approval Type' },
])

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

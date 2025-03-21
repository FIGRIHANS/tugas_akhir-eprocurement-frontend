<script setup lang="ts">
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import { useRoute, useRouter, type LocationQueryValue } from 'vue-router'

const route = useRoute()
const router = useRouter()
const props = defineProps<{
  filter: {
    key: string
    value: LocationQueryValue | LocationQueryValue[]
  }
}>()

const handleRemoveFilter = () => {
  const query = { ...route.query }
  delete query[props.filter.key]
  router.push({ query })
}
</script>
<template>
  <div class="btn btn-outline btn-secondary">
    <span class="text-gray-500">{{ filter.key }}</span>
    <span class="font-semibold">{{ filter.value }}</span>
    <UiIcon name="cross" @click="handleRemoveFilter" />
  </div>
</template>

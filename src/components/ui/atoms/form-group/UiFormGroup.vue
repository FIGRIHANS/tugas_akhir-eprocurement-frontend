<template>
  <div class="flex flex-col gap-[24px]">
    <h2 v-if="title" class="font-semibold leading-[25px] pb-[10px] border-b border-gray-200">
      {{ title }}
    </h2>
    <div :class="['grid gap-[24px]', gridCols, bodyClass]">
      <slot />
    </div>
    <hr v-if="!hideBorder" class="border-gray-300" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { IFormGroupProps } from './types/form-group'

const props = withDefaults(defineProps<IFormGroupProps>(), {
  hideBorder: false,
  grid: 1,
})

const gridCols = computed(() => {
  const gridClasses: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
    7: 'grid-cols-7',
    8: 'grid-cols-8',
    9: 'grid-cols-9',
    10: 'grid-cols-10',
    11: 'grid-cols-11',
    12: 'grid-cols-12',
  }
  return gridClasses[props.grid] || 'grid-cols-1' // Fallback to `grid-cols-1`
})
</script>

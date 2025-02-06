<template>
  <div class="flex flex-col gap-[24px]">
    <h2 v-if="title" class="font-semibold leading-[25px]">{{ title }}</h2>
    <div class="grid gap-[24px]" :class="`grid-cols-${grid}`">
      <slot />
    </div>
    <hr v-if="!hideBorder" class="border-gray-300">
  </div>
</template>

<script lang="ts" setup>
import type { IFormGroupProps } from './types/form-group';

withDefaults(defineProps<IFormGroupProps>(), {
  hideBorder: false,
  grid: 1
})
</script>

<template>
  <h2 class="font-semibold leading-[25px]">{{ title }}</h2>
    <slot />
  <hr v-if="!hideBorder" class="border-gray-300">
</template>

<script lang="ts" setup>
import type { IFormGroupProps } from './types/form-group';

withDefaults(defineProps<IFormGroupProps>(), {
  hideBorder: false
})
</script>

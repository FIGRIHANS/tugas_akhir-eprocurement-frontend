<template>
  <i :class="classes" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { IIconProps } from './types/icon'

const props = withDefaults(defineProps<IIconProps>(), {
  variant: 'outline',
})

const classes = computed(() => {
  return [`ki-${props.variant}`, `ki-${props.name}`]
})
</script>

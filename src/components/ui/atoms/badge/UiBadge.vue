<template>
  <span :class="classes">
    <slot></slot>
  </span>
</template>

<script setup lang="ts">
type UiBadgePropsType = {
  outline?: boolean
  variant?: 'primary' | 'success' | 'info' | 'danger' | 'warning' | 'dark' | 'secondary' | 'light'
  size?: 'sm' | 'md' | 'lg'
  pill?: boolean
}

import { computed } from 'vue'

const props = withDefaults(defineProps<UiBadgePropsType>(), {
  variant: 'primary',
  size: 'md',
})

const classes = computed(() => {
  return [
    'badge',
    `badge-${props.variant}`,
    `badge-${props.size}`,
    {
      'badge-outline': props.outline,
      'badge-pill': props.pill,
    },
  ]
})
</script>

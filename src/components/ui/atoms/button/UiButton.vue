<template>
  <button :class="classes">
    <slot>Button</slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { IButtonProps } from './types/button'

const props = withDefaults(defineProps<IButtonProps>(), {
  outline: false,
  variant: 'primary',
  size: 'md',
  icon: false,
  clear: false,
})

const classes = computed(() => {
  return [
    'btn',
    `btn-${props.variant}`,
    `btn-${props.size}`,
    {
      'btn-outline': props.outline,
      'btn-icon': props.icon,
      'btn-clear': props.clear,
    },
  ]
})
</script>

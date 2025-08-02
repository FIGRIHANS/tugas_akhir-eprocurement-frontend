<template>
  <button :class="classes" :disabled="disabled">
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
  disabled: false,
})

const classes = computed(() => {
  return [
    'btn',
    `btn-${props.variant}`,
    `btn-${props.size}`,
    {
      'btn-outline': props.outline,
      'btn-icon': props.icon,
    },
  ]
})
</script>

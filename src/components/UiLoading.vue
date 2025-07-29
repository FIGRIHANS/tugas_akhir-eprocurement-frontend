<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    size?: 'sm' | 'md' | 'lg'
    variant?: 'primary' | 'danger' | 'success' | 'white'
  }>(),
  {
    size: 'sm',
    variant: 'primary',
  },
)

const classes = {
  'w-4 h-4': props.size === 'sm',
  'w-6 h-6': props.size === 'md',
  'w-8 h-8': props.size === 'lg',
  'border-t-primary border-primary-clarity': props.variant === 'primary',
  'border-t-success border-success-clarity': props.variant === 'success',
  'border-t-danger border-danger-clarity': props.variant === 'danger',
  'border-t-transparent border-secondary': props.variant === 'white',
}
</script>
<template>
  <span class="rounded-full border-2 animate-spin inline-block" :class="classes"> </span>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: 'sm' | 'md' | 'lg'
  }>(),
  {
    size: 'sm',
  },
)

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
}
</script>
<template>
  <span
    class="border-blue-200 rounded-full border-2 border-t-primary animate-spin inline-block"
    :class="sizeClasses[size]"
  >
  </span>
</template>

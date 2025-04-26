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
  <span class="relative">
    <div
      class="absolute inset-0 border-blue-200 rounded-full border-2"
      :class="sizeClasses[size]"
    ></div>
    <div
      class="absolute inset-0 border-transparent border-2 border-t-blue-400 rounded-full animate-spin"
      :class="sizeClasses[size]"
    ></div>
  </span>
</template>

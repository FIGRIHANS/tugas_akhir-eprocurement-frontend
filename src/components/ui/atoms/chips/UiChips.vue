<template>
  <div :class="['px-3 py-1 rounded-full text-sm flex flex-row justify-center w-fit', chipColor]">
    {{ chipText }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  text: string | number
  color?: 'green' | 'blue' | 'red' | 'yellow' | string
}

const props = withDefaults(defineProps<Props>(), {
  color: 'green',
})

const chipText = computed(() => props.text)

const chipColor = computed(() => {
  const colorMap = {
    green: 'bg-green-100 text-green-800 ring-1 ring-green-500 text-[#04B440] ',
    blue: 'bg-blue-100 text-blue-800 ring-1 ring-blue-500 text-[#056EE9] ',
    red: 'bg-red-100 text-red-800 ring-1 ring-red-500 text-[#D81A48]',
    yellow: 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-500 text-[#DFA000]',
  }
  return colorMap[props.color as keyof typeof colorMap] || colorMap['green']
})
</script>

<template>
  <tr v-for="row in rows" :key="`skeleton-row-${row}`" class="animate-pulse" aria-hidden="true">
    <td v-for="col in columns" :key="`skeleton-cell-${row}-${col}`" class="py-3">
      <div
        class="rounded bg-gray-200"
        :class="getCellClass(col)"
      ></div>
    </td>
  </tr>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    columns?: number
    rows?: number
  }>(),
  {
    columns: 8,
    rows: 8,
  },
)

const getCellClass = (col: number) => {
  if (col === 0) return 'h-8 w-20'
  if (col === 1) return 'h-6 w-24'
  return 'h-4 w-full min-w-[72px]'
}
</script>

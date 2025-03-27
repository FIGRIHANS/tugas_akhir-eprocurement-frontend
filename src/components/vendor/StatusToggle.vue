<script setup lang="ts">
defineProps<{ id: string | number }>()
</script>
<template>
  <label class="switch">
    <input name="check" type="checkbox" value="1" class="switch-on:checked:!bg-success" />
    <span class="switch-label"> Not Active </span>
  </label>
</template>

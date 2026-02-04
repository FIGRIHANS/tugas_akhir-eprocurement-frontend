<script setup lang="ts">
    const open = defineModel<boolean>()
</script>
<template>
<div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center"
>
    <!-- Spinner -->
    <div class="spinner"></div>

    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/60"></div>
</div>
</template>
<style lang="css">
.spinner {
  position: relative;
  z-index: 10;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 4px solid rgba(208, 230, 240, 0.651);
  border-top-color: #177cff;
  animation: spin 0.9s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
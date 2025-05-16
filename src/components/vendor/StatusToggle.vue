<script setup lang="ts">
import { ref } from 'vue'
import VendorActiveModal from './VendorActiveModal/VendorActiveModal.vue'

defineProps<{ id: string | number; status: boolean }>()
const modal = ref(false)
</script>
<template>
  <label class="switch">
    <input
      name="check"
      type="checkbox"
      :checked="status"
      class="switch-on:checked:!bg-success"
      @click="modal = true"
      readonly
    />
    <span class="switch-label text-nowrap">{{ status ? 'Active' : 'Not Active' }}</span>
  </label>

  <VendorActiveModal :open="modal" :id="id" nama-vendor="Apalah daya" @close="modal = !modal" />
</template>

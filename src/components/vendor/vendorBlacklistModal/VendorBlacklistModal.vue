<script setup lang="ts">
import UiModal from '@/components/modal/UiModal.vue'
import type { IVendorBlacklistModalProps } from './types/vendorBlacklistModal'
import UiSelect from '@/components/ui/atoms/select/UiSelect.vue'
defineProps<IVendorBlacklistModalProps>()
defineEmits(['close'])
</script>
<template>
  <UiModal :open="open" @close="$emit('close')" title="Blacklist Vendor" size="sm">
    <form action="">
      <UiSelect></UiSelect>
    </form>
  </UiModal>
</template>

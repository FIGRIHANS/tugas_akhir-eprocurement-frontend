<script setup lang="ts">
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import VendorIzinUsahaCard from '@/components/vendor/vendorIzinUsahaCard/VendorIzinUsahaCard.vue'
</script>

<template>
  <div class="space-y-5">
    <VendorIzinUsahaCard />
    <div class="flex justify-end gap-3">
      <UiButton :outline="true">
        <UiIcon name="black-left" variant="duotone" />
        <span> Back </span>
      </UiButton>
      <UiButton><UiIcon name="check-squared" variant="duotone" /><span>Verify</span></UiButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import VendorAdministrasiCard from '@/components/vendor/vendorAdministrasiCard/VendorAdministrasiCard.vue'
</script>
<template>
  <div class="space-y-5">
    <VendorAdministrasiCard />
    <div class="flex justify-end gap-3">
      <UiButton :outline="true">
        <UiIcon name="black-left" variant="duotone" />
        Back</UiButton
      >
      <UiButton><UiIcon name="check-squared" variant="duotone" />Verify</UiButton>
    </div>
  </div>
</template>

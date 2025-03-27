<script setup lang="ts">
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import VendorPaymentInformationCard from '@/components/vendor/vendorPaymentInformationCard/VendorPaymentInformationCard.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const handleBack = () => {
  router.go(-1)
}
</script>

<template>
  <div class="space-y-5">
    <VendorPaymentInformationCard />
    <div class="flex justify-end gap-3">
      <UiButton :outline="true" @click="handleBack">
        <UiIcon name="black-left" variant="duotone" />
        <span> Back </span>
      </UiButton>
      <UiButton><UiIcon name="check-squared" variant="duotone" />Verify</UiButton>
    </div>
  </div>
</template>

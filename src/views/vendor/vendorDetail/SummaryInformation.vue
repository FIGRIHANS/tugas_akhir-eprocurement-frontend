<script lang="ts" setup>
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import { useRoute, useRouter } from 'vue-router'
import AdministrativeCard from '@/components/vendor/cards/AdministrativeCard.vue'
import LicenseCard from '@/components/vendor/cards/LicenseCard.vue'
import PaymentCard from '@/components/vendor/cards/PaymentCard.vue'

const route = useRoute()
const router = useRouter()
</script>
<template>
  <div class="space-y-5">
    <!-- Card administrasi -->
    <AdministrativeCard />

    <!-- card data izin usaha -->
    <LicenseCard />

    <!-- card payment information -->
    <PaymentCard />

    <div class="flex justify-between">
      <UiButton :outline="true" @click="router.go(-1)">
        <UiIcon name="black-left" variant="duotone" />
        <span> Back </span>
      </UiButton>

      <div v-if="route.name === 'vendor-verification-detail'">
        <UiButton :outline="true" variant="danger" class="ml-auto">
          <UiIcon name="cross-circle" variant="duotone" />
          <span> Reject </span>
        </UiButton>
        <UiButton>
          <UiIcon name="check-squared" variant="duotone" />
          <span> Verify </span>
        </UiButton>
      </div>
    </div>
  </div>
</template>

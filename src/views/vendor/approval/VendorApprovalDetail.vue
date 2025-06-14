<script setup lang="ts">
import BreadcrumbView from '@/components/BreadcrumbView.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiTab from '@/components/ui/atoms/tab/UiTab.vue'
import AdministrativeCard from '@/components/vendor/cards/AdministrativeCard.vue'
import LicenseCard from '@/components/vendor/cards/LicenseCard.vue'
import PaymentCard from '@/components/vendor/cards/PaymentCard.vue'
</script>
<template>
  <BreadcrumbView
    title="Approval Verifikasi Vendor"
    :routes="[
      { name: 'Approval', to: '/vendor-approval' },
      { name: 'Approval Verifikasi Vendor', to: '/vendor-approval' },
    ]"
  />
  <UiTab
    :items="[{ label: 'Detail Information Vendor ', value: 'detail' }]"
    model-value=""
    item-class="text-primary"
  />
  <div class="space-y-5">
    <AdministrativeCard />
    <LicenseCard />
    <PaymentCard />
    <div class="flex justify-end">
      <UiButton :outline="true" @click="$router.back()">
        <UiIcon name="black-left" variant="duotone" />
        <span>Back</span>
      </UiButton>
    </div>
  </div>
</template>

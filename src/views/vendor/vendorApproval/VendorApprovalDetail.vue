<script setup lang="ts">
import BreadcrumbView from '@/components/BreadcrumbView.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiTab from '@/components/ui/atoms/tab/UiTab.vue'
import VendorAdministrasiCard from '@/components/vendor/vendorAdministrasiCard/VendorAdministrasiCard.vue'
import VendorIzinUsahaCard from '@/components/vendor/vendorIzinUsahaCard/VendorIzinUsahaCard.vue'
import VendorPaymentInformationCard from '@/components/vendor/vendorPaymentInformationCard/VendorPaymentInformationCard.vue'
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
    :items="[{ label: 'Detail Informasi Vendor', value: 'detail' }]"
    model-value=""
    item-class="text-primary"
  />
  <div class="space-y-5">
    <VendorAdministrasiCard />
    <VendorIzinUsahaCard />
    <VendorPaymentInformationCard />
    <div class="flex justify-end">
      <UiButton :outline="true" @click="$router.back()">
        <UiIcon name="black-left" variant="duotone" />
        <span>Back</span>
      </UiButton>
    </div>
  </div>
</template>

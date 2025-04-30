<script lang="ts" setup>
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import VendorAdministrasiCard from '@/components/vendor/vendorAdministrasiCard/VendorAdministrasiCard.vue'
import VendorIzinUsahaCard from '@/components/vendor/vendorIzinUsahaCard/VendorIzinUsahaCard.vue'
import VendorPaymentInformationCard from '@/components/vendor/vendorPaymentInformationCard/VendorPaymentInformationCard.vue'
import { useVendorStore } from '@/stores/vendor/vendor'

const vendorStore = useVendorStore()
</script>
<template>
  <div class="space-y-5">
    <!-- Card administrasi -->
    <VendorAdministrasiCard />

    <!-- card data izin usaha -->
    <VendorIzinUsahaCard />

    <!-- card payment information -->
    <VendorPaymentInformationCard />

    <div class="flex justify-end">
      <UiButton
        :disabled="
          !vendorStore.isAdministrationVerified ||
          !vendorStore.isLicenseVerified ||
          !vendorStore.isBankVerified
        "
        variant="primary"
      >
        <UiIcon name="paper-plane" />
        Send Approval
      </UiButton>
    </div>
  </div>
</template>

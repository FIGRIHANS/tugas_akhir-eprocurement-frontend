<script setup lang="ts">
import LogoApproved from '@/assets/svg/LogoApproved.vue'
import LogoSAP from '@/assets/svg/LogoSAP.vue'
import BreadcrumbView from '@/components/BreadcrumbView.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiTab from '@/components/ui/atoms/tab/UiTab.vue'
import AdministrativeCard from '@/components/vendor/cards/AdministrativeCard.vue'
import LicenseCard from '@/components/vendor/cards/LicenseCard.vue'
import PaymentCard from '@/components/vendor/cards/PaymentCard.vue'
import { useApprovalStore } from '@/stores/vendor/approval'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const approvalStore = useApprovalStore()

onMounted(() => {
  approvalStore.getMatrix({
    vendorId: Number(route.params.id),
  })
})
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
    <div
      v-if="approvalStore.matrixData.some((data) => data.approvalStatus === 1)"
      class="rounded-lg border border-blue-200 bg-blue-50 p-4 flex items-center gap-4"
    >
      <LogoApproved />
      <div>
        <h2 class="font-semibold text-base text-gray-800">Successfully Approved</h2>
        <p class="font-medium text-2sm text-gray-600">
          Vendor has been successfully approved. Next, send the invoice to SAP for processing.
        </p>
      </div>
    </div>

    <div
      v-if="approvalStore.matrixData.some((data) => data.approvalStatus === 3)"
      class="rounded-lg border border-blue-200 bg-blue-50 p-4 flex items-center gap-4"
    >
      <LogoSAP class="w-16 h-auto" />
      <div>
        <h2 class="font-semibold text-base text-gray-800">Successfully Send to SAP</h2>
        <p class="font-medium text-2sm text-gray-600">Vendor has been successfully send to SAP.</p>
      </div>
    </div>
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

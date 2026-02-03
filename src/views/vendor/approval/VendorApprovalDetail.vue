<script setup lang="ts">
import LogoApproved from '@/assets/svg/LogoApproved.vue'
import LogoRejected from '@/assets/svg/LogoRejected.vue'
import LogoSAP from '@/assets/svg/LogoSAP.vue'
import BreadcrumbView from '@/components/BreadcrumbView.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiTab from '@/components/ui/atoms/tab/UiTab.vue'
import UiLoading from '@/components/UiLoading.vue'
import AdministrativeCard from '@/components/vendor/cards/AdministrativeCard.vue'
import LicenseCard from '@/components/vendor/cards/LicenseCard.vue'
import PaymentCard from '@/components/vendor/cards/PaymentCard.vue'
import { useApprovalStore } from '@/stores/vendor/approval'
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useLoginStore } from '@/stores/views/login'

const route = useRoute()
const userStore = useLoginStore()
const approvalStore = useApprovalStore()
const loading = ref<boolean>(false)
const error = ref<string | null>(null)

const getVendor = async () => {
  loading.value = true
  error.value = null
  try {
    await approvalStore.getVendorById(Number(route.params.id))
  } catch (err) {
    if (err instanceof Error) {
      error.value = axios.isAxiosError(err)
        ? (error.value = err.response?.data.result?.message)
        : 'Failed to fetch vendor data.'
    }
  } finally {
    loading.value = false
  }
}

const vendorId = ref('')

if (route.params.id) {
  vendorId.value = route.params.id as string
} else {
  vendorId.value = userStore.userData?.profile?.profileId.toString()
}
onMounted(() => {
  approvalStore.getMatrix({
    vendorId: Number(route.params.id),
  })
  getVendor()
})
</script>
<template>
  <BreadcrumbView title="Approval Verifikasi Vendor" :routes="[
    { name: 'Approval', to: '/vendor-approval' },
    { name: 'Approval Verifikasi Vendor', to: '/vendor-approval' },
  ]" />
  <UiTab :items="[{ label: 'Detail Information Vendor ', value: 'detail' }]" model-value="" item-class="text-primary" />
  <!-- Loading -->
  <div class="flex my-5 items-center justify-center" v-if="loading">
    <UiLoading size="lg" />
  </div>

  <!-- Error -->
  <div class="flex my-5 items-center justify-center" v-else-if="error">
    <span class="text-red-500 font-medium text-lg">{{ error }}</span>
  </div>

  <!-- No data -->
  <div class="flex my-5 items-center justify-center" v-else-if="approvalStore.vendorDetail.length === 0">
    <span class="text-gray-700 font-medium text-lg">No data</span>
  </div>

  <!-- show data -->
  <div class="space-y-5" v-else>
    <div v-if="approvalStore.vendorDetail[0].approvalStatus === 1"
      class="rounded-lg border border-blue-200 bg-blue-50 p-4 flex items-center gap-4">
      <LogoApproved />
      <div>
        <h2 class="font-semibold text-base text-gray-800">Successfully Approved</h2>
        <p class="font-medium text-2sm text-gray-600">
          Vendor has been successfully approved. Next, send the invoice to SAP for processing.
        </p>
      </div>
    </div>

    <div v-if="approvalStore.vendorDetail[0].approvalStatus === 3"
      class="rounded-lg border border-blue-200 bg-blue-50 p-4 flex items-center gap-4">
      <LogoSAP class="w-16 h-auto" />
      <div>
        <h2 class="font-semibold text-base text-gray-800">Successfully Send to SAP</h2>
        <p class="font-medium text-2sm text-gray-600">Vendor has been successfully send to SAP.</p>
      </div>
    </div>

    <div v-if="approvalStore.vendorDetail[0].approvalStatus === 2"
      class="rounded-lg border border-red-500 bg-red-50 p-4 flex items-center gap-4">
      <LogoRejected class="w-[34px]" />
      <div>
        <h2 class="font-semibold text-base text-gray-800">Rejected</h2>
        <p class="font-medium text-2sm text-red-500">
          The vendor has been reviewed and rejected based on the evaluation criteria
        </p>
      </div>
    </div>
    <AdministrativeCard :vendorId="vendorId" />
    <LicenseCard :vendorId="vendorId" />
    <PaymentCard :vendorId="vendorId" />
    <div class="flex justify-end">
      <UiButton :outline="true" @click="$router.back()">
        <UiIcon name="black-left" variant="duotone" />
        <span>Back</span>
      </UiButton>
    </div>
  </div>
</template>

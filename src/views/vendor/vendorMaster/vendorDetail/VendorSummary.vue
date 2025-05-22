<script lang="ts" setup>
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import VendorAdministrasiCard from '@/components/vendor/vendorAdministrasiCard/VendorAdministrasiCard.vue'
import VendorIzinUsahaCard from '@/components/vendor/vendorIzinUsahaCard/VendorIzinUsahaCard.vue'
import VendorPaymentInformationCard from '@/components/vendor/vendorPaymentInformationCard/VendorPaymentInformationCard.vue'
import { useVendorStore, useVerificationDetailStore } from '@/stores/vendor/vendor'
import axios from 'axios'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const vendorStore = useVendorStore()
const verificationStore = useVerificationDetailStore()
const route = useRoute()
const loading = ref(false)
const error = ref('')

const isReady = computed(() => {
  const data = verificationStore.data

  if (
    data.some(
      (item) => item.verificationType === 'Administration approval' && item.status === 'Approved',
    ) &&
    data.some(
      (item) => item.verificationType === 'Izin usaha approval' && item.status === 'Approved',
    ) &&
    data.some((item) => item.verificationType === 'Payment approval' && item.status === 'Approved')
  ) {
    return true
  }

  return false
})

const handleSendToApproval = async () => {
  loading.value = true
  error.value = ''

  try {
    await vendorStore.verifyLegal({
      vendorId: Number(route.params.id),
      dataCategoryId: 4,
      isVerified: true,
      verifiedNote: '',
      isReject: false,
      rejectedNote: '',
      verificatorName: 'Susi Susanti',
      createdBy: 'admin',
      position: 'admin',
    })
  } catch (err) {
    if (err instanceof Error) {
      if (axios.isAxiosError(err)) {
        error.value = err.response?.data.result.message
      }
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  verificationStore.getData(Number(route.params.id))
})
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
        :disabled="!isReady || verificationStore.loading || loading"
        variant="primary"
        @click="handleSendToApproval"
      >
        <span v-if="loading">Progress</span>
        <template v-else>
          <UiIcon name="paper-plane" />
          Send Approval
        </template>
      </UiButton>
    </div>
  </div>
</template>

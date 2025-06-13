<script lang="ts" setup>
import UiModal from '@/components/modal/UiModal.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import { useVendorStore, useVerificationDetailStore } from '@/stores/vendor/vendor'
import axios from 'axios'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import successImg from '@/assets/success.svg'
import AdministrativeCard from '@/components/vendor/cards/AdministrativeCard.vue'
import LicenseCard from '@/components/vendor/cards/LicenseCard.vue'
import PaymentCard from '@/components/vendor/cards/PaymentCard.vue'

const vendorStore = useVendorStore()
const verificationStore = useVerificationDetailStore()

const route = useRoute()
const loading = ref(false)
const error = ref('')

const modalVerifySuccess = ref(false)

const isReady = computed(() => {
  const data = verificationStore.data

  if (!data) return false

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

const isVerified = computed(() =>
  verificationStore.data.some(
    (item) => item.verificationType === 'Vendor approval' && item.status === 'Approved',
  ),
)

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
    modalVerifySuccess.value = true
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

const handleModalClose = () => {
  verificationStore.getData(Number(route.params.id))
}
</script>
<template>
  <div class="space-y-5">
    <!-- Card administrasi -->
    <AdministrativeCard />

    <!-- card data izin usaha -->
    <LicenseCard />

    <!-- card payment information -->
    <PaymentCard />

    <div class="flex justify-end">
      <UiButton
        :disabled="!isReady || verificationStore.loading || loading || isVerified"
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

    <UiModal
      v-if="modalVerifySuccess"
      v-model="modalVerifySuccess"
      size="sm"
      @update:model-value="handleModalClose"
    >
      <img :src="successImg" alt="success" class="mx-auto mb-3" />
      <h3 class="font-medium text-lg text-gray-800 text-center">Vendor Verified</h3>
      <p class="text-gray-600 text-center mb-3">Vendor has been successfully verified</p>
    </UiModal>
  </div>
</template>

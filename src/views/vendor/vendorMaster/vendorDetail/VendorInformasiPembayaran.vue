<script setup lang="ts">
import UiModal from '@/components/modal/UiModal.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import VendorPaymentInformationCard from '@/components/vendor/vendorPaymentInformationCard/VendorPaymentInformationCard.vue'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import successImg from '@/assets/success.svg'
import { useVendorStore, useVerificationDetailStore } from '@/stores/vendor/vendor'
import axios from 'axios'

const vendorStore = useVendorStore()
const vendorVerifStore = useVerificationDetailStore()
const router = useRouter()
const route = useRoute()
const modalReject = ref(false)
const modalRejectSuccess = ref(false)
const modalVerify = ref(false)
const modalVerifySuccess = ref(false)
const loading = ref(false)
const error = ref('')

const reason = ref('')
const notes = ref('')
const inputError = ref<string[]>([])

const isDisabled = computed(() =>
  vendorVerifStore.data.some((item) => item.verificationType === 'Payment approval'),
)

const handleVerify = async () => {
  loading.value = true
  error.value = ''

  try {
    await vendorStore.verifyLegal({
      vendorId: Number(route.params.id),
      dataCategoryId: 3,
      isVerified: true,
      verifiedNote: notes.value,
      isReject: false,
      rejectedNote: '',
      createdBy: '',
      verificatorName: 'Susi Susanti',
      position: 'Admin',
    })
    modalVerify.value = false
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

const handleReject = async () => {
  if (!reason.value) {
    inputError.value.push('reason')
    return
  }

  loading.value = true
  error.value = ''

  try {
    await vendorStore.verifyLegal({
      vendorId: Number(route.params.id),
      dataCategoryId: 3,
      isVerified: false,
      verifiedNote: '',
      isReject: true,
      rejectedNote: reason.value,
      createdBy: '',
      verificatorName: 'Susi Susanti',
      position: 'Admin',
    })

    modalReject.value = false
    modalRejectSuccess.value = true
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
  vendorVerifStore.getData(Number(route.params.id))
}
</script>

<template>
  <div class="space-y-5">
    <VendorPaymentInformationCard />
    <div class="flex gap-3">
      <UiButton :outline="true" @click="router.go(-1)">
        <UiIcon name="black-left" variant="duotone" />
        <span> Back </span>
      </UiButton>

      <UiButton
        :outline="true"
        variant="danger"
        class="ml-auto"
        @click="modalReject = true"
        :disabled="isDisabled"
      >
        <UiIcon name="cross-circle" variant="duotone" />
        <span> Reject </span>
      </UiButton>
      <UiButton :disabled="isDisabled" @click="modalVerify = true">
        <UiIcon name="check-squared" variant="duotone" />
        <span> Verify </span>
      </UiButton>
    </div>
  </div>

  <UiModal v-model="modalReject" title="Reject Data Informasi Pembayaran" size="sm">
    <form @submit.prevent="handleReject">
      <div class="relative mb-3">
        <label
          for="reason"
          class="absolute bg-white top-0 left-0 ml-2 -mt-2 text-sm text-gray-600 px-1"
          >Reason <span class="text-danger">*</span></label
        >
        <textarea id="reason" class="textarea" rows="6" v-model="reason" required></textarea>
      </div>
      <div v-if="inputError.includes('reason')" class="text-xs text-danger">Reason is required</div>
      <div class="my-3 text-danger text-xs italic">
        * Rejecting this section will automatically reject all other submitted data from the vendor.
        Do you wish to proceed?
      </div>
      <div class="flex gap-3">
        <UiButton
          class="flex-1 justify-center"
          :outline="true"
          type="button"
          @click="modalReject = !modalReject"
        >
          <UiIcon name="black-left-line" variant="duotone" />
          <span>Cancel</span>
        </UiButton>
        <UiButton class="flex-1 justify-center" variant="danger" :disabled="loading">
          <span v-if="loading">Progress</span>
          <template v-else>
            <UiIcon name="cross-circle" variant="duotone" />
            <span>Reject</span>
          </template>
        </UiButton>
      </div>
    </form>
  </UiModal>

  <UiModal
    v-if="modalVerify"
    v-model="modalVerify"
    title="Verify Data Informasi Pembayaran"
    size="sm"
  >
    <form @submit.prevent="handleVerify">
      <div class="relative mb-3">
        <label
          for="notes"
          class="absolute bg-white top-0 left-0 ml-2 -mt-2 text-sm text-gray-600 px-1"
          >Notes</label
        >
        <textarea id="notes" class="textarea" rows="6" v-model="notes"></textarea>
      </div>
      <div class="flex gap-3">
        <UiButton
          class="flex-1 justify-center"
          :outline="true"
          type="button"
          @click="modalVerify = !modalVerify"
        >
          <UiIcon name="black-left-line" variant="duotone" />
          <span>Cancel</span>
        </UiButton>
        <UiButton class="flex-1 justify-center" variant="primary" :disabled="loading">
          <span v-if="loading">Progress</span>
          <template v-else>
            <UiIcon name="check-circle" variant="duotone" />
            <span>Verify</span>
          </template>
        </UiButton>
      </div>
    </form>
  </UiModal>

  <UiModal v-model="modalRejectSuccess" size="sm" @update:model-value="handleModalClose">
    <img :src="successImg" alt="success" class="mx-auto mb-3" />
    <h3 class="font-medium text-lg text-gray-800 text-center">Data Informasi Pembayran Rejected</h3>
    <p class="text-gray-600 text-center mb-3">
      Data Informasi Pembayaran has been successfully Rejected
    </p>
  </UiModal>

  <UiModal v-model="modalVerifySuccess" size="sm" @update:model-value="handleModalClose">
    <img :src="successImg" alt="success" class="mx-auto mb-3" />
    <h3 class="font-medium text-lg text-gray-800 text-center">
      Data Informasi Pembayaran verified
    </h3>
    <p class="text-gray-600 text-center mb-3">
      Data Informasi Pembayaran has been successfully verified
    </p>
  </UiModal>
</template>

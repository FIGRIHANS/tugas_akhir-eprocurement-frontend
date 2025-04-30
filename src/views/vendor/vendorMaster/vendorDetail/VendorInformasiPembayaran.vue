<script setup lang="ts">
import UiModal from '@/components/modal/UiModal.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import VendorPaymentInformationCard from '@/components/vendor/vendorPaymentInformationCard/VendorPaymentInformationCard.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import successImg from '@/assets/success.svg'
import { useVendorStore } from '@/stores/vendor/vendor'

const router = useRouter()
const modalReject = ref(false)
const modalRejectSuccess = ref(false)
const modalVerify = ref(false)
const modalVerifySuccess = ref(false)

const reason = ref('')
const notes = ref('')
const vendorStore = useVendorStore()

const handleVerify = () => {
  vendorStore.isBankVerified = true
  modalVerify.value = false
  modalVerifySuccess.value = true
}

const handleReject = () => {
  modalReject.value = false
  modalRejectSuccess.value = true
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

      <UiButton :outline="true" variant="danger" class="ml-auto" @click="modalReject = true">
        <UiIcon name="cross-circle" variant="duotone" />
        <span> Reject </span>
      </UiButton>
      <UiButton :disabled="vendorStore.isBankVerified" @click="modalVerify = true">
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
        <UiButton class="flex-1 justify-center" variant="danger">
          <UiIcon name="cross-circle" variant="duotone" />
          <span>Reject</span>
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
        <UiButton class="flex-1 justify-center" variant="primary">
          <UiIcon name="check-circle" variant="duotone" />
          <span>Verify</span>
        </UiButton>
      </div>
    </form>
  </UiModal>

  <UiModal v-model="modalRejectSuccess" size="sm">
    <img :src="successImg" alt="success" class="mx-auto mb-3" />
    <h3 class="font-medium text-lg text-gray-800 text-center">Data Informasi Pembayran Rejected</h3>
    <p class="text-gray-600 text-center mb-3">
      Data Informasi Pembayaran has been successfully Rejected
    </p>
  </UiModal>

  <UiModal v-model="modalVerifySuccess" size="sm">
    <img :src="successImg" alt="success" class="mx-auto mb-3" />
    <h3 class="font-medium text-lg text-gray-800 text-center">
      Data Informasi Pembayaran verified
    </h3>
    <p class="text-gray-600 text-center mb-3">
      Data Informasi Pembayaran has been successfully verified
    </p>
  </UiModal>
</template>

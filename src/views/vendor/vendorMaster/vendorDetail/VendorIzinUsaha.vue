<script setup lang="ts">
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import VendorIzinUsahaCard from '@/components/vendor/vendorIzinUsahaCard/VendorIzinUsahaCard.vue'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import successImg from '@/assets/success.svg'
import UiModal from '@/components/modal/UiModal.vue'
import { useVendorStore } from '@/stores/vendor/vendor'
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const modalReject = ref(false)
const modalRejectSuccess = ref(false)
const modalVerify = ref(false)
const modalVerifySuccess = ref(false)
const reason = ref('')
const notes = ref('')
const loading = ref(false)
const error = ref('')
const inputError = ref<string[]>([])

const vendorStore = useVendorStore()

const handleVerify = async () => {
  loading.value = true
  error.value = ''

  try {
    await vendorStore.verifyLegal({
      vendorId: Number(route.params.id),
      dataCategoryId: 2,
      isVerified: true,
      verifiedNote: notes.value,
      isReject: false,
      rejectedNote: '',
      createdBy: 'Admin',
      position: 'Admin',
      verificatorName: 'Susi Susanti',
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
      dataCategoryId: 2,
      isVerified: false,
      verifiedNote: '',
      isReject: true,
      rejectedNote: reason.value,
      createdBy: 'Admin',
      position: 'Admin',
      verificatorName: 'Susi Susanti',
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
</script>

<template>
  <div class="space-y-5">
    <VendorIzinUsahaCard />
    <div class="flex gap-3">
      <UiButton :outline="true" @click="router.go(-1)">
        <UiIcon name="black-left" variant="duotone" />
        <span> Back </span>
      </UiButton>

      <UiButton :outline="true" variant="danger" class="ml-auto" @click="modalReject = true">
        <UiIcon name="cross-circle" variant="duotone" />
        <span> Reject </span>
      </UiButton>
      <UiButton @click="modalVerify = true">
        <UiIcon name="check-squared" variant="duotone" />
        <span> Verify </span>
      </UiButton>
    </div>
  </div>

  <UiModal v-model="modalReject" title="Reject Data Izin Usaha" size="sm">
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

  <UiModal v-if="modalVerify" v-model="modalVerify" title="Verify Data Administrasi" size="sm">
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

  <UiModal v-model="modalRejectSuccess" size="sm">
    <img :src="successImg" alt="success" class="mx-auto mb-3" />
    <h3 class="font-medium text-lg text-gray-800 text-center">Data Izin Usaha Rejected</h3>
    <p class="text-gray-600 text-center mb-3">Data Izin Usaha has been successfully Rejected</p>
  </UiModal>

  <UiModal v-model="modalVerifySuccess" size="sm">
    <img :src="successImg" alt="success" class="mx-auto mb-3" />
    <h3 class="font-medium text-lg text-gray-800 text-center">Data Izin Usaha verified</h3>
    <p class="text-gray-600 text-center mb-3">Data Izin Usaha has been successfully verified</p>
  </UiModal>
</template>

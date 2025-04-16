<script setup lang="ts">
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import VendorIzinUsahaCard from '@/components/vendor/vendorIzinUsahaCard/VendorIzinUsahaCard.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import successImg from '@/assets/success.svg'
import UiModal from '@/components/modal/UiModal.vue'
import UiTextArea from '@/components/ui/atoms/text-area/UiTextArea.vue'

const router = useRouter()
const modalReject = ref(false)
const modalSuccess = ref(false)

const reason = ref('')

const handleReject = () => {
  modalReject.value = false
  modalSuccess.value = true
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
      <UiButton>
        <UiIcon name="check-squared" variant="duotone" />
        <span> Verify </span>
      </UiButton>
    </div>
  </div>

  <UiModal v-model="modalReject" title="Reject Data Izin Usaha" size="sm">
    <form @submit.prevent="handleReject">
      <UiTextArea label="Reason" v-model="reason" />
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

  <UiModal v-model="modalSuccess" size="sm">
    <img :src="successImg" alt="success" class="mx-auto mb-3" />
    <h3 class="font-medium text-lg text-gray-800 text-center">Data Izin Usaha Rejected</h3>
    <p class="text-gray-600 text-center mb-3">Data Izin Usaha has been successfully Rejected</p>
  </UiModal>
</template>

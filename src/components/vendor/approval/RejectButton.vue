<script setup lang="ts">
import { ref } from 'vue'
import successImg from '@/assets/success.svg'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiModal from '@/components/modal/UiModal.vue'
import UiTextArea from '@/components/ui/atoms/text-area/UiTextArea.vue'

defineProps<{ id: string | number; nama: string }>()
const modalReject = ref(false)
const modalSuccess = ref(false)
const reason = ref('')

const handleReject = () => {
  modalReject.value = false
  modalSuccess.value = true
}
</script>
<template>
  <UiButton
    size="sm"
    :icon="true"
    variant="danger"
    :outline="true"
    @click="modalReject = !modalReject"
  >
    <UiIcon name="cross-circle" variant="duotone" />
  </UiButton>
  <UiModal v-model="modalReject" :title="`Reject vendor ${nama}`" size="sm">
    <form @submit.prevent="handleReject" class="space-y-3">
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
    <h3 class="font-medium text-lg text-gray-800 text-center">Vendor Rejected</h3>
    <p class="text-gray-600 text-center mb-3">Vendor has been successfully Rejected</p>
  </UiModal>
</template>

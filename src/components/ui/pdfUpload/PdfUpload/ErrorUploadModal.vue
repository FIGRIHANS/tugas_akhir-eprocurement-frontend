<template>
  <div class="modal" data-modal="true" id="error_upload_modal">
    <div class="modal-content max-w-[500px] modal-center-y">
      <div class="modal-body flex flex-col justify-center items-center gap-[30px] p-[40px]">
        <FailedLogo />
        <div>
          <p class="text-lg font-medium text-center">Upload File Failed</p>
          <p class="text-[13px] mt-[14px] text-center">
            Your file couldn’t be uploaded because:
          </p>
          <p class="text-[13px] mt-[14px] text-center">
            {{ errorMessage }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue'
import { KTModal } from '@/metronic/core'
import FailedLogo from './FailedLogo.vue'

defineProps<{
  errorMessage: string
}>()

const emits = defineEmits(['afterClose'])

const hideModal = () => {
  const idModal = document.querySelector('#error_upload_modal')
  const modal = KTModal.getInstance(idModal as HTMLElement)
  modal.hide()
  emits('afterClose')
}

onMounted(() => {
  document.getElementById('error_upload_modal')?.addEventListener('click', hideModal)
})

onUnmounted(() => {
  document.getElementById('error_upload_modal')?.removeEventListener('click', hideModal)
})
</script>

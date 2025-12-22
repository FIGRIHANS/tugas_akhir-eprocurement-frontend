<template>
  <div class="modal" data-modal="true" id="update_payment_status_modal">
    <div class="modal-content modal-center-y max-w-[500px]">
      <div class="modal-body p-[40px] flex flex-col gap-[30px] items-center">
        <ModalSuccessLogo />
        <div class="text-center font-inter">
          <p class="text-lg font-medium">Payment Status Has Been Updated</p>
          <p class="text-[13px] font-normal">The payment status has been updated successfully.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue'
import { KTModal } from '@/metronic/core'
import ModalSuccessLogo from '@/assets/svg/ModalSuccessLogo.vue'

interface Props {
  isLoading: boolean
}

interface Emits {
  (e: 'close'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const hideModal = () => {
  const idModal = document.querySelector('#update_payment_status_modal')
  const modal = KTModal.getInstance(idModal as HTMLElement)
  modal.hide()
  emit('close')
}

onMounted(() => {
  document.getElementById('update_payment_status_modal')?.addEventListener('click', hideModal)
})

onUnmounted(() => {
  document.getElementById('update_payment_status_modal')?.removeEventListener('click', hideModal)
})
</script>

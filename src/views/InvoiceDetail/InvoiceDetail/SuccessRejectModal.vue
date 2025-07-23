<template>
  <div class="modal" data-modal="true" id="success_reject_modal">
    <div class="modal-content modal-center-y max-w-[500px]">
      <div class="modal-body p-[40px] flex flex-col gap-[30px] items-center">
        <ModalSuccessLogo />
        <div class="text-center font-inter">
          <p class="text-lg font-medium">Invoice Has Been Rejected</p>
          <p class="text-[13px] font-normal">The invoice has been rejected successfully.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue'
import { KTModal } from '@/metronic/core'
import ModalSuccessLogo from '@/assets/svg/ModalSuccessLogo.vue'

const emits = defineEmits(['afterClose'])

const hideModal = () => {
  const idModal = document.querySelector('#success_reject_modal')
  const modal = KTModal.getInstance(idModal as HTMLElement)
  modal.hide()
  emits('afterClose')
}

onMounted(() => {
  document.getElementById('success_reject_modal')?.addEventListener('click', hideModal)
})

onUnmounted(() => {
  document.getElementById('success_reject_modal')?.removeEventListener('click', hideModal)
})
</script>

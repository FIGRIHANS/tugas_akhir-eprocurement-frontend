<template>
  <div class="modal" data-modal="true" id="error_document_number_modal">
    <div class="modal-content modal-center-y max-w-[500px]">
      <div class="modal-body p-[40px] flex flex-col gap-[30px] items-center">
        <ModalRejectLogo />
        <div class="text-center font-inter">
          <p class="text-lg font-medium">Invoice Document Number Already Exists</p>
          <p class="text-[13px] font-normal">The Invoice Document Number you've entered is already registered in the system. Please use a different number.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue'
import { KTModal } from '@/metronic/core'
import ModalRejectLogo from '@/assets/svg/ModalRejectLogo.vue'

const emits = defineEmits(['afterClose'])

const hideModal = () => {
  const idModal = document.querySelector('#error_document_number_modal')
  const modal = KTModal.getInstance(idModal as HTMLElement)
  modal.hide()
  emits('afterClose')
}

onMounted(() => {
  document.getElementById('error_document_number_modal')?.addEventListener('click', hideModal)
})

onUnmounted(() => {
  document.getElementById('error_document_number_modal')?.removeEventListener('click', hideModal)
})
</script>

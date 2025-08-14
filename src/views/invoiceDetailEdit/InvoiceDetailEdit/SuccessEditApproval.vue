<template>
  <div class="modal" data-modal="true" id="success_data_edit_modal">
    <div class="modal-content modal-center-y max-w-[500px]">
      <div class="modal-body p-[40px] flex flex-col gap-[30px] items-center">
        <ModalSuccessLogo />
        <div class="text-center font-inter">
          <p class="text-lg font-medium">Data edit successfully saved</p>
          <p class="text-[13px] font-normal">The data you edited has been successfully saved.</p>
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
  const idModal = document.querySelector('#success_data_edit_modal')
  const modal = KTModal.getInstance(idModal as HTMLElement)
  modal.hide()
  emits('afterClose')
}

onMounted(() => {
  document.getElementById('success_data_edit_modal')?.addEventListener('click', hideModal)
})

onUnmounted(() => {
  document.getElementById('success_data_edit_modal')?.removeEventListener('click', hideModal)
})
</script>

<template>
  <div class="modal" data-modal="true" id="error_submission_modal">
    <div class="modal-content modal-center-y max-w-[500px]">
      <div class="modal-body p-[40px] flex flex-col gap-[30px] items-center">
        <ModalRejectLogo />
        <div class="text-center font-inter">
          <p class="text-lg font-medium">Submission Failed</p>
          <p class="text-[13px] font-normal text-gray-700">We couldn't submit your invoice due to the following reason(s):</p>
          <p class="text-[13px] font-normal text-gray-700">{{ invoiceApi.errorMessageSubmission }}</p>
          <p class="text-[13px] font-normal text-gray-700">Please correct the errors and try again.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue'
import { KTModal } from '@/metronic/core'
import ModalRejectLogo from '@/assets/svg/ModalRejectLogo.vue'
import { useInvoiceSubmissionStore } from '@/stores/views/invoice/submission'

const emits = defineEmits(['afterClose'])

const invoiceApi = useInvoiceSubmissionStore()

const hideModal = () => {
  const idModal = document.querySelector('#error_submission_modal')
  const modal = KTModal.getInstance(idModal as HTMLElement)
  modal.hide()
  emits('afterClose')
}

onMounted(() => {
  document.getElementById('error_submission_modal')?.addEventListener('click', hideModal)
})

onUnmounted(() => {
  document.getElementById('error_submission_modal')?.removeEventListener('click', hideModal)
})
</script>

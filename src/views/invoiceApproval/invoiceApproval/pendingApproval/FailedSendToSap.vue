<template>
  <div class="modal" data-modal="true" id="failed_send_sap_modal">
    <div class="modal-content max-w-[500px] modal-center-y">
      <div class="modal-body flex flex-col justify-center items-center gap-[30px] p-[40px]">
        <FailedLogo />
        <div>
          <p class="text-lg font-medium text-center">Failed to Send to SAP</p>
          <p class="text-[13px] mt-[14px] text-center">
            <!-- The invoice could not be sent to SAP due to a system error or invalid data. -->
            The invoice could not be sent to SAP due to the following reason:
            {{ verificationApi.errorMessageSap }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue'
import { KTModal } from '@/metronic/core'
import FailedLogo from './FailedSendToSap/FailedLogo.vue'
import { useInvoiceVerificationStore } from '@/stores/views/invoice/verification'

const emits = defineEmits(['afterClose'])
const verificationApi = useInvoiceVerificationStore()

const hideModal = () => {
  const idModal = document.querySelector('#failed_send_sap_modal')
  const modal = KTModal.getInstance(idModal as HTMLElement)
  modal.hide()
  emits('afterClose')
}

onMounted(() => {
  document.getElementById('failed_send_sap_modal')?.addEventListener('click', hideModal)
})

onUnmounted(() => {
  document.getElementById('failed_send_sap_modal')?.removeEventListener('click', hideModal)
})
</script>

<template>
  <div class="modal" data-modal="true" id="sap_sync_required_modal">
    <div class="modal-content modal-center-y max-w-[500px]">
      <div class="modal-body p-[40px] flex flex-col gap-[30px] items-center">
        <!-- Warning Icon -->
        <div class="flex items-center justify-center w-[80px] h-[80px] rounded-full bg-warning/10">
          <i class="ki-filled ki-information text-warning text-5xl"></i>
        </div>

        <div class="text-center font-inter">
          <p class="text-lg font-medium mb-2">SAP Synchronize Required</p>
          <p class="text-[13px] font-normal text-gray-600">
            Please perform SAP Synchronize first before updating payment status.
          </p>
        </div>

        <button class="btn btn-primary w-full" @click="hideModal">OK, I Understand</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue'
import { KTModal } from '@/metronic/core'

const hideModal = () => {
  const idModal = document.querySelector('#sap_sync_required_modal')
  const modal = KTModal.getInstance(idModal as HTMLElement)
  modal?.hide()
}

onMounted(() => {
  // Auto-hide when clicking outside
  const modalElement = document.getElementById('sap_sync_required_modal')
  modalElement?.addEventListener('click', (e) => {
    if (e.target === modalElement) {
      hideModal()
    }
  })
})

onUnmounted(() => {
  const modalElement = document.getElementById('sap_sync_required_modal')
  modalElement?.removeEventListener('click', hideModal)
})
</script>

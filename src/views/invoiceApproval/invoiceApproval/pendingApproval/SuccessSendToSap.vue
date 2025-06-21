<template>
  <div class="modal" data-modal="true" id="success_send_sap_modal">
    <div class="modal-content max-w-[500px] modal-center-y">
      <div class="modal-body flex flex-col justify-center items-center gap-[30px] p-[40px]">
        <SapLogo />
        <div>
          <p class="text-lg font-medium text-center">Invoice Successfully Send to SAP</p>
          <p class="text-[13px] mt-[14px] text-center">
            The invoice has been successfully approved. Next, send the invoice to SAP for processing.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SapLogo from './SuccessSendToSap/SapLogo.vue'
</script>

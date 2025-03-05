<template>
  <div class="modal" data-modal="true" id="success_invoice_modal">
    <div class="modal-content modal-center-y max-w-[500px]">
      <div class="modal-body p-[40px] flex flex-col gap-[30px] items-center">
        <ThumbnailSvg />
        <div class="text-center font-inter">
          <p class="text-lg font-medium">Invoice Successfully Submitted</p>
          <p class="text-[13px] font-normal">The invoice you sent is currently under review. Further information will be provided via notification.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ThumbnailSvg from './ModalSuccess/ThumbnailSvg.vue'
</script>

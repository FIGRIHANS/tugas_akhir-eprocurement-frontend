<template>
  <div class="modal" data-modal="true" id="success_verif_modal">
    <div class="modal-content modal-center-y max-w-[500px]">
      <div class="modal-body p-[40px] flex flex-col gap-[30px] items-center">
        <ModalSuccessLogo />
        <div class="text-center font-inter">
          <p class="text-lg font-medium">Invoice Has Been {{ statusCode === 2 || statusCode === 4 ? 'Approved' : 'Verified' }}</p>
          <p class="text-[13px] font-normal">The invoice has been {{ statusCode === 2 || statusCode === 4 ? 'approved' : 'verified' }} successfully.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ModalSuccessLogo from '@/assets/svg/ModalSuccessLogo.vue'

defineProps<{
  statusCode: number
}>()
</script>

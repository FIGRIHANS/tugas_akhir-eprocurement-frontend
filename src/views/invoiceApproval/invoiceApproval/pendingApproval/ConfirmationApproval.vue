<template>
  <div class="modal" data-modal="true" id="confirm_approval_modal">
    <div class="modal-content max-w-[500px] modal-center-y">
      <div class="modal-body flex flex-col justify-center items-center gap-[30px] p-[40px]">
        <ImageConfirmation />
        <p class="text-lg font-medium">Apakah anda yakin akan melakukan approval?</p>
        <div class="flex gap-[16px] w-full">
          <button class="btn btn-outline btn-primary btn-lg w-full justify-center" data-modal-dismiss="true">
            <i class="ki-duotone ki-black-left-line"></i>
            Cancel
          </button>
          <button class="btn btn-primary btn-lg w-full justify-center" @click="goApprove">
            <i class="ki-duotone ki-check-circle"></i>
            Approve
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ImageConfirmation from './confirmationApproval/ImageConfirmation.vue'

const emits = defineEmits(['approve'])

const goApprove = () => {
  emits('approve')
}
</script>
